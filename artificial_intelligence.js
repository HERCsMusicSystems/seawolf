
var torpedoAI = function (torpedo, target) {
	var closest = 100;
	this . code = function () {
		var vector = torpedo . getRelativePositionOf (target);
		if (vector . distance < 0.003) {removeVessel (torpedo); removeVessel (target); return;}
		torpedo . position . bearing = nauticalBearing (vector . bearing);
	};
};
