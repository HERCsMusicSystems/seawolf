
var rebez = function (floor, row, index, nf, step) {
	var ps = floor [row];
	var x = ps [index]; var y = ps [index + 1]; var z = ps [index + 2];
	x = (x + y) / 2; z = (z + y) / 2;
	for (var t = 0; t < 1; t += step) {
		var tt = 1 - t;
		var xy = t * y + tt * x;
		var yz = t * z + tt * y;
		var xyz = t * yz + tt * xy;
		nf . push (xyz);
	}
};

var resubez = function (floor, sub, nf, nff, step) {
	var xx = nf [sub]; var yy = nf [sub + 1]; var zz = nf [sub + 2];
	for (var t = 0; t < 1; t += step) {
		var row = [];
		for (var ind in xx) {
			var x = xx [ind]; var y = yy [ind]; var z = zz [ind];
			x = (x + y) / 2; z = (z + y) / 2;
			var tt = 1 - t;
			var xy = t * y + tt * x;
			var yz = t * z + tt * y;
			var xyz = t * yz + tt * xy;
			row . push (Math . round (xyz));
		}
		nff . push (row);
	}
};

var resample = function (floor, step) {
	var nf = [];
	for (var ind in floor) {
		var column = floor [ind];
		column . unshift (column [0]);
		column . push (column [column . length - 1]);
		var nc = [];
		for (var sub = 0; sub < column . length - 2; sub ++) rebez (floor, ind, sub, nc, step);
		nc . push (column [column . length - 1]);
		nf . push (nc);
	}
	nf . unshift (nf [0]);
	nf . push (nf [nf . length - 1]);
	var nff = [];
	for (var sub = 0; sub < nf . length - 2; sub ++) resubez (floor, sub, nf, nff, step);
	nff . push (nf [nf . length - 1]);
	return nff;
};


