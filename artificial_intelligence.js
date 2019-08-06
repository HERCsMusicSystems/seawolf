
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
		torpedo . targetBearing (nauticalBearing (vector . bearing), 3);
		var frontAngle = Math . abs (torpedo . bearing_target - torpedo . position . bearing);
		if (frontAngle < 10) {
			torpedo . setSpeed ('flank');
			// if (torpedo . target . type !== null) {torpedo . detectStrongest (delta); console . log (frontAngle, 'possible change');}
			if (! this . armed) {this . armed = true;}
		} else {
			torpedo . setSpeed ('slow');
			if (this . armed && torpedo . cable === null) {torpedo . detectStrongest (delta, torpedo . target_type);}
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
			if (detected . status === 'enemy') {
				if (detected . vessel === escort . target) targetNoLongerAudible = false;
				if (detected . noise > noise) {target = detected . vessel; noise = detected . noise;}
			}
		}
		if (targetNoLongerAudible) escort . target = null;
		if (escort . target === null && target !== null) {
			escort . target = target;
			var torpedo = new Mark48 (escort, 'SSNT', escort . country);
			torpedo . cable_length = 0; torpedo . cable_to_ship_length = 0;
			escort . fireRocketTorpedo (torpedo);
			console . log ('target assigned', target . name);
		}
		if (escort . target !== null) {
			escort . targetBearing (escort . target . position);
			escort . setSpeed ('full');
		}
//		if (ping) {
//			escort . targetBearing (ping);
//			escort . setSpeed ('full');
//		}
	};
};
