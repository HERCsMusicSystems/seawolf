
var triton = function () {
	this . position = {x: 0, y: 0, depth: 0, bearing: 0};
	this . speed = {x: 1, y: 0};
	var trail_delta = 5;
	this . move = function (delta) {
		this . position . x += delta * (Math . cos (this . position . bearing) * this . speed . x - Math . sin (this . position . bearing) * this . speed . y);
		this . position . y += delta * (Math . cos (this . position . bearing) * this . speed . y + Math . sin (this . position . bearing) * this . speed . x);
		trail_delta --;
		if (trail_delta < 1) {console . log (this . position); this . trail . push ({x: this . position . x, y: this . position . y}); trail_delta = 5;}
	};
	this . selected = false;
	this . trail = [];
	this . draw = function (ctx) {
		ctx . strokeStyle = 'white';
		ctx . lineWidth = 1;
		for (var ind in this . trail) {
			ctx . beginPath ();
			ctx . arc (this . trail [ind] . x, this . trail [ind] . y, 1, 0, 6.28);
			ctx . stroke ();
		}
		ctx . strokeStyle = 'red';
		ctx . lineCap = 'square';
		ctx . lineWidth = this . selected ? 3 : 2;
		ctx . beginPath ();
		ctx . arc (this . position . x, this . position . y, 2, 0, 6.28);
		ctx . moveTo (this . position . x + 8, this . position . y - 8);
		ctx . lineTo (this . position . x + 8, this . position . y + 8);
		ctx . lineTo (this . position . x - 8, this . position . y + 8);
		ctx . lineTo (this . position . x - 8, this . position . y - 8);
		ctx . lineTo (this . position . x + 8, this . position . y - 8);
		ctx . stroke ();
	};
};

