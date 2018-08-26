
var tridents = [];

var addTrident = function (trident) {tridents . push (trident);};
var getTrident = function (name) {for (var ind in tridents) {if (tridents [ind] . name === name) return tridents [ind];}; return null;};
var removeTrident = function (trident) {trident . delete = true;};
var removeTridents = function () {var ind = 0; while (ind < tridents . length) {if (tridents [ind] . delete) tridents . splice (ind, 1); else ind ++;}};
var showTridents = function () {for (var ind in tridents) console . log (tridents [ind]); console . log ('====');};
var simulateTridents = function (delta) {for (var ind in tridents) tridents [ind] . simulate (delta);};
var drawTridents = function (ctx) {for (var ind in tridents) tridents [ind] . draw (ctx);};
