
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

var middle = {x:0, y:0};
var hexAngle = Math.PI * 2/3;
var hexRadius = 20;
var sqrt3 = Math.sqrt(3);

var gridLength = 6;
var startMines = 10;

var firstClick = true;

//10/60 seemed about good

var clickedHex = new Hex(0);


var grid;
var drawer;
//var inputManager;
var mouseCode = {left: 0, right : 2};


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

function mouseUp(event)
{
	point = {x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};
	if (event.button === mouseCode.left)
	{
		grid.iterateList(function(hex) {
			if (!hex.checkCollision(point))
			{
				if (hex==clickedHex) clickHex(hex);
			}
		});
		clickedHex = new Hex(0);
	}
}

function mouseDown(event)
{
	point = {x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};
	if (event.button === mouseCode.left)
	{
		grid.iterateList(function(hex) {
			if (!hex.checkCollision(point))
			{
				clickedHex = hex;
			}
		});
	}
}

function clickHex(hex)
{
	if (firstClick)
	{
		firstClick = false;
		grid.initMines(startMines, hex);
	}
	hex.reveal();
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