
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

var middle = {x:0, y:0}; //middle of the page, all coords will relative to this location

var hexRadius = 20;		  //not 20, overwritten constantly based on page resizing

const hexAngle = Math.PI * 2/3;
const sqrt3 = Math.sqrt(3); //commonly used constant for hexagonal calculations

var gridLength = 6;  //how many hexagons on each side of the large hexagon
var startMines = 10; //starting amount of mines


//the clicked hex during the mousedown even
//will be an invalid hex if no Hex was clicked
var leftClickedHex = new Hex(0); //Hex(0) creates an unusable Hex
var rightClickedHex = new Hex(0);


var grid;   //HexGrid object
var drawer; //drawer Object
//var inputManager;
var mouseCode = {left: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? 1:0, right : 2}; //normalized mouseCodes for IE
var gameInitialized = false;

function init()
{
	$('body').on('contextmenu', '#canvas1', function(e){ return false; });

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	grid = new HexGrid(gridLength, hexRadius);
	resizeGraphics();
	drawer = new Drawer(ctx);
	//grid.initMines(startMines);
	//inputManager = new InputManager();
}

function resizeGraphics()
{
	var hexSideSize = Math.min(ctx.canvas.width*.95/2, ctx.canvas.height*.95/sqrt3);
	hexRadius = hexSideSize/gridLength/2;

	middle.x = ctx.canvas.width/2;
	middle.y = ctx.canvas.height/2;

	grid.initHexPositions(hexRadius);
}

//additional processing for the event data, compatible with firefox/chrome
function getXYfromEvent(e)
{
	var result = {x:0, y:0};
	if (e.pageX || e.pageY) { 
	  result.x = e.pageX;
	  result.y = e.pageY;
	}
	else { 
	  result.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  result.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	result.x -= canvas.offsetLeft;
	result.y -= canvas.offsetTop;
	return result;
}

//determines what hexagon was selected when the mouse button is pressed
function mouseDown(event)
{
	point = getXYfromEvent(event);//{x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};
	if (event.button === mouseCode.left)
	{
		if (rightClickedHex.valid) return; //user currently right clicking
		grid.iterateList(function(hex) {
			if (!hex.checkCollision(point))
			{
				leftClickedHex = hex;
			}
		});
	}

	if (event.button === mouseCode.right)
	{
		if (leftClickedHex.valid) return; //user currently left clicking
		grid.iterateList(function(hex) {
			if (!hex.checkCollision(point))
			{
				rightClickedHex = hex;
			}
		});
	}
}

//ensures that the hexagon being selected is the same as the one pressed during the mouseDown
//event and if so runs the clickHex function
function mouseUp(event)
{
	point = getXYfromEvent(event);//{x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};
	//console.log(point.x+","+point.y); debug
	if (event.button === mouseCode.left && leftClickedHex.valid)
	{
		grid.iterateList(function(hex) { //inneficient, to be fixed
			if (!hex.checkCollision(point))
			{
				if (hex==leftClickedHex) leftClickHex(hex);
			}
		});

		leftClickedHex = new Hex(0);
	}

	if (event.button === mouseCode.right && rightClickedHex.valid)
	{
		grid.iterateList(function(hex) {
			if (!hex.checkCollision(point))
			{
				if (hex==rightClickedHex) rightClickHex(hex);
			}
		});

		rightClickedHex = new Hex(0);
	}
}

function leftClickHex(hex)
{
	if (!gameInitialized)
	{
		gameInitialized = true;
		grid.initMines(startMines, hex);
	}
	hex.reveal();
}

function rightClickHex(hex)
{
	hex.mark();
}

function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (ctx.canvas.width != window.innerWidth ||
		ctx.canvas.height != window.innerHeight)
	{
		ctx.canvas.width  = window.innerWidth;
		ctx.canvas.height = window.innerHeight;
		resizeGraphics();
	}

	grid.iterateGrid(function(hex, i, j) {
		hex.draw(drawer);
	});
}

window.requestAnimationFrame(function () {
	init();
	setInterval(draw, 10);
});