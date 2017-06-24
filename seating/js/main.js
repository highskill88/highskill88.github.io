$(document).ready(function()
{
	ClassMain();
})

var ClassMain = function()
{
	var main = this;

	this.init = function()
	{
		this.initObjects();
		this.initEvents();
		main_canvas();

		m3DCreator = new C3DCreator(480, 320, function() {
			fabric.Image.fromURL('./images/pattern2.png', function(img)
			{
				patternImage = img;
				var jsonarena = localStorage.getItem('last_works');
				if(jsonarena) {
					data_manager.loadSaveFile(jsonarena, '');
					enablePolygonDraw();
				}
				else {
					disablePolygonDraw();
					garena = new ArenaObj('images/arena/arena5.jpg', null, onLoadedArena);
				}
			});
		});
	}

	this.initObjects = function()
	{
		$('#preview').draggable({
			handle: "#preview_handler",
		});
		$('#main-area').show();
		$('#btn_2dpreview').hide();
		// $('#btn_3dpreview').hide();
	}

	this.initEvents = function()
	{
		$(window).on('resize', function()
		{
			if($('#main-area').css('display') != 'none')
			{
				canvas.setWidth($("#draw-board").width());
		        canvas.setHeight($("#draw-board").height());
		        canvas.renderAll();
		        canvas.calcOffset();
		    }
		});

		$(document).contextmenu({
			delegate: ".upper-canvas",
			menu: [
				{title: "Copy", cmd: "copy", uiIcon:null},
				{title: "Paste", cmd: "paste", uiIcon: null, disabled: true },
				{title: "Export", cmd: "export", uiIcon: null, disabled: true },
				{title: "Import", cmd: "import", uiIcon: null, disabled: false },
			],  // default menu
			beforeOpen: function (event, ui) {
				var clickPoint = new fabric.Point(event.offsetX, event.offsetY);
				// find the clicked object and re-define the menu or
				// optionally return false, to prevent opening the menu:
				// return true;
				// En/disable single entries:
				$(document).contextmenu("enableEntry", 'copy', IsSelectedObject());
				$(document).contextmenu("enableEntry", 'paste', IsClipboard());
				$(document).contextmenu("enableEntry", 'export', IsSelectedObject());
				// Show/hide single entries:
				// $(document).contextmenu("showEntry", ...);
				// Redefine the whole menu:
				// $(document).contextmenu("replaceMenu", ...); 
			},
			select: function(event, ui) {
				var $target = ui.target;
				switch(ui.cmd){
					case "copy":
						copyClipboard();
						break;
					case "paste":
						pasteClipboard();
						break;
					case "export":
						$('#btn_export').trigger('click');
						break;
					case "import":
						$('#fileupload_fileimport').trigger('click');
						break;
				}
				// alert("select " + ui.cmd + " on " + $target.text());
			}
		});
	}
	
	this.init();
}



function IsSelectedObject() {
	if(gselectedObj)
		return true;
	if(selectionObjects && selectionObjects.length > 0)
		return true;
	return false;
}
