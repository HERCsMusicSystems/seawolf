
var sonarDetect = function (vessel) {
	this . code = function () {vessel . sonar . detect ();};
};

var torpedoAI = function (torpedo) {
	this . code = function () {
		if (torpedo . target === null || torpedo . target . destroyed) return;
		var vector = torpedo . getRelativePositionOf (torpedo . target);
		if (vector . distance < 0.003) {torpedo . damage (1); torpedo . target . damage (1 + Math . random ()); return;}
		torpedo . position . bearing = nauticalBearing (vector . bearing);
	};
};
