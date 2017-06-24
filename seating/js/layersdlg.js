
var gLayerToolBar;
function initLayerToolbar()
{
	gLayerToolBar = new CLayerToolBar();
}

var CLayerToolBar = function()
{
	var main = this;
	var mainview = $('#layers_content ul');
	var itemCount = 0;
	this.init = function()
	{
		mainview.sortable({
			start: function(event, ui) {
	            var start_pos = ui.item.index();
	            ui.item.data('start_pos', start_pos);
			},
			change: function(event, ui) {
			},
			update: function(event, ui) {
	            var start_pos = ui.item.data('start_pos');
	            var end_pos = ui.item.index();
	            console.log("New start: " + start_pos);
	            console.log("New position: " + end_pos);
	            main.swapObjects(start_pos, end_pos);
			}
		});
		mainview.disableSelection();
		this.initEvent();
		this.refresh();
	}

	// this.selectedItem = function(index)
	// {
	// 	mainview.children('li').removeClass('active');
	// 	if(index >= 0)
	// 		mainview.children('li').eq(index).addClass('active');
	// }

	this.swapObjects = function(pos1, pos2)
	{
		var lies = mainview.find('li');
		for(var i = lies.length - 1; i >= 0; i--)
		{
			canvas.moveTo(lies[i].object.blockshape, 1);
		}
		canvas.renderAll();
	}

	this.initEvent = function()
	{
		canvas.on('object:added', function (e)
		{
			var obj = e.target.parentObj;
			if(obj)
			{
				main.addItem(obj);
				gcreatedObjs.push(obj);

				$('#layers_content').animate({scrollTop: '100000px'});
			}
		});
		canvas.on('object:removed', function (e)
		{
			var obj = e.target.parentObj;
			if(obj)
			{
				var index = gcreatedObjs.indexOf(obj);
				if(index >= 0)
					gcreatedObjs.splice(index, 1);
				m3DCreator.remove3DObject(obj);
				obj.li.remove();
			}
		});
		canvas.on('object:selected', function(e)
		{
			if(e.target.parentObj)
			{
				if($('#toolbar_selection').hasClass('active')) {
					e.target.borderColor = '#ff0000';
					e.target.cornerColor = '#ff0000';
					e.target.lockUniScaling = false;
					e.target.lockRotation = true;
					e.target.selectable = true;
					e.target.hasControls = true;
					e.target.hasBorders = true;
					canvas.renderAll();
				}
				else {
					e.target.hasControls = false;
					e.target.hasBorders = false;
				}
				mainview.children('li').removeClass('active');
				var li = e.target.parentObj.li;
				if(li)
				{
					$(li).addClass('active');
					$('#toolbar_scale').removeClass('disable');
					var offset = li.offsetTop - mainview[0].offsetTop;
					$('#layers_content').animate({scrollTop: offset});
				}
			}
		});

		canvas.on('before:selection:cleared', function(e)
		{
	    	clearObject(gselectedObj);
		});

		canvas.on('selection:cleared', function(e)
		{
	    	if(selectionObjects)
	    	{
           		var zoom = 1 / garena.getInitZoom();
		    	var origin_zoom = 1 / canvas.getZoom();
	    		var scaleX = selectionGroup.scaleX;
	    		var scaleY = selectionGroup.scaleY;
		    	for(var i = 0; i < selectionObjects.length; i++)
		    	{
		    		var obj = selectionObjects[i];
		    		// if(obj.type != 'ShapeObj')
		    		// for(var k = 0; k < obj.blockshape.points.length; k++)
		    		// {
		    		// 	var x = obj.blockshape.points[k].x * scaleX;
		    		// 	var y = obj.blockshape.points[k].y * scaleY;
		    		// 	obj.blockshape.points[k].x = x;
		    		// 	obj.blockshape.points[k].y = y;
		    		// }
		    		// obj.blockshape.scaleX = scaleX * zoom;
		    		// obj.blockshape.scaleY = scaleY * zoom;
		    		obj.reloadObject(false);
		    		obj.drawSeatLines(false);
		    		obj.callbackModified.call(obj, obj);
		    	}
		    }
		    else
		    {
		    	var selectedObj = e.target;
			    if(selectedObj && selectedObj.hasControls)
			    {
		    		// var zoom = 1 / canvas.getZoom();
		    		// var scaleX = selectedObj.scaleX;
		    		// var scaleY = selectedObj.scaleY;
		    		// for(var k = 0; k < selectedObj.points.length; k++)
		    		// {
		    		// 	var x = selectedObj.points[k].x * scaleX / zoom;
		    		// 	var y = selectedObj.points[k].y * scaleY / zoom;
		    		// 	selectedObj.points[k].x = x;
		    		// 	selectedObj.points[k].y = y;
		    		// }
		    		// selectedObj.scaleX = zoom;
		    		// selectedObj.scaleY = zoom;
		    		selectedObj.parentObj.reloadObject(false);
		    		selectedObj.parentObj.drawSeatLines(false);
					selectedObj.hasBorders = false;
					selectedObj.hasControls = false;
					selectedObj.parentObj.callbackModified.call(selectedObj.parentObj, selectedObj.parentObj);
			    }
			}
			$('#panel_selection_group').hide();	
			selectionObjects = null;

			selectionGroup = null;
			// main.selectedItem();
			mainview.children('li').removeClass('active');

			$('#toolbar_scale').removeClass('active');
			$('#toolbar_scale').addClass('disable');
		});

		canvas.on('selection:created', function(e)
		{
			if(gselectedObj != null)
			{
				gselectedObj.blockshape.stroke = gcolor_blockborder;
				gselectedObj.doNotShowSeats();
				clearResizePoints();
				gselectedObj.hideProperty();
				gselectedObj = null;
			}

			selectionGroup = e.target;
			selectionObjects = [];
			
			mainview.children('li').removeClass('active');
			for(var i = 0; i < e.target._objects.length; i++)
			{
				var obj = e.target._objects[i].parentObj;
				if(obj)
				{
					selectionObjects.push(obj);
					var li = obj.li;
					$(li).addClass('active');
				}
			}

			//show selection property
			var property = $('#panel_selection_group');
			property.css('left', gDrawBoard.offset().left + gDrawBoard.width() - 40 - property.width());
			property.css('top', $('#menu-area').height());
			property.show();

			function getSameAsAll(group, keyName)
			{
				var length = group.length;
				if(length == 0)
					return '';
				if(length == 1)
					return group[0][keyName];

				var first = group[0][keyName];
				for(var i = 1; i < group.length; i++)
				{
					if(first != group[i][keyName])
						return '';
				}
				return first;
			}
			$('#selection_viewscore').val(getSameAsAll(selectionObjects, 'viewscore'));
			$('#selection_lineSpace').val(getSameAsAll(selectionObjects, 'lineSpace'));
			$('#selection_seatspace').val(getSameAsAll(selectionObjects, 'seatspace'));
			$('#selection_3dheight').val(getSameAsAll(selectionObjects, 'baseheight'));
			$('#selection_3dLayerheight').val(getSameAsAll(selectionObjects, 'layerheight'));
			$('#selection_showlines').prop("checked", selectionObjects[0].showlines);
			var color = getSameAsAll(selectionObjects, 'backColor');
			$('#selection_color').css('background-color', color);
			$('#selection_color').ColorPickerSetColor(color);
			var seatColor = getSameAsAll(selectionObjects, 'seatColor');
			if(seatColor)
			{
				$('#selection_seat_color').css('background-color', seatColor);
				$('#selection_seat_color').ColorPickerSetColor(seatColor);
			}

			var selectedgroup = e.target;
			selectedgroup.lockScalingX = false;
			selectedgroup.lockScalingY = false;
			selectedgroup.lockRotation = true;
			selectedgroup.hasControls = true;
			selectedgroup.borderColor = '#ff0000';
			selectedgroup.cornerColor = '#ff0000';
			for(var i = 0; i < selectedgroup._objects.length; i++) {
				selectedgroup._objects[i].lockUniScaling = false;
			}

			selectedgroup.on('moving', function() {
				for(var i = 0; i < this._objects.length; i++) {
					var obj = this._objects[i].parentObj;
					if(obj && (obj.type == 'BlockObj' || obj.type == 'ShapeObj'))
						obj.removeSeatLines();
				}
			});

			selectedgroup.on('modified', function(e) {
				for(var i = 0; i < this._objects.length; i++) {
					var obj = this._objects[i].parentObj;
					if(obj)
					{
						if(obj.type == 'BlockObj')
						{
							obj.drawSeatLines(false, this.left + this.width * 0.5 * this.scaleX, this.top + this.height * 0.5 * this.scaleY, this.scaleX, this.scaleY);
						}
						else if(obj.type == 'ShapeObj')
						{
							obj.drawSeatLines(false, this.left + this.width * 0.5 * this.scaleX, this.top + this.height * 0.5 * this.scaleY, this.scaleX, this.scaleY);
						}
					}
				}
				m3DCreator.modify3DGroup(selectionObjects);
			});
			selectedgroup.on('scaling', function() {
				for(var i = 0; i < this._objects.length; i++) {
					var obj = this._objects[i].parentObj;
					if(obj && (obj.type == 'BlockObj' || obj.type == 'ShapeObj'))
						obj.removeSeatLines();
				}
			});
		});


		$('#btn_layer_refresh').click(function()
		{
			main.refresh();
		});
		$('#btn_layer_hide').hide();
		$('#btn_layer_show').show();
		$('#btn_layer_show').click(function()
		{
			var height = 31 - $('#dlg_layers').height();
			$('#dlg_layers').animate({
				bottom: height,
			}, 700, function()
			{
				$('#btn_layer_hide').show();
				$('#btn_layer_show').hide();
			});
		});
		$('#btn_layer_hide').click(function()
		{
			$('#dlg_layers').animate({
				bottom: '0px',
			}, 700, function()
			{
				$('#btn_layer_hide').hide();
				$('#btn_layer_show').show();
			});
		})

		$(document).on('click', '#layers_content .btn_delete', function(e)
		{
			var obj = $(e.target).closest('li')[0].object;
			if(obj.type == 'EyeObj')
			{
				obj.blockshape.visible = false;
			}
			else
			{
				g_historyMan.addState('remove', obj);
				obj.deleteObj();
			}
			e.preventDefault();
			e.stopPropagation();
		});

		$(document).on('click', '#layers_content .show_2d', function(e)
		{
			var obj = $(e.target).closest('li')[0].object;
			var isVisible = !obj.blockshape.visible;
			obj.blockshape.visible = isVisible;
			obj.property.isVisible2D = isVisible;

			main.setVisibleIcon($(this), isVisible);
			canvas.deactivateAll();
			clearObject(gselectedObj);
			if(isVisible)
			{
				if(obj.drawSeatLines)
					obj.drawSeatLines();
			}
			else
			{
				if(obj.removeSeatLines)
					obj.removeSeatLines();
			}
			canvas.renderAll();
			e.preventDefault();
			e.stopPropagation();
			g_historyMan.addState('hide_2d', obj);
		});

		$(document).on('click', '#layers_content .show_3d', function(e)
		{
			var obj = $(e.target).closest('li')[0].object;
			var isVisible = !obj.property.isVisible3D;
			obj.property.isVisible3D = isVisible;
			main.setVisibleIcon($(this), isVisible);
			e.preventDefault();
			e.stopPropagation();

			m3DCreator.modify3DObject(obj, {show:isVisible})
			g_historyMan.addState('hide_3d', obj);
		});

		$(document).on('click', '#layers_content li', function(e)
		{
			var obj = $(e.target).closest('li')[0].object;
			var index = $(this).index();
			if(obj.blockshape.visible)
			{
				canvas.deactivateAll();
				mainview.children('li').removeClass('active');
				$(this).addClass('active');
				canvas.setActiveObject(obj.blockshape);
			}
			e.preventDefault();
			e.stopPropagation();
		});

		$(document).on('click', '#layers_content .text', function (e)
		{
			var title = $(this).find('.title span');
			var edit_title = $(this).find('.edit_title');
			edit_title.val(title.text());
			edit_title.fadeIn();
			title.hide();
			edit_title.focusout(function(e)
			{
				// main.changeItemText($(this));
				$(this).hide();
				title.show();
			})
		})

		$(document).on('keypress', '#layers_content .edit_title', function(e)
		{
			if(e.which == 13)
			{
				var titleView = $(this).closest('.text');
				var title = titleView.find('.title span');
				var strTitle = $(this).val();
				title.text(strTitle);
				title.show();
				$(this).fadeOut();
				$(this).focusout();

				gselectedObj.property.title = strTitle.slice(0);
				m3DCreator.modify3DObject(gselectedObj);
				$('.text_object_title').val(strTitle);
			}
		})
	}

	this.refresh = function()
	{
		var selectedIndex = mainview.find('li.active').index();
		mainview.empty();
		var objs = canvas.getObjects();
		// for(var i = objs.length - 1; i >= 0; i--)
		for(var i = 0; i < objs.length; i++)
		{
			var obj = objs[i];
			if(obj.parentObj)
				this.addItem(obj.parentObj);
		}
		if(selectedIndex >= 0)
		{
			var li = mainview.children('li').eq(selectedIndex);
			li.addClass('active');
			var offset = li.offsetTop - mainview[0].offsetTop;
			$('#layers_content').animate({scrollTop: offset});
		}
		else
		{
			$('#layers_content').animate({scrollTop: '100000px'});
		}
	}

	this.setVisibleIcon = function(icon_visible, isShow)
	{
		if(isShow)
		{
			icon_visible.find('img').css('opacity', 1);
			// icon_visible.css('border', 'none');
			// icon_visible.css('box-shadow', '1px 1px 1px #fff');
		}
		else
		{
			icon_visible.find('img').css('opacity', 0);
			// icon_visible.css('border', '1px solid #626060');
			// icon_visible.css('box-shadow', '1px 1px 1px #888888');
		}
	}

	var canvas_temp = null;
	if($('#canvas_temp').length > 0)
		canvas_temp = new fabric.Canvas('canvas_temp', {width:50, height:50});

	this.addItem = function(obj)
	{
		var html = this.stringHTML();
		var newItem = $(html);

		var imgType, defTitle;
		if(obj.type == 'BlockObj')
		{
			imgType = 'images/pencil-icon.png';
			defTitle = 'Block';
		}
		else if(obj.type == 'ShapeObj')
		{
			imgType = 'images/shape-icon.png';
			defTitle = 'Shape';
		}
		else if(obj.type == 'WallObj')
		{
			imgType = 'images/pencil_wall.png';
			defTitle = 'Wall';
		}
		else if(obj.type == 'LightObj')
		{
			imgType = 'images/toolbar_light.png';
			defTitle = 'Light';
		}
		else if(obj.type == 'EyeObj')
		{
			imgType = 'images/eye-icon.png';
			defTitle = 'Eye';
			newItem.find('.btn_delete').hide();
		}
		newItem.find('.type img').attr('src', imgType);

		this.setVisibleIcon(newItem.find('.show_2d'), obj.property.isVisible2D);
		this.setVisibleIcon(newItem.find('.show_3d'), obj.property.isVisible3D);

		if(obj.property.title)
			newItem.find('.title span').text(obj.property.title);
		else
			newItem.find('.title span').text(defTitle);

		newItem.find('.type span').text(defTitle);

		// mainview.prepend(newItem);
		newItem[0].object = obj;
		obj.li = newItem[0];
		mainview.append(newItem);

		var imgObj = newItem.find('.object img');
		if(obj.type == 'BlockObj' || obj.type == 'ShapeObj' || obj.type == 'WallObj'|| obj.type == 'LightObj')
		{
			canvas_temp.clear();
			

			var scaleX = 50 / obj.blockshape.width;
			var scaleY = 50 / obj.blockshape.height; 
			var scale = Math.min(scaleX, scaleY);
			var strokeWidth = 1;
			if(scale < 0.1)
				strokeWidth = 1 / scale;

			var shape = new fabric.Polygon(obj.blockshape.points,
			{
				left : 0, //(min_x+(max_x-min_x)/2) / tmpZoom,
				top : 0, //(min_y+(max_y-min_y)/2) / tmpZoom,
				fill : obj.backColor,
				opacity : 1.0,
				stroke : gcolor_blockborder,
				strokeWidth : strokeWidth,
				originX : 'left',
				originY : 'top',
				scaleX : scaleX,
				scaleY : scaleY,
				selectable : false,
				hasBorders : false,
				lockMovementX : false,
				lockMovementY : false,
			});
			canvas_temp.add(shape);

			var color;
			if(obj.type == 'BlockObj' || obj.type == 'ShapeObj')
				color = obj.seatColor;
			else if(obj.type == 'LightObj')
				color = obj.lightColor;
			if(color)
			{
				var seat = new fabric.Rect({
					left : obj.blockshape.width * 0.25 * scaleX, //(min_x+(max_x-min_x)/2) / tmpZoom,
					top : obj.blockshape.height * 0.25 * scaleY, //(min_y+(max_y-min_y)/2) / tmpZoom,
					width: obj.blockshape.width * 0.5,
					height: obj.blockshape.height * 0.5,
					fill : color,
					opacity : 1.0,
					stroke : '#ff0000',
					strokeWidth : 1,
					originX : 'left',
					originY : 'top',
					scaleX : scaleX,
					scaleY : scaleY,
					selectable : false,
					hasBorders : false,
					lockMovementX : false,
					lockMovementY : false,
				});
				canvas_temp.add(seat);
			}

			canvas_temp.renderAll();
			var img = canvas_temp.toDataURL();
			imgObj.attr('src', img);
		}
		else
		{
			imgObj.attr('src', imgType);
		}
	}

	this.stringHTML = function()
	{
						// <div class="type">\
						// 	<img src="images/toolbar_light.png">\
						// </div>\
		return '<li>\
					<section class="btn_tool">\
						<div class="show_2d">\
							<img src="images/btn_2d_show.png">\
						</div>\
						<div class="show_3d">\
							<img src="images/btn_3d_show.png">\
						</div>\
					</section>\
					<section class="object" width=50 height=50>\
						<img src="">\
					</section>\
					<section class="text">\
						<input type="text" class="edit_title">\
						<div class="title">\
							<span>Light one</span>\
						</div>\
						<div class="type">\
							<span>Lights</span>\
						</div>\
					</section>\
					<section class="btn_delete button">\
						<img src="images/delete-icon.png">\
					</section>\
				</li>'
	}

	this.init();
}


