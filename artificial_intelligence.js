
var sonarDetect = function (vessel) {
	this . code = function (delta) {vessel . sonar . detect (delta);};
};

var torpedoAI = function (torpedo) {
	this . armed = false;
	this . ping = 0;
	this . code = function (delta) {
		var sdelta = delta / 3600;
		torpedo . distance_travelled += torpedo . speed . x * sdelta;
		if (torpedo . distance_travelled >= this . range) {torpedo . damage (1); return;}
		if (torpedo . cable !== null) {
			torpedo . distance_cable_travelled += torpedo . cable . speed . x * sdelta;
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_cable_travelled > torpedo . cable_to_ship_length) {
					torpedo . cable = null;
					torpedo . initial_trail_delta = trail_delta;
					torpedo . trail_length = trail_length;
			}
		}
		if (torpedo . target === null) {
			if (this . ping <= 0) {
				torpedo . sonar . ping ();
				this . ping = 44;
				torpedo . sonar . detect (delta);
				for (var ind in torpedo . sonar . detected) {console . log (torpedo . sonar . detected [ind]);}
			}
			this . ping -= delta;
			return;
		}
		if (torpedo . target . destroyed) torpedo . target = null;
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.01 && torpedo . target . type === 'waypoint') {torpedo . target = null; return;}
		if (vector . distance < 0.003 && Math . abs (torpedo . target . position . depth - torpedo . position . depth) < 10) {
			torpedo . damage (1); torpedo . target . damage (1 + Math . random ()); return;
		}
		torpedo . targetDepth (torpedo . target . position . depth);
		torpedo . targetBearing (nauticalBearing (vector . bearing), 2);
		var frontAngle = Math . abs (torpedo . bearing_target - torpedo . position . bearing);
		if (frontAngle < 10) {
			torpedo . setSpeed (torpedo . name === 'Fast' ? 'flank' : 'full');
			if (! this . armed) {this . armed = true; console . log ('armed');}
		} else {
			torpedo . setSpeed ('half');
			if (this . armed) {torpedo . target = null; console . log ('target lost');}
		}
	};
};
