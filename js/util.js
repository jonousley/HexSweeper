
const hexAngle = Math.PI * 2/3;
const sqrt3 = Math.sqrt(3); //commonly used constant for hexagonal calculations

function getDistance(point1, point2)
{
	return Math.sqrt((point1.x-point2.x)*(point1.x-point2.x) + (point1.y-point2.y)*(point1.y-point2.y));
}

function getCenter(point1, point2)
{
	return {x:(point1.x-point2.x)/2+point2.x, y:(point1.y-point2.y)/2+point2.y};
}

function addVector(vector1, vector2)
{
	return {x:(vector1.x+vector2.x), y:(vector1.y+vector2.y)};
}


function subtractVector(vector1, vector2)
{
	return {x:(vector1.x-vector2.x), y:(vector1.y-vector2.y)};
}

function touchToPoint(touch)
{
	return {x:touch.pageX, y:touch.pageY};
}

//additional processing for the event data, compatible with firefox/chrome
function getXYfromEvent(e)
{
	var result = {x:0, y:0};
	if (e.pageX || e.pageY) { 
	  result.x = e.pageX;
	  result.y = e.pageY;
	}
	else { 
	  result.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  result.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	result.x -= canvas.offsetLeft;
	result.y -= canvas.offsetTop;
	return result;
};