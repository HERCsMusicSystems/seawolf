
var triton = function () {
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 1, y: 0};
	this . trail_delta = 0;
	this . selected = false;
	this . delete = false;
	this . trail = [];
};

triton . prototype . move = function (delta) {
	this . trail_delta --;
	if (this . trail_delta < 1) {this . trail . push ({x: this . position . x, y: this . position . y}); this . trail_delta = 5;}
	this . position . x += delta * (Math . cos (this . position . bearing) * this . speed . x - Math . sin (this . position . bearing) * this . speed . y);
	this . position . y += delta * (Math . cos (this . position . bearing) * this . speed . y + Math . sin (this . position . bearing) * this . speed . x);
};

triton . prototype . simulate = function (delta) {this . move (delta);};

triton . prototype . draw = function (ctx) {
	ctx . strokeStyle = 'white';
	ctx . lineWidth = 1;
	for (var ind in this . trail) {
		ctx . beginPath ();
		ctx . arc (this . trail [ind] . x, this . trail [ind] . y, 1, 0, 6.28);
		ctx . stroke ();
	}
	ctx . strokeStyle = 'red';
	ctx . fillStyle = 'red';
	ctx . lineCap = 'square';
	ctx . lineWidth = this . selected ? 3 : 2;
	ctx . beginPath (); ctx . arc (this . position . x, this . position . y, 2, 0, 6.28); ctx . fill ();
	ctx . beginPath ();
	ctx . moveTo (this . position . x + 8, this . position . y - 8);
	ctx . lineTo (this . position . x + 8, this . position . y + 8);
	ctx . lineTo (this . position . x - 8, this . position . y + 8);
	ctx . lineTo (this . position . x - 8, this . position . y - 8);
	ctx . lineTo (this . position . x + 8, this . position . y - 8);
	ctx . stroke ();
};

var Virginia = function (name) {
	triton . call (this);
	this . class = 'Virginia';
	this . name = name;
};
Virginia . prototype = Object . create (triton . prototype);
/*
var create_triton = function (triton_class, name) {
	var triton = function () {triton_class . call (this); this . name = name;};
	triton . prototype = Object . create (triton_class . prototype);
	return triton;
};

var VirginiaClass = function () {
	triton . call (this);
	this . class = 'Virginia';
}
VirginiaClass . prototype = Object . create (triton . prototype);

var Virginia = create_triton (VirginiaClass, 'Virginia');
var Hawaii = create_triton (VirginiaClass, 'Hawaii');
var Texas = create_triton (VirginiaClass, 'Texas');
*/
