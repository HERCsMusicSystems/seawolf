
var logbook = [];
var log = function (text) {
	console . log ("LOOGBOOK: " + text);
	logbook . push ({time: new Date () . toLocaleString ('pt-PT'), message: text});
	localStorage . setItem ('logbook', JSON . stringify (logbook));
};

var notifyVesselLost = function (vessel) {
	var colour = statusColours [simulated . checkStatusOf (vessel)];
	log (`Vessel <font color="${colour}"><b>${vessel . name}</b> [Class ${vessel . class}]</font> lost.`);
	checkGameStatus ('lost', vessel);
};

var notifyTorpedoLaunch = function (tube, torpedo) {
	var colour = statusColours [simulated . checkStatusOf (tube . vessel)];
	var TorpedoColour = statusColours [simulated . checkStatusOf (torpedo)];
	if (torpedo . target) {
		var EnemyColour = statusColours [simulated . checkStatusOf (torpedo . target)];
		log (`<font color="${colour}"><b>${tube . vessel . name}</b> [Class ${tube . vessel . class}]</font> launched <font color="${TorpedoColour}"><b>${torpedo . name}</b> [Class ${torpedo . class}]</font> at <font color="${EnemyColour}"><b>${torpedo . target . name}</b></font>.`);
	} else log (`<font color="${colour}"><b>${tube . vessel . name}</b> [Class ${tube . vessel . class}]</font> launched <font color="${TorpedoColour}"><b>${torpedo . name}</b> [Class ${torpedo . class}]</font>.`);
};

var notifyPing = function (vessel) {};

var notifyTargetDetonated = function (detonated, detonator) {log (`${detonated . name} was detonated by ${detonator . name}.`);};

var notifyExplosion = function (vessel) {
	var colour = statusColours [simulated . checkStatusOf (vessel)];
	log (`<font color="${colour}"><b>${vessel . name}</b> [Class ${vessel . class}]</font> exploded.`);
};

var notifyHit = function (target, attacker) {
	var colour = statusColours [simulated . checkStatusOf (target)];
	var AttackerColour = statusColours [simulated . checkStatusOf (attacker)];
	log (`<font color="${colour}"><b>${target . name}</b> [Class ${target . class}]</font> was hit by <font color="${AttackerColour}"><b>${attacker . name}</b> [Class ${attacker . class}]</font>.`);
	checkGameStatus ('hit', target, attacker);
};

var notifyRunOutOfFuel = function (vessel) {log (`${vessel . name} run out of fuel.`);};

var notifyNoMoreTorpedoes = function (vessel, torpedo) {sayWords (vessel, `No more ${torpedo . class} ${torpedo . type}s.`);};
