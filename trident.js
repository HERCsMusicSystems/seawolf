
var tridents = [];

var addTrident = function (trident) {tridents . push (trident);};
var getTrident = function (name) {for (var ind in tridents) {if (tridents [ind] . name === name) return tridents [ind];}; return null;};
var removeTrident = function (trident) {trident . delete = true;};
var removeTridents = function () {var ind = 0; while (ind < tridents . length) {if (tridents [ind] . delete) tridents . splice (ind, 1); else ind ++;}};
var showTridents = function () {for (var ind in tridents) console . log (tridents [ind]); console . log ('====');};
var simulateTridents = function (delta) {for (var ind in tridents) tridents [ind] . simulate (delta);};
var drawTridents = function (ctx) {for (var ind in tridents) tridents [ind] . draw (ctx);};
var classifyTridents = function (trident) {for (var ind in tridents) tridents [ind] . status = tridents [ind] . checkStatusOf (trident);};

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

var drawGrid = function (ctx, width, height, triton) {
  width *= 0.5; height *= 0.5;
  var mile = 128 * scaling;
  var shift = triton === undefined ? {x: 0, y: 0} : {x: - triton . position . x * mile, y: - triton . position . y * mile};
  ctx . translate (width + shift . x, height + shift . y);
  ctx . beginPath ();
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
