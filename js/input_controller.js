function InputController(canvas)
{
	this.events = {};

	this.event = {mouseDown: "mousedown", mouseUp: "mouseup"};

	//the clicked hex during the mousedown even
	//will be an invalid hex if no Hex was clicked
	var invalidHex = new Hex(0); //Hex(0) creates an unusable Hex
	this.leftClickedHex = invalidHex; 
	this.rightClickedHex = invalidHex;

	//keeps track of whether the current touches are being used to zoom the screen
	this.isZooming = false;
	this.zoomSynced = true;

	this.prevTouch = {center: {x:0, y:0}, dist: 0};
	this.curTouch = {center: {x:0, y:0}, dist: 0};

	//keeps track of whether the current touch is being used to move the screen
	this.isMoving = false;
	this.moveSynced = true;

	//keeps track of whether the current touch is intended to reveal a hex
	this.isPress = false;
	this.pressPos = {x:0, y:0};

	this.touches = [];

	this.listen();

}

InputController.prototype.on = function(eventType, callback)
{
	if (this.events[eventType] == null)
		this.events[eventType] = [];
	this.events[eventType].push(callback);
}

InputController.prototype.emit = function(eventType, data)
{
	//console.log("event fired: "+eventType);
	if (!this.events[eventType]) this.events[eventType] = [];
	this.events[eventType].forEach(function (callback) {
		callback(data);
	});
}

InputController.prototype.listen = function ()
{
	var that = this;

	canvas.addEventListener(this.event.mouseDown, function(event) {
		var data = getXYfromEvent(event);
		if (event.button === mouseCode.left) that.emit("leftMouseDown",data);
		else if (event.button === mouseCode.right) that.emit("rightMouseDown",data);
	} , false);

	canvas.addEventListener(this.event.mouseUp, function(event) {
		var data = getXYfromEvent(event);
		if (event.button === mouseCode.left) that.emit("leftMouseUp",data);
		else if (event.button === mouseCode.right) that.emit("rightMouseUp",data);
	}, false );

	canvas.addEventListener("touchmove", function(event) {
		that.onTouch(event.touches);
	});
	canvas.addEventListener("touchstart", function(event) {
		that.onTouchStart(event.touches);
		that.onTouch(event.touches);
	});
	canvas.addEventListener("touchend", function(event) {
		that.onTouchEnd(event.touches);
		that.onTouch(event.touches);
	});
	canvas.addEventListener("touchcancel", function(event) {
		that.onTouch(event.touches);
	});

	canvas.onmousewheel = function(event)
	{
		var data = getXYfromEvent(event);
		data.zoom = 1+event.wheelDelta/480;
		that.emit("zoomScreen", data);
	}
}

InputController.prototype.onTouchStart = function(touches)
{
	if (event.touches.length == 1)
	{
		this.isPress = true;
		this.pressPos = getXYfromEvent(touches[0]);
	}
}

InputController.prototype.onTouchEnd = function(touches)
{
	if (event.touches.length == 0 && this.isPress == true)
	{
		this.emit("leftMouseUp",this.pressPos);
		this.isPress = false;
	}
}

InputController.prototype.onTouch = function(touches)
{
	event.preventDefault();
	this.touches = touches;
	if (event.touches.length == 2) //two fingers on the screen
	{
		this.curTouch.dist = getDistance(touchToPoint(touches[0]), touchToPoint(touches[1]));
		this.curTouch.center = getCenter(touchToPoint(touches[0]), touchToPoint(touches[1]));
		//this.curTouch.center = screen.normalizePosition(this.curTouch.center);

		if (!this.isZooming) //it's just starting to zoom
		{
			//record the state of the initial two touches here
			this.prevTouch.dist = this.curTouch.dist;
			this.prevTouch.center = {x:this.curTouch.center.x,y:this.curTouch.center.y};
			this.isZooming = true;
		}

		this.zoomSynced = false;
	}
	else this.isZooming = false;

	if (event.touches.length == 1)
	{
		//this.moveSynced = false; 
		this.curTouch.center = screen.normalizeScale(getXYfromEvent(touches[0]));

		if (!this.isMoving) //it's just starting to move
		{
			//record the state of the first touch in prevTouch
			this.prevTouch.center = screen.normalizeScale(getXYfromEvent(touches[0]));
			this.isMoving = true;
		}

		//only move the screen when we're sure this isn't a button press (the distance moved is above the minimum for a press)
		//once it's registered that it's not a button press, always treat it as a move
		if (!this.isPress || getDistance(this.prevTouch.center,this.curTouch.center) > screen.getMoveDistance())
		{
			this.isPress = false;
			this.moveSynced = false; //unsynced moves
		}
	}
	else 
	{
		this.isMoving = false;
		this.isPress = false;
	}
}

InputController.prototype.update = function ()
{
	if (this.isZooming && !this.zoomSynced)
	{
		//newCenter = center(touches[0], touches[1]);
		data = getCenter(this.curTouch.center, this.prevTouch.center);
		data.zoom = this.curTouch.dist/this.prevTouch.dist;

		this.emit("zoomScreen", data);
		this.zoomSynced = true;
		this.prevTouch.dist = this.curTouch.dist;
		this.prevTouch.center = {x:this.curTouch.center.x,y:this.curTouch.center.y};

	}

	if (this.isMoving && !this.moveSynced)
	{
		var data = subtractVector(this.curTouch.center, this.prevTouch.center);

		this.emit("moveScreen", data);
		
		this.prevTouch.center = {x:this.curTouch.center.x, y:this.curTouch.center.y};
		this.moveSynced = true;
	}
}