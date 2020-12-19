
var logbook = [];
var log = function (text) {
	console . log ("LOOGBOOK: " + text);
	logbook . push ({time: new Date () . toLocaleString ('pt-PT'), message: text});
	localStorage . setItem ('logbook', JSON . stringify (logbook));
};

var notifyVesselLost = function (vessel) {
	var colour = statusColours [simulated . checkStatusOf (vessel)];
	log (`Vessel <font color="${colour}"><b>${vessel . name}</b></font> (Class ${vessel . class}) <font color="${colour}"><b>lost</b></font>.`);
	checkGameStatus ('lost', vessel);
};

var notifyPing = function (vessel) {};

var notifyTargetDetonated = function (detonated, detonator) {log (`${detonated . name} was detonated by ${detonator . name}.`);};

var notifyExplosion = function (vessel) {log (`${vessel . name} exploded.`);};

var notifyHit = function (target, attacker) {
	var colour = statusColours [simulated . checkStatusOf (target)];
	log (`<font color="${colour}"><b>${target . name} was hit</b></font> by ${attacker . name}.`);
	checkGameStatus ('hit', target, attacker);
};

var notifyRunOutOfFuel = function (vessel) {log (`${vessel . name} run out of fuel.`);};

var notifyNoMoreTorpedoes = function (vessel, torpedo) {sayWords (vessel, `No more ${torpedo . class} ${torpedo . type}s.`);};
