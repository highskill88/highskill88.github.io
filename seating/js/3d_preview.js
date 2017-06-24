
var SEATING_3DMAPONLY = false;

$(document).ready(function() {
	ClassMain();
})

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var ClassMain = function() {
	var main = this;

	this.init = function() {
		var map_name = getParameterByName('map');
		var filename = 'server/files/save/' + map_name + '.bin';

		var width = window.innerWidth;
		var height = window.innerHeight;
		height = Math.min(window.innerHeight - $('#menu-area').height(), height);
		m3DCreator = new C3DCreator(width, height, function() {
			jQuery.get(filename, function(data)
			{
				data_manager.loadSaveFile(data, '');
				enablePolygonDraw();
				gcreatedObjs = [];
				gcreatedObjs = data_manager.loadedObjects;
				m3DCreator.initPreview();
			});
			// $('#preview_2d').css('top', height - $('#preview_2d').height() + 20);
			// var jsonarena = localStorage.getItem('last_works');
			// data_manager.loadSaveFile(jsonarena, '');
			// gcreatedObjs = [];
			// gcreatedObjs = data_manager.loadedObjects;
			// m3DCreator.initPreview();
		});
	}

	this.init();
}
