
var ranks = {
  'U.S.A.': ['Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain'],
  'United Kingdom': ['Lieutenant', 'Lieutenant Commander', 'Commander', 'Captain', 'Commodore'],
  Russia: ['Капитан-лейтенант', 'Капитан третьего ранга', 'Капитан второго ранга', 'Капитан']
};

var promote = function () {
  var side_name = localStorage . getItem ('side');
  var side = JSON . parse (localStorage . getItem (side_name));
  var captain = side . captains [side . captain];
  var ret = 'No promotion this time.';
  console . log (captain . rank_id, ranks [side_name] . length);
  if (captain . rank_id < ranks [side_name] . length - 1) {
    captain . rank_id += 1;
    ret = `${captain . rank} ${side . captain} will be promoted to ${ranks [side_name] [captain . rank_id]}`;
    captain . rank = ranks [side_name] [captain . rank_id];
    localStorage . setItem (side_name, JSON . stringify (side));
  }
  return ret;
};