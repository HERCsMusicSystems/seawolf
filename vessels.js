
var Oiler = function (name, country) {
	if (country === undefined) country = 'Bahamas';
	if (name === undefined) name = 'Oil Tanker';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Oil Tanker';
	this . speeds = [0, 1, 4, 8, 12, 16, 18];
	this . strength = 5;
};
Oiler . prototype = Object . create (vessel . prototype);

var Virginia = function (name, country) {
	if (country === undefined) country = 'USA';
	vessel . call (this, country);
	this . class = 'Virginia';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 19, 25, 35];
	this . sonar = new sonar (this);
	this . inventory = {
		Mark48: {constructor: Mark48, count: 24},
		Mark46: {constructor: Mark48, count: 6}
	};
	this . tubes = build_tubes (this, {Mark48: ['Fast', 'Long Range'], Mark46: ['Wakehoming']}, 4);
};
Virginia . prototype = Object . create (vessel . prototype);

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Akula';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
	this . tubes = build_tubes (6);
	this . sonar = new sonar (this);
};
Akula . prototype = Object . create (vessel . prototype);

var Mark48 = function (launched_by, name, country) {
	if (country === undefined) country = launched_by . country;
	vessel . call (this, country);
	this . launched_by = launched_by;
	this . type = 'torpedo';
	this . class = 'Mark48';
	this . name = name;
	this . speeds = [0, 2, 8, 40, 40, 55, 55];
	this . strength = 1;
	this . sonar = new sonar (this);
	this . ai = new torpedoAI (this);
};
Mark48 . prototype = Object . create (vessel . prototype);
