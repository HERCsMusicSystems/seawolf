

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
