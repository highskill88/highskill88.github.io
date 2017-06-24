
var SEATING_3DMAPONLY = true;

$(document).ready(function()
{
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function() {
		FB.init({
			appId: '1516230348451300',
			version: 'v2.7', // or v2.1, v2.2, v2.3, ...
			cookie     : true,
			xfbml      : true,
		});
		$('#btn_fblogin').removeAttr('disabled');
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
		function statusChangeCallback(response) {
			console.log('statusChangeCallback');
			console.log(response);
			// The response object is returned with a status field that lets the
			// app know the current login status of the person.
			// Full docs on the response object can be found in the documentation
			// for FB.getLoginStatus().
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				testAPI();
			} else {
				// The person is not logged into your app or we are unable to tell.
				document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
			}
		}
	});
	ClassMain();
})

var ClassMain = function()
{
	var main = this;

	$('#select_quality li').click(function() {
		$('#select_quality li').removeClass();
		$(this).addClass('active');
		var index = $(this).index();
		g_appOptions.graphic_quality = index;
	})

	$('#dlg_login .btn-success').click(function()
	{
		$('#first_page').hide();
		$('#preview').show();
		$('#main_body').show();
		$('#preview_2d').show();
		main.init();
	})
	// $('#first_page').hide();
	// $('#preview').show();
	// $('#main_body').show();
	// $('#preview_2d').show();


	this.init = function()
	{
		this.initObjects();
		this.initEvents();
		main_canvas();

		var width = window.innerWidth;
		var height = window.innerHeight * 0.5;
		height = Math.min(window.innerHeight - $('#menu-area').height(), height);
		m3DCreator = new C3DCreator(width, height, function() {

			$('#preview_2d').css('top', height - $('#preview_2d').height() + 20);

			// fabric.Image.fromURL('./images/pattern2.png', function(img)
			// {
			// 	var jsonarena = localStorage.getItem('last_works');
			// 	data_manager.loadSaveFile(jsonarena, '');
			// 	gcreatedObjs = [];
			// 	gcreatedObjs = data_manager.loadedObjects;
			// 	m3DCreator.initPreview();
			// });
			
			jQuery.get('maps/temp01.bin', function(data)
			{
				data_manager.loadSaveFile(data, '');
				enablePolygonDraw();
				gcreatedObjs = [];
				gcreatedObjs = data_manager.loadedObjects;
				m3DCreator.initPreview();
			});
		});

		// var canvas_temp = new fabric.Canvas('canvas_2dpreview', {width:200, height:200});

		// fabric.Image.fromURL('./images/arena/arena2.png', function(img)
		// {
		// 	img.set({left:0, top:0, width:canvas_temp.width, height:canvas_temp.height, originX: 'left', originY:'top', opacity:1.0, crossOrigin: 'anonymous'});
  //           // var imgObj = new fabric.Image(img);
  //           canvas_temp.add(img);
  //           canvas_temp.renderAll();
		// });
	}

	this.initObjects = function()
	{
		$('#main-area').hide();
	}

	this.initEvents = function()
	{
		$(window).on('resize', function()
		{
			var width = window.innerWidth;
			var height = width * 0.75;
			height = Math.min(window.innerHeight - $('#menu-area').height(), height);
			$('#preview_2d').css('top', height - $('#preview_2d').height() + 20);
		});

		$('#slider_price').slider({
			// orientation: 'vertical',
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

		var json_pos = {};
		$('.ticket_item').click(function(e)
		{
			var blockIndex = parseInt($(this).attr('blockIndex'));
			var row = parseInt($(this).attr('row'));
			var col = parseInt($(this).attr('col'));
			if(col)
			{
				m3DCreator.moveCameraSeating(blockIndex, row, col);
				$('#preview_ticket').show();
				$('#preview_ticket .title').text('block ' + blockIndex + ': Row ' + row);
			}
		})

		$('#btn_fblogin').click(function(e)
		{
 			FB.login();
		})
	}

		$('#first_page').hide();
		$('#preview').show();
		$('#main_body').show();
		main.init();
	this.init();
}
