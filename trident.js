
var tridents = [];

var addTrident = function (trident) {tridents . push (trident);};
var getTrident = function (name) {for (var ind in tridents) {if (tridents [ind] . name === name) return tridents [ind];}; return null;};
var removeTrident = function (trident) {trident . delete = true;};
var removeTridents = function () {var ind = 0; while (ind < tridents . length) {if (tridents [ind] . delete) tridents . splice (ind, 1); else ind ++;}};
var showTridents = function () {for (var ind in tridents) console . log (tridents [ind]); console . log ('====');};
var simulateTridents = function (delta) {for (var ind in tridents) tridents [ind] . simulate (delta);};
var drawTridents = function (ctx) {for (var ind in tridents) tridents [ind] . draw (ctx);};

var scaling = 0.5;

var drawGrid = function (ctx, width, height, triton) {
  width *= 0.5 / scaling; height *= 0.5 / scaling;
  var shift = triton === undefined ? {x: 0, y: 0} : {x: - triton . position . x, y: - triton . position . y};
  ctx . scale (scaling, scaling);
  ctx . translate (width + shift . x, height + shift . y);
  ctx . beginPath ();
  ctx . strokeStyle = 'yellow';
  var limit_left = - shift . x - width;
  var limit_right = - shift . x + width;
  var limit_top = - shift . y - height;
  var limit_bottom = - shift . y + height;
  var grid_left = Math . floor (limit_left / 128) * 128 + 128;
  var grid_right = Math . floor (limit_right / 128) * 128;
  var grid_top = Math . floor (limit_top / 128) * 128 + 128;
  var grid_bottom = Math . floor (limit_bottom / 128) * 128;
  for (var ind = grid_left; ind <= grid_right; ind += 128) {ctx . moveTo (ind, limit_top); ctx . lineTo (ind, limit_bottom);}
  for (var ind = grid_top; ind <= grid_bottom; ind += 128) {ctx . moveTo (limit_left, ind); ctx . lineTo (limit_right, ind);}
  ctx . stroke ();
};
