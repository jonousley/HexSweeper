function Drawer(ctx)
{
	this.ctx = ctx;
}

Drawer.prototype.drawHex = function(x, y, r, colorScheme,colorBorder)
{
	var hexConst = r*sqrt3/2;

	this.ctx.fillStyle = colorScheme.fill;
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

Drawer.prototype.drawText = function(x,y,text,size)
{
	this.ctx.font = size+'pt Calibri';
	this.ctx.textAlign = 'center';
	this.ctx.textBaseline = 'middle';
	this.ctx.fillStyle = "black";
	this.ctx.fillText(text, x, y);
}

Drawer.prototype.drawX = function(x,y,text,size)
{
	size = Math.floor(size/2);
	this.ctx.strokeStyle = "red";
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