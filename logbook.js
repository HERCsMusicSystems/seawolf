
var tbody = document . getElementById ('LogBook');

var logbook = JSON . parse (localStorage . getItem ('logbook'));

var row = document . createElement ('tr');
var cell = document . createElement ('td'); cell . appendChild (document . createTextNode ('TIME')); row . appendChild (cell);
cell = document . createElement ('td'); cell . appendChild (document . createTextNode ('MESSAGE')); row . appendChild (cell);
tbody . appendChild (row);

for (var ind in logbook) {
	var row = document . createElement ('tr');
	var cell = document . createElement ('td');
	cell . appendChild (document . createTextNode (logbook [ind] . time));
	row . appendChild (cell);
	cell = document . createElement ('td');
	cell . appendChild (document . createTextNode (logbook [ind] . message));
	row . appendChild (cell);
	tbody . appendChild (row);
}