
var logbook = [];
var log = function (text) {
  console . log ("LOOGBOOK: " + text);
  logbook . push ({time: new Date () . toLocaleString ('pt-PT'), message: text});
  localStorage . setItem ('logbook', JSON . stringify (logbook));
};

var notifyVesselLost = function (vessel) {log ("Vessel " + vessel . name + " (Class " + vessel . class + ") lost."); checkGameStatus ();};

var notifyPing = function (vessel) {sonar_ping . play ();};

var notifyTargetDetonated = function (detonated, detonator) {log (`${detonated . name} was detonated by ${detonator . name}.`);};

var notifyExplosion = function (vessel) {log (`${vessel . name} exploded.`);};

var notifyHit = function (target, attacker) {log (`${target . name} was hit by ${attacker . name}.`);};

var notifyRunOutOfFuel = function (vessel) {log (`${vessel . name} run out of fuel.`);};

var notifyNoMoreTorpedoes = function (type) {log (`No more ${type} torpedoes.`);};
