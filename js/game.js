
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

var middle = {x:0, y:0}; //middle of the page, all coords will relative to this location

//var hexRadius = 20;		  //not 20, overwritten constantly based on page resizing

const hexAngle = Math.PI * 2/3;
const sqrt3 = Math.sqrt(3); //commonly used constant for hexagonal calculations

var gridLength = 6;  //how many hexagons on each side of the large hexagon
var startMines = 10; //starting amount of mines
var hexesRevealed = 0;

var beginner = true;


//the clicked hex during the mousedown even
//will be an invalid hex if no Hex was clicked
var invalidHex = new Hex(0); //Hex(0) creates an unusable Hex
var leftClickedHex = invalidHex; 
var lastClickedHex = invalidHex;
var rightClickedHex = invalidHex;


var grid;   //HexGrid object
var drawer; //drawer Object
//var inputManager;

var mouseCode = {left: (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) ? 1:0, right : 2}; //normalized mouseCodes for IE
var gameInitialized = false; //don't add mines until the first click happens so it's guaranteed not a mine

function init()
{
	$('body').on('contextmenu', '#canvas1', function(e){ return false; });
	$( "#restart" ).click(function() 
	{
		$("#openModal").css("opacity","0");
		$("#openModal").css("pointer-events","none");
  		restartGame();
	});

	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	grid = new HexGrid(gridLength);
	resizeGraphics();
	drawer = new Drawer(ctx);
	//grid.initMines(startMines);
	//inputManager = new InputManager();
}

function restartGame()
{
	grid.clearGrid();
	grid = new HexGrid(gridLength);
	resizeGraphics();
	//grid.initHexPositions();
	gameInitialized = false;
	hexesRevealed = 0;
}

function resizeGraphics()
{
	var hexSideSize = Math.min(ctx.canvas.width*.95/2, ctx.canvas.height*.95/sqrt3);
	grid.hexRadius = hexSideSize/gridLength/2;

	middle.x = ctx.canvas.width/2;
	middle.y = ctx.canvas.height/2;

	grid.initHexPositions();
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
//and stores it in leftClickedHex or rightClickedHex
function mouseDown(event)
{
	point = getXYfromEvent(event);//{x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};

	if (event.button === mouseCode.left)
	{
		lastClickedHex = invalidHex;
		//if the other button is already down and selecting a different hex, ignore
		if (rightClickedHex.valid) return;

		leftClickedHex = grid.checkCollision(point);
		if (!leftClickedHex.valid) return;
		
		leftClickedHex.pressed = true;
		if (beginner) {
			lastClickedHex = leftClickedHex;
		}

	}

	else if (event.button === mouseCode.right)
	{
		if (leftClickedHex.valid) return;
		rightClickedHex = grid.checkCollision(point);
		if (rightClickedHex.valid) rightClickedHex.mark();
	}
	else return;

}

//ensures that the hexagon being selected is the same as the one pressed during the mouseDown
//event and if so runs the clickHex function
function mouseUp(event)
{
	point = getXYfromEvent(event);//{x:event.x-canvas.offsetLeft, y:event.y-canvas.offsetTop};
	//console.log(point.x+","+point.y); debug

	if (event.button === mouseCode.left)
	{
		//checks that the mouse is still over the hex it clicked
		if (leftClickedHex.valid && leftClickedHex.checkCollision(point)) 
			leftClickHex(leftClickedHex);

		leftClickedHex.pressed = false;
		leftClickedHex = invalidHex;
	}
	else if (event.button === mouseCode.right)
	{
		rightClickedHex = invalidHex;
	}
	else return;
}

function leftClickHex(hex)
{
	if (!gameInitialized)
	{
		gameInitialized = true;
		grid.initMines(startMines, hex);
	}
	//hex.superReveal();
	hexesRevealed += hex.reveal();
	if (hexesRevealed == grid.gridList.length - startMines)
		showDialog(true);
}

function showDialog(gameResult)
{

	var dialog = $("#openModal");
	dialog.css("opacity","1");
	dialog.css("pointer-events","auto");
	if (gameResult) 
	{
		$("#gameWon").css("display", "block");
		$("#gameLost").css("display", "none");
		beginner = false;
	}
	else
	{
		$("#gameLost").css("display", "block");
		$("#gameWon").css("display", "none");
	} 
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

	lastClickedHex.drawHighlight(drawer);
	grid.iterateGrid(function(hex, i, j) {
		hex.draw(drawer);
	});

	window.requestAnimationFrame(draw); //draw whenever possible
}

function update() {


}

init();
//setInterval(update,10); //call update every ten ms
draw(); //start the draw cycle
	//setInterval(draw, 10);
