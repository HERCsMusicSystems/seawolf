
var vessels = [];

var addVessel = function (vessel) {vessels . push (vessel);};
var getVessel = function (name) {for (var ind in vessels) {if (vessels [ind] . name === name) return vessels [ind];}; return null;};
var removeVessel = function (vessel) {vessel . delete = true;};
var removeVessels = function () {var ind = 0; while (ind < vessels . length) {if (vessels [ind] . delete) vessels . splice (ind, 1); else ind ++;}};
var showVessels = function () {for (var ind in vessels) console . log (vessels [ind]); console . log ('====');};
var simulate = function (delta) {for (var ind in vessels) vessels [ind] . simulate (delta);};
var drawVessels = function (ctx) {for (var ind in vessels) vessels [ind] . draw (ctx);};
var classifyVessels = function (vessel) {for (var ind in vessels) vessels [ind] . status = vessels [ind] . checkStatusOf (vessel);};

var thermoclines = [{depth: 120, attenuation: 0.01}, {depth: 240, attenuation: 0.01}, {depth: 600, attenuation: 0.001}, {depth: 1200, attenuation: 0.001}];

var friends = {
  'USA': ['USA', 'Great Britain', 'Australia'],
  'Great Britain': ['Great Britain', 'Australia', 'USA'],
  'Australia': ['Australia', 'Great Britain', 'USA'],
  'Russia': ['Russia', 'India', 'China'],
  'China': ['China', 'Russia', 'India'],
  'India': ['India', 'Russia', 'China']
};

var enemies = {
  'USA': ['Russia', 'China', 'India'],
  'Great Britain': ['Russia', 'China', 'India'],
  'Australia': ['Russia', 'China', 'India'],
  'Russia': ['USA', 'Great Britain', 'Australia'],
  'China': ['USA', 'Great Britain', 'Australia'],
  'India': ['USA', 'Great Britain', 'Australia']
};

var scaling = 1;

var drawGrid = function (ctx, width, height, vessel) {
  width *= 0.5; height *= 0.5;
  var mile = 128 * scaling;
  var shift = vessel === undefined ? {x: 0, y: 0} : {x: - vessel . position . x * mile, y: - vessel . position . y * mile};
  ctx . translate (width + shift . x, height + shift . y);
  ctx . beginPath ();
  ctx . lineWidth = 1.5;
  ctx . strokeStyle = 'yellow';
  var limit_left = - shift . x - width;
  var limit_right = - shift . x + width;
  var limit_top = - shift . y - height;
  var limit_bottom = - shift . y + height;
  var grid_left = Math . floor (limit_left / mile) * mile + mile;
  var grid_right = Math . floor (limit_right / mile) * mile;
  var grid_top = Math . floor (limit_top / mile) * mile + mile;
  var grid_bottom = Math . floor (limit_bottom / mile) * mile;
  for (var ind = grid_left; ind <= grid_right; ind += mile) {ctx . moveTo (ind, limit_top); ctx . lineTo (ind, limit_bottom);}
  for (var ind = grid_top; ind <= grid_bottom; ind += mile) {ctx . moveTo (limit_left, ind); ctx . lineTo (limit_right, ind);}
  ctx . stroke ();
};
