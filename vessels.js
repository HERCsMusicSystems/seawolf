
var Virginia = function (name, country) {
	if (country === undefined) country = 'USA';
	vessel . call (this, country);
	this . class = 'Virginia';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 19, 25, 35];
  this . tubes = build_tubes (4);
};
Virginia . prototype = Object . create (vessel . prototype);

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Akula';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
  this . tubes = build_tubes (6);
};
Akula . prototype = Object . create (vessel . prototype);

var Mark48 = function (name, country) {
  if (country === undefined) country = 'USA';
  vessel . call (this, country);
  this . type = 'torpedo';
  this . class = 'Mark48';
  this . name = name;
  this . speeds = [0, 2, 8, 40, 40, 55, 55];
};
Mark48 . prototype = Object . create (vessel . prototype);

var torpedoAI = function (torpedo, target) {
	return function () {
		var bearing = torpedo . getRelativePositionOf (target) . bearing * 180 / Math . PI + 90;
		if (bearing < 0) bearing += 360; if (bearing >= 360) bearing -= 360;
		torpedo . position . bearing = bearing;
	};
};

