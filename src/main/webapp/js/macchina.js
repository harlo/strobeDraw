var canvas = document.getElementById("canvas");
var isOverCanvas = false;
var isDrawing = false;

var x;	// mouse x
var y;	// mouse y
var c1 = "black";
var c2 = "white";
var yourColor = c1;

var cometd = $.cometd;
var uID = "";

var tempArray = null;

function generateID() {
	var alpha = new Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
	uID += Math.floor(Math.random()*120);
	var rando = Math.floor(Math.random()*10);
	if (rando == 0) {
		rando = 3;
	}
	for(var i = 0; i < rando; i++) {
		uID += alpha[Math.floor(Math.random()*26)];
	}
	uID += Math.floor(Math.random()*29001);
	return uID;
}

function startDrawState() {
	// this function checks to see if the user's cursor is over the canvas.  if yes, the user can draw.
	
	isOverCanvas = true;
	document.addEventListener("mousedown",beginDraw,false);
	document.addEventListener("mouseup",endDraw,false);
}

function killDrawState() {
	// this function is called when the user's cursor is away from the canvas.  it disables everything.
	isOverCanvas = false;
	document.removeEventListener("mousedown",beginDraw,false);
	document.removeEventListener("mouseup",endDraw,false);
}

function beginDraw() {
	// this function marks the begining of a stroke being drawn
	isDrawing = true;
	tempArray = '{ "threadOrigin" : "' + uID + '" , "plot" : [ ';
	
	/*
	{ position : { 
		threadOrigin : uID,
		plot : [ { x: x , y: y }, {x:x , y:y } ]
	} }
	*/
}

function endDraw() {
	// this function stops the broadcasting clock and turns off make stroke
	isDrawing = false;
	
	// take off the last comma of our JSONstroke first!
	var sliceOff = tempArray.substring(0,tempArray.length -1);
	sliceOff += " ] }";
	//$('#log').append(sliceOff + "\n");
	var json = { position : sliceOff };
	
	// publish...
	cometd.publish('/drawing', json);
	
	// ... and save to file
	
	// reset
	tempArray = null;
	
}

function updateCanvas(data) {
	// this function updates all the messages...
	// **** PASSES updated messages, one by one, to the playBack() function
	var jsonStroke = JSON.parse(data);
	if(jsonStroke.threadOrigin != uID) {
		// 1. get the number of plot points
		// 2. in a for loop, pass them to the playback function

		for(i=0;i<jsonStroke.plot.length;i++) {
			playBack(jsonStroke.plot[i].x,jsonStroke.plot[i].y,jsonStroke.plot[i].color);
		}
	}
}

function playBack(other_x,other_y,color) {
	// this function regulates how each stroke (as JSON data) will be played back onto the screen,
	// giving the impression of a live drawing
	// **** TAKES JSON object as param
	setTimeout(function() {
		var svg = $('#canvas').svg('get');
		svg.circle(other_x, other_y, 10, {fill: color, stroke: 'none'});
	}, 100);
	
}

function getSubQuad(x,y) {
	return Math.round(x/10) + "," + Math.round(y/10);
}

function setBrushColor() {
	// this function analyzes the SVG to see the ratio of black pixels to white pixels,
	// setting the brush color accordingly
}
		
function initDrawing(svg) {
	// gets the current state of the drawing
	// * MODEL VIEW CONTROLLER? * look it up!
	setBrushColor();

}

function initCanvas() {
	// called onload, this function inits the canvas,
	// and populates the canvas with the current state of the drawing
	$("#canvas").svg({onLoad: initDrawing});
	var svg = $('#canvas').svg('get');
	
	var jsonStroke = JSON.parse(drawing);
	
	for(i=0;i<jsonStroke.oldStrokes.length;i++) {
		for(j=0;j<jsonStroke.oldStrokes[i].plot.length;j++) {
			svg.circle(jsonStroke.oldStrokes[i].plot[j].x, jsonStroke.oldStrokes[i].plot[j].y, 10, {fill: jsonStroke.oldStrokes[i].plot[j].color, stroke: 'none'});
		}
	}
	
}
