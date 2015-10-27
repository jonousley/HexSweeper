/* Hex.status:
 *       0 - unrevealed
 *       1 - revealed
 *
 */

var hexColors = [{fill:"#709BB8",stroke:"black"},{fill:"#C6D7E3", stroke:"black"}];


function Hex(valid, r, value, x, y, status)
{
	this.x = x || 0;
	this.y = y || 0;
	this.r = r;
	this.status = status || 0;
	this.value = value || 0;
	this.valid = valid || 0;

	this.adjacentCells = [];
}

Hex.prototype.adjacentCells = function (cells)
{
	this.adjacentCells = cells;
}

Hex.prototype.draw = function(drawer)
{
	if (!this.valid) return;

	drawer.drawHex(this.x,this.y,this.r,hexColors[this.status]);

	if (this.status && this.value!=0)
		drawer.drawText(this.x, this.y, ""+this.value, Math.floor(this.r*.7));
}

Hex.prototype.checkCollision = function(point)
{
	//var result = {collision:0, x: 0, y:0};

	if (point.y<this.y-hexRadius) return 1;
	if (point.y>this.y+hexRadius) return 2;
	if (point.x<this.x-sqrt3/2*hexRadius) return 3;
	if (point.x>this.x+sqrt3/2*hexRadius) return 4;

	return 0;
}

Hex.prototype.reveal = function()
{
	if (!this.valid || this.status) return;
	this.status = 1;

	if (this.getAdjacentMarkers() == this.value)
	{
		this.adjacentCells.forEach(function(i) {
			i.reveal();
		});
	}
}

Hex.prototype.getAdjacentMarkers = function()
{
	return 0;
}
