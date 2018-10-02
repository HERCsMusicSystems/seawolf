
var sonarDetect = function (vessel) {
	this . code = function (delta) {vessel . sonar . detect (delta);};
};

var torpedoAI = function (torpedo) {
	this . armed = false;
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
		if (torpedo . target === null || torpedo . target . destroyed) return;
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.01 && torpedo . target . type === 'waypoint') {torpedo . target = null; return;}
		if (vector . distance < 0.003 && Math . abs (torpedo . target . position . depth - torpedo . position . depth) < 10) {
			torpedo . damage (1); torpedo . target . damage (1 + Math . random ()); return;
		}
		if (! this . armed) {
			if (torpedo . bearing_target !== null && Math . abs (torpedo . position . bearing - torpedo . bearing_target) < 20) {console . log ('armed'); this . armed = true;}
			else console . log (torpedo . position . bearing - torpedo . bearing_target, torpedo . position . bearing, torpedo . bearing_target);
		}
		torpedo . targetBearing (nauticalBearing (vector . bearing), 2);
		if (this . armed && Math . abs (torpedo . position . bearing - torpedo . bearing_target) > 20) {torpedo . target = null; console . log ('target lost');}
		torpedo . setSpeed (Math . abs (torpedo . bearing_target - torpedo . position . bearing) > 10 ? 'half' : torpedo . name === 'Fast' ? 'flank' : 'full');
		torpedo . targetDepth (torpedo . target . position . depth);
	};
};
