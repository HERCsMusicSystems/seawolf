
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
	if (localStorage . getItem ('changesAllowed')) {
		if (confirm ('Abort')) location . href = 'mission_abort.html';
		return false;
	}
	return true;
};

