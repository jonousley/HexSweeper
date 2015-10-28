//This object contains two data structures to store the grid of hexes, a 2d array and a list
//To 


function HexGrid(gridLength, hexRadius)
{
	this.grid = [];
	this.gridList = [];
	this.gridLength = gridLength;
	this.hexRadius = hexRadius;

	for (j =0; j<gridLength*2-1; j++)
	{
		this.grid[j] = [];
		for (i = 0; i<gridLength*2-1; i++)
		{
			//if (i>j-gridLength && i<gridLength+j)
			//{
			 if(i<gridLength*2-1-Math.floor(Math.abs(j-gridLength+1)/2) &&
				i>=Math.ceil(Math.abs(j-gridLength+1)/2)) 
			 {
				this.grid[j][i] = new Hex(1, hexRadius);
				this.gridList.push(this.grid[j][i]);
			}
			else this.grid[j][i] = invalidHex; //not in the hexagon pattern
		}
	}
}


HexGrid.prototype.initHexPositions = function(hexRadius)
{
	var x, y;
	this.hexRadius = hexRadius;

	for (j=0; j<this.grid.length; j++)
	{
		y = j - this.gridLength+1;
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid || (j==0 && i==0))
			{
				this.grid[j][i].x = 2*hexRadius*(i-this.gridLength+1) - this.hexRadius*(j%2==0) + middle.x;
				this.grid[j][i].y = sqrt3*this.hexRadius*y + middle.y;
				this.grid[j][i].r = hexRadius;
			}
		}
	}

	for (j=0; j<this.grid.length; j++)
	{
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid)
			{
				this.grid[j][i].adjacentCells = [this.getHex(i,j-2), 
					this.getHex(i-1, j-1), this.getHex(i,j-1), this.getHex(i+1,j-1),
					this.getHex(i-1,j), this.getHex(i+1,j),
					this.getHex(i-1,j+1), this.getHex(i,j+1), this.getHex(i+1,j+1),
					this.getHex(i,j+2)];
				if (j%2==0) 
					this.grid[j][i].adjacentCells.push(this.getHex(i-2,j+1), this.getHex(i-2,j-1));
				else	    
					this.grid[j][i].adjacentCells.push(this.getHex(i+2,j+1), this.getHex(i+2,j-1));
			}
		}
	}
}


HexGrid.prototype.initMines = function(mineCount, startHex)
{
	var chosenHex;
	for (i=0; i<Math.min(mineCount, this.gridList.length-1); i++)
	{
		do
		{
			chosenHex = this.gridList[Math.floor(Math.random()*this.gridList.length)];
		} while (chosenHex.value==-1 || chosenHex == startHex);

		chosenHex.value = -1;
		chosenHex.adjacentCells.forEach(function (hex) {
			if (hex.valid && hex.value >= 0) hex.value++;
		});
	}

	//this.iterateGrid(function (hex, i, j) {
	//	hex.adjacentCells=[
	//});

}

HexGrid.prototype.getHex = function(x, y)
{
	if (y<0 || y>=this.grid.length) return invalidHex;
	if (x<0 || x>=this.grid[0].length) return invalidHex;

	return this.grid[y][x];
}

HexGrid.prototype.iterateGrid = function(operation)
{
	for (j=0; j<this.grid.length; j++)
	{
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid)
				operation(this.grid[j][i], j, i);
		}
	}
};

HexGrid.prototype.iterateList = function(operation)
{
	this.gridList.forEach(function(element, index, array) { 
		operation(element);
	});
}

//finds the hex that the given point is inside
//returns an invalid hex object if none found
HexGrid.prototype.checkCollision = function(point)
{
	//brute force method, to be replaced
	result = invalidHex;
	/*this.iterateList(function(hex) {
		if (hex.checkCollision(point))
		{
			result = hex;
		}
	});
	return result;*/


	var topLeft = {x: this.grid[0][0].x - this.hexRadius*2, 
		y: this.grid[0][0].y - this.hexRadius*2};

	//determines which area of the grid the mouseclick falls in
	cellCoord = {x: Math.floor((point.x - topLeft.x) / (this.hexRadius*2))-1,
				 y: Math.floor((point.y - topLeft.y) / (this.hexRadius*sqrt3))-1 };

	console.log(cellCoord.x+","+cellCoord.y);

	if (cellCoord.x < -1 || cellCoord.y < -1 || 
		cellCoord.y > this.grid.length || cellCoord.x > this.grid[0].length)
		return result;

	//check only the four hexes in that area for a collision
	[this.getHex(cellCoord.x,cellCoord.y), 
	this.getHex(cellCoord.x+1,cellCoord.y),
	this.getHex(cellCoord.x, cellCoord.y+1),
	this.getHex(cellCoord.x+1,cellCoord.y+1)].forEach(function(hex) {
		if (hex.checkCollision(point)) result = hex;
	});

	return result;
}

HexGrid.prototype.doAdjacentHexes = function(hex, operation)
{
	iterateGrid(operation);
}  