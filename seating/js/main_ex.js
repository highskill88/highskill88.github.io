//Objects Controls
var canvas = null;
var context = null;
var gDrawBoard = null;
var g_historyMan = null;

//global colors
var gcolor_blockborder = 'blue';
var gcolor_blockselborder = '#FF007F';
var gcolor_blockpoints = 'blue';

//status global variable
// var gseatsTotal = 0;
var garena = null;

//selecting points
var gselectedtool = 'none'; //pencil, shape, magic, selection, hand
var gEyeObj = null;
var gblockpoints = [];
var gtmppointslength;
var gtempblockobj = null;

//select block
var gselectedObj = null;
var gcreatedObjs = [];
var gresizepoints = null;

//select resizepoint
var gselectedresizepoint = null;

//shape default parameters
var defaultLineSpace = 10;
var defaultRows = 6;
var defaultSeatSpace = 10;
var defaultSeatRadius = 2;
var defaultLineColor = '#999999';
var defaultSeatColor = '#e1cc1a';
var defaultLightColor = '#ffffff';

var sliderVal = 10;

// var g_stage_pos = {x:0, y:0};

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

function hideAllProperty() {
	$('#arena_creating').hide();
	$('#blockpoints').hide();
	$('#blockobj_normal').hide();
	$('#wallobj_normal').hide();
	$('#dlg_lightobj').hide();
	$('#shapeobj_normal').hide();
	$('#3d_shapeobj').hide();
	$('#option_dlg').hide();
	$('#dlg_setting_eye').hide();
}

function showBlockPointsProperty() {
	hideAllProperty();

	windowblockpoints = $('#blockpoints');
	xxx = gDrawBoard.offset().left + gDrawBoard.width() - 40- windowblockpoints.width();
	yyy = gDrawBoard.offset().top + 10;
	windowblockpoints.css('left', xxx);
	windowblockpoints.css('top', yyy);
	windowblockpoints.show();

	//reset
	$('#blockpoints_count').val(0);
	gblockpoints = [];
	gtmppointslength = 0;
	$('#btn_blockpoints_create').disable(true);
}

var isCreatedArena = false;
function initUploadImage()
{
	//Object
	var mapping_imgupload = document.getElementById("mapping_imgupload");
	if(mapping_imgupload) {
		mapping_imgupload.onchange = function(e)
		{
			if(this.value != '')
			{
				//progress bar
				$('#uploadprogressbar').css('width', '0');
				var progressModal = document.getElementById('progressModal');
				progressModal.style.display = "block";

				var obj =  new FormData(document.getElementById('SeatMapImageUpload'));
				$.ajax({
				    url     :   'uploadimage.php',
				    type    :   "POST",
				    data    :   obj,
					xhr: function() {
						var myXhr = $.ajaxSettings.xhr();

						//Upload progress
						myXhr.upload.addEventListener("progress", function(evt) {
							if (evt.lengthComputable) {
								var percentComplete = 100 * evt.loaded / evt.total;
								//Do something with upload progress
								$('#uploadprogressbar').css('width', percentComplete + '%');
							}
						}, false);

						//Download progress
						myXhr.addEventListener("progress", function(evt) {
							if (evt.lengthComputable) {
								var percentComplete = evt.loaded / evt.total;
								//Do something with download progress
								//console.log('Download - ' + evt.loaded + ':' + evt.total);
							}
						}, false);

						return myXhr;
					},
					cache: false,
				    processData: false,
				    contentType: false,
				    success :   function(retData,response) {
				    	if(retData == 'error')
				    	{
				    		alert("file's size exceeds server's maximum upload size!");
				    	}
				    	else
				    	{
							//reset input file
							$('#mapping_imgupload').wrap('<form>').closest('form').get(0).reset();
							$('#mapping_imgupload').unwrap();

					        if(retData == '0'){
								alert('error - uploading map image');
					            return;
					        }

					        //Image submitted successfully
							//console.log('uploaded url:' + retData);
							if(gselectedObj)
							{
								gselectedObj.setImageBackground(retData);
							}
							var progressModal = document.getElementById('progressModal');
							progressModal.style.display = "none";
						}
				    },
				    error   :   function(){
				        //'Oops! Some error occured during Image submission. Please try again later.'
				        //reset input file
						$('#mapping_imgupload').wrap('<form>').closest('form').get(0).reset();
						$('#mapping_imgupload').unwrap();
				    }
				});
			}
	    };
	}
	var mapping_videoupload = document.getElementById("mapping_imgupload");
	if(mapping_videoupload) {
		document.getElementById("mapping_videoupload").onchange = function(e)
		{
			if(this.value != '')
			{
				//progress bar
				$('#uploadprogressbar').css('width', '0');
				var progressModal = document.getElementById('progressModal');
				progressModal.style.display = "block";

				var obj =  new FormData(document.getElementById('SeatMapVideUpload'));
				$.ajax({
				    url     :   'uploadvideo.php',
				    type    :   "POST",
				    data    :   obj,
					xhr: function() {
						var myXhr = $.ajaxSettings.xhr();

						//Upload progress
						myXhr.upload.addEventListener("progress", function(evt){
							if (evt.lengthComputable) {
								var percentComplete = 100 * evt.loaded / evt.total;
								//Do something with upload progress
								$('#uploadprogressbar').css('width', percentComplete + '%');
							}
						}, false);

						//Download progress
						myXhr.addEventListener("progress", function(evt){
							if (evt.lengthComputable) {
								var percentComplete = evt.loaded / evt.total;
								//Do something with download progress
								//console.log('Download - ' + evt.loaded + ':' + evt.total);
							}
						}, false);

						return myXhr;
					},
					cache: false,
				    processData: false,
				    contentType: false,
				    success :   function(retData,response){
				    	if(retData == 'error')
				    	{
				    		alert("file's size exceeds server's maximum upload size!");
				    	}
				    	else
				    	{
							//reset input file
							$('#mapping_videoupload').wrap('<form>').closest('form').get(0).reset();
							$('#mapping_videoupload').unwrap();

					        if(retData == '0') {
								alert('error - uploading map image');
					            return;
					        }
							if(gselectedObj && gselectedObj.type == 'WallObj')
							{
								gselectedObj.setVideoBackground(retData);
							}
							var progressModal = document.getElementById('progressModal');
							progressModal.style.display = "none";
						}
				    },
				    error   :   function(){
				        //'Oops! Some error occured during Image submission. Please try again later.'
				        //reset input file
						$('#mapping_videoupload').wrap('<form>').closest('form').get(0).reset();
						$('#mapping_videoupload').unwrap();
				    }
				});
			}
	    };
	}
};



//Zoom In/Out Controls, Curve & Skew Slider for Seating Section
var gsetslidervalueflag = false;



var data_manager = 
{
	loadedObjects: [],
	exportJson: function(array) {
		var json = [];
		this.pushJsonFromArray(json, array);
		return jsonpack.pack(JSON.stringify(json));
	},
	pushJsonFromArray: function(json, array) {
		for(var i = 0; i < array.length; i++)
		{
			var obj = array[i];
			var points = obj.getPointsFromArena();
			if(!points)
				continue;
			if(obj.type == 'WallObj')
			{
				var property = {
					baseheight: obj.baseheight,
					wall_thickness: obj.wall_thickness,
					raise_offset: obj.raise_offset,
					backColor: obj.backColor,
					bgImagePath: obj.bgImagePath,
					bgVideoPath: obj.bgVideoPath,
					selectable: obj.selectable,
					materialType: obj.materialType,
					property: obj.property,
				};
				json.push({
					type: 'WallObj',
					points: points,
					property: property,
				});
			}
			else if(obj.type == 'ShapeObj')
			{
				var property = {
					index: obj.index,
					lineSpace: obj.lineSpace,
					rows: obj.rows,
					seatspace: obj.seatspace,
					showlines: obj.showlines,
					baseheight: obj.baseheight,
					layerheight: obj.layerheight,
					raiseHeight: obj.raiseHeight,
					backColor: obj.backColor,
					lineType: obj.lineNumberType,
					axisindex: obj.axisindex,
					wall_front: obj.wall_front,
					wall_back: obj.wall_back,
					wall_left: obj.wall_left,
					wall_right: obj.wall_right,
					handrail_img: obj.handrail_img,
					handrail_height: obj.handrail_height,
					seatColor: obj.seatColor,
					upstair: obj.upstair,
					rowStart: obj.rowStart,
					selectable: obj.selectable,
					property: obj.property,
					tags: obj.tags,
				}
				json.push({
					type: 'ShapeObj',
					points: points,
					property: property,
				});
			}
			else if(obj.type == 'BlockObj')
			{
				var row = 0;
				if(obj.fabriclines)
					row = obj.fabriclines.length;
				var property = {
					index: obj.index,
					lineSpace: obj.lineSpace,
					rows: row,
					seatspace: obj.seatspace,
					showchair: obj.showchair,
					showlines: obj.showlines,
					showLabel: obj.showLabel,
					showLabel3D: obj.showLabel3D,
					baseheight: obj.baseheight,
					layerheight: obj.layerheight,
					raiseHeight: obj.raiseHeight,
					backColor: obj.backColor,
					splitespace: obj.splitespace,
					axisindex: obj.axisindex,
					wall_front: obj.wall_front,
					wall_back: obj.wall_back,
					wall_left: obj.wall_left,
					wall_right: obj.wall_right,
					handrail_img: obj.handrail_img,
					handrail_height: obj.handrail_height,
					seatColor: obj.seatColor,
					upstair: obj.upstair,
					bgImagePath: obj.bgImagePath,
					title: obj.title,
					selectable: obj.selectable,
					isStair: obj.isStair,
					rowStart: obj.rowStart,
					property: obj.property,
					tags: obj.tags,
				}
				json.push({
					type: 'BlockObj',
					points: points,
					property: property,
				});
			}
			else if(obj.type == 'LightObj')
			{
				var property = {
					rowsNum: obj.rowsNum,
					rows: obj.fabriclines.length,
					colsNum: obj.colsNum,
					lightDistance: obj.lightDistance,
					lightType: obj.lightType,
					isShow: obj.isShow,
					isShowBulb: obj.isShowBulb,
					baseheight: obj.baseheight,
					thickness: obj.thickness,
					backColor: obj.backColor,
					axisindex: obj.axisindex,
					lightColor: obj.lightColor,
					bgImagePath: obj.bgImagePath,
					selectable: obj.selectable,
					intensity: obj.intensity,
					range: obj.range,
					property: obj.property,
					isRealLight: obj.isRealLight,
					isVertical: obj.isVertical,
					angle_vertical: obj.angle_vertical,
					lightProperty: obj.lightProperty,
				}
				json.push({
					type: 'LightObj',
					points: points,
					property: property,
				});
			}
			else if(obj.type == 'EyeObj')
			{
				var property = {
					isShow: obj.isShow,
					baseheight: obj.baseheight,
				}
				json.push({
					type: 'EyeObj',
					points: points,
					property: property,
				});
			}
		}
	},
	saveJson: function(isServerSave)
	{
		var json_save = [];
		json_save.push({
			type: 'ArenaObj',
			url: garena.imgpath,
			width: garena.width,
			height: garena.height,
		});
		json_save.push({
			type: 'option',
			property: g_appOptions,
		});
		this.pushJsonFromArray(json_save, gcreatedObjs);

		var compressdJSON = jsonpack.pack(JSON.stringify(json_save));
		if(!isServerSave)
			localStorage.setItem('last_works', compressdJSON);
		return compressdJSON;
	},

	loadSaveFile: function(json_data) {
		this.loadedObjects = [];
		this.loadFromJSON(this.loadedObjects, json_data);
	},

	loadImportFile: function(json_data) {
		var array = [];
		this.loadFromJSON(array, json_data);
		return array;
	},

	loadFromJSON: function(arryObjs, json_data)
	{
		// var gseatsTotal = 0;
		if(json_data != "") {
			// var uncompressedJSON = JSON.stringify(jsonpack.unpack(json_data), null, 2);
			var uncompressedJSON = jsonpack.unpack(json_data);

			gcreatedObjs = [];
			for(var i = 0; i < uncompressedJSON.length; i++)
			{
				var json = uncompressedJSON[i];
				if(json.type == 'ArenaObj')
				{
					if(IsPreview3DVersion())
						garena = new ArenaObj(json.url, null);
					else
						garena = new ArenaObj(json.url, null, onLoadedArena);
					if(json.width)
						garena.width = json.width;
					else
						garena.width = 1800;
					if(json.height)
						garena.height = json.height;
					else
						garena.height = 1904;
				}
				else if(json.type == 'option')
				{
					g_appOptions.loadOption(json.property);
					m3DCreator.changeFloorColor(g_appOptions.colorFloor);
					m3DCreator.changeLightMain(g_appOptions.lightColor, g_appOptions.lightIntensity);
					if(g_appOptions.targetPosition)
						m3DCreator.setCameraTarget(g_appOptions.targetPosition);
				}
				else if(json.type == 'WallObj')
				{
					var obj = new WallObj();
					obj.callbackModified = m3DCreator.modify3DObject;
					obj.createFromJson(canvas, json);
					arryObjs.push(obj);
				}
				else if(json.type == 'BlockObj')
				{
					var obj = new BlockObj();
					obj.callbackModified = m3DCreator.modify3DObject;
					obj.createFromJson(canvas, json);
					arryObjs.push(obj);
				}
				else if(json.type == 'LightObj')
				{
					var obj = new LightObj(gcreatedObjs.length);
					obj.callbackModified = m3DCreator.modify3DObject;
					obj.createFromJson(canvas, json);
					arryObjs.push(obj);
				}
				else if(json.type == 'ShapeObj')
				{
					var obj = new ShapeObj(gcreatedObjs.length);
					obj.callbackModified = m3DCreator.modify3DObject;
					obj.createFromJson(canvas, json);
					arryObjs.push(obj);
				}
				else if(json.type == 'EyeObj')
				{
					if(!gEyeObj) {
						gEyeObj = new EyeObj();
						arryObjs.push(gEyeObj);
					}
					gEyeObj.position = json.points;
				}
			}

			if(gLayerToolBar)
				gLayerToolBar.refresh();
		}
	}
}


function onLoadedArena()
{
	canvas.deactivateAll().renderAll();
	gselectedObj = null;
	isCreatedArena = true;
	enablePolygonDraw();

	for(var i = 0; i < data_manager.loadedObjects.length; i++)
	{
		data_manager.loadedObjects[i].initialize();
	}
	canvas.renderAll();

	var tmpZoom = canvas.getZoom();
	sliderVal = tmpZoom * 10;
	m3DCreator.initPreview();
}

var selectionObjects = null;
var selectionGroup = null;
var patternImage = null;
var m3DCreator = null;




function deActiveObject()
{
	return;
}

function createdArena() {
}


function enablePolygonDraw() {
	$('#toolbar_pencil').removeClass('disable');
	$('#toolbar_shape').removeClass('disable');
	$('#toolbar_magic').removeClass('disable');
	$('#toolbar_wall').removeClass('disable');
	$('#toolbar_selection').removeClass('disable');
}
function disablePolygonDraw() {
	$('#toolbar_pencil').addClass('disable');
	$('#toolbar_shape').addClass('disable');
	$('#toolbar_magic').addClass('disable');
	$('#toolbar_wall').addClass('disable');
	$('#toolbar_selection').addClass('disable');
	$('#toolbar_scale').addClass('disable');
}

function removeArenaMap() {
	canvas.clear();

	gcreatedObjs = [];
	gselectedObj = null;

	localStorage.clear();
	localforage.clear(function(){
	});
	garena = null;

	disablePolygonDraw();

	canvas.renderAll();
}

function clearResizePoints() {
	if(gresizepoints != null)
	{
		for(var i = gresizepoints.length - 1; i >= 0 ; i--)
		{
			canvas.remove(gresizepoints[i]);
		}
	}

	gresizepoints = null;
}

function drawPattern(left, top, absPoints, width, angle, paddingX, paddingY, fabric_pattern)
{
	patternImage.scaleToWidth(width);

	var patternSourceCanvas = new fabric.StaticCanvas();
	patternSourceCanvas.add(patternImage);

	var pattern = new fabric.Pattern(
	{
		source: function()
		{
			patternSourceCanvas.setDimensions(
			{
				width: patternImage.getWidth() + paddingX - width,
				height: patternImage.getHeight() + paddingY - width
			});
			return patternSourceCanvas.getElement();
		},
		repeat: 'repeat'
	});

	pattern.offsetX = width / 2;
	pattern.offsetY = -width / 2;

	var cos = Math.cos(-angle);
	var sin = Math.sin(-angle);
	var newRotations = [];
	for(var i = 0; i < absPoints.length; i++)
	{
		var point = absPoints[i];
		var dx = point.x * cos - point.y * sin;
		var dy = point.x * sin + point.y * cos;
		newRotations.push({x:dx, y:dy});
	}

	var temp_polygon = new fabric.Polygon(newRotations,
	{
		left: left,
		top: top,
		angle: 0,
		fill: 0xff00ff,
		objectCaching: false,
		selectable: false,
		hasControls: false,
		evented: false,
		centeredRotation: true,
		hasBorders: false,
	});

	// var absX1 = object.blockshape.minX + object.blockshape.points[0].x;
	// var absY1 = object.blockshape.minY + object.blockshape.points[0].y;
	// var absX1 = object.blockshape.points[0].x;
	// var absY1 = object.blockshape.points[0].y;
	var absX1 = absPoints[0].x - left;
	var absY1 = absPoints[0].y - top;
	var absX2 = -temp_polygon.minX + temp_polygon.points[0].x;
	var absY2 = -temp_polygon.minY + temp_polygon.points[0].y;
	var xx = absX1 - absX2;
	var yy = absY1 - absY2;

	var temp_x = absX2;
	var temp_y = absY2;
	var offsetX = temp_x * Math.cos(angle) - temp_y * Math.sin(angle) - absX2;
	var offsetY = temp_x * Math.sin(angle) + temp_y * Math.cos(angle) - absY2;

	var polygon = new fabric.Polygon(newRotations,
	{
		left: left - offsetX + xx,
		top: top - offsetY + yy,
		// left: left,
		// top: top,
		angle: angle * 180 / Math.PI,
		fill: pattern,
		objectCaching: false,
		selectable: false,
		hasControls: false,
		evented: false,
		centeredRotation: true,
		hasBorders: false,
	});
	canvas.add(polygon);
	delete temp_polygon;
	temp_polygon = null;

	canvas.renderAll();
	return polygon;
};

function modifiedObject(obj)
{
	m3DCreator.modify3DObject(obj);
}

function clearObject(obj)
{
	if(obj == null)
		return;
	var tmp = gselectedObj;
	gselectedObj = null;
	if(tmp.type == 'BlockObj' || tmp.type == 'ShapeObj' || tmp.type == 'WallObj' || tmp.type == 'LightObj') {
		tmp.blockshape.stroke = gcolor_blockborder;
		tmp.doNotShowSeats();
		clearResizePoints();
		tmp.hideProperty();
	}
	else if(tmp.type == 'EyeObj')
	{
		tmp.hideProperty();
	}
	tmp = null;
}



function CProperty()
{
	var main = this;
	this.isVisible2D = true;
	this.isVisible3D = true;
	this.title = '';
	this.tags = '';
	
	this.init = function()
	{

	}

	this.init();
}

function CImageProperty()
{
	var main = this;
	this.repeat = false;
	this.xPos = 0;
	this.yPos = 0;
	this.rows = 1;
	this.cols = 1;
	this.flipX = false;
	this.flipY = false;
	this.imagePath = "";
	
	this.init = function()
	{

	}

	this.init();
}

function CLightProperty()
{
	this.isHideVolumetric = false;
	this.isHideLightBlock = false;
	this.targetPos = {
		x: 0,
		y: 0,
	};
	this.targetRadius = 50;
	this.attenuation = 1000;
	this.anglePower = 1.2;

	this.copy = function(obj) {
		if(typeof(obj.isHideVolumetric) != 'undefined')
			this.isHideVolumetric = obj.isHideVolumetric;
		if(typeof(obj.isHideLightBlock) != 'undefined')
			this.isHideLightBlock = obj.isHideLightBlock;
		this.targetPos.x = obj.targetPos.x;
		this.targetPos.y = obj.targetPos.y;
		if(typeof(obj.targetRadius) != 'undefined')
			this.targetRadius = obj.targetRadius;
		if(typeof(obj.attenuation) != 'undefined')
			this.attenuation = obj.attenuation;
		if(typeof(obj.anglePower) != 'undefined')
			this.anglePower = obj.anglePower;
	}
}

function CHistoryMan()
{
	var main = this;
	var current;
	var mLstHist = [];
	var state = [];
	var curIndex = -1;
	var index2 = 0;
	var action = false;
	var refresh = true;

	this.init = function()
	{
	}

	this.addState = function(key, object)
	{
		mLstHist.splice(-1, mLstHist.length - curIndex - 1);
		curIndex++;
		var data = {};
		data.key = key;
		data.object = object;
		data.state = object.getCurState();
		mLstHist[curIndex] = data;
		if(curIndex > 0)
			$('#toolbar_undo').removeClass('disable');
		else
			$('#toolbar_undo').addClass('disable');
		$('#toolbar_redo').addClass('disable');
	}

	this.undo = function()
	{
		if(curIndex > 0)
		{
			var lastData1 = mLstHist[curIndex];
			curIndex--;
			// var lastData2 = mLstHist[curIndex];
			// var lastState = JSON.parse(lastData2.state);

			if(lastData1.key == 'add')
			{
				lastData1.object.deleteObj();
			}
			else if(lastData1.key == 'hide_2d')
			{
				var lastState;
				for(var i = curIndex; i >= 0; i--)
				{
					if(mLstHist[i].object == lastData1.object)
					{
						lastState = JSON.parse(mLstHist[i].state);
						break;
					}
				}
				if(lastState)
				{
					lastData1.object.setVisible(lastState.visible);
					if(lastState.visible)
						canvas.setActiveObject(lastData1.object.blockshape);
				}
			}
			else if(lastData1.key == 'hide_3d')
			{
			}
			else if(lastData1.key == 'remove' || lastData1.key == 'move' || lastData1.key == 'modify' || lastData1.key == 'change')
			{
				var lastState;
				for(var i = curIndex; i >= 0; i--)
				{
					if(mLstHist[i].object == lastData1.object)
					{
						lastState = JSON.parse(mLstHist[i].state);
						break;
					}
				}
				if(lastState)
				{
					lastData1.object.resetObject(lastState);
					canvas.setActiveObject(lastData1.object.blockshape);
					m3DCreator.modify3DObject(lastData1.object);
				}
			}
			canvas.renderAll();
		}
		if(curIndex > 0)
			$('#toolbar_undo').removeClass('disable');
		else
			$('#toolbar_undo').addClass('disable');
		if(mLstHist.length > 0)
			$('#toolbar_redo').removeClass('disable');
	}

	this.redo = function()
	{
	    if(curIndex >= mLstHist.length - 1)
	    {
	        return;
	    }

		// var lastData1 = mLstHist[curIndex];
	   	curIndex++;
		var lastData2 = mLstHist[curIndex];
		var lastState = JSON.parse(lastData2.state);

		if(lastData2.key == 'remove')
		{
			lastData2.object.deleteObj();
		}
		else if(lastData2.key == 'hide_2d')
		{
			var nextState;
			for(var i = curIndex; i < mLstHist.length; i++)
			{
				if(mLstHist[i].object == lastData2.object)
				{
					nextState = JSON.parse(mLstHist[i].state);
					break;
				}
			}
			if(nextState)
			{
				lastData2.object.setVisible(lastState.visible);
				if(lastState.visible)
					canvas.setActiveObject(lastData2.object.blockshape);
			}
		}
		else if(lastData2.key == 'hide_3d')
		{
		}
		else if(lastData2.key == 'add' || lastData2.key == 'move' || lastData2.key == 'modify' || lastData2.key == 'change')
		{
			var nextState;
			for(var i = curIndex; i < mLstHist.length; i++)
			{
				if(mLstHist[i].object == lastData2.object)
				{
					nextState = JSON.parse(mLstHist[i].state);
					break;
				}
			}
			if(nextState)
			{
				lastData2.object.resetObject(lastState);
				canvas.setActiveObject(lastData2.object.blockshape);
				m3DCreator.modify3DObject(lastData2.object);
			}
		}
		canvas.renderAll();

		if(curIndex > 0)
			$('#toolbar_undo').removeClass('disable');
		else
			$('#toolbar_undo').addClass('disable');
		if(curIndex >= mLstHist.length - 1)
			$('#toolbar_redo').addClass('disable');
		else
			$('#toolbar_redo').removeClass('disable');
	}

	this.init();
}





var g_wallImage;
var g_blockImage;
var g_lightImage;
$(document).ready(function()
{
	g_wallImage = new CImageUploader('wallobj_bgImage');
	g_wallImage.btn_rotate_image.hide();
	g_blockImage = new CImageUploader('blockobj_bgImage');
	g_lightImage = new CImageUploader('lightobj_bgImage');
})

function CImageUploader(div_name)
{
	var main = this;
	this.view = $('#' + div_name);

	this.btn_set_image;
	this.btn_rotate_image;
	this.btn_reset_image;
	this.checkbox;
	this.text_posx;
	this.text_posy;
	this.text_rownum;
	this.text_colnum;
	
	this.init = function()
	{
		this.initElement();
		this.initEvent();
		this.setMode(false);
	}

	this.initElement = function()
	{
		this.view.empty();
		this.view.addClass('image_upload');
		var html = '<section>\
						<label class="split-form__label">Mapping</label>\
						<button class="btn_small pull_right btn_reset_image" id="btn_wallobj_image_reset" style="margin-left: 2px;">X</button>\
						<button class="btn_small pull_right btn_background_image" style="width:80px;">Image</button>\
					</section>\
					<div class="arrange_option">\
						<section>\
							<label class="split-form__label">No Repeat</label>\
							<input type="checkbox" class="split-form__input property_check check_image_repeat">\
						</section>\
						<ul id="view_no_repeat">\
							<li class="">\
								<label class="split-form__label">x offset (0~1)</label>\
								<input type="number" id="text_posX" class="split-form__input" placeholder="">\
							</li>\
							<li class="">\
								<label class="split-form__label">y offset (0~1)</label>\
								<input type="number" id="text_posY" class="split-form__input" placeholder="">\
							</li>\
						</ul>\
						<ul id="view_repeat">\
							<li class="">\
								<label class="split-form__label">row</label>\
								<input type="number" id="text_row_num" class="split-form__input" placeholder="">\
							</li>\
							<li class="">\
								<label class="split-form__label">col</label>\
								<input type="number" id="text_col_num" class="split-form__input" placeholder="">\
							</li>\
						</ul>\
					</div>\
					<div class="image_buttons">\
						<button class="btn_small pull_right btn_image_flipX" style="margin-left: 2px;">FlipX</button>\
						<button class="btn_small pull_right btn_image_flipY" style="margin-left: 2px;">FlipY</button>\
						<button class="btn_small pull_right btn_rotate_image" style="margin-left: 2px;">Rotate 90</button>\
					</div>';
		this.view.append(html);
		this.btn_set_image = this.view.find('.btn_background_image');
		this.btn_reset_image = this.view.find('.btn_reset_image');
		this.checkbox = this.view.find('.check_image_repeat');
		// this.view.find('.check_image_repeat').prop('checked', true);
		this.text_posx = this.view.find('#text_posX');
		this.text_posy = this.view.find('#text_posY');
		this.text_rownum = this.view.find('#text_row_num');
		this.text_colnum = this.view.find('#text_col_num');
		this.btn_img_flipX = this.view.find('.btn_image_flipX');
		this.btn_img_flipY = this.view.find('.btn_image_flipY');
		this.btn_rotate_image = this.view.find('.btn_rotate_image');
	}

	this.setValues = function()
	{
		var imgProp = gselectedObj.imgProp;
		this.checkbox.prop('checked', !imgProp.repeat);
		this.text_posx.val(imgProp.xPos);
		this.text_posy.val(imgProp.yPos);
		this.text_rownum.val(imgProp.rows);
		this.text_colnum.val(imgProp.cols);
		this.setMode(imgProp.repeat);
	}

	this.initEvent = function()
	{
		this.btn_set_image.click(function()
		{
			$('#mapping_imgupload').click();
		});

		this.btn_reset_image.click(function()
		{
			gselectedObj.setImageBackground(null);
		});

		this.checkbox.click(function()
		{
			var isRepeat = !$(this).prop('checked');
			main.setMode(isRepeat);
			if(gselectedObj != null && gselectedObj.bgImagePath)
			{
				gselectedObj.imgProp.repeat = isRepeat;
				m3DCreator.modify3DObject(gselectedObj);
			}
		});

		this.text_posx.keypress(function(e)
		{
			if(e.which == 13)  // the enter key code
			{
				if(gselectedObj != null && gselectedObj.bgImagePath)
				{
					gselectedObj.imgProp.xPos = parseFloat($(this).val());
					m3DCreator.modify3DObject(gselectedObj);
				}
			}	
		});
		this.text_posy.keypress(function(e)
		{
			if(e.which == 13)  // the enter key code
			{
				if(gselectedObj != null && gselectedObj.bgImagePath)
				{
					gselectedObj.imgProp.yPos = parseFloat($(this).val());
					m3DCreator.modify3DObject(gselectedObj);
				}
			}	
		});
		this.text_rownum.keypress(function(e)
		{
			if(e.which == 13)  // the enter key code
			{
				if(gselectedObj != null && gselectedObj.bgImagePath)
				{
					gselectedObj.imgProp.rows = parseInt($(this).val());
					m3DCreator.modify3DObject(gselectedObj);
				}
			}	
		});
		this.text_colnum.keypress(function(e)
		{
			if(e.which == 13)  // the enter key code
			{
				if(gselectedObj != null && gselectedObj.bgImagePath)
				{
					gselectedObj.imgProp.cols = parseInt($(this).val());
					m3DCreator.modify3DObject(gselectedObj);
				}
			}
		});

		this.btn_img_flipX.click(function()
		{
			if(gselectedObj.bgImagePath)
			{
				gselectedObj.setImageFlpX();
				canvas.renderAll();
			}
		})
		
		this.btn_img_flipY.click(function()
		{
			if(gselectedObj.bgImagePath)
			{
				gselectedObj.setImageFlpY();
				canvas.renderAll();
			}
		})

		this.btn_rotate_image.click(function()
		{
			if(gselectedObj.bgImagePath)
			{
				gselectedObj.rotateBgImage();
				canvas.renderAll();
			}
		})
	}

	this.setMode = function(isRepeat)
	{
		if(isRepeat)
		{
			$('.image_upload #view_repeat').show();
			$('.image_upload #view_no_repeat').hide();
		}
		else
		{
			$('.image_upload #view_repeat').hide();
			$('.image_upload #view_no_repeat').show();
		}
	}

	this.init();
}


function generateFileNameWithTime() {
	var date = new Date();
	return "" + 
		date.getFullYear() + '_' + 
		(date.getMonth() + 1) + '_' + 
		date.getDate() + '_' + 
		date.getHours() + '_' + 
		date.getMinutes() + '_' + 
		date.getSeconds() + 
		"";
}