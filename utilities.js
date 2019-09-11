
var ranks = {
	'U.S.A.': ['Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
	'United Kingdom': ['Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain', 'Commodore'],
	Russia: ['Капитан-лейтенант', 'Капитан третьего ранга', 'Капитан второго ранга', 'Капитан']
};

var side_name = localStorage . getItem ('side');
var side = JSON . parse (localStorage . getItem (side_name));
var captain = side . captains [side . captain];

var promote = function () {
	var ret = '';
	if (captain . rank_id < ranks [side_name] . length - 1) {
		captain . rank_id += 1;
		ret = `${captain . rank} ${side . captain} will be promoted to ${ranks [side_name] [captain . rank_id]}`;
		captain . rank = ranks [side_name] [captain . rank_id];
		localStorage . setItem (side_name, JSON . stringify (side));
	}
	return ret;
};

var SimulatedMission = function () {
	if (localStorage . getItem ('mission_type') === 'Simulated' || captain . rank_id < 2) return true;
	return false;
};

var CheckAbort = function () {
	if (localStorage . getItem ('ChangesAllowed')) {
		if (confirm ('Abort')) location . href = 'mission_abort.html';
		return false;
	}
	return true;
};

var GenerateName = function (mission_name, vessel) {
	var mission = localStorage . getItem ('mission');
	var simulated_name = localStorage . getItem ('SimulatedName');
	if (simulated_name === 'null' || ! simulated_name) simulated_name = TakeRandom (vessel . prototype . names);
	var name = mission === mission_name ? simulated_name : TakeRandom (vessel . prototype . names);
	localStorage . setItem ('SimulatedName', name);
	localStorage . setItem ('mission', mission_name);
	return name;
};

var award = function (order) {
	captain . orders . push (order);
	localStorage . setItem (side_name, JSON . stringify (side));
	localStorage . setItem ('award', order);
};
