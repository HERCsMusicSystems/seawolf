
var friends = {
	'U.S.A.': ['U.S.A.', 'United Kingdom', 'Australia'],
	'United Kingdom': ['United Kingdom', 'Australia', 'U.S.A.'],
	'Australia': ['Australia', 'United Kingdom', 'U.S.A.'],
	'Russia': ['Russia', 'India', 'China'],
	'China': ['China', 'Russia', 'India'],
	'India': ['India', 'Russia', 'China']
};

var enemies = {
	'U.S.A.': ['Russia', 'China', 'India'],
	'United Kingdom': ['Russia', 'China', 'India'],
	'Australia': ['Russia', 'China', 'India'],
	'Russia': ['U.S.A.', 'United Kingdom', 'Australia'],
	'China': ['U.S.A.', 'Uniged Kingdom', 'Australia'],
	'India': ['U.S.A.', 'United kingdom', 'Australia']
};

var subImage = new Image (); subImage . src = 'silhouettes/LosAngelesTopView.png';

var inherit = function (from, to) {
	if (to === undefined) {to = from; from = function () {to . apply (this, arguments);}}
	from . prototype = Object . create (to . prototype);
	from . prototype . constructor = from;
	return from;
};

var SelectRandom = function (list, amount) {
	if (amount === undefined) return list [Math . floor (Math . random () * list . length)];
	var ret = [];
	while (amount > 0) {
		amount -= 1;
		var ind = Math . floor (Math . random () * list . length);
		while (ret . indexOf (list [ind]) >= 0) ind = Math . floor (Math . random () * list . length);
		ret . push (list [ind]);
	}
	return ret;
};

var TakeRandom = function (list, amount) {
	if (amount === undefined) return list . splice (Math . floor (Math . random () * list . length), 1) [0];
	var ret = [];
	while (amount > 0) {ret . push (TakeRandom (list)); amount -= 1;}
	return ret;
};

var vessel_id = 0;

var vessel = function (country) {
	this . id = vessel_id ++;
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 0, y: 0};
	this . speed_index = 0;
	this . speed_index_limit = 6;
	this . diving_speed = 0;
	this . bearing_speed = 0;
	this . depth_target = 0;
	this . bearing_target = null;
	this . noise = 0;
	this . trail_delta = 0;
	this . initial_trail_delta = trail_delta;
	this . trail_length = trail_length;
	this . destroyed = false;
	this . trail = [];
	this . country = country;
	this . type = 'submarine';
	this . speeds = [0, 2, 8, 16, 24, 32, 40];
	this . noises = [60, 120, 480, 4800, 30000, 190000, 1200000];
	this . bearing_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . diving_speeds = [0, 10, 20, 30, 40, 50, 60];
	this . tubes = [];
	this . inventory = {};
	this . silo = {};
	this . ai = null;
	this . strength = 3;
	this . damage_delta = 0;
	this . test_depth = 1600; // US Navy 2/3, Royal Navy: 4/7, German Kriegsmarine: 1/2
	this . collapse_depth = 2400;
	this . collapse_depth_warning = 2200;
	this . test_depth_warning = true;
	this . collapse_depth_w = true;
	this . target = null;
	this . target_type = 'all';
	this . cable = null;
	this . attacker = this;
	this . flank_speed_warning = 100;
	this . flank_speed_end = 120;
	this . flank_speed = 0;
	this . flank_speed_w = 16384;
};

vessel . prototype . image = 'Default';
vessel . prototype . info = 'https://en.wikipedia.org/wiki/Warship';

vessel . prototype . Enemy = function (vessel) {return enemies [this . country] . includes (vessel . country);};
vessel . prototype . Friend = function (vessel) {return friends [this . country] . includes (vessel . country);};

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
		this . trail . push ({x: this . position . x, y: this . position . y});
		this . trail_delta = this . initial_trail_delta;
		while (this . trail . length > this . trail_length) this . trail . shift ();
	}
	if (this . speed . x > this . speeds [5]) this . flank_speed += delta; else {this . flank_speed = 0; this . flank_speed_w = this . flank_speed_warning;}
	if (this . flank_speed >= this . flank_speed_w) {this . flank_speed_w = 16384; sayWords (this, 'Engine is about to break');}
	if (this . flank_speed >= this . flank_speed_end) {this . setSpeed ('stop'); this . damage_speed (0.8); sayWords (this, 'Damage');}
	var bearing = (this . position . bearing - 90) * Math . PI / 180;
	var sdelta = delta / 3600;
	this . position . x += sdelta * (Math . cos (bearing) * this . speed . x - Math . sin (bearing) * this . speed . y);
	this . position . y += sdelta * (Math . cos (bearing) * this . speed . y + Math . sin (bearing) * this . speed . x);
	if (this . position . depth !== this . depth_target) {
		var dspeed = this . diving_speed * delta;
		if (Math . abs (this . depth_target - this . position . depth) <= dspeed) {
			this . position . depth = this . depth_target;
			this . diving_speed = 0;
			if (this . depth_callback) {this . depth_callback (); this . depth_callback = null;}
		} else {
			if (this . depth_target > this . position . depth) this . position . depth += dspeed;
			else this . position . depth -= dspeed;
		}
		if (this . position . depth > this . test_depth) {if (this . test_depth_warning) {this . test_depth_warning = false; sayWords (this, 'Captain, we are below the test depth');}}
		else this . test_depth_warning = true;
		if (this . position . depth >= this . collapse_depth_warning) {if (this . collapse_depth_w) {this . collapse_depth_w = false; sayWords (this, 'Captain, we are about to collapse.');}}
		else this . collapse_depth_w = true;
		if (this . position . depth > this . collapse_depth) {sayWords (this, 'Captain, the hull collapsed.'); MissionDefeat ();}
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
	if (index < 0) index = 0; if (index > this . speed_index_limit) index = this . speed_index_limit;
	this . noise = this . noises [index]; this . speed = {x: this . speeds [index], y: 0}; this . speed_index = index;
};

vessel . prototype . targetDepth = function (depth, index, callback) {
	if (callback !== undefined) this . depth_callback = callback;
	if (depth == null) return;
	if (index === undefined) index = this . diving_speeds . length - 1;
	this . diving_speed = this . diving_speeds [index];
	if (typeof (depth) === 'number') {this . depth_target = depth; return;}
	if (! Number . isNaN (Number (depth))) {this . depth_target = Number (depth); return;}
	switch (depth) {
		case 'surface': this . depth_target = 0; break;
		case 'periscope': this . depth_target = 60; break;
		case 'attack': this . depth_target = 150; break;
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
	if (this . speed_index < 1) this . setSpeed (1);
};

vessel . prototype . bearing = function (index) {
	this . bearing_speed = index >= 0 ? this . bearing_speeds [index] : - this . bearing_speeds [- index];
	this . bearing_target = null;
	if (this . speed_index < 1) this . setSpeed (1);
};

var HarpoonImage = new Image (); HarpoonImage . src = 'silhouettes/Harpoon.png';

vessel . prototype . draw = function (ctx, status) {
	ctx . strokeStyle = 'white';
	ctx . lineWidth = 1;
	var scc = scaling * 128;
	for (var ind in this . trail) {
		ctx . beginPath ();
		ctx . arc (this . trail [ind] . x * scc, this . trail [ind] . y * scc, 1, 0, 6.28);
		ctx . stroke ();
	}
	var x = this . position . x * scc, y = this . position . y * scc;
	if (status === undefined) {
		var bearing = (this . position . bearing - 90) * Math . PI / 180;
		var alpha = Math . cos (bearing) * 12, beta = Math . sin (bearing) * 12;
		ctx . lineCap = 'round'
		ctx . lineWidth = 4; ctx . strokeStyle = 'red';
		ctx . beginPath (); ctx . moveTo (x - alpha, y - beta); ctx . lineTo (x + alpha, y + beta); ctx . stroke ();
		// ctx . save ();
		// ctx . translate (x, y);
		// ctx . rotate (bearing);
		// ctx . scale (0.0625, 0.0625);
		// ctx . translate (subImage . width * -0.5, subImage . height * -0.5);
		// ctx . drawImage (subImage, 0, 0);
		// ctx . restore ();
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
			if (status === 'friend') ctx . arc (x, y, 8, 0, Math . PI);
			else {ctx . moveTo (x + 8, y); ctx . lineTo (x, y + 8); ctx . lineTo (x - 8, y);}
			ctx . moveTo (x, y); ctx . lineTo (x, y - 6); ctx . moveTo (x - 4, y - 6); ctx . lineTo (x + 4, y - 6);
			break;
		case 'rocket':
			ctx . save ();
			ctx . beginPath ();
			ctx . translate (x, y);
			ctx . rotate (this . position . bearing * Math . PI / 180 + Math . PI / 2);
			ctx . scale (0.0625, 0.0625);
			ctx . translate (HarpoonImage . width * -0.5, HarpoonImage . height * -0.5);
			ctx . drawImage (HarpoonImage, 0, 0);
			ctx . restore ();
			break;
		case 'mine':
			ctx . beginPath (); ctx . arc (x, y, 2, 0, Math . PI * 2); ctx . fill ();
			ctx . beginPath ();
			ctx . arc (x, y, this . range * scc, 0, Math . PI * 2);
			ctx . strokeStyle = this . armed ? 'red' : 'blue';
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
	vector . Vbearing = Math . atan2 (this . position . depth - vessel . position . depth, vector . distance * 6076.12);
	vector . heading = nauticalBearing (vector . bearing) - this . position . bearing;
	while (vector . heading > 180) vector . heading -= 360; while (vector . heading < -180) vector . heading += 360;
	return vector;
};

vessel . prototype . getRelativePositionFromVector = function (vector) {
	vector = {x: vector . x - this . position . x, y: vector . y - this . position . y};
	vector . distance = Math . sqrt (vector . x * vector . x + vector . y * vector . y);
	vector . bearing = Math . atan2 (vector . y, vector . x);
	return vector;
};

vessel . prototype . fireTorpedo = function (torpedo, inventory) {
	if (inventory . count <= 0) return false;
	torpedo . target_type = this . target . target_type || 'all';
	torpedo . target = this . target;
	var sp = this . position;
	var vector = this . getRelativePositionOf (this . target);
	torpedo . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: vector . bearing};
	torpedo . targetDepth (this . target . position . depth);
	addVessel (torpedo);
	inventory . count -= 1;
	return true;
};

vessel . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	this . target_type = this . target . type || 'all';
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	addVessel (this);
	return true;
};

vessel . prototype . siloLaunch = function (silo, vessel, target) {
	if (target === null || vessel . position . depth > silo . depth || silo . amount <= 0) return false;
	var vector = vessel . getRelativePositionOf (target);
	if (vector . distance > this . range) return false;
	// if (target . type !== this . target_type && this . target_type !== 'all') return false;
	this . target = target;
	this . target_type = this . target . type || 'all';
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -32, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	PlayMusic ('harpoonLaunch');
	silo . amount -= 1;
	ping = {x: vessel . position . x, y: vessel . position . y, depth: vessel . position . depth, ping: 1000000000, attenuation: 0.125, type: 'launch'};
	return true;
};

vessel . prototype . damage_speed = function (fraction) {
	if (fraction === undefined) fraction = 0.5;
	for (var ind in this . speeds) this . speeds [ind] *= fraction;
	this . speed . x = this . speeds [this . speed_index];
};

vessel . prototype . damage = function (level) {
	this . strength -= level;
	if (level > Math . random ()) this . damage_speed ();
//	if (level > 1.9) this . damage (level - 1.9);
};

vessel . prototype . detectStrongest = function (type) {this . target = this . sonar . detectStrongest (type);};
vessel . prototype . detectStrongestEnemy = function (type) {this . target = this . sonar . detectStrongestEnemy (type);};

vessel . prototype . setTarget = function (target) {
	this . target = target;
	this . target_type = target . type;
	this . targetDepth (target . position . depth > 0 ? target . position . depth : 1);
};

vessel . prototype . detonate = function () {removeVessel (this);};

vessel . prototype . explodeSound = function () {PlayMusic ('harpoonHit');};

vessel . prototype . NewCount = function (count) {return count - 1;};

vessel . prototype . postLaunch = function (tube) {
	tube . torpedo = null; tube . flooded = 0;
	if (tube . display_element !== null) {tube . display_element . bgColor = 'black'; tube . display_element . innerHTML = '';}
	if (this === simulated) PlayMusic ('torpedoLaunch');
};

vessel . prototype . findRocket = function () {
	for (var ind in vessels) {
		var rocket = vessels [ind];
		if (rocket . type === 'rocket' && rocket . target === this) return rocket;
	}
	return null;
};

vessel . prototype . findEnemyRockets = function () {
	var rockets = [];
	for (var ind in vessels) {
		var rocket = vessels [ind];
		if (rocket . type === 'rocket' && this . Enemy (rocket)) rockets . push (rocket);
	}
	return rockets;
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
				if (this . torpedo . launch (this, this . vessel)) {
					this . torpedo . postLaunch (this);
					if (this . fire_callback) {this . fire_callback (); this . fire_callback = null;}
				} else this . display_element . bgColor = 'red';
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
	var inventory = this . torpedoes [selector];
	var torpedo = new inventory . constructor (this . vessel, selector);
	if (inventory == null || inventory . count < 1) {notifyNoMoreTorpedoes (this . vessel, torpedo); return;}
	this . torpedo = torpedo;
	inventory . count = this . torpedo . NewCount (inventory . count);
	var img = this . torpedo . tube_image || this . torpedo . image;
	if (this . display_element !== null) this . display_element . innerHTML = `<img src="silhouettes/${img}.png" width="100"/>`;
	if (this . display_element) update_inventory_info (this . vessel);
};

tube . prototype . fire = function (target, selector, callback) {
	if (this . torpedo !== null) {
		if (this . flooded < 1) return;
		if (this . torpedo . launch (this, this . vessel, target)) this . torpedo . postLaunch (this);
		if (callback !== undefined) callback ();
		return;
	}
	if (callback !== undefined) this . fire_callback = callback;
	this . load (selector); if (this . torpedo !== null) {this . command = 'fire'; this . torpedo . target = target;}
};

tube . prototype . flood = function () {if (this . torpedo === null) return; this . command = 'flood';};
tube . prototype . empty = function () {
	this . torpedo = null; this . command = null; this . flooded = 0;
	if (this . display_element !== null) {this . display_element . bgColor = 'black'; this . display_element . innerHTML = '';}
};

var build_tubes = function (vessel, settings, amount, speed) {
	var tubes = [];
	for (var ind = 0; ind < amount; ind++) tubes . push (new tube (vessel, settings, speed));
	return tubes;
};

var silo_launch = function (html, ind) {
	var silo = simulated . silo [ind];
	if (silo . amount < 1) return;
	var rocket = new silo . constructor (simulated, ind, simulated . country);
	if (rocket . siloLaunch (silo, simulated, selected === null ? null : selected . vessel)) {
		html . textContent = `LAUNCH ${ind}: ${silo . amount}`;
	}
};

var sonar = function (vessel) {
	this . vessel = vessel;
	this . detected = {};
	this . detection_threshold = 1;
	this . identification_threshold = 2;
	this . tracking_threshold = 0.75;
	this . towed_array_deployed = 0;
	this . deploying_speed = 0;
	this . deploying_delta = 0.05;
	this . towed_array_amplification = 100;
	this . towed_array_current_amplification = 1;
	this . towed_array_speed_limit = 3;
	this . lambda = null;
};

sonar . prototype . detect = function (delta) {
	if (this . deploying_speed !== 0) {
		this . towed_array_deployed += this . deploying_speed * delta;
		if (this . towed_array_deployed >= 1) {
			this . towed_array_deployed = 1; this . deploying_speed = 0;
			this . towed_array_current_amplification = this . towed_array_amplification;
			if (this . lambda) {this . lambda (); this . lambda = null;}
			sayWords (this . vessel, 'Towed array deployed.');
		}
		if (this . towed_array_deployed <= 0) {
			this . towed_array_deployed = 0;
			this . deploying_speed = 0;
			this . towed_array_current_amplification = 1;
			this . vessel . speed_index_limit = this . vessel . speeds . length - 1;
			if (this . lambda) {this . lambda (); this . lambda = null;}
			sayWords (this . vessel, 'Towed array retrieved.');
		}
	}
	// this . detected = {};
	for (var ind in vessels) {
		var vessel = vessels [ind];
		if (vessel !== this . vessel) {
			var noise = this . getNoiseOf (vessel) * this . towed_array_current_amplification;
			if (noise < this . identification_threshold &&
				((this . vessel . position . depth <= 60 && this . vessel . type === 'submarine' && vessel . position . depth === 0)
				|| vessel . cable === this . vessel || vessel . type === 'rocket'
				|| (vessel . type === 'mine' && vessel . cable === this . vessel))) noise = this . identification_threshold;
			if (this . detected . hasOwnProperty (vessel . id)) {
				if (noise < this . tracking_threshold) {if (selected && selected . vessel === vessel) selected = null; delete this . detected [vessel . id];}
				else {
					if (this . detected [vessel . id] . status === 'unknown' && noise >= this . identification_threshold) this . detected [vessel . id] . status = this . vessel . checkStatusOf (vessel);
					this . detected [vessel . id] . noise = noise;
				}
			} else {
				if (noise >= this . detection_threshold)
					this . detected [vessel . id] = {status: noise >= this . identification_threshold ? this . vessel . checkStatusOf (vessel) : 'unknown', vessel: vessel, noise: noise};
			}
		}
	}
};

sonar . prototype . detectStrongest = function (type) {
	if (type === undefined) type = 'all';
	var strongest = null;
	for (var ind in this . detected) {
		var detected = this . detected [ind];
		if ((strongest === null || detected . noise > strongest . noise) && (type === 'all' || detected . vessel . type === type))
			strongest = this . detected [ind];
	}
	return strongest && strongest . vessel;
};

sonar . prototype . detectStrongestEnemy = function (type) {
	if (type === undefined) type = 'all';
	var strongest = null;
	for (var ind in this . detected) {
		var detected = this . detected [ind];
		if ((strongest === null || detected . noise > strongest . noise) && (type === 'all' || detected . vessel . type === type) && detected . status === 'enemy')
			strongest = this . detected [ind];
	}
	return strongest && strongest . vessel;
};

sonar . prototype . trackOrStrongestEnemy = function (tracked, type) {
	if (type === undefined) type = 'all';
	var target = null;
	var noise = 0;
	for (var ind in this . detected) {
		var detected = this . detected [ind];
		if (detected . vessel === tracked) return tracked;
		if (detected . noise > noise && detected . status === 'enemy' && (type === 'all' || detected . vessel . type === type)) {noise = detected . noise; target = detected . vessel;}
	}
	return target;
};

sonar . prototype . detectTorpedoes = function () {
	this . detect ();
	var torpedoes = [];
	for (var ind in this . detected) {
		var detected = this . detected [ind] . vessel;
		if (detected . type === 'torpedo' && detected . target === this . vessel) torpedoes . push (detected);
	}
	return torpedoes;
};

sonar . prototype . targetNoLongerAudible = function (target) {
	for (var ind in this . detected) {
		if (this . detected [ind]  . vessel === target) return false;
	}
	return true;
};

sonar . prototype . getNoiseOf = function (source) {
	var vector = this . vessel . getRelativePositionOf (source);
	var noise = source . noiseLevel ();
	if (vector . distance > 0) noise /= vector . distance * 1852;
	if (ping !== null) {
		var dx = source . position . x - ping . x, dy = source . position . y - ping . y;
		var ratio = Math . sqrt (dx * dx + dy * dy);
		if (ratio === 0) ratio = 1;
		if (ratio > 0) noise += ping . ping / ratio / 1852;
	}
	for (var ind in thermoclines) {
		if ((thermoclines [ind] . depth - source . position . depth) * (thermoclines [ind] . depth - this . vessel . position . depth) < 0) noise *= thermoclines [ind] . attenuation;
	}
	var bearing = vector . bearing - (this . vessel . position . bearing - 90) * Math . PI / 180;
	while (bearing > Math . PI) bearing -= Math . PI + Math . PI; while (bearing < - Math . PI) bearing += Math . PI + Math . PI;
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

sonar . prototype . ping = function () {ping = {x: this . vessel . position . x, y: this . vessel . position . y, depth: this . vessel . position . depth, ping: 1000000000, attenuation: 0.125, type: 'ping'}; notifyPing (this . vessel); PlayMusic (this . ping_sound);};
sonar . prototype . ping_sound = 'ping_1';
sonar . prototype . deployTowedArray = function (lambda) {
	if (lambda !== undefined) this . lambda = lambda;
	if (this . towed_array_amplification <= 1) return;
	this . deploying_speed = this . deploying_delta; this . vessel . speed_index_limit = this . towed_array_speed_limit;
	if (this . vessel . speed_index > this . towed_array_speed_limit) this . vessel . setSpeed (this . towed_array_speed_limit);
};
sonar . prototype . retrieveTowedArray = function (lambda) {
	if (lambda !== undefined) this . lambda = lambda;
	if (this . towed_array_amplification <= 1) return;
	this . towed_array_current_amplification = 1;
	this . deploying_speed = -0.05;
};
sonar . prototype . cutTowedArray = function () {
	this . towed_array_amplification = 1; this . towed_array_current_amplification = 1; this . towed_array_deployed = 0; this . deploying_speed = 0;
	this . vessel . speed_index_limit = this . vessel . speeds . length - 1;
	sayWords (this . vessel, 'Towed array cut.');
};

var Waypoint = function (x, y, depth) {
	vessel . call (this, 'JavaScript');
	this . position . x = x;
	this . position . y = y;
	this . position . depth = depth;
	this . type = null;
};
inherit (Waypoint, vessel);
