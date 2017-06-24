EyeObj = function(x, y)
{
	this.type = 'EyeObj';
	if(typeof(x) != 'undefined' && typeof(y) != 'undefined')
		this.init(x, y);
}

$.extend(EyeObj.prototype,
{
	class_name: 'EyeObj',
	type: 'EyeObj',
	blockshape : null,
	blockzoom : 5,

	isShow : true,

	baseheight : 10,
	json: null,
	position : { x: 0, y: 0, z: 0 },

	property: new CProperty(),

	init: function(x, y)
	{
		this.createObjs(x, y, true);
	},

	initialize : function()
	{
		this.createObjs(g_appOptions.targetPosition.x + garena.width, g_appOptions.targetPosition.y + garena.height, false);
		// this.createObjs(this.position.x, this.position.y, false);
	},
	doNotShowSeats : function()
	{

	},

	createObjs: function(x, y, isMouse)
	{
		if(this.blockshape) {
			canvas.remove(this.blockshape);
			this.blockshape = null;	
		}
		var self = this;

		var tmpZoom = canvas.getZoom();

		var left, top;
		if(isMouse) {
			left = (x - canvas.viewportTransform[4]) / tmpZoom;
			top = (y - canvas.viewportTransform[5]) / tmpZoom;
		} else {
			left = x;// + garena.imgObj.originalLeft * tmpZoom;
			top = y;// + garena.imgObj.originalTop * tmpZoom;
		}
        fabric.Image.fromURL('images/eye-icon.png', function(img)
        {
            self.blockshape = img.set({
            	parentObj: self,
            	objtype: 'EyeObj',
            	left: left, 
            	top: top,
            	width:img.width / tmpZoom,
            	height:img.height / tmpZoom,
            	originX: 'center', originY: 'center', 
            	opacity: 1.0,
            	crossOrigin: 'anonymous',
            	selectable: false,
				lockMovementX : false,
				lockMovementY : false,
				// hoverCursor : 'move',
            });
			canvas.add(self.blockshape);
			// canvas.setActiveObject(self.blockshape);
			canvas.renderAll();
			self.showProperty();

			// self.shapeInitFunctions();
            gselectedObj = self;
			// self.blockshape.visible = this.property.isVisible2D;

            self.setTargetPosition();
        });
	},

	setPosition: function(x, y)
	{
		var tmpZoom = canvas.getZoom();

		this.blockshape.left = (x - canvas.viewportTransform[4]) / tmpZoom;
		this.blockshape.top = (y - canvas.viewportTransform[5]) / tmpZoom;
		canvas.renderAll();
		this.showProperty();
		this.setTargetPosition();
	},

	setTargetPosition: function()
	{
		this.baseheight = $('#dlg_setting_eye #eye_height').val();
		var center_x = garena.width;
		var center_y = garena.height;
		g_appOptions.targetPosition = {
			x: this.blockshape.left - center_x,
			y: this.blockshape.top - center_y,
			z: parseFloat(this.baseheight),
		};
		var tmpZoom = canvas.getZoom();
		// g_historyMan.addState('modify', this);
		this.position = {
			x: this.blockshape.left - garena.imgObj.originalLeft,
			y: this.blockshape.top - garena.imgObj.originalTop,
		};
	},

	shapeInitFunctions: function()
	{
		// var self = this;
  //       this.blockshape.on('selected', function () {
  //           self.showProperty();
  //           gselectedObj = self;
  //       });
	},

	bflagShowProperty : false,
	showProperty: function()
	{
		this.hideProperty('all');

		this.setPositionPropertyFrame($('#dlg_setting_eye'));

		$('#dlg_setting_eye').show();
		bflagShowProperty = true;

		$('#dlg_setting_eye #eye_height').val(this.baseheight);
	},

	hideProperty: function(sflag) {
		if(typeof(sflag)==='undefined') {
			$('#dlg_setting_eye').hide();
		}
		else {
			hideAllProperty();
		}
		bflagShowProperty = false;
	},

	//Creating Buttons
	createOk: function() {
	},
	createCancel: function() {
	},

	//Normal status Buttons
	deleteObj : function() {
		this.hideProperty();
		canvas.remove(this.blockshape);
		canvas.renderAll();
	},

	changedParameters: function(bflagpasted) {
		// if(typeof(bflagpasted) === 'undefined' || !bflagpasted) {
		// 	bflagpasted = false;
		// 	if(parseInt($('#lightobj_linenumber').val()) > 0) this.rowsNum = parseInt($('#lightobj_linenumber').val());
		// 	if(parseInt($('#lightobj_cols').val()) > 0) this.colsNum = parseInt($('#lightobj_cols').val());
		// 	if(parseInt($('#lightobj_distance').val()) > 0) this.lightDistance = parseInt($('#lightobj_distance').val());
		// 	if(parseInt($('#lightobj_intensity').val()) > 0) this.lightDistance = parseFloat($('#lightobj_intensity').val());
		// 	if(parseInt($('#lightobj_range').val()) > 0) this.lightDistance = parseInt($('#lightobj_range').val());
		// 	this.isShow = $('#lightobj_showlight').is(':checked') ? true : false;
		// 	this.changeShowLine(this.isShow);
		// }
		g_historyMan.addState('change', this);
	},

	setPositionPropertyFrame : function(property) {
		property.css('top', gDrawBoard.offset().top + 10);
		property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width());
	},

	getPointsFromArena : function()
	{
		return this.position;
	},

	getAbsolutePoints : function()
	{
		if(this.blockshape)
		{
			var groupOffsetX = 0, groupOffsetY = 0;
			var group = canvas.getActiveGroup();
			var group_scaleX = 1;
			var group_scaleY = 1;
			if(group)
			{
				var index = group._objects.indexOf(this.blockshape);
				if(index >= 0)
				{
					group_scaleX = group.scaleX;
					group_scaleY = group.scaleY;
					groupOffsetX = (group.left + group.width / 2 * group_scaleX);
					groupOffsetY = (group.top + group.height / 2 * group_scaleY);
				}
			}
			this.blockshape._calcDimensions();
			var tmppoints = [];
			for(var i = 0; i < this.blockshape.points.length; i++)
			{
				tmppoints.push({
					x: groupOffsetX + this.blockshape.left * group_scaleX + this.blockshape.points[i].x * (this.blockshape.scaleX * group_scaleX),
					y: groupOffsetY + this.blockshape.top * group_scaleY + this.blockshape.points[i].y * (this.blockshape.scaleY * group_scaleY)
					// x:this.blockshape.absoluteCoords.tl.x + this.blockshape.points[i].x * (this.blockshape.scaleX),
					// y:this.blockshape.absoluteCoords.tl.y + this.blockshape.points[i].y * (this.blockshape.scaleX)
				});
			}
			return tmppoints;
		}
		return null;
	},

	createFromJson : function(canvas, json)
	{
		this.json = json;
		this.type = json.type;

		if(json.property.baseheight)
			this.baseheight = json.property.baseheight;
		else
			this.baseheight = 0;
	},

	resetObject : function(state)
	{
		this.property.title = state.title;
		this.baseheight = state.baseheight;
		this.property = state.property;

		this.blockshape.left = state.position.left;
		this.blockshape.top = state.position.top;
		this.blockshape._calcDimensions();
		for(var i = 0; i < state.position.points.length; i++)
		{
			this.blockshape.points[i] = state.position.points[i];
		}
		this.removeSeatLines();
		this.reloadObject(true);
	},

	getCurState : function()
	{
		var property = {
			title: this.property.title,
			baseheight: this.baseheight,
			property: this.property,
			position: {
				left: this.blockshape.left,
				top: this.blockshape.top,
				points: this.blockshape.points
			},
			visible: this.blockshape.visible,
		};
		return JSON.stringify(property);
	},

	setVisible: function(isVisible)
	{
		this.blockshape.visible = isVisible;
	},
});