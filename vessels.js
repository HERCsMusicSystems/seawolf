
var Oiler = function (name, country) {
	if (country === undefined) country = 'Bahamas';
	if (name === undefined) name = 'Oil Tanker';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Oil Tanker';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strength = 5;
};
inherit (Oiler, vessel);
Oiler . prototype . image = 'OilTanker';
Oiler . prototype . info = 'https://en.wikipedia.org/wiki/Oil_tanker';

var Virginia = function (name, country) {
	if (country === undefined) country = 'U.S.A.';
	vessel . call (this, country);
	this . class = 'Virginia';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 19, 25, 35];
	this . sonar = new sonar (this);
	this . inventory = {
		Mark48: {constructor: Mark48, count: 29},
		Harpoon: {constructor: Harpoon, count: 4, depth: 150},
		Tomahawk: {constructor: Tomahawk, count: 4, depth: 150}
	};
	this . tubes = build_tubes (this, {Mark48: ['Long Range', 'Fast'], Harpoon: ['Harpoon'], Tomahawk: ['Tomahawk']}, 4);
	this . silo = {
		Tomahawk: {constructor: Harpoon, amount: 12, depth: 150},
		Decoy: {constructor: Decoy, amount: 6}
	}
};
inherit (Virginia, vessel);
Virginia . prototype . image = 'Virginia';
Virginia . prototype . info = 'https://en.wikipedia.org/wiki/Virginia-class_submarine';
Virginia . prototype . names = ['SSN-774 Virginia', 'SSN-775 Texas', 'SSN-776 Hawaii', 'SSN-777 North Carolina', 'SSN-778 New Hampshire', 'SSN-779 New Mexico', 'SSN-780 Missouri', 'SSN-781 California', 'SSN-782 Mississippi', 'SSN-783 Minnesota', 'SSN-784 North Dakota', 'SSN-785 John Warner', 'SSN-786 Illinois', 'SSN-787 Washington', 'SSN-788 Colorado', 'SSN-789 Indiana', 'SSN-790 South Dakota', 'SSN-791 Delaware', 'SSN-792 Vermont', 'SSN-793 Oregon', 'SSN-794 Montana', 'SSN-795 Hyman G. Rickover', 'SSN-796 New Jersey', 'SSN-797 Iowa', 'SSN-798 Massachusetts', 'SSN-799 Idaho', 'SSN-800 Arkansas', 'SSN-801 Utah'];

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Акула';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
	this . inventory = {
		Mark48: {constructor: Mark48, count: 24},
		Mark46: {constructor: Mark48, count: 6}
	};
	this . tubes = build_tubes (this, {Mark48: ['Long Range', 'Fast'], Mark46: ['Wakehoming']}, 6);
	this . sonar = new sonar (this);
};
inherit (Akula, vessel);
Akula . prototype . image = 'Akula';
Akula . prototype . info = 'https://en.wikipedia.org/wiki/Akula-class_submarine';

var Sovremenny = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Современный'
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 15, 21, 28, 32.7];
	this . sonar = new sonar (this);
}
inherit (Sovremenny, vessel);
Sovremenny . prototype . image = 'Sovremenny';
Sovremenny . prototype . info = 'https://en.wikipedia.org/wiki/Sovremenny-class_destroyer';

/////////////
// Harpoon //
/////////////

var Harpoon = function (cable, name, country) {
	if (name === undefined) name = 'Harpoon';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'Harpoon';
	this . name = name;
	this . country = country;
	this . speeds = [467, 467, 467, 467, 467, 467, 467];
	this . ai = new HarpoonAI (this);
	this . target_type = 'surface';
	this . range = 150;
};
inherit (Harpoon, vessel);
Harpoon . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (tube . depth > vessel . position . depth) return false;
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -32, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

//////////////
// Tomahawk //
//////////////

var Tomahawk = function (cable, name, country) {
	if (name === undefined) name = 'Tomahawk';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'Tomahawk';
	this . name = name;
	this . country = country;
	this . speeds = [467, 467, 467, 467, 467, 467, 467];
	this . ai = new HarpoonAI (this);
	this . target_type = 'surface';
	this . range = 150;
};
inherit (Tomahawk, vessel);
Tomahawk . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (tube . depth > vessel . position . depth) return false;
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -32, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

///////////
// Decoy //
///////////

var Decoy = function (cable, name, country) {
	if (name === undefined) name = 'Decoy';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . type = 'submarine';
	this . class = 'Decoy';
	this . name = name;
	this . speeds = cable . speeds;
	this . noises = cable . noises;
	this . range = 2;
	var sp = cable . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	console . log (this . position);
	this . setSpeed ('full');
	this . ai = new DecoyAI (this);
	this . strength = 0.2;
};
inherit (Decoy, vessel);
Decoy . prototype . siloLaunch = function (silo, vessel, target) {
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

///////////////////////////////////////////////
// Mark 48                                   //
// Depth > 2600                              //
// Fast: 38km/55kn  Long Range: 50km/40kn    //
// Cable: 10nm / 5nm                         //
// Detection cone: 20 - 22 degrees           //
///////////////////////////////////////////////

var Mark48 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = cable;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Mark48';
	this . name = name;
	this . speeds = [0, 2, 10, 20, 30, 40, 55];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	if (name === 'Fast') this . range = 20;
	if (name === 'Long Range') {this . range = 27; this . speeds [6] = this . speeds [5];}
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . sonar = new sonar (this);
	// make everything visible
	//this . sonar . detection_threshold = 0;
	//this . sonar . tracking_threshold = 0;
	this . sonar . noiseLevelBearingCorrection = function (noise, bearing) {
		var org = bearing;
		bearing *= 10;
		if (bearing > Math . PI || bearing < - Math . PI) bearing = 0;
		else bearing = Math . cos (bearing * 0.5);
		return noise * bearing * bearing;
	};
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());}
	this . ai = new torpedoAI (this);
	this . distance_travelled = 0;
	this . distance_cable_travelled = 0;
	this . cable_length = 10; this . cable_to_ship_length = 5;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Mark48, vessel);
Mark48 . prototype . image = 'Mark48';
Mark48 . prototype . info = 'https://en.wikipedia.org/wiki/Mark_48_torpedo';

var Mark46 = function (cable, name, country) {};

var SeaLance = function (cable, name, country) {
	Mark48 . call (this, cable, name, country);
	this . ai = new RocketTorpedoAI (this);
	this . target_type = 'submarine';
};
inherit (SeaLance, Mark48);
SeaLance . prototype . image = 'Mark48';
SeaLance . prototype . info = 'https://en.wikipedia.org/wiki/UUM-125_Sea_Lance';
