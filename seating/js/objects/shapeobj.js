ShapeObj = function(index, points, cloneObj) {
	if(points == null)
		return;

	this.type = 'ShapeObj';
	this.index = index;
	this.property = new CProperty();
	this.callbackModified = null;

	//for normal
	// this.obj3DBaseHeight = $('#shapeobj_3dheight');
	// this.obj3DLayerHeight = $('#shapeobj_3dLayerheight');

	//Create new
	if(typeof(cloneObj)==='undefined')
		this.init(points);
	else {
		this.fromGroupObj(cloneObj);
	}
}

$.extend(ShapeObj.prototype, {
	// object variables
	class_name: 'ShapeObj',
	type: 'ShapeObj',

	index: -1,
	// title: '',
	seatTotal: 0,

	//shape: null,
	blockshape : null,
	//arrAllObjs : null,

	status : 'normal', //'editing'
	uniqueid : 0,
	blockzoom : 5,

	fabriclines : null,
	fabricseats : null,
	lineSpace : 10,
	rows : 6,
	seatspace : 10,
	direction : 1,

	splitespace : 0,
	showchair: true,
	showlines : true,

	baseheight : 0,
	layerheight : 4,
	backColor: '#ffffff',
	fabric_pattern: null,
	points: null,

	wall_front : false,
	wall_back : false,
	wall_left : false,
	wall_right : false,
	handrail_img : null,
	handrail_height: 6,
	seatColor : defaultSeatColor,
	raiseHeight: 0,
	upstair: 0,
	selectable: true,
	rowStart: 1,
	property: new CProperty(),

	init: function(points) {
		this.uniqueid = new Date().getTime();

		this.createObjs(points);
		//canvas.setActiveObject(this.shape);
		g_historyMan.addState('add', this);
	},

	clone: function(cloneObj) {
	},

	fromGroupObj: function(cloneobj) {
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

	createObjs: function(points, bcalcviewport) {
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
		for(var i = 0; i < realpoints.length; i++) {
			tmppoints[i] = {x:realpoints[i].x, y:realpoints[i].y};
			if(i == 0) {
				var results = calculateShapePoints(this.lineSpace * (this.rows+1) * tmpZoom, this.direction, realpoints[0], realpoints[1], realpoints[2]);
				tmppoints[realpoints.length * 2 - 1] = {x:results.pt1_t.x, y:results.pt1_t.y};
			}
			else if(i == realpoints.length - 1) {
				var results = calculateShapePoints(this.lineSpace * (this.rows+1) * tmpZoom, this.direction, realpoints[i-2], realpoints[i-1], realpoints[i]);
				tmppoints[i+1] = {x:results.pt3_t.x, y:results.pt3_t.y};
			}
			else {
				var results = calculateShapePoints(this.lineSpace * (this.rows+1) * tmpZoom, this.direction, realpoints[i-1], realpoints[i], realpoints[i+1]);
				tmppoints[2*realpoints.length - i - 1] = {x:results.pt2_t.x, y:results.pt2_t.y};
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
			objType:'ShapeObj',
			parentObj:this
		});

		canvas.add(this.blockshape);
		if(!this.selectable)
			canvas.moveTo(this.blockshape, 1);
		// canvas.renderAll();

		this.shapeInitFunctions();
	},

	createAllObjects : function(points) {
		
	},

	removeResizePoint: function() {
	},
	
	addResizePoint: function (pt) {
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
		for(i=0; i < this.blockshape.points.length / 2; i++) {
			tmppoints.push({
				x:selectionX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
				y:selectionY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)});
		}

		return tmppoints;
	},

	removeSeatLines: function() {
		if(this.fabriclines != null) {
			for(var i = 0; i < this.fabriclines.length; i++)
				canvas.remove(this.fabriclines[i]);
		}
		this.fabriclines = [];

		// if(this.fabricseats != null) {
		// 	for(var i = 0; i < this.fabricseats.length; i++)
		// 		canvas.remove(this.fabricseats[i]);
		// }
		this.fabricseats = [];

		if(this.fabric_pattern != null) {
			for(var i = 0; i < this.fabric_pattern.length; i++)
				canvas.remove(this.fabric_pattern[i]);
		}
		this.fabric_pattern = [];
	},

	shapeInitFunctions: function() {
		var self = this;
		var lastPointX;
		var lastPointY;

		this.blockshape.on('selected', function ()
		{
			lastPointX = self.blockshape.left;
			lastPointY = self.blockshape.top;
			gselectedresizepoint = null;
			if(gselectedObj != null) {
				gselectedObj.blockshape.stroke = gcolor_blockborder;
				gselectedObj.doNotShowSeats();
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
					self.removeSeatLines();
					
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
	showProperty: function() {
		this.hideProperty('all');

		this.setPositionPropertyFrame($('#shapeobj_normal'));

		$('#shapeobj_normal').show();
		bflagShowProperty = true;

		$('#shapeobj_title').val(this.property.title);
		$('#shapeobj_tags').val(this.property.tags);
		$('#shapeobj_seatcount').val(this.seatTotal);
		$('#shapeobj_lineSpace').val(this.lineSpace);
		$('#shapeobj_rows').val(this.rows);
		$('#shapeobj_row_char').val(this.rowStart);
		$('#shapeobj_seatspace').val(this.seatspace);
		$('#shapeobj_splitespace').val(this.splitespace);
		$('#shapeobj_showlines').prop("checked", this.showlines);

		$('#shapeobj_3dheight').val(this.baseheight);
		$('#shapeobj_3dLayerheight').val(this.layerheight);

		$('#shapeobj_color').css('background-color', this.backColor);
		$('#shapeobj_color').ColorPickerSetColor(this.backColor);

		$('#shapeobj_wall_front').prop('checked', this.wall_front);
		$('#shapeobj_wall_back').prop('checked', this.wall_back);
		$('#shapeobj_wall_left').prop('checked', this.wall_left);
		$('#shapeobj_wall_right').prop('checked', this.wall_right);
		$('#blockobj_normal .text_object_wall_height').val(this.handrail_height);
		// $('#shapeobj_seat_color').val(this.seatColor);
		$('#shapeobj_seat_color').css('background-color', this.seatColor);
		$('#shapeobj_seat_color').ColorPickerSetColor(this.seatColor);
		$('#shapeobj_raise').val(this.raiseHeight);
		$('#shapeobj_upstair').val(this.upstair);

		$('#shapeobj_normal .check_object_selectable').prop("checked", this.selectable);
	},

	hideProperty: function(sflag) {
		if(typeof(sflag)==='undefined') {
			$('#shapeobj_normal').hide();
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

		this.removeSeatLines();

		canvas.renderAll();

		//dealloc this class
		gselectedObj = null;
		gselectedresizepoint = null;

		return this.seatTotal;
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

	changedParameters: function(bflagpasted) {
		if(typeof(bflagpasted) === 'undefined' || !bflagpasted) {
			bflagpasted = false;
			if(parseFloat($('#shapeobj_lineSpace').val()) > 0) this.lineSpace = parseFloat($('#shapeobj_lineSpace').val());
			var rows = parseInt($('#shapeobj_rows').val());
			if(rows > 0)
			{
				if(rows > 50)
					rows = 50;
				this.rows = parseInt($('#shapeobj_rows').val());
			}
			if(parseFloat($('#shapeobj_seatspace').val()) > 0) this.seatspace = parseFloat($('#shapeobj_seatspace').val());
			this.showlines = $('#shapeobj_showlines').is(':checked') ? true : false;
			this.splitespace = parseFloat($('#shapeobj_splitespace').val());
		}

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
		this.drawSeatLines(!bflagpasted);
		canvas.renderAll();
		gselectedresizepoint = null;

		if(this.callbackModified)
			this.callbackModified.call(this, this);
		g_historyMan.addState('change', this);
	},
	changeOption: function(chairSpace, lineSpace)
	{
		this.lineSpace = lineSpace;
		this.seatspace = chairSpace;
		if(this.showlines)
			this.drawSeatLines(true);
	},
	changedBackgroundColor: function(val) {
		this.backColor = val;
		this.blockshape.set({ fill:this.backColor });
		canvas.renderAll();
		if(this.callbackModified)
			this.callbackModified.call(this, this, {backColor: val});
	},

	editObj : function() {
	},
	changedTitle : function() {
	},

	setPositionPropertyFrame : function(property) {
		property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40- property.width());
		property.css('top', $('#menu-area').height());
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

	doNotShowSeats : function() {
		// if(this.fabricseats != null) {
		// 	for(var i = 0; i < this.fabricseats.length; i++)
		// 		canvas.remove(this.fabricseats[i]);
		// }
		// this.fabricseats = [];

		// if(this.fabric_pattern != null) {
		// 	for(var i = 0; i < this.fabric_pattern.length; i++)
		// 		canvas.remove(this.fabric_pattern[i]);
		// }
		// this.fabric_pattern = [];
	},

	drawSeatLines : function(bshowseats, group_offsetX, group_offsetY, scaleX, scaleY) {
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;
		this.seatTotal = 0;

		this.removeSeatLines();
		this.fabriclines = [];
		this.fabricseats = [];
		this.fabric_pattern = [];

		if(!this.showlines) {
			canvas.renderAll();
			return;
		}

		if(group_offsetX == null)
			group_offsetX = 0;
		if(group_offsetY == null)
			group_offsetY = 0;

		if(scaleX == null)
			scaleX = 1;
		if(scaleY == null)
			scaleY = 1;

		var pointslen = this.blockshape.points.length;
		for(var i = 0; i < pointslen / 2 - 1; i++) {
			var tmppoints = [];
			tmppoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[i].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[i].y * this.blockshape.scaleY * scaleY + group_offsetY});
			tmppoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[i+1].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[i+1].y * this.blockshape.scaleY * scaleY + group_offsetY});
			tmppoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[pointslen - i - 2].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[pointslen - i - 2].y * this.blockshape.scaleY * scaleY + group_offsetY});
			tmppoints.push({x:this.blockshape.left * scaleX + this.blockshape.points[pointslen - i - 1].x * this.blockshape.scaleX * scaleX + group_offsetX, 
							y:this.blockshape.top * scaleY + this.blockshape.points[pointslen - i - 1].y * this.blockshape.scaleY * scaleY + group_offsetY});
			this.drawSeatLinesIndividual(0, tmppoints, bshowseats, i);
		}

	},

	drawLineAndSeat : function(pt1, pt2, bshowseats, blockIndex, lineIndex, targetalpha)
	{
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;

		this.fabriclines.push(
			new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
					stroke: defaultLineColor,
					originX: 'center', 
					originY: 'center',
					selectable: false,
					evented: false
				})
			);
		canvas.add(this.fabriclines[this.fabriclines.length - 1]);

		var d = getDistanceFromTwoPoints(pt1, pt2);
		var space = this.seatspace;

		// if(!bshowseats) return;
		for(;;) {
			var xd = (space / d) * (pt2.x - pt1.x) + pt1.x;
			var yd = (space / d) * (pt2.y - pt1.y) + pt1.y;
			
			var point = {
				left:		xd,
				top:		yd,
				lineIndex:	lineIndex,
				angle:		Math.PI - targetalpha,
			};
			this.fabricseats.push(point);
			this.seatTotal++;

			space += this.seatspace;
			if(d <= space + defaultSeatRadius) break;
		}
	},

	drawSeatLinesIndividual : function(fline_pindex, tmppoints, bshowseats, blockIndex) {
		if(typeof(bshowseats) === 'undefined')
			bshowseats = true;

		var fline = null;
		var fline_pindex2;
		if(fline_pindex == tmppoints.length - 1)
			fline_pindex2 = 0;
		else
			fline_pindex2 = fline_pindex + 1;
		var distance = this.lineSpace;
		var sss = 1;
		var isFoundTargetPoints = false;
		var cntlines = 0;

		var lineIndex = 0;
		for(;;) {
			var fparline = getParallelLineFromDistance(tmppoints[fline_pindex], tmppoints[fline_pindex2], distance, sss);   
			var targetPt1 = null, targetPt2 = null;
			for(var i = 0; i < tmppoints.length; i++) {
				if(i != fline_pindex) {
					var tendpointindex = i+1;
					if(i == tmppoints.length - 1) tendpointindex = 0;
					var flineA = getFormulaLineFromTwoPoints(tmppoints[i], tmppoints[tendpointindex]);
					var targetPt = getIntersectionFromTwoLines(fparline, flineA);
					if(targetPt && isPointInLine(targetPt, tmppoints[i], tmppoints[tendpointindex]))
					{
						if(targetPt1 == null) 
							targetPt1 = {x:targetPt.x, y:targetPt.y};
						else {
							targetPt2 = {x:targetPt.x, y:targetPt.y};
							break;
						}
					}
				}
			}

			if(targetPt1 && targetPt2) {
				isFoundTargetPoints = true;

				var a2 = Math.atan2(tmppoints[fline_pindex].y - tmppoints[fline_pindex2].y, tmppoints[fline_pindex].x - tmppoints[fline_pindex2].x);
				var targetalpha = a2 - Math.PI;

				this.drawLineAndSeat(targetPt1, targetPt2, bshowseats, blockIndex, lineIndex++, targetalpha);
				cntlines++;
				if(cntlines == this.rows) break;
			}
			else {
				break;
			}

			distance += this.lineSpace;
		}

		if(!isFoundTargetPoints)  {
			sss = -1;

			for(;;) {
				var fparline = getParallelLineFromDistance(tmppoints[fline_pindex], tmppoints[fline_pindex2], distance, sss);   
				var targetPt1 = null, targetPt2 = null;
				for(var i = 0; i < tmppoints.length; i++) {
					if(i != fline_pindex) {
						var tendpointindex = i+1;
						if(i == tmppoints.length - 1) tendpointindex = 0;
						var flineA = getFormulaLineFromTwoPoints(tmppoints[i], tmppoints[tendpointindex]);
						var targetPt = getIntersectionFromTwoLines(fparline, flineA);
						if(targetPt && isPointInLine(targetPt, tmppoints[i], tmppoints[tendpointindex]))
						{
							if(targetPt1 == null) 
								targetPt1 = {x:targetPt.x, y:targetPt.y};
							else {
								targetPt2 = {x:targetPt.x, y:targetPt.y};
								break;
							}
						}
					}
				}

				if(targetPt1 && targetPt2) {
					isFoundTargetPoints = true;

					var a2 = Math.atan2(tmppoints[fline_pindex].y - tmppoints[fline_pindex2].y, tmppoints[fline_pindex].x - tmppoints[fline_pindex2].x);
					var targetalpha = a2 - Math.PI;

					this.drawLineAndSeat(targetPt1, targetPt2, bshowseats, blockIndex, lineIndex++, targetalpha);
					cntlines++;
					if(cntlines == this.rows) break;
				}
				else {
					break;
				}

				distance += this.lineSpace;
			}
		}

		this.drawBlockPattern(blockIndex, tmppoints, targetalpha);
		canvas.renderAll();
	},

	spliteShapeToBlock : function() {
		this.splitespace = $('#shapeobj_splitespace').val();

		var tmpZoom = canvas.getZoom();
		
		var pointslen = this.blockshape.points.length;
		var last_point1, last_point2;

		var nCnt = 0;
		for(var i = 0; i < pointslen / 2 - 1; i++) {
			var tmppoints = [];
			tmppoints.push({x:canvas.viewportTransform[4] + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * this.blockshape.scaleX * tmpZoom, 
							y:canvas.viewportTransform[5] + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * this.blockshape.scaleY * tmpZoom});
			tmppoints.push({x:canvas.viewportTransform[4] + this.blockshape.left * tmpZoom + this.blockshape.points[i+1].x * this.blockshape.scaleX * tmpZoom, 
							y:canvas.viewportTransform[5] + this.blockshape.top * tmpZoom + this.blockshape.points[i+1].y * this.blockshape.scaleY * tmpZoom});
			tmppoints.push({x:canvas.viewportTransform[4] + this.blockshape.left * tmpZoom + this.blockshape.points[pointslen - i - 2].x * this.blockshape.scaleX * tmpZoom, 
							y:canvas.viewportTransform[5] + this.blockshape.top * tmpZoom + this.blockshape.points[pointslen - i - 2].y * this.blockshape.scaleY * tmpZoom});
			tmppoints.push({x:canvas.viewportTransform[4] + this.blockshape.left * tmpZoom + this.blockshape.points[pointslen - i - 1].x * this.blockshape.scaleX * tmpZoom, 
							y:canvas.viewportTransform[5] + this.blockshape.top * tmpZoom + this.blockshape.points[pointslen - i - 1].y * this.blockshape.scaleY * tmpZoom});
			
			var ptStair = [];
			if(i < pointslen / 2 - 2) {
				var d = getDistanceFromTwoPoints(tmppoints[0], tmppoints[1]);
				var xd = (this.splitespace / d) * (tmppoints[0].x - tmppoints[1].x) + tmppoints[1].x;
				var yd = (this.splitespace / d) * (tmppoints[0].y - tmppoints[1].y) + tmppoints[1].y;
				tmppoints[1].x = xd;
				tmppoints[1].y = yd;

				d = getDistanceFromTwoPoints(tmppoints[2], tmppoints[3]);
				xd = (this.splitespace / d) * (tmppoints[3].x - tmppoints[2].x) + tmppoints[2].x;
				yd = (this.splitespace / d) * (tmppoints[3].y - tmppoints[2].y) + tmppoints[2].y;
				tmppoints[2].x = xd;
				tmppoints[2].y = yd;
			}
			if(i > 0) {
				var d = getDistanceFromTwoPoints(tmppoints[0], tmppoints[1]);
				var xd = (this.splitespace / d) * (tmppoints[1].x - tmppoints[0].x) + tmppoints[0].x;
				var yd = (this.splitespace / d) * (tmppoints[1].y - tmppoints[0].y) + tmppoints[0].y;
				tmppoints[0].x = xd;
				tmppoints[0].y = yd;

				d = getDistanceFromTwoPoints(tmppoints[2], tmppoints[3]);
				xd = (this.splitespace / d) * (tmppoints[2].x - tmppoints[3].x) + tmppoints[3].x;
				yd = (this.splitespace / d) * (tmppoints[2].y - tmppoints[3].y) + tmppoints[3].y;
				tmppoints[3].x = xd;
				tmppoints[3].y = yd;

				if(this.splitespace > 0)
				{
					ptStair = [];
					ptStair.push({x: last_point1.x, y:last_point1.y});
					ptStair.push({x: tmppoints[0].x, y:tmppoints[0].y});
					ptStair.push({x: tmppoints[3].x, y:tmppoints[3].y});
					ptStair.push({x: last_point2.x, y:last_point2.y});
					var obj = new BlockObj(ptStair, null, this.showlines);
					obj.isStair = true;
					// gcreatedObjs.push(obj);
					var distance = getDistanceFromTwoPoints(tmppoints[0], tmppoints[3]) / tmpZoom;
					var lineSpace = distance / this.rows / 3;
					var layerheight = this.layerheight / 3;
					obj.blockshape.set({fill:this.backColor});
					obj.backColor = this.backColor;
					// obj.lineNum = this.rows;
					obj.lineSpace = lineSpace;
					obj.seatspace = this.seatspace;
					obj.showlines = this.showlines;
					obj.baseheight = this.baseheight;
					obj.layerheight = layerheight;
					obj.wall_front = false;
					obj.wall_back = false;
					obj.wall_left = false;
					obj.wall_right = false;
					obj.seatColor = this.seatColor;
					obj.raiseHeight = this.raiseHeight;
					obj.upstair = this.upstair;
					obj.property.tags = this.property.tags.slice();
					obj.drawSeatLines(false);
					obj.callbackModified = modifiedObject;
					nCnt++;
				}
			}
			last_point1 = {x: tmppoints[1].x, y: tmppoints[1].y};
			last_point2 = {x: tmppoints[2].x, y: tmppoints[2].y};

			var obj = new BlockObj(tmppoints, null, this.showlines);
			nCnt++;
			// gcreatedObjs.push(obj);
			obj.blockshape.set({fill:this.backColor});
			obj.backColor = this.backColor;
			obj.lineSpace = this.lineSpace;
			obj.seatspace = this.seatspace;
			obj.rowStart = this.rowStart;
			obj.showlines = this.showlines;
			obj.baseheight = this.baseheight;
			obj.layerheight = this.layerheight;
			obj.wall_front = this.wall_front;
			obj.wall_back = this.wall_back;
			obj.wall_left = this.wall_left;
			obj.wall_right = this.wall_right;
			obj.handrail_img = this.handrail_img;
			obj.handrail_height = this.handrail_height;
			obj.seatColor = this.seatColor;
			obj.raiseHeight = this.raiseHeight;
			obj.upstair = this.upstair;
			obj.property.tags = this.property.tags.slice();
			obj.property.title = '';//this.property.title.slice();
			obj.drawSeatLines(false);
			obj.callbackModified = modifiedObject;
		}

		return nCnt;
	},

	getShapeAllPoints : function(points)
	{
		var thickness = this.lineSpace * (this.rows+1);
		var tmppoints = [];
		for(var i = 0; i < points.length; i++) {
			tmppoints[i] = {x:points[i].x, y:points[i].y};
			if(i == 0) {
				var results = calculateShapePoints(thickness, this.direction, points[0], points[1], points[2]);
				tmppoints[points.length * 2 - 1] = {x:results.pt1_t.x, y:results.pt1_t.y};
			}
			else if(i == points.length - 1) {
				var results = calculateShapePoints(thickness, this.direction, points[i-2], points[i-1], points[i]);
				tmppoints[i+1] = {x:results.pt3_t.x, y:results.pt3_t.y};
			}
			else {
				var results = calculateShapePoints(thickness, this.direction, points[i-1], points[i], points[i+1]);
				tmppoints[2*points.length - i - 1] = {x:results.pt2_t.x, y:results.pt2_t.y};
			}
		}

		var results = [];
		for(var i = 0; i < tmppoints.length / 2 - 1; i++) {
			var pts = [];
			pts.push(tmppoints[i]);
			pts.push(tmppoints[i+1]);
			pts.push(tmppoints[tmppoints.length - i - 2]);
			pts.push(tmppoints[tmppoints.length - i - 1]);
			results.push(pts);
		}

		return results;
	},

	getBlockObjs : function()
	{
		var blockInfos = [];
		var zoom = canvas.getZoom();
		var points;
		// if(typeof(SEATING_3DMAPONLY))
		// {
		// 	points = this.getShapeAllPoints(this.points);
		// 	for(var i = 0; i < this.points.length - 1; i++)
		// 	{
		// 		var blockInfo = {};
		// 		blockInfo.points = points[i];
		// 		blockInfos.push(blockInfo);
		// 	}
		// 	return blockInfos;
		// }
		var tmpZoom = 1 ;
		var tmppoints = [];
		var groupOffsetX = 0, groupOffsetY = 0;
		var group = canvas.getActiveGroup();
		if(group)
		{
			groupOffsetX = (group.left + group.width / 2) * tmpZoom;
			groupOffsetY = (group.top + group.height / 2) * tmpZoom;
		}

		var pointslen;
		if(this.blockshape)
		{
			this.blockshape._calcDimensions();
			pointslen = this.blockshape.points.length;
		}
		else
		{
			points = this.points;
			pointslen = points.length;
		}

		for(var i = 0; i < pointslen / 2 - 1; i++)
		{
			var blockInfo = {};
			var tmppoints = [];
			if(this.blockshape)
			{
				tmppoints.push({x:groupOffsetX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * this.blockshape.scaleX * tmpZoom, 
								y:groupOffsetY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * this.blockshape.scaleY * tmpZoom});
				tmppoints.push({x:groupOffsetX + this.blockshape.left * tmpZoom + this.blockshape.points[i+1].x * this.blockshape.scaleX * tmpZoom, 
								y:groupOffsetY + this.blockshape.top * tmpZoom + this.blockshape.points[i+1].y * this.blockshape.scaleY * tmpZoom});
				tmppoints.push({x:groupOffsetX + this.blockshape.left * tmpZoom + this.blockshape.points[pointslen - i - 2].x * this.blockshape.scaleX * tmpZoom, 
								y:groupOffsetY + this.blockshape.top * tmpZoom + this.blockshape.points[pointslen - i - 2].y * this.blockshape.scaleY * tmpZoom});
				tmppoints.push({x:groupOffsetX + this.blockshape.left * tmpZoom + this.blockshape.points[pointslen - i - 1].x * this.blockshape.scaleX * tmpZoom, 
								y:groupOffsetY + this.blockshape.top * tmpZoom + this.blockshape.points[pointslen - i - 1].y * this.blockshape.scaleY * tmpZoom});
			}
			else
			{
				tmppoints.push({x:points[i].x, y:points[i].y});
				tmppoints.push({x:points[i + 1].x, y:points[i + 1].y});
				tmppoints.push({x:points[pointslen - i - 2].x, y:points[pointslen - i - 2].y});
				tmppoints.push({x:points[pointslen - i - 1].x, y:points[pointslen - i - 1].y});
			}
			
			if(i < pointslen / 2 - 2) {
				var d = getDistanceFromTwoPoints(tmppoints[0], tmppoints[1]);
				var xd = (this.splitespace / d) * (tmppoints[0].x - tmppoints[1].x) + tmppoints[1].x;
				var yd = (this.splitespace / d) * (tmppoints[0].y - tmppoints[1].y) + tmppoints[1].y;
				tmppoints[1].x = xd;
				tmppoints[1].y = yd;

				d = getDistanceFromTwoPoints(tmppoints[2], tmppoints[3]);
				xd = (this.splitespace / d) * (tmppoints[3].x - tmppoints[2].x) + tmppoints[2].x;
				yd = (this.splitespace / d) * (tmppoints[3].y - tmppoints[2].y) + tmppoints[2].y;
				tmppoints[2].x = xd;
				tmppoints[2].y = yd;
			}
			if(i > 0) {
				var d = getDistanceFromTwoPoints(tmppoints[0], tmppoints[1]);
				var xd = (this.splitespace / d) * (tmppoints[1].x - tmppoints[0].x) + tmppoints[0].x;
				var yd = (this.splitespace / d) * (tmppoints[1].y - tmppoints[0].y) + tmppoints[0].y;
				tmppoints[0].x = xd;
				tmppoints[0].y = yd;

				d = getDistanceFromTwoPoints(tmppoints[2], tmppoints[3]);
				xd = (this.splitespace / d) * (tmppoints[2].x - tmppoints[3].x) + tmppoints[3].x;
				yd = (this.splitespace / d) * (tmppoints[2].y - tmppoints[3].y) + tmppoints[3].y;
				tmppoints[3].x = xd;
				tmppoints[3].y = yd;
			}

			blockInfo.points = tmppoints;
			blockInfos.push(blockInfo);
		}

		return blockInfos;
	},

	drawBlockPattern : function(blockIndex, points, targetalpha)
	{
		var left = 100000;
		var top = 100000;
		var obj_points = [];
		for(var i = 0; i < points.length; i++)
		{
			if(left > points[i].x)
				left = points[i].x;
			if(top > points[i].y)
				top = points[i].y;
		}

		var pattern = drawPattern(left, top, points, 10, targetalpha, this.seatspace, this.lineSpace);
		this.fabric_pattern.push(pattern);
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

    	var tmpi = 0;
        for(var i = this.blockshape.points.length / 2 - 1; i >= 0; i--)
        {
            tmppoints.push({
                x: gX + this.blockshape.left * tmpZoom + this.blockshape.points[i].x * (tmpZoom * this.blockshape.scaleX),
                y: gY + this.blockshape.top * tmpZoom + this.blockshape.points[i].y * (tmpZoom * this.blockshape.scaleX)
            });
            tmpi++;
        }
        return tmppoints;
	},

	createFromJson : function(canvas, json)
	{
		if(IsPreview3DVersion())
			this.points = json.points;//.slice(0, json.points.length * 0.5);
		else
			this.points = json.points.slice(0, json.points.length * 0.5);
		this.type = 'ShapeObj';
		// this.obj3DBaseHeight = $('#shapeobj_3dheight');
		// this.obj3DLayerHeight = $('#shapeobj_3dLayerheight');

		this.index = json.property.index;

		// if(json.property.title)
		// 	this.property.title = json.property.title;
		// else
		// 	this.property.title = '';

		if(json.property.lineSpace)
			this.lineSpace = json.property.lineSpace;
		else
			this.lineSpace = 10;
		if(json.property.rows)
			this.rows = json.property.rows;
		else
			this.lineSpace = 6;
		if(typeof(json.property.rowStart) != 'undefined')
			this.rowStart = json.property.rowStart;
		else
			this.rowstart = 1;
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
		if(json.property.raiseHeight)
			this.raiseHeight = json.property.raiseHeight;
		else
			this.raiseHeight = 0;

		if(json.property.showlines == null)
			this.showlines = true;
		else
			this.showlines = json.property.showlines;

		if(typeof(json.property.backColor) != 'undefined')
			this.backColor = json.property.backColor;

		if(json.property.axisindex)
			this.axisindex = json.property.axisindex;

		if(typeof(json.property.splitespace) != 'undefined')
			this.splitespace = json.property.splitespace;
		else
			this.splitespace = 0;

		this.uniqueid = json.property.uniqueid;

		if(json.property.wall_front)
			this.wall_front = json.property.wall_front;
		if(json.property.wall_back)
			this.wall_back = json.property.wall_back;
		if(json.property.wall_left)
			this.wall_left = json.property.wall_left;
		if(json.property.wall_right)
			this.wall_right = json.property.wall_right;
		if(json.property.handrail_img)
			this.handrail_img = json.property.handrail_img;
		if(typeof(json.property.handrail_height) != 'undefined')
		{
			this.handrail_height = json.property.handrail_height;
		}
		else
		{
			this.handrail_height = this.layerheight * 1.5;
		}

		if(json.property.seatColor)
			this.seatColor = json.property.seatColor;
		if(typeof(json.property.upstair) != 'undefined')
			this.upstair = json.property.upstair;
		else
			this.upstair = 0;

		if(json.property.selectable)
			this.selectable = json.property.selectable;
		else
			this.selectable = false;

		if(json.property.property)
			this.property = json.property.property;
		else
			this.property = new CProperty();
	},

	initialize : function()
	{
    	var tmpZoom = canvas.getZoom();
		var newPoints = [];
		for(var i = 0; i < this.points.length; i++)
		{
			var point = {
				x: this.points[i].x * tmpZoom + garena.imgObj.originalLeft * tmpZoom,
				y: this.points[i].y * tmpZoom + garena.imgObj.originalTop * tmpZoom,
			}
			newPoints.push(point);
		}
		this.init(newPoints);
		this.drawSeatLines(false);
		newPoints = [];

		g_historyMan.addState('add', this);
		this.blockshape.visible = this.property.isVisible2D;
	},

	setSelectable: function(isSelectable)
	{
		this.selectable = isSelectable;
		this.blockshape.selectable = isSelectable;
	},

	resetObject : function(state)
	{
		// this.property.title = state.title;
		this.lineSpace = state.lineSpace;
		this.seatspace = state.seatspace;
		this.axisindex = state.axisindex;
		this.baseheight = state.baseheight;
		this.layerheight = state.layerheight;
		this.backColor = state.backColor;
		this.rowStart = state.rowStart;
		this.wall_front = state.wall_front;
		this.wall_back = state.wall_back;
		this.wall_left = state.wall_left;
		this.wall_right = state.wall_right;
		this.handrail_img = state.handrail_img;
		this.handrail_height = state.handrail_height;
		this.seatColor = state.seatColor;
		this.raiseHeight = state.raiseHeight;
		this.upstair = state.upstair;
		this.isStair = state.isStair;
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
			lineSpace: this.lineSpace,
			seatspace: this.seatspace,
			axisindex: this.axisindex,
			baseheight: this.baseheight,
			layerheight: this.layerheight,
			backColor: this.backColor,
			rowStart: this.rowStart,
			wall_front: this.wall_front,
			wall_back: this.wall_back,
			wall_left: this.wall_left,
			wall_right: this.wall_right,
			seatColor: this.seatColor,
			raiseHeight: this.raiseHeight,
			upstair: this.upstair,
			isStair: this.isStair,
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
});