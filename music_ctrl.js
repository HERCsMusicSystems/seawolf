

var dialect = document . getElementById ('dialect');
var dialects = speechSynthesis . getVoices ();
if (dialect !== null) {
	for (var ind in dialects) {
		var el = document . createElement ('option');
		el . textContent = dialects [ind] . name;
		el . value = ind;
		dialect . appendChild (el);
	}
}

var create_audio = function (file) {
	var div = document . createElement ('div');
	div . innerHTML = `
		<audio id="${file}_music" loop >
			<source src="audio/${file}.wav" type="audio/wav" />
			<source src="audio/${file}.mp3" type="audio/mpeg" />
		</audio>`;
	document . body . appendChild (div);
	return document . getElementById (`${file}_music`);
};


var music = {
	akula: create_audio ('akula'),
	Beowulf: create_audio ('01 Beowulf Main Title'),
	light: create_audio ('LetThereBeLight')
};

var PlayMusic = function (id) {music [id] . play ();};
var PauseMusic = function (id) {music [id] . pause ();};
var LoopMusic = function (id, loop) {music [id] . loop = loop;};


var say = function (word) {word = new SpeechSynthesisUtterance (word); word . voice = dialects [dialect . value]; speechSynthesis . speak (word);};

