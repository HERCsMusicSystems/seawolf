
var background_music = SelectRandom (['akula', 'beowulf', 'story', 'promises']);

document . getElementById ('seawolf_game') . innerHTML = `
<div><canvas id="seawolf" onmousedown="javascript: return onMouseDown (event);" ondblclick="javascript: setWaypoint (event);" style="cursor: default;"/></div>

<div id="info" style="position: absolute; left: 8px; bottom: 8px; font-family: arial;">
	<table style="background: #0000ffb0; color: yellow;">
		<tr><td>Bearing:</td><td><div id="selected_bearing"/></td><td><div id="simulation_bearing"/></td>
			<td rowspan="5"><canvas id="thermocline_canvas" width="16"></td>
			<td rowspan="5"><div id="selected_image" style="text-align: center;"/></td></tr>
		<tr><td>Speed:</td><td><div id="selected_speed"/></td><td><div id="simulation_speed"/></td></tr>
		<tr><td>Depth:</td><td><div id="selected_depth"/></td><td><div id="simulation_depth"/></td></tr>
		<tr><td>Location:</td><td><div id="selected_distance"/></td><td><div id="selected_heading"/></td></tr>
		<tr><td>Thermoclines:</td><td colspan="2"><div id="thermoclines"/></td></tr>
	</table>
</div>

<div id="ctrl" style="position: absolute; top: 8px; right: 8px; font-family: arial;">
	<table style="background: #ff00ffb0; color: yellow;">
		<tr>
			<td>SPEED:</td>
			<td>
				<button onclick="javascript: simulated . setSpeed ('stop');">STOP</button>
				<button onclick="javascript: simulated . setSpeed ('slow');">SLOW</button>
				<button onclick="javascript: simulated . setSpeed ('one quarter');">1/4</button>
				<button onclick="javascript: simulated . setSpeed ('half');">1/2</button>
				<button onclick="javascript: simulated . setSpeed ('three quarters');">3/4</button>
				<button onclick="javascript: simulated . setSpeed ('full');">Full</button>
				<button onclick="javascript: simulated . setSpeed ('flank');">FLANK</button>
				<button onclick="javascript: simulation_ratio = 1;">&#xd7;1</button>
				<button onclick="javascript: simulation_ratio = 2;">&#xd7;2</button>
				<button onclick="javascript: simulation_ratio = 4;">&#xd7;4</button>
				<button onclick="javascript: simulation_ratio = 8;">&#xd7;8</button>
				<button onclick="javascript: simulation_ratio = 16;">&#xd7;16</button>
				<button onclick="javascript: MissionAbort ();">ABORT</button>
			</td>
		</tr>
		<tr>
			<td>DEPTH:</td>
			<td>
				<button onclick="javascript: simulated . targetDepth ('surface'); sayWords (simulated, 'Going to the surface.');">SURFACE</button>
				<button onclick="javascript: simulated . targetDepth ('periscope'); sayWords (simulated, 'Going to periscope depth.');">PERISCOPE</button>
				<button onclick="javascript: simulated . targetDepth ('attack'); sayWords (simulated, 'Going to attack depth.');">ATTACK</button>
				<button onclick="javascript: simulated . targetDepth ('up thermal'); sayWords (simulated, 'Going up one thermal.');">UP THERMAL</button>
				<button onclick="javascript: simulated . targetDepth ('down thermal'); sayWords (simulated, 'Going down one thermal.');">DOWN THERMAL</button>
				<button onclick="javascript: simulated . targetDepth ('test'); sayWords (simulated, 'Going to the test depth.');">TEST</button>
				<button onclick="javascript: simulated . targetDepth ('crush'); sayWords (simulated, 'Going to the collapse depth.');">COLLAPSE</button>
				<button onclick="javascript: PauseSimulation (); simulated . targetDepth (prompt ('Enter depth')); ResumeSimulation ();">SPECIFY</button>
			</td>
		</tr>
		<tr>
			<td>SONAR:</td>
			<td>
				<button onclick="javascript: simulated . sonar . ping ();">PING</button>
				<button id=deployTowedArray onclick="javascript: simulated . sonar . deployTowedArray (); document . getElementById ('cutTowedArray') . disabled = false; this . disabled = true;">DEPLOY TOWED ARRAY</button>
				<button id=retrieveTowedArray onclick="javascript: simulated . sonar . retrieveTowedArray (); this . disabled = true;" disabled>RETRIVE TOWED ARRAY</button>
				<button id=cutTowedArray onclick="javascript: simulated . sonar . cutTowedArray (); document . getElementById ('retrieveTowedArray') . disabled = true; this . disabled = true;" disabled>CUT TOWED ARRAY</button>
				<button onclick="javascript: if (localStorage . getItem ('music') === 'false') {PlayMusicAndRemember (background_music); this . innerText = 'MUSIC OFF';} else {PauseMusicAndRemember (background_music); this . innerText = 'MUSIC ON';}">${localStorage . getItem ('music') === 'false' ? 'MUSIC ON' : 'MUSIC OFF'}</button>
			</td>
		</tr>
		<tr>
			<td>WEAPON:</td>
			<td>
				<button onclick="javascript: detonateSelected ();">DETONATE</button>
				<button onclick="javascript: acquireSubmarineTarget ();">SEARCH SUB</button>
				<button onclick="javascript: acquireSurfaceTarget ();">SEARCH SURFACE</button>
				<!--<button onclick="javascript: matchDepth ();">MATCH DEPTH</button>
				<button onclick="javascript: matchDepth (0);">SURFACE</button>
				<button onclick="javascript: promptDepth ();">DEPTH</button>-->
				<button onclick="javascript: gotoWaypoint ();">GOTO</button>
				<button onclick="javascript: targetSelect ();">TARGET</button>
			</td>
		</tr>
	</table>
</div>

<div id="weapon_table" style="position: absolute; right: 8px; bottom: 8px; font-family: arial;"/>
`;

var inventory_info = null;

var update_inventory_info = function (vessel) {
	var inventory = '';
	for (var ind in vessel . inventory) inventory += `${ind}: ${vessel . inventory [ind] . count} `;
	inventory_info . innerHTML = inventory;
};

var fill_weapons_table = function (vessel) {
	var content = '<table style="background: #00ffffb0; color: yellow;">';
	for (var ind in vessel . tubes) {
		var tube = vessel . tubes [ind];
		var commands = '';
		for (var sub in tube . torpedoes) commands += `<option>${sub}</option>`;
		content += `
<tr>
	<td bgcolor=black width="100" id="tube_${ind}"></td>
	<td>
		<select id="command_${ind}">${commands}</select>
		<button onclick="javascript: simulated . tubes [${ind}] . load (document . getElementById ('command_${ind}') . value);">LOAD</button>
		<button onclick="javascript: simulated . tubes [${ind}] . flood ();">FLOOD</button>
		<button onclick="javascript: simulated . tubes [${ind}] . fire ((selected && selected . vessel) || waypoint, document . getElementById ('command_${ind}') . value);">FIRE</button>
		<button onclick="javascript: simulated . tubes [${ind}] . empty ();">EMPTY</button>
	</td>
</tr>
		`;
	}
	content += '<tr><td>Inventory</td><td id="inventory" bgcolor="blue"/></tr>';
	for (var ind in vessel . silo) {
		var image = vessel . silo [ind] . constructor . prototype . tube_image || vessel . silo [ind] . constructor . prototype . image;
		content += `<tr><td bgcolor=black width="100"><img src=silhouettes/${image}.png width=100/></td><td bgcolor=blue>
		<button style="width: 200px;" onclick="javascript: silo_launch (this, '${ind}');">LAUNCH ${ind}: ${vessel . silo [ind] . amount}</button>
		Maximum Depth = ${vessel . silo [ind] . depth}
		</td></tr>`;
	}
	content += '</table>';
	weapons . innerHTML = content;
	for (var ind in vessel . tubes) vessel . tubes [ind] . display_element = document . getElementById (`tube_${ind}`);
	inventory_info = document . getElementById ('inventory');
	update_inventory_info (vessel);
};

var vessels = [];
var remotes = {};

var missionStart = new Date ();
var missionTime = function () {return (new Date () - missionStart) / 1000;};

var simulated = null;
var selected = null;
var monitored = null;
var waypoint = null;
var simulation_ratio = 1;
var trail_length = 24;
var trail_delta = 15;
var ping = null;

var checkGameStatus = function () {};

var victory_in_progress = false;
var MissionVictory = function () {
	if (victory_in_progress) return; victory_in_progress = true;
	setTimeout (function () {
		PauseSimulation ();
		alert ("Victory");
		localStorage . setItem ('ChangesAllowed', 'true');
		if (window . location . pathname . indexOf ('Seawolf/') >= 0) {
			var address = window . location . pathname;
			var index = address . lastIndexOf ('Seawolf/') + 'Seawolf/' . length;
			window . location . assign (address . substring (0, index) + 'mission_victory.html');
		} else window . location . assign ('/mission_victory.html');
	}, 3000);
};

var MissionDefeat = function () {
	if (victory_in_progress) return; victory_in_progress = true;
	setTimeout (function () {
		PauseSimulation ();
		alert ("Defeat");
		localStorage . setItem ('ChangesAllowed', 'true');
		if (window . location . pathname . indexOf ('Seawolf/') >= 0) {
			var address = window . location . pathname;
			var index = address . lastIndexOf ('Seawolf/') + 'Seawolf/' . length;
			window . location . assign (address . substring (0, index) + 'mission_defeat.html');
		} else window . location . assign ('/mission_defeat.html');
	}, 3000);
};

var MissionAbort = function () {
	PauseSimulation ();
	if (confirm ('Do you wish to abort the mission?')) {
		localStorage . setItem ('ChangesAllowed', 'true');
		if (window . location . pathname . indexOf ('Seawolf/') >= 0) {
			var address = window . location . pathname;
			var index = address . lastIndexOf ('Seawolf/') + 'Seawolf/' . length;
			window . location . assign (address . substring (0, index) + 'mission_abort.html');
		} else window . location . assign ('/mission_abort.html');
	} else ResumeSimulation ();
};

var MissionLostAtSea = function () {
	if (victory_in_progress) return; victory_in_progress = true;
	setTimeout (function () {
		PauseSimulation ();
		alert ('Lost at sea');
		localStorage . setItem ('ChangesAllowed', 'true');
		if (window . location . pathname . indexOf ('Seawolf/') >= 0) {
			var address = window . location . pathname;
			var index = address . lastIndexOf ('Seawolf/') + 'Seawolf/' . length;
			window . location . assign (address . substring (0, index) + 'mission_lost_at_sea.html');
		} else window . location . assign ('/mission_lost_at_sea.html');
	}, 3000);
}

var addVessel = function (vessel) {vessels . push (vessel);};
var getVessel = function (name) {for (var ind in vessels) {if (vessels [ind] . name === name) return vessels [ind];}; return null;};
var removeVessel = function (vessel) {vessel . destroyed = true; if (selected && selected . vessel === vessel) selected = null; notifyVesselLost (vessel);};
var removeVessels = function () {var ind = 0; while (ind < vessels . length) {if (vessels [ind] . destroyed) vessels . splice (ind, 1); else ind ++;}};
var showVessels = function () {for (var ind in vessels) console . log (vessels [ind]); console . log ('====');};
var simulate = function (delta) {for (var ind in vessels) vessels [ind] . simulate (delta);};
var aiVessels = function (delta) {for (var ind in vessels) {if (vessels [ind] . ai !== null) vessels [ind] . ai . code (delta);}};
var halos = false;
var drawHalos = function (ctx) {
	var scc = scaling * 128;
	ctx . textBaseline = 'middle'; ctx . textAlign = 'center';
	for (var ind in vessels) {
		var vessel = vessels [ind];
		if (vessel !== simulated) {
			ctx . fillStyle = monitored === vessel ? '#44ff4444' : '#4444ff44';
			var xx = vessel . position . x * scc; var yy = vessel . position . y * scc;
			ctx . beginPath (); ctx . arc (xx, yy, 16, 0, Math . PI * 2); ctx . fill ();
			ctx . fillStyle = 'gold'; ctx . fillText (vessel . name, xx, yy);
		}
	}
	if (monitored && monitored . destroyed) monitored = null;
	if (monitored && monitored . sonar) monitored . sonar . DrawLines (ctx);
};
var drawVessels = function (ctx) {simulated . draw (ctx); simulated . sonar . drawDetected (ctx); if (halos) drawHalos (ctx);};
var classifyVessels = function (vessel) {for (var ind in vessels) vessels [ind] . status = vessels [ind] . checkStatusOf (vessel);};
var simulatedVessel = function (vessel) {
	if (localStorage . getItem ('ChangesAllowed') === 'true') location . href = 'mission_abort.html';
	simulated = vessel;
	vessel . ai = new sonarDetect (vessel);
	fill_weapons_table (vessel);
	localStorage . setItem ('ChangesAllowed', true);
};
var constructRemotes = function () {remotes = {}; for (var ind in vessels) remotes [vessels [ind] . name] = vessels [ind] . position; return JSON . stringify (remotes);};
var simulationHitTest = function (x, y, reference, minimum_distance) {
	if (minimum_distance === undefined) minimum_distance = 8 / 128 / scaling;
	x /= 128 * scaling; y /= 128 * scaling;
	x += reference . position . x; y += reference . position . y;
	var selected = null, distance = 16384;
	if (halos) {
		var subdistance = distance;
		for (var ind in vessels) {
			var v = vessels [ind];
			var xx = v . position . x - x; var yy = v . position . y - y;
			var d = Math . sqrt (xx * xx + yy * yy);
			if (d < subdistance) {monitored = v; subdistance = d;}
		}
	}
	for (var ind in reference . sonar . detected) {
		var v = reference . sonar . detected [ind], vv = v . vessel;
		if (vv !== reference) {
			var xx = vv . position . x - x, yy = vv . position . y - y;
			var d = Math . sqrt (xx * xx + yy * yy);
			if (d < distance) {selected = v; distance = d;}
		}
	}
	if (distance < minimum_distance) return selected;
	return null;
};
var explode = function (torpedo, range, depth, damage) {
	torpedo . explodeSound ();
	notifyExplosion (torpedo);
	removeVessel (torpedo);
	for (var ind in vessels) {
		var vessel = vessels [ind];
		if (! vessel . destroyed) {
			var vector = torpedo . getRelativePositionOf (vessel);
			if (vector . distance < range && Math . abs (vessel . position . depth - torpedo . position . depth) < depth) {
				notifyHit (vessel, torpedo . attacker);
				vessel . damage (damage);
			}
		}
	}
};

var nauticalBearing = function (angle) {angle *= 180 / Math . PI; angle += 90; while (angle < 0) angle += 360; while (angle >= 360) angle -= 360; return angle;};
var displayBearing = function (bearing) {bearing = Math . round (bearing); while (bearing < 0) bearing += 360; while (bearing >= 360) bearing -= 360; return bearing;};

var detonateSelected = function () {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) {waypoint = null; return;}
	notifyTargetDetonated (selected . vessel, simulated);
	selected . vessel . detonate ();
};
var matchDepth = function (depth) {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) return;
	if (depth === undefined) {if (simulated === null) return; selected . vessel . targetDepth (simulated . position . depth);}
	selected . vessel . targetDepth (depth);
};
var promptDepth = function () {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) return;
	PauseSimulation ();
	var depth = prompt ('Enter depth');
	ResumeSimulation ();
	if (depth !== null) selected . vessel . targetDepth (depth);
};
var acquireSubmarineTarget = function () {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) return;
	selected . vessel . target = null;
	selected . vessel . target_type = 'submarine';
};
var acquireSurfaceTarget = function () {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) return;
	selected . vessel . target = null;
	selected . vessel . target_type = 'surface';
	selected . vessel . targetDepth (0);
};
var gotoWaypoint = function () {
	if (waypoint === null || selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) {waypoint = null; return;}
	selected . vessel . setTarget (waypoint);
};
var default_select = true;
var targetSelect = function () {
	if (selected === null || selected . vessel . type !== 'torpedo' || selected . vessel . cable !== simulated) return;
	default_select = false; canvas . style . cursor = 'crosshair';
};

var findClosestTrail = function (torpedo) {
	var target = null;
	var target_trail = null;
	var distance = 1073741824;
	for (var ind in vessels) {
		var vessel = vessels [ind];
		if (vessel . type === 'surface') {
			for (var sub = 0; sub < vessel . trail . length; sub += 1) {
				var trail = vessel . trail [sub];
				var dx = torpedo . position . x - trail . x; dx *= dx;
				var dy = torpedo . position . y - trail . y; dy *= dy;
				var delta = Math . sqrt (dx + dy);
				if (delta < distance) {target = vessel; target_trail = sub; distance = delta;}
			}
		}
	}
	return {target: target, index: target_trail};
};

var thermoclines = [{depth: 160, attenuation: 0.01}, {depth: 320, attenuation: 0.01}, {depth: 600, attenuation: 0.001}, {depth: 1200, attenuation: 0.001}];

var scaling = 1;

var drawWaypoint = function (ctx) {
	ctx . strokeStyle = 'yellow';
	ctx . beginPath ();
	var mile = 128 * scaling;
	var x = waypoint . position . x * mile, y = waypoint . position . y * mile;
	ctx . moveTo (x - 8, y); ctx . lineTo (x - 2, y); ctx . moveTo (x + 2, y); ctx . lineTo (x + 8, y);
	ctx . moveTo (x, y - 8); ctx . lineTo (x, y - 2); ctx . moveTo (x, y + 2); ctx . lineTo (x, y + 8);
	ctx . stroke ();
};

var shiftMapPosition = function (ctx, width, height, vessel) {
	var half_width = width * 0.5;
	var half_height = height * 0.5;
	var mile = 128 * scaling;
	var shift = vessel === null ? {x: 0, y: 0} : {x: vessel . position . x * mile, y: vessel . position . y * mile};
	ctx . translate (half_width - shift . x, half_height - shift . y);
	shift . half_width = half_width;
	shift . half_height = half_height;
	return shift;
};

var DrawSquareMap = function (ctx, shift) {
	var mile = 128 * scaling;
	ctx . beginPath ();
	ctx . lineWidth = 1.5;
	ctx . strokeStyle = 'yellow';
	var limit_left = shift . x - shift . half_width;
	var limit_right = shift . x + shift . half_width;
	var limit_top = shift . y - shift . half_height;
	var limit_bottom = shift . y + shift . half_height;
	var grid_left = Math . floor (limit_left / mile) * mile + mile;
	var grid_right = Math . floor (limit_right / mile) * mile + 1;
	var grid_top = Math . floor (limit_top / mile) * mile + mile;
	var grid_bottom = Math . floor (limit_bottom / mile) * mile + 1;
	for (var ind = grid_left; ind < grid_right; ind += mile) {ctx . moveTo (ind, limit_top); ctx . lineTo (ind, limit_bottom);}
	for (var ind = grid_top; ind < grid_bottom; ind += mile) {ctx . moveTo (limit_left, ind); ctx . lineTo (limit_right, ind);}
	ctx . stroke ();
};

var Floor = function (position) {return 3000;};

var DrawGrid = DrawSquareMap;

var canvas = document . getElementById ('seawolf');
var ctx = canvas . getContext ('2d');
var thermocline_canvas = document . getElementById ('thermocline_canvas');
var ctc = thermocline_canvas . getContext ('2d');
var simulation_bearing = document . getElementById ('simulation_bearing');
var simulation_speed = document . getElementById ('simulation_speed');
var simulation_depth = document . getElementById ('simulation_depth');
var selected_bearing = document . getElementById ('selected_bearing');
var selected_speed = document . getElementById ('selected_speed');
var selected_depth = document . getElementById ('selected_depth');
// var selected_name = document . getElementById ('selected_name');
var selected_distance = document . getElementById ('selected_distance');
var selected_heading = document . getElementById ('selected_heading');
var selected_image = document . getElementById ('selected_image');
var thermocline_info = document . getElementById ('thermoclines');
var info = document . getElementById ('info');
var control_panel = document . getElementById ('ctrl');
var weapons = document . getElementById ('weapon_table');

var gamepads = [];
var previous_buttons = [];
var previous_axes = [];
var joystick_connection = function () {
	gamepads = navigator . getGamepads ();
	for (var ind in gamepads) {
		var gamepad = gamepads [ind];
		previous_axes [ind] = []; previous_buttons [ind] = [];
		for (var sub in gamepad . axes) previous_axes [ind] [sub] = gamepad . axes [sub];
		for (var sub in gamepad . buttons) previous_buttons [ind] [sub] = gamepad . buttons [sub] . pressed;
	}
};
window . addEventListener ('gamepadconnected', joystick_connection);
window . addEventListener ('gamepaddisconnected', joystick_connection);
var joystick_button = function (ind, value) {
	if (! value) return;
	switch (ind) {
		case 1: simulated . sonar . ping (); break;
		default: break;
	}
};
var joystick_axis = function (ind, value) {
	switch (ind) {
		case 3: simulated . setSpeed (Math . round ((1 - value) * 6 / 2)); break;
		default: break;
	}
};
var joystick = function () {
	for (var ind in gamepads) {
		var gamepad = gamepads [ind];
		for (var sub in gamepad . buttons) {
			if (gamepad . buttons [sub] . pressed !== previous_buttons [ind] [sub]) {previous_buttons [ind] [sub] = gamepad . buttons [sub] . pressed; joystick_button (Number (sub), previous_buttons [ind] [sub]);}
		}
		for (var sub in gamepad . axes) {
			if (gamepad . axes [sub] !== previous_axes [ind] [sub]) {previous_axes [ind] [sub] = gamepad . axes [sub]; joystick_axis (Number (sub), previous_axes [ind] [sub]);}
		}
	}
};

var time = Date . now ();

var previous_selected = null; var previous_status = '';

var DamageShift = 0;

var resize = function (delta) {
	joystick ();
	var now = Date . now ();
	if (delta === undefined) delta = (now - time) / 1000;
	time = now;
	canvas . width = window . innerWidth;
	canvas . height = window . innerHeight;
	for (var ind = 0; ind < simulation_ratio; ind += 1) {
		aiVessels (delta);
		simulate (delta);
		removeVessels ();
	}
	if (simulated === null || simulated . destroyed) MissionLostAtSea ();
	if (DamageShift != 0) {var alpha = Math . random () * Math . PI * 2; ctx . translate (Math . cos (alpha) * 20, Math . sin (alpha) * 20); DamageShift -= 1;};
	DrawGrid (ctx, shiftMapPosition (ctx, window . innerWidth, window . innerHeight, simulated));
	if (waypoint !== null) drawWaypoint (ctx);
	drawVessels (ctx);
	if (ping !== null) {
		var mile = 128 * scaling;
		ping . ping *= Math . pow (ping . attenuation, delta * simulation_ratio);
		if (ping . type === 'ping') {
			ctx . beginPath ();
				ctx . arc (ping . x * mile, ping . y * mile, Math . log10 (ping . ping) * 10, 0, Math . PI * 2);
				ctx . lineWidth = 1; ctx . strokeStyle = 'yellow';
			ctx . stroke ();
			ctx . fillStyle = 'yellow';
			ctx . fillText (ping . depth . toFixed () + 'ft', ping . x * mile + 4, ping . y * mile - 12);
		}
		if (ping . ping < 10) ping = null;
	}
	var bearing = displayBearing (simulated . position . bearing);
	simulation_bearing . innerHTML = bearing . toFixed (0);
	simulation_speed . innerHTML = simulated . speed . x . toFixed (0);
	simulation_depth . innerHTML = simulated . position . depth . toFixed (0);
	var thermocline_string = ''; for (var ind in thermoclines) thermocline_string += ' ' + thermoclines [ind] . depth;
	thermocline_info . innerHTML = thermocline_string;
	if (selected !== null && simulated . sonar . targetNoLongerAudible (selected . vessel)) selected = null;
	if (selected !== null) {
		var sv = selected . vessel;
		bearing = displayBearing (sv . position . bearing);
		selected_bearing . innerHTML = bearing . toFixed (0);
		selected_speed . innerHTML = sv . speed . x . toFixed (0);
		selected_depth . innerHTML = sv . position . depth . toFixed (0);
//		selected_name . innerHTML = selected . status === 'unknown' ? '<====>' : `${sv . name} (${sv . class} class)`;
		// selected_name . innerHTML = selected . status === 'unknown' ? '<====>' : `${sv . class}:`;
		var vector = simulated . getRelativePositionOf (sv);
		selected_distance . innerHTML = vector . distance . toFixed (2);
		bearing = displayBearing (vector . bearing * 180 / Math . PI + 90 - simulated . position . bearing);
		selected_heading . innerHTML = bearing + ` / ${(simulated . sonar . getNoiseOf (sv) * simulated . sonar . towed_array_current_amplification) . toFixed (2)}`;
//		selected_heading . innerHTML = '[' + bearing + '/' + simulated . sonar . getNoiseOf (sv) . toFixed (4) + ']';
		if (previous_selected !== selected || previous_status != selected . status) {
			selected_image . innerHTML = selected . status === 'unknown' ?
				'' :
				//'<img src="silhouettes/Default.png" style="max-width: 300px; max-height: 80px; display: block; width: auto; height: auto; margin-left: auto; margin-right: auto;"/>' :
				`<a href="${sv . info}" target="_blank"><img src="silhouettes/${sv . image}.png" style="max-width: 300px; max-height: 80px; display: block; width: auto; height: auto; margin-left: auto; margin-right: auto;"/></a><nobr>${sv . name}<br/>${sv . class}</nobr>`;
			previous_selected = selected;
			previous_status = selected . status;
		}
	} else {
		// selected_name . innerHTML = '<====>';
		selected_heading . innerHTML = '<>';
		selected_bearing . innerHTML = '<>';
		selected_speed . innerHTML = '<>';
		selected_depth . innerHTML = '<>';
		selected_distance . innerHTML = '<>';
		selected_image . innerHTML = '';
	}
	var floor = Floor (simulated . position) * 0.05;
	ctc . fillStyle = 'green';
	ctc . fillRect (0, 0, 16, floor);
	ctc . strokeStyle = 'yellow';
	ctc . beginPath ();
	for (var ind in thermoclines) {var d = thermoclines [ind] . depth * 0.05; ctc . moveTo (16, d); ctc . lineTo (0, d);}
	ctc . stroke ();
	ctc . beginPath (); var d = simulated . position . depth * 0.05; ctc . moveTo (0, d); ctc . lineTo (16, d); ctc . strokeStyle = 'red'; ctc . stroke ();
	ctc . fillStyle = 'white';
	ctc . fillRect (0, floor, 16, 200);
};

var simulation_interval = setInterval (resize, 50);

var PauseSimulation = function () {clearInterval (simulation_interval);};
var ResumeSimulation = function () {time = Date . now (); simulation_interval = setInterval (resize, 50);};

var ctrl = function (e) {
	var key = e . key . toLowerCase ();
	if (key === 'control' || key === 'r') return true;
	var ws = e . shiftKey ? control_panel . style : (e . ctrlKey || e . altKey) ? weapons . style : info . style;
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
//	console . log (key, e);
	return true;
};

var onWheel = function (e) {if (e . deltaY > 0) {if (scaling <= 0.32768) return; scaling /= 1.25;} else scaling *= 1.25; return false;};
var onMouseDown = function (e) {
	e . preventDefault ();
	if (e . buttons === 1) {
		var target = simulationHitTest (e . clientX - canvas . width * 0.5, e . clientY - canvas . height * 0.5, simulated);
		if (default_select || selected === null || selected . vessel . name !== 'torpedo' && selected . vessel . cable !== simulated) selected = target;
		else {
			if (target === null) return;
			default_select = true; selected . vessel . setTarget (target . vessel); canvas . style . cursor = 'default';
		}
		if (target !== null) checkGameStatus ('select', target . vessel);
	}
	if (e . buttons === 2) simulated . targetBearing ({x: e . clientX - canvas . width * 0.5, y: e . clientY - canvas . height * 0.5});
	return false;
};
var setWaypoint = function (e) {
	var mile = 128 * scaling;
	waypoint = new Waypoint ((e . clientX - canvas . width * 0.5) / mile + simulated . position . x, (e . clientY - canvas . height * 0.5) / mile + simulated . position . y, simulated . position . depth);
};

document . body . onkeydown = ctrl;
document . body . onwheel = onWheel;
document . body . oncontextmenu = function (event) {event . preventDefault ();};

localStorage . setItem ('logbook', JSON . stringify ([]));
