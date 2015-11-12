
var mobileDevice = false;
const minScale = 1;
const maxScale = 4;

function ScreenController()
{
	this.scale = 1;
	this.center = {x:0, y:0};
	this.origin = {x:0, y:0};

	this.startSize = {x:canvas.width, y:canvas.height};
}

ScreenController.prototype.update = function()
{
	if (!mobileDevice &&
		(canvas.width != window.innerWidth ||
		canvas.height != window.innerHeight))
	{
		this.resizeGraphics();
	}
}

ScreenController.prototype.fill = function(color)
{
	ctx.fillRect(this.origin.x, this.origin.y, canvas.width/this.scale, canvas.height/this.scale);
}

ScreenController.prototype.getGridSize = function()
{
	return Math.min(ctx.canvas.width*.95/2, ctx.canvas.height*.95/sqrt3);
}

ScreenController.prototype.resizeGraphics = function()
{
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	this.center.x = ctx.canvas.width/2;
	this.center.y = ctx.canvas.height/2;

	this.origin.x = this.origin.y = 0;
	this.zoom = 1;
	//this.initZoom();

	inputController.emit("windowResize");
}

ScreenController.prototype.initZoom = function()
{
	this.origin.x = this.origin.x - this.origin.x/this.scale;
	this.origin.y = this.origin.y - this.origin.y/this.scale;

	ctx.scale(this.scale,this.scale);
	ctx.translate(-(this.origin.x),-(this.origin.y));
}

ScreenController.prototype.zoom = function(data)
{
	var newScale = this.scale*data.zoom;
	newScale = Math.max(newScale, 1);
	newScale = Math.min(newScale, maxScale);

	data.zoom = newScale/this.scale;

	ctx.translate(this.origin.x, this.origin.y);
    ctx.scale(data.zoom,data.zoom);

    this.origin.x += data.x/this.scale - data.x/newScale;
    this.origin.y += data.y/this.scale - data.y/newScale;

    //correct the new origin if it's too far off the screen
	//this.origin.x = Math.min(Math.max(0, this.origin.x), canvas.width-canvas.width/newScale);
	//this.origin.y = Math.min(Math.max(0, this.origin.y), canvas.height-canvas.height/newScale);

    ctx.translate(-1*this.origin.x, -1*this.origin.y);
    this.scale = newScale;

    console.log("newscale: ", this.scale);
}

ScreenController.prototype.move = function(data)
{
	var newOrigin = {
		x:Math.min(Math.max(0, this.origin.x+data.x), canvas.width-canvas.width/this.scale),
		y:Math.min(Math.max(0, this.origin.y+data.y), canvas.height-canvas.height/this.scale) 
	};

	ctx.translate(data.x,data.y);//newOrigin.x-this.origin.x,newOrigin.y-this.origin.y);
 
	this.origin.x -= data.x;// newOrigin.x;
	this.origin.y -= data.y;//newOrigin.y;
}

ScreenController.prototype.normalizePosition = function(data)
{
	data.x = data.x/this.scale + this.origin.x;
	data.y = data.y/this.scale + this.origin.y;
	return data;
}

ScreenController.prototype.normalizeScale = function(data)
{
	data.x = data.x/this.scale;
	data.y = data.y/this.scale;
	return data;
}

//returns the minimum distance in pixels that a swipe needs to travel to no longer
//be considered as a mouse click
ScreenController.prototype.getMoveDistance = function()
{
	return grid.hexRadius;
}