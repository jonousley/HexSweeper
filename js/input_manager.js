
var mouseCode = {left: 0, right : 2};

function InputManager()
{
	document.addEventListener("mousedown", mouseDown, false);
	document.addEventListener("mouseup", mouseUp, false);
}

InputManager.prototype.On(event, callback)
{

}