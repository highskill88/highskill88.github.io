

function main_canvas()
{
	this.init = function()
	{
		var tmp1Canvas = document.getElementById('drawcanvas');
		tmp1Canvas.width = $('#draw-board').width();
		tmp1Canvas.height = $('#draw-board').height();

		canvas = new fabric.Canvas('drawcanvas', {renderOnAddRemove: false, preserveObjectStacking: true});
		context = canvas.getContext('2d');

		gDrawBoard = $('#draw-board');

		initCanvasEvent();
		initCanvasPanning();
		initToolBar();

		canvas.selection = false;

		g_historyMan = new CHistoryMan();
	}
		
	this.init();
}


function initCanvasEvent()
{
	$(canvas.wrapperEl).on('mousewheel', function (e)
	{
		if(gselectedtool == 'pencil' || gselectedtool == 'shape' || gselectedtool == 'wall' || gselectedtool == 'light' || gselectedtool == 'magic')
			return;

		var pointx, pointy;
		pointx = e.offsetX==undefined?e.layerX:e.offsetX;
		pointy = e.offsetY==undefined?e.layerY:e.offsetY;
		gtmpmousepointer = {x : pointx, y : pointy};

		if(e.originalEvent.deltaY > 0) {
			sliderVal = Math.max(sliderVal - 1, 1);
			$('#slider_body').slider('value', sliderVal);
		}
		else {
			sliderVal = Math.min(sliderVal + 1, 50);
			$('#slider_body').slider('value', sliderVal);
		}	
	});
	//Moving Object by Mouse Drag
	var panning = false;
	var prevX = 0, prevY = 0;
	canvas.on('mouse:up', function (e) {
		panning = false;
	});
	canvas.on('mouse:out', function (e) {
		panning = false;
	});
	canvas.on('mouse:down', function (e) {
		//console.log('mousedown: ' + gselectedtool);
		var pointx, pointy;
		if(e.e instanceof MouseEvent) {
			pointx = e.e.offsetX==undefined?e.e.layerX:e.e.offsetX;
			pointy = e.e.offsetY==undefined?e.e.layerY:e.e.offsetY;
		}
		else {
			pointx = e.e.touches[0].clientX;
			pointy = e.e.touches[0].clientY;
		}
		pointx -= canvas.viewportTransform[4];
		pointy -= canvas.viewportTransform[5];

		if(gselectedtool == 'none' || gselectedtool == 'hand' || gselectedtool == 'selection') {
			if(!e.target) {//} || (e.target && e.target.objtype == 'arenaobj')) {
				panning = true && !canvas.selection && gselectedtool == 'hand';
				prevX = pointx;
				prevY = pointy;
			}
			else {
				if(gselectedObj != null && gselectedObj.isSettingAxis) {
					gselectedObj.setAxisPoint({x: pointx, y: pointy});
				}
			}
		}
		else if(gselectedtool == 'eye')
		{
			// var center_x = garena.width * 0.5 + garena.imgObj.originalLeft;
			// var center_y = garena.height * 0.5 + garena.imgObj.originalTop;
			// var tmpZoom = canvas.getZoom();
			// g_stage_pos.x = pointx / tmpZoom - center_x;
			// g_stage_pos.y = pointy / tmpZoom - center_y;

			gselectedtool = 'none';
			$('.toolbar_item').removeClass('active');
			hideAllProperty();
			// enablePolygonDraw();
			// canvas.defaultCursor = 'default';
			// $('#toolbar_eye').css('background-color', '#fff');
		}
		else if(gselectedtool == 'magic') {
			if(e.target != null) return;

			gblockpoints = [];
			var sw = canvas.width, sh = canvas.height;
			var imageInfo = {width: sw, height: sh, context: context, data: context.getImageData(0, 0, sw, sh)};
		    var image = {data: imageInfo.data.data, width: imageInfo.width, height: imageInfo.height, bytes: 4};

		    var colorThreshold = 10;
			var blurRadius = 5;
			var simplifyTolerant = 0;
			var simplifyCount = 10;

			var mask = MagicWand.floodFill(image, pointx, pointy, colorThreshold);
	    	mask = MagicWand.gaussBlurOnlyBorder(mask, blurRadius);

		    var cs = MagicWand.traceContours(mask);
		    cs = MagicWand.simplifyContours(cs, simplifyTolerant, simplifyCount);
		    mask = null;

		    // draw contours
		    var ctx = imageInfo.context;
		    //outer
		    ctx.beginPath();

		    //var tmppoints = [];
		    for (var i = 0; i < cs.length; i++) {
		        if (cs[i].inner) continue;

		        var ps = cs[i].points;
		        for (var j = 1; j < ps.length; j++)
					gblockpoints.push({x:ps[j].x, y:ps[j].y});
		        
		        break;
		    }
		    //console.log('length-1:' + gblockpoints.length);

		    //remove points by degree
		    for(var i = 0; i < gblockpoints.length; i++) {
				var pt1;
				if(i == 0)
					pt1 = gblockpoints[gblockpoints.length - 1];
				else
					pt1 = gblockpoints[i-1];

				var pt2 = gblockpoints[i];

				var pt3;
				if(i == gblockpoints.length - 1)
					pt3 = gblockpoints[0];
				else
					pt3 = gblockpoints[i+1];

				var p = (pt1.x - pt2.x) * (pt3.x - pt2.x) + (pt1.y - pt2.y) * (pt3.y - pt2.y);
				var q1 = Math.sqrt( (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) );
				var q2 = Math.sqrt( (pt3.x - pt2.x) * (pt3.x - pt2.x) + (pt3.y - pt2.y) * (pt3.y - pt2.y) );
				var alpha = Math.acos(p / (q1 * q2)) * (180 / Math.PI);

				var d1 = Math.sqrt( (pt1.x - pt2.x)*(pt1.x - pt2.x) + (pt1.y - pt2.y)*(pt1.y - pt2.y) );
				var d2 = Math.sqrt( (pt2.x - pt3.x)*(pt2.x - pt3.x) + (pt2.y - pt3.y)*(pt2.y - pt3.y) );
				
				if(((d1 < 3 || d2 < 3) && Math.abs(alpha) > 130) || Math.abs(180-alpha) <= 10) {
					gblockpoints.splice(i, 1);
					i = -1;
				}
			}

			// drawSelectingBlock();
		}
		else if(gselectedtool == 'pencil' || gselectedtool == 'light') { //pencil points
			if(gblockpoints.length == 0) {
				gblockpoints.push({x: pointx, y: pointy});
			}
			else {
				gblockpoints[gblockpoints.length - 1].x = pointx;
				gblockpoints[gblockpoints.length - 1].y = pointy;
			}

			if(e.e.shiftKey) {
				if( gblockpoints.length >= 2) {
					var len = gblockpoints.length;
					var pt1 = {x:gblockpoints[len-2].x, y:gblockpoints[len-2].y - 100};
					var pt2 = gblockpoints[len-2];
					var pt3 = gblockpoints[len-1];

					var alpha = getDegreeBy3Points(pt1, pt2, pt3);
					var d = Math.sqrt( (pt2.x - pt3.x)*(pt2.x - pt3.x) + (pt2.y - pt3.y)*(pt2.y - pt3.y) );

					if(pt3.x < pt2.x) alpha = 360 - alpha;
					/*if(alpha < 45) alpha = 45;
					else if(alpha < 90) alpha = 90;
					else if(alpha < 135) alpha = 135;
					else if(alpha < 180) alpha = 180;
					else if(alpha < 225) alpha = 225;
					else if(alpha < 270) alpha = 270;
					else if(alpha < 315) alpha = 315;
					else alpha = 360;*/
					if(alpha < 45) alpha = 0;
					else if(alpha < 135) alpha = 90;
					else if(alpha < 225) alpha = 180;
					else if(alpha < 315) alpha = 270;
					else alpha = 360;

					gblockpoints[len - 1].x = pt2.x + Math.cos((alpha - 90) * Math.PI / 180) * d;
					gblockpoints[len - 1].y = pt2.y + Math.sin((alpha - 90) * Math.PI / 180) * d;
					if(len == 4) {
						if(gblockpoints[len - 1].x == gblockpoints[2].x)
							gblockpoints[len - 1].y = gblockpoints[0].y;
						else
							gblockpoints[len - 1].x = gblockpoints[0].x;
					}
				}
			}

			gtmppointslength = gblockpoints.length;
			// drawSelectingBlock();
		}
		else if(gselectedtool == 'shape' || gselectedtool == 'wall') { //shape points
			if(gblockpoints.length == 0) {
				gblockpoints.push({x: pointx, y: pointy});
			}
			else {
				gblockpoints[gblockpoints.length - 1].x = pointx;
				gblockpoints[gblockpoints.length - 1].y = pointy;
			}

			if(e.e.shiftKey) {
				if( gblockpoints.length >= 2) {
					var len = gblockpoints.length;
					var pt1 = {x:gblockpoints[len-2].x, y:gblockpoints[len-2].y - 100};
					var pt2 = gblockpoints[len-2];
					var pt3 = gblockpoints[len-1];

					var alpha = getDegreeBy3Points(pt1, pt2, pt3);
					var d = Math.sqrt( (pt2.x - pt3.x)*(pt2.x - pt3.x) + (pt2.y - pt3.y)*(pt2.y - pt3.y) );

					if(pt3.x < pt2.x) alpha = 360 - alpha;
					/*if(alpha < 25) alpha = 0;
					else if(alpha < 45) alpha = 45;
					else if(alpha < 90) alpha = 90;
					else if(alpha < 135) alpha = 135;
					else if(alpha < 180) alpha = 180;
					else if(alpha < 225) alpha = 225;
					else if(alpha < 270) alpha = 270;
					else if(alpha < 315) alpha = 315;
					else alpha = 360;*/
					if(alpha < 45) alpha = 0;
					else if(alpha < 135) alpha = 90;
					else if(alpha < 225) alpha = 180;
					else if(alpha < 315) alpha = 270;
					else alpha = 360;

					gblockpoints[gblockpoints.length - 1].x = Math.floor(pt2.x + Math.cos((alpha - 90) * Math.PI / 180) * d);
					gblockpoints[gblockpoints.length - 1].y = Math.floor(pt2.y + Math.sin((alpha - 90) * Math.PI / 180) * d);
				}
			}

			gtmppointslength = gblockpoints.length;
			// drawSelectingBlock();

			/*if(gblockpoints.length == 3)
				$('#btn_blockpoints_create').click();*/
		}
	});
	canvas.on('mouse:move', function (e) {
		var pointx, pointy;
		if(e.e instanceof MouseEvent) {
			pointx = e.e.offsetX==undefined?e.e.layerX:e.e.offsetX;
			pointy = e.e.offsetY==undefined?e.e.layerY:e.e.offsetY;
		}
		else {
			pointx = e.e.touches[0].clientX;
			pointy = e.e.touches[0].clientY;
		}
		// pointx += canvas.viewportTransform[4];
		// pointy += canvas.viewportTransform[5];

		if(gselectedtool == 'none' || gselectedtool == 'hand') {
			if(panning && e && e.e) {
				if(prevX != 0 && prevY != 0) {
					var delta = new fabric.Point((pointx - prevX), (pointy - prevY)) ;
    				canvas.relativePan(delta);
				}
				prevX = pointx;
				prevY = pointy;
			}
		}
		else if(gselectedtool == 'pencil' || gselectedtool == 'light') {
			if(gtmppointslength >= 1) {
				if(gblockpoints.length == gtmppointslength) {
					gblockpoints.push({x: pointx, y: pointy});
				}
				else {
					gblockpoints[gblockpoints.length - 1].x = pointx;
					gblockpoints[gblockpoints.length - 1].y = pointy;
				}

				if(e.e.shiftKey) {
					if( gblockpoints.length >= 2) {
						var offsetX = canvas.viewportTransform[4];
						var offsetY = canvas.viewportTransform[5];
						var len = gblockpoints.length;
						var pt1 = {x:gblockpoints[len-2].x + offsetX, y:gblockpoints[len-2].y - 100 + offsetY};
						var pt2 = {x:gblockpoints[len-2].x + offsetX, y:gblockpoints[len-2].y + offsetY};
						var pt3 = gblockpoints[len-1];

						var alpha = getDegreeBy3Points(pt1, pt2, pt3);
						var d = Math.sqrt( (pt2.x - pt3.x)*(pt2.x - pt3.x) + (pt2.y - pt3.y)*(pt2.y - pt3.y) );

						if(pt3.x < pt2.x) alpha = 360 - alpha;
						/*if(alpha < 45) alpha = 45;
						else if(alpha < 90) alpha = 90;
						else if(alpha < 135) alpha = 135;
						else if(alpha < 180) alpha = 180;
						else if(alpha < 225) alpha = 225;
						else if(alpha < 270) alpha = 270;
						else if(alpha < 315) alpha = 315;
						else alpha = 360;*/
						if(alpha < 45) alpha = 0;
						else if(alpha < 135) alpha = 90;
						else if(alpha < 225) alpha = 180;
						else if(alpha < 315) alpha = 270;
						else alpha = 360;

						gblockpoints[gblockpoints.length - 1].x = Math.floor(pt2.x + Math.cos((alpha - 90) * Math.PI / 180) * d);
						gblockpoints[gblockpoints.length - 1].y = Math.floor(pt2.y + Math.sin((alpha - 90) * Math.PI / 180) * d);
					}
				}
				drawSelectingBlock();
			}
		}
		else if(gselectedtool == 'shape' || gselectedtool == 'wall') {
			if(gtmppointslength >= 1) {
				if(gblockpoints.length == gtmppointslength) {
					gblockpoints.push({x: pointx, y: pointy});
				}
				else {
					gblockpoints[gblockpoints.length - 1].x = pointx;
					gblockpoints[gblockpoints.length - 1].y = pointy;
				}

				if(e.e.shiftKey) {
					if( gblockpoints.length >= 2) {
						var len = gblockpoints.length;
						var offsetX = canvas.viewportTransform[4];
						var offsetY = canvas.viewportTransform[5];
						var len = gblockpoints.length;
						var pt1 = {x:gblockpoints[len-2].x + offsetX, y:gblockpoints[len-2].y - 100 + offsetY};
						var pt2 = {x:gblockpoints[len-2].x + offsetX, y:gblockpoints[len-2].y + offsetY};
						var pt3 = gblockpoints[len-1];

						var alpha = getDegreeBy3Points(pt1, pt2, pt3);
						var d = Math.sqrt( (pt2.x - pt3.x)*(pt2.x - pt3.x) + (pt2.y - pt3.y)*(pt2.y - pt3.y) );

						if(pt3.x < pt2.x) alpha = 360 - alpha;
						/*if(alpha < 25) alpha = 0;
						else if(alpha < 45) alpha = 45;
						else if(alpha < 90) alpha = 90;
						else if(alpha < 135) alpha = 135;
						else if(alpha < 180) alpha = 180;
						else if(alpha < 225) alpha = 225;
						else if(alpha < 270) alpha = 270;
						else if(alpha < 315) alpha = 315;
						else alpha = 360;*/
						if(alpha < 45) alpha = 0;
						else if(alpha < 135) alpha = 90;
						else if(alpha < 225) alpha = 180;
						else if(alpha < 315) alpha = 270;
						else alpha = 360;

						gblockpoints[gblockpoints.length - 1].x = pt2.x + Math.cos((alpha - 90) * Math.PI / 180) * d;
						gblockpoints[gblockpoints.length - 1].y = pt2.y + Math.sin((alpha - 90) * Math.PI / 180) * d;
					}
				}
				drawSelectingBlock();
			}
		}
	});
	canvas.on('mouse:dblclick', function (e) {
		var pointx, pointy;
		if(e.e instanceof MouseEvent) {
			pointx = e.e.offsetX==undefined?e.e.layerX:e.e.offsetX;
			pointy = e.e.offsetY==undefined?e.e.layerY:e.e.offsetY;
		}
		else {
			pointx = e.e.touches[0].clientX;
			pointy = e.e.touches[0].clientY;
		}

		if(gselectedtool == 'pencil' || gselectedtool == 'light' || gselectedtool == 'shape' || gselectedtool == 'wall') {
			if(gblockpoints.length > 3) {
				//gblockpoints.splice(gblockpoints.length - 1, 1);
				$('#btn_blockpoints_create').click();
			}
		}
		else if(gselectedtool == 'none') {
			if (gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'WallObj')) {
				// var pxcolor = context.getImageData(pointx, pointy, 1, 1).data;
				// var hexcolor = '#' + ('000000' + rgbToHex(pxcolor[0], pxcolor[1], pxcolor[2])).slice(-6);
				// if(hexcolor == '#008000')
				gselectedObj.addResizePoint({x: pointx, y: pointy});
			}
		}
		else if(gselectedtool == 'magic') {
			if(e.target != null && e.target.objtype == 'tempblock') {
				$('#btn_blockpoints_create').click();
			}
		}
	});

	
	var ctrlDown = false;
	var ctrlKey = 17;
	var cmdKey = 91;

	$(document).keydown(function(e)
	{
		if(!$(e.target).is('body'))
			return;

		var vKey = 86,
		    cKey = 67;

		if(e.keyCode == ctrlKey || e.keyCode == cmdKey)
			ctrlDown = true;

		if(e.keyCode == 46)
		{ //Delete
			if(gselectedresizepoint != null && gselectedObj != null)
			{
				gselectedObj.removeResizePoint(gselectedresizepoint);
			}
	  	}
	  	else if(e.keyCode == 27) //Esc
	  	{
			if(gselectedtool == 'pencil' || gselectedtool == 'shape' || gselectedtool == 'wall' || gselectedtool == 'light')
				$('#btn_blockpoints_create').click();
			else if(gselectedtool == 'selection')
				canvas.deactivateAll().renderAll();
		}
		else if(e.keyCode == 32) //Space
		{
			if(gtempblockobj == null && gselectedObj == null && gselectedtool != 'pencil' && gselectedtool != 'shape' && gselectedtool != 'wall' && gselectedtool != 'light')
			{
				if(gselectedtool != 'hand')
				{
					gselectedtool = 'hand';
					canvas.defaultCursor = 'pointer';
					canvas.selection = false;

					for(var i = 0; i < gcreatedObjs.length; i++)
						gcreatedObjs[i].blockshape.selectable = false;

					canvas.deactivateAll().renderAll();
				}
			}
		}
		else if(ctrlDown && (e.keyCode == vKey || e.keyCode == cKey))
		{
			function getCopyData(object)
			{
				var tmpZoom = canvas.getZoom();
				if(object.type == 'BlockObj')
				{
					return {
								'type':object.type,
								'lineSpace':object.lineSpace,
								'seatspace':object.seatspace,
								'axisindex':object.axisindex,
								'showchair': object.showchair,
								'showlines':object.showlines,
								'showLabel': object.showLabel,
								'showLabel3D': object.showLabel3D,
								'baseheight':object.baseheight,
								'layerheight':object.layerheight,
								'raiseHeight':object.raiseHeight,
								'lineNumberType':object.lineNumberType,
								'backColor':object.backColor,
								'wall_front':object.wall_front,
								'wall_back':object.wall_back,
								'wall_left':object.wall_left,
								'wall_right':object.wall_right,
								'seatColor':object.seatColor,
								'upstair':object.upstair,
								'handrail_img': object.handrail_img,
								'handrail_height': object.handrail_height,
								'bgImagePath':object.bgImagePath,
								'zoom':tmpZoom,
								'points':object.getAbsolutePoints(),
							};
				}
				else if(object.type == 'WallObj')
				{
					return {
								'type':object.type,
								'baseheight':object.baseheight,
								'wall_thickness':object.wall_thickness,
								'raise_offset':object.raise_offset,
								'backColor':object.backColor,
								'bgImagePath':object.bgImagePath,
								'bgVideoPath':object.bgVideoPath,
								'materialType': object.materialType,
								'zoom':tmpZoom,
								'points':object.getShapePoints(),
							};
				}
				else if(object.type == 'LightObj')
				{
					return {
								'type':object.type,
								'rowsNum':object.rowsNum,
								'colsNum': object.colsNum,
								'lightType': object.lightType,
								'axisindex':object.axisindex,
								'lightColor':object.lightColor,
								'lightDistance': object.lightDistance,
								'isShow': object.isShow,
								'lightType': object.lightType,
								'isShowBulb': object.isShowBulb,
								'isRealLight': object.isRealLight,
								'baseheight':object.baseheight,
								'thickness':object.thickness,
								'backColor':object.backColor,
								'bgImagePath':object.bgImagePath,
								lightProperty: object.lightProperty,
								'zoom':tmpZoom,
								'points':object.getAbsolutePoints(),
							};
				}
				else if(object.type == 'ShapeObj')
				{
					return {
								'type':object.type,
								'lineSpace':object.lineSpace,
								'rows':object.rows,
								'seatspace':object.seatspace,
								'splitespace':object.splitespace,
								'showlines':object.showlines,
								'rowStart' : object.rowStart,
								'baseheight':object.baseheight,
								'layerheight':object.layerheight,
								'raiseHeight':object.raiseHeight,
								'backColor':object.backColor,
								'wall_front':object.wall_front,
								'wall_back':object.wall_back,
								'wall_left':object.wall_left,
								'wall_right':object.wall_right,
								'seatColor':object.seatColor,
								'upstair':object.upstair,
								'zoom':tmpZoom,
								'points':object.getShapePoints(),
							};
				}
			}
			if(e.keyCode == cKey) {	//Copy
				copyClipboard();
			}
			else { //Paste
				pasteClipboard();
			}
		}
	});

	$(document).keyup(function(e) {
		if(e.keyCode == 32)
		{
			if(gselectedtool == 'hand') //Space
			{
				gselectedtool = 'none';
				$('.toolbar_item').removeClass('active');
				canvas.defaultCursor = 'default';
				canvas.selection = false;

				for(var i = 0; i < gcreatedObjs.length; i++)
				{
					if(gcreatedObjs[i].selectable)
						gcreatedObjs[i].blockshape.selectable = true;
				}
				// if(gWallObj)
				// 	gWallObj.blockshape.selectable = false;

				canvas.deactivateAll().renderAll();
			}
		}
		if(e.keyCode == ctrlKey || e.keyCode == cmdKey)
			ctrlDown = false;
	});

}

function drawSelectingBlock(isMove)
{
	if(gtempblockobj != null) {
		canvas.remove(gtempblockobj);
		gtempblockobj = null;
	}
	//console.log(gblockpoints.length);
	$('#blockpoints_count').val(gblockpoints.length);
	if(gblockpoints.length > 2)
		$('#btn_blockpoints_create').disable(false);
	else {
		$('#btn_blockpoints_create').disable(true);
	}

	if(gblockpoints.length <= 0) return;

	var dPointX = 0;
	var dPointY = 0;
	var tmpZoom = canvas.getZoom();
	// if(isMove)
	{
		dPointX = canvas.viewportTransform[4];
		dPointY = canvas.viewportTransform[5];
	}

	if(gblockpoints.length <= 2) {
		if(gblockpoints.length == 2) {
			// var bound = getBoundFromPoints(gblockpoints);

			var tmppoints = [];
			tmppoints.push({x:gblockpoints[0].x + dPointX, y:gblockpoints[0].y + dPointY});
			tmppoints.push({x:gblockpoints[0].x + dPointX, y:gblockpoints[0].y + dPointY});
			tmppoints.push({x:gblockpoints[1].x, y:gblockpoints[1].y});
			var bound = getBoundFromPoints(tmppoints);

			gtempblockobj = new fabric.Polygon(tmppoints, {
				left: (bound.left + (bound.right - bound.left) / 2) / tmpZoom - canvas.viewportTransform[4] / tmpZoom,
				top: (bound.top + (bound.bottom - bound.top) / 2) / tmpZoom - canvas.viewportTransform[5] / tmpZoom,
				fill: '#ffffff',
				opacity: 0.5,
				stroke: gcolor_blockselborder,
				strokeWidth: 1.5 * tmpZoom,
				originX: 'center',
				originY: 'center',
				scaleX: 1 / tmpZoom,
				scaleY: 1 / tmpZoom,
				hoverCursor: 'default',
				objtype: 'tempblock',
				selectable: false
			});
			tmppoints = [];
		}
	}
	else {
		if(gselectedtool == 'pencil' || gselectedtool == 'light' || gselectedtool == 'magic') {
			var tmppoints = [];
			for(var i = 0; i < gblockpoints.length - 1; i++)
			{
				tmppoints.push({x: gblockpoints[i].x + canvas.viewportTransform[4], y:gblockpoints[i].y + canvas.viewportTransform[5]});
			}
			tmppoints.push({x:gblockpoints[gblockpoints.length - 1].x, y:gblockpoints[gblockpoints.length - 1].y});
			var bound = getBoundFromPoints(tmppoints);

			gtempblockobj = new fabric.Polygon(tmppoints, {
				left: (bound.left + (bound.right - bound.left) / 2) / tmpZoom - canvas.viewportTransform[4] / tmpZoom,
				top: (bound.top + (bound.bottom - bound.top) / 2) / tmpZoom - canvas.viewportTransform[5] / tmpZoom,
				angle: 0,
				fill: '#ffffff',
				opacity: 0.5,
				stroke: gcolor_blockselborder,
				strokeWidth: 1.5 * tmpZoom,
				originX: 'center',
				originY: 'center',
				scaleX: 1 / tmpZoom,
				scaleY: 1 / tmpZoom,
				hoverCursor: 'default',
				objtype: 'tempblock',
				selectable: false
			});
			tmppoints = [];
		}
		else {
			var tmpshapepoints = [];
			var tmppoints = [];
			var tmpZoom = canvas.getZoom();
			var sss = 1;

			var length = gblockpoints.length;
			if(gselectedtool == 'shape')
			{
				if(gblockpoints[gblockpoints.length - 1].x == gblockpoints[gblockpoints.length - 2].x &&
					gblockpoints[gblockpoints.length - 1].y == gblockpoints[gblockpoints.length - 2].y)
					length = gblockpoints.length - 1;
			}

			for(var i = 0; i < length - 1; i++) {
				tmppoints.push({x:gblockpoints[i].x + canvas.viewportTransform[4], y:gblockpoints[i].y + canvas.viewportTransform[5]});
			}
			tmppoints.push({x:gblockpoints[length - 1].x, y:gblockpoints[length - 1].y});

			if(tmppoints.length < 3) return;

			var thickness = 0;
			if(gselectedtool == 'wall')
				thickness = 5 * tmpZoom;
			else
				thickness = defaultLineSpace * defaultRows * tmpZoom

			//console.log('-------------------------');
			//console.log(tmppoints);
			for(var i = 0; i < tmppoints.length; i++) {
				tmpshapepoints[i] = {x:tmppoints[i].x, y:tmppoints[i].y};
				if(i == 0) {
					var results = calculateShapePoints(thickness, sss, tmppoints[0], tmppoints[1], tmppoints[2]);
					tmpshapepoints[tmppoints.length * 2 - 1] = {x:results.pt1_t.x, y:results.pt1_t.y};
					
				}
				else if(i == tmppoints.length - 1) {
					var results = calculateShapePoints(thickness, sss, tmppoints[i-2], tmppoints[i-1], tmppoints[i]);
					tmpshapepoints[i+1] = {x:results.pt3_t.x, y:results.pt3_t.y};
					
				}
				else {
					var results = calculateShapePoints(thickness, sss, tmppoints[i-1], tmppoints[i], tmppoints[i+1]);
					if(results.pt2_t != null) {
						tmpshapepoints[2*tmppoints.length - i - 1] = {x:results.pt2_t.x, y:results.pt2_t.y};
					}
					else
						return;
				}
			}

			var bound = getBoundFromPoints(tmpshapepoints);
			var tmpZoom = canvas.getZoom();
			gtempblockobj = new fabric.Polygon(tmpshapepoints, {
				left: (bound.left + (bound.right - bound.left) / 2) / tmpZoom - canvas.viewportTransform[4] / tmpZoom,
				top: (bound.top + (bound.bottom - bound.top) / 2) / tmpZoom - canvas.viewportTransform[5] / tmpZoom,
				angle: 0,
				fill: '#ffffff',
				opacity: 0.5,
				stroke: gcolor_blockselborder,
				strokeWidth: 1.5 * tmpZoom,
				originX: 'center',
				originY: 'center',
				scaleX: 1 / tmpZoom,
				scaleY: 1 / tmpZoom,
				hoverCursor: 'default',
				objtype: 'tempblock',
				selectable: false
			});
		}
	}
	if(gtempblockobj != null) canvas.add(gtempblockobj);
	canvas.deactivateAll().renderAll();
}

function initCanvasPanning()
{

 	var tracking = {
 		none: 0,
 		Left: 1,
 		Bottom: 2,
 		Right: 3,
 		Top: 4,
 	};
 	var trackingAspect = 0;
 	var trackingStep = [
 		{x: 0, y: 0}, 
	 	{x: 2, y: 0}, 
	 	{x: 0, y: -2}, 
	 	{x: -2, y: 0}, 
	 	{x: 0, y: 2},
 	]
 	$(document).mouseenter(function(e)
 	{
 		trackingAspect = tracking.none;
		clearTimeout($(this).data('timeoutId'));
	}).mouseleave(function(e)
	{
    	if(gblockpoints.length > 1 && (gselectedtool == 'pencil' || gselectedtool == 'shape' || gselectedtool == 'wall'))
    	{
			var someElement = $(this),
			timeoutId = setTimeout(function() {
		    	var width = $(window).width();
		    	var height = $(document).height();
		    	if(e.clientX <= 0)
		    		trackingAspect = tracking.Left;
		    	else if(e.clientX >= width - 1)
		    		trackingAspect = tracking.Right;
		    	else if(e.clientY <= 0)
		    		trackingAspect = tracking.Top;
		    	else if(e.clientY >= height - 1)
		    		trackingAspect = tracking.Bottom;
		    	else
		    		trackingAspect = tracking.none;
		    	treakingMouseOut(1.0);
			}, 250);
			someElement.data('timeoutId', timeoutId);
		}
	}).mousemove(function(e)
    {
    	if(gblockpoints.length > 1 && (gselectedtool == 'pencil' || gselectedtool == 'shape' || gselectedtool == 'wall'))
    	{
	    	var trackingAspect_last = -1;
	    	if(trackingAspect != trackingAspect_last)
	    	{
	    		trackingAspect_last = trackingAspect;
			    var width = Math.min($(window).width(), screen.width);
			    var height = Math.min($(window).height() - 102, screen.height);
		    	if(e.clientX <= 0)
		    		trackingAspect = (tracking.Left);
		    	else if(e.clientX >= width - 1)
		    		trackingAspect = (tracking.Right);
		    	else if(e.clientY <= 0)
		    		trackingAspect = (tracking.Top);
		    	else if(e.clientY >= height - 1)
		    		trackingAspect = (tracking.Bottom);
		    	else
		    		trackingAspect = tracking.none;
		    	treakingMouseOut(1.0);
	    		//console.log(trackingAspect);
		    }
		}
    })
    function moveCanvas(aspect, rate)
    {
    	if(aspect != tracking.none)
    	{
    		var limit_width = garena.width * 0.8 * canvas.getZoom();
    		var limit_height = garena.height * 0.8 * canvas.getZoom();
    		if(canvas.viewportTransform[4] < -limit_width)
    		{
    			if(aspect == tracking.Right)
    				return false;
    		}
    		if(canvas.viewportTransform[4] > limit_width)
    		{
    			if(aspect == tracking.Left)
    				return false;
    		}
    		if(canvas.viewportTransform[5] < -limit_height)
    		{
    			if(aspect == tracking.Bottom)
    				return false;
    		}
    		if(canvas.viewportTransform[5] > limit_height)
    		{
    			if(aspect == tracking.Top)
	    			return false;
	    	}
    		if(!rate)
    			rate = 1;
    		var delta = {
    			x: trackingStep[aspect].x * rate,
    			y: trackingStep[aspect].y * rate,
    		};
		    canvas.relativePan(delta);
		    if(gselectedObj != null)
		    	gselectedObj.showProperty();
		    // drawSelectingBlock(true);
		    return true;
		}
    }
    function treakingMouseOut(rate)
    {
    	if(trackingAspect == tracking.none)
    		return;
    	setTimeout(function()
    	{
    		if(!moveCanvas(trackingAspect, rate))
    			return;
	        treakingMouseOut(rate + 0.5);
    	}, 50);
    }
}


function initToolBar()
{
	initToolBarDraw();

	initDrawingObject();
	initBlockObject();
	initShapeObject();
	initLightObject();
	initArenaObject();
	initOption();
	initEyeSetting();
	initWall();
	initToolBarSelection();
	initCommonControls();

	initMoveButtons();
	initToolBarZoom();

	initToolBarTop();
	initToolBarSelectionDlg();

	initUploadImage();
	initLayerToolbar();
}