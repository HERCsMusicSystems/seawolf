
document . getElementById ('seawolf_game') . innerHTML = `
<div><canvas id="seawolf" onmousedown="javascript: return onMouseDown (event);"/></div>

<div id="info" style="position: absolute; left: 8px; top: 8px; font-family: arial;">
	<table style="background: #0000ffb0; color: yellow;">
		<tr>
			<td>Bearing:</td><td><div id="simulation_bearing"/></td><td><div id="selected_bearing"/></td>
		</tr>
		<tr>
			<td>Speed:</td><td><div id="simulation_speed"/></td><td><div id="selected_speed"/></td>
		</tr>
		<tr>
			<td>Depth:</td><td><div id="simulation_depth"/></td><td><div id="selected_depth"/></td>
		</tr>
		<tr>
			<td><div id="selected_name"/></td><td><div id="selected_distance"/></td><td><div id="selected_heading"/></td>
		</tr>
	</table>
</div>

<div id="ctrl" style="position: absolute; top: 8px; right: 8px; font-family: arial;">
	<table style="background: #ff00ffb0; color: yellow;">
		<tr>
			<td>SPEED:</td>
			<td>
				<input type="button" value="STOP" onclick="javascript: simulated . setSpeed ('stop');"/>
				<input type="button" value="SLOW" onclick="javascript: simulated . setSpeed ('slow');"/>
				<input type="button" value="1/4" onclick="javascript: simulated . setSpeed ('one quarter');"/>
				<input type="button" value="1/2" onclick="javascript: simulated . setSpeed ('half');"/>
				<input type="button" value="3/4" onclick="javascript: simulated . setSpeed ('three quarters');"/>
				<input type="button" value="FULL" onclick="javascript: simulated . setSpeed ('full');"/>
				<input type="button" value="FLANK" onclick="javascript: simulated . setSpeed ('flank');"/>
				<input type="button" value="FIRE" onclick="javascript: simulated . fire ();"/>
			</td>
		</tr>
		<tr>
			<td>DEPTH:</td>
			<td>
				<input type="button" value="SURFACE" onclick="javascript: simulated . targetDepth ('surface');"/>
				<input type="button" value="PERISCOPE" onclick="javascript: simulated . targetDepth ('periscope');"/>
				<input type="button" value="UP THERMAL" onclick="javascript: simulated . targetDepth ('up thermal');"/>
				<input type="button" value="DOWN THERMAL" onclick="javascript: simulated . targetDepth ('down thermal');"/>
				<input type="button" value="TEST" onclick="javascript: simulated . targetDepth ('test');"/>
				<input type="button" value="CRUSH" onclick="javascript: simulated . targetDepth ('crush');"/>
				<input type="button" value="SPECIFY" onclick="javascript: simulated . targetDepth (prompt ('Enter depth'));"/>
			</td>
		</tr>
	</table>
</div>
`;

var vessels = [];
var remotes = {};

var simulated = null;
var selected = null;
var simulation_ratio = 1;

var addVessel = function (vessel) {vessels . push (vessel);};
var getVessel = function (name) {for (var ind in vessels) {if (vessels [ind] . name === name) return vessels [ind];}; return null;};
var removeVessel = function (vessel) {vessel . delete = true;};
var removeVessels = function () {var ind = 0; while (ind < vessels . length) {if (vessels [ind] . delete) vessels . splice (ind, 1); else ind ++;}};
var showVessels = function () {for (var ind in vessels) console . log (vessels [ind]); console . log ('====');};
var simulate = function (delta) {for (var ind in vessels) vessels [ind] . simulate (delta);};
var aiVessels = function (delta) {for (var ind in vessels) {if (vessels [ind] . ai !== null) vessels [ind] . ai . code (delta);}};
var drawVessels = function (ctx) {for (var ind in vessels) vessels [ind] . draw (ctx);};
var classifyVessels = function (vessel) {for (var ind in vessels) vessels [ind] . status = vessels [ind] . checkStatusOf (vessel);};
var simulatedVessel = function (vessel) {simulated = vessel; classifyVessels (simulated);};
var constructRemotes = function () {remotes = {}; for (var ind in vessels) remotes [vessels [ind] . name] = vessels [ind] . position; return JSON . stringify (remotes);};
var simulationHitTest = function (x, y, reference, minimum_distance) {
  if (minimum_distance === undefined) minimum_distance = 8 / 128 / scaling;
  x /= 128 * scaling; y /= 128 * scaling;
  x += reference . position . x; y += reference . position . y;
  var selected = reference, distance = 16384;
  for (var ind in vessels) {
    vessels [ind] . selected = false;
    if (vessels [ind] !== reference) {
      var xx = vessels [ind] . position . x - x, yy = vessels [ind] . position . y - y;
      var d = Math . sqrt (xx * xx + yy * yy);
      if (d < distance) {selected = vessels [ind]; distance = d;}
    }
  }
  if (distance < minimum_distance) {selected . selected = true; return selected;}
  return null;
};

var nauticalBearing = function (angle) {angle *= 180 / Math . PI; angle += 90; while (angle < 0) angle += 360; while (angle >= 360) angle -= 360; return angle;};
var displayBearing = function (bearing) {bearing = Math . round (bearing); while (bearing < 0) bearing += 360; while (bearing >= 360) bearing -= 360; return bearing;};

var thermoclines = [{depth: 120, attenuation: 0.01}, {depth: 240, attenuation: 0.01}, {depth: 600, attenuation: 0.001}, {depth: 1200, attenuation: 0.001}];

var friends = {
  'USA': ['USA', 'Great Britain', 'Australia'],
  'Great Britain': ['Great Britain', 'Australia', 'USA'],
  'Australia': ['Australia', 'Great Britain', 'USA'],
  'Russia': ['Russia', 'India', 'China'],
  'China': ['China', 'Russia', 'India'],
  'India': ['India', 'Russia', 'China']
};

var enemies = {
  'USA': ['Russia', 'China', 'India'],
  'Great Britain': ['Russia', 'China', 'India'],
  'Australia': ['Russia', 'China', 'India'],
  'Russia': ['USA', 'Great Britain', 'Australia'],
  'China': ['USA', 'Great Britain', 'Australia'],
  'India': ['USA', 'Great Britain', 'Australia']
};

var scaling = 1;

var drawGrid = function (ctx, width, height, vessel) {
  width *= 0.5; height *= 0.5;
  var mile = 128 * scaling;
  var shift = vessel === undefined ? {x: 0, y: 0} : {x: - vessel . position . x * mile, y: - vessel . position . y * mile};
  ctx . translate (width + shift . x, height + shift . y);
  ctx . beginPath ();
  ctx . lineWidth = 1.5;
  ctx . strokeStyle = 'yellow';
  var limit_left = - shift . x - width;
  var limit_right = - shift . x + width;
  var limit_top = - shift . y - height;
  var limit_bottom = - shift . y + height;
  var grid_left = Math . floor (limit_left / mile) * mile + mile;
  var grid_right = Math . floor (limit_right / mile) * mile;
  var grid_top = Math . floor (limit_top / mile) * mile + mile;
  var grid_bottom = Math . floor (limit_bottom / mile) * mile;
  for (var ind = grid_left; ind <= grid_right; ind += mile) {ctx . moveTo (ind, limit_top); ctx . lineTo (ind, limit_bottom);}
  for (var ind = grid_top; ind <= grid_bottom; ind += mile) {ctx . moveTo (limit_left, ind); ctx . lineTo (limit_right, ind);}
  ctx . stroke ();
};

var canvas = document . getElementById ('seawolf');
var ctx = canvas . getContext ('2d');
var simulation_bearing = document . getElementById ('simulation_bearing');
var simulation_speed = document . getElementById ('simulation_speed');
var simulation_depth = document . getElementById ('simulation_depth');
var selected_bearing = document . getElementById ('selected_bearing');
var selected_speed = document . getElementById ('selected_speed');
var selected_depth = document . getElementById ('selected_depth');
var selected_name = document . getElementById ('selected_name');
var selected_distance = document . getElementById ('selected_distance');
var selected_heading = document . getElementById ('selected_heading');
var info = document . getElementById ('info');
var control_panel = document . getElementById ('ctrl');

var time = Date . now ();

var resize = function () {
	var now = Date . now ();
	canvas . width = window . innerWidth;
	canvas . height = window . innerHeight;
	var delta = (now - time) * simulation_ratio / 1000;
	aiVessels (delta);
	simulate (delta);
	removeVessels ();
	drawGrid (ctx, window . innerWidth, window . innerHeight, simulated);
	drawVessels (ctx);
	time = now;
	var bearing = Math . round (simulated . position . bearing); if (bearing < 0) bearing += 360; if (bearing >= 360) bearing -= 360;
	simulation_bearing . innerHTML = bearing;
	simulation_speed . innerHTML = simulated . speed . x;
	simulation_depth . innerHTML = simulated . position . depth . toFixed (0);
	if (selected !== null) {
		bearing = Math . round (selected . position . bearing); if (bearing < 0) bearing += 360; if (bearing >= 360) bearing -= 360;
		selected_bearing . innerHTML = bearing;
		selected_speed . innerHTML = selected . speed . x;
		selected_depth . innerHTML = selected . position . depth;
		selected_name . innerHTML = selected . name + ' (' + selected . class + ' class)';
		var vector = simulated . getRelativePositionOf (selected);
		selected_distance . innerHTML = vector . distance . toFixed (2);
		bearing = Math . round (vector . bearing * 180 / Math . PI + 90 - simulated . position . bearing);
		if (bearing < 0) bearing += 360; if (bearing >= 360) bearing -= 360;
		selected_heading . innerHTML = bearing;
	} else {
		selected_name . innerHTML = '====';
	}
};

setInterval (resize, 50);

var ctrl = function (e) {
	var key = e . key . toLowerCase ();
	if (key === 'control' || key === 'r') return true;
	var ws = e . shiftKey ? control_panel . style : info . style;
	switch (key) {
		case '0': simulated . setSpeed ('stop'); return true;
		case '1': simulated . setSpeed ('slow'); return true;
		case '2': simulated . setSpeed ('one quarter'); return true;
		case '3': simulated . setSpeed ('half'); return true;
		case '4': simulated . setSpeed ('three quarters'); return true;
		case '5': simulated . setSpeed ('full'); return true;
		case '6': simulated . setSpeed ('flank'); return true;
		case 'z': simulation_ratio = 1; return true;
		case 'x': simulation_ratio = 2; return true;
		case 'c': simulation_ratio = 4; return true;
		case 'v': simulation_ratio = 8; return true;
		case 'q': simulated . targetDepth ('surface'); return true;
		case 'w': simulated . targetDepth ('periscope'); return true;
		case 'e': simulated . targetDepth ('up thermal'); return true;
		case 'r': simulated . targetDepth ('down thermal'); return true;
		case 't': simulated . targetDepth ('test'); return true;
		case 'y': simulated . targetDepth ('crush'); return true;
		case 'arrowright': e . preventDefault (); ws . left = null; ws . right = '8px'; return true;
		case 'arrowleft': e . preventDefault (); ws . right = null; ws . left = '8px'; return true;
		case 'arrowdown': e . preventDefault (); ws . top = null; ws . bottom = '8px'; return true;
		case 'arrowup': e . preventDefault (); ws . bottom = null; ws . top = '8px'; return true;
		default: break;
	}
	console . log (key, e);
	return true;
};

var onWheel = function (e) {if (e . deltaY > 0) {if (scaling <= 0.32768) return; scaling /= 1.25;} else scaling *= 1.25; return false;};
var onMouseDown = function (e) {
	e . preventDefault ();
	if (e . buttons === 1) selected = simulationHitTest (e . clientX - canvas . width * 0.5, e . clientY - canvas . height * 0.5, simulated);
	if (e . buttons === 2) simulated . targetBearing ({x: e . clientX - canvas . width * 0.5, y: e . clientY - canvas . height * 0.5});
	return false;
};

document . body . onkeydown = ctrl;
document . body . onwheel = onWheel;
document . body . oncontextmenu = function (event) {event . preventDefault ();};
