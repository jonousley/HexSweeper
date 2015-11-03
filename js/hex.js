var hexColor = {unrevealed: "#709BB8", 
				revealed: "#C6D7E3", 
				mine: "red", 
				border: "black", 
				highlight:"#9DFFFF"};


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

	drawer.drawHex(this.x,this.y,this.r,this.getColor(),hexColor.border);
	//drawer.drawCircle(this.x,this.y,this.r,this.getColor(),hexColor.border);
	//drawer.drawShadowedHex(this.x,this.y,this.r,this.getColor(), this.revealed);

	if (this.revealed && this.value>0)
		drawer.drawText(this.x, this.y, ""+this.value, Math.floor(this.r*.7));

	if (this.marked)
		drawer.drawQuarantine(this.x,this.y,this.r*3/4,"red",this.getColor());
		//drawer.drawX(this.x, this.y, ""+this.value, Math.floor(this.r*.7));
}

//draws a highlight to all adjacent, unrevealed hexes
//call before draw function so it doesn't draw on top
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
			drawer.drawLine(that,hex,thickness,hexColor.highlight);
		}
	});
	//drawer.drawHex(this.x,this.y,this.r*2*sqrt3-this.r,{fill:beginnerColor},beginnerColor);
}

Hex.prototype.getColor = function()
{
	if (this.revealed && this.value==-1)
		return hexColor.mine;
	//else if (this.marked) return "yellow";
	else if(this.revealed==1 || (this.pressed && !this.marked))
		return hexColor.revealed;
	else
		return hexColor.unrevealed;
}


//returns true if the given point falls inside this hexagon
Hex.prototype.checkCollision = function(point)
{
	//var result = {collision:0, x: 0, y:0};
	if (!this.valid) return false;

	var xDif = Math.abs(this.x - point.x);

	if (xDif > this.r*sqrt3/2) return false;

	//checks that it's above and under the upper and lower slopes of the hexagon
	if (point.y>this.y+(this.r-xDif/sqrt3)) return false;
	if (point.y<this.y-(this.r-xDif/sqrt3)) return false;

	return true;
}

Hex.prototype.reveal = function()
{
	if (!this.valid || this.revealed || this.marked) return 0;
	this.revealed = 1;
	//this.r += this.r*(1-sqrt3/2);

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
