
var sonarDetect = function (vessel) {
	this . code = function () {vessel . sonar . detect ();};
};

var torpedoAI = function (torpedo) {
	this . code = function (delta) {
		var sdelta = delta / 3600;
		torpedo . distance_travelled += torpedo . speed . x * sdelta;
		if (torpedo . distance_travelled >= this . range) {torpedo . damage (1); return;}
		if (torpedo . on_cable) {
			torpedo . distance_cable_travelled += torpedo . cable . speed . x * sdelta;
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_cable_travelled > torpedo . cable_to_ship_length) {
					torpedo . on_cable = false;
					torpedo . initial_trail_delta = trail_delta;
					torpedo . trail_length = trial_length;
			}
		}
		if (torpedo . target === null || torpedo . target . destroyed) return;
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.003) {torpedo . damage (1); torpedo . target . damage (1 + Math . random ()); return;}
		torpedo . targetBearing (nauticalBearing (vector . bearing));
		torpedo . setSpeed (Math . abs (torpedo . bearing_target - torpedo . position . bearing) > 10 ? 'slow' : torpedo . name === 'Fast' ? 'flank' : 'full');
	};
};
