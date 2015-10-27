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
			if (i>j-gridLength && i<gridLength+j)
			{
				this.grid[j][i] = new Hex(1, hexRadius);
				this.gridList.push(this.grid[j][i]);
			}
			else this.grid[j][i] = new Hex(0); //not in the hesagon pattern
		}
	}
}

HexGrid.prototype.initMines = function(mineCount, startHex)
{
	for (j=0; j<this.grid.length; j++)
	{
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid)
			{
				this.grid[j][i].adjacentCells = [this.getHex(j-2,i-1), 
					this.getHex(j-1, i-2), this.getHex(j-1,i-1), this.getHex(j-1,i), this.getHex(j-1, i+1),
					this.getHex(j, i-1), this.getHex(j, i+1),
					this.getHex(j+1, i-1), this.getHex(j+1,i), this.getHex(j+1,i+1), this.getHex(j+1, i+2),
					this.getHex(j+2,i+1)];
			}
		}
	}

	var chosenHex;
	for (i=0; i<Math.min(mineCount, this.gridList.length); i++)
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

HexGrid.prototype.initHexPositions = function(hexRadius)
{
	var x, y;
	this.hexRadius = hexRadius;

	for (j=0; j<this.grid.length; j++)
	{
		y = j - this.gridLength+1;
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid)
			{
				this.grid[j][i].x = 2*hexRadius*(i-this.gridLength+1) - this.hexRadius*y + middle.x;
				this.grid[j][i].y = sqrt3*this.hexRadius*y + middle.y;
				this.grid[j][i].r = hexRadius;
			}
		}
	}
};

HexGrid.prototype.getHex = function(x, y)
{
	if (y<0 || y>=this.grid.length) return new Hex(0);
	if (x<0 || x>=this.grid[0].length) return new Hex(0);

	return this.grid[x][y];
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

HexGrid.prototype.checkCollision = function(point)
{
	var upper = 0;
	var lower = this.grid[0].length;
	var mid;

	var hexToCheck;
	var result;

	while (result < 3)
	{
		mid = Math.floor((upper-lower)/2) + lower;
		hexToCheck = grid[0][mid];
		result = checkCollision(hexToCheck);
		if (result == 0) return hexToCheck;
		else if (result == 1) lower = mid;
		else if (result == 2) upper = mid;
	}
	var y = mid;
	lower = 0;
	upper = this.grid.length;

	while (result )
	{
		mid = Math.floor((upper-lower)/2) + lower;
		hexToCheck = grid[0][mid];
		result = checkCollision(hexToCheck);
		if (result == 0) return hexToCheck;
		else if (result == 1) lower = mid;
		else if (result == 2) upper = mid;
	}
}

HexGrid.prototype.doAdjacentHexes = function(hex, operation)
{
	iterateGrid(operation);
}