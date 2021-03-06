
var sonarDetect = function (vessel) {
	this . code = function (delta) {vessel . sonar . detect (delta);};
};

var torpedoAI = function (torpedo) {
	this . armed = false;
	this . ping = 4;
	this . code = function (delta) {
		torpedo . sonar . detect ();
		if (torpedo . distance_travelled >= torpedo . range) {notifyRunOutOfFuel (torpedo); removeVessel (torpedo); return;}
		if (torpedo . cable !== null) {
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_cable_travelled > torpedo . cable_to_ship_length) {
				torpedo . cable = null; torpedo . initial_trail_delta = trail_delta; torpedo . trail_length = trail_length;
			} else torpedo . distance_cable_travelled += torpedo . cable . speed . x * delta / 3600;
		}
		if (torpedo . target !== null) {
			this . ping = 4;
			if ((this . armed && torpedo . sonar . targetNoLongerAudible (torpedo . target) && torpedo . target . type) || torpedo . target . destroyed) {
				torpedo . target = null;
				torpedo . setSpeed ('slow');
				torpedo . bearing (Math . random () < 0.5 ? -3 : 3);
				return;
			}
			var vector = torpedo . getRelativePositionOf (torpedo . target);
			var td = torpedo . target . position . depth;
			if (vector . distance < 0.01 && Math . abs (td - torpedo . position . depth) < 40 && torpedo . target . type) {torpedo . detonate (); return;}
			torpedo . setSpeed (Math . abs (vector . heading) < 10 ? 'full' : 'slow');
			torpedo . targetDepth (td > 0 ? td : 1);
			torpedo . targetBearing (torpedo . target . position);
			if (! torpedo . sonar . targetNoLongerAudible (torpedo . target) && ping === null) this . armed = true;
		} else {
			if (torpedo . bearing_speed === 0) torpedo . bearing (Math . random () < 0.5 ? -3 : 3);
			torpedo . setSpeed ('slow');
			if (this . ping <= 0) {torpedo . sonar . ping (); this . ping = 4;}
			this . ping -= delta;
			if (torpedo . target_type === 'surface') torpedo . targetDepth ('surface');
			else if (torpedo . depth_target === torpedo . position . depth && torpedo . position . depth > 0 && torpedo . position . depth < torpedo . test_depth) torpedo . targetDepth ('test', 1);
			else if (torpedo . position . depth === torpedo . test_depth) torpedo . targetDepth ('surface', 1);
			else if (torpedo . position . depth === 0) torpedo . targetDepth ('test', 1);
			torpedo . detectStrongest (torpedo . target_type);
			if (torpedo . target) this . armed = false;
		}
	};
};

var wakehomingAI = function (torpedo) {
	this . status = 'waypoint';
	this . findTrail = function (torpedo) {
		this . status = 'trail';
		this . trail = findClosestTrail (torpedo);
		torpedo . target = this . trail . target;
		torpedo . targetDepth (0);
	};
	this . code = function (delta) {
		if (torpedo . distance_travelled >= torpedo . range) {notifyRunOutOfFuel (torpedo); removeVessel (torpedo); return;}
		switch (this . status) {
			case 'waypoint':
				torpedo . targetBearing (torpedo . target_waypoint . position, 5);
				var vector = torpedo . getRelativePositionOf (torpedo . target_waypoint);
				if (vector . distance < 0.01) this . findTrail (torpedo);
				break;
			case 'trail':
				if (torpedo . target === null) {this . findTrail (torpedo); break;}
				var vector = torpedo . getRelativePositionFromVector (torpedo . target . trail [this . trail . index]);
				while (vector . distance < 0.01) {
					this . trail . index += 1;
					if (this . trail . index >= torpedo . target . trail . length) {this . status = 'target'; return;}
					vector = torpedo . getRelativePositionFromVector (torpedo . target . trail [this . trail . index]);
				}
				torpedo . targetBearing (torpedo . target . trail [this . trail . index]);
				break;
			case 'target':
				if (torpedo . target . destroyed) {this . findTrail (torpedo); break;}
				torpedo . targetBearing (torpedo . target . position);
				var vector = torpedo . getRelativePositionOf (torpedo . target);
				if (vector . distance < 0.01) torpedo . detonate ();
				break;
			default: break;
		}
	};
};

var mineAI = function (mine, constructor) {
	this . code = function (delta) {
		if (! mine . armed) {
			mine . armed_time -= delta;
			if (mine . armed_time < 0) mine . armed = true;
		} else {
			for (var ind in vessels) {
				var vector = mine . getRelativePositionOf (vessels [ind]);
				if (vector . distance <= mine . range && mine !== vessels [ind] && (vessels [ind] . type === 'surface' || vessels [ind] . type === 'submarine')) {
					var torpedo = new constructor (mine . cable, mine . name);
					torpedo . image = mine . image;
					torpedo . cable_length = 0; torpedo . cable_to_ship_length = 0;
					torpedo . target_type = vessels [ind] . type;
					var vs = mine . position;
					torpedo . position = {x: vs . x, y: vs . y, depth: vs . depth, bearing: Math . random () * 360};
					torpedo . depth_target = vs . depth;
					torpedo . setSpeed ('stop');
					addVessel (torpedo);
					mine . destroyed = true;
				}
			}
		}
	};
};

var akulaAI = function (akula) {
	this . mode = 'initiate_search';
	this . goto = function () {
		akula . setSpeed ('full');
		akula . targetDepth ('test');
		akula . sonar . retrieveTowedArray (function () {akula . setSpeed ('full');});
	};
	this . code = function (delta) {
		akula . sonar . detect (delta);
		switch (this . mode) {
		case 'initiate_search':
			akula . targetDepth ('test', 1);
			akula . setSpeed ('slow');
			akula . bearing (Math . random () < 0.5 ? 1 : -1);
			akula . sonar . deployTowedArray ();
			this . mode = 'searching';
			break;
		case 'searching':
			if (akula . position . depth === akula . test_depth) akula . targetDepth ('periscope', 1);
			if (akula . position . depth === 60) akula . targetDepth ('test', 1);
			var target = akula . sonar . detectStrongestEnemy ('submarine');
			if (target !== null) {
				var wp = target . position;
				this . mode = 'waypoint';
				this . waypoint = {x: wp . x, y: wp . y, depth: wp . depth};
				vector = akula . getRelativePositionFromVector (this . waypoint);
				if (vector . distance > 2) {
					akula . setSpeed ('stop');
					self = this;
					akula . targetDepth ('attack', akula . diving_speeds . length - 1, function () {
						akula . tubes [0] . fire ({position: self . waypoint}, 'РПК-7 Ветер', function () {self . goto ();});
//						self . goto ();
					});
				} else {
					akula . tubes [0] . fire (target, 'Long Range');
					this . goto ();
				}
			}
			break;
		case 'waypoint':
			akula . targetBearing (this . waypoint);
			var vector = akula . getRelativePositionFromVector (this . waypoint);
			if (vector . distance < 0.1) this . mode = 'initiate_search';
			break;
		}
	};
};

var bukAI = function (escort, BUK, distance) {
	var buk_fired = null;
	if (distance === undefined) distance = 3;
	this . code = function (delta) {
		var incoming = escort . findRocket ();
		if (incoming !== null && buk_fired !== incoming) {
			var vector = escort . getRelativePositionOf (incoming);
			if (vector . distance < distance) {
				buk_fired = incoming;
				var buk = new escort . silo [BUK] . constructor (escort, BUK, escort . country);
				if (buk . siloLaunch (escort . silo [BUK], escort, incoming)) return buk;
			}
		}
		return null;
	};
};

var superBukAI = function (escort, BUK, missiles, distance) {
	if (missiles === undefined) missiles = [];
	if (distance === undefined) distance = 3;
	this . code = function (delta) {
		var incomings = escort . findEnemyRockets ();
		for (var ind in incomings) {
			var incoming = incomings [ind];
			if (missiles . indexOf (incoming) < 0) {
				var vector = escort . getRelativePositionOf (incoming);
				if (vector . distance < distance) {
					missiles . push (incoming);
					var buk = new escort . silo [BUK] . constructor (escort, BUK, escort . country);
					if (buk . siloLaunch (escort . silo [BUK], escort, incoming)) return buk;
				}
			}
		}
		return null;
	};
};

var corsair = function (escort, rocket, static_delay, random_delay) {
	var delay = static_delay + Math . random () * random_delay;
	this . code = function (delta) {
		delay -= delta;
		if (delay > 0) return;
		delay = static_delay + Math . random () * random_delay;
		var detected = [];
		var ids = [];
		for (var ind in escort . sonar . detected) {
			if (escort . sonar . detected [ind] . status === 'neutral') ids . push (ind);
		}
		var target = escort . sonar . detected [SelectRandom (ids)] . vessel;
		escort . targetBearing (target . position);
		var missile = new escort . silo [rocket] . constructor (escort, rocket, escort . country);
		missile . siloLaunch (escort . silo [rocket], escort, target);
	};
};

var FireRocketOrTorpedo = function (escort, distance, ROCKET, TORPEDO) {
	var vector = escort . getRelativePositionOf (escort . target);
	if (vector . distance < distance) {
		var torpedo = new escort . inventory [TORPEDO] . constructor (escort, TORPEDO);
		return escort . fireTorpedo (torpedo, escort . inventory [TORPEDO]) ? torpedo : null;
	} else {
		var torpedo = new escort . silo [ROCKET] . constructor (escort, ROCKET, escort . country);
		torpedo . target_type = 'submarine';
		return torpedo . siloLaunch (escort . silo [ROCKET], escort, escort . target) ? torpedo : null;
	}
	return null;
};

var ChangeCourseAtTarget = function (escort) {
	if (escort . target === null) return;
	escort . targetBearing (escort . target . position);
	var vector = escort . getRelativePositionOf (escort . target);
	escort . setSpeed (vector . distance > 1 ? 'full' : vector . distance > 0.5 ? 'half' : 'stop');
};

var subTrackerAI = function (escort, ROCKET, TORPEDO) {
	var fired = null;
	var weapon = null;
	var time_fired = 0
	this . code = function (delta) {
		time_fired -= delta;
		var target = escort . sonar . trackOrStrongestEnemy (escort . target, 'submarine');
		if (target !== null & (escort . target !== target || fired !== target || weapon === null || (weapon . target !== target && time_fired < 0) || weapon . destroyed)) {
			escort . target = target;
			fired = target;
			time_fired = 60;
			return weapon = FireRocketOrTorpedo (escort, 2, ROCKET, TORPEDO);
		}
		return false;
	};
};

var FollowLeaderAI = function (vessel, Leader, NauticalBearing, distance) {
	var bearing = (Leader . position . bearing + NauticalBearing) * Math . PI / 180;
	var shift = {x: distance * Math . sin (bearing), y: - distance * Math . cos (bearing)};
	following = true;
	vessel . positionVessel (Leader . position . x + shift . x, Leader . position . y + shift . y, Leader . position . bearing);
	this . code = function (delta) {
		var x = Leader . position . x + shift . x; var y = Leader . position . y + shift . y;
		var dx = vessel . position . x - x; var dy = vessel . position . y - y;
		var distance = Math . sqrt (dx * dx + dy * dy);
		following = distance < (following ? 0.0625 : 0.03125);
		if (following) {
			if (Leader . speed . x !== vessel . speed . x) vessel . adjustSpeed (Leader . speed . x);
			if (Leader . position . bearing !== vessel . position . bearing) vessel . targetBearing (Leader . position . bearing);
		} else {
			vessel . setSpeed ('full');
			vessel . targetBearing ({x: x, y: y});
		}
	};
};

var escortAI = function (escort, ROCKET, TORPEDO, BUK, SuperMissiles) {
	var buk_code = new superBukAI (escort, BUK, SuperMissiles);
	var sub_tracker = new subTrackerAI (escort, ROCKET, TORPEDO);
	this . code = function (delta) {
		if (BUK !== undefined) buk_code . code (delta);
		escort . sonar . detect ();
		sub_tracker . code (delta);
		ChangeCourseAtTarget (escort);
	};
};

var torpedoAvoidanceAI = function (vessel) {
	var delay = 0;
	this . code = function (delta) {
		var torpedoes = vessel . sonar . detectTorpedoes ();
		if (torpedoes . length > 0) {
			for (var ind in torpedoes) {
				var torpedo = torpedoes [ind];
				var vector = vessel . getRelativePositionOf (torpedo);
				vector . bearing = nauticalBearing (vector . bearing);
				var bearing = vector . bearing - vessel . position . bearing;
				while (bearing > 180) bearing -= 360;
				while (bearing < -180) bearing += 360;
				if (vector . distance < 0.3) {
					if (delay <= 0) {
						vessel . targetBearing (torpedo . position . bearing + (Math . random () < 0.5 ? 140 : -140));
						vessel . setSpeed ('full');
						delay = 60;
					} else {
						delay -= delta;
					}
				} else delay = 0;
			}
		}
	};
};

var cruiseAI = function (rocket, shift, multiplier) {
	this . code = function (delta) {
		if (rocket . target . destroyed) {removeVessel (rocket); return;}
		if (rocket . target . position . depth > 0) {removeVessel (rocket); return;}
		rocket . targetBearing (rocket . target . position);
		var vector = rocket . getRelativePositionOf (rocket . target);
		if (vector . distance < 0.1) {
			if (rocket . target . type === null) {rocket . target = null; return;}
			rocket . explodeSound ();
			notifyExplosion (rocket);
			removeVessel (rocket);
			notifyHit (rocket . target, rocket . attacker);
			rocket . target . damage (shift + multiplier * Math . random ());
			return;
		}
	};
};

var RocketTorpedoAI = function (torpedo) {
	this . code = function (delta) {
		torpedo . targetBearing (torpedo . target . position);
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.1) {
			var alpha = Math . random () * 2 * Math . PI;
			var delta = Math . random () * 0.3 + 0.2;
			torpedo . position . x = torpedo . target . position . x + Math . cos (alpha) * delta;
			torpedo . position . y = torpedo . target . position . y + Math . sin (alpha) * delta;
			torpedo . position . bearing = Math . random () * 360;
			torpedo . targetDepth (torpedo . target . position . depth);
			torpedo . ai = new torpedoAI (torpedo);
			torpedo . type = 'torpedo';
			torpedo . speeds = torpedo . torpedo_speeds;
			torpedo . bearing_speeds = torpedo . torpedo_bearing_speeds;
			torpedo . range = torpedo . torpedo_range;
			torpedo . image = torpedo . image_alt;
			torpedo . setSpeed ('slow');
			torpedo . target = null;
		}
	};
};

var DecoyAI = function (decoy) {
	this . code = function (delta) {
		decoy . range -= decoy . speed . x * delta / 3600;
		if (decoy . range < 0) removeVessel (decoy);
	}
};

