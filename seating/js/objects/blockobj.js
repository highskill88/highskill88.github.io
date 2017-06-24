BlockObj = function(points, cloneObj, bflagShowLines)
{
	if(points == null)
		return;
	this.property = new CProperty();
	this.imgProp = new CImageProperty();

	//Create new
	if(typeof(cloneObj)==='undefined' || cloneObj == null)
		this.init(points, bflagShowLines);
	else
		this.fromGroupObj(cloneObj);
}


$.extend(BlockObj.prototype, {
	// object variables
	class_name: 'BlockObj',
	type: 'BlockObj',

	blockshape : null,
	titleshape : null,
	fabriclines : null,
	fabricLineNumbers : null,
	fabric_pattern: null,
	bgImage: null,

	status : 'normal', //'editing'
	uniqueid : 0,
	blockzoom : 5,
	seatTotal: 0,

	targetalpha: 0,
	points: null,

	drawData: {},

	// title : '',
	tags: '',
	viewscore: 0,
	lineSpace : 10,
	seatspace : 10,
	axisindex : 0,
	showchair: true,
	showlines : true,
	showLabel: true,
	showLabel3D: false,
	baseheight : 0,
	layerheight : 4,
	rowStart: 1,
	backColor: '#ffffff',

	wall_front : false,
	wall_back : false,
	wall_left : false,
	wall_right : false,
	handrail_img: null,
	handrail_height: 6,
	bgImagePath: null,

	seatColor : defaultSeatColor,
	raiseHeight: 0,
	upstair: 0,
	isStair: false,

	shapeObj : null,

	lineNum: 0,

	block_aspect: false,
	selectable: true,

	imgProp: new CImageProperty(),
	property: new CProperty(),

	init: function(points, bflagShowLines) {
		this.seatspace = g_appOptions.chairSpace;
		this.lineSpace = g_appOptions.lineSpace;
		this.showchair = true;
		this.showLabel = true;
		this.showLabel3D = false;
		if(typeof(bflagShowLines)!=='undefined')
			this.showlines = bflagShowLines;
		
		this.uniqueid = new Date().getTime();
		this.createObjs(points);
		g_historyMan.addState('add', this);
	},

	clone: function(cloneObj) {
	},

	fromGroupObj: function(cloneobj) {
		this.uniqueid = cloneobj.uniqueid;
		this.blockzoom = cloneobj.blockzoom;
		this.status = 'normal';
		this.seatTotal = cloneobj.seatTotal;

		this.blockshape = cloneobj;
		this.blockshape.parentObj = this;
		this.blockshape.stroke = gcolor_blockborder;

		this.shapeInitFunctions();
		gselectedresizepoint = null;
	},

	createObjs: function(points, bcalcviewport) {
		if(typeof(bcalcviewport)==='undefined')
			bcalcviewport = true;

		gselectedresizepoint = null;
		this.blockshape = null;

		var min_x, min_y, max_x, max_y;
		var tmpZoom = canvas.getZoom();
		min_x = max_x = points[0].x;
		min_y = max_y = points[0].y;
		for(var i = 0; i < points.length; i++) {
			if(min_x > points[i].x) min_x = points[i].x;
			if(min_y > points[i].y) min_y = points[i].y;
			if(max_x < points[i].x) max_x = points[i].x;
			if(max_y < points[i].y) max_y = points[i].y;
		}

		for(var i = 0; i < points.length; i++) {
			points[i].x -= min_x;
			points[i].y -= min_y;
		}
		// var parentObj;
		// if(bcalcviewport)
		// 	parentObj = this;
		this.blockshape = new fabric.Polygon(points, {
			left : (min_x - (bcalcviewport ? canvas.viewportTransform[4] : 0)) / tmpZoom, //(min_x+(max_x-min_x)/2) / tmpZoom,
			top : (min_y - (bcalcviewport ? canvas.viewportTransform[5] : 0))/ tmpZoom  , //(min_y+(max_y-min_y)/2) / tmpZoom,
			fill : this.backColor,
			opacity : 0.5,
			stroke : gcolor_blockborder,
			strokeWidth : 1.5 * tmpZoom,
			originX : 'left',
			originY : 'top',
			scaleX : 1 / tmpZoom,
			scaleY : 1 / tmpZoom,
			hoverCursor : 'default',
			selectable : this.selectable,
			hasBorders : false,
			lockUniScaling : true,
			lockRotation : true,
			objtype : 'BlockObj',
			lockMovementX : false,
			lockMovementY : false,
			seatTotal : this.seatTotal,
			uniqueid : this.uniqueid,
			blockzoom : this.blockzoom,
			parentObj : this,
		});

		canvas.add(this.blockshape);
		if(!this.selectable)
			canvas.moveTo(this.blockshape, 1);
		// canvas.renderAll();

		this.shapeInitFunctions();
	},

	createAllObjects : function(points) {
		
	},

	getShapePoints: function() {
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
		for(i = 0; i < this.blockshape.points.length; i++) {
			tmppoints.push({
				x:selectionX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:selectionY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}

		return tmppoints;
	},

	removeResizePoint: function() {
		if( gselectedresizepoint == null) return;
		
		this.blockshape.points.splice(gselectedresizepoint.nindex, 1);

		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		for(i=0; i < this.blockshape.points.length; i++) {
			tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}
		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, false);
		canvas.setActiveObject(this.blockshape);
		canvas.renderAll();
		gselectedresizepoint = null;
	},
	
	addResizePoint: function (pt) {
		if(this.isSettingAxis) return;

		var tmpZoom = canvas.getZoom();
		pt.x = ((pt.x - canvas.viewportTransform[4]) / tmpZoom - this.blockshape.left) / this.blockshape.scaleX;
		pt.y = ((pt.y - canvas.viewportTransform[5]) / tmpZoom - this.blockshape.top) / this.blockshape.scaleY;
		var index = -1, targetalpha = 360;
		for(var i = 0; i < this.blockshape.points.length; i++) {
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
		for(i=0; i < this.blockshape.points.length; i++)
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

	isSettingAxis : false,
	setAxisPoint: function (pt) {
		if(!this.isSettingAxis) return;

		var tmpZoom = canvas.getZoom();
		pt.x = (pt.x / tmpZoom - this.blockshape.left) / this.blockshape.scaleX;
		pt.y = (pt.y / tmpZoom - this.blockshape.top) / this.blockshape.scaleY;
		var index = -1, targetalpha = 360;
		for(var i = 0; i < this.blockshape.points.length; i++) {
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
			index--;
			if(index < 0) index = this.blockshape.points.length - 1;

			this.axisindex = index;

			this.drawSeatLines();
			$('#blockobj_seatcount').val(this.seatTotal);

			this.isSettingAxis = false;
		}
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	removeSeatLines: function() {
		if(this.fabriclines != null) {
			for(var i = 0; i < this.fabriclines.length; i++)
				canvas.remove(this.fabriclines[i]);
		}
		this.fabriclines = [];
		if(this.fabricLineNumbers != null)
		{
			for(var i = 0; i < this.fabricLineNumbers.length; i++)
				canvas.remove(this.fabricLineNumbers[i]);
		}
		this.fabricLineNumbers = [];

		canvas.remove(this.fabric_pattern);
		this.fabric_pattern = null;

		if(this.titleshape != null)
			canvas.remove(this.titleshape);
		this.titleshape = null;
	},

	shapeInitFunctions: function()
	{
		var self = this;
		var lastPointX;
		var lastPointY;

		this.blockshape.on('selected', function (e)
		{
			var points = [];
			if(this.angle > 0)
			{
				var center = {
					x: this.width * 0.5,
					y: this.height * 0.5,
				}
				for(var i = 0; i < this.points.length; i++)
				{
					var r = getDistanceFromTwoPoints(center, this.points[i]);
					points.push({
						x: this.points[i].x + r * Math.cos(this.angle * Math.PI / 180),
						y: this.points[i].y + r * Math.sin(this.angle * Math.PI / 180),
					});
				}
			}
			else
			{
				for(var i = 0; i < this.points.length; i++)
				{
					points.push({
						x: this.points[i].x,
						y: this.points[i].y,
					});
				}
			}
			lastPointX = self.blockshape.left;
			lastPointY = self.blockshape.top;
			gselectedresizepoint = null;
			if(gselectedObj != null)
			{
				gselectedObj.blockshape.stroke = gcolor_blockborder;
				gselectedObj.doNotShowSeats();
			}
			gselectedObj = self;
			self.blockshape.stroke = gcolor_blockselborder;

			if(gresizepoints != null)
			{
				for(var i = 0; i < gresizepoints.length; i++)
					canvas.remove(gresizepoints[i]);
				gresizepoints = null;
			}
			gresizepoints = [];

			self.drawSeatLines();

			var tmpZoom = canvas.getZoom();
			for(var i = 0; i < points.length; i++)
			{
				gresizepoints[i] = new fabric.Circle( {radius:3 / tmpZoom,
											strokeWidth:0,
											stroke:'#ffff00',
											fill:gcolor_blockpoints,
											left:self.blockshape.left + points[i].x * self.blockshape.scaleX,
											top:self.blockshape.top + points[i].y * self.blockshape.scaleY,
											originX: 'center',
											originY: 'center',
											objtype : 'resizepoint',
											//scaleX: self.blockshape.scaleX,
											//scaleY: self.blockshape.scaleY,
											hasControls:false,
											hasBorders:false,
											nindex:i} );
				canvas.add(gresizepoints[i]);
				canvas.bringToFront(gresizepoints[i]);

				gresizepoints[i].on('selected', function()
				{
					gselectedresizepoint = this;
				});
				gresizepoints[i].on('moving', function(e)
				{
					self.removeSeatLines();

					if(e.e.shiftKey) {
						var nNext = this.nindex + 1;
						if(nNext >= self.blockshape.points.length)
							nNext = 0;
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
					
					self.reloadObject(false);
					canvas.renderAll();
					self.hideProperty();
				});
				gresizepoints[i].on('modified', function(e)
				{
					self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
					self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;

					self.reloadObject(false);
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
			self.removeSeatLines();

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

		this.blockshape.on('modified', function()
		{
			if(!bflagShowProperty) {
				self.showProperty();
				if(self.callbackModified)
				{
					if(this.hasControls)
					{
						self.callbackModified.call(self, self);
					}
					else
					{
						self.callbackModified.call(self, self, {move: {
							x: lastPointX - self.blockshape.left, 
							y: lastPointY - self.blockshape.top
						}});
					}
				}
				g_historyMan.addState('move', self);
				canvas.setActiveObject(self.blockshape);
			}
		});
	},

	bflagShowProperty : false,
	showProperty: function()
	{
		this.hideProperty('all');

		this.setPositionPropertyFrame($('#blockobj_normal'));

		$('#blockobj_normal').show();
		bflagShowProperty = true;

		$('#blockobj_title').val(this.property.title);
		$('#blockobj_tags').val(this.property.tags);
		$('#blockobj_seatcount').val(this.seatTotal);
		$('#blockobj_viewscore').val(this.viewscore);
		$('#blockobj_lineSpace').val(this.lineSpace);
		$('#blockobj_seatspace').val(this.seatspace);
		$('#blockobj_showchair').prop("checked", this.showchair);
		$('#blockobj_showlines').prop("checked", this.showlines);
		$('#blockobj_showlabel').prop("checked", this.showLabel);
		$('#blockobj_showlabel_3d').prop("checked", this.showLabel3D);
		$('#blockobj_3dheight').val(this.baseheight);
		$('#blockobj_layer_height').val(this.layerheight);
		$('#blockobj_color').css('background-color', this.backColor);
		$('#blockobj_color').ColorPickerSetColor(this.backColor);

		$('#blockobj_raise').val(this.raiseHeight);
		$('#block_wall_front').prop('checked', this.wall_front);
		$('#block_wall_back').prop('checked', this.wall_back);
		$('#block_wall_left').prop('checked', this.wall_left);
		$('#block_wall_right').prop('checked', this.wall_right);
		$('#blockobj_normal .text_object_wall_height').val(this.handrail_height);
		$('#blockobj_upstair').val(this.upstair);

		$('#blockobj_normal .check_object_selectable').prop("checked", this.selectable);


		$('#blockobj_seat_color').css('background-color', this.seatColor);
		$('#blockobj_seat_color').ColorPickerSetColor(this.seatColor);

		$('#blockobj_row_char').val(this.rowStart);

		g_blockImage.setValues();

		if(this.showlines)
			$('#blockobj_bgImage').hide();
		else
			$('#blockobj_bgImage').show();
	},

	hideProperty: function(sflag) {
		if(typeof(sflag)==='undefined') {
			$('#blockobj_normal').hide();
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
		// this.blockshape.visible = false;
		this.removeSeatLines();
		canvas.renderAll();

		//dealloc this class
		gselectedObj = null;
		gselectedresizepoint = null;

		return this.seatTotal;
	},

	reloadObject: function(isCalcOffset) {
		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		for(var i = 0; i < this.blockshape.points.length; i++)
		{
			tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleY)});
		}
		canvas.remove(this.blockshape);
		this.blockshape = null;
		this.createObjs(tmppoints, isCalcOffset);
	},

	changedParameters: function(bflagpasted) {
		if(typeof(bflagpasted) === 'undefined' || !bflagpasted) {
			bflagpasted = false;
			this.property.title = $('#blockobj_title').val();
			if(parseFloat($('#blockobj_lineSpace').val()) > 0) this.lineSpace = parseFloat($('#blockobj_lineSpace').val());
			if(parseFloat($('#blockobj_seatspace').val()) > 0) this.seatspace = parseFloat($('#blockobj_seatspace').val());
			this.showchair = $('#blockobj_showchair').is(':checked') ? true : false;
			this.showlines = $('#blockobj_showlines').is(':checked') ? true : false;
			this.showLabel = $('#blockobj_showlabel').is(':checked') ? true : false;
			this.showLabel3D = $('#blockobj_showlabel_3d').is(':checked') ? true : false;
			this.changeShowLine(this.showlines);
		}

		this.drawSeatLines(!bflagpasted);
		$('#blockobj_seatcount').val(this.seatTotal);
		if(this.callbackModified)
			this.callbackModified.call(this, this);
		g_historyMan.addState('change', this);
		canvas.renderAll();
	},
	changeOption: function(chairSpace, lineSpace)
	{
		this.lineSpace = lineSpace;
		this.seatspace = chairSpace;
		if(this.showlines)
			this.drawSeatLines(true);
	},
	changeShowLine: function(isShow)
	{
		if(isShow)
		{
			this.blockshape.set('fill', this.backColor);
			$('#blockobj_bgImage').hide();
		}
		else
		{
			this.drawBgImage();
			$('#blockobj_bgImage').show();
		}
	},
	changedBackgroundColor: function(val) {
		this.backColor = val;
		this.blockshape.set({ fill:this.backColor });
		canvas.renderAll();
		if(this.callbackModified)
			this.callbackModified.call(this, this, {backColor: val});
	},
	changedLineNumberType: function()
	{
		if(this.fabricLineNumbers.length == 0)
			return;

		var prev_cnt = 0;
		var num = parseInt(this.rowStart);
		var isNumber = true;
		if(isNaN(num))
		{
			isNumber = false;
		}
		for(var i = 0; i < this.drawData.lines.length; i++)
		{
			var lineIndex = this.drawData.lines[i].lineIndex + 1;
			var textString = sh_2dman.getNumberText(lineIndex, this.rowStart);

			var isShow = true;
			if(i > 0)
			{
				var prevNumber = this.fabricLineNumbers[prev_cnt];
				var dist = getSDistancePointsXY(this.fabricLineNumbers[i].left, this.fabricLineNumbers[i].top, prevNumber.left, prevNumber.top);
				var distX = getSDistancePointsXY(this.fabricLineNumbers[i].left, 0, prevNumber.left, 0);
				var distY = getSDistancePointsXY(0, this.fabricLineNumbers[i].top, 0, prevNumber.top);

				if(distY < 8 * 8)
				{
					if(isNumber)
					{
						if(i < 9 && distX < 8 * 8)
							isShow = false;
						else if(i >= 9 && distX < 16 * 16)
							isShow = false;
						else if(i >= 99 && distX < 24 * 24)
							isShow = false;
					}
					else
					{
						if(i < 25 && distX < 8 * 8)
							isShow = false;
						else if(i >= 25 && distX < 16 * 16)
							isShow = false;
						else if(i >= 675 && distX < 24 * 24)
							isShow = false;
					}
				}
				
				if(isShow)
				{
					prev_cnt = i;
				}
			}
			this.fabricLineNumbers[i].visible = isShow && this.property.isVisible2D;
			this.fabricLineNumbers[i].text = textString;
		}
		canvas.renderAll();
	},

	editObj : function() {
	},
	changedTitle : function() {
	},

	setPositionPropertyFrame : function(property) {
		property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 30- property.width());
		property.css('top', $('#menu-area').height());
	},

	flipHoriz : function()
	{
		this.blockshape._calcDimensions();
		var tmpZoom = canvas.getZoom();
		var tmppoints = [];
		var tmpavgx = 0, tmpavgy = 0;
		for(i = 0; i < this.blockshape.points.length; i++)
		{
			tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
			tmpavgx += tmppoints[i].x;
			tmpavgy += tmppoints[i].y;
		}
		tmpavgx /= this.blockshape.points.length;
		tmpavgy /= this.blockshape.points.length;

		for(i = 0; i < tmppoints.length; i++)
			tmppoints[i].x = 2 * tmpavgx - tmppoints[i].x;

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
		for(i=0; i < this.blockshape.points.length; i++) {
			tmppoints.push({x:this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
			tmpavgx += tmppoints[i].x;
			tmpavgy += tmppoints[i].y;
		}
		tmpavgx /= this.blockshape.points.length;
		tmpavgy /= this.blockshape.points.length;

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

	doNotShowSeats : function() {
		if(this.fabricLineNumbers != null)
		{
			for(var i = 0; i < this.fabricLineNumbers.length; i++)
				canvas.remove(this.fabricLineNumbers[i]);
		}
		this.fabricLineNumbers = [];
	},

	calcSeatLines: function(tempPoints)
	{
		this.drawData = {
			points: tempPoints,
			lines: [],
			seats: [],
		};

		// var tempPoints = this.points;

		var axisindex_end = this.axisindex + 1;
		if(this.axisindex == tempPoints.length - 1)
			axisindex_end = 0;
		var distance = this.lineSpace;
		var sss = 1;
		var isFoundTargetPoints = false;
		var cntlines = 0;
		var targetPoints = [];

		var maxDistance = 0, maxDistance1 = 0, maxDistance2 = 0;
		var farIndex1 = this.axisindex, farIndex2 = this.axisindex, farIndex = 0;
		for(var i = 0; i < tempPoints.length; i++)
		{
			if(i == this.axisindex || i == axisindex_end)
				continue;
			var tmpd = getDistancePoint2Line(tempPoints[i], tempPoints[this.axisindex], tempPoints[axisindex_end]);
			var abstmpd = Math.abs(tmpd);
			if(tmpd > 0)
			{
				if(abstmpd > maxDistance1)
				{
					maxDistance1 = abstmpd;
					farIndex1 = i;
				}
			}
			else
			{
				if(abstmpd > maxDistance2)
				{
					maxDistance2 = abstmpd;
					farIndex2 = i;
				}
			}
		}
		if(maxDistance1 > maxDistance2)
			farIndex = farIndex2;
		else
			farIndex = farIndex1;
		maxDistance = maxDistance1 + maxDistance2;

		var lineIndex = 0;

		this.block_aspect = true;

		var farPoint1 = tempPoints[farIndex];
		var farPoint2 = {
			x: farPoint1.x - (tempPoints[axisindex_end].x - tempPoints[this.axisindex].x),
			y: farPoint1.y - (tempPoints[axisindex_end].y - tempPoints[this.axisindex].y),
		}
		var sss = 1;
		for(;;) {
			var fparline = getParallelLineFromDistance(farPoint1, farPoint2, distance, sss);
			targetPoints = null;
			targetPoints = [];
			for(var i = 0; i < tempPoints.length; i++) {
				if(i != this.axisindex) {
					var tendpointindex = i+1;
					if(i >= tempPoints.length - 1) tendpointindex = 0;
					var flineA = getFormulaLineFromTwoPoints(tempPoints[i], tempPoints[tendpointindex]);
					var targetPt = getIntersectionFromTwoLines(fparline, flineA);
					if(targetPt && isPointInLine(targetPt, tempPoints[i], tempPoints[tendpointindex]))
					{
						targetPoints.push({
							x: targetPt.x,
							y: targetPt.y,
							edge_index: i,
						});
					}
				}
			}

			if(targetPoints.length >= 2) {
				isFoundTargetPoints = true;
				for(var i = 0 ; i < targetPoints.length; i++) {
					for(var j = i + 1; j < targetPoints.length; j++) {
						if(targetPoints[i].x > targetPoints[j].x) {
							var tmpx, tmpy;
							tmpx = targetPoints[j].x;
							tmpy = targetPoints[j].y;
							targetPoints[j].x = targetPoints[i].x;
							targetPoints[j].y = targetPoints[i].y;
							targetPoints[i].x = tmpx;
							targetPoints[i].y = tmpy;
						}
					}
				}

				//console.log(targetPoints);
				for(i = 0; i < targetPoints.length; i+=2)
				{
					if(i+1 < targetPoints.length)
					{
						this.makeSeats(targetPoints[i], targetPoints[i+1], lineIndex);
						this.block_aspect = false;
					}
				}
				lineIndex++;
			}
			else {
				break;
			}

			distance += this.lineSpace;
			if(maxDistance <= distance + defaultSeatRadius) break;
		}
		cntlines = lineIndex;

		/*if(!isFoundTargetPoints)*/  {
			sss = -1;
			var distance = 0;//this.lineSpace;
			for(;;) {
				var fparline = getParallelLineFromDistance(farPoint1, farPoint2, distance, sss);
				targetPoints = null;
				targetPoints = [];
				for(var i = 0; i < tempPoints.length; i++) {
					if(i != this.axisindex) {
						var tendpointindex = i+1;
						if(i == tempPoints.length - 1) tendpointindex = 0;
						var flineA = getFormulaLineFromTwoPoints(tempPoints[i], tempPoints[tendpointindex]);
						var targetPt = getIntersectionFromTwoLines(fparline, flineA);
						if(targetPt != null && isPointInLine(targetPt, tempPoints[i], tempPoints[tendpointindex]))
						{
							targetPoints.push({
								x: targetPt.x,
								y: targetPt.y,
								edge_index: i,
							});
						}
					}
				}

				if(targetPoints.length >= 2)
				{
					if(distance == 0 && targetPoints.length < 3)
					{
						distance += this.lineSpace;
						continue;
					}

					isFoundTargetPoints = true;
					for(var i = 0 ; i < targetPoints.length; i++) {
						for(var j = i + 1; j < targetPoints.length; j++) {
							if(targetPoints[i].x > targetPoints[j].x) {
								var tmpx, tmpy;
								tmpx = targetPoints[j].x;
								tmpy = targetPoints[j].y;
								targetPoints[j].x = targetPoints[i].x;
								targetPoints[j].y = targetPoints[i].y;
								targetPoints[i].x = tmpx;
								targetPoints[i].y = tmpy;
							}
						}
					}
					
					for(i = 0; i < targetPoints.length - 1; i++) {
						if(Math.abs(targetPoints[i].x - targetPoints[i+1].x) < 0.1 && 
							Math.abs(targetPoints[i].y - targetPoints[i+1].y) < 0.1) {
							targetPoints.splice(i, 1);
						}
					}

					if(distance == 0 && targetPoints.length == 3) {
						if(Math.abs(tempPoints[this.axisindex].x - targetPoints[0].x) < 0.1 && 
							Math.abs(tempPoints[this.axisindex].y - targetPoints[0].y) < 0.1) {
							targetPoints.splice(0, 1);
						}
						else if(Math.abs(tempPoints[axisindex_end].x - targetPoints[0].x) < 0.1 && 
							Math.abs(tempPoints[axisindex_end].y - targetPoints[0].y) < 0.1) {
							targetPoints.splice(0, 1);
						}
						else if(Math.abs(tempPoints[this.axisindex].x - targetPoints[2].x) < 0.1 && 
							Math.abs(tempPoints[this.axisindex].y - targetPoints[2].y) < 0.1) {
							targetPoints.splice(2, 1);
						}
						else if(Math.abs(tempPoints[axisindex_end].x - targetPoints[2].x) < 0.1 && 
							Math.abs(tempPoints[axisindex_end].y - targetPoints[2].y) < 0.1) {
							targetPoints.splice(2, 1);
						}
					}

					for(i = 0; i < targetPoints.length; i+=2)
					{
						if(i+1 < targetPoints.length)
							this.makeSeats(targetPoints[i], targetPoints[i+1], lineIndex);
					}
					lineIndex++;
				}
				else {
					break;
				}

				distance += this.lineSpace;
				if(maxDistance <= distance + defaultSeatRadius) break;
			}
		}

		var index = this.axisindex;
		x1 = tempPoints[this.axisindex].x;
		y1 = tempPoints[this.axisindex].y;
		if(index >= tempPoints.length - 1)
			index = -1;
		x2 = tempPoints[axisindex_end].x;
		y2 = tempPoints[axisindex_end].y;
		var a2 = Math.atan2(y2 - y1, x2 - x1);
		var aspect = 0;
		if(this.block_aspect)
		{
			aspect = a2;
			this.targetalpha = Math.PI - a2;
		}
		else
		{
			aspect = a2 - Math.PI;
			this.targetalpha = -a2;
		}
		
	},

	makeSeats : function(pt1, pt2, lineIndex)
	{
		this.drawData.lines.push({
			pt1: pt1,
			pt2: pt2,
			edge_index1: pt1.edge_index,
			edge_index2: pt2.edge_index,
			lineIndex: lineIndex,
		});

		var d = getDistanceFromTwoPoints(pt1, pt2);
		var space = this.seatspace;
		var remain_space = d % this.seatspace;
		var seatNum = d / this.seatspace;
		var rspace = remain_space / seatNum;
		for(;;) {
			var xd = (space / d) * (pt2.x - pt1.x) + pt1.x;
			var yd = (space / d) * (pt2.y - pt1.y) + pt1.y;
			
			if(!this.isStair)
			{
				this.drawData.seats.push({
					left:			xd,
					top:			yd,
					targetalpha:	this.targetalpha,
					lineIndex:		lineIndex,
				})
			}

			this.seatTotal++;

			space += (this.seatspace + rspace);
			if(d <= space + defaultSeatRadius) break;
		}
	},

	drawSeatLines : function(bshowseats, group_offsetX, group_offsetY, scaleX, scaleY)
	{
		if(IsPreview3DVersion())
		{
			this.calcSeatLines(this.points);
			return;
		}

		if(!this.showlines)
			this.drawBgImage();
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;

		this.seatTotal = 0;

		if(group_offsetX == null)
			group_offsetX = 0;
		if(group_offsetY == null)
			group_offsetY = 0;

		if(scaleX == null)
			scaleX = 1;
		if(scaleY == null)
			scaleY = 1;

		var tempPoints = [];
		for(var i = 0; i < this.blockshape.points.length; i++) {
			tempPoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[i].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[i].y * this.blockshape.scaleY * scaleY + group_offsetY});
		}

		this.calcSeatLines(tempPoints);
		
		if(this.fabriclines != null) {
			for(var i = 0; i < this.fabriclines.length; i++)
				canvas.remove(this.fabriclines[i]);
		}
		this.fabriclines = [];
		if(this.fabricLineNumbers != null)
		{
			for(var i = 0; i < this.fabricLineNumbers.length; i++)
				canvas.remove(this.fabricLineNumbers[i]);
		}
		this.fabricLineNumbers = [];

		canvas.remove(this.fabric_pattern);
		this.fabric_pattern = null;

		//--- Title Object ---------
		if(this.titleshape != null) {
			canvas.remove(this.titleshape);
			this.titleshape = null;
		}

		if(this.showLabel) {
			var x = this.blockshape.left + this.blockshape.width / 2 * this.blockshape.scaleX, y = this.blockshape.top + this.blockshape.height / 2 * this.blockshape.scaleY;
			this.titleshape = new fabric.Text(this.property.title, {
				left:x, 
				top:y, 
				fontFamily:'Arial', 
				fontSize:20, 
				fontWeight:600,
				fill:'#000', 
				textAlign:'center', 
				originX: 'center', 
				originY: 'center',
				hasControls: false,
				selectable: false,
				evented: false,
				visible: this.property.isVisible2D,
			});
			canvas.add(this.titleshape);
		}

		if(!this.showlines) {
			canvas.renderAll();
			return;
		}

		for(var i = 0; i < this.drawData.lines.length; i++)
		{
			this.drawLineAndSeat(this.drawData.lines[i].pt1, this.drawData.lines[i].pt2, this.drawData.lines[i].lineIndex);
		}

		if(this.fabricLineNumbers && this.drawData.lines.length > 0 && !this.isStair && this.showchair)
		{
			// for(var i = 0; i < this.fabriclines.length; i++)
			// {
			//     this.fabriclines[i].lineIndex = lineIndex - this.fabriclines[i].lineIndex - 1;
			// }
			// var type = $('#blockobj_linenumbertype').val();
			this.changedLineNumberType();
		}


		if(this.fabric_pattern)
		{
			canvas.remove(this.fabric_pattern);
			this.fabric_pattern = null;
		}

		var aspect = 0;
		if(this.block_aspect)
		{
			aspect = Math.PI - this.targetalpha;
		}
		else
		{
			aspect = -this.targetalpha - Math.PI;
		}

		if(!this.isStair && this.property.isVisible2D && this.showchair)
			this.fabric_pattern = drawPattern(this.blockshape.left, this.blockshape.top, tempPoints, 10, aspect, this.seatspace, this.lineSpace);
	},

	drawLineAndSeat : function(pt1, pt2, lineIndex, vector_aspect) {
		this.fabriclines.push(
			new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
					stroke: defaultLineColor,
					originX: 'center', 
					originY: 'center',
					selectable: false,
					evented: false,
					edge_index1: pt1.edge_index,
					edge_index2: pt2.edge_index,
					lineIndex: lineIndex,
					visible: this.property.isVisible2D,
				})
			);
		canvas.add(this.fabriclines[this.fabriclines.length - 1]);

		var d = getDistanceFromTwoPoints(pt1, pt2);
		var space = this.seatspace;

		if(!this.isStair && this.showchair)
		{
			var px = pt1.x - (space / d) * (pt2.x - pt1.x);
			var py = pt1.y - (space / d) * (pt2.y - pt1.y);
			var index = this.fabricLineNumbers.length + 1;
			this.fabricLineNumbers.push(
				new fabric.Text(index.toString(),
					{
						left: px,
						top: py,
						fontFamily:'Arial', 
						fontSize:10, 
						fontWeight:600,
						fill:'#000', 
						textAlign:'center', 
						originX: 'center', 
						originY: 'center',
						hasControls: false,
						selectable: false,
						evented: false,
						visible: this.property.isVisible2D,
					})
				);
			canvas.add(this.fabricLineNumbers[this.fabricLineNumbers.length - 1]);
		}
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
		return this.drawData.points;
	},

	getPointsFromArena : function()
	{
		var tmpZoom = canvas.getZoom();
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

		//for normal
		// this.obj3DBaseHeight = $('#blockobj_3dheight');
		// this.obj3DLayerHeight = $('#blockobj_layer_height');

		this.index = json.property.index;

		if(json.property.viewscore)
			this.viewscore = json.property.viewscore;
		else
			this.viewscore = 0;

		if(json.property.lineSpace)
			this.lineSpace = json.property.lineSpace;
		else
			this.lineSpace = 10;
		if(json.property.seatspace)
			this.seatspace = json.property.seatspace;
		else
			this.seatspace = 10;
		if(json.property.axisindex)
			this.axisindex = json.property.axisindex;
		else
			this.axisindex = 0;
		if(json.property.baseheight)
			this.baseheight = json.property.baseheight;
		else
			this.baseheight = 0;
		if(typeof(json.property.layerheight) != 'undefined')
			this.layerheight = json.property.layerheight;
		else
			this.layerheight = 4;

		if(typeof(json.property.showchair) == 'undefined')
			this.showchair = true;
		else
			this.showchair = json.property.showchair;
		if(json.property.showlines == null)
			this.showlines = true;
		else
			this.showlines = json.property.showlines;

		if(typeof(json.property.showLabel) == 'undefined')
			this.showLabel = true;
		else
			this.showLabel = json.property.showLabel;
		if(typeof(json.property.showLabel3D) == 'undefined')
			this.showLabel3D = false;
		else
			this.showLabel3D = json.property.showLabel3D;

		this.uniqueid = json.property.uniqueid;

		if(typeof(json.property.backColor) != 'undefined')
			this.backColor = json.property.backColor;

		if(json.property.axisindex)
			this.axisindex = json.property.axisindex;

		if(json.property.wall_front)
			this.wall_front = json.property.wall_front;
		if(json.property.wall_back)
			this.wall_back = json.property.wall_back;
		if(json.property.wall_left)
			this.wall_left = json.property.wall_left;
		if(json.property.wall_right)
			this.wall_right = json.property.wall_right;
		if(json.property.seatColor)
			this.seatColor = json.property.seatColor;

		if(typeof(json.property.raiseHeight) != 'undefined')
			this.raiseHeight = json.property.raiseHeight;
		else
			this.raiseHeight = 0;
		if(typeof(json.property.upstair) != 'undefined')
			this.upstair = json.property.upstair;
		else
			this.upstair = 0;

		if(json.property.handrail_img)
		{
			this.handrail_img = json.property.handrail_img;
		}
		if(typeof(json.property.handrail_height) != 'undefined')
		{
			this.handrail_height = json.property.handrail_height;
		}
		else
		{
			this.handrail_height = this.layerheight * 1.5;
		}

		if(json.property.bgImagePath)
		{
			this.property = json.property.bgImagePath;
			this.setImageBackground(json.property.bgImagePath);
		}

		if(json.property.selectable)
			this.selectable = json.property.selectable;
		else
			this.selectable = false;

		if(json.property.isStair)
			this.isStair = json.property.selectable;
		else
			this.isStair = false;

		if(typeof(json.property.rowStart) != 'undefined')
			this.rowStart = json.property.rowStart;
		else
			this.rowstart = 1;

		if(json.property.property)
			this.property = json.property.property;
		else
			this.property = new CProperty();

		// this.property.title = json.property.title;
		this.property.tags = json.property.tags;

		if(json.property.imgProp)
			this.imgProp = json.property.imgProp;
		else
			this.imgProp = new CImageProperty();
	},

	resetObject : function(state)
	{
		this.property.title = state.title;
		this.tags = state.tags;
		this.viewscore = state.viewscore;
		this.lineSpace = state.lineSpace;
		this.seatspace = state.seatspace;
		this.axisindex = state.axisindex;
		this.showchair = state.showchair;
		this.showlines = state.showlines;
		this.showLabel = state.showLabel;
		this.showLabel3D = state.showLabel3D;
		this.baseheight = state.baseheight;
		this.layerheight = state.layerheight;
		// this.targetalpha = state.targetalpha;
		this.rowStart = state.rowStart;
		this.backColor = state.backColor;
		this.wall_front = state.wall_front;
		this.wall_back = state.wall_back;
		this.wall_left = state.wall_left;
		this.wall_right = state.wall_right;
		this.seatColor = state.seatColor;
		this.raiseHeight = state.raiseHeight;
		this.upstair = state.upstair;
		this.isStair = state.isStair;
		this.block_aspect = state.block_aspect;
		this.imgProp = state.imgProp;
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
			// title: this.property.title,
			tags: this.tags,
			viewscore: this.viewscore,
			lineSpace: this.lineSpace,
			seatspace: this.seatspace,
			axisindex: this.axisindex,
			showchair: this.showchair,
			showlines: this.showlines,
			showLabel: this.showLabel,
			showLabel3D: this.showLabel3D,
			baseheight: this.baseheight,
			layerheight: this.layerheight,
			layerheight: this.layerheight,
			rowStart: this.rowStart,
			backColor: this.backColor,
			wall_front: this.wall_front,
			wall_back: this.wall_back,
			wall_left: this.wall_left,
			wall_right: this.wall_right,
			seatColor: this.seatColor,
			raiseHeight: this.raiseHeight,
			upstair: this.upstair,
			isStair: this.isStair,
			block_aspect: this.block_aspect,
			imgProp: this.imgProp,
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
		if(isVisible)
		{
			this.drawSeatLines();
		}
		else
		{
			this.removeSeatLines();
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
		for(var i = 0; i < this.points.length; i++)
		{
			var point = {
				x: this.points[i].x * tmpZoom + garena.imgObj.originalLeft * tmpZoom,
				y: this.points[i].y * tmpZoom + garena.imgObj.originalTop * tmpZoom,
			}
			newPoints.push(point);
		}
		this.createObjs(newPoints);
		// this.drawSeatLines(false);
		newPoints = [];
		g_historyMan.addState('add', this);
		this.blockshape.visible = this.property.isVisible2D;
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
		var self = this;
		fabric.Image.fromURL(imagePath, function(img)
		{
			self.bgImagePath = imagePath.slice();
			// img.setAngle(90);
			self.bgImage = img;
			self.drawBgImage();
			canvas.renderAll();
            var progressModal = document.getElementById('progressModal');
            progressModal.style.display = "none";
			if(self.callbackModified)
				self.callbackModified.call(self, self);
		});
	},

	setImageFlpX: function()
	{
		this.imgProp.flipX = !this.imgProp.flipX;
		this.drawBgImage();
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	setImageFlpY: function()
	{
		this.imgProp.flipY = !this.imgProp.flipY;
		this.drawBgImage();
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	rotateBgImage: function()
	{
		this.angleCount++;
		this.angleCount = this.angleCount % 4;
		this.drawBgImage();
		if(this.callbackModified)
			this.callbackModified.call(this, this);
	},

	drawBgImage : function(color)
	{
		if(typeof(this.angleCount) == 'undefined')
			this.angleCount = 0;

		var angle = this.angleCount * 90;
		if(color)
		{
			this.blockshape.set('fill', color);
			return;
		}
		if(this.bgImage == null || this.blockshape == null)
			return null;

		// this.blockshape.left, this.blockshape.top, tmppoints
		// patternImage.scaleToWidth(width);
		var image = this.bgImage;
		var width = this.blockshape.width;
		var height = this.blockshape.height;

		var newWidth = width;
		var newHeight = height;
		var patternWidth = width;
		var patternHeight = height;
		var rate = width / height;

		var left = 0;
		var top = 0;
		if(angle == 90)
		{
			left = width;
			newWidth = height;
			newHeight = width;
			patternWidth = width * rate;
			patternHeight = height;
		}
		else if(angle == 180)
		{
			left = width;
			top = height;
			// patternWidth = width * rate;
			// patternHeight = height;
		}
		else if(angle == 270)
		{
			top = height;
			newWidth = height;
			newHeight = width;
			patternWidth = width * rate;
			patternHeight = height;
		}
		image.set({
			width: newWidth, 
			height: newHeight,
			// originX : 'left',
			// originY : 'top',
			left : left,
			top: top,
			angle: angle,
			flipX: this.imgProp.flipX,
			flipY: this.imgProp.flipY,
		});
		// if(this.blockshape.width > this.blockshape.height)
			// image.scaleToWidth(this.blockshape.height);
		// else
			// image.scaleToHeight(this.blockshape.height);

		var patternSourceCanvas = new fabric.StaticCanvas();
		patternSourceCanvas.add(image);

		var pattern = new fabric.Pattern(
		{
			source: function()
			{
				patternSourceCanvas.setDimensions(
				{
					width: patternWidth,
					height: patternHeight,
				});
				return patternSourceCanvas.getElement();
			},
			repeat: 'no-repeat',
		});

		// pattern.offsetX = 300;
		// pattern.offsetY = 100;
		this.blockshape.set('fill', pattern);

		// this.blockshape.setAngle(90);
		// this.blockshape.setWidth(200);
		// this.blockshape.setHeight(300);
	},

	setSelectable: function(isSelectable)
	{
		this.selectable = isSelectable;
		this.blockshape.selectable = isSelectable;
	}
});


