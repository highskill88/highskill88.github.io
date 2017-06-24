var g_appOptions = {
	chairSpace: 10,
	lineSpace: 10,
	chairSize: 8,
	colorFloor: '#ffffff', //#7577c9',
	lightColor: '#444444',
	lightIntensity: 0.7,
	isCeiling: false,
	targetPosition: null,
	graphic_quality : 1,

	saveOption: function()
	{
		// localStorage.setItem('app_option', JSON.stringify(this));
	},

	loadOption:function(obj)
	{
		// var json = localStorage.getItem('app_option');
		if(obj)
		{
			// var obj = JSON.parse(json);
			if(typeof(obj.chairSpace) != 'undefined')
				this.chairSpace = parseFloat(obj.chairSpace);
			if(typeof(obj.lineSpace) != 'undefined')
				this.lineSpace = parseFloat(obj.lineSpace);
			if(typeof(obj.chairSize) != 'undefined')
				this.chairSize = parseFloat(obj.chairSize);
			if(typeof(obj.colorFloor) != 'undefined')
				this.colorFloor = obj.colorFloor;
			if(typeof(obj.lightColor) != 'undefined')
				this.lightColor = obj.lightColor;
			if(typeof(obj.lightIntensity) != 'undefined')
				this.lightIntensity = parseFloat(obj.lightIntensity);
			if(typeof(obj.targetPosition) != 'undefined')
				this.targetPosition = obj.targetPosition;
		}
	},
}

// g_appOptions.loadOption();



var sh_global = {
	getCenterPos: function(points)
	{
		var min_x = min_y = 0xffffffff, max_x = max_y = -0xffffffff; 
		for(var i = 0; i < points.length; i++)
		{
			min_x = Math.min(points[i].x, min_x);
			min_y = Math.min(points[i].y, min_y);
			max_x = Math.max(points[i].x, max_x);
			max_y = Math.max(points[i].y, max_y);
		}
		return {
			x: (min_x + max_x) * 0.5,
			y: (min_y + max_y) * 0.5,
		}
	},

	getRectFromTwoPoints: function(pt1, pt2, thickness)
	{
		var pt1_t, pt2_t;
		if(pt1.y == pt2.y)
		{
			if (pt1.x > pt2.x)
			{
				pt1_t = {x:pt1.x, y:pt1.y - thickness};
				pt2_t = {x:pt2.x, y:pt2.y - thickness};
			}
			else
			{
				pt1_t = {x:pt1.x, y:pt1.y + thickness};
				pt2_t = {x:pt2.x, y:pt2.y + thickness};
			}
		}
		else if(pt1.x == pt2.x) {
			if (pt1.y > pt2.y)
			{
				pt1_t = {x:pt1.x + thickness, y:pt1.y};
				pt2_t = {x:pt2.x + thickness, y:pt2.y};
			}
			else
			{
				pt1_t = {x:pt1.x - thickness, y:pt1.y};
				pt2_t = {x:pt2.x - thickness, y:pt2.y};
			}
		}
		else {
			pt1_t = getPointFromTwoPointsToDistance(pt1, pt2, thickness, 1);
			pt2_t = getPointFromTwoPointsToDistance(pt2, pt1, thickness, -1);
		}
		return [pt1, pt1_t, pt2_t, pt2];
	}
}

function IsPreview3DVersion()
{
	if(typeof(SEATING_3DMAPONLY) != 'undefined')
		return true;
	return false;
}


var sh_2dman = {
	getBlockAtShape: function(points, rows, seatspace, lineSpace, rowStart)
	{
		var distance = lineSpace;
		var cntlines = 0;
		var lines = [];
		var seats = [];

		for(;;)
		{
			var fparline = getParallelLineFromDistance(points[0], points[1], distance, -1);
			var targetPt1 = null, targetPt2 = null;
			for(var i = 0; i < points.length; i++)
			{
				if(i != 0 && i != 2)
				{
					var tendpointindex = i+1;
					if(i == points.length - 1) tendpointindex = 0;
					var flineA = getFormulaLineFromTwoPoints(points[i], points[tendpointindex]);
					var targetPt = getIntersectionFromTwoLines(fparline, flineA);
					if(targetPt)
					{
						if(targetPt1 == null)
						{
							targetPt1 = {x:targetPt.x, y:targetPt.y, edge_index:i};
						}
						else
						{
							targetPt2 = {x:targetPt.x, y:targetPt.y, edge_index:i};
							break;
						}
					}
				}
			}

			if(targetPt1 && targetPt2)
			{
				lines.push({
					p1: targetPt1,
					p2: targetPt2,
					edge_index1: targetPt1.edge_index,
					edge_index2: targetPt2.edge_index,
					lineIndex: cntlines,
					textNumber: sh_2dman.getNumberText(lines.length + 1, rowStart)
				});

				var d = getDistanceFromTwoPoints(targetPt1, targetPt2);
				var remain_space = d % seatspace;
				var seatNum = d / seatspace;
				var rspace = remain_space / seatNum;
				var space = seatspace * 0.5;
				for(;;) {
					var xd = (space / d) * (targetPt2.x - targetPt1.x) + targetPt1.x;
					var yd = (space / d) * (targetPt2.y - targetPt1.y) + targetPt1.y;
					
					var point = {
						x:		xd,
						y:		yd,
						lineIndex:	cntlines,
						// angle:		targetalpha,
					};
					seats.push(point);

					space += (seatspace + rspace);
					if(d <= space + defaultSeatRadius)
						break;
				}
				cntlines++;
				if(cntlines >= rows)
					break;
			}
			else
			{
				break;
			}

			distance += lineSpace;
		}
		return {
			lines:lines,
			seats: seats,
			targetalpha: Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x),
		};
	},

	getNumberText: function(index, startString)
	{
		var num = parseInt(startString);
		var isNumber = true;
		if(isNaN(num))
		{
			isNumber = false;
		}

		var textString;

		function AlphaToNumber(str)
		{
			var res = str.toUpperCase();
			var sum = 0;
			for(var i = 0; i < res.length; i++)
			{
				var n = res.charCodeAt(res.length - i - 1) - 64;
				sum += (Math.pow(26, i) * n);
			}
			return sum - 1;
		}
		function toAlphabetic(i)
		{
			return (i >= 26 ? toAlphabetic((i / 26 >> 0) - 1) : '') +
				'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i % 26 >> 0];
		}

		if(isNumber)
		{
			var nIndex = index + num - 1;
			textString = nIndex.toString();
		}
		else
		{
			var nIndex = AlphaToNumber(startString) + index;
			textString = toAlphabetic(nIndex - 1);
		}
		return textString;
	},
}


//compare one point from two points
function isPointInLine(pt, pt1, pt2) {	
	var bflag1 = (pt.x >= pt1.x - 0.1 && pt.x <= pt2.x + 0.1) || (pt.x <= pt1.x + 0.1 && pt.x >= pt2.x - 0.1);
	var bflag2 = (pt.y >= pt1.y - 0.1 && pt.y <= pt2.y + 0.1) || (pt.y <= pt1.y + 0.1 && pt.y >= pt2.y - 0.1);
	
	/*if(bflag1 && bflag2)
	{
		canvas.add(new fabric.Circle({radius:3 , 
			strokeWidth:1, 
			stroke:'#ff0000', 
			fill:'#ff0000', 
			left:pt.x, 
			top:pt.y, 
			hasControls:false, 
			originX:'center', 
			originY:'center'}));
		
		canvas.renderAll();
	}*/

	return (bflag1 && bflag2);
}

//get distance from two points.
function getDistanceFromTwoPoints(pt1, pt2) {
	var a = pt1.x - pt2.x;
	var b = pt1.y - pt2.y;

	return Math.sqrt( a*a + b*b )
}

function getSDistancePoints(pt1, pt2) {
	var a = pt1.x - pt2.x;
	var b = pt1.y - pt2.y;
	return a* a +  b * b;
}

function getSDistancePointsXY(x1, y1, x2, y2) {
	var a = x1 - x2;
	var b = y1 - y2;
	return a* a +  b * b;
}

function getDistancePoint2Line(pt, pt1, pt2) {
	var pline = getFormulaLineFromTwoPoints(pt1, pt2);

	return (pline.a * pt.x + pline.b * pt.y + pline.c) / Math.sqrt(pline.a * pline.a + pline.b * pline.b);
}
//get formula line from 2 points
function getFormulaLineFromTwoPoints(pt1, pt2) {
	var a, b, c;
	if(pt2.x == pt1.x) {
		a = -1;
		c = pt2.x;
		b = 0;
	}
	else if(pt2.y == pt1.y) {
		a = 0;
		c = pt2.y;
		b = -1;		
	}
	else {
		a = (pt2.y - pt1.y) / (pt2.x - pt1.x);
		c = (pt2.x * pt1.y - pt1.x * pt2.y) / (pt2.x - pt1.x);
		b = -1;
	}

	return {a:a, b:b, c:c};
}

//get parallel from line
function getParallelLineFromDistance(pt1, pt2, distance, sss) {
	var c;
	var pline = getFormulaLineFromTwoPoints(pt1, pt2);
	if (pt1.x == pt2.x && pt1.y < pt2.y)
		c = pline.c - sss * distance * Math.sqrt(pline.a * pline.a + pline.b * pline.b);
	else if (pt1.x == pt2.x && pt1.y > pt2.y)
		c = pline.c + sss * distance * Math.sqrt(pline.a * pline.a + pline.b * pline.b);
	else if (pt1.x < pt2.x)
		c = pline.c + sss * distance * Math.sqrt(pline.a * pline.a + pline.b * pline.b);
	else 
		c = pline.c - sss * distance * Math.sqrt(pline.a * pline.a + pline.b * pline.b);

	return {a:pline.a, b:pline.b, c:c};
}

//get parallel from line
function getParallelLineDistance(fline, pt1, pt2, distance, sss) {
	var c;
	if (pt1.x == pt2.x && pt1.y < pt2.y)
		c = fline.c - sss * distance * Math.sqrt(fline.a * fline.a + fline.b * fline.b);
	else if (pt1.x == pt2.x && pt1.y > pt2.y)
		c = fline.c + sss * distance * Math.sqrt(fline.a * fline.a + fline.b * fline.b);
	else if (pt1.x < pt2.x)
		c = fline.c + sss * distance * Math.sqrt(fline.a * fline.a + fline.b * fline.b);
	else 
		c = fline.c - sss * distance * Math.sqrt(fline.a * fline.a + fline.b * fline.b);

	return {a:fline.a, b:fline.b, c:c};
}

//get point from two lines
function getIntersectionFromTwoLines(pline1, pline2) {
	if(pline1.a * pline2.b == pline2.a * pline1.b && Math.abs(pline2.c - pline1.c) < 0.1)
	{
		console.log('asd');
		return null;
	}
	else if(pline1.a * pline2.b == pline2.a * pline1.b)
	{
		return null;
	}
	else 
	{
		xt = (pline1.b * pline2.c - pline2.b * pline1.c) / (pline1.a * pline2.b - pline2.a * pline1.b);
		yt = (pline2.a * pline1.c - pline1.a * pline2.c) / (pline1.a * pline2.b - pline2.a * pline1.b);
	}

	return {x:xt, y:yt};
}

function calculateShapePoints(d, sss, pt1, pt2, pt3) {
	if(pt1.y == pt2.y) {
		if (pt1.x > pt2.x)
			pt1_t = {x:pt1.x, y:pt1.y-d*sss};
		else
			pt1_t = {x:pt1.x, y:pt1.y+d*sss};
	}
	else if(pt1.x == pt2.x) {
		if (pt1.y > pt2.y)
			pt1_t = {x:pt1.x+d*sss, y:pt1.y};	
		else
			pt1_t = {x:pt1.x-d*sss, y:pt1.y};	
	}
	else {
		pt1_t = getPointFromTwoPointsToDistance(pt1, pt2, d, sss);
	}

	var pline1 = getParallelLineFromDistance(pt1, pt2, d, sss);
	
	if(!pt3)
	{
		return {pt1_t:pt1_t, pt2_t:pt2_t}; 
	}

	if(pt2.y == pt3.y) {
		if(pt2.x > pt3.x)
			pt3_t = {x:pt3.x, y:pt3.y-d*sss};
		else
			pt3_t = {x:pt3.x, y:pt3.y+d*sss};
	}
	else if(pt2.x == pt3.x) {
		if(pt2.y < pt3.y)
			pt3_t = {x:pt3.x-d*sss, y:pt3.y};
		else
			pt3_t = {x:pt3.x+d*sss, y:pt3.y};	
	}
	else {
		pt3_t = getlastPointFromTwoPointsToDistance(pt2, pt3, d, sss);
	}

	var pline2 = getParallelLineFromDistance(pt2, pt3, d, sss);

	var pt2_t;
	
	if (pline2.a == pline1.a && pline2.b == pline1.b && pline2.c == pline1.c && pline1.a == 0)
		pt2_t = {x:pt2.x, y:pline2.c/pline2.b*(-1)};
	else if (pline2.a == pline1.a && pline2.b == pline1.b && pline2.c == pline1.c && pline1.b == 0)
		pt2_t = {x:pline2.c/pline2.a*(-1), y:pt2.y};
	//else if (pline2.a == pline1.a && pline2.b == pline1.b && pline2.c == pline1.c)
	else if ((pline2.a - pline1.a) * (pline2.a - pline1.a)
			 + (pline2.b - pline1.b) * (pline2.b - pline1.b)
			 + (pline2.c - pline1.c) * (pline2.c - pline1.c) < 0.0005) 
		pt2_t = {x:pt2.x + (pt3_t.x - pt3.x), y:pt2.y + (pt3_t.y - pt3.y)};
	else 
		pt2_t = getIntersectionFromTwoLines(pline1, pline2);

	return {pt1_t:pt1_t, 
			pt2_t:pt2_t, 
			pt3_t:pt3_t}; 
}

//get point to start first point from 2 points to distance
function getPointFromTwoPointsToDistance(pt1, pt2, d, sss) {
	a = Math.abs((pt1.y - pt2.y)/(pt1.x - pt2.x));
	var xt, yt;
	//if (sss == 1)
	{
		if (pt2.x > pt1.x && pt2.y > pt1.y)
		{
			xt = pt1.x - sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt1.y + sss * Math.sqrt(d*d / (1 + a*a));
		}
		else if (pt2.x > pt1.x && pt2.y < pt1.y)
		{
			xt = pt1.x + sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt1.y + sss * Math.sqrt(d*d / (1 + a*a));
		}
		else if (pt2.x < pt1.x && pt2.y < pt1.y)
		{
			xt = pt1.x + sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt1.y - sss * Math.sqrt(d*d / (1 + a*a));
		}
		else 
		{
			xt = pt1.x - sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt1.y - sss * Math.sqrt(d*d / (1 + a*a));
		}		
	}
	//console.log(pt1);
	//console.log(xt + ":" + yt);

	return{x:xt, y:yt};
}

//get point to start first point from 2 points to distance
function getlastPointFromTwoPointsToDistance(pt1, pt2, d, sss) {
	a = Math.abs((pt1.y - pt2.y)/(pt1.x - pt2.x));
	var xt, yt;
	//if (sss == 1)
	{
		if (pt2.x > pt1.x && pt2.y > pt1.y)
		{
			xt = pt2.x - sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt2.y + sss * Math.sqrt(d*d / (1 + a*a));
		}

		else if (pt2.x > pt1.x && pt2.y < pt1.y)
		{
			xt = pt2.x + sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt2.y + sss * Math.sqrt(d*d / (1 + a*a));
		}

		else if (pt2.x < pt1.x && pt2.y < pt1.y)
		{
			xt = pt2.x + sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt2.y - sss * Math.sqrt(d*d / (1 + a*a));
		}

		else 
		{
			xt = pt2.x - sss * a * Math.sqrt(d*d / (1 + a*a));
			yt = pt2.y - sss * Math.sqrt(d*d / (1 + a*a));
		}		
	}

	return{x:xt, y:yt};
}


function getRotaionPoint(point, angle)
{
	var cos = Math.cos(angle);
	var sin = Math.sin(angle);

	var dx = point.x * cos - point.y * sin;
	var dy = point.x * sin + point.y * cos;

	var newPt;
	newPt.x = point.x + dx;
	newPt.y = point.y + dy;
	return newPt;
}

var rgbToHex = function(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw 'Invalid color component';
	return ((r << 16) | (g << 8) | b).toString(16);
}

function getDegreeBy3Points(point1, point2, point3) {
	var pt1 = point1;
	var pt2 = point2;
	var pt3 = point3;
	var p = (pt1.x - pt2.x) * (pt3.x - pt2.x) + (pt1.y - pt2.y) * (pt3.y - pt2.y);
	var q1 = Math.sqrt( (pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) );
	var q2 = Math.sqrt( (pt3.x - pt2.x) * (pt3.x - pt2.x) + (pt3.y - pt2.y) * (pt3.y - pt2.y) );
	var alpha = Math.acos(p / (q1 * q2)) * (180 / Math.PI);

	return alpha;
}



function getBoundFromPoints(points) {
	var min_x, min_y, max_x, max_y;
	var tmpZoom = canvas.getZoom();
	min_x = max_x = points[0].x;
	min_y = max_y = points[0].y;
	for(var i = 1; i < points.length; i++) {
		if(min_x > points[i].x) min_x = points[i].x;
		if(min_y > points[i].y) min_y = points[i].y;
		if(max_x < points[i].x) max_x = points[i].x;
		if(max_y < points[i].y) max_y = points[i].y;
	}

	return {left:min_x, top:min_y, right:max_x, bottom:max_y};
}

var _ImageValidFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"]; 
var _VideoValidFileExtensions = [".mp4", ".ogv"];    
function IsImageValidate(sFileName)
{
	return IsFileValidate(sFileName, _ImageValidFileExtensions);
}
function IsVideoValidate(sFileName)
{
	return IsFileValidate(sFileName, _VideoValidFileExtensions);
}
function IsFileValidate(sFileName, extensions)
{
	if(!sFileName)
		return false;
	if (sFileName.length > 0) {
		var blnValid = false;
		for (var j = 0; j < extensions.length; j++) {
			var sCurExtension = extensions[j];
			if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
				blnValid = true;
				break;
			}
		}
	}

	if (!blnValid) {
		alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + extensions.join(", "));
		return false;
	}
  
    return true;
}




function copyClipboard() {
	function getCopyData(object) {
		var tmpZoom = canvas.getZoom();
		if(object.type == 'BlockObj') {
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


	if(gselectedObj != null)
	{
		var copyObjects = [];
		copyObjects.push(getCopyData(gselectedObj));
		localStorage.setItem('copyObject', JSON.stringify(copyObjects));
	}
	else
	{
		if(selectionObjects != null) 
		{
			var copyObjects = [];
			var tmpZoom = canvas.getZoom();
			for(var i = 0; i < selectionObjects.length; i++)
			{
				copyObjects.push(getCopyData(selectionObjects[i]));
			}
			localStorage.setItem('copyObject', JSON.stringify(copyObjects));
		}
	}
}


function IsClipboard() {
	var retrievedObject = localStorage.getItem('copyObject');
	if(retrievedObject)
		return true;
	return false;
}

function pasteClipboard() {
	var retrievedObject = localStorage.getItem('copyObject');
	if(!retrievedObject)
		return;

	var arrObjects = JSON.parse(retrievedObject);
	var tmpZoom = canvas.getZoom();

	for(var t = 0; t < arrObjects.length; t++)
	{
		var pasteObject = arrObjects[t];
		
		//console.log(pasteObject.points);

		if(pasteObject.type == 'BlockObj')
		{
			for(var i = 0; i < pasteObject.points.length; i++)
			{
				pasteObject.points[i].x = canvas.viewportTransform[4] + pasteObject.points[i].x * tmpZoom + 4;
				pasteObject.points[i].y = canvas.viewportTransform[5] + pasteObject.points[i].y * tmpZoom + 4;
			}
			var obj = new BlockObj(pasteObject.points);
			// gcreatedObjs.push(obj);
			gcreatedObjs[gcreatedObjs.length - 1].lineSpace = pasteObject.lineSpace;
			gcreatedObjs[gcreatedObjs.length - 1].seatspace = pasteObject.seatspace;
			gcreatedObjs[gcreatedObjs.length - 1].axisindex = pasteObject.axisindex;
			gcreatedObjs[gcreatedObjs.length - 1].showchair = pasteObject.showchair;
			gcreatedObjs[gcreatedObjs.length - 1].showlines = pasteObject.showlines;
			gcreatedObjs[gcreatedObjs.length - 1].showLabel = pasteObject.showLabel;
			gcreatedObjs[gcreatedObjs.length - 1].showLabel3D = pasteObject.showLabel3D;
			gcreatedObjs[gcreatedObjs.length - 1].baseheight = pasteObject.baseheight;
			gcreatedObjs[gcreatedObjs.length - 1].layerheight = pasteObject.layerheight;
			gcreatedObjs[gcreatedObjs.length - 1].raiseHeight = pasteObject.raiseHeight;
			gcreatedObjs[gcreatedObjs.length - 1].lineNumberType = pasteObject.lineNumberType;
			gcreatedObjs[gcreatedObjs.length - 1].backColor = pasteObject.backColor;
			gcreatedObjs[gcreatedObjs.length - 1].wall_front = pasteObject.wall_front;
			gcreatedObjs[gcreatedObjs.length - 1].wall_back = pasteObject.wall_back;
			gcreatedObjs[gcreatedObjs.length - 1].wall_left = pasteObject.wall_left;
			gcreatedObjs[gcreatedObjs.length - 1].wall_right = pasteObject.wall_right;
			gcreatedObjs[gcreatedObjs.length - 1].seatColor = pasteObject.seatColor;
			gcreatedObjs[gcreatedObjs.length - 1].upstair = pasteObject.upstair;
			gcreatedObjs[gcreatedObjs.length - 1].handrail_img = pasteObject.handrail_img;
			gcreatedObjs[gcreatedObjs.length - 1].handrail_height = pasteObject.handrail_height;
			gcreatedObjs[gcreatedObjs.length - 1].bgImagePath = pasteObject.bgImagePath;
			// gcreatedObjs[gcreatedObjs.length - 1].title = pasteObject.title;
			gcreatedObjs[gcreatedObjs.length - 1].changedParameters(true);
			m3DCreator.addNew3DObject();
			obj.callbackModified = m3DCreator.modify3DObject;
		}
		else if(pasteObject.type == 'ShapeObj')
		{
			for(var i = 0; i < pasteObject.points.length; i++)
			{
				pasteObject.points[i].x = canvas.viewportTransform[4] + pasteObject.points[i].x * tmpZoom / pasteObject.zoom + 4;
				pasteObject.points[i].y = canvas.viewportTransform[5] + pasteObject.points[i].y * tmpZoom / pasteObject.zoom + 4;
			}
			var obj = new ShapeObj(gcreatedObjs.length, pasteObject.points);
			// gcreatedObjs.push(obj);
			gcreatedObjs[gcreatedObjs.length - 1].lineSpace = pasteObject.lineSpace;
			gcreatedObjs[gcreatedObjs.length - 1].rows = pasteObject.rows;
			gcreatedObjs[gcreatedObjs.length - 1].seatspace = pasteObject.seatspace;
			gcreatedObjs[gcreatedObjs.length - 1].splitespace = pasteObject.splitespace;
			gcreatedObjs[gcreatedObjs.length - 1].showlines = pasteObject.showlines;
			gcreatedObjs[gcreatedObjs.length - 1].rowStart = pasteObject.rowStart;
			gcreatedObjs[gcreatedObjs.length - 1].baseheight = pasteObject.baseheight;
			gcreatedObjs[gcreatedObjs.length - 1].layerheight = pasteObject.layerheight;
			gcreatedObjs[gcreatedObjs.length - 1].raiseHeight = pasteObject.raiseHeight;
			gcreatedObjs[gcreatedObjs.length - 1].backColor = pasteObject.backColor;
			gcreatedObjs[gcreatedObjs.length - 1].wall_front = pasteObject.wall_front;
			gcreatedObjs[gcreatedObjs.length - 1].wall_back = pasteObject.wall_back;
			gcreatedObjs[gcreatedObjs.length - 1].wall_left = pasteObject.wall_left;
			gcreatedObjs[gcreatedObjs.length - 1].wall_right = pasteObject.wall_right;
			gcreatedObjs[gcreatedObjs.length - 1].seatColor = pasteObject.seatColor;
			gcreatedObjs[gcreatedObjs.length - 1].upstair = pasteObject.upstair;
			gcreatedObjs[gcreatedObjs.length - 1].changedParameters(true);
			m3DCreator.addNew3DObject();
			obj.callbackModified = m3DCreator.modify3DObject;
		}
		else if(pasteObject.type == 'WallObj')
		{
			for(var i = 0; i < pasteObject.points.length; i++)
			{
				pasteObject.points[i].x = canvas.viewportTransform[4] + pasteObject.points[i].x * tmpZoom / pasteObject.zoom + 4;
				pasteObject.points[i].y = canvas.viewportTransform[5] + pasteObject.points[i].y * tmpZoom / pasteObject.zoom + 4;
			}
			var obj = new WallObj(pasteObject.points);
			// gcreatedObjs.push(obj);
			gcreatedObjs[gcreatedObjs.length - 1].baseheight = pasteObject.baseheight;
			gcreatedObjs[gcreatedObjs.length - 1].wall_thickness = pasteObject.wall_thickness;
			gcreatedObjs[gcreatedObjs.length - 1].raise_offset = pasteObject.raise_offset,
			gcreatedObjs[gcreatedObjs.length - 1].backColor = pasteObject.backColor;
			gcreatedObjs[gcreatedObjs.length - 1].bgImagePath = pasteObject.bgImagePath;
			gcreatedObjs[gcreatedObjs.length - 1].bgVideoPath = pasteObject.bgVideoPath;
			gcreatedObjs[gcreatedObjs.length - 1].materialType = pasteObject.materialType;
			gcreatedObjs[gcreatedObjs.length - 1].changedParameters(true);
			m3DCreator.addNew3DObject();
			obj.callbackModified = m3DCreator.modify3DObject;
		}
		else if(pasteObject.type == 'LightObj')
		{
			for(var i = 0; i < pasteObject.points.length; i++)
			{
				pasteObject.points[i].x = canvas.viewportTransform[4] + pasteObject.points[i].x * tmpZoom + 4;
				pasteObject.points[i].y = canvas.viewportTransform[5] + pasteObject.points[i].y * tmpZoom + 4;
			}
			var obj = new LightObj(gcreatedObjs.length, pasteObject.points);
			// gcreatedObjs.push(obj);
			gcreatedObjs[gcreatedObjs.length - 1].rowsNum = pasteObject.rowsNum;
			gcreatedObjs[gcreatedObjs.length - 1].colsNum = pasteObject.colsNum;
			gcreatedObjs[gcreatedObjs.length - 1].axisindex = pasteObject.axisindex;
			gcreatedObjs[gcreatedObjs.length - 1].lightType = pasteObject.lightType;
			gcreatedObjs[gcreatedObjs.length - 1].lightType = pasteObject.lightType;
			gcreatedObjs[gcreatedObjs.length - 1].lightColor = pasteObject.lightColor;
			gcreatedObjs[gcreatedObjs.length - 1].lightDistance = pasteObject.lightDistance;
			gcreatedObjs[gcreatedObjs.length - 1].isShow = pasteObject.isShow;
			gcreatedObjs[gcreatedObjs.length - 1].lightType = pasteObject.lightType;
			gcreatedObjs[gcreatedObjs.length - 1].isShowBulb = pasteObject.isShowBulb;
			gcreatedObjs[gcreatedObjs.length - 1].isRealLight = pasteObject.isRealLight;
			gcreatedObjs[gcreatedObjs.length - 1].baseheight = pasteObject.baseheight;
			gcreatedObjs[gcreatedObjs.length - 1].thickness = pasteObject.thickness;
			gcreatedObjs[gcreatedObjs.length - 1].backColor = pasteObject.backColor;
			gcreatedObjs[gcreatedObjs.length - 1].lightColor = pasteObject.lightColor;
			gcreatedObjs[gcreatedObjs.length - 1].intensity = pasteObject.intensity;
			gcreatedObjs[gcreatedObjs.length - 1].range = pasteObject.range;
			gcreatedObjs[gcreatedObjs.length - 1].bgImagePath = pasteObject.bgImagePath;
			gcreatedObjs[gcreatedObjs.length - 1].lightProperty.copy(pasteObject.lightProperty);
			gcreatedObjs[gcreatedObjs.length - 1].changedParameters(true);
			m3DCreator.addNew3DObject();
			obj.callbackModified = m3DCreator.modify3DObject;
		}
	}
}

function exportJson() {
	var arrayObjs = [];
	if(selectionObjects && selectionObjects.length > 0) {
		selectionObjects.forEach(function(obj, index) {
			arrayObjs.push(obj);
		})
	}
	else if(gselectedObj) {
		arrayObjs.push(gselectedObj);
	}
	if(selectionObjects && selectionObjects.length > 0)
	{
		canvas.deactivateAll().renderAll();
	}
	if(arrayObjs.length > 0) {
		var saveData = data_manager.exportJson(arrayObjs);
		var filename = $('#text_save_filename').val();
		var data = {
			"save_data": saveData,
			"filename": "./files/export/" + filename + ".bin",
		};
		$.ajax (
		{
			type: "POST",
			url: "server/filesave.php", 
			data: data,
			cache: false,
			success: function(result) {
				console.log('file is saved', result);
				var str_path = 'server/' + result.substr(2);
				// $.fileDownload(str_path);
				$('#file_download_iframe')[0].src = str_path;
			}
		});
	}
}