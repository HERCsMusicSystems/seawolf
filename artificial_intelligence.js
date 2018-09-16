
var sonarDetect = function (vessel) {
	this . code = function () {vessel . sonar . detect ();};
};

var torpedoAI = function (torpedo) {
	this . code = function (delta) {
		if (torpedo . on_leash) {
			var sdelta = delta / 3600;
			torpedo . distance_travelled += torpedo . speed . x * sdelta;
			torpedo . distance_launched_by_travelled += torpedo . launched_by . speed . x * sdelta;
			if (torpedo . distance_travelled > torpedo . cable_length || torpedo . distance_launched_by_travelled > torpedo . launched_by_cable_length) {
					torpedo . on_leash = false;
					torpedo . initial_trail_delta = trail_delta;
					torpedo . trail_length = trial_length;
			}
		}
		if (torpedo . target === null || torpedo . target . destroyed) return;
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.003) {torpedo . damage (1); torpedo . target . damage (1 + Math . random ()); return;}
		torpedo . position . bearing = nauticalBearing (vector . bearing);
	};
};
