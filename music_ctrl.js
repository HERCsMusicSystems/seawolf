

var dialect = document . getElementById ('dialect');
var dialects = speechSynthesis . getVoices ();
var populateDialects = function () {
	if (dialect !== null) {
		for (var ind in dialects) {
			var el = document . createElement ('option');
			el . textContent = dialects [ind] . name;
			el . value = ind;
			dialect . appendChild (el);
		}
	}
};

speechSynthesis . onvoiceschanged = function () {dialects = speechSynthesis . getVoices (); populateDialects ();};
populateDialects ();

var create_audio = function (file, loop) {
	var div = document . createElement ('div');
	if (loop === undefined) loop = false;
	div . innerHTML = `
		<audio id="${file}_music" ${loop ? 'loop' : ''} >
			<source src="audio/${file}.wav" type="audio/wav" />
			<source src="audio/${file}.mp3" type="audio/mpeg" />
		</audio>`;
	document . body . appendChild (div);
	return document . getElementById (`${file}_music`);
};


var music = {
	ping_1: create_audio ('ping/ping_1'),
	akula: create_audio ('akula', true),
	Beowulf: create_audio ('01 Beowulf Main Title'),
	light: create_audio ('LetThereBeLight'),
	harpoonLaunch: create_audio ('harpoon_launch'),
	harpoonHit: create_audio ('harpoon_hit')
};

var PlayMusic = function (id) {music [id] . currentTime = 0; music [id] . play ();};
var PauseMusic = function (id) {music [id] . pause ();};
var LoopMusic = function (id, loop) {music [id] . loop = loop;};

var PlayMusicAndRemember = function (ind) {localStorage . setItem ('music', 'true'); PlayMusic (ind);};
var PauseMusicAndRemember = function (ind) {localStorage . setItem ('music', 'false'); PauseMusic (ind);};


var say = function (word) {
	word = new SpeechSynthesisUtterance (word);
	var dialect = Number (localStorage . getItem ('dialect'));
	word . voice = dialects [dialect . value];
	speechSynthesis . speak (word);
};

