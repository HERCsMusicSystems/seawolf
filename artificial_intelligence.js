
var sonarDetect = function (vessel) {
	this . code = function (delta) {vessel . sonar . detect (delta);};
};

var torpedoAI = function (torpedo) {
	this . armed = false;
	this . ping = 0;
	this . setTarget = function (target) {this . target = target; this . armed = false;};
	this . code = function (delta) {
		var sdelta = delta / 3600;
		torpedo . distance_travelled += torpedo . speed . x * sdelta;
		if (torpedo . distance_travelled >= torpedo . range) {notifyRunOutOfFuel (torpedo); removeVessel (torpedo); return;}
		if (torpedo . cable !== null) {
			torpedo . distance_cable_travelled += torpedo . cable . speed . x * sdelta;
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_cable_travelled > torpedo . cable_to_ship_length) {
					torpedo . cable = null; torpedo . initial_trail_delta = trail_delta; torpedo . trail_length = trail_length;
			}
		}
		if (torpedo . target === null) {
			if (torpedo . bearing_speed === 0) {torpedo . bearing (Math . random () < 0.5 ? -3 : 3);}
			if (this . ping <= 0) {torpedo . sonar . ping (); this . ping = 4;}
			this . ping -= delta;
			if (torpedo . depth_target === torpedo . position . depth && torpedo . position . depth > 0 && torpedo . position . depth < torpedo . test_depth) torpedo . targetDepth ('test', 1);
			if (torpedo . position . depth === torpedo . test_depth) torpedo . targetDepth ('surface', 1);
			if (torpedo . position . depth === 0) torpedo . targetDepth ('test', 1);
			torpedo . detectStrongest (delta, torpedo . target_type);
			return;
		}
		if (torpedo . target . destroyed) {torpedo . target = null; return;}
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.01) {
			if (torpedo . target . type === null) {torpedo . target = null; return;}
			if (Math . abs (torpedo . target . position . depth - torpedo . position . depth) < 40) {torpedo . detonate (); return;}
		}
		torpedo . targetDepth (torpedo . target . position . depth);
		torpedo . targetBearing (nauticalBearing (vector . bearing));
		var frontAngle = Math . abs (torpedo . bearing_target - torpedo . position . bearing);
		if (frontAngle < 10) {
			torpedo . setSpeed ('full');
			// if (torpedo . target . type !== null) {torpedo . detectStrongest (delta); console . log (frontAngle, 'possible change');}
			if (! this . armed) {this . armed = true;}
		} else {
			torpedo . setSpeed ('slow');
			if (this . armed && torpedo . cable === null) {torpedo . detectStrongest (delta, torpedo . target_type);}
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
				if (vector . distance <= mine . range && mine !== vessels [ind]) {
					var torpedo = new constructor (mine . cable, mine . name);
					torpedo . cable_length = 0; torpedo . cable_to_ship_length = 0;
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
	this . code = function (delta) {
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
			break;
		case 'waypoint': break;
		}
	};
};

var escortAI = function (escort) {
	this . code = function (delta) {
		escort . sonar . detect ();
		var target = null;
		var noise = 0;
		var targetNoLongerAudible = true;
		for (var ind in escort . sonar . detected) {
			var detected = escort . sonar . detected [ind];
			if (detected . status === 'enemy' && detected . vessel . type === 'submarine') {
				if (detected . vessel === escort . target) targetNoLongerAudible = false;
				if (detected . noise > noise) {target = detected . vessel; noise = detected . noise;}
			}
		}
		if (targetNoLongerAudible) escort . target = null;
		if (escort . target === null && target !== null) {
			escort . target = target;
			var vector = escort . getRelativePositionOf (escort . target);
			if (vector . distance < 2) {
				if (escort . inventory !== undefined && escort . inventory . Mark48 !== undefined && escort . inventory . Mark48 . count > 0) {
					var torpedo = new Mark48 (escort, 'SSN-12');
					escort . fireTorpedo (torpedo);
				}
			} else {
				if (escort . silo . SeaLance !== undefined && escort . silo . SeaLance . amount > 0) {
					var torpedo = new escort . silo . SeaLance . constructor (escort, 'SeaLance', escort . country);
					if (torpedo . siloLaunch (escort . silo . SeaLance, escort, escort . target)) {
						escort . silo . SeaLance . amount -= 1;
						torpedo . target_type = 'submarine';
					}
				}
			}
		}
		if (escort . target !== null) {
			var vector = escort . getRelativePositionOf (escort . target);
			escort . targetBearing (escort . target . position);
			if (vector . distance > 1) escort . setSpeed ('full');
			else if (vector . distance > 0.5) escort . setSpeed ('half');
			else escort . setSpeed ('stop');
		}
//		if (ping) {
//			escort . targetBearing (ping);
//			escort . setSpeed ('full');
//		}
	};
};

var HarpoonAI = function (rocket) {
	this . code = function (delta) {
		rocket . targetBearing (rocket . target . position);
		var vector = rocket . getRelativePositionOf (rocket . target);
		if (vector . distance < 0.1) {
			if (rocket . target . type === null) {rocket . target = null; return;}
			rocket . explodeSound ();
			notifyExplosion (rocket);
			removeVessel (rocket);
			notifyHit (rocket . target, rocket . attacker);
			rocket . target . damage (3 + 3 * Math . random ());
			return;
		}
	};
};

var TomahawkAI = function (rocket) {
	this . code = function (delta) {
		rocket . targetBearing (rocket . target . position);
		var vector = rocket . getRelativePositionOf (rocket . target);
		if (vector . distance < 0.1) {
			if (rocket . target . type === null) {rocket . target = null; return;}
			rocket . explodeSound ();
			notifyExplosion (rocket);
			removeVessel (rocket);
			notifyHit (rocket . target, rocket . attacker);
			rocket . target . damage (5 + 3 * Math . random ());
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
			torpedo . image = torpedo . image_alt;
			torpedo . setSpeed ('slow');
		}
	};
};

var DecoyAI = function (decoy) {
	this . code = function (delta) {
		decoy . range -= decoy . speed . x * delta / 3600;
		if (decoy . range < 0) removeVessel (decoy);
	}
};

