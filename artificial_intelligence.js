
var torpedoAI = function (torpedo, target) {
	var closest = 100;
	this . code = function () {
		var vector = torpedo . getRelativePositionOf (target);
		if (vector . distance < 0.003) {torpedo . damage (1); target . damage (1 + Math . random ()); return;}
		torpedo . position . bearing = nauticalBearing (vector . bearing);
	};
};
