
var ranks = {
	'USA': ['Ensign', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
	'United Kingdom': ['Sub-lieutenant', 'Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain', 'Commodore'],
	Russia: ['Лейтенант', 'Старший лейтенант', 'Капитан-лейтенант', 'Капитан третьего ранга', 'Капитан второго ранга', 'Капитан']
};

var side_name = localStorage . getItem ('side');
var side = JSON . parse (localStorage . getItem (side_name));
var captain = side . captains [side . captain];

var SimulatedMission = function () {
	if (localStorage . getItem ('mission_type') === 'Simulated' || captain . rank_id < 2 || (captain . rank_id === 2 && localStorage . getItem ('promotion'))) return true;
	return false;
};

var MissionType = function () {return SimulatedMission () ? 'Simulated' : 'Real';};

var NextMission = function () {
	for (var ind in scenarios [side_name]) {
		var scenario = scenarios [side_name] [ind];
		var sub = 0, not_found = true;
		while (sub < captain . scenarios . length && not_found) {
			var mission = captain . scenarios [sub];
			if (scenario . Title === mission . mission && mission . status === 'Victory' && (mission . type === 'Real' || scenario . rank < 2)) not_found = false;
			sub += 1;
		}
		if (not_found) return scenario;
	}
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

var PossibleAward = function (order, probability, multiplier) {
	var orders = captain . orders;
	for (var ind in orders) {if (orders [ind] === order) probability *= multiplier;}
	if (Math . random () * probability < 1) award (order);
};

var promote = function () {
	if (captain . rank_id >= ranks [side_name] . length - 1)  return;
	captain . rank_id += 1;
	localStorage . setItem ('previous_rank', captain . rank);
	captain . rank = ranks [side_name] [captain . rank_id];
	localStorage . setItem (side_name, JSON . stringify (side));
	localStorage . setItem ('promotion', captain . rank);
};

var AwardName = function (award) {
	award = award . split ('-');
	award . shift ();
	return award . join (' ');
};

