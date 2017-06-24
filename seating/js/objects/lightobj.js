LightObj = function(index, points, cloneObj, bflagShowLines)
{
	if(points == null)
		return;
	this.type = 'LightObj';
	this.callbackModified = null;
	this.backColor = '#ffffff';
	this.property = new CProperty();
	this.imgProp = new CImageProperty();
	this.lightProperty = new CLightProperty();

	//Create new
	if(typeof(cloneObj)==='undefined' || cloneObj == null)
		this.init(points, bflagShowLines);
	else
		this.fromGroupObj(cloneObj);
}

var defaultLightDistance = 5;
var defaultLightItensity = 2;
var defaultLightRange = 100;
var defaultBaseHeight = 300;

$.extend(LightObj.prototype, {
	// object variables
	class_name: 'LightObj',
	type: 'LightObj',
	blockshape : null,
	// title: '',

	status : 'normal', //'editing'
	uniqueid : 0,
	blockzoom : 5,

	fabricseats : null,

	rowsNum : 1,
	colsNum : 1,
	lightDistance: defaultLightDistance,
	intensity: defaultLightItensity,
	range: defaultLightRange,

	lightType: 'bulb',

	// lineSpace : defaultLight_lineSpace,
	// objectSpace : defaultLight_lineSpace,
	axisindex : 0,
	isShow : true,
	isShowBulb: true,
	isRealLight : false,
	isVertical: false,
	angle_vertical: 0,

	baseheight : defaultBaseHeight,
	thickness : 1,
	targetalpha: 0,
	backColor: '#ffffff',
	points: null,
	drawData: {},

	lightColor : defaultLightColor,

	fabric_pattern: null,
	bgImage: null,
	bgImagePath: null,

	lineNum: 0,

	block_aspect: false,
	selectable: true,
	
	imgProp: new CImageProperty(),
	property: new CProperty(),

	lightProperty: new CLightProperty(),

	init: function(points, bflagShowLines) {
		// this.objectSpace = defaultLight_lineSpace;
		// this.lineSpace = defaultLight_lineSpace;
		if(typeof(bflagShowLines)!=='undefined')
			this.isShow = bflagShowLines;
		
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
			lockMovementX : false,
			lockMovementY : false,
			uniqueid : this.uniqueid,
			blockzoom : this.blockzoom,
			objtype : 'LightObj',
			parentObj : this});

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
			canvas.renderAll();
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
		if(this.fabricseats != null)
		{
			for(var i = 0; i < this.fabricseats.length; i++)
				canvas.remove(this.fabricseats[i]);
		}
		this.fabricseats = [];

		canvas.remove(this.fabric_pattern);
		this.fabric_pattern = null;

	},

	shapeInitFunctions: function()
	{
		var self = this;
		var lastPointX;
		var lastPointY;

		this.blockshape.on('selected', function (e)
		{
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
			for(var i = 0; i < self.blockshape.points.length; i++)
			{
				gresizepoints[i] = new fabric.Circle( {radius:3 / tmpZoom,
											strokeWidth:0,
											stroke:'#ffff00',
											fill:gcolor_blockpoints,
											left:self.blockshape.left + self.blockshape.points[i].x * self.blockshape.scaleX,
											top:self.blockshape.top + self.blockshape.points[i].y * self.blockshape.scaleY,
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
					
					self.reloadObject();
					canvas.renderAll();
					self.hideProperty();
				});
				gresizepoints[i].on('modified', function()
				{
					self.blockshape.points[this.nindex].x = (this.left - self.blockshape.left) / self.blockshape.scaleX;
					self.blockshape.points[this.nindex].y = (this.top - self.blockshape.top) / self.blockshape.scaleY;

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

	bflagShowProperty : false,
	showProperty: function()
	{
		this.hideProperty('all');

		this.setPositionPropertyFrame($('#dlg_lightobj'));

		$('#dlg_lightobj').show();
		bflagShowProperty = true;

		$('#lightobj_title').val(this.property.title);
		$('#lightobj_linenumber').val(this.rowsNum);
		$('#lightobj_cols').val(this.colsNum);

		$('#lightobj_light_type').val(this.lightType);

		$('#lightobj_showlight').prop("checked", this.isShow);
		$('#lightobj_showlight_bulb').prop("checked", this.isShowBulb);
		$('#lightobj_reallight').prop("checked", this.isRealLight);
		$('#lightobj_baseheight').val(this.baseheight);
		$('#lightobj_thickness').val(this.thickness);
		$('#lightobj_distance').val(this.lightDistance);
		$('#lightobj_intensity').val(this.intensity);
		$('#lightobj_range').val(this.range);
		// $('#lightobj_backcolor').val(this.backColor);
		// $('#lightobj_light_color').val(this.lightColor);
		$('#lightobj_backcolor').css('background-color', this.backColor);
		$('#lightobj_backcolor').ColorPickerSetColor(this.backColor);
		$('#lightobj_light_color').css('background-color', this.lightColor);
		$('#lightobj_light_color').ColorPickerSetColor(this.lightColor);

		$('#dlg_lightobj .check_object_selectable').prop("checked", this.selectable);

		$('#lightobj_vertical').prop("checked", this.isVertical);
		if(gselectedObj.isVertical)
			$('#lightobj_vertical_angle').show();
		$('#slider_lightobj_vert_angle').slider('value', this.angle_vertical);
		$('#text_lightobj_vert_angle').val(this.angle_vertical);

		g_lightImage.setValues();
		this.changedLightType();
	},

	changedLightType() {
		if(this.lightType == 'bulb') {
			$('#lightobj_setting_bulb').show();
			$('#lightobj_setting_spot').hide();
		}
		else {
			$('#lightobj_setting_bulb').hide();
			$('#lightobj_setting_spot').show();
			$('#lightobj_showlight_volumetric').prop('checked', this.lightProperty.isHideVolumetric);
			$('#lightobj_showlight_block').prop('checked', this.lightProperty.isHideLightBlock);
			$('#lightobj_target_x').val(this.lightProperty.targetPos.x);
			$('#lightobj_target_y').val(this.lightProperty.targetPos.y);
			$('#lightobj_target_radius').val(this.lightProperty.targetRadius);
			$('#lightobj_attenuation').val(this.lightProperty.attenuation);
			$('#lightobj_anglePower').val(this.lightProperty.anglePower);
		}		
	},

	hideProperty: function(sflag) {
		if(typeof(sflag)==='undefined') {
			$('#dlg_lightobj').hide();
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
		clearResizePoints();

		canvas.remove(this.blockshape);

		this.removeSeatLines();

		canvas.renderAll();

		//dealloc this class
		gselectedObj = null;
		gselectedresizepoint = null;
	},

	reloadObject: function() {
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
		this.createObjs(tmppoints, false);
	},

	changedParameters: function(bflagpasted) {
		if(typeof(bflagpasted) === 'undefined' || !bflagpasted) {
			bflagpasted = false;
			this.property.title = $('#lightobj_title').val();
			if(parseInt($('#lightobj_linenumber').val()) > 0) this.rowsNum = parseInt($('#lightobj_linenumber').val());
			if(parseInt($('#lightobj_cols').val()) > 0) this.colsNum = parseInt($('#lightobj_cols').val());
			// if(parseInt($('#lightobj_distance').val()) > 0) this.lightDistance = parseInt($('#lightobj_distance').val());
			// if(parseInt($('#lightobj_intensity').val()) > 0) this.intensity = parseFloat($('#lightobj_intensity').val());
			// if(parseInt($('#lightobj_range').val()) > 0) this.range = parseInt($('#lightobj_range').val());
			this.isShow = $('#lightobj_showlight').is(':checked') ? true : false;
			this.isShowBulb = $('#lightobj_showlight_bulb').is(':checked') ? true : false;
			this.isRealLight = $('#lightobj_reallight').is(':checked') ? true : false;
			this.isVertical = $('#lightobj_vertical').is(':checked') ? true : false;
			this.changeShowLine(this.isShow);
		}

		this.drawSeatLines(!bflagpasted);

		canvas.renderAll();
		if(this.callbackModified)
			this.callbackModified.call(this, this);
		g_historyMan.addState('change', this);
	},
	changeShowLine: function(isShow)
	{
		// if(isShow)
		// {
		// 	this.blockshape.set('fill', this.backColor);
		// }
		// else
		// {
		// 	this.drawBgImage();
		// }
	},
	changedBackgroundColor: function(val) {
		// this.backColor = $('#lightobj_backcolor').val();
		this.backColor = val;
		this.blockshape.set({ fill:this.backColor });
		canvas.renderAll();
	},

	editObj : function() {
	},
	changedTitle : function() {
	},

	setPositionPropertyFrame : function(property) {
		property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width());
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

		// if(this.fabricseats != null) {
		// 	for(var i = 0; i < this.fabricseats.length; i++)
		// 		canvas.remove(this.fabricseats[i]);
		// }
		// this.fabricseats = [];

		// canvas.remove(this.fabric_pattern);
		// this.fabric_pattern = null;
	},
	
	calcSeatLines: function(tempPoints)
	{
		this.drawData = {
			points: tempPoints,
			lines: [],
			seats: [],
		};

		var axisindex_end = this.axisindex + 1;
		if(this.axisindex == tempPoints.length - 1)
			axisindex_end = 0;
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

		var lineSpace = maxDistance / this.rowsNum;
		var distance = lineSpace * 0.5;
		var lineIndex = 0;

		this.block_aspect = true;

		var farPoint1 = tempPoints[farIndex];
		var farPoint2 = {
			x: farPoint1.x - (tempPoints[axisindex_end].x - tempPoints[this.axisindex].x),
			y: farPoint1.y - (tempPoints[axisindex_end].y - tempPoints[this.axisindex].y),
		}
		for(;;)
		{
			var fparline = getParallelLineFromDistance(farPoint1, farPoint2, distance, sss);
			targetPoints = null;
			targetPoints = [];
			for(var i = 0; i < tempPoints.length; i++)
			{
				if(i != this.axisindex) {
					var tendpointindex = i + 1;
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
						// this.drawLineAndSeat(targetPoints[i], targetPoints[i+1], bshowseats, lineIndex, sss);
						this.block_aspect = false;
					}
				}
				lineIndex++;
			}
			else {
				break;
			}

			distance += lineSpace;
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
						distance += lineSpace;
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
							// this.drawLineAndSeat(targetPoints[i], targetPoints[i+1], bshowseats, lineIndex, sss);
					}
					lineIndex++;
				}
				else {
					break;
				}

				distance += lineSpace;
				if(maxDistance <= distance + defaultSeatRadius) break;
			}
		}


		if(this.fabric_pattern)
		{
			canvas.remove(this.fabric_pattern);
			this.fabric_pattern = null;
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
		var objSpace = d / this.colsNum;
		var space = objSpace * 0.5;

		var remain_space = d % objSpace;
		var seatNum = d / objSpace;
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

			space += (objSpace + rspace);
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

		// if(!this.isShow)
			this.drawBgImage();
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;

		if(group_offsetX == null)
			group_offsetX = 0;
		if(group_offsetY == null)
			group_offsetY = 0;

		if(scaleX == null)
			scaleX = 1;
		if(scaleY == null)
			scaleY = 1;

		var tempPoints = [];
		for(var i = 0; i < this.blockshape.points.length; i++)
		{
			tempPoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[i].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[i].y * this.blockshape.scaleY * scaleY + group_offsetY});
		}
		this.calcSeatLines(tempPoints);
		

		if(this.fabriclines != null)
		{
			for(var i = 0; i < this.fabriclines.length; i++)
				canvas.remove(this.fabriclines[i]);
		}
		this.fabriclines = [];

		if(this.fabricseats != null)
		{
			for(var i = 0; i < this.fabricseats.length; i++)
				canvas.remove(this.fabricseats[i]);
		}
		this.fabricseats = [];

		for(var i = 0; i < this.drawData.lines.length; i++)
		{
			this.drawLineAndSeat(this.drawData.lines[i].pt1, this.drawData.lines[i].pt2, bshowseats, this.drawData.lines[i].lineIndex);
		}
		
		canvas.remove(this.fabric_pattern);
		this.fabric_pattern = null;

		// if(!this.isStair)
		// 	this.fabric_pattern = drawPattern(this.blockshape.left, this.blockshape.top, tempPoints, 10, aspect, objectSpace, lineSpace);
	},

	drawLineAndSeat : function(pt1, pt2, bshowseats, lineIndex, vector_aspect) {
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;

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
				})
			);
		canvas.add(this.fabriclines[this.fabriclines.length - 1]);

		var d = getDistanceFromTwoPoints(pt1, pt2);
		var objSpace = d / this.colsNum;
		var space = objSpace * 0.5;

		var remain_space = d % objSpace;
		var seatNum = d / objSpace;
		var rspace = remain_space / seatNum;
		for(;;) {
			var xd = (space / d) * (pt2.x - pt1.x) + pt1.x;
			var yd = (space / d) * (pt2.y - pt1.y) + pt1.y;
			
			if(!this.isStair)
			{
				var seat = {
					left:			xd,
					top:			yd,
					targetalpha:	this.targetalpha,
					lineIndex:		lineIndex,
				};
				var point = new fabric.Circle({radius:10 , 
							strokeWidth:1, 
							stroke:'#ee0000', 
							fill:this.lightColor, 
							left:xd, 
							top:yd, 
							hasControls:false, 
							originX:'center', 
							originY:'center',
							selectable: false,
							evented: false});
				point.visible = true;
				point.lineIndex = lineIndex;
				this.fabricseats.push(point);
				canvas.add(this.fabricseats[this.fabricseats.length - 1]);
			}

			space += (objSpace + rspace);
			if(d <= space + defaultSeatRadius) break;
		}
	},

	getAbsolutePoints : function()
	{
		if(this.blockshape && this.blockshape.width > 0)
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

		this.index = json.property.index;

		// if(json.property.title)
		// 	this.title = json.property.title;
		// else
		// 	this.title = '';

		if(json.property.rowsNum)
			this.rowsNum = json.property.rowsNum;
		else
			this.rowsNum = 1;
		if(json.property.colsNum)
			this.colsNum = json.property.colsNum;
		else
			this.colsNum = 1;
		if(json.property.axisindex)
			this.axisindex = json.property.axisindex;
		else
			this.axisindex = 0;
		if(typeof(json.property.baseheight) != 'undefined')
			this.baseheight = json.property.baseheight;
		else if(typeof(json.property.baseHeight) != 'undefined')
			this.baseheight = json.property.baseHeight;
		else
			this.baseheight = defaultBaseHeight;
		if(typeof(json.property.thickness) != 'undefined')
			this.thickness = json.property.thickness;
		else
			this.thickness = 4;
		if(typeof(json.property.lightDistance) != 'undefined')
			this.lightDistance = json.property.lightDistance;
		else
			this.lightDistance = defaultLightDistance;

		if(typeof(json.property.lightType) != 'undefined')
			this.lightType = json.property.lightType;
		else
			this.lightType = 'bulb';
		if(typeof(json.property.intensity) != 'undefined')
			this.intensity = json.property.intensity;
		else
			this.intensity = defaultLightItensity;
		if(typeof(json.property.range) != 'undefined')
			this.range = json.property.range;
		else
			this.range = defaultLightRange;


		if(json.property.isShow == null)
			this.isShow = true;
		else
			this.isShow = json.property.isShow;
		if(typeof(json.property.isShowBulb) =='undefined') {
			this.isShowBulb = true;
		}
		else {
			this.isShowBulb = json.property.isShowBulb;
		}
		if(json.property.isRealLight)
			this.isRealLight = true;
		else
			this.isRealLight = false;
		this.uniqueid = json.property.uniqueid;

		if(typeof(json.property.backColor) != 'undefined')
			this.backColor = json.property.backColor;

		if(json.property.axisindex)
			this.axisindex = json.property.axisindex;

		if(json.property.lightColor)
			this.lightColor = json.property.lightColor;

		if(json.property.bgImagePath)
		{
			this.property = json.property.bgImagePath;
			this.setImageBackground(json.property.bgImagePath);
		}

		if(json.property.selectable)
			this.selectable = json.property.selectable;
		else
			this.selectable = false;

		if(json.property.isVertical)
		{
			this.isVertical = json.property.isVertical;
			if(json.property.angle_vertical)
				this.angle_vertical = json.property.angle_vertical;
			else
				this.angle_vertical = 0;
		}
		else
		{
			this.isVertical = false;
			this.angle_vertical = 0;
		}
		
		// if(json.property.property)
		// 	this.property = json.property.property;
		// else
			this.property = new CProperty();

		if(json.property.imgProp)
			this.imgProp = json.property.imgProp;
		else
			this.imgProp = new CImageProperty();

		this.lightProperty = new CLightProperty();
		if(json.property.lightProperty)
			this.lightProperty.copy(json.property.lightProperty);
	},

	resetObject : function(state)
	{
		// this.property.title = state.title;
		this.axisindex = state.axisindex;
		this.baseheight = state.baseheight;
		this.thickness = state.thickness;
		this.backColor = state.backColor;
		this.block_aspect = state.block_aspect;
		this.imgProp = state.imgProp;
		this.property = state.property;

		this.rowsNum = state.rowsNum;
		this.colsNum = state.colsNum;
		this.lightDistance = state.lightDistance;
		this.intensity = state.intensity;
		this.range = state.range;
		this.lightColor = state.lightColor;

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
			axisindex: this.axisindex,
			baseheight: this.baseheight,
			thickness: this.thickness,
			backColor: this.backColor,
			block_aspect: this.block_aspect,
			imgProp: this.imgProp,
			property: this.property,

			rowsNum: this.rowsNum,
			colsNum: this.colsNum,
			lightDistance: this.lightDistance,
			intensity: this.intensity,
			range: this.range,
			lightColor: this.lightColor,
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
		this.drawSeatLines(false);
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
			self.bgImagePath = imagePath;
			self.bgImage = img;
			self.drawBgImage();
			canvas.renderAll();
            var progressModal = document.getElementById('progressModal');
            progressModal.style.display = "none";
			if(self.callbackModified)
				self.callbackModified.call(self, self);
		});
	},

	drawBgImage : function(color)
	{
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
		image.set({width: this.blockshape.width, height: this.blockshape.height});
		// if(this.blockshape.width > this.blockshape.height)
		// 	image.scaleToWidth(this.blockshape.width);
		// else
		// 	image.scaleToHeight(this.blockshape.height);

		var patternSourceCanvas = new fabric.StaticCanvas();
		patternSourceCanvas.add(image);

		var pattern = new fabric.Pattern(
		{
			source: function()
			{
				patternSourceCanvas.setDimensions(
				{
					width: image.getWidth(),
					height: image.getHeight()
				});
				return patternSourceCanvas.getElement();
			},
			repeat: 'no-repeat',
		});

		this.blockshape.set('fill', pattern);
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