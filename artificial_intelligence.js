
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
		if (torpedo . distance_travelled >= this . range) {removeVessel (torpedo); return;}
		if (torpedo . cable !== null) {
			torpedo . distance_cable_travelled += torpedo . cable . speed . x * sdelta;
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_cable_travelled > torpedo . cable_to_ship_length) {
					torpedo . cable = null; torpedo . initial_trail_delta = trail_delta; torpedo . trail_length = trail_length;
			}
		}
		if (torpedo . target === null) {
			if (torpedo . bearing_speed === 0) {torpedo . bearing (Math . random () < 0.5 ? -2 : 2); console . log ('set bearing....');}
			if (this . ping <= 0) {torpedo . sonar . ping (); this . ping = 4;}
			this . ping -= delta;
			torpedo . detectStrongest (delta);
			return;
		}
		if (torpedo . target . destroyed) {torpedo . target = null; return;}
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.01) {
			if (torpedo . target . type === null) {torpedo . target = null; return;}
			if (Math . abs (torpedo . target . position . depth - torpedo . position . depth) < 60) {
				removeVessel (torpedo); explode (torpedo, torpedo . target, 0.01, 60, 1 + Math . random ()); return;
			}
		}
		torpedo . targetDepth (torpedo . target . position . depth);
		torpedo . targetBearing (nauticalBearing (vector . bearing), 2);
		var frontAngle = Math . abs (torpedo . bearing_target - torpedo . position . bearing);
		if (frontAngle < 10) {
			torpedo . setSpeed ('flank');
			if (torpedo . target . type !== null) torpedo . detectStrongest (delta);
			if (! this . armed) {this . armed = true; console . log ('armed');}
		} else {
			torpedo . setSpeed ('half');
			if (this . armed) {torpedo . target = null; console . log ('target lost');}
		}
	};
};
