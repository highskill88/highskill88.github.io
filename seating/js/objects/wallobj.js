WallObj = function(points, cloneObj)
{
	if(points == null)
		return;
	this.type = 'WallObj';
	this.property = new CProperty();
	this.imgProp = new CImageProperty();

	this.callbackModified = null;
	//Create new
	if(typeof(cloneObj)==='undefined')
		this.init(points);
	else {
		this.fromGroupObj(cloneObj);
	}
}

var wall_2d_color = '#ff2222';
var wall_3d_color = '#ffffff';

$.extend(WallObj.prototype, {
	// object variables
	class_name: 'WallObj',
	type: 'WallObj',
	blockshape : null,
	status : 'normal', //'editing'
	points : null,

	// title: '',
	baseheight: 100,
	wall_thickness: 5,
	raise_offset: 0,
	backColor: wall_3d_color,
	bgImage: null,
	bgImagePath: null,
	bgVideoPath: null,

	lines: [],
	points: [],
	selectable: true,
	materialType: 'phong',

	imgProp: new CImageProperty(),
	property: new CProperty(),

	init: function(points) {
		this.createObjs(points);
		g_historyMan.addState('add', this);
	},

	fromGroupObj: function(cloneobj)
	{
		this.points = cloneobj.points;
		this.uniqueid = cloneobj.uniqueid;
		this.blockzoom = cloneobj.blockzoom;
		this.status = 'normal';
		this.seatTotal = cloneobj.seatTotal;

		this.blockshape = cloneobj;
		this.parentObj = this;
		this.blockshape.stroke = gcolor_blockborder;

		this.shapeInitFunctions();
		gselectedresizepoint = null;
	},

	createObjs: function(points, bcalcviewport)
	{
		// this.points = points;
		if(typeof(bcalcviewport)==='undefined')
			bcalcviewport = true;
		var tmpZoom = canvas.getZoom();

		gselectedresizepoint = null;
		this.blockshape = null;
		
		var realpoints = [];
		for(var i = 0; i < points.length; i++) {
			realpoints.push({x:points[i].x, y:points[i].y});
		}
		if( realpoints[realpoints.length - 1].x == realpoints[realpoints.length - 2].x &&
			realpoints[realpoints.length - 1].y == realpoints[realpoints.length - 2].y ) {
			realpoints.pop();
		}

		var tmppoints = [];
		if(realpoints.length == 2)
		{
			{
				tmppoints[0] = {x:realpoints[0].x, y:realpoints[0].y};
				var results = calculateShapePoints(this.wall_thickness * tmpZoom, 1, realpoints[0], realpoints[1]);
				tmppoints[3] = {x:results.pt1_t.x, y:results.pt1_t.y};
			}
			{
				tmppoints[1] = {x:realpoints[1].x, y:realpoints[1].y};
				var results = calculateShapePoints(this.wall_thickness * tmpZoom, -1, realpoints[1], realpoints[0]);
				tmppoints[2] = {x:results.pt1_t.x, y:results.pt1_t.y};
			}
		}
		else
		{
			for(var i = 0; i < realpoints.length; i++) {
				tmppoints[i] = {x:realpoints[i].x, y:realpoints[i].y};
				if(i == 0) {
					var results = calculateShapePoints(this.wall_thickness * tmpZoom, 1, realpoints[0], realpoints[1], realpoints[2]);
					tmppoints[realpoints.length * 2 - 1] = {x:results.pt1_t.x, y:results.pt1_t.y};
				}
				else if(i == realpoints.length - 1) {
					var results = calculateShapePoints(this.wall_thickness * tmpZoom, 1, realpoints[i-2], realpoints[i-1], realpoints[i]);
					tmppoints[i+1] = {x:results.pt3_t.x, y:results.pt3_t.y};
				}
				else {
					var results = calculateShapePoints(this.wall_thickness * tmpZoom, 1, realpoints[i-1], realpoints[i], realpoints[i+1]);
					tmppoints[2*realpoints.length - i - 1] = {x:results.pt2_t.x, y:results.pt2_t.y};
				}
			}
		}

		var min_x, min_y, max_x, max_y;
		min_x = max_x = tmppoints[0].x;
		min_y = max_y = tmppoints[0].y;
		for(var i = 0; i < tmppoints.length; i++) {
			if(min_x > tmppoints[i].x) min_x = tmppoints[i].x;
			if(min_y > tmppoints[i].y) min_y = tmppoints[i].y;
			if(max_x < tmppoints[i].x) max_x = tmppoints[i].x;
			if(max_y < tmppoints[i].y) max_y = tmppoints[i].y;
		}

		for(var i = 0; i < tmppoints.length; i++) {
			tmppoints[i].x -= min_x;
			tmppoints[i].y -= min_y;
		}

		this.blockshape = new fabric.Polygon(tmppoints, {
			left: (min_x - (bcalcviewport ? canvas.viewportTransform[4] : 0)) / tmpZoom, //(min_x+(max_x-min_x)/2) / tmpZoom,
			top: (min_y - (bcalcviewport ? canvas.viewportTransform[5] : 0)) / tmpZoom  , //(min_y+(max_y-min_y)/2) / tmpZoom,
			fill: this.backColor,
			opacity: 0.5,
			stroke: gcolor_blockborder,
			strokeWidth: 1.5 * tmpZoom,
			originX: 'left',
			originY: 'top',
			scaleX: 1 / tmpZoom,
			scaleY: 1 / tmpZoom,
			hoverCursor: 'default',
			selectable : this.selectable,
			hasBorders: false,
			lockUniScaling:true,
			lockRotation:true,
			lockMovementX:false,
			lockMovementY:false,
			seatTotal:this.seatTotal,
			uniqueid:this.uniqueid,
			blockzoom:this.blockzoom,
			objType:'WallObj',
			parentObj:this
		});

		canvas.add(this.blockshape);
		if(!this.selectable)
			canvas.moveTo(this.blockshape, 1);
		canvas.renderAll();

		this.shapeInitFunctions();
	},

	getShapePoints: function()
	{
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		var selectionX = 0, selectionY = 0;
		var tmp = canvas.getActiveGroup();
		if(tmp)
		{
			selectionX = (tmp.left + tmp.width / 2) * tmpZoom;
			selectionY = (tmp.top + tmp.height / 2) * tmpZoom;
		}

		this.blockshape._calcDimensions();
		for(i=0; i < this.blockshape.points.length / 2; i++) {
			tmppoints.push({
				x:selectionX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:selectionY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}

		return tmppoints;
	},

	removeResizePoint: function()
	{
		// if( gselectedresizepoint == null) return;
		
		// this.blockshape.points.splice(gselectedresizepoint.nindex, 1);

		// this.blockshape._calcDimensions();
		// var tmpZoom = canvas.getZoom();
		// var tmppoints = [];
		// for(i=0; i < this.blockshape.points.length; i++) {
		// 	tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
		// 		y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		// }
		// canvas.remove(this.blockshape);
		// this.blockshape = null;
		// this.createObjs(tmppoints, false);
		// //canvas.setActiveObject(this.blockshape);
		// canvas.renderAll();
		// gselectedresizepoint = null;
	},
	
	addResizePoint: function (pt)
	{
		if(this.isSettingAxis) return;

		var tmpZoom = canvas.getZoom();
		pt.x = ((pt.x - canvas.viewportTransform[4]) / tmpZoom - this.blockshape.left) / this.blockshape.scaleX;
		pt.y = ((pt.y - canvas.viewportTransform[5]) / tmpZoom - this.blockshape.top) / this.blockshape.scaleY;
		var index = -1, targetalpha = 360;
		for(var i = 0; i < this.blockshape.points.length / 2; i++) {
			var pt1;
			if(i == 0)
				pt1 = this.blockshape.points[this.blockshape.points.length - 1];
			else
				pt1 = this.blockshape.points[i - 1];

			var pt2 = pt;
			var pt3 = this.blockshape.points[i];

			var p = (pt1.x - pt2.x) * (pt3.x - pt2.x) + (pt1.y - pt2.y) * (pt3.y - pt2.y);
			var q1 = Math.sqrt( (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) );
			var q2 = Math.sqrt( (pt3.x - pt2.x) * (pt3.x - pt2.x) + (pt3.y - pt2.y) * (pt3.y - pt2.y) );
			var alpha = Math.acos(p / (q1 * q2)) * (180 / Math.PI);

			if(Math.abs(180 - alpha) < targetalpha) {
				index = i;
				targetalpha = Math.abs(180 - alpha);
			}
		}

		if(index != -1) {
			if(index == 0) {
				if(this.axisindex == this.blockshape.points.length - 1)
					this.axisindex++;
				this.blockshape.points.push({x:pt.x, y:pt.y});
			}
			else {
				if(this.axisindex >= index)
					this.axisindex++;
				this.blockshape.points.splice(index, 0, {x:pt.x, y:pt.y});
			}
		}

		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		for(i=0; i < this.blockshape.points.length / 2; i++)
		{
			tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}
		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, false);
		canvas.setActiveObject(this.blockshape);
		canvas.renderAll();
	},

	// createResizePoints: function()
	// {
	// 	var self = this;
	// 	gselectedresizepoint = null;
	// 	if(gresizepoints != null)
	// 	{
	// 		for(var i = 0; i < gresizepoints.length; i++)
	// 			canvas.remove(gresizepoints[i]);
	// 		gresizepoints = null;
	// 	}
	// 	gresizepoints = [];

	// 	var tmpZoom = canvas.getZoom();
	// 	for(var i = 0; i < self.blockshape.points.length; i++)
	// 	{
	// 		gresizepoints[i] = new fabric.Circle( {radius:3 / tmpZoom,
	// 									strokeWidth:0,
	// 									stroke:'#ffff00',
	// 									fill:gcolor_blockpoints,
	// 									left:self.blockshape.left + self.blockshape.points[i].x * self.blockshape.scaleX,
	// 									top:self.blockshape.top + self.blockshape.points[i].y * self.blockshape.scaleY,
	// 									originX: 'center',
	// 									originY: 'center',
	// 									objType : 'resizepoint',
	// 									hasControls:false,
	// 									hasBorders:false,
	// 									nindex:i} );
	// 		canvas.add(gresizepoints[i]);
	// 		canvas.bringToFront(gresizepoints[i]);

	// 		gresizepoints[i].on('selected', function()
	// 		{
	// 			gselectedresizepoint = this;
	// 		});
	// 		gresizepoints[i].on('moving', function()
	// 		{
	// 			self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
	// 			self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;
	// 			self.reloadObject();
	// 			canvas.renderAll();
	// 		});
	// 		gresizepoints[i].on('modified', function()
	// 		{
	// 			self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
	// 			self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;
	// 			self.reloadObject();
	// 			for(var i = 0; i < gresizepoints.length; i++)
	// 			{
	// 				canvas.bringToFront(gresizepoints[i]);
	// 			}
	// 			canvas.renderAll();
	// 			gselectedresizepoint = this;
	// 			if(self.callbackModified)
	// 				self.callbackModified.call(self, self);
	// 		});
	// 	}
	// 	canvas.renderAll();

	// 	self.showProperty();
	// },

	shapeInitFunctions: function()
	{
		var self = this;
		var lastPointX;
		var lastPointY;

		this.blockshape.on('selected', function()
		{
			lastPointX = self.blockshape.left;
			lastPointY = self.blockshape.top;
			gselectedresizepoint = null;
			if(gselectedObj != null) {
				gselectedObj.blockshape.stroke = gcolor_blockborder;
			}
			gselectedObj = self;
			self.blockshape.stroke = gcolor_blockselborder;

			if(gresizepoints != null) {
				for(var i = 0; i < gresizepoints.length; i++)
					canvas.remove(gresizepoints[i]);
				gresizepoints = null;
			}
			gresizepoints = [];

			self.drawSeatLines();

			var tmpZoom = canvas.getZoom();
			for(var i = 0; i < self.blockshape.points.length / 2; i++) {
				gresizepoints[i] = new fabric.Circle( {radius:3 / tmpZoom,
											strokeWidth:0,
											stroke:'#ffff00',
											fill:gcolor_blockpoints,
											left:self.blockshape.left + self.blockshape.points[i].x * self.blockshape.scaleX,
											top:self.blockshape.top + self.blockshape.points[i].y * self.blockshape.scaleY,
											originX: 'center',
											originY: 'center',
											objType : 'resizepoint',
											//scaleX: self.blockshape.scaleX,
											//scaleY: self.blockshape.scaleY,
											hasControls:false,
											hasBorders:false,
											nindex:i} );
				canvas.add(gresizepoints[i]);
				canvas.bringToFront(gresizepoints[i]);

				gresizepoints[i].on('selected', function () {
					gselectedresizepoint = this;
				});
				gresizepoints[i].on('moving', function(e) {
					if(e.e.shiftKey) {
						var nNext = this.nindex + 1;
						if(nNext >= self.blockshape.points.length / 2)
							nNext = this.nindex - 1;
						var ptNext = self.blockshape.points[nNext];
						var ptCur = self.blockshape.points[this.nindex];
						var xAxis = false;
						if(Math.abs(ptNext.x - ptCur.x) > Math.abs(ptNext.y - ptCur.y))
							xAxis = true;
						if(xAxis) {
							self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
							self.blockshape.points[this.nindex].y = ptNext.y;
							this.top = ptNext.y * self.blockshape.scaleY + self.blockshape.top;
						}
						else {
							self.blockshape.points[this.nindex].x = ptNext.x;
							self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;
							this.left = ptNext.x * self.blockshape.scaleX + self.blockshape.left;
						}
					}
					else {
						self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
						self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;
					}

					// self.blockshape._calcDimensions();
					// var tmpZoom = canvas.getZoom();
					// var tmppoints = [];
					// for(i=0; i < self.blockshape.points.length / 2; i++) {
					//     tmppoints.push({
					//         x:self.blockshape.left * tmpZoom + self.blockshape.points[i].x * (tmpZoom * self.blockshape.scaleX),
					//         y:self.blockshape.top * tmpZoom + self.blockshape.points[i].y * (tmpZoom * self.blockshape.scaleX)});
					// }
					// canvas.remove(self.blockshape);
					// self.blockshape = null;
					// self.createObjs(tmppoints, false);
					
					self.reloadObject();
					canvas.renderAll();
					self.hideProperty();
				});
				gresizepoints[i].on('modified', function() {
					self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
					self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;

					// self.blockshape._calcDimensions();
					// var tmpZoom = canvas.getZoom();
					// var tmppoints = [];
					// for(i=0; i < self.blockshape.points.length / 2; i++) {
					//     tmppoints.push({
					//         x:self.blockshape.left * tmpZoom + self.blockshape.points[i].x * (tmpZoom * self.blockshape.scaleX),
					//         y:self.blockshape.top * tmpZoom + self.blockshape.points[i].y * (tmpZoom * self.blockshape.scaleX)});
					// }
					// canvas.remove(self.blockshape);
					// self.blockshape = null;
					// self.createObjs(tmppoints, false);

					self.reloadObject();
					canvas.setActiveObject(self.blockshape);
					canvas.renderAll();
					gselectedresizepoint = this;
					if(self.callbackModified)
						self.callbackModified.call(self, self);
					g_historyMan.addState('modify', self);
				});
			}
			canvas.renderAll();

			self.showProperty();
		});

		this.blockshape.on('moving', function() {

			if(gresizepoints != null) {
				for(var i = 0; i < gresizepoints.length; i++)
					canvas.remove(gresizepoints[i]);
			}
			gresizepoints = null;

			self.hideProperty();
		});

		this.blockshape.on('scaling', function() {
			self.hideProperty();
		});

		this.blockshape.on('rotating', function() {
			self.hideProperty();
		});

		this.blockshape.on('modified', function() {
			if(!bflagShowProperty) {
				self.showProperty();
				if(self.callbackModified)
				{
					self.callbackModified.call(self, self, {move: {
						x: lastPointX - self.blockshape.left, 
						y: lastPointY - self.blockshape.top
					}});
				}
				g_historyMan.addState('move', self);
				canvas.setActiveObject(self.blockshape);
			}
		});
	},

	removeLines: function()
	{
		// for(var i = 0 ; i < this.lines.length; i++)
		// {
		// 	canvas.remove(this.lines[i]);
		// 	this.lines[i] = null;
		// }
		// this.lines = [];
	},

	// createLines: function()
	// {
	// 	this.removeLines();
	// 	var tmpZoom = canvas.getZoom();
	// 	for(var i = 0; i < this.blockshape.points.length - 1; i++)
	// 	{
	// 		var next = i + 1;
	// 		// if(i == this.blockshape.points.length - 1)
	// 		// 	next = 0;
	// 		var x1 = this.blockshape.left + this.blockshape.points[i].x * this.blockshape.scaleX;
	// 		var y1 = this.blockshape.top + this.blockshape.points[i].y * this.blockshape.scaleY;
	// 		var x2 = this.blockshape.left + this.blockshape.points[next].x * this.blockshape.scaleX;
	// 		var y2 = this.blockshape.top + this.blockshape.points[next].y * this.blockshape.scaleY;
	// 		var line = new fabric.Line([x1, y1, x2, y2], {
	// 			opacity: 0.5,
	// 			stroke: wall_2d_color,
	// 			strokeWidth: 3.5 / canvas.getZoom(),
	// 			originX: 'center', 
	// 			originY: 'center',
	// 			selectable: false,
	// 			evented: false,
	// 		});
	// 		canvas.add(line);
	// 		this.lines.push(line);
	// 	}
	// },

	// done: function()
	// {
	// 	// this.createLines();
	// 	this.blockshape.visible = false;
	// 	this.blockshape.selectable = false;
	// 	this.hideProperty();
	// },

	bflagShowProperty : false,
	showProperty: function()
	{
		this.hideProperty('all');

		this.setPositionPropertyFrame($('#wallobj_normal'));

		$('#wallobj_normal').show();
		bflagShowProperty = true;
		$('#wallobj_title').val(this.property.title);
		$('#wallobj_height').val(this.baseheight);
		$('#wallobj_thickness').val(this.wall_thickness);
		$('#wallobj_raiseOffset').val(this.raise_offset);
		// $('#wallobj_color').val(this.backColor);
		$('#wallobj_color').css('background-color', this.backColor);
		$('#wallobj_color').ColorPickerSetColor(this.backColor);


		$('#wallobj_normal .check_object_selectable').prop("checked", this.selectable);

		$('#wallobj_material_type').val(this.materialType);

		g_wallImage.setValues();
	},

	hideProperty: function(sflag) {
		if(typeof(sflag)==='undefined') {
			$('#wallobj_normal').hide();
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
	doNotShowSeats: function() {

	},

	//Normal status Buttons
	deleteObj : function() {
		// this.removeLines();
		this.hideProperty();
		clearResizePoints();

		canvas.remove(this.blockshape);
		canvas.renderAll();

		//dealloc this class
		gselectedObj = null;
		gselectedresizepoint = null;
		// gWallObj = null;
	},

	reloadObject: function() {
		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		for(i=0; i < this.blockshape.points.length / 2; i++) {
			tmppoints.push({
				x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleY)});
		}
		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, false);
	},

	changedParameters: function() {
		this.property.title = $('#wallobj_title').val();
		// this.baseheight = parseInt($('#wallobj_height').val());
		this.wall_thickness = parseFloat($('#wallobj_thickness').val());
		this.raise_offset = parseFloat($('#wallobj_raiseOffset').val());
		// this.backColor = $('#wallobj_color').css('background-color');

		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		for(i=0; i < this.blockshape.points.length / 2; i++) {
			tmppoints.push({
				x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}
		canvas.remove(this.blockshape);
		this.blockshape = null;

		this.createObjs(tmppoints, false);
		canvas.renderAll();
		gselectedresizepoint = null;

		this.blockshape.set({ fill:this.backColor });

		if(this.callbackModified)
			this.callbackModified.call(this, this);
		g_historyMan.addState('change', this);
	},

	changedBackgroundColor: function(val) {
		this.backColor = val;
		this.blockshape.set({ fill:this.backColor });
		canvas.renderAll();
		if(this.callbackModified)
			this.callbackModified.call(this, this, {backColor: val});
	},

	drawSeatLines: function()
	{

	},

	flipHoriz : function() {
		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		var tmpavgx = 0, tmpavgy = 0;
		var tmpi = 0;
		for(i=this.blockshape.points.length / 2 - 1; i >= 0; i--) {
			tmppoints.push({
				x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
			tmpavgx += tmppoints[tmpi].x;
			tmpavgy += tmppoints[tmpi].y;
			tmpi++;
		}
		tmpavgx = tmpavgx / (this.blockshape.points.length / 2);
		tmpavgy = tmpavgy / (this.blockshape.points.length / 2);

		for(i = 0; i < tmppoints.length; i++) {
			tmppoints[i].x = 2*tmpavgx - tmppoints[i].x;
		}

		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, false);
		this.blockshape.parentObj = this;
		canvas.setActiveObject(this.blockshape);
		canvas.renderAll();
		gselectedresizepoint = null;
	},

	flipVert : function() {
		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		var tmpavgx = 0, tmpavgy = 0;
		var tmpi = 0;
		for(i=this.blockshape.points.length / 2 - 1; i >= 0; i--) {
			tmppoints.push({
				x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
			tmpavgx += tmppoints[tmpi].x;
			tmpavgy += tmppoints[tmpi].y;
			tmpi++;
		}
		tmpavgx = tmpavgx / (this.blockshape.points.length / 2);
		tmpavgy = tmpavgy / (this.blockshape.points.length / 2);

		for(i = 0; i < tmppoints.length; i++) {
			tmppoints[i].y = 2*tmpavgy - tmppoints[i].y;
		}

		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, false);
		this.blockshape.parentObj = this;
		canvas.setActiveObject(this.blockshape);
		canvas.renderAll();
		gselectedresizepoint = null;
	},
	setPositionPropertyFrame : function(property) {
		property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width());
		property.css('top', $('#menu-area').height());
	},

	getShapeAllPoints : function(points)
	{
		// var tmppoints = [];
		// if(points.length == 4)
		// {
		// 	{
		// 		tmppoints[0] = {x:points[0].x, y:points[0].y};
		// 		var results = calculateShapePoints(this.wall_thickness, 1, points[0], points[1]);
		// 		tmppoints[3] = {x:results.pt1_t.x, y:results.pt1_t.y};
		// 	}
		// 	{
		// 		tmppoints[1] = {x:points[1].x, y:points[1].y};
		// 		var results = calculateShapePoints(this.wall_thickness, -1, points[1], points[0]);
		// 		tmppoints[2] = {x:results.pt1_t.x, y:results.pt1_t.y};
		// 	}
		// }
		// else
		// {
		// 	for(var i = 0; i < points.length / 2; i++) {
		// 		tmppoints[i] = {x:points[i].x, y:points[i].y};
		// 		if(i == 0) {
		// 			var results = calculateShapePoints(this.wall_thickness, 1, points[0], points[1], points[2]);
		// 			tmppoints[points.length * 2 - 1] = {x:results.pt1_t.x, y:results.pt1_t.y};
		// 		}
		// 		else if(i == points.length - 1) {
		// 			var results = calculateShapePoints(this.wall_thickness, 1, points[i-2], points[i-1], points[i]);
		// 			tmppoints[i+1] = {x:results.pt3_t.x, y:results.pt3_t.y};
		// 		}
		// 		else {
		// 			var results = calculateShapePoints(this.wall_thickness, 1, points[i-1], points[i], points[i+1]);
		// 			tmppoints[2*points.length - i - 1] = {x:results.pt2_t.x, y:results.pt2_t.y};
		// 		}
		// 	}
		// }

		return points;
	},

	getAbsolutePoints : function()
	{
		if(this.blockshape && this.blockshape.width > 0)
		{
			var tmpZoom = canvas.getZoom();
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
					y: groupOffsetY + this.blockshape.top * group_scaleY + this.blockshape.points[i].y * (this.blockshape.scaleX * group_scaleY)
				});
			}
			return tmppoints;
		}
		else
		{
			return this.getShapeAllPoints(this.points);
		}

		return null;
	},

	getPointsFromArena : function()
	{
		var tmpZoom = canvas.getZoom();
		if(this.blockshape)
		{
			this.blockshape._calcDimensions();
			var tmppoints = [];
			for(var i = 0; i < this.blockshape.points.length; i++)
			{
				tmppoints.push({
					x:this.blockshape.left + this.blockshape.points[i].x * (this.blockshape.scaleX) - garena.imgObj.originalLeft,
					y:this.blockshape.top + this.blockshape.points[i].y * (this.blockshape.scaleX) - garena.imgObj.originalTop
				});
			}
			return tmppoints;
		}
	},

	getPosFromGroup : function(group)
	{
		var tmpZoom = canvas.getZoom();
		var gX = 0;
		var gY = 0;
		if(group)
		{
			gX = (group.left + group.width * 0.5) * tmpZoom;
			gY = (group.top + group.height * 0.5) * tmpZoom;
		}
		var tmppoints = [];
		this.blockshape._calcDimensions();
		for(var i = 0; i < this.blockshape.points.length; i++)
		{
			tmppoints.push({x:gX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:gY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}
		return tmppoints;
	},

	createFromJson : function(canvas, json)
	{
		this.points = json.points;
		this.type = json.type;

		// if(json.property.title)
		// 	this.title = json.property.title;
		// else
		// 	this.title = '';
		if(json.property.baseheight)
			this.baseheight = json.property.baseheight;
		else if(json.property.wall_height)
			this.baseheight = json.property.wall_height;
		else
			this.baseheight = 100;
		if(json.property.wall_thickness)
			this.wall_thickness = json.property.wall_thickness;
		else
			this.wall_thickness = 1;
		if(json.property.raise_offset)
			this.raise_offset = json.property.raise_offset;
		else
			this.raise_offset = 0;
		if(json.property.backColor)
			this.backColor = json.property.backColor;
		else
			this.backColor = 0xffffff;
		if(json.property.bgImagePath)
		{
			this.bgImagePath = json.property.bgImagePath;
			// this.setImageBackground(json.property.bgImagePath);
		}
		if(json.property.bgVideoPath)
		{
			this.bgVideoPath = json.property.bgVideoPath;
			// this.setVideoBackground(json.property.bgVideoPath);
		}
		if(json.property.selectable)
			this.selectable = json.property.selectable;
		else
			this.selectable = false;

		if(json.property.materialType)
			this.materialType = json.property.materialType;
		else
			this.materialType = 'phong';
		
		if(json.property.property)
			this.property = json.property.property;
		else
			this.property = new CProperty();

		if(json.property.imgProp)
			this.imgProp = json.property.imgProp;
		else
			this.imgProp = new CImageProperty();
	},

	resetObject : function(state)
	{
		// this.title = state.title;
		this.axisindex = state.axisindex;
		this.baseheight = state.baseheight;
		this.backColor = state.backColor;
		this.block_aspect = state.block_aspect;
		this.imgProp = state.imgProp;
		this.property = state.property;

		this.baseheight = state.baseheight;
		this.wall_thickness = state.wall_thickness;
		this.raise_offset = state.raise_offset;
		this.materialType = state.materialType;

		this.blockshape.left = state.position.left;
		this.blockshape.top = state.position.top;
		this.blockshape._calcDimensions();
		for(var i = 0; i < state.position.points.length; i++)
		{
			this.blockshape.points[i] = state.position.points[i];
		}
		this.reloadObject(true);
	},

	getCurState : function()
	{
		var property = {
			// title: this.title,
			axisindex: this.axisindex,
			baseheight: this.baseheight,
			backColor: this.backColor,
			block_aspect: this.block_aspect,
			imgProp: this.imgProp,
			property: this.property,

			baseheight: this.baseheight,
			wall_thickness: this.wall_thickness,
			raise_offset: this.raise_offset,
			materialType: this.materialType,

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
		if(isVisible)
		{
		}
		else
		{
			if(gresizepoints != null)
			{
				for(var i = 0; i < gresizepoints.length; i++)
					canvas.remove(gresizepoints[i]);
			}
			gresizepoints = null;
		}
		this.blockshape.visible = isVisible;
	},

	initialize : function()
	{
		var newPoints = [];
		var tmpZoom = canvas.getZoom();
		for(var i = 0; i < this.points.length / 2; i++)
		{
			var point = {
				x: this.points[i].x * tmpZoom + garena.imgObj.originalLeft * tmpZoom,
				y: this.points[i].y * tmpZoom + garena.imgObj.originalTop * tmpZoom,
			}
			newPoints.push(point);
		}
		this.createObjs(newPoints);
		newPoints = [];
		g_historyMan.addState('add', this);
		this.blockshape.visible = this.property.isVisible2D;
		canvas.renderAll();
	},

	setImageBackground: function(imagePath)
	{
		if(imagePath == null)
		{
			this.bgImagePath = null;
			this.bgImage = null;
			this.blockshape.set('fill', '#ffffff');
			canvas.renderAll();
			if(this.callbackModified)
				this.callbackModified.call(this, this);
			return;
		}
		else
		{
			if(IsImageValidate(imagePath))
			{
				var self = this;
				fabric.Image.fromURL(imagePath, function(img)
				{
					self.bgVideoPath = null;
					self.bgImagePath = imagePath;
					self.bgImage = img;
					// self.drawBgImage();
					canvas.renderAll();
		            var progressModal = document.getElementById('progressModal');
		            progressModal.style.display = "none";
					if(self.callbackModified)
						self.callbackModified.call(self, self);
				});
			}
		}
	},

	setVideoBackground: function(videoPath)
	{
		if(videoPath == null)
		{
			this.bgVideoPath = null;
			if(this.callbackModified)
				this.callbackModified.call(this, this);
			return;
		}
		else
		{
			if(IsVideoValidate(videoPath))
			{
				this.bgImagePath = null;
				this.bgImage = null;
				canvas.renderAll();

				this.bgVideoPath = videoPath;
	            var progressModal = document.getElementById('progressModal');
	            progressModal.style.display = "none";
				if(this.callbackModified)
					this.callbackModified.call(this, this);
			}
		}
	},

	drawBgImage : function(color)
	{
	},

	setSelectable: function(isSelectable)
	{
		this.selectable = isSelectable;
		this.blockshape.selectable = isSelectable;
	},

	setImageFlpX: function()
	{
		this.imgProp.flipX = !this.imgProp.flipX;
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	setImageFlpY: function()
	{
		this.imgProp.flipY = !this.imgProp.flipY;
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	rotateBgImage: function()
	{
	},
});

