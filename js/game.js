
var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext("2d");

var gridLength = 5; //how many hexagons on each side of the large hexagon
var startMines = .12; //starting percentage of mines
var hexesRevealed = 0;

var beginner = true;

var counter = 0;


var invalidHex = new Hex(0); //Hex(0) creates an unusable Hex
var lastClickedHex = invalidHex;

var bgColor = "white";

var grid;   //HexGrid object
var drawer; //drawer Object
var inputController;
var screen;
//var inputManager;

var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var mobileDevice = typeof window.orientation !== 'undefined';

var mouseCode = {left: isIE ? 1:0, right : 2}; //normalized mouseCodes for IE
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

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	grid = new HexGrid(gridLength);	
	screen = new ScreenController();

	inputController = new InputController(canvas);
	inputController.on("leftMouseUp", leftClick);
	inputController.on("rightMouseDown", rightClick);
	inputController.on("windowResize", grid.initHexPositions.bind(grid));
	inputController.on("zoomScreen", screen.zoom.bind(screen));
	inputController.on("moveScreen", screen.move.bind(screen));



	screen.resizeGraphics();
	//grid.initHexPositions();

	drawer = new Drawer(ctx);


	//grid.initMines(startMines);
	//inputManager = new InputManager();
}

function restartGame()
{
	grid.clearGrid();
	grid = new HexGrid(gridLength);
	inputController.grid = grid;
	//resizeGraphics();
	grid.initHexPositions();
	gameInitialized = false;
}

function leftClick(data)
{
	screen.normalizePosition(data);
	grid.revealAt(data);
	if (grid.hexesRevealed == grid.gridList.length-startMines) gameOver();
}

function rightClick(data)
{
	screen.normalizePosition(data);
	var hex = grid.checkCollision(data);
	if (hex) hex.mark();
}


function gameStart(hex)
{
	grid.initMines(startMines, hex);
}

function gameOver()
{
	showDialog(grid.winning);
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
		gridLength++;
		startMines=startMines+.01;
	}
	else
	{
		grid.gridList.forEach(function(hex) {
			if (!hex.revealed) hex.revealed = 2;
		});
		$("#gameLost").css("display", "block");
		$("#gameWon").css("display", "none");
	} 
}

var prevTime = 0;
var curTime;
function draw() {
	ctx.fillStyle = bgColor ;

	screen.fill("white");

	grid.draw(drawer);


	curTime = new Date().getTime();
	//drawer.drawText({x:200,y:100},10,""+inputController.touches.length,"black");
	prevTime = curTime;
	//screen.finishDraw();

	if (!isOpera)
		window.requestAnimationFrame(draw); //draw whenever possible
}

function update() {
	inputController.update();
	screen.update();
}

init();
setInterval(update,10); //call update every ten ms
if (!isOpera) draw(); //start the draw cycle
else setInterval(draw, 10);
