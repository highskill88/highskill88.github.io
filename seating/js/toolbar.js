
function initToolBarDraw()
{
	$('.toolbar_item').click(function()
	{
		if($(this).attr('id') != 'toolbar_selection') {
			$('.toolbar_item').removeClass('active');
			$(this).addClass('active');
		}
	});

	//Pencil Object
	$('#toolbar_pencil').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'pencil';
		canvas.defaultCursor = 'url(images/pencil.cur) 0 0, crosshair';
		canvas.selection = false;

		showBlockPointsProperty();

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder;
			clearResizePoints();
		}
		
		clearObject(gselectedObj);
		
		gselectedObj = null;
		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();

		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
			gcreatedObjs[i].blockshape.selectable = false;

	});

	//Wall Object
	$('#toolbar_wall').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'wall';
		canvas.defaultCursor = 'url(images/pencil.cur) 0 0, crosshair';
		canvas.selection = false;

		showBlockPointsProperty();

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj' || gselectedObj.type == 'WallObj' || gselectedObj.type == 'LightObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder;
			clearResizePoints();
		}
		clearObject(gselectedObj);
		
		gselectedObj = null;
		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();

		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
			gcreatedObjs[i].blockshape.selectable = false;
	});

	//Light Object
	$('#toolbar_light').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'light';
		canvas.defaultCursor = 'url(images/pencil.cur) 0 0, crosshair';
		canvas.selection = false;

		showBlockPointsProperty();

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj' || gselectedObj.type == 'WallObj' || gselectedObj.type == 'LightObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder;
			clearResizePoints();
		}
		
		clearObject(gselectedObj);
		
		gselectedObj = null;
		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();

		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
			gcreatedObjs[i].blockshape.selectable = false;
	});

	//Shape Object
	$('#toolbar_shape').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'shape';
		canvas.defaultCursor = 'url(images/pencil.cur) 0 0, crosshair';
		canvas.selection = false;

		showBlockPointsProperty();

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj' || gselectedObj.type == 'WallObj' || gselectedObj.type == 'LightObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder;
			clearResizePoints();
		}
		clearObject(gselectedObj);
		
		gselectedObj = null;
		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();

		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
			gcreatedObjs[i].blockshape.selectable = false;
	});

	//Magic Object
	$('#toolbar_magic').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'magic';
		canvas.defaultCursor = 'url(images/magic.cur) 8 8, crosshair';
		canvas.selection = false;

		showBlockPointsProperty();

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
			canvas.renderAll();
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj' || gselectedObj.type == 'WallObj' || gselectedObj.type == 'LightObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder
			clearResizePoints();
		}
		clearObject(gselectedObj);
		
		gselectedObj = null;

		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();

		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
			gcreatedObjs[i].blockshape.selectable = false;
	});

	//Selection Object
	$('#toolbar_selection').click(function()
	{
		if(!isCreatedArena) return;

		gselectedtool = 'selection'; 
		canvas.defaultCursor = 'default';

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
			canvas.renderAll();
		}

		if(gselectedObj != null && (gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj')) {
			gselectedObj.blockshape.stroke = gcolor_blockborder
			clearResizePoints();
		}
		clearObject(gselectedObj);
		
		gselectedObj = null;

		if(selectionObjects && selectionObjects.length > 0)
			deActiveObject();
		canvas.deactivateAll().renderAll();

		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			if(gcreatedObjs[i].selectable)
				gcreatedObjs[i].blockshape.selectable = true;
		}
		// if(gWallObj)
		// 	gWallObj.blockshape.selectable = false;
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			canvas.selection = false;
		}
		else {
			$(this).addClass('active');
			canvas.selection = true;
		}
	});

	//Selection Object
	$('#toolbar_scale').click(function()
	{
		if(gselectedObj == null)
		{
			$(this).removeClass('active');
			return;
		}
		if(!isCreatedArena) return;

		gselectedtool = 'scale'; 
		canvas.defaultCursor = 'default';

		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
			canvas.renderAll();
		}

		gselectedObj.blockshape.borderColor = '#ff0000';
		gselectedObj.blockshape.cornerColor = '#ff0000';
		gselectedObj.blockshape.lockUniScaling = false;
		gselectedObj.blockshape.lockRotation = true;
		gselectedObj.blockshape.selectable = true;
		gselectedObj.blockshape.hasControls = true;
		gselectedObj.blockshape.hasBorders = true;
		canvas.renderAll();
	});

	// $(document).on('mouseenter', '#toolbar_selection', function()
	// {
	// 	$('#dlg_selection').show();
	// })
	// $(document).on('mouseover', '#toolbar_selection', function()
	// {
	// 	$('#dlg_selection').hide();
	// })
	$('#toolbar_selection').mouseenter(function()
	{
		// $('#dlg_selection').show();
	})

	$('#toolbar_options').click(function()
	{
		$(this).removeClass('active');
		$('#option_dlg #chair_space').val(g_appOptions.chairSpace);
		$('#option_dlg #line_space').val(g_appOptions.lineSpace);
		$('#option_dlg #chair_size').val(g_appOptions.chairSize);
		// $('#option_dlg #color_floor').val(g_appOptions.colorFloor);
		$('#option_dlg #color_floor').css('background-color', g_appOptions.colorFloor);
		$('#option_dlg #color_floor').ColorPickerSetColor(g_appOptions.colorFloor);

		$('#option_dlg #color_mainlight').css('background-color', g_appOptions.lightColor);
		$('#option_dlg #color_mainlight').ColorPickerSetColor(g_appOptions.lightColor);
		$('#option_dlg #mainlight_intensity').val(g_appOptions.lightIntensity);

		hideAllProperty();
		dlgOption = $('#option_dlg');
		xxx = gDrawBoard.offset().left + gDrawBoard.width() - 40- dlgOption.width();
		yyy = gDrawBoard.offset().top + 10;
		dlgOption.css('left', xxx);
		dlgOption.css('top', yyy);
		dlgOption.show();
	})

	// $('#toolbar_eye').click(function()
	// {
	// 	gselectedtool = 'eye';
	// 	if(gselectedObj && gselectedObj.type == 'BlockObj')
	// 	{
	// 		hideAllProperty();
	// 		dlgOption = $('#dlg_setting_eye');
	// 		xxx = gDrawBoard.offset().left + gDrawBoard.width() - 40- dlgOption.width();
	// 		yyy = gDrawBoard.offset().top + 10;
	// 		dlgOption.css('left', xxx);
	// 		dlgOption.css('top', yyy);

	// 		var center_z = gselectedObj.baseheight + (gselectedObj.layerheight + 1) * gselectedObj.fabriclines.length * 0.5 + 1.0;
	// 		$('#dlg_setting_eye #eye_height').val(center_z);
	// 		$('#dlg_setting_eye').show();
	// 		// m3DCreator.selectedCameraObject(gselectedObj);
	// 	}
	// 	// disablePolygonDraw();
	// 	// canvas.defaultCursor = 'crosshair';
	// 	// resetCanvasSelection();
	// 	// $(this).css('background-color', '#2196F3');
	// });

	function resetCanvasSelection()
	{
		// canvas.defaultCursor = 'default';
		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
			canvas.renderAll();
		}
		canvas.deactivateAll();
		clearObject(gselectedObj);
		canvas.renderAll();
	}
	$('#toolbar_eye').draggable(
	{
		// revert: "invalid",
		// stack: ".draggable",
		snap: true,
		helper: "clone",
		stop: function(e)
		{
			if(gEyeObj == null)
				gEyeObj = new EyeObj(e.pageX, e.pageY - 100);
			else
				gEyeObj.setPosition(e.pageX, e.pageY - 100);
			$(this).removeClass('active');
		}
	});

	$('#toolbar_undo').click(function()
	{
		if(!$(this).hasClass('disable'))
			g_historyMan.undo();
		$(this).removeClass('active');
	})

	$('#toolbar_redo').click(function()
	{
		if(!$(this).hasClass('disable'))
			g_historyMan.redo();
		$(this).removeClass('active');
	})
}

function initDrawingObject()
{
	//Block Points
	$('#btn_blockpoints_create').click(function()
	{
		if(gselectedtool == 'wall')
		{
			if(gblockpoints.length < 2)
				return;
		}
		else
		{
			if(gblockpoints.length < 3)
				return;
		}
		
		var tmpZoom = canvas.getZoom();
		gtempblockobj._calcDimensions();
		// gtempblockobj.points;
		var points = [];//gtempblockobj.points;
		for(var i = 0; i < gblockpoints.length - 1; i++)
		{
			points.push({x: gblockpoints[i].x + canvas.viewportTransform[4],
				y: gblockpoints[i].y + canvas.viewportTransform[5]});
		}
		points.push({x: gblockpoints[i].x, y: gblockpoints[i].y})

		if(points.length >= 4 && (gselectedtool == 'pencil' || gselectedtool == 'shape' || gselectedtool == 'wall' || gselectedtool == 'light'))
			points.splice(points.length - 1, 1);

		if(gselectedtool == 'shape' && points.length >= 3)
		{
			var obj = new ShapeObj(gcreatedObjs.length, points);
			obj.callbackModified = m3DCreator.modify3DObject;
			// gcreatedObjs.push(obj);
			m3DCreator.addNew3DObject();
		}
		else if(gselectedtool == 'wall')
		{
			var obj = new WallObj(points);
			obj.callbackModified = m3DCreator.modify3DObject;
			// gcreatedObjs.push(obj);
			m3DCreator.addNew3DObject();
		}
		else if(gselectedtool == 'light')
		{
			var obj = new LightObj(gcreatedObjs.length, points);
			obj.callbackModified = m3DCreator.modify3DObject;
			// gcreatedObjs.push(obj);
			m3DCreator.addNew3DObject();
		}
		else
		{
			var obj = new BlockObj(points);
			obj.callbackModified = m3DCreator.modify3DObject;
			// gcreatedObjs.push(obj);
			m3DCreator.addNew3DObject();
		}

		gselectedtool = 'none';
		$('.toolbar_item').removeClass('active');
		canvas.defaultCursor = 'default';
		canvas.selction = false;
		$('#blockpoints').hide();

		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			if(gcreatedObjs[i].selectable)
				gcreatedObjs[i].blockshape.selectable = true;
		}

		canvas.setActiveObject(gcreatedObjs[gcreatedObjs.length - 1].blockshape);
		canvas.renderAll();

		points = [];

		if(gtempblockobj != null)
		{
			canvas.remove(gtempblockobj).renderAll();
			gtempblockobj = null;
		}
	});

	$('#btn_blockpoints_cancel').click(function() {
		if(gtempblockobj != null) {
			canvas.remove(gtempblockobj);
			gtempblockobj = null;
		}
		canvas.renderAll();

		gselectedtool = 'none';
		$('.toolbar_item').removeClass('active');
		canvas.defaultCursor = 'default';
		canvas.selction = false;
		$('#blockpoints').hide();

		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			if(gcreatedObjs[i].selectable)
				gcreatedObjs[i].blockshape.selectable = true;
		}
		// if(gWallObj)
		// 	gWallObj.blockshape.selectable = false;
	});
}


function initBlockObject()
{
	//Block Object
	$('#btn_blockobj_fliph').click(function() {
		gselectedObj.flipHoriz();
		m3DCreator.modify3DObject(gselectedObj);
    });
	$('#btn_blockobj_flipv').click(function() {
		gselectedObj.flipVert();
		m3DCreator.modify3DObject(gselectedObj);
    });
	$('#btn_blockobj_setaxis').click(function()
	{
		gselectedObj.isSettingAxis = true;
    });

    $('#btn_blockobj_delete').click(function() {
    	m3DCreator.remove3DObject(gselectedObj);
		g_historyMan.addState('remove', gselectedObj);
		// gcreatedObjs.splice($.inArray(gselectedObj, gcreatedObjs), 1);
		gselectedObj.deleteObj();
    });

    $('#blockobj_viewscore').keypress(function(e) {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null && gselectedObj.type == 'BlockObj')
				gselectedObj.viewscore = parseInt($(this).val());
		}
	});
    $('#blockobj_lineSpace').keypress(function (e) {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
				gselectedObj.changedParameters();
		}
	});
	$('#blockobj_seatspace').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#blockobj_showchair').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#blockobj_showlines').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#blockobj_showlabel').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#blockobj_showlabel_3d').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	// $('#blockobj_title').keypress(function (e) {
 //    	var key = e.which;
	// 	if(key == 13)  // the enter key code
	// 	{
	// 		if(gselectedObj != null)
	// 		{
	// 			gselectedObj.property.title = $(this).val();
	// 			gselectedObj.changedParameters();
	// 			m3DCreator.modify3DObject(gselectedObj);
	// 			gLayerToolBar.refresh();
	// 		}
	// 	}
	// });
	$('#blockobj_tags').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				gselectedObj.tags = $(this).val();
			}
		}
	});
	$('#blockobj_color').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.changedBackgroundColor('#' + hex);
			}
			$('#blockobj_color').css('background-color', '#' + hex);
		}
	});
	// $('#blockobj_linenumbertype').change(function() {
	// 	var type = $('#blockobj_linenumbertype').val();
	// 	if(gselectedObj != null)
	// 	{
	// 		gselectedObj.changedLineNumberType(type);
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#blockobj_row_char').keypress(function(e)
	{
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				gselectedObj.rowStart = $(this).val();
				gselectedObj.changedLineNumberType();
				m3DCreator.modify3DObject(gselectedObj);
			}
		}
	});
	// $('#blockobj_3dheight').change(function(e) {
	// 	if(gselectedObj != null)
	// 	{
	// 		var baseheight = parseFloat($(this).val());
	// 		gselectedObj.baseheight = baseheight;
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#blockobj_layer_height').change(function(e) {
		if(gselectedObj != null)
		{
			var layerheight = parseFloat($(this).val());
			gselectedObj.layerheight = layerheight;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#block_wall_front').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_front = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#block_wall_back').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_back = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#block_wall_left').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_left = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#block_wall_right').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_right = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	// $('#blockobj_seat_color').change(function() {
	// 	if(gselectedObj != null)
	// 	{
	// 		gselectedObj.seatColor = $(this).val();
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#blockobj_seat_color').ColorPicker({
		color: defaultSeatColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.seatColor = '#' + hex;
				m3DCreator.modify3DObject(gselectedObj, {seatColor: '#' + hex});
			}
			$('#blockobj_seat_color').css('background-color', '#' + hex);
		}
	});
	$('#blockobj_normal .btn_wallprop').click(function() {
		var section = $('#blockobj_normal .section_wall_prop');
		if(section.is(':visible'))
		{
			$(this).find('.show').show();
			$(this).find('.hide').hide();
			section.fadeOut();
		}
		else
		{
			$(this).find('.show').hide();
			$(this).find('.hide').show();
			section.fadeIn();
		}
		if(gselectedObj)
			m3DCreator.modify3DObject(gselectedObj);
	});
	$('#blockobj_raise').change(function() {
		var raiseHeight = parseFloat($(this).val());
		if(gselectedObj)
		{
			gselectedObj.raiseHeight = raiseHeight;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#blockobj_upstair').change(function() {
		var upstair = parseInt($(this).val());
		if(gselectedObj)
		{
			gselectedObj.upstair = upstair;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});

	// $('#btn_blockobj_image').click(function()
	// {
	// 	$('#mapping_imgupload').click();
	// });
}

function initLightObject()
{
 //    $('#lightobj_title').keypress(function(e)
 //    {
	// 	var key = e.which;
	// 	if(key == 13)  // the enter key code
	// 	{
	// 		if(gselectedObj != null)
	// 		{
	// 			gselectedObj.changedParameters();
	// 			gLayerToolBar.refresh();
	// 		}
	// 	}
	// });

	$('#slider_lightobj_vert_angle').slider({
		orientation: '',
		min		: 0,
		max		: 359,
		value	: 0,
		change	: function(event, ui)
		{
			sliderVal = ui.value;
			if(gselectedObj != null)
			{
				$('#text_lightobj_vert_angle').val(sliderVal);
				gselectedObj.angle_vertical = sliderVal;
				m3DCreator.modify3DObject(gselectedObj, { vert_angle: sliderVal });
			}
		}
	});
	$('#text_lightobj_vert_angle').keypress(function(e)
	{
		var key = e.which;
		if(key == 13)
		{
			if(gselectedObj != null && gselectedObj.isVertical)
			{
				var value = parseInt($(this).val());
				$('#slider_lightobj_vert_angle').slider('value', value);
				gselectedObj.angle_vertical = sliderVal;
				m3DCreator.modify3DObject(gselectedObj, { vert_angle: sliderVal });
			}
		}
	})

    $('#lightobj_linenumber').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#lightobj_cols').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#lightobj_showlight').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#lightobj_showlight_bulb').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#lightobj_reallight').change(function() {
		if(gselectedObj != null)
			gselectedObj.changedParameters();
	});
	$('#lightobj_vertical').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.changedParameters();
			if(gselectedObj.isVertical)
				$('#lightobj_vertical_angle').fadeIn();
			else
				$('#lightobj_vertical_angle').fadeOut();
		}
	});
	// $('#lightobj_backcolor').change(function() {
	// 	if(gselectedObj != null)
	// 	{
	// 		gselectedObj.changedBackgroundColor();
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#lightobj_backcolor').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.changedBackgroundColor('#' + hex);
				m3DCreator.modify3DObject(gselectedObj, {backColor: '#' + hex});
			}
			$('#lightobj_backcolor').css('background-color', '#' + hex);
		}
	});
	// $('#lightobj_baseheight').change(function(e) {
	// 	if(gselectedObj != null)
	// 	{
	// 		var baseheight = parseInt($(e.target).val());
	// 		gselectedObj.baseheight = baseheight;
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#lightobj_thickness').change(function(e) {
		if(gselectedObj != null)
		{
			var thickness = parseFloat($(e.target).val());
			gselectedObj.thickness = thickness;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_distance').change(function(e) {
		if(gselectedObj != null)
		{
			var lightDistance = parseFloat($(e.target).val());
			gselectedObj.lightDistance = lightDistance;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_intensity').change(function(e) {
		if(gselectedObj != null)
		{
			var intensity = parseFloat($(e.target).val());
			gselectedObj.intensity = intensity;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_range').change(function(e) {
		if(gselectedObj != null)
		{
			var range = parseFloat($(e.target).val());
			gselectedObj.range = range;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	// $('#lightobj_light_color').change(function() {
	// 	if(gselectedObj != null)
	// 	{
	// 		gselectedObj.lightColor = $(this).val();
	// 		gselectedObj.drawSeatLines();
	// 		canvas.renderAll();
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#lightobj_light_color').ColorPicker({
		color: defaultLightColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null) {
				gselectedObj.lightColor = '#' + hex;
				gselectedObj.drawSeatLines();
				canvas.renderAll();
				m3DCreator.modify3DObject(gselectedObj, { lightColor: {
					lightType: gselectedObj.lightType,
					isRealLight: gselectedObj.isRealLight,
					color: '#' + hex,
				}});
			}
			$('#lightobj_light_color').css('background-color', '#' + hex);
		}
	});

	$('#btn_lightobj_setaxis').click(function()
	{
		gselectedObj.isSettingAxis = true;
    });

	$('#lightobj_light_type').change(function()
	{
		var type = $(this).val();
		if(gselectedObj != null && gselectedObj.type == 'LightObj')
		{
			gselectedObj.lightType = type;
			gselectedObj.changedLightType();
			m3DCreator.modify3DObject(gselectedObj);
		}
	})


	$('#lightobj_showlight_volumetric').change(function(e)
	{
		if(gselectedObj)
		{
			gselectedObj.lightProperty.isHideVolumetric = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	})
	$('#lightobj_showlight_block').change(function(e)
	{
		if(gselectedObj)
		{
			gselectedObj.lightProperty.isHideLightBlock = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	})
	$('#lightobj_target_x').change(function(e) {
		if(gselectedObj != null)
		{
			gselectedObj.lightProperty.targetPos.x = parseFloat($(e.target).val());
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_target_y').change(function(e) {
		if(gselectedObj != null)
		{
			gselectedObj.lightProperty.targetPos.y = parseFloat($(e.target).val());
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_target_radius').change(function(e) {
		if(gselectedObj != null)
		{
			gselectedObj.lightProperty.targetRadius = parseFloat($(e.target).val());
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_attenuation').change(function(e) {
		if(gselectedObj != null)
		{
			gselectedObj.lightProperty.attenuation = parseFloat($(e.target).val());
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#lightobj_anglePower').change(function(e) {
		if(gselectedObj != null)
		{
			gselectedObj.lightProperty.anglePower = parseFloat($(e.target).val());
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
}

function initCommonControls()
{
    $('.text_object_title').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				var strTitle = $(this).val();
				gselectedObj.property.title = strTitle.slice(0);
				if(gselectedObj.type == 'BlockObj')
					gselectedObj.changedParameters();
				gLayerToolBar.refresh();
				m3DCreator.modify3DObject(gselectedObj);
			}
		}
	});
	
    $('.text_object_tags').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				var strTags = $(this).val();
				gselectedObj.property.tags = strTags.slice(0);
			}
		}
	});

	$('.text_object_3dheight').change(function(e)
	{
		if(gselectedObj != null)
		{
			var baseheight = parseFloat($(this).val());
			gselectedObj.baseheight = baseheight;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});

    $('.btn_object_delete').click(function() {
    	if(gselectedObj)
    	{
	    	m3DCreator.remove3DObject(gselectedObj);
			// gcreatedObjs.splice($.inArray(gselectedObj, gcreatedObjs), 1);
			gselectedObj.deleteObj();
		}
    });

	$('.btn_object_backwards').click(function(e)
	{
		if(gselectedObj)
		{
			// canvas.sendToBack(gselectedObj.blockshape);
			canvas.moveTo(gselectedObj.blockshape, 1);
			canvas.renderAll();
			gLayerToolBar.refresh();
		}
	})

	$('.btn_object_disable').click(function(e)
	{
		if(gselectedObj)
		{
			gselectedObj.blockshape.selectable = false;
			canvas.renderAll();
		}
	})

	$('.check_object_selectable').click(function(e)
	{
		if(gselectedObj)
		{
			var isCheck = $(this).is(':checked') ? true : false;
			gselectedObj.setSelectable(isCheck);
			if(gselectedObj.selectable == true && isCheck == false)
			{
				// canvas.deActiveObject(gselectedObj);
				canvas.moveTo(gselectedObj.blockshape, 1);
			}
			canvas.renderAll();
		}
	})

	$('.btn_object_wall_image_reset').click(function(e)
	{
		gselectedObj.handrail_img = null;
		m3DCreator.modify3DObject(gselectedObj);
	})
	$('#fileupload_wallmapping').fileupload(
	{
		url: "server/",
		dataType: 'json',
		done: function(e, data)
		{
			var file = data.result.files[0];
			if(!file)
				return;
			var newUrl = "server/files/open_files/" + file.name;
			jQuery.get(newUrl, function(data) {
				if(gselectedObj.type == 'BlockObj' || gselectedObj.type == 'ShapeObj')
				{
					gselectedObj.handrail_img = newUrl;
					m3DCreator.modify3DObject(gselectedObj);
				}
			});
		}
	});

	$('.text_object_wall_height').keypress(function(e)
	{
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				gselectedObj.handrail_height = parseFloat($(this).val());
				m3DCreator.modify3DObject(gselectedObj);
			}
		}
	})
}


function initShapeObject()
{
	//Shape Object
 //    $('#shapeobj_title').keypress(function(e)
 //    {
	// 	var key = e.which;
	// 	if(key == 13)  // the enter key code
	// 	{
	// 		if(gselectedObj != null)
	// 		{
	// 			gselectedObj.property.title = $(this).val();
	// 			gselectedObj.changedParameters();
	// 			// gLayerToolBar.refresh();
	// 		}
	// 	}
	// });
	$('#blockobj_tags').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				gselectedObj.tags = $(this).val();
			}
		}
	});
	$('#btn_shapeobj_fliph').click(function() {
		gselectedObj.flipHoriz();
		m3DCreator.modify3DObject(gselectedObj);
    });
	$('#btn_shapeobj_flipv').click(function() {
		gselectedObj.flipVert();
		m3DCreator.modify3DObject(gselectedObj);
    });
	$('#btn_shapeobj_splite').click(function() {
		var nBloks = gselectedObj.spliteShapeToBlock();
		if(nBloks > 0)
		{
    		m3DCreator.remove3DObject(gselectedObj);
			// gcreatedObjs.splice($.inArray(gselectedObj, gcreatedObjs), 1);
			gselectedObj.deleteObj();
			m3DCreator.addNew3DObjects(nBloks);
		}
    });
    $('#btn_shapeobj_delete').click(function() {
    	m3DCreator.remove3DObject(gselectedObj);
		// gcreatedObjs.splice($.inArray(gselectedObj, gcreatedObjs),1);
		gselectedObj.deleteObj();
    });

    $('#shapeobj_lineSpace').keypress(function(e) {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#shapeobj_rows').keypress(function (e) {
		// var rows = parseInt($(e.target).val());
		// if(rows > 50)
		// 	$(e.target).val(50);

    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#shapeobj_row_char').keypress(function(e)
	{
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null)
			{
				gselectedObj.rowStart = $(this).val();
				m3DCreator.modify3DObject(gselectedObj);
			}
		}
	});
	$('#shapeobj_seatspace').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#shapeobj_splitespace').keypress(function (e) {
    	var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	$('#shapeobj_showlines').change(function() {
		if(gselectedObj != null) gselectedObj.changedParameters();
	});
	// $('#shapeobj_color').change(function() {
	// 	if(gselectedObj != null) gselectedObj.changedBackgroundColor();
	// });
	$('#shapeobj_color').ColorPicker({
		color: '#ffffff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.changedBackgroundColor('#' + hex);
			}
			$(this).css('background-color', '#' + hex);
		}
	});
	// $('#shapeobj_3dheight').change(function(e) {
	// 	if(gselectedObj != null)
	// 	{
	// 		var baseheight = parseInt(gselectedObj.obj3DBaseHeight.val());
	// 		gselectedObj.baseheight = baseheight;
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#shapeobj_3dLayerheight').change(function(e) {
		if(gselectedObj != null)
		{
			var layerheight = parseFloat($(this).val());
			gselectedObj.layerheight = layerheight;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#shapeobj_wall_front').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_front = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#shapeobj_wall_back').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_back = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#shapeobj_wall_left').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_left = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	$('#shapeobj_wall_right').change(function() {
		if(gselectedObj != null)
		{
			gselectedObj.wall_right = $(this).is(':checked') ? true : false;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
	// $('#shapeobj_seat_color').change(function() {
	// 	if(gselectedObj != null)
	// 	{
	// 		gselectedObj.seatColor = $(this).val();
	// 		m3DCreator.modify3DObject(gselectedObj);
	// 	}
	// });
	$('#shapeobj_seat_color').ColorPicker({
		color: defaultSeatColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.seatColor = '#' + hex;
				m3DCreator.modify3DObject(gselectedObj, {seatColor: '#' + hex});
			}
			$('#shapeobj_seat_color').css('background-color', '#' + hex);
		}
	});
	$('#shapeobj_normal .btn_wallprop').click(function() {
		var section = $('#shapeobj_normal .section_wall_prop');
		if(section.is(':visible'))
		{
			$(this).find('.show').show();
			$(this).find('.hide').hide();
			section.fadeOut();
		}
		else
		{
			$(this).find('.show').hide();
			$(this).find('.hide').show();
			section.fadeIn();
		}
		if(gselectedObj)
			m3DCreator.modify3DObject(gselectedObj);
	});

	$('#shapeobj_raise').change(function() {
		var raiseHeight = parseFloat($(this).val());
		if(gselectedObj)
		{
			gselectedObj.raiseHeight = raiseHeight;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});

	$('#shapeobj_upstair').change(function() {
		var upstair = parseInt($(this).val());
		if(gselectedObj)
		{
			gselectedObj.upstair = upstair;
			m3DCreator.modify3DObject(gselectedObj);
		}
	});
}


function initArenaObject()
{
	//Arena Map Image
	$('#toolbar_image').click(function()
	{
		gselectedtool = 'none';
		$('.toolbar_item').removeClass('active');
		canvas.defaultCursor = 'default';
		$('#imagelinkvalue').click();
	});
	
	var imagelinkvalue = document.getElementById("imagelinkvalue");
	if(imagelinkvalue) {
		imagelinkvalue.onchange = function()
		{
			if(this.value != '')
			{
				removeArenaMap();

				$('#arena_creating').hide();
				//progress bar
				$('#uploadprogressbar').css('width', '0');
				var progressModal = document.getElementById('progressModal');
				progressModal.style.display = "block";

				var obj =  new FormData(document.getElementById('SeatMapArenaUpload'));
				$.ajax({
				    url     :   'uploadarena.php',
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
							$('#imagelinkvalue').wrap('<form>').closest('form').get(0).reset();
							$('#imagelinkvalue').unwrap();

					        if(retData == '0'){
								alert('error - uploading map image');

								var progressModal = document.getElementById('progressModal');
								progressModal.style.display = "none";
					            //Oops! Some error occured during Image submission. Please try again later.
					            return;
					        }

					        //Image submitted successfully
							//console.log('uploaded url:' + retData);
							garena = new ArenaObj(retData, null, onLoadedArena);
						}
				    },
				    error   :   function(){
				        //'Oops! Some error occured during Image submission. Please try again later.'
				        //reset input file
						$('#imagelinkvalue').wrap('<form>').closest('form').get(0).reset();
						$('#imagelinkvalue').unwrap();
				    }
				});
			}
	    };
	}

	$('#btn_arena_create').click(function() {
		garena.createOk();
		isCreatedArena = true;

		enablePolygonDraw();
	});
	$('#arena_creating_cancel').click(function() {
		garena.deleteObj();
		garena = null;
		isCreatedArena = false;

		disablePolygonDraw();
	});
}

function initOption()
{
	$('#option_dlg .btn_dlg_ok').click(function()
	{
		g_appOptions.chairSpace = parseFloat($('#option_dlg #chair_space').val());
		g_appOptions.lineSpace = parseFloat($('#option_dlg #line_space').val());
		g_appOptions.chairSize = parseFloat($('#option_dlg #chair_size').val());
		// g_appOptions.colorFloor = $('#option_dlg #color_floor').val();
		g_appOptions.saveOption();

		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			var obj = gcreatedObjs[i];
			if(obj.type == 'BlockObj' || obj.type == 'ShapeObj')
			{
				obj.changeOption(g_appOptions.chairSpace, g_appOptions.lineSpace);
			}
		}
		m3DCreator.changeAllObjectSetting();
	})

	$('#option_dlg #chair_size').keypress(function(e)
	{
		if(e.which == 13)  // the enter key code
		{
			g_appOptions.chairSize = parseFloat($('#option_dlg #chair_size').val());
			m3DCreator.changeAllChairSize(g_appOptions.chairSize);
		}
	})
	$('#option_dlg #color_floor').ColorPicker(
	{
		color: g_appOptions.colorFloor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			g_appOptions.colorFloor = '#' + hex;
			$('#option_dlg #color_floor').css('backgroundColor', '#' + hex);
			m3DCreator.changeFloorColor('#' + hex);
		}
	});

	$('#option_dlg #color_mainlight').ColorPicker(
	{
		color: g_appOptions.lightColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			g_appOptions.lightColor = '#' + hex;
			$('#option_dlg #color_mainlight').css('backgroundColor', '#' + hex);
			m3DCreator.changeLightMain('#' + hex, g_appOptions.lightIntensity);
		}
	});

	$('#option_dlg #mainlight_intensity').keypress(function(e)
	{
		if(e.which == 13)  // the enter key code
		{
			g_appOptions.lightIntensity = parseFloat($(this).val());
			m3DCreator.changeLightMain(g_appOptions.lightColor, g_appOptions.lightIntensity);
		}
	})

	$('#option_dlg .btn_dlg_close').click(function()
	{
		$('#option_dlg').hide();
	})

	$('#option_dlg #ceiling_check').click(function()
	{
		g_appOptions.isCeiling = $(this).is(':checked') ? true : false;
		if(g_appOptions.isCeiling)
		{
			var ceiling = new BlockObj();
			ceiling.callbackModified = m3DCreator.modify3DObject;
			var json = {};
			var w = garena.width;
			var h = garena.height;
			json.points = [
				{x:0, y:0},
				{x:w, y:0},
				{x:w, y:h},
				{x:0, y:h},
			];
			json.property = {
				index: 0,
				lineSpace: 10,
				rows: 1,
				seatspace: 1,
				showlines: false,
				showlines: false,
				baseheight: 200,
				layerheight: 0.1,
				color: '#ffffff',
				splitespace: 0,
				axisindex: 0,
				wall_front: false,
				wall_back: false,
				wall_left: false,
				wall_right: false,
				seatColor: '#ffffff',
				upstair: 0,
				bgImagePath: null,
				title: '',
			}
			json.type = 'BlockObj';
			ceiling.createFromJson(canvas, json);
			// gcreatedObjs.push(ceiling);
			canvas.renderAll();
		}
	})
}

function initEyeSetting()
{
    $('#dlg_setting_eye #eye_height').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			// if(gselectedObj != null)
			// {
			// 	m3DCreator.setCameraHeight($(e.target).val());
			// }
			if(gEyeObj)
				gEyeObj.setTargetPosition();
		}
	});
	// $('#dlg_setting_eye #eye_height').change(function()
	// {
	// 	m3DCreator.selectedCameraObject(gselectedObj);
	// })
	$('#dlg_setting_eye .btn_dlg_ok').click(function()
	{
			// var center_x = garena.width * 0.5 + garena.imgObj.originalLeft;
			// var center_y = garena.height * 0.5 + garena.imgObj.originalTop;
			// var tmpZoom = canvas.getZoom();
			// g_stage_pos.x = pointx / tmpZoom - center_x;
		// if(gselectedObj)
		// {
		// 	// m3DCreator.setCameraHeight($('#dlg_setting_eye #eye_height').val());
		// 	m3DCreator.selectedCameraObject(gselectedObj);
		// }
	})
	$('#dlg_setting_eye .btn_dlg_close').click(function()
	{
		$('#dlg_setting_eye').hide();
	})
}

function initWall()
{
	$('#btn_wallobj_delete').click(function()
	{
    	m3DCreator.remove3DObject(gselectedObj);
		// gcreatedObjs.splice($.inArray(gselectedObj, gcreatedObjs),1);
		gselectedObj.deleteObj();
    });
 //    $('#wallobj_title').keypress(function(e)
 //    {
	// 	var key = e.which;
	// 	if(key == 13)  // the enter key code
	// 	{
	// 		if(gselectedObj != null)
	// 		{
	// 			gselectedObj.property.title = $(this).val();
	// 			gLayerToolBar.refresh();
	// 		}
	// 	}
	// });
 //    $('#wallobj_height').keypress(function(e)
 //    {
	// 	var key = e.which;
	// 	if(key == 13)  // the enter key code
	// 	{
	// 		if(gselectedObj != null) gselectedObj.changedParameters();
	// 	}
	// });
    $('#wallobj_thickness').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
    $('#wallobj_raiseOffset').keypress(function(e)
    {
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			if(gselectedObj != null) gselectedObj.changedParameters();
		}
	});
	
 //    $('#wallobj_color').change(function(e) {
	// 	if(gselectedObj != null) gselectedObj.changedParameters();
	// });
	$('#wallobj_color').ColorPicker({
		color: defaultSeatColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(gselectedObj != null)
			{
				gselectedObj.changedBackgroundColor('#' + hex);
			}
			$('#wallobj_color').css('background-color', '#' + hex);
		}
	});
	$('#btn_wallobj_video').click(function()
	{
		$('#mapping_videoupload').click();
	});
	$('#wallobj_material_type').change(function()
	{
		var type = $(this).val();
		if(gselectedObj != null && gselectedObj.type == 'WallObj')
		{
			gselectedObj.materialType = type;
			m3DCreator.modify3DObject(gselectedObj, {materialType: type});
		}
	})
}

function initToolBarSelection()
{
	$('#selection_viewscore').keypress(function(e) {
		var key = e.which;
		if(key == 13) {
			var viewscore = parseInt($('#selection_viewscore').val());
			if(viewscore <= 0) return;
			
			var nseats = 0;
			for(var i = 0; i < selectionObjects.length; i++) {
				var selObj = selectionObjects[i];
				if(selObj.type == 'BlockObj') {
					selObj.viewscore = viewscore;
				}
			}
		}
	});
	$('#selection_lineSpace').keypress(function (e)
	{
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			var lineSpace = parseFloat($('#selection_lineSpace').val());
			if(lineSpace <= 0) return;
			
			var nseats = 0;
			for(var i = 0; i < selectionObjects.length; i++)
			{
				var selObj = selectionObjects[i];
				selObj.lineSpace = lineSpace;
				selObj.drawSeatLines(false, selObj.blockshape.originalLeft - selObj.blockshape.left, selObj.blockshape.originalTop - selObj.blockshape.top);
			}
			m3DCreator.modify3DGroup(selectionObjects);
		}
	});
	$('#selection_seatspace').keypress(function(e)
	{
		var key = e.which;
		if(key == 13)  // the enter key code
		{
			var seatspace = parseFloat($('#selection_seatspace').val());
			if(seatspace <= 0) return;

			var nseats = 0;
			for(var i = 0; i < selectionObjects.length; i++)
			{
				var selObj = selectionObjects[i];
				selObj.seatspace = seatspace;
				selObj.drawSeatLines(false, selObj.blockshape.originalLeft - selObj.blockshape.left, selObj.blockshape.originalTop - selObj.blockshape.top);
				//selectionObjects[i].drawSeatLines(false);
				//nseats += selectionObjects[i].seatTotal;
			}
			//$('#selection_seatcount').val(nseats);
			m3DCreator.modify3DGroup(selectionObjects);
		}
	});

	$('#selection_3dheight').change(function(e)
	{
		var baseheight = parseFloat($('#selection_3dheight').val());
		for(var i = 0; i < selectionObjects.length; i++)
		{
			selectionObjects[i].baseheight = baseheight;
		}
		m3DCreator.modify3DGroup(selectionObjects);
	});

	$('#selection_3dLayerheight').change(function(e)
	{
		var layerheight = parseFloat($('#selection_3dLayerheight').val());
		for(var i = 0; i < selectionObjects.length; i++)
		{
			selectionObjects[i].layerheight = layerheight;
		}
		m3DCreator.modify3DGroup(selectionObjects);
	})

	$('#selection_showlines').change(function()
	{
		var showlines = $('#selection_showlines').is(':checked') ? true : false;

		var nseats = 0;
		for(var i = 0; i < selectionObjects.length; i++)
		{
			var selObj = selectionObjects[i];
			selObj.showlines = showlines;
			if(showlines)
				selObj.drawSeatLines(false, selObj.blockshape.originalLeft - selObj.blockshape.left, selObj.blockshape.originalTop - selObj.blockshape.top);
			else
				selObj.removeSeatLines();
		}
		canvas.renderAll();
		m3DCreator.modify3DGroup(selectionObjects);
	});

	// $('#selection_color').change(function()
	// {
	// 	var bgcolor = $('#selection_color').val();
	// 	var items = selectionGroup.getObjects();

	// 	for(var i = 0; i < items.length; i++)
	// 	{
	// 		selectionObjects[i].backColor = bgcolor;
	// 		selectionObjects[i].blockshape.setFill(bgcolor);
	// 	}
	// 	canvas.deactivateAll();

	// 	$('#panel_selection_group').hide();	

	// 	for(var i = 0; i < gcreatedObjs.length; i++) {
	// 		gcreatedObjs[i].drawSeatLines(false);
	// 	}
	// 	m3DCreator.modify3DGroup(selectionObjects);
	// 	selectionObjects = null;
	// 	selectionGroup = null;
	// });
	$('#selection_color').ColorPicker({
		color: defaultSeatColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(selectionGroup)
			{
				var bgcolor = '#' + hex;
				var items = selectionGroup.getObjects();

				for(var i = 0; i < items.length; i++)
				{
					selectionObjects[i].backColor = bgcolor;
					selectionObjects[i].blockshape.setFill(bgcolor);
				}
				// canvas.deactivateAll();

				// $('#panel_selection_group').hide();	

				// for(var i = 0; i < gcreatedObjs.length; i++) {
				// 	gcreatedObjs[i].drawSeatLines(false);
				// }
				m3DCreator.modify3DGroup(selectionObjects, {backColor: bgcolor});
				// selectionObjects = null;
				// selectionGroup = null;

				$('#selection_color').css('background-color', '#' + hex);
				canvas.renderAll();
			}
		}
	});

	$('#selection_seat_color').ColorPicker({
		color: defaultSeatColor,
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			if(selectionGroup)
			{
				var seatColor = '#' + hex;
				var items = selectionGroup.getObjects();

				for(var i = 0; i < items.length; i++)
				{
					selectionObjects[i].seatColor = seatColor;
				}

				m3DCreator.modify3DGroup(selectionObjects, {seatColor: seatColor});
				$('#selection_color').css('background-color', seatColor);
			}
		}
	});

	$('#btn_groupobj_fliph').click(function()
	{
		if(selectionGroup)
		{
			setGroupFlip(true);
			m3DCreator.modify3DGroup(selectionObjects);
		}
		selectionGroup = null;
		selectionObjects = null;
		$('#panel_selection_group').hide();
    });

	$('#btn_groupobj_flipv').click(function()
	{
		if(selectionGroup)
		{
			setGroupFlip(false);
			m3DCreator.modify3DGroup(selectionObjects);
		}
		selectionGroup = null;
		selectionObjects = null;
		$('#panel_selection_group').hide();
    });

	$('#btn_selection_delete').click(function()
	{
		if(selectionObjects)
		{
			canvas.deactivateAll().renderAll();
			m3DCreator.remove3DGroup(selectionObjects);
			for(var i = 0; i < selectionObjects.length; i++)
			{
				// gcreatedObjs.splice($.inArray(selectionObjects[i], gcreatedObjs), 1);
				selectionObjects[i].deleteObj();
			}
			selectionObjects = [];

			$('#panel_selection_group').hide();
		}
    });

	function setGroupFlip(isHoiz)
	{
		var items = selectionGroup.getObjects();
		if(items.length == 0)
			return;
	    var tmpZoom = canvas.getZoom();
		var cX = (selectionGroup.left + selectionGroup.width * 0.5) * tmpZoom;
		var cY = (selectionGroup.top + selectionGroup.height * 0.5) * tmpZoom;
		for(var cnt = 0; cnt < items.length; cnt++)
		{
			var obj = selectionObjects[cnt];
			var tmppoints = obj.getPosFromGroup(selectionGroup);

	        if(isHoiz)
	        {
		        for(i = 0; i < tmppoints.length; i++)
		        {
		            tmppoints[i].x = 2*cX - tmppoints[i].x;
		        }
		    }
		    else
		    {
		        for(i = 0; i < tmppoints.length; i++)
		        {
		            tmppoints[i].y = 2*cY - tmppoints[i].y;
		        }
		    }

	        canvas.remove(obj.blockshape);
	        obj.blockshape = null;
	        obj.createObjs(tmppoints, false);
	        obj.blockshape.parentObj = obj;
		}
		canvas.remove(selectionGroup);
		canvas.deactivateAll().renderAll();
	    canvas.renderAll();
	    for(var i = 0; i < selectionObjects.length; i++)
	    {
			selectionObjects[i].drawSeatLines(false);
		}
	}
}

var gtmpmousepointer = null;
function initToolBarZoom()
{
	// var sliderVal = 10;

	var slider = $('#slider_body').slider({
		orientation: 'vertical',
		min		: 1,
		max		: 50,
		value	: sliderVal,
		change	: function(event, ui)
		{
			sliderVal = ui.value;

			if(gtmpmousepointer == null)
				canvas.setZoom(sliderVal * 0.1);
			else
				canvas.zoomToPoint(new fabric.Point(gtmpmousepointer.x, gtmpmousepointer.y), sliderVal * 0.1);
			gtmpmousepointer = null;			
			if(gselectedObj != null) gselectedObj.showProperty();
		}
	});

	$('#slider_inc').click(function()
	{
		sliderVal = Math.min(sliderVal + 1, 50);
		slider.slider('value', sliderVal);
	});
	
	$('#slider_dec').click(function()
	{
		sliderVal = Math.max(sliderVal - 1, 1);
		slider.slider('value', sliderVal);
	});

	$('#btn_zoom_reset').click(function()
	{
        canvas.absolutePan(new fabric.Point(0, 0));
		canvas.setZoom(garena.getInitZoom());
	})

	function startPan(event) {
		if (event.button != 2) {
			return;
		}
		var x0 = event.screenX,
		y0 = event.screenY;
		
		function continuePan(event) {
			var x = event.screenX,
			y = event.screenY;
			canvas.relativePan({ x: x - x0, y: y - y0 });
			x0 = x;
			y0 = y;
		}
		function stopPan(event) {
			$('#draw-board').off('mousemove', continuePan);
			$('#draw-board').off('mouseup', stopPan);
		};
		$('#draw-board').mousemove(continuePan);
		$('#draw-board').mouseup(stopPan);
		// $('#draw-board').contextmenu(cancelMenu);
	};

	function cancelMenu() {
		$('#draw-board').off('contextmenu', cancelMenu);
		return false;
	}
	$('#draw-board').mousedown(startPan);


	$('#transslider').slider({
		orientation: 'horizontal',
		min		: 1,
		max		: 100,
		value	: 100,
		change	: function(event, ui)
		{
			if(gselectedObj != null && !gsetslidervalueflag) gselectedObj.changedTransvalue(ui.value);
			gsetslidervalueflag = false;
		}
	});
}


//Move object button
function initMoveButtons()
{
	$('#move_top').click(function()
	{
		var delta = new fabric.Point(0, -10) ;
    	canvas.relativePan(delta);

        if(gselectedObj != null) gselectedObj.showProperty();
	});

	$('#move_down').click(function()
	{
		var delta = new fabric.Point(0, 10) ;
    	canvas.relativePan(delta);

        if(gselectedObj != null) gselectedObj.showProperty();
	});

	$('#move_left').click(function()
	{
		var delta = new fabric.Point(-10, 0) ;
    	canvas.relativePan(delta);

        if(gselectedObj != null) gselectedObj.showProperty();
	});

	$('#move_right').click(function()
	{
        var delta = new fabric.Point(10, 0) ;
    	canvas.relativePan(delta);

        if(gselectedObj != null) gselectedObj.showProperty();
	});
}



function initToolBarTop()
{
	$('#btn_close').click(function()
	{
	});

	$('#btn_open').click(function()
	{
		// saveAsJson(file_path);
	});
	$('#fileupload_fileopen').fileupload(
	{
		url: "server/",
		dataType: 'json',
		done: function(e, data)
		{
			var file = data.result.files[0];
			if(!file)
				return;
			var newUrl = "server/files/open_files/" + file.name;
			jQuery.get(newUrl, function(data) {
				removeArenaMap();
				data_manager.loadSaveFile(data, '');
				enablePolygonDraw();
			});
		}
	});
	$('#btn_save_file').click(function()
	{
		var save_filename = generateFileNameWithTime();
		$('#text_save_filename').val(save_filename);
		$('#dlg_save_filename').fadeIn();
		$('#dlg_save_filename').prop('type', 'save');
	});

	$('#btn_saveasfile').click(function()
	{
		var type = $('#dlg_save_filename').prop('type');
		if(type == 'save') {
			if(selectionObjects && selectionObjects.length > 0)
			{
				canvas.deactivateAll().renderAll();
			}
			var saveData = data_manager.saveJson(true);
			var filename = $('#text_save_filename').val();
			var data = {
				"save_data": saveData,
				"filename": "./files/save/" + filename + ".bin",
			};
			$.ajax (
			{
				type: "POST",
				url: "server/filesave.php", 
				data: data,
				cache: false,
				success: function(result) {
					console.log('file is saved', result);
					$('#file_download_iframe')[0].src = 'server/' + result;
				}
			});
		}
		else if(type == 'export') {
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
		$('#dlg_save_filename').fadeOut();
	})

	$('#btn_save_cancel').click(function()
	{
		$('#dlg_save_filename').fadeOut();
		$('.context-edit.animated-slow.fadeInDown').animate({
			'top': $('#menu-area').height()
		});
	})

	$('#btn_save').click(function()
	{
		data_manager.saveJson();
	});

	$('#btn_newpage').click(function()
	{
		localStorage.clear();
		window.location.href = "index.php";
	})
	$('#btn_3dpreview').click(function()
	{
		function encodeQueryData(data) {
			let ret = [];
			for (let d in data)
				ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
			return ret.join('&');
		}

		function makeString(length) {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for( var i = 0; i < length; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}

		var saveData = data_manager.saveJson();
		var filename = generateFileNameWithTime();
		var data = {
			"save_data": saveData,
			"filename": "./files/save/" + filename + ".bin",
		};
		$.ajax (
		{
			type: "POST",
			url: "server/filesave.php", 
			data: data,
			cache: false,
			success: function(result) {
				var param = {
					map: generateFileNameWithTime(),
				}
				var query = encodeQueryData(param);
				window.location.href = "3dpreview.html?" + query;

				console.log('file is saved', result);
			}
		});
	});

	$('#btn_2dpreview').click(function() {
		data_manager.saveJson();
		window.location.href = "index.php";
	});

	$('#btn_import').click(function() {
	})
	$('#fileupload_fileimport').fileupload({
		url: "server/",
		dataType: 'json',
		done: function(e, data) {
			var file = data.result.files[0];
			if(!file)
				return;
			var newUrl = "server/files/open_files/" + file.name;
			jQuery.get(newUrl, function(data) {
				var arrayObjs = data_manager.loadImportFile(data);
				arrayObjs.forEach(function(obj, index) {
					obj.initialize();
				})
			});
		}
	});
	$('#btn_export').click(function() {
		var export_filename = generateFileNameWithTime();
		$('#text_save_filename').val('export_' + export_filename);
		$('#dlg_save_filename').fadeIn();
		$('#dlg_save_filename').prop('type', 'export');
		$('.context-edit.animated-slow.fadeInDown').animate({
			'top': $('#menu-area').height() + 30
		});
	})
}

function initToolBarSelectionDlg()
{
	function selectionObject(obj)
	{
		if(obj && obj.blockshape)
		{
			canvas.setActiveObject(obj.blockshape);
			canvas.renderAll();
		}
	}

	function selectionNextObject(isNext)
	{
		var findIndex = gcreatedObjs.indexOf(gselectedObj);
		var start = 0;
		if(findIndex > 0)
			start = findIndex;
		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			var index = start + i + 1;
			if(!isNext)
			{
				index = start - i - 1;
			}
			if(index >= gcreatedObjs.length)
				index -= gcreatedObjs.length;
			if(index < 0)
				index += gcreatedObjs.length;
			var obj = gcreatedObjs[index];
			if(!obj.selectable)
			{
				selectionObject(obj);
				break;
			}
		}
	}

	// $('#dlg_selection #prev').click(function()
	// {
	// 	selectionNextObject(false);
	// });
	// $('#dlg_selection #next').click(function()
	// {
	// 	selectionNextObject(true);
	// });
	// $('#dlg_selection #all_enable').click(function()
	// {
	// 	for(var i = 0; i < gcreatedObjs.length; i++)
	// 	{
	// 		var obj = gcreatedObjs[i];
	// 		if(!obj.selectable)
	// 		{
	// 			obj.setSelectable(true);
	// 		}
	// 	}
	// });
	// $('#dlg_selection #close').click(function()
	// {
	// 	$('#dlg_selection').hide();
	// });
}





function makeFreeGroup()
{
	var items = selectionGroup.getObjects();
	if(items.length == 0)
		return;
    var tmpZoom = canvas.getZoom();
	var gX = (selectionGroup.left + selectionGroup.width * 0.5) * tmpZoom;
	var gY = (selectionGroup.top + selectionGroup.height * 0.5) * tmpZoom;
	for(var cnt = 0; cnt < items.length; cnt++)
	{
		var obj = selectionObjects[cnt];
        obj.blockshape._calcDimensions();
        var tmppoints = [];
        var type = obj.constructor.name;
		if(type == 'BlockObj')
		{
	        for(var i = 0; i < obj.blockshape.points.length; i++)
	        {
	            tmppoints.push({
	            	x: gX + obj.blockshape.left * tmpZoom + obj.blockshape.points[i].x * (tmpZoom * obj.blockshape.scaleX),
	                y: gY + obj.blockshape.top * tmpZoom + obj.blockshape.points[i].y * (tmpZoom * obj.blockshape.scaleX)
	            });
	        }
		}
		else if(type == 'ShapeObj')
		{
	        var tmpi = 0;
	        for(var i = obj.blockshape.points.length / 2 - 1; i >= 0; i--)
	        {
	            tmppoints.push({
	                x: gX + obj.blockshape.left * tmpZoom + obj.blockshape.points[i].x * (tmpZoom * obj.blockshape.scaleX),
	                y: gY + obj.blockshape.top * tmpZoom + obj.blockshape.points[i].y * (tmpZoom * obj.blockshape.scaleX)});
	            tmpi++;
	        }
		}
        canvas.remove(obj.blockshape);
        obj.blockshape = null;
        obj.createObjs(tmppoints, false);
	}

	canvas.remove(selectionGroup);
}

