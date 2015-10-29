

var hexColors = [{fill:"#709BB8",stroke:"black"},{fill:"#C6D7E3", stroke:"black"},
				{fill:"red", stroke:"black"}];

var borderColors = ["black","black"];
var beginnerColor = "#9DFFFF";


function Hex(valid, r)
{
	this.x = 0;
	this.y = 0;
	this.r = r;
	this.revealed =  0;
	this.value = 0;
	this.valid = valid || 0;
	this.pressed = 0;
	this.doublePressed = 0;
	this.marked = 0;
	this.highlighted = 0;

	this.adjacentCells = [];
}

Hex.prototype.setXY = function(x,y)
{
	this.x = x;
	this.y = y;
}

Hex.prototype.setValue = function(value)
{
	this.value = value;
}

Hex.prototype.adjacentCells = function (cells)
{
	this.adjacentCells = cells;
}

Hex.prototype.draw = function(drawer)
{
	if (!this.valid) return;

	if (this.revealed && this.value==-1)
		drawer.drawHex(this.x,this.y,this.r,hexColors[2], borderColors[0]);
	else if(this.revealed || (this.pressed && !this.marked))
		drawer.drawHex(this.x,this.y,this.r,hexColors[1], borderColors[this.highlighted]);
	else
		drawer.drawHex(this.x,this.y,this.r,hexColors[0], borderColors[this.highlighted]);


	if (this.revealed && this.value>0)
		drawer.drawText(this.x, this.y, ""+this.value, Math.floor(this.r*.7));

	if (this.marked)
		drawer.drawX(this.x, this.y, ""+this.value, Math.floor(this.r*.7));
}

Hex.prototype.drawHighlight = function(drawer)
{
	if (!this.valid) return;
	var that = this;

	this.adjacentCells.forEach(function (hex)
	{
		if (hex.valid && !hex.revealed) 
		{
			var thickness = that.r*(2-sqrt3);
			if (getDistance(hex,that) < that.r*2.1) thickness = that.r;
			drawer.drawLine(that,hex,thickness,beginnerColor);
		}
	});
	//drawer.drawHex(this.x,this.y,this.r*2*sqrt3-this.r,{fill:beginnerColor},beginnerColor);
}

Hex.prototype.checkCollision = function(point)
{
	//var result = {collision:0, x: 0, y:0};
	if (!this.valid) return false;

	if (point.y<this.y-this.r) return false;
	if (point.y>this.y+this.r) return false;
	if (point.x<this.x-sqrt3/2*this.r) return false;
	if (point.x>this.x+sqrt3/2*this.r) return false;

	return true;
}

Hex.prototype.reveal = function()
{
	if (!this.valid || this.revealed || this.marked) return 0;
	this.revealed = 1;
	var hexesRevealed = 1;

	if (0 == this.value)
	{
		this.adjacentCells.forEach(function(i) {
			hexesRevealed += i.reveal();
		});
	}
	else if (-1 == this.value)
	{
		showDialog(false);
	}
	return hexesRevealed;
}

Hex.prototype.superReveal = function()
{
	if (!this.revealed) return;

	if (this.getAdjacentMarkers() == this.value)
	{
		this.adjacentCells.forEach(function(i) {
			i.reveal();
		});
	}
}

Hex.prototype.doublepress = function()
{
	this.pressed = this.doublePressed = true;
	this.adjacentCells.forEach(function(hex) {
		hex.pressed = true;
	});
}

Hex.prototype.mark = function()
{
	if (!this.valid || this.revealed) return;
	this.marked = !this.marked;
}

Hex.prototype.getAdjacentMarkers = function()
{
	var markCount = 0;
	this.adjacentCells.forEach(function(i) {
		if (i.valid) markCount += (i.marked || (i.value==-1 && i.revealed));
	});
	return markCount;
}
