
var vessel_id = 0;

var vessel = function (country) {
	this . id = vessel_id ++;
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 0, y: 0};
	this . speed_index = 0;
	this . diving_speed = 0;
	this . bearing_speed = 0;
	this . depth_target = 0;
	this . bearing_target = null;
	this . noise = 0;
	this . trail_delta = 0;
	this . destroyed = false;
	this . trail = [];
	this . country = country;
	this . type = 'submarine';
	this . speeds = [0, 2, 8, 16, 24, 32, 40];
	this . noises = [0, 120, 480, 4800, 30000, 190000, 1200000];
	this . bearing_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . diving_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . tubes = [];
	this . inventory = {};
	this . ai = null;
	this . strength = 3;
	this . damage_delta = 0;
	this . test_depth = 1600;
	this . collapse_depth = 2400;
	this . target = null;
};

vessel . prototype . noiseLevel = function () {return this . noise;};

vessel . prototype . positionVessel = function (x, y, bearing, depth) {
	if (depth === undefined) depth = 0;
	if (bearing === undefined) bearing = 0;
	this . position = {x: x, y: y, bearing: bearing, depth: depth};
	this . depth_target = depth;
	this . bearing_target = bearing;
};

vessel . prototype . move = function (delta) {
	this . trail_delta -= delta;
	if (this . trail_delta < 1) {
		this . trail . push ({x: this . position . x * 128, y: this . position . y * 128});
		this . trail_delta = trail_delta;
		while (this . trail . length > trail_length) this . trail . shift ();
	}
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
		default: break;
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
		case 'test': this . depth_target = this . test_depth; break;
		case 'crush': case 'collapse': this . depth_target = this . collapse_depth; break;
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

vessel . prototype . draw = function (ctx, status) {
	ctx . strokeStyle = 'white';
	ctx . lineWidth = 1;
	for (var ind in this . trail) {
		ctx . beginPath ();
		ctx . arc (this . trail [ind] . x * scaling, this . trail [ind] . y * scaling, 1, 0, 6.28);
		ctx . stroke ();
	}
	var x = this . position . x * scaling * 128, y = this . position . y * scaling * 128;
	if (status === undefined) {
		var bearing = (this . position . bearing - 90) * Math . PI / 180;
		var alpha = Math . cos (bearing) * 12, beta = Math . sin (bearing) * 12;
		ctx . lineCap = 'round'
		ctx . lineWidth = 4; ctx . strokeStyle = 'gray';
		ctx . beginPath (); ctx . moveTo (x - alpha, y - beta); ctx . lineTo (x + alpha, y + beta); ctx . stroke ();
		return;
	}
	switch (status) {
		case 'friend': ctx . fillStyle = ctx . strokeStyle = 'lime'; break;
		case 'enemy': ctx . fillStyle = ctx . strokeStyle = 'red'; break;
		case 'neutral': ctx . fillStyle = ctx . strokeStyle = 'yellow'; break;
		case 'unknown': ctx . fillStyle = ctx . strokeStyle = 'white'; break;
		case 'simulation': ctx . fillStyle = ctx . strokeStyle = 'gray'; break;
		default: ctx . strokeStyle = 'white'; break;
	}
	ctx . lineCap = 'square';
	ctx . lineWidth = (selected && selected . vessel === this) ? 3 : 2;
	ctx . beginPath ();
	switch (this . type) {
		case 'surface':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, Math . PI * 2); ctx . fill ();
			switch (status) {
				case 'enemy': ctx . moveTo (x, y - 8); ctx . lineTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y); ctx . closePath (); break;
				case 'friend': ctx . arc (x, y, 8, 0, Math . PI * 2); break;
				default: ctx . moveTo (x + 8, y - 8); ctx . lineTo (x + 8, y + 8); ctx . lineTo (x - 8, y + 8); ctx . lineTo (x - 8, y - 8); ctx . closePath (); break;
			}
			break;
		case 'submarine':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, Math . PI * 2); ctx . fill ();
			switch (status) {
				case 'enemy': ctx . moveTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y); break;
				case 'friend': ctx . arc (x, y, 8, 0, Math . PI); break;
				default: ctx . moveTo (x + 8, y); ctx . lineTo (x + 8, y + 8); ctx . lineTo (x - 8, y + 8); ctx . lineTo (x - 8, y); break;
			}
			break;
		case 'torpedo':
			ctx . beginPath ();
			ctx . moveTo (x, y); ctx . lineTo (x, y - 8); ctx . moveTo (x - 4, y); ctx . lineTo (x + 4, y);
			if (status === 'friend') ctx . arc (x, y, 8, 0, Math . PI);
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

vessel . prototype . fire = function () {
	if (selected === null) return;
	var torpedo = new Mark48 (this, 'Fast');
	launch_torpedo (torpedo, this, selected . vessel);
};

var launch_torpedo = function (torpedo, vessel, target) {
	if (target !== undefined) torpedo . target = target;
	torpedo . position . x = vessel . position . x;
	torpedo . position . y = vessel . position . y;
	torpedo . position . depth = vessel . position . depth;
	torpedo . position . bearing = nauticalBearing (vessel . getRelativePositionOf (torpedo . target) . bearing);
	torpedo . setSpeed ('full');
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

var tube = function (vessel, settings, speed) {
	if (speed === undefined) speed = 0.05;
	this . flooded = 0;
	this . flood_speed = speed;
	this . command = null; // flood, dry, fire, empty
	this . torpedo = null;
	this . torpedoes = {};
	this . vessel = vessel;
	for (var ind in settings) {
		for (var sub in settings [ind]) this . torpedoes [settings [ind] [sub]] = vessel . inventory [ind];
	}
	this . display_element = null;
	//for (var ind in settings) this . torpedoes [settings [ind]] = inventory;
};

tube . prototype . move = function (delta) {
	switch (this . command) {
		case 'fire':
			if (this . flooded < 1) {
				this . flooded += this . flood_speed * delta;
				if (this . display_element !== null) {
					var blue = ('0' + Math . floor (this . flooded * 256) . toString (16)) . slice (-2);
					var others = ('0' + Math . floor (this . flooded * 128) . toString (16)) . slice (-2);
					this . display_element . bgColor = `#${others}${others}${blue}`;
				}
			} else {
				this . flooded = 1; this . command = null;
				if (this . torpedo !== null) launch_torpedo (this . torpedo, this . vessel);
				this . torpedo = null; this . flooded = 0;
				if (this . display_element !== null) {this . display_element . bgColor = 'black'; this . display_element . innerHTML = '';}
			}
			break;
		case 'flood':
			if (this . flooded < 1) {
				this . flooded += this . flood_speed * delta;
				if (this . display_element !== null) {
					var blue = ('0' + Math . floor (this . flooded * 256) . toString (16)) . slice (-2);
					var others = ('0' + Math . floor (this . flooded * 128) . toString (16)) . slice (-2);
					this . display_element . bgColor = `#${others}${others}${blue}`;
				}
			} else {
				this . flooded = 1; this . command = null;
				if (this . display_element !== null) this . display_element . bgColor = 'red';
			}
			break;
		//case 'dry': if (this . flooded > 0) this . flooded -= this . flood_speed * delta; else {this . flooded = 0; this . command = null;} break;
		case 'empty':
			this . flooded = 0; this . torpedo = null;
			if (this . display_element !== null) {this . display_element . bgColor = 'black'; this . display_element . innerHTML = '';}
			break;
		default: break;
	}
};

tube . prototype . load = function (selector) {
	if (this . flooded > 0 || this . torpedo !== null) return;
	if (selector === undefined) selector = Object . keys (this . torpedoes) [0];
	if (this . display_element !== null) this . display_element . innerHTML = '<img src="Mark48.png" width="100"/>';
	var inventory = this . torpedoes [selector];
	if (inventory == null || inventory . count < 1) return;
	inventory . count --;
	this . torpedo = new inventory . constructor (this . vessel, selector);
	if (this . display_element) update_inventory_info (this . vessel);
};

tube . prototype . fire = function (target, selector) {
	if (target === null) return;
	if (this . torpedo !== null) {
		if (this . flooded < 1) return;
		if (this . torpedo !== null) launch_torpedo (this . torpedo, this . vessel, target);
		this . torpedo = null; this . flooded = 0;
		if (this . display_element !== null) {this . display_element . bgColor = 'black'; this . display_element . innerHTML = '';}
		return;
	}
	this . load (selector); this . command = 'fire'; if (this . torpedo !== null) this . torpedo . target = target;
};

tube . prototype . flood = function () {if (this . torpedo === null) return; this . command = 'flood';};
tube . prototype . empty = function () {
	this . torpedo = null; this . command = null;
	if (this . display_element !== null) {this . display_element . bgColor = 'black'; this . display_element . innerHTML = '';}
};

var build_tubes = function (vessel, settings, amount, speed) {
	var tubes = [];
	for (var ind = 0; ind < amount; ind++) tubes . push (new tube (vessel, settings, speed));
	return tubes;
};

var sonar = function (vessel) {
	this . vessel = vessel;
	this . detected = {};
	this . detection_threshold = 1;
	this . identification_threshold = 2;
	this . tracking_threshold = 0.25;
};

sonar . prototype . detect = function () {
	for (var ind in vessels) {
		var vessel = vessels [ind];
		if (vessel !== this . vessel) {
			var noise = vessel . position . depth === 0 && this . vessel . position . depth <= 60 ? this . identification_threshold : this . getNoiseOf (vessel);
			if (this . detected . hasOwnProperty (vessel . id)) {
				if (noise < this . tracking_threshold) {if (selected && selected . vessel === vessel) selected = null; delete this . detected [vessel . id];}
				else if (this . detected [vessel . id] . status === 'unknown' && noise > this . identification_threshold) this . detected [vessel . id] . status = this . vessel . checkStatusOf (vessel);
			} else {
				if (noise >= this . detection_threshold)
					this . detected [vessel . id] = {status: noise >= this . identification_threshold ? this . vessel . checkStatusOf (vessel) : 'unknown', vessel: vessel, noise: noise};
			}
		}
	}
};

sonar . prototype . getNoiseOf = function (source) {
	var vector = this . vessel . getRelativePositionOf (source);
	var noise = source . noiseLevel ();
	if (vector . distance > 0) noise /= vector . distance * 1852;
	for (var ind in thermoclines) {
		if ((thermoclines [ind] . depth - source . position . depth) * (thermoclines [ind] . depth - this . vessel . position . depth) < 0) noise *= thermoclines [ind] . attenuation;
	}
	var bearing = vector . bearing - (this . vessel . position . bearing - 90) * Math . PI / 180;
	while (bearing > Math . PI) bearing -= Math . PI = Math . PI; while (bearing < - Math . PI) bearing += Math . PI + Math . PI;
	noise = this . noiseLevelBearingCorrection (noise, bearing);
	return noise;
};

sonar . prototype . noiseLevelBearingCorrection = function (noise, bearing) {bearing = Math . cos (bearing * 0.5); return noise * bearing * bearing;};

sonar . prototype . drawDetected = function (ctx) {
	for (var ind in this . detected) {
		var d = this . detected [ind];
		if (d . vessel . destroyed) delete this . detected [ind]; else d . vessel . draw (ctx, d . status);
	}
};
