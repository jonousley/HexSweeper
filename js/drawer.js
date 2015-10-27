function Drawer(ctx)
{
	this.ctx = ctx;
}

Drawer.prototype.drawHex = function(x, y, r, colorScheme)
{
	var hexConst = r*sqrt3/2;

	this.ctx.fillStyle = colorScheme.fill;
	this.ctx.strokeStyle = colorScheme.stroke;

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