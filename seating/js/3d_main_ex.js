
function C3DFontAPI()
{
	var main = this;
	this.fontBold = null;
	this.fontNormal = null;

	this.init = function()
	{
		this.loader = new THREE.FontLoader();
	}

	this.loadFonts = function(callbackLoaded)
	{
		var aryFonts = [
			{
				font: 'fontNormal',
				name: 'fonts/' + "helvetiker" + '_' + "bold" + '.typeface.json',
			},
			{
				font: 'fontBold',
				name: 'fonts/' + "helvetiker" + '_' + "regular" + '.typeface.json',
			},			
		];

		var count = 0;
		function loadFont(count)
		{
			if(count >= aryFonts.length)
			{
				callbackLoaded.call();
				return;
			}
			main.loader.load(aryFonts[count].name, function (response)
			{
				main[aryFonts[count].font] = response;
				loadFont(count + 1);
			});
		}
		loadFont(0);
	}

	this.create3DText = function(text, fontSize, fontWight, height, color)
	{
		var font = main.fontNormal;
		if(fontWight == 'bold')
			font = main.fontBold;
		var textGeo = new THREE.TextGeometry(text, {
			font: font,
			size: fontSize,
			height: height,
			curveSegments: 1,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: false,
			material: 0,
			extrudeMaterial: 0,
		});
		// textGeo.computeBoundingBox();
		// textGeo.computeVertexNormals();
		// var centerOffsetX = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		// var centerOffsetY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

		var meshText = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({color: color}));
		// meshText.position.x = centerOffsetX;
		// meshText.position.y = centerOffsetY;

		// meshText.position.x = offsetX;
		// meshText.position.y = offsetY;
		meshText.position.z = 0.1;

		return meshText;
	}

	this.init();
}


function CTicketPointView(scene, fontAPI)
{
	var main = this;
	this.ticketView;
	this.m3DFontAPI = fontAPI;
	this.textTitle;
	this.textTicketNum;
	this.textPrice;
	this.meshObj;
	this.position;

	var width = 50;
	var height = 25;

	var centerX = width * 0.5;
	var centerY = height * 0.5;

	this.init = function()
	{
		this.ticketView = new THREE.Group();

		var geoPlan = new THREE.PlaneGeometry(width, height, 1, 1);
		var meshBG = new THREE.Mesh(geoPlan, new THREE.MeshBasicMaterial({ color:0x000000 }));
		// meshBG.position.set((pt1.x + pt2.x) * 0.5, (pt1.y + pt2.y) * 0.5, height * 0.5 + raiseHeight);
		// meshBG.rotation.x = Math.PI * 0.5;
		// meshBG.rotation.y = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
		this.ticketView.add(meshBG);
		this.ticketView.visible = false;

		this.ticketView.rotation.x = Math.PI * 0.5;
		this.ticketView.position.z = height * 0.5 + 10;

		scene.add(this.ticketView);
	}

	this.resetTicket = function(position, lineIndex, aspect, blockIndex)
	{
		this.ticketView.remove(this.textTitle);
		this.textTitle = this.m3DFontAPI.create3DText('block' + blockIndex + ': ' + lineIndex, 4, 'bold', 0, 0xffffff);
		this.ticketView.add(this.textTitle);
		this.textTitle.position.x = 3 - centerX;
		this.textTitle.position.y = centerY - 7;

		this.ticketView.remove(this.textTicketNum);
		this.textTicketNum = this.m3DFontAPI.create3DText('3 Tickets', 3, 'normal', 0, 0xf0f0f0);
		this.ticketView.add(this.textTicketNum);
		this.textTicketNum.position.x = 3 - centerX;
		this.textTicketNum.position.y = centerY - 14;

		this.ticketView.remove(this.textPrice);
		this.textPrice = this.m3DFontAPI.create3DText('231$', 3.5, 'bold', 0, 0xffffff);
		this.ticketView.add(this.textPrice);
		this.textPrice.position.x = 3 - centerX;
		this.textPrice.position.y = centerY - 21;

		this.ticketView.position.x = position.x;
		this.ticketView.position.y = -position.z;
		this.ticketView.position.z = position.y + height * 0.5 + 15;
		this.ticketView.rotation.y = aspect;

		this.ticketView.visible = true;
		this.position = {
			x: position.x,
			y: position.y + height * 0.5 + 15,
			z: position.z,
		};
	}

	this.hide = function()
	{
		this.ticketView.visible = false;
	}

	this.init();
}



function CTicketStateView(scene, fontAPI, data, textureLoader)
{
	var main = this;
	this.ticketView;
	this.m3DFontAPI = fontAPI;
	this.textTitle;
	this.textTicketNum;
	this.textPrice;
	this.meshObj;
	this.position;

	var scale = 0.4;
	var width = 100 * scale;
	var height = 76 * scale;

	var centerX = width * 0.5;
	var centerY = height * 0.5;

	this.init = function()
	{
		this.ticketView = new THREE.Group();

		var points = [
			{x: 0, y: 0},
			{x: 0, y: 68},
			{x: 18, y: 68},
			{x: 26, y: 76},
			{x: 34, y: 68},
			{x: 100, y: 68},
			{x: 100, y: 0},
		]
		var californiaShape = new THREE.Shape(points);
		var geometry = new THREE.ShapeBufferGeometry(californiaShape);
		var meshBG = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color:0xffffff }));
		// meshBG.position.set((pt1.x + pt2.x) * 0.5, (pt1.y + pt2.y) * 0.5, height * 0.5 + raiseHeight);
		meshBG.position.x = 100;
		meshBG.position.y = 76;
		meshBG.rotation.z = Math.PI;
		// meshBG.rotation.y = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
		this.ticketView.add(meshBG);


		var texture = textureLoader.load('images/3d_preview/persons/' + data.picture, function()
		{
			var geo = new THREE.PlaneGeometry(40, 40, 1, 1);
			var material = new THREE.MeshBasicMaterial({
				map: texture,
				overdraw: true,
				// side: THREE.DoubleSide,
			});
			var meshPicture = new THREE.Mesh(geo, material);
			main.ticketView.add(meshPicture);
			meshPicture.position.set(25, 40, 0.1);
		});


		this.textTicketNum = this.m3DFontAPI.create3DText(data.rate, 12, 'normal', 0, 0x101010);
		this.ticketView.add(this.textTicketNum);
		this.textTicketNum.position.x = 60;
		this.textTicketNum.position.y = 47;

		this.textPrice = this.m3DFontAPI.create3DText('$' + data.price, 11, 'normal', 0, 0x222222);
		this.ticketView.add(this.textPrice);
		this.textPrice.position.x = 55;
		this.textPrice.position.y = 22;

		scene.add(this.ticketView);
		this.ticketView.rotation.x = Math.PI * 0.5;
		// this.ticketView.rotation.z = Math.PI;

		var scale = 0.45;
		this.ticketView.scale.set(scale, scale, scale);
	}

	this.resetTicket = function(position, aspect)
	{
		this.ticketView.position.x = position.x;
		this.ticketView.position.z = position.z - 8;
		this.ticketView.position.y = position.y + height * 0.5;
		this.ticketView.rotation.y = aspect;
	}

	this.hide = function()
	{
		this.ticketView.visible = false;
	}

	this.init();
}


function getCenterPosition(points)
{
	var center = {
		x: 0,
		y: 0,
	}
	for(var i = 0; i < points.length; i++)
	{
		center.x += points[i].x;
		center.y += points[i].y;
	}
	return {
		x: center.x / points.length,
		y: center.y / points.length,
	}
}

function getSizeFromPoints(points)
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
		width: max_x - min_x,
		height: max_y - min_y,
	}
}