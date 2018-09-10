
var vessel = function (country) {
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 0, y: 0};
	this . speed_index = 0;
	this . diving_speed = 0;
	this . bearing_speed = 0;
	this . depth_target = 0;
	this . bearing_target = null;
	this . noise = 0;
	this . trail_delta = 0;
	this . selected = false;
	this . delete = false;
	this . trail = [];
	this . country = country;
	this . type = 'submarine';
	this . status = 'unknown';
	this . speeds = [0, 2, 8, 16, 24, 32, 40];
	this . noises = [0, 120, 480, 4800, 30000, 190000, 1200000];
	this . bearing_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . diving_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . tubes = [];
	this . inventory = {};
	this . ai = null;
	this . strength = 3;
	this . damage_delta = 0;
};

vessel . prototype . noiseLevel = function () {return this . noise;};

vessel . prototype . move = function (delta) {
	this . trail_delta --;
	if (this . trail_delta < 1) {this . trail . push ({x: this . position . x * 128, y: this . position . y * 128}); this . trail_delta = 2 / delta;}
	var bearing = (this . position . bearing - 90) * Math . PI / 180;
	var sdelta = delta / 3600;
	this . position . x += sdelta * (Math . cos (bearing) * this . speed . x - Math . sin (bearing) * this . speed . y);
	this . position . y += sdelta * (Math . cos (bearing) * this . speed . y + Math . sin (bearing) * this . speed . x);
	if (this . position . depth != this . depth_target) {
		var dspeed = this . diving_speed * delta;
		if (Math . abs (this . depth_target - this . position . depth) <= dspeed) {this . position . depth = this . depth_target; this . diving_speed = 0;}
		else {
			if (this . depth_target > this . position . depth) this . position . depth += dspeed;
			else this . position . depth -= dspeed;
		}
	}
	if (this . bearing_speed !== 0) {
		if (this . bearing_target !== null) {
			var bspeed = this . bearing_speed * delta;
			if (Math . abs (this . bearing_target - this . position . bearing) <= bspeed) {
				this . position . bearing = this . bearing_target;
				this . bearing_speed = 0;
				this . bearing_target = null;
			} else {
				if (this . bearing_target > this . position . bearing) this . position . bearing += bspeed;
				else this . position . bearing -= bspeed;
			}
		} else {
			this . position . bearing += this . bearing_speed * delta;
			while (this . position . bearing > 360) this . position . bearing -= 360;
			while (this . position . bearing < 0) this . position . bearing += 360;
		}
	}
	for (var ind in this . tubes) this . tubes [ind] . move (delta);
	if (this . damage_delta > 0) this . damage (this . damage_delta);
	if (this . strength <= 0) removeVessel (this);
};

vessel . prototype . simulate = function (delta) {this . move (delta);};

vessel . prototype . setSpeed = function (index) {
	switch (index) {
		case 'stop': index = 0; break;
		case 'slow': index = 1; break;
		case 'one quarter': index = 2; break;
		case 'half': index = 3; break;
		case 'three quarters': index = 4; break;
		case 'full': index = 5; break;
		case 'flank': index = 6; break;
		default: index = 0; break;
	}
	if (index < 0) index = 0; if (index >= this . speed . length) index = this . speeds . length - 1;
	this . noise = this . noises [index]; this . speed = {x: this . speeds [index], y: 0}; this . speed_index = index;
};

vessel . prototype . targetDepth = function (depth, index) {
	if (depth == null) return;
	if (index === undefined) index = this . diving_speeds . length - 1;
	this . diving_speed = this . diving_speeds [index];
	if (typeof (depth) === 'number') {this . depth_target = depth; return;}
	if (! Number . isNaN (Number (depth))) {this . depth_target = Number (depth); return;}
	switch (depth) {
		case 'surface': this . depth_target = 0; break;
		case 'periscope': this . depth_target = 60; break;
		case 'down thermal':
			for (var ind in thermoclines) {
				if (thermoclines [ind] . depth > this . position . depth) {this . depth_target = thermoclines [ind] . depth + 18; return;}
			}
			break;
		case 'up thermal':
			for (var ind = thermoclines . length - 1; ind >= 0; ind--) {
				if (thermoclines [ind] . depth < this . position . depth) {this . depth_target = thermoclines [ind] . depth - 18; return;}
			}
			break;
		default: break;
	}
};

vessel . prototype . targetBearing = function (target, index) {
	if (index === undefined) index = this . bearing_speeds . length - 1;
	this . bearing_speed = this . bearing_speeds [index];
	if (typeof (target) === 'number') this . bearing_target = target;
	else this . bearing_target = Math . atan2 (target . y - this . position . y, target . x - this . position . x) * 180 / Math . PI + 90;
	if (this . bearing_target < 0) this . bearing_target += 360;
	if (this . bearing_target > 180 + this . position . bearing) this . position . bearing += 360;
	if (this . bearing_target + 180 < this . position . bearing) this . position . bearing -= 360;
};

vessel . prototype . bearing = function (index) {this . bearing_speed = index >= 0 ? this . bearing_speeds [index] : - this . bearing_speeds [- index]; this . bearing_target = null;};

vessel . prototype . draw = function (ctx) {
	ctx . strokeStyle = 'white';
	ctx . lineWidth = 1;
	for (var ind in this . trail) {
		ctx . beginPath ();
		ctx . arc (this . trail [ind] . x * scaling, this . trail [ind] . y * scaling, 1, 0, 6.28);
		ctx . stroke ();
	}
	var x = this . position . x * scaling * 128, y = this . position . y * scaling * 128;
	if (this . status === 'simulation') {
		var bearing = (this . position . bearing - 90) * Math . PI / 180;
		var alpha = Math . cos (bearing) * 12, beta = Math . sin (bearing) * 12;
		ctx . lineCap = 'round'
		ctx . lineWidth = 4; ctx . moveTo (x - alpha, y - beta); ctx . lineTo (x + alpha, y + beta);
		ctx . stroke ();
		return;
	}
	switch (this . status) {
		case 'friend': ctx . fillStyle = ctx . strokeStyle = 'lime'; break;
		case 'enemy': ctx . fillStyle = ctx . strokeStyle = 'red'; break;
		case 'neutral': ctx . fillStyle = ctx . strokeStyle = 'yellow'; break;
		case 'unknown': ctx . fillStyle = ctx . strokeStyle = 'white'; break;
		case 'simulation': ctx . fillStyle = ctx . strokeStyle = 'gray'; break;
		default: ctx . strokeStyle = 'white'; break;
	}
	ctx . lineCap = 'square';
	ctx . lineWidth = this . selected ? 3 : 2;
	ctx . beginPath ();
	switch (this . type) {
		case 'surface':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, Math . PI * 2); ctx . fill ();
			switch (this . status) {
				case 'enemy': ctx . moveTo (x, y - 8); ctx . lineTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y); ctx . closePath (); break;
				case 'friend': ctx . arc (x, y, 8, 0, Math . PI * 2); break;
				default: ctx . moveTo (x + 8, y - 8); ctx . lineTo (x + 8, y + 8); ctx . lineTo (x - 8, y + 8); ctx . lineTo (x - 8, y - 8); ctx . closePath (); break;
			}
			break;
		case 'submarine':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, Math . PI * 2); ctx . fill ();
			switch (this . status) {
				case 'enemy': ctx . moveTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y); break;
				case 'friend': ctx . arc (x, y, 8, 0, Math . PI); break;
				default: ctx . moveTo (x + 8, y); ctx . lineTo (x + 8, y + 8); ctx . lineTo (x - 8, y + 8); ctx . lineTo (x - 8, y); break;
			}
			break;
		case 'torpedo':
			ctx . beginPath ();
			ctx . moveTo (x, y); ctx . lineTo (x, y - 8); ctx . moveTo (x - 4, y); ctx . lineTo (x + 4, y);
			if (this . status === 'friend') ctx . arc (x, y, 8, 0, Math . PI);
			else {ctx . moveTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y);}
			break;
		default: break;
	}
	ctx . stroke ();
};

vessel . prototype . checkStatusOf = function (vessel) {
	if (this === vessel) return 'simulation';
	if (friends [this . country] !== undefined && friends [this . country] . includes (vessel . country)) return 'friend';
	if (enemies [this . country] !== undefined && enemies [this . country] . includes (vessel . country)) return 'enemy';
	return 'neutral';
};

vessel . prototype . getVectorFrom = function (vessel) {return {x: vessel . position . x - this . position . x, y: vessel . position . y - this . position . y};};

vessel . prototype . getRelativePositionOf = function (vessel) {
	var vector = this . getVectorFrom (vessel);
	vector . distance = Math . sqrt (vector . x * vector . x + vector . y * vector . y);
	vector . bearing = Math . atan2 (vector . y, vector . x);
	return vector;
};

vessel . prototype . getNoiseOf = function (vessel) {
	var vector = this . getRelativePositionOf (vessel);
	noise = vessel . noiseLevel ();
	if (vector . distance > 0) noise /= vector . distance * 1852;
	for (var ind in thermoclines) {
		if ((thermoclines [ind] . depth - vessel . position . depth) * (thermoclines [ind] . depth - this . position . depth) < 0) noise *= thermoclines [ind] . attenuation;
	}
	var bearing = vector . bearing - (this . position . bearing - 90) * Math . PI / 180;
	while (bearing > Math . PI) bearing -= Math . PI + Math . PI;
	while (bearing < - Math . PI) bearing += Math . PI + Math . PI;
	noise = this . noiseLevelBearingCorrection (noise, bearing);
	return noise;
};

vessel . prototype . noiseLevelBearingCorrection = function (noise, bearing) {bearing = Math . cos (bearing * 0.5); return noise * bearing * bearing;};

vessel . prototype . fire = function () {
	if (selected === null) return;
	var torpedo = new Mark48 ('Fast');
	torpedo . position . x = this . position . x;
	torpedo . position . y = this . position . y;
	torpedo . position . depth = this . position . depth;
	torpedo . position . bearing = nauticalBearing (this . getRelativePositionOf (selected) . bearing);
	torpedo . setSpeed ('full');
	torpedo . ai = new torpedoAI (torpedo, selected);
	addVessel (torpedo);
};

vessel . prototype . damage_speed = function () {
	for (var ind in this . speeds) this . speeds [ind] *= 0.5;
	this . speed . x = this . speeds [this . speed_index];
};

vessel . prototype . damage = function (level) {
	this . strength -= level;
	if (level > Math . random ()) this . damage_speed ();
	if (level > 1.9) this . damage (level - 1.9);
};

var tube = function (speed) {
	if (speed === undefined) speed = 0.05;
	this . flooded = 0;
	this . flood_speed = speed;
	this . command = null; // flood, dry, fire, empty
	this . torpedo = null;
};

tube . prototype . move = function (delta) {
	switch (this . command) {
		case 'flood': if (this . flooded < 1) this . flooded += this . flood_speed * delta; else {this . flooded = 1; this . command = null;} break;
		case 'dry': if (this . flooded > 0) this . flooded -= this . flood_speed * delta; else {this . flooded = 0; this . command = null;} break;
		default: break;
	}
};

var build_tubes = function (amount, speed) {
	var tubes = [];
	for (var ind = 0; ind < amount; ind++) tubes . push (new tube (speed));
	return tubes;
};
