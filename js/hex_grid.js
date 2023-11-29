//This object contains two data structures to store the grid of hexes, a 2d array and a list
//

function HexGrid(gridLength)
{
	this.grid = [];
	this.gridList = [];
	this.gridLength = gridLength;
	this.hexRadius = 10;

	this.selectedHex = invalidHex;

	this.winning = true;
	this.hexesRevealed = 0;

	this.size = (gridLength*2-1)*this.hexRadius;

	for (j =0; j<gridLength*2-1; j++)
	{
		this.grid[j] = [];
		for (i = 0; i<gridLength*2-1; i++)
		{
			 if(i<gridLength*2-1-Math.floor(Math.abs(j-gridLength+1)/2+(gridLength%2)/2) &&
				i>=Math.ceil(Math.abs(j-gridLength+1)/2-(gridLength%2)/2)) 
			 {
				this.grid[j][i] = new Hex(1); //uninitialized, valid hex
				this.gridList.push(this.grid[j][i]);
			}
			else this.grid[j][i] = invalidHex; //not in the hexagon pattern
		}
	}

	this.initAdjacentLists();
}

HexGrid.prototype.initHexPositions = function(data)
{
	var x, y;
	this.hexRadius = screen.getGridSize()/(gridLength*2-1);

	for (j=0; j<this.grid.length; j++)
	{
		y = j - this.gridLength+1;
		for (i=0; i<this.grid[j].length; i++)
		{
			if (this.grid[j][i].valid || (j==0 && i==0))
			{
				//calculated coordinates for each hex
				this.grid[j][i].x = 2*this.hexRadius*(i-this.gridLength+1) + this.hexRadius*(gridLength%2 ? (j%2):-1*!(j%2)) + screen.center.x;
				this.grid[j][i].y = sqrt3*this.hexRadius*y + screen.center.y;
				this.grid[j][i].r = this.hexRadius;
			}
		}
	}
}

HexGrid.prototype.initAdjacentLists = function()
{
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

HexGrid.prototype.initMines = function(minePercent, startHex)
{
	var total = 3*this.gridLength**2 -3*this.gridLength+1;
	var mineCount = Math.floor(total*minePercent);
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
}

HexGrid.prototype.draw = function(drawer)
{
	this.selectedHex.drawHighlight(drawer);
	this.iterateGrid(function(hex, i, j) {
		hex.draw(drawer);
	});
}

HexGrid.prototype.revealAt = function(point)
{
	var hex = this.checkCollision(point);
	if (!hex.valid) return false;

	if (this.hexesRevealed == 0) gameStart(hex);

	if (hex.revealed) 
	{
		if (this.selectedHex != hex) this.selectedHex = hex;
		else this.selectedHex = invalidHex;
	}

	if (this.selectedHex.valid && hex.isAdjacent(this.selectedHex))
	{
		if (this.selectedHex.getAdjacentMarkers() < this.selectedHex.value || hex.marked)
		{
			hex.mark();
			return true;
		}
	}
		
	this.hexesRevealed += hex.reveal();

	return true;
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
	result = invalidHex;

	var topLeft = {x: this.grid[0][0].x - this.hexRadius*2, 
		y: this.grid[0][0].y - this.hexRadius*2};

	//determines which area of the grid the mouseclick falls in
	cellCoord = {x: Math.floor((point.x - topLeft.x) / (this.hexRadius*2))-1,
				 y: Math.floor((point.y - topLeft.y) / (this.hexRadius*sqrt3))-1 };

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

//clears references to hex objects to avoid memory leaks
HexGrid.prototype.clearGrid = function()
{
	this.gridList.forEach(function(hex) {
		hex.adjacentCells = [];
	});
	this.grid = [];
	this.gridList = [];
}