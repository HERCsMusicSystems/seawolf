////////////
// Sonars //
////////////

var TorpedoSonar = function (vessel) {
	sonar . call (this, vessel);
};
inherit (TorpedoSonar, sonar);
TorpedoSonar . prototype . ping_sound = 'torpedo_ping';

/////////////
// Vessels //
/////////////

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
	this . speeds = [0, 2, 8, 15, 19, 25, 30];
	this . sonar = new sonar (this);
	this . inventory = {
		Mark48: {constructor: Mark48, count: 29},
		Mark46: {constructor: Mark46, count: 16},
		Harpoon: {constructor: Harpoon, count: 4, depth: 150},
		Tomahawk: {constructor: Tomahawk, count: 4, depth: 150},
		Mark60CAPTOR: {constructor: Mark60CAPTOR, count: 4}
	};
	this . tubes = build_tubes (this, {Mark48: ['Long Range', 'Fast'], Mark46: ['Wakehoming'], Harpoon: ['Harpoon'], Tomahawk: ['Tomahawk'], Mark60CAPTOR: ['Mark60 CAPTOR']}, 4);
	this . silo = {
		Tomahawk: {constructor: Tomahawk, amount: 12, depth: 150},
		Decoy: {constructor: Decoy, amount: 6}
	};
	this . test_depth = 800;
	this . collapse_depth = 1200;
	this . collapse_depth_warning = 1000;
};
inherit (Virginia, vessel);
Virginia . prototype . image = 'Virginia';
Virginia . prototype . info = 'https://en.wikipedia.org/wiki/Virginia-class_submarine';
Virginia . prototype . names = ['SSN-774 Virginia', 'SSN-775 Texas', 'SSN-776 Hawaii', 'SSN-777 North Carolina', 'SSN-778 New Hampshire', 'SSN-779 New Mexico', 'SSN-780 Missouri', 'SSN-781 California', 'SSN-782 Mississippi', 'SSN-783 Minnesota', 'SSN-784 North Dakota', 'SSN-785 John Warner', 'SSN-786 Illinois', 'SSN-787 Washington', 'SSN-788 Colorado', 'SSN-789 Indiana', 'SSN-790 South Dakota', 'SSN-791 Delaware', 'SSN-792 Vermont', 'SSN-793 Oregon', 'SSN-794 Montana', 'SSN-795 Hyman G. Rickover', 'SSN-796 New Jersey', 'SSN-797 Iowa', 'SSN-798 Massachusetts', 'SSN-799 Idaho', 'SSN-800 Arkansas', 'SSN-801 Utah'];

var Seawolf = function (name, country) {
	if (country === undefined) country = 'U.S.A.';
	vessel . call (this, country);
	this . class = 'Seawolf';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 20, 25, 35];
	this . noises = [10, 120, 480, 2400, 4800, 48000, 480000];
	this . sonar = new sonar (this);
	this . inventory = {
		Mark48: {constructor: Mark48, count: 26},
		Harpoon: {constructor: Harpoon, count: 12, depth: 150},
		Tomahawk: {constructor: Tomahawk, count: 12, depth: 150}
	};
	this . tubes = build_tubes (this, {Mark48: ['Long Range', 'Fast'], Harpoon: ['Harpoon'], Tomahawk: ['Tomahawk']}, 8);
	this . silo = {Decoy: {constructor: Decoy, amount: 8}};
};
inherit (Seawolf, vessel);
Seawolf . prototype . image = 'Virginia';
Seawolf . prototype . info = 'https://en.wikipedia.org/wiki/Virginia-class_submarine';
Seawolf . prototype . names = ['SSN-21 Seawolf', 'SSN-22 Connecticut', 'SSN-23 Jimmy Carter'];

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Акула';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
	this . inventory = {
		Mark48: {constructor: Mark48, count: 24},
		Mark46: {constructor: Mark48, count: 6},
		SeaLance: {constructor: SeaLance, count: 6}
	};
	this . tubes = build_tubes (this, {Mark48: ['Long Range', 'Fast'], Mark46: ['Wakehoming'], SeaLance: ['Sea Lance']}, 6);
	this . sonar = new sonar (this);
};
inherit (Akula, vessel);
Akula . prototype . image = 'Akula';
Akula . prototype . info = 'https://en.wikipedia.org/wiki/Akula-class_submarine';
Akula . prototype . names = ['Akula', 'Bars', 'Ak Bars', 'Delfin', 'Barnaul', 'Kashalot', 'Pantera', 'Volk', 'Kit', 'Bratsk', 'Leopard', 'Tigr', 'Narval', 'Magadan', 'Vepr', 'Morzh', 'Kuzbass', 'Gepard', 'Kuguar', 'Rys', 'Drakon', 'Samara', 'Nerpa', 'Chakra', 'Iribis'];

var Sovremenny = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Современный'
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 15, 21, 28, 32.7];
	this . sonar = new sonar (this);
	this . silo = {
		SeaLance: {constructor: SeaLance, amount: 8, depth: 150}
	};
	this . inventory = {
		Mark48: {constructor: Mark48, count: 24}
	}
}
inherit (Sovremenny, vessel);
Sovremenny . prototype . image = 'Sovremenny';
Sovremenny . prototype . info = 'https://en.wikipedia.org/wiki/Sovremenny-class_destroyer';
Sovremenny . prototype . names = ['Sovremennyy', 'Otchayannyy', 'Otlichnyy',
'Osmotritelnyy', 'Bezuprechnyy', 'Boevoy', 'Stoykiy', 'Okrylyonnyy', 'Burnyy', 'Gremyashchiy',
'Veduschiy', 'Bystryy', 'Rastoropnyy','Bezboyaznennyy', 'Bezuderzhnyy',
'Bespokoynyy', 'Nastoychivyy', 'Moskovskiy Komsomolets', 'Admiral Ushakov', 'Besstrashnyy'];

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
	Harpoon . call (this, cable, name, country);
	this . class = 'Tomahawk';
	this . speeds = [480, 480, 480, 480, 480, 480, 480];
	this . ai = new TomahawkAI (this);
	this . range = 900;
};
inherit (Tomahawk, Harpoon);

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
	this . speeds = []; for (var ind in cable . speeds) this . speeds . push (cable . speeds [ind]);
	this . noises = []; for (var ind in cable . noises) this . noises . push (cable . noises [ind]);
	this . range = 2;
	var sp = cable . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
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

/////////////////////////
// Mark 60 CAPTOR mine //
/////////////////////////

var Mark60CAPTOR = function (cable, name, country) {
	if (name === undefined) name = 'Mark60 CAPTOR';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . type = 'mine';
	this . class = 'Mark60CAPTOR';
	this . name = name;
	this . range = 0.5;
	this . armed = false;
	this . armed_time = 200;
	this . cable = cable;
	this . noise = 0;
	this . ai = new mineAI (this, Mark48);
	var sp = cable . position;
	this . position = {x: sp . x, y: sp . y, depth: 1000, bearing: sp . bearing};
};
inherit (Mark60CAPTOR, vessel);
Mark60CAPTOR . prototype . image = 'Mark60CAPTOR_image';
Mark60CAPTOR . prototype . info = 'https://en.wikipedia.org/wiki/Mark_60_CAPTOR';
Mark60CAPTOR . prototype . launch = function (tube, vessel, target) {
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . setSpeed ('stop');
	addVessel (this);
	return true;
};
Mark60CAPTOR . prototype . NewCount = function (count) {return count - 2;};
Mark60CAPTOR . prototype . postLaunch = function (tube) {
	if (tube . second_mine === undefined) {
		tube . command = null;
		tube . second_mine = true;
		tube . flooded = 1;
		tube . torpedo = new Mark60CAPTOR (tube . vessel);
		if (tube . display_element !== null) {
			tube . display_element . bgColor = 'red';
			tube . display_element . innerHTML = `<img src="silhouettes/Mark60CAPTOR1.png" width="100"/>`;
		}
	} else {
		delete tube . second_mine;
		vessel . prototype . postLaunch (tube);
	}
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
	this . speeds = [0, 2, 10, 25, 40, 55, 55];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	if (name === 'Fast') this . range = 20;
	if (name === 'Long Range') {this . range = 27; this . speeds [5] = this . speeds [4];}
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . sonar = new TorpedoSonar (this);
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
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
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

var Mark46 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = null;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Mark46';
	this . name = name;
	this . speeds = [0, 2, 10, 20, 30, 40, 55];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 21];
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . ai = new wakehomingAI (this);
	this . distance_travelled = 0;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Mark46, vessel);
Mark46 . prototype . image = 'Mark46';
Mark46 . prototype . info = 'https://en.wikipedia.org/wiki/Mark_46_torpedo';
Mark46 . prototype . launch = function (tube, vessel, target) {
	if (waypoint === null) return false;
	this . target = null;
	this . target_waypoint = {position: {x: waypoint . position . x, y: waypoint . position . y}};
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . targetBearing (this . target_waypoint . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

var SeaLance = function (cable, name, country) {
	Harpoon . call (this, cable, name, country);
	this . class = 'SeaLance';
	this . ai = new RocketTorpedoAI (this);
	this . target_type = 'submarine';
	this . cable_length = 0;
	this . cable_to_ship_length = 0;
	this . speeds = [1000, 1000, 1000, 1000, 1000, 1000, 1000];
	this . torpedo_speeds = [0, 2, 10, 20, 30, 40, 55];
	this . torpedo_bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	this . range = 100;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . sonar = new sonar (this);
};
inherit (SeaLance, Harpoon);
SeaLance . prototype . image = 'SeaLance_rocket';
SeaLance . prototype . image_alt = 'SeaLance_torpedo';
SeaLance . prototype . info = 'https://en.wikipedia.org/wiki/UUM-125_Sea_Lance';
