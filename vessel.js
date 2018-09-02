
var triton = function (country) {
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 0, y: 0};
	this . diving_speed = 0;
	this . bearing_speed = 0;
	this . depth_target = 0;
	this . bearing_target = 0;
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
};

triton . prototype . noiseLevel = function () {return this . noise;};

triton . prototype . move = function (delta) {
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
	if (this . bearing_target != this . position . bearing) {
		var bspeed = this . bearing_speed * delta;
		if (Math . abs (this . bearing_target - this . position . bearing) <= bspeed) {this . position . bearing = this . bearing_target; this . bearing_speed = 0;}
		else {
			if (this . bearing_target > this . position . bearing) this . position . bearing += bspeed;
			else this . position . bearing -= bspeed;
		}
	}
};

triton . prototype . simulate = function (delta) {this . move (delta);};

triton . prototype . setSpeed = function (index) {
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
	if (index < 0) {this . noise = this . noises [0]; this . speed = {x: 0, y: 0}; return;}
	if (index >= this . speeds . length) {this . noise = this . noises [this . speeds . length - 1]; this . speed = {x: this . speeds [this . speeds . length - 1], y: 0}; return;}
	this . noise = this . noises [index]; this . speed = {x: this . speeds [index], y: 0};
};

triton . prototype . targetDepth = function (depth, index) {
	if (index === undefined) index = this . diving_speeds . length - 1;
	this . diving_speed = this . diving_speeds [index];
	if (typeof (depth) === 'number') {this . depth_target = depth; return;}
	switch (depth) {
		case 'surface': this . depth_target = 0; break;
		case 'periscope': this . depth_target = 60; break;
		case 'down thermal':
			for (var ind in thermoclines) {
				if (thermoclines [ind] . depth > this . position . depth) this . depth_target = thermoclines . depth + 18;
				return;
			}
			break;
		case 'up thermal':
			for (var ind = thermoclines . length - 1; ind >= 0; ind++) {
				if (thermoclines [ind] . depth < this . position . depth) this . depth_target = thermoclines . depth - 18;
			}
			break;
		default: break;
	}
};

triton . prototype . targetBearing = function (target, index) {
	if (index === undefined) index = this . bearing_speeds . length - 1;
	this . bearing_speed = this . bearing_speeds [index];
	if (typeof (target) === 'number') this . bearing_target = target;
	else this . bearing_target = Math . atan2 (target . y - this . position . y, target . x - this . position . x) * 180 / Math . PI + 90;
	if (this . bearing_target > 180 + this . position . bearing) this . position . bearing += 360;
	if (this . bearing_target + 180 < this . position . bearing) this . position . bearing -= 360;
};

triton . prototype . draw = function (ctx) {
	ctx . strokeStyle = 'white';
	ctx . lineWidth = 1;
	for (var ind in this . trail) {
		ctx . beginPath ();
		ctx . arc (this . trail [ind] . x * scaling, this . trail [ind] . y * scaling, 1, 0, 6.28);
		ctx . stroke ();
	}
	var x = this . position . x * scaling * 128, y = this . position . y * scaling * 128;
	switch (this . status) {
		case 'friend': ctx . fillStyle = ctx . strokeStyle = 'lime'; break;
		case 'enemy': ctx . fillStyle = ctx . strokeStyle = 'red'; break;
		case 'neutral': ctx . fillStyle = ctx . strokeStyle = 'white'; break;
		case 'simulation': ctx . fillStyle = ctx . strokeStyle = 'gray'; break;
		default: ctx . strokeStyle = 'white'; break;
	}
	ctx . lineCap = 'square';
	ctx . lineWidth = this . selected ? 3 : 2;
	ctx . beginPath ();
	switch (this . type) {
		case 'surface':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, 6.28); ctx . fill ();
			ctx . moveTo (x + 8, y - 8); ctx . lineTo (x + 8, y + 8); ctx . lineTo (x - 8, y + 8);
			ctx . lineTo (x - 8, y - 8);ctx . lineTo (x + 8, y - 8); break;
		case 'submarine':
			if (this . status === 'simulation') {
				var bearing = (this . position . bearing - 90) * Math . PI / 180;
				var alpha = Math . cos (bearing) * 12, beta = Math . sin (bearing) * 12;
				ctx . lineCap = 'round'
				ctx . lineWidth = 4; ctx . moveTo (x - alpha, y - beta); ctx . lineTo (x + alpha, y + beta);
			}
			else {
				ctx . beginPath (); ctx . arc (x, y, 2, 0, 6.28); ctx . fill ();
				ctx . moveTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y);
			}
			break;
		default: break;
	}
	ctx . stroke ();
};

triton . prototype . checkStatusOf = function (vessel) {
	if (this === vessel) return 'simulation';
	if (friends [this . country] . includes (vessel . country)) return 'friend';
	if (enemies [this . country] . includes (vessel . country)) return 'enemy';
	return 'neutral';
};

triton . prototype . getVectorFrom = function (vessel) {return {x: vessel . position . x - this . position . x, y: vessel . position . y - this . position . y};};

triton . prototype . getRelativePositionOf = function (vessel) {
	var vector = this . getVectorFrom (vessel);
	vector . distance = Math . sqrt (vector . x * vector . x + vector . y * vector . y);
	vector . bearing = Math . atan2 (vector . y, vector . x);
	return vector;
};

triton . prototype . getNoiseOf = function (vessel) {
	var vector = this . getRelativePositionOf (vessel);
	noise = vessel . noiseLevel ();
	if (vector . distance > 0) noise /= vector . distance * 1852;
	return noise;
};

var Virginia = function (name, country) {
	if (country === undefined) country = 'USA';
	triton . call (this, country);
	this . class = 'Virginia';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 19, 25, 35];
};
Virginia . prototype = Object . create (triton . prototype);

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	triton . call (this, country);
	this . class = 'Akula';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
};
Akula . prototype = Object . create (triton . prototype);
