
function Drawer(ctx)
{
	this.ctx = ctx;
}

Drawer.prototype.drawHex = function(object, r, colorScheme,colorBorder)
{
	var x = object.x;
	var y = object.y;

	var hexConst = r*sqrt3/2;

	this.ctx.fillStyle = colorScheme;
	this.ctx.strokeStyle = colorBorder;

    this.ctx.lineWidth = r/20;

	this.ctx.beginPath();
	this.ctx.moveTo(x, y-r);
	this.ctx.lineTo(x+hexConst, y-r/2);
	this.ctx.lineTo(x+hexConst, y+r/2);
	this.ctx.lineTo(x, y+r);
	this.ctx.lineTo(x-hexConst, y+r/2);
	this.ctx.lineTo(x-hexConst, y-r/2);
	this.ctx.closePath();
	this.ctx.fill();
	this.ctx.stroke();
}

Drawer.prototype.drawCircle = function(x,y,r,colorScheme,colorBorder,thickness)
{
	this.ctx.fillStyle = colorScheme || "black";
	this.ctx.strokeStyle = colorBorder || "black";

    this.ctx.lineWidth = thickness || r/20;

	this.ctx.beginPath();
	this.ctx.arc(x,y,r,0,Math.PI*2);
	this.ctx.closePath();
	if (colorScheme) this.ctx.fill();
	if (colorBorder) this.ctx.stroke();
}

Drawer.prototype.drawQuarantine = function(object,r,colorFill, colorBackground)
{
	var x = object.x;
	var y = object.y;

	var w = .45 * r; //distance from center of outer circle to center of symbol
	var r = .55 * r; //radius of outer circles

	innerCircle = .70; // ratio of the outer circle radius to the inner
	innerOffset = .02; // a small offset so that the inner circle reaches the edge of the outer

	this.drawCircle(x-w*sqrt3/2,y+w/2,r,colorFill);
	this.drawCircle(x+w*sqrt3/2,y+w/2,r,colorFill);
	this.drawCircle(x,y-w,r,colorFill);

	w += (1-innerCircle)*r; //distance from center of inner circles to center of symbol
	r = (innerCircle + innerOffset)*r; //recalculate for the innerRadius

	this.drawCircle(x-w*sqrt3/2,y+w/2,r,colorBackground);
	this.drawCircle(x+w*sqrt3/2,y+w/2,r,colorBackground);
	this.drawCircle(x,y-w,r,colorBackground);

	this.drawCircle(x,y,r*(1-innerCircle),colorBackground);

	this.drawCircle(x,y,r,0,colorFill,r/4);

	this.drawCircle(x-w*sqrt3/2,y+w/2,r,0,colorBackground,r/10);
	this.drawCircle(x+w*sqrt3/2,y+w/2,r,0,colorBackground,r/10);
	this.drawCircle(x,y-w,r,0,colorBackground,r/10);
}

Drawer.prototype.drawShadowedHex = function(object, r, colorScheme, down)
{
	var x = object.x;
	var y = object.y;
	var hexConst = r*sqrt3/2;

	this.ctx.fillStyle = "black";

	this.ctx.beginPath();
	this.ctx.moveTo(x, y-r);
	this.ctx.lineTo(x+hexConst, y-r/2);
	this.ctx.lineTo(x+hexConst, y+r/2);
	this.ctx.lineTo(x, y+r);
	this.ctx.lineTo(x-hexConst, y+r/2);
	this.ctx.lineTo(x-hexConst, y-r/2);
	this.ctx.closePath();
	this.ctx.fill();

	if (down)
	{
		x+=r/15;
		y+=r/15;
	}
	else
	{
		x-=r/15;
		y-=r/15;
	}

	this.ctx.fillStyle = colorScheme;
	
	this.ctx.beginPath();
	this.ctx.moveTo(x, y-r);
	this.ctx.lineTo(x+hexConst, y-r/2);
	this.ctx.lineTo(x+hexConst, y+r/2);
	this.ctx.lineTo(x, y+r);
	this.ctx.lineTo(x-hexConst, y+r/2);
	this.ctx.lineTo(x-hexConst, y-r/2);
	this.ctx.closePath();
	this.ctx.fill();
}

Drawer.prototype.drawText = function(object, size, text)
{
	var x = object.x;
	var y = object.y;

	this.ctx.font = Math.floor(size)+'pt Calibri';
	this.ctx.textAlign = 'center';
	this.ctx.textBaseline = 'middle';
	this.ctx.fillStyle = "black";
	this.ctx.fillText(text, x, y);
}

Drawer.prototype.drawX = function(object)
{
	var x = object.x;
	var y = object.y;
	size = Math.floor(size/2);
	this.ctx.strokeStyle = "red";
	this.ctx.lineWidth = size/8;
	this.ctx.beginPath();
	this.ctx.moveTo(x-size,y-size);
	this.ctx.lineTo(x+size,y+size);
	this.ctx.moveTo(x+size,y-size);
	this.ctx.lineTo(x-size,y+size);
	this.ctx.closePath();
	this.ctx.stroke();
}

Drawer.prototype.drawLine = function(point1, point2, size, color)
{

	this.ctx.strokeStyle = color;
	this.ctx.lineWidth = size;
	this.ctx.beginPath();
	this.ctx.moveTo(point1.x,point1.y);
	this.ctx.lineTo(point2.x,point2.y);
	this.ctx.closePath();
	this.ctx.stroke();
}