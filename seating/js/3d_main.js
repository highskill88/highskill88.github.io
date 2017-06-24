// jQuery(document).ready(function($)
// {
// 	$('#main-area').hide();
// 	$('#3d-area').show();

// 	var main = new C3DMain();
// });

var wall_opacity = 0.75;
var initCameraPos = new THREE.Vector3(0, 100, 200);
function C3DMain(init_width, init_height, callbackLoaded)
{
	var main = this;

	this.texture;
	var lightTexture;
	var groupScene;
	var groupObjects = null;
	var targetRotation = 0;
	var targetRotationOnMouseDown = 0;
	var scene;
	var camera;
	var controls;
	var raycaster;

	this.materialGround = null;
	this.materialText = null;
	this.seatMeshes = [];
	this.chairTemple = null;
	this.materialChairLeg = null;
	this.chairLegTmp = null;
	this.font = null;

	this.chairMaterial = null;
	this.material_chair_shaodow = null;
	this.seatGeometry = null;
	this.chairGeo_shadow = null;

	this.chairMeshs = [];

	this.objectsData = [];

	this.textureLoader = null;

	var chair = null;
	this.selectedBlock = null;
	this.fullscreen = false;

	this.isMobile = false; //initiate as false
	// device detection
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
	    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) this.isMobile = true;

	var mainLight = null;

	this.position = {
		left: 130,
		top: 100,
	}
	var aryVideoBuffers		= [];
	// var lightPosition4D = new THREE.Vector4();
	// var mainPlan;
	// var dirLightShadowMapViewer, spotLightShadowMapViewer;
	this.lightMain = null;


	var m3DFontAPI = new C3DFontAPI();
	var mTicketViewMouse = null;
	var mTicketViews = [];

	var render_castShadow = true;
	var render_chair_shadow = true;
	var render_lamp_;
	if(g_appOptions.graphic_quality == 0) {
		render_chair_shadow = false;
		render_chair_shadow = false;
	}
	else if(g_appOptions.graphic_quality == 1) {
		render_chair_shadow = true;
		render_chair_shadow = true;
	}

	this.setCameraTarget = function(posistion) {
		if(!this.isMobile)
			controls.refreshTarget(new THREE.Vector3(posistion.x, posistion.z, posistion.y));
		controls.update();
		this.render();
	}

	this.init = function()
	{
	    scene = new THREE.Scene();

	    camera = new THREE.PerspectiveCamera( 45, init_width / init_height, 1, 10000 );
		camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.x);
		scene.add( camera );

		var light = new THREE.PointLight( 0xffffff, 0.2 );
		camera.add( light );
		this.lightMain = new THREE.AmbientLight(g_appOptions.lightColor, g_appOptions.lightIntensity);
		scene.add(this.lightMain);
		// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.1 );
		// directionalLight.position.set( 1, 1, 1 ).normalize();
		// scene.add( directionalLight );

		raycaster = new THREE.Raycaster();
	    renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setPixelRatio(window.devicePixelRatio);
	    // renderer.setSize(window.innerWidth, window.innerHeight);
	    renderer.setSize(init_width, init_height);
	    renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap;

	    $('#preview_3d').append( renderer.domElement );

	    if(this.isMobile)
			controls = new THREE.DeviceOrientationControls(camera);
		else
			controls = new THREE.OrbitControls( camera, $('#preview_3d')[0] );
		var target_pos;
		if(g_appOptions.targetPosition)
			this.setCameraTarget(g_appOptions.targetPosition);
		else
			this.setCameraTarget(new THREE.Vector3(0, -1000, 0));

	    if(!this.isMobile)
			controls.addEventListener( 'change', this.render );

	    this.initEvent();
	    this.animate();
	    this.textureLoader = new THREE.TextureLoader();
	    this.loadTexture();
	    this.loadFont();


	 	groupScene = new THREE.Group();
		groupScene.rotation.set(-Math.PI * 0.5, 0, 0);
		groupObjects = new THREE.Group();
		groupScene.add( groupObjects );
		scene.add(groupScene);

	    if(!this.isMobile)
			controls.collidableMeshes = [];

		if(IsPreview3DVersion())
		{
			m3DFontAPI.loadFonts(function()
			{
				mTicketViewMouse = new CTicketPointView(groupScene, m3DFontAPI);
				$('#btn_3dcamera_view').css('opacity', 0);
				$('#preview_ticket').hide();

			// 	datas = [
			// 		{
			// 			picture: 'person1.png',
			// 			rate: 8.6,
			// 			price: 235,
			// 			x: -74,
			// 			y: 30,
			// 			z: 20,
			// 			aspect: 0,
			// 		},
			// 		{
			// 			picture: 'person2.png',
			// 			rate: 8.9,
			// 			price: 135,
			// 			x: 0,
			// 			y: 54,
			// 			z: 20,
			// 			aspect: 0,
			// 		},
			// 		{
			// 			picture: 'person3.png',
			// 			rate: 8.7,
			// 			price: 268,
			// 			x: 100,
			// 			y: 18,
			// 			z: 20,
			// 			aspect: 0,
			// 		}
			// 	]
			// 	for(var i = 0; i < datas.length; i++)
			// 	{
			// 		var ticketView = new CTicketStateView(groupScene, m3DFontAPI, datas[i], main.textureLoader);
			// 		mTicketViews.push(ticketView);
			// 		var pos = {x: datas[i].x, y: datas[i].y, z: datas[i].z};
			// 		ticketView.resetTicket(pos, datas[i].aspect);

			// 		var seletectedchairMaterial = new THREE.MeshPhongMaterial({
			// 			color: 0x00ff00,
			// 			shininess: 20,
			// 			// specular: 0x222222,
			// 		});

			// 		var chairMesh = new THREE.Mesh(main.seatGeometry, seletectedchairMaterial);
			// 		chairMesh.position.set(pos.x + 29.4, pos.y + 14.8, pos.z - 11.2);
			// 		chairMesh.scale.set(g_appOptions.chairSize, g_appOptions.chairSize, g_appOptions.chairSize);
			// 		chairMesh.rotateX(Math.PI * 0.5);
			// 		chairMesh.rotateY(Math.PI * 0.5);
			// 		// chairMesh.rotateZ(blockProp.angle - Math.PI * 0.5);
			// 		groupScene.add(chairMesh);
			// 	}
			})
		}

	}

	this.dispose = function()
	{
	    if(!this.isMobile)
			controls.dispose();
	}

	this.setFullScreen = function(fullscreen)
	{
		this.fullscreen = fullscreen;
		if($('#main-area').css('display') != 'none')
		{
			this.position.left = $('#preview').css('left');
			this.position.top = $('#preview').css('top');
			renderer.setSize(window.innerWidth, window.innerHeight - $('#menu-area').height());
		    $('#main-area').hide();
		    $('#preview').css('left', 0);
		    $('#preview').css('top', $('#menu-area').height());
		    $('#preview_handler').hide();
		}
		else
		{
			renderer.setSize(init_width, init_height);
		    $('#main-area').show();
		    $('#preview_handler').show();
			$('#preview').css('left', this.position.left);
			$('#preview').css('top', this.position.top);
		}
		this.resizeWindow();
	}

	this.initCameraEvent = function()
	{
	}

	this.init3DMap = function(width, height)
	{
		var geometry = new THREE.PlaneBufferGeometry( width, height );
		var mesh = new THREE.Mesh( geometry, this.materialGround );
		groupScene.add(mesh);
		// mesh.aoMapIntensity = 0.1;
		mesh.castShadow = false;
		mesh.receiveShadow = false;
		return mesh;
	}

	this.pushGroupObjets = function(obj, type, g_obj)
	{
		obj.obj_type = type;
		if(type == 'wall') {
	   		if(!this.isMobile)
				controls.collidableMeshes.push(obj);
		}
		// if(typeof(index) != 'undefined')
		// {
		// 	obj.parent = groupObjects;
		// 	obj.dispatchEvent( { type: 'added' } );
		// 	groupObjects.children.splice(index, 0, obj);
		// }
		// else
			groupObjects.add(obj);
		if(g_obj)
		{
			g_obj.m3dObj = obj;
			obj.visible = g_obj.property.isVisible3D;
		}
	}

	this.loadTexture = function()
	{
		this.materialGround = new THREE.MeshPhongMaterial({
			color: g_appOptions.colorFloor,
			// lightMapIntensity: 0.1,
			// shininess: 1,
		});

	 	this.materialText = new THREE.MeshBasicMaterial({color: 0x303030});

		var extrudeSettings = { amount: 1.0, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
		// var extrudeSettings2 = { amount: 0.2, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
		var chairshape = new THREE.Shape();
		chairshape.moveTo( -0.5, -0.5 );
		chairshape.lineTo( 0.5, -0.5 );
		chairshape.lineTo( 0.5, -0.45 );
		chairshape.lineTo( -0.45, -0.45 );
		chairshape.lineTo( -0.54, 0.494 );
		chairshape.lineTo( -0.59, 0.494 );
		this.seatGeometry = new THREE.ExtrudeGeometry( chairshape, extrudeSettings );

		this.chairGeo_shadow = new THREE.PlaneGeometry(1, 1, 1, 1);

		// this.chairMaterial = new THREE.MeshLambertMaterial( { color: defaultSeatColor } );
		this.chairMaterial = new THREE.MeshPhongMaterial({
			color: defaultSeatColor,
			shininess: 20,
			// specular: 0x222222,
		});
		this.material_chair_shaodow = new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			opacity: 0.3,
		});

		var shape = new THREE.Shape();
		shape.moveTo(-0.05, -0.05);
		shape.lineTo(0.05, -0.05);
		shape.lineTo(0.05, 0.05);
		shape.lineTo(-0.05, 0.05);
		var extrudeSettings = { amount: 0.5, bevelEnabled: false };
		this.materialChairLeg = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		this.chairLegTmp = new THREE.Mesh(this.materialChairLeg, new THREE.MeshBasicMaterial({ color: 0xa9a9a9 }));
		this.chairTemple = new THREE.Mesh( this.seatGeometry, this.chairMaterial );

		lightTexture = this.textureLoader.load('images/3d_preview/sunlight03.png', function(){
		});
	}
	
	this.loadFont = function()
	{
		var loader = new THREE.FontLoader();
		loader.load( 'fonts/' + "helvetiker" + '_' + "bold" + '.typeface.json', function ( response )
		{
			main.font = response;
			callbackLoaded.call();
		});
	}

	this.onLoad3DFile = function()
	{
		// model
		var manager = new THREE.LoadingManager();
		manager.onProgress = function( item, loaded, total ) {
			console.log( item, loaded, total );
		};
		var onProgress = function( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
			}
		};
		var onError = function( xhr ) {
			console.log(xhr);
		};
		var loader = new THREE.FBXLoader( manager );
		// loader.load( 'model/chair.FBX', function( object ) {
		// 	object.traverse( function( child ) {
		// 		if ( child instanceof THREE.Mesh ) {
		// 			// pass
		// 		}
		// 		if ( child instanceof THREE.SkinnedMesh ) {
		// 			if ( child.geometry.animations !== undefined || child.geometry.morphAnimations !== undefined ) {
		// 				child.mixer = new THREE.AnimationMixer( child );
		// 				mixers.push( child.mixer );
		// 				var action = child.mixer.clipAction( child.geometry.animations[ 0 ] );
		// 				action.play();
		// 			}
		// 		}
		// 	} );
		// 	scene.add( object );
		// }, onProgress, onError );
		// loader.load( 'model/1.FBX', function( object ) {
		// 	object.traverse( function( child ) {
		// 		if ( child instanceof THREE.Line ) {
		// 			child.material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 5 } );
		// 			// Generate a more detailed geometry
		// 			var nurbsGeometry = new THREE.Geometry();
		// 			nurbsGeometry.vertices = child.userData.curve.getPoints( 100 );
		// 			child.geometry = nurbsGeometry;
		// 		}
		// 	} );
		// 	scene.add( object );
		// }, onProgress, onError );
	}

	this.create3DPlane	= function(width, height)
	{
	}

	this.add3DWallWithMapping = function(points, prop, callback)
	{
		var texture = this.textureLoader.load(prop.bgImagePath, function()
		{
			if(prop.imgProp.repeat)
			{
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.x = prop.imgProp.rows;
				texture.repeat.y = prop.imgProp.cols;
			}
			else
			{
				texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
				texture.offset.x = prop.imgProp.xPos;
				texture.offset.y = prop.imgProp.yPos;
			}
			texture.flipY = prop.imgProp.flipY;

			var groupMeshes = new THREE.Group();
			for(var i = 0; i < points.length / 2 - 1; i++)
			{
				function addWallPlanWithImage(groupMesh, p1, p2, height, texture) {
					var width = getDistanceFromTwoPoints(p1, p2);

					var material = new THREE.MeshBasicMaterial({
						map: texture,
						overdraw: true,
						side: THREE.DoubleSide
					});
					var imgGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
					var imageScreen = new THREE.Mesh(imgGeometry, material);
					imageScreen.position.set((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5, prop.baseheight * 0.5 + prop.raise_offset);
					imageScreen.rotation.x = Math.PI * 0.5;
					imageScreen.rotation.y = Math.atan2(p1.y - p2.y, p1.x - p2.x);

					if(prop.imgProp.flipX)
						imageScreen.scale.x = 1;
					else
						imageScreen.scale.x = -1;
					imageScreen.castShadow = render_castShadow;
					imageScreen.receiveShadow = false;
					groupMeshes.add(imageScreen);
				}

				if(prop.wall_thickness > 0) {
					function getSubPoint(point1, point2) {
						var point = new THREE.Vector2();
						point.subVectors(point1, point2);
						point.normalize();
						point.multiplyScalar(0.1);
						point.add(point1);
						return point;
					}
					var p1 = getSubPoint(points[i], points[points.length - i - 1]);
					var p2 = getSubPoint(points[i + 1], points[points.length - i - 2]);
					addWallPlanWithImage(groupMeshes, p1, p2, prop.baseheight, texture);

					var p3 = getSubPoint(points[points.length - i - 1], points[i]);
					var p4 = getSubPoint(points[points.length - i - 2], points[i + 1]);
					addWallPlanWithImage(groupMeshes, p3, p4, prop.baseheight, texture);
				}
				else {
					addWallPlanWithImage(groupMeshes, points[i], points[i + 1], prop.baseheight, texture);
				}
			}
			if(prop.wall_thickness > 0) {
				var californiaShape = new THREE.Shape(points);
				var extrudeSettings = { amount: prop.baseheight, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
				var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings );
				var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: prop.backColor }));
				mesh.position.z = prop.raise_offset;
				groupMeshes.add(mesh);
			}
			callback.call(this, groupMeshes);
		});
	}

	this.addWallPlan = function(pt1, pt2, height, raiseHeight, material)
	{
		var w = getDistanceFromTwoPoints(pt1, pt2);
		var geometry = new THREE.PlaneGeometry(w, height, 1, 1);
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set((pt1.x + pt2.x) * 0.5, (pt1.y + pt2.y) * 0.5, height * 0.5 + raiseHeight);
		mesh.rotation.x = Math.PI * 0.5;
		mesh.rotation.y = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
		return mesh;
	}

	this.add3DWallWithVideo = function(points, prop, callback)
	{
		// var californiaShape = new THREE.Shape(points);
		// var extrudeSettings = { amount: prop.baseheight, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
		// var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings );
		// var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: prop.backColor }));
		// mesh.position.z = prop.raise_offset;

		// create the videoTexture
		var videoTexture = new THREEx.VideoTexture(prop.bgVideoPath);
		aryVideoBuffers.push(function() {
			videoTexture.update();
			videoTexture.index = aryVideoBuffers.length - 1;
		})
		// videoTexture.texture.offset.set(0.15, 0.25);

		var mesh = this.addWallPlan(points[0], points[1], prop.baseheight, prop.raise_offset,
			new THREE.MeshLambertMaterial({ color: prop.backColor }));

		// var geometry = new THREE.PlaneGeometry(w, prop.baseheight, 1, 1);
		// var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: prop.backColor }));
		// mesh.position.set((points[0].x + points[1].x) * 0.5, (points[0].y + points[1].y) * 0.5, prop.baseheight * 0.5 + prop.raise_offset);
		// mesh.rotation.x = Math.PI * 0.5;
		// mesh.rotation.y = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x);

		var w = getDistanceFromTwoPoints(points[0], points[1]);
		var material = new THREE.MeshBasicMaterial({ map: videoTexture.texture, overdraw: true });
		var movieGeometry = new THREE.PlaneGeometry(w, prop.baseheight, 1, 1);
		var movieScreen = new THREE.Mesh(movieGeometry, material);
		movieScreen.position.set((points[0].x + points[1].x) * 0.5, (points[0].y + points[1].y) * 0.5, prop.baseheight * 0.5 + prop.raise_offset);
		movieScreen.rotation.x = Math.PI * 0.5;
		movieScreen.rotation.y = Math.atan2(points[0].y - points[1].y, points[0].x - points[1].x);

		var groupMeshes = new THREE.Group();
		groupMeshes.add(mesh);
		groupMeshes.add(movieScreen);
		groupMeshes.video = videoTexture;
		callback.call(this, groupMeshes);
	}

	this.createWalls = function(points, prop)
	{
		if(prop.wall_thickness > 0)
			return this.addWallWithoutMapping(points, prop.raise_offset, prop.baseheight, -1, prop.backColor, 0, prop.materialType);

		var material;
		if(prop.materialType == 'phong')
		{
			material = new THREE.MeshPhongMaterial({color: prop.backColor});
		}
		else if(prop.materialType == 'lambert')
		{
			material = new THREE.MeshLambertMaterial({color: prop.backColor});
		}
		else
		{
			material = new THREE.MeshPhongMaterial({ color: prop.backColor });
		}
		material.side = THREE.DoubleSide;
		var group = new THREE.Group();
		for(var i = 1; i < points.length / 2; i++)
		{
			group.add(this.addWallPlan(points[i - 1], points[i], prop.baseheight, prop.raise_offset, material));
		}
		return group;
	}

	this.add3DPlan = function(points, baseHeight, raiseHeight, color, isBorder)
	{
		var californiaShape = new THREE.Shape(points);
		if(baseHeight > 0)
		{
			var extrudeSettings = { amount: baseHeight, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
			var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings );
			var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
				color: color,
			}));
		}
		else
		{
			geometry = new THREE.ShapeBufferGeometry(californiaShape);
			var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
				color: color,
				side: THREE.DoubleSide,
			}));
			if(raiseHeight == 0)
				raiseHeight = 0.1;
		}
		mesh.position.z = raiseHeight;
		mesh.castShadow = false;
		mesh.receiveShadow = false;
		return mesh;
	}

	this.add3DPlanWithMapping = function(points, baseHeigth, raiseHeight, bgImagePath, imgProp, angle, callback)
	{
		// angle = 3;
		var min_x = min_y = 0xffffffff, max_x = max_y = -0xffffffff; 
		for(var i = 0; i < points.length; i++)
		{
			min_x = Math.min(points[i].x, min_x);
			min_y = Math.min(points[i].y, min_y);
			max_x = Math.max(points[i].x, max_x);
			max_y = Math.max(points[i].y, max_y);
		}
		var obj_width = max_x - min_x;
		var obj_height = max_y - min_y;

		function setImageTexture(texture)
		{
			if(imgProp.repeat)
			{
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.x = 1 / obj_width * imgProp.rows;
				texture.repeat.y = 1 / obj_width * imgProp.cols;
				texture.offset.set(min_x / obj_width, -min_y / obj_height);
			}
			else
			{
				texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
				texture.offset.x = imgProp.xPos;
				texture.offset.y = imgProp.yPos;
				// texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				// texture.offset.x = min_x / obj_width + imgProp.xPos;
				// texture.offset.y = -min_y / obj_height + imgProp.yPos;
				// texture.repeat.set( 1 / obj_width, 1 / obj_height );
				// texture.flipY = true;
			}
			texture.flipY = imgProp.flipY;
			var group = new THREE.Group();
			var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true,side: THREE.DoubleSide } );
			var imgGeometry = new THREE.PlaneGeometry(obj_width, obj_height, 1, 1);
			var imgMesh = new THREE.Mesh(imgGeometry, material);
			imgMesh.position.x = min_x + obj_width * 0.5;
			imgMesh.position.y = min_y + obj_height * 0.5;
			imgMesh.position.z = raiseHeight + baseHeigth + 0.2;

			if(baseHeigth > 0)
			{
				var californiaShape = new THREE.Shape(points);
				var geometry = new THREE.ShapeBufferGeometry( californiaShape );
				var extrudeSettings = { amount: baseHeigth, bevelEnabled: false, bevelSegments: 1, steps: 1, bevelSize: 1, bevelThickness: 1 };
				var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings );
				var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
				mesh.position.z = raiseHeight;
				group.add(mesh);
			}
			group.add(imgMesh);
			if(imgProp.flipX)
				imgMesh.scale.x = 1;
			else
				imgMesh.scale.x = -1;
			callback.call(main, group);
		}

		if(angle != 0)
		{
			var img = new Image();
			img.src = bgImagePath;
			img.onload = function()
			{
				var mapCanvas = document.createElement('canvas');
				var width = img.width;
				var height = img.height;
				mapCanvas.width = width;
				mapCanvas.height = height;

				var ctx = mapCanvas.getContext( '2d' );
				ctx.translate( width / 2, height / 2 );

				if(angle == 1)
				{
					ctx.rotate( angle * Math.PI / 2 );
					ctx.translate( -height / 2, -width / 2 );
					ctx.drawImage( img, 0, 0, height, width );
				}
				else if(angle == 2)
				{
					ctx.rotate( angle * Math.PI / 2 );
					ctx.translate( -width / 2, -height / 2 );
					ctx.drawImage( img, 0, 0, width, height );
				}
				else if(angle == 3)
				{
					ctx.rotate( angle * Math.PI / 2 );
					ctx.translate( -height / 2, -width / 2 );
					ctx.drawImage( img, 0, 0, height, width );
				}

				var texture = new THREE.Texture( mapCanvas );
				texture.needsUpdate = true;

				setImageTexture(texture);
			}
		}
		else
		{
			var texture = this.textureLoader.load(bgImagePath, function()
			{
				setImageTexture(texture);
			});
		}
	}

	this.getPointsFromLine = function(pt1, pt2, edge_pt1, edge_pt2, edge_pt3, edge_pt4, space)
	{
		var points = [];
		var flineParallel = getParallelLineFromDistance(pt1, pt2, space, 1);
		var flineEdge1 = getFormulaLineFromTwoPoints(edge_pt1, edge_pt2);
		var flineEdge2 = getFormulaLineFromTwoPoints(edge_pt3, edge_pt4);

		points.push(getIntersectionFromTwoLines(flineParallel, flineEdge1));
		points.push(getIntersectionFromTwoLines(flineParallel, flineEdge2));

		var flineParalle2 = getParallelLineFromDistance(pt1, pt2, space, -1);
		points.push(getIntersectionFromTwoLines(flineParalle2, flineEdge2));
		points.push(getIntersectionFromTwoLines(flineParalle2, flineEdge1));
		return points;
	}

	this.createBlockTitle = function(title, title_pos, angle)
	{
		var gTextTitle = new THREE.Group();
		var size = g_appOptions.chairSize * 2;
		var curveSegments = 4;
		bevelThickness = 2;
		bevelSize = 1.5;
		var textGeo = new THREE.TextGeometry(title,
		{
			font: this.font,
			size: size,
			height: 1,
			curveSegments: curveSegments,
			bevelThickness: bevelThickness,
			bevelSize: bevelSize,
			bevelEnabled: false,
			material: 0,
			extrudeMaterial: 0
		});
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
		var centerOffsetX = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		var centerOffsetY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

		textMesh1 = new THREE.Mesh( textGeo, new THREE.MeshBasicMaterial({color: 0x3030ff}) );
		textMesh1.position.x = centerOffsetX;
		textMesh1.position.y = centerOffsetY;
		// textMesh1.position.z = z;
		// textMesh1.rotation.x = 0;
		// textMesh1.rotation.y = Math.PI * 2;
		// textMesh1.rotation.z = 0;
		gTextTitle.add(textMesh1);

		gTextTitle.position.set(title_pos.x, title_pos.y, title_pos.z + size * 0.7);
		// gTextNumber.rotation.z = aspect;
		// gTextNumber.rotation.x = 3.14 * 0.5;

		// var vector = new THREE.Vector3(camera.position.x - gTextNumber.position.x, camera.position.z - gTextNumber.position.y, camera.position.y - gTextNumber.position.z);
		// vector.normalize();
		// gTextNumber.rotation.set(vector.x, vector.y, vector.z);
		gTextTitle.rotation.set(Math.PI * 0.5, angle, 0);
		gTextTitle.obj_type = 'title';

		return gTextTitle;
	}

	this.create3DBlock = function(lines, prop, rate, isNumber)
	{
		var groupBlock = new THREE.Group();
		groupBlock.prop = prop;

		var baseHeigt = prop.baseheight * rate;
		var layerHeight = prop.layerHeight * rate;
		var lineSpace = prop.lineSpace * 0.5 * rate;
		var blockPoints = prop.blockPoints;
		var raiseHeight = prop.raiseHeight;


		// var property = {};
		// if(prop.shapeProp)
		// {
		// 	property.shapeProp = {};
		// 	property.shapeProp.row = prop.shapeProp.row;
		// }

		if(lines.length < 1)
			return;

		var isline = false;
		if(layerHeight == 0)
			isline = true;

		var nChops = prop.upstair;
		if(nChops <= 0)
			nChops = 1;
		if(nChops >= lines.length)
			nChops = lines.length - 1;

		var rail_width = 0.3;
		var pt1, pt2, pt3, pt4;
		var lineEndInex = lines[lines.length - 1].lineIndex;
		// var ptRailsLeft = [];
		// var ptRailsRight = [];
		var line_aspect = false;
		for(var i = 0; i < lines.length; i++)
		{
			var lineIndex = lines[i].lineIndex;
			var e11 = lines[i].edge_index1;
			var e12 = e11 + 1;
			if(e11 == blockPoints.length - 1)
				e12 = 0;
			var e21 = lines[i].edge_index2;
			var e22 = e21 + 1;
			if(e21 == blockPoints.length - 1)
				e22 = 0;
			if(e11 == e21 || e11 == e22)
			{
				if(Math.abs(getDistancePoint2Line(blockPoints[e11], lines[i].p1, lines[i].p2)) < lineSpace)
					continue;
			}
			else if(e12 == e21 || e12 == e22)
			{
				if(Math.abs(getDistancePoint2Line(blockPoints[e12], lines[i].p1, lines[i].p2)) < lineSpace)
					continue;
			}

			var points = this.getPointsFromLine(lines[i].p1, lines[i].p2, blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], lineSpace);
			if(points == null)
				continue;

			// var aspect = Math.atan2(lines[i].p2.y - lines[i].p1.y, lines[i].p2.x - lines[i].p1.x);
			if(!prop.isShape && i == 0 && lines.length > 1)
			{
				if(Math.abs(getDistancePoint2Line(points[0], lines[1].p1, lines[1].p2)) < Math.abs(getDistancePoint2Line(points[3], lines[1].p1, lines[1].p2)))
					line_aspect = true;
			}
			if(line_aspect)
			{
				var temp1 = points[0];
				points[0] = points[3];
				points[3] = temp1;
				var temp2 = points[1];
				points[1] = points[2];
				points[2] = temp2;
			}
			if(prop.block_aspect)
			{
				var temp1 = points[0];
				points[0] = points[1];
				points[1] = temp1;
				var temp2 = points[2];
				points[2] = points[3];
				points[3] = temp2;
			}
			if(lineIndex == 0)
			{
				if(prop.wall_front)
				{
					if(lines.length > 1)
					{
						var rail_baseheight = 0.2 + baseHeigt + raiseHeight;
						if(prop.handrail_img)
						{
							this.addHandRailWithImage(groupBlock, points[0], points[1], prop.handrail_img, rail_baseheight, prop.handrail_height);
						}
						else
						{
							var points1 = this.getPointsFromLine(points[0], points[1], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);
							var points2 = this.getPointsFromLine(points[2], points[3], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);

							if(Math.abs(getDistancePoint2Line(points1[0], lines[1].p1, lines[1].p2)) > Math.abs(getDistancePoint2Line(points2[0], lines[1].p1, lines[1].p2)))
								groupBlock.add(this.addBox(points1, rail_baseheight, prop.handrail_height, prop.backColor, wall_opacity));
							else
								groupBlock.add(this.addBox(points2, rail_baseheight, prop.handrail_height, prop.backColor, wall_opacity));
						}
					}
					else
					{
						var points2 = this.getPointsFromLine(points[0], points[1], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);
						groupBlock.add(this.addBox(points2, rail_baseheight, prop.handrail_height, prop.backColor, wall_opacity));
					}
				}
			}
			if(lineIndex == lineEndInex)
			{
				if(prop.wall_back)
				{
					var rail_baseheight = 0.2 + baseHeigt + raiseHeight + layerHeight * lineIndex;
					if(prop.handrail_img)
					{
						this.addHandRailWithImage(groupBlock, points[0], points[1], prop.handrail_img, rail_baseheight, prop.handrail_height);
					}
					else
					{
						if(lines.length > 1)
						{
							var points1 = this.getPointsFromLine(points[0], points[1], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);
							var points2 = this.getPointsFromLine(points[2], points[3], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);

							// var dis1 = getDistancePoint2Line(points1[0], lines[lines.length - 2].p1, lines[lines.length - 2].p2);
							// var dis2 = getDistancePoint2Line(points2[0], lines[lines.length - 2].p1, lines[lines.length - 2].p2);
							if(Math.abs(getDistancePoint2Line(points1[0], lines[lines.length - 2].p1, lines[lines.length - 2].p2)) > Math.abs(getDistancePoint2Line(points2[0], lines[lines.length - 2].p1, lines[lines.length - 2].p2)))
								groupBlock.add(this.addBox(points1, rail_baseheight, prop.handrail_height, prop.backColor));
							else
								groupBlock.add(this.addBox(points2, rail_baseheight, prop.handrail_height, prop.backColor));
						}
						else
						{
							var points1 = this.getPointsFromLine(points[0], points[1], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);
							// var points2 = this.getPointsFromLine(points[2], points[3], blockPoints[e11], blockPoints[e12], blockPoints[e21], blockPoints[e22], 0.15);
							groupBlock.add(this.addBox(points1, rail_baseheight, prop.handrail_height, prop.backColor));
						}
					}
				}
			}
			if(prop.wall_left)
			{
				var pt1 = points[0];
				var pt2 = points[1];
				var pt3 = points[2];
				var pt4 = points[3];
				var rail_baseheight = 0.2 + baseHeigt + raiseHeight + layerHeight * lineIndex;
				var dd1 = getDistanceFromTwoPoints(pt2, pt1);
				var dd2 = getDistanceFromTwoPoints(pt4, pt3);
				if(prop.handrail_img)
				{
					var rail_w = -0.1;
					var pp1 = new THREE.Vector2(pt1.x + rail_w / dd1 * (pt2.x - pt1.x), pt1.y + rail_w / dd1 * (pt2.y - pt1.y));
					var pp2 = new THREE.Vector2(pt4.x + rail_w / dd2 * (pt3.x - pt4.x), pt4.y + rail_w / dd2 * (pt3.y - pt4.y));
					this.addHandRailWithImage(groupBlock, pp1, pp2, prop.handrail_img, rail_baseheight, prop.handrail_height, prop.handrail_height + layerHeight);
				}
				else
				{
					var pp1 = new THREE.Vector2(pt1.x + rail_width / dd1 * (pt2.x - pt1.x), pt1.y + rail_width / dd1 * (pt2.y - pt1.y));
					var pp2 = new THREE.Vector2(pt4.x + rail_width / dd2 * (pt3.x - pt4.x), pt4.y + rail_width / dd2 * (pt3.y - pt4.y));
					var points2 = [pt1, pp1, pp2, pt4];
					groupBlock.add(this.addWallWithoutMapping(points2, rail_baseheight, prop.handrail_height, prop.handrail_height + layerHeight, prop.backColor, wall_opacity));
				}
			}
			if(prop.wall_right)
			{
				var pt1 = points[0];
				var pt2 = points[1];
				var pt3 = points[2];
				var pt4 = points[3];
				var dd1 = getDistanceFromTwoPoints(pt2, pt1);
				var dd2 = getDistanceFromTwoPoints(pt4, pt3);
				var rail_baseheight = 0.2 + baseHeigt + raiseHeight + layerHeight * lineIndex;
				if(prop.handrail_img)
				{
					var rail_w = -0.1;
					var ppp1 = new THREE.Vector2(pt2.x + rail_w / dd1 * (pt1.x - pt2.x), pt2.y + rail_w / dd1 * (pt1.y - pt2.y));
					var ppp2 = new THREE.Vector2(pt3.x + rail_w / dd2 * (pt4.x - pt3.x), pt3.y + rail_w / dd2 * (pt4.y - pt3.y));
					this.addHandRailWithImage(groupBlock, ppp1, ppp2, prop.handrail_img, rail_baseheight, prop.handrail_height, prop.handrail_height + layerHeight);
				}
				else
				{
					var ppp1 = new THREE.Vector2(pt2.x + rail_width / dd1 * (pt1.x - pt2.x), pt2.y + rail_width / dd1 * (pt1.y - pt2.y));
					var ppp2 = new THREE.Vector2(pt3.x + rail_width / dd2 * (pt4.x - pt3.x), pt3.y + rail_width / dd2 * (pt4.y - pt3.y));
					var points2 = [ppp1, pt2, pt3, ppp2];
					groupBlock.add(this.addWallWithoutMapping(points2, rail_baseheight, prop.handrail_height, prop.handrail_height + layerHeight, prop.backColor, wall_opacity));
				}
			}

			var box;
			if(prop.upstair > 0)
			{
				if(nChops > i)
					box = this.addBox(points, 0.2 + baseHeigt + raiseHeight - layerHeight, layerHeight * (lineIndex + 1), prop.backColor);
				else
					box = this.addBox(points, raiseHeight, 0.2 + baseHeigt + layerHeight * lineIndex, prop.backColor);
			}
			else
			{
				// if(i > 2)
				// 	groupBlock.add(this.addBox(points, 0.2 + baseHeigt + layerHeight * (lineIndex - 2), layerHeight * 2, prop.backColor));
				// else
					box = this.addBox(points, raiseHeight, 0.2 + baseHeigt + layerHeight * lineIndex, prop.backColor);
			}
			box.castShadow = false;
			box.receiveShadow = false;
			box.lineIndex = lineIndex;
			var sum_x = 0, sum_y = 0;
			for(var k = 0; k < points.length; k++)
			{
				sum_x += points[k].x;
				sum_y += points[k].y;
			}
			var center_point = {
				x: sum_x / points.length,
				y: sum_y / points.length,
				z: raiseHeight + baseHeigt + layerHeight * lineIndex + 5,
			}
			box.pos_ = center_point;
			groupBlock.add(box);

			if(!prop.isStair && lines[i].textNumber)
			{
				var size = 2;
				var d = getDistanceFromTwoPoints(lines[i].p1, lines[i].p2);
				var px = lines[i].p1.x - size * (lines[i].p2.x - lines[i].p1.x) / d;
				var py = lines[i].p1.y - size * (lines[i].p2.y - lines[i].p1.y) / d;
				groupBlock.add(this.addTextNumber(lines[i].textNumber.toString(), px, py, 0.2 + size + baseHeigt + raiseHeight + layerHeight * lineIndex + 0.1, prop.angle, size));
			}
		}

		if(prop.title && prop.showLabel3D)
		{
			var title_pos = sh_global.getCenterPos(blockPoints);
			title_pos.z = baseHeigt + raiseHeight + (layerHeight + 1) * lines.length * 0.5;
			groupBlock.add(this.createBlockTitle(prop.title, title_pos, prop.angle));
		}

		return groupBlock;
	}

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	var spriteAlignment = {x:1, y:1};
		
	var canvas = document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width + fontsize * 0.5;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize + borderThickness, borderThickness * 2);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100, 50, 0.0);
	// sprite.position.set(-100, -50, 0);
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}
	this.addTextNumber = function(text, x, y, z, aspect, size_)
	{

	// var spritey = makeTextSprite(text, 
	// 	{ fontsize: 16, borderThickness: 2, borderColor: {r:255, g:128, b:128, a:1.0}, backgroundColor: {r:255, g:255, b:255, a:1.0} } );
	// spritey.position.set(x, y, z);
	// // scene.add( spritey );
	// return spritey;
		var size = g_appOptions.chairSize * 0.6;
		var gTextNumber = new THREE.Group();
		// var californiaPts = [];
		// californiaPts.push( new THREE.Vector2(-size, -size) );
		// californiaPts.push( new THREE.Vector2(size, -size) );
		// californiaPts.push( new THREE.Vector2(size, size) );
		// californiaPts.push( new THREE.Vector2(-size, size) );
		var circleShape = new THREE.Shape(  );
		var circleRadius = size * 0.5;
		circleShape.moveTo( 0, circleRadius );
		circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
		circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
		circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
		circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );
		// var extrudeSettings = { amount: 0.1, bevelEnabled: false };
		// var geometry = new THREE.ExtrudeGeometry( californiaShape, extrudeSettings );
		var geometry = new THREE.ShapeBufferGeometry( circleShape );
		var meshBg = new THREE.Mesh(geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));

		gTextNumber.add( meshBg );

		curveSegments = 4;
		bevelThickness = 2;
		bevelSize = 1.5;
		var textGeo = new THREE.TextGeometry(text,
		{
			font: this.font,
			size: size * 0.4,
			height: 0,
			curveSegments: 1,
			bevelThickness: 0,
			bevelSize: 0,
			bevelEnabled: false,
			material: 0,
			extrudeMaterial: 0,
		});
		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();
		var centerOffsetX = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
		var centerOffsetY = -0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

		textMesh1 = new THREE.Mesh( textGeo, this.materialText );
		textMesh1.position.x = centerOffsetX;
		textMesh1.position.y = centerOffsetY;
		textMesh1.position.z = 0.1;
		// textMesh1.position.z = z;
		// textMesh1.rotation.x = 0;
		// textMesh1.rotation.y = Math.PI * 2;
		// textMesh1.rotation.z = 0;
		gTextNumber.add( textMesh1 );

		gTextNumber.position.set(x, y, z + size * 0.7);
		gTextNumber.rotation.set(Math.PI * 0.5, aspect, 0);
		gTextNumber.obj_type = 'SeatNumber';

		return gTextNumber;
		// group.add(gTextNumber);
	}

	this.addLine = function(p1, p2, height, color)
	{
		var californiaPts = [];
		californiaPts.push( p1 );
		californiaPts.push( p2 );
		var californiaShape = new THREE.Shape( californiaPts );
		var extrudeSettings = { amount: height, bevelEnabled: false };
		// var points = shape.createPointsGeometry();
		var line = new THREE.Line( spacedPoints, new THREE.LineBasicMaterial( { color: color, linewidth: 3 } ) );
		groupScene.add(line);
	}

	this.addHandRailWithImage = function(groupBlock, point1, point2, imagefile, baseheight, height1, height2)
	{
		var texture = this.textureLoader.load(imagefile, function()
		{
			var width = getDistanceFromTwoPoints(point1, point2);
			var height = height1;
			var imgWidth = texture.image.width;
			var imgHeight = texture.image.height;

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			var nRow = parseInt((imgHeight / height) * (width / imgWidth));
			texture.repeat.x = nRow;
			texture.repeat.y = 1;
			var material = new THREE.MeshBasicMaterial({
				map: texture,
				// color: 0xff0000,
				overdraw: true,
				side: THREE.DoubleSide
			});
			var imgGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
			if(height2 > 0) {
				// function createCustomPlan(v1, v2, v3, v4) {
				// 	var geo = new THREE.Geometry();
				// 	geo.vertices.push(
				// 		v1, v2, v3, v4
				// 	);
				// 	geo.faces.push(
				// 		new THREE.Face3(2, 1, 0),//use vertices of rank 2,1,0
				// 		new THREE.Face3(3, 1, 2)//vertices[3],1,2...
				// 	);
				// 	return geo;
				// }
				imgGeometry.vertices[0].y += (height2 - height1);
				// imgGeometry.vertices[2].y += (height2 - height1);
				imgGeometry.vertices[3].y -= (height2 - height1);
			}
			var mesh = new THREE.Mesh(imgGeometry, material);
			mesh.position.set((point1.x + point2.x) * 0.5, (point1.y + point2.y) * 0.5, baseheight + height * 0.5);
			mesh.rotation.x = Math.PI * 0.5;
			mesh.rotation.y = Math.atan2(point1.y - point2.y, point1.x - point2.x);

			groupBlock.add(mesh);
		});
	}

	this.addWallWithoutMapping = function(points, baseheight, height1, heigh2, color, opacity, materialType)
	{
		var shape = new THREE.Shape(points);
		var geometry = new THREE.ExtrudeGeometry(shape, { amount: height1, bevelEnabled: false });
		if(heigh2 > 0)
		{
			if(geometry.vertices[6].x == points[2].x && geometry.vertices[6].y == points[2].y) {
				geometry.vertices[6].z = heigh2;
				geometry.vertices[7].z = heigh2;
			}
			else {
				geometry.vertices[4].z = heigh2;
				geometry.vertices[5].z = heigh2;
			}
		}
		var material;
		if(materialType == 'phong')
		{
			material = new THREE.MeshPhongMaterial({color: color});
		}
		else if(materialType == 'lambert')
		{
			material = new THREE.MeshLambertMaterial({color: color});
		}
		else
		{
			material = new THREE.MeshPhongMaterial({ color: color });
		}
		if(opacity)
		{
			material.transparent = true;
			material.opacity = opacity;
		}
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set( 0, 0, baseheight );
		mesh.obj_type = 'box';
		mesh.castShadow = false;
		mesh.receiveShadow = render_castShadow;
		return mesh;
	}

	this.addBox = function(points, baseheight, height, color, opacity) {
		var shape = new THREE.Shape(points);

		var extrudeSettings = { amount: height, bevelEnabled: false };
		var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

		var material = new THREE.MeshLambertMaterial({
			color: color,
		});
		if(opacity)
		{
			material.transparent = true;
			material.opacity = opacity;
		}
		var mesh = new THREE.Mesh(geometry, material);
		mesh.obj_type = 'box';
		mesh.position.set( 0, 0, baseheight );
		return mesh;
	}

	function mergeMeshes (meshes) {
		var combined = new THREE.Geometry();

		for (var i = 0; i < meshes.length; i++) {
			meshes[i].updateMatrix();
			combined.merge(meshes[i].geometry, meshes[i].matrix);
		}

		return combined;
	}

	this.addChairs = function(block, seats, blockProp)
	{
		var bufferGeometry = new THREE.BufferGeometry();
		var positions = [];
		var normals = [];
		var shadow_bufferGeometry = new THREE.BufferGeometry();
		var shadow_positions = [];
		var shadow_normals = [];

		var vector = new THREE.Vector3();
		for(var i = 0; i < seats.length; i++)
		{
			var seat = seats[i];
			// this.addChairGroup(block, seat.x, seat.y, blockProp.baseheight + seat.lineIndex * blockProp.layerHeight, blockProp.angle, blockProp.seatColor);
			// continue;

			var pz = blockProp.baseheight + blockProp.raiseHeight + seat.lineIndex * blockProp.layerHeight;

			var scale = g_appOptions.chairSize;

			var geometryLeg = this.materialChairLeg.clone();
			geometryLeg.scale(scale, scale, scale);
			geometryLeg.rotateZ(blockProp.angle);
			geometryLeg.translate( seat.x, seat.y, pz );
			geometryLeg.faces.forEach( function ( face, index ) {
				if(index == 0 || index == 1 || index == 2 || index == 3)
				 	return;
				positions.push( geometryLeg.vertices[ face.a ].x );
				positions.push( geometryLeg.vertices[ face.a ].y );
				positions.push( geometryLeg.vertices[ face.a ].z );
				positions.push( geometryLeg.vertices[ face.b ].x );
				positions.push( geometryLeg.vertices[ face.b ].y );
				positions.push( geometryLeg.vertices[ face.b ].z );
				positions.push( geometryLeg.vertices[ face.c ].x );
				positions.push( geometryLeg.vertices[ face.c ].y );
				positions.push( geometryLeg.vertices[ face.c ].z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
			} );

			// var leg = this.chairLegTmp.clone();
			// leg.position.set(seat.x, seat.y, pz);
			// leg.scale.set(scale, scale, scale);
			// leg.rotation.set(0, 0, seat.angle);
			// block.add(leg);

			var mesh;
			var geometry = this.seatGeometry.clone();
			geometry.rotateX(Math.PI * 0.5);
			geometry.rotateZ(blockProp.angle - Math.PI * 0.5);
			geometry.scale(scale, scale, scale);
			geometry.translate(seat.x + scale * 0.5 * Math.cos(blockProp.angle), seat.y + 0.5 * scale * Math.sin(blockProp.angle), pz + scale);
			geometry.faces.forEach( function ( face, index ) {
				if(index == 8 || index == 9)
				 	return;
				positions.push( geometry.vertices[ face.a ].x );
				positions.push( geometry.vertices[ face.a ].y );
				positions.push( geometry.vertices[ face.a ].z );
				positions.push( geometry.vertices[ face.b ].x );
				positions.push( geometry.vertices[ face.b ].y );
				positions.push( geometry.vertices[ face.b ].z );
				positions.push( geometry.vertices[ face.c ].x );
				positions.push( geometry.vertices[ face.c ].y );
				positions.push( geometry.vertices[ face.c ].z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
				normals.push( face.normal.x );
				normals.push( face.normal.y );
				normals.push( face.normal.z );
			} );

			if(render_chair_shadow) {
				var geometry1 = this.chairGeo_shadow.clone();
				// geometry1.rotateX(Math.PI * 0.5);
				geometry1.rotateZ(blockProp.angle - Math.PI * 0.5);
				geometry1.scale(scale, scale, scale);
				geometry1.translate(seat.x + scale * 0.2, seat.y + 0.2 * scale, pz + 0.5);
				geometry1.faces.forEach(function( face, index ) {
					shadow_positions.push( geometry1.vertices[ face.a ].x );
					shadow_positions.push( geometry1.vertices[ face.a ].y );
					shadow_positions.push( geometry1.vertices[ face.a ].z );
					shadow_positions.push( geometry1.vertices[ face.b ].x );
					shadow_positions.push( geometry1.vertices[ face.b ].y );
					shadow_positions.push( geometry1.vertices[ face.b ].z );
					shadow_positions.push( geometry1.vertices[ face.c ].x );
					shadow_positions.push( geometry1.vertices[ face.c ].y );
					shadow_positions.push( geometry1.vertices[ face.c ].z );
					shadow_normals.push( face.normal.x );
					shadow_normals.push( face.normal.y );
					shadow_normals.push( face.normal.z );
					shadow_normals.push( face.normal.x );
					shadow_normals.push( face.normal.y );
					shadow_normals.push( face.normal.z );
					shadow_normals.push( face.normal.x );
					shadow_normals.push( face.normal.y );
					shadow_normals.push( face.normal.z );
				});
			}
		}
		bufferGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
		bufferGeometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );

		// console.log(positions.length);

		var chairMaterial = this.chairMaterial.clone();
		chairMaterial.color = new THREE.Color(blockProp.seatColor);
		var mesh = new THREE.Mesh( bufferGeometry, chairMaterial );
		// mesh.castShadow = false;
		// mesh.receiveShadow = false;
		mesh.obj_type = 'chair';
		block.add(mesh);

		positions = [];
		normals = [];

		shadow_bufferGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( shadow_positions, 3 ) );
		shadow_bufferGeometry.addAttribute( 'normal', new THREE.Float32BufferAttribute( shadow_normals, 3 ) );
		var chairshadowMaterial = this.material_chair_shaodow.clone();
		var mesh1 = new THREE.Mesh( shadow_bufferGeometry, chairshadowMaterial );
		mesh1.obj_type = 'shadow_chair';
		block.add(mesh1);
		shadow_positions = [];
		shadow_normals = [];
	}

	this.addChairGroup = function(block, px, py, pz, angle, seatColor)
	{
		var scale = g_appOptions.chairSize;
		var leg = this.chairLegTmp.clone();
		leg.position.set(px, py, pz);
		leg.scale.set(scale, scale, scale);
		leg.rotation.set(0, 0, angle);
		block.add(leg);

		var mesh;
		if(seatColor == defaultSeatColor)
		{
			mesh = this.chairTemple.clone();
		}
		else
		{
			var bsearch = false;
			for(var k = 0; k < this.chairMeshs.length; k++)
			{
				if(this.chairMeshs[k].color == seatColor)
				{
					bsearch = true;
					break;
				}
			}
			if(bsearch)
			{
				mesh = this.chairMeshs[k].mesh.clone();
			}
			else
			{
				var chairMaterial = new THREE.MeshLambertMaterial( { color: seatColor } )
				var newMeshTemple = new THREE.Mesh( this.seatGeometry, chairMaterial );
				this.chairMeshs.push({
					color: seatColor,
					mesh: newMeshTemple,
				});
				mesh = newMeshTemple.clone();
			}
		}
		mesh.position.set(px + scale * 0.5 * Math.cos(angle), py + 0.5 * scale * Math.sin(angle), pz + scale * 1.0);
		mesh.scale.set(scale, scale, scale);
		mesh.rotation.set(Math.PI * 0.5, angle - Math.PI * 0.5, 0);
		block.add(mesh);
	}

	this.addLight = function(block, px, py, pz, obj, isRealLight)
	{
		if(obj.lightType == 'bulb') {
			var bulbGeometry = new THREE.SphereGeometry(3, 12, 12);
			bulbMat = new THREE.MeshStandardMaterial({
				emissive: obj.lightColor,
				emissiveIntensity: obj.intensity,
				color: obj.lightColor
			});

			if(isRealLight && obj.isRealLight) {
				var bulbLight = new THREE.PointLight(obj.lightColor, obj.intensity, obj.range, 2);
				bulbLight.castShadow = render_castShadow;
				// bulbLight.shadow = null;
				if(obj.isShowBulb)
					bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
				bulbLight.position.set(px, py, -pz);
				block.add(bulbLight);
			}
			else {
				if(obj.isShowBulb) {
					var lamp = new THREE.Mesh(bulbGeometry, bulbMat);
					lamp.position.set(px, py, -pz);
					block.add(lamp);
				}

				var material = new THREE.MeshBasicMaterial( { color: obj.lightColor, map: lightTexture, transparent: true, opacity: 0.9, side: THREE.DoubleSide } );
				var geometry = new THREE.PlaneGeometry(64, 64, 1, 1);
				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(px, py, -0.2);
				block.add(mesh);
			}
		}
		else if(obj.lightType == 'spot') {
			var posAbslight = new THREE.Vector3(block.parent.position.x + px, block.parent.position.z + pz, block.parent.position.y + py);
			var lampHeight = block.parent.position.z;
			var light_taget_posX = obj.lightProperty.targetPos.x;
			var light_taget_posY = obj.lightProperty.targetPos.y;
			if(light_taget_posX == 0 && light_taget_posY == 0)
				light_taget_posX = 0.5;
			var light_taget_radius = obj.lightProperty.targetRadius;
			var attenuation = obj.lightProperty.attenuation;
			var anglePower = obj.lightProperty.anglePower;

			if(obj.isRealLight) {
				var light = new THREE.SpotLight(obj.lightColor, obj.intensity, obj.range, 0.2, 1.0, 2);
				light.castShadow = render_castShadow;
				light.position.set(px, py, -pz);
				light.target.position.set(light_taget_posX, light_taget_posY, -lampHeight);
			}

			var cylinderHeight = obj.range;
			// var material = new THREE.MeshLambertMaterial( {color: obj.lightColor} );

			var material	= new THREEx.VolumetricSpotLightMaterial();
			material.uniforms.lightColor.value.set(obj.lightColor);
			material.uniforms.spotPosition.value = posAbslight;
			material.uniforms.attenuation.value = attenuation;
			material.uniforms.anglePower.value = anglePower;

			function createrCylinder(r1, r2, vstart, vend, material) {
				var HALF_PI = Math.PI * .5;
				var distance = vstart.distanceTo(vend);
				var position  = vend.clone().add(vstart).divideScalar(2);

				var cylinder = new THREE.CylinderGeometry(r1, r2, distance, 32, 10, true);

				var orientation = new THREE.Matrix4();//a new orientation matrix to offset pivot
				var offsetRotation = new THREE.Matrix4();//a matrix to fix pivot rotation
				var offsetPosition = new THREE.Matrix4();//a matrix to fix pivot position
				orientation.lookAt(vstart,vend,new THREE.Vector3(0,0,1));//look at destination
				offsetRotation.makeRotationX(HALF_PI);//rotate 90 degs on X
				orientation.multiply(offsetRotation);//combine orientation with rotation transformations
				cylinder.applyMatrix(orientation)

				var mesh = new THREE.Mesh(cylinder, material);
				mesh.position.copy(position);
				return mesh;
			}
			var target = new THREE.Vector3(light_taget_posX, light_taget_posY, -lampHeight);
			target.multiplyScalar(1.4);
			cylinder = createrCylinder(0.1, light_taget_radius, new THREE.Vector3(px, py, pz), target, material);
			// cylinder.rotation.y = Math.PI;

			block.add(cylinder);
			if(obj.isRealLight) {
				block.add(light);
				block.add(light.target);
			}
		}
	}
	
	this.createMeshChairTemp = function(seatColor)
	{
	}

	this.initSeatMesh = function()
	{
		// var mesh = new THREE.Mesh(mergeMeshes(this.seatMeshes), this.chairMaterial);
		// scene.add(mesh);
	}

	this.animate = function()
	{
		TWEEN.update();
		requestAnimationFrame( main.animate );
	    if(main.isMobile) {
			controls.update();
			main.render();
	    }
		aryVideoBuffers.forEach(function(updateFn){
			updateFn();
		})

		if(groupObjects)
		{
			for(var i = 0; i < groupObjects.children.length; i++)
			{
				var tempIndex = -1;
				var obj = groupObjects.children[i];
				if(obj.obj_type == 'block') {
					for(var k = 0; k < obj.children.length; k++)
					{
						var group = obj.children[k];
						if(group.type == 'Group' && group.obj_type == 'SeatNumber' || group.obj_type == 'title')
						{
							group.rotation.set(Math.PI * 0.5, controls.getAzimuthalAngle(), 0);
						}
					}
				}
				else if(obj.obj_type == 'shape') {
					for(var k = 0; k < obj.children.length; k++)
					{
						var block = obj.children[k];
						block.children.forEach(function(child, index) {
							if(child.type == 'Group' && child.obj_type == 'SeatNumber' || child.obj_type == 'title')
							{
								child.rotation.set(Math.PI * 0.5, controls.getAzimuthalAngle(), 0);
							}
						})
					}
				}
			}
		}
		if(clickedCameraView)
		{
			main.mouseMove();
			main.render();
		}
	}

	this.render = function()
	{
		renderer.render( scene, camera );
	}

	this.resizeWindow = function()
	{
		var width = init_width, height = init_height;
		if($('#main-area').css('display') == 'none')
		{
			width = window.innerWidth;
			var height = window.innerHeight * 0.6;
			var resl = window.innerHeight - $('#menu-area').height();
			// height = Math.min(window.innerHeight - $('#menu-area').height(), height);
			// height = window.innerHeight - $('#menu-area').height();

			$('#preview_2d').css('top', height - $('#preview_2d').height() + 20);
		}
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize( width, height );
	  //   if(!this.isMobile)
			// controls.handleResize();

		// dirLightShadowMapViewer.updateForWindowResize();
		// spotLightShadowMapViewer.updateForWindowResize();

		main.render();
	}

	this.onWindowResize = function()
	{
		main.resizeWindow();
		// windowHalfX = window.innerWidth / 2;
		// windowHalfY = window.innerHeight / 2;
	}

	var clickedCameraView = false;
	var mMousePos = new THREE.Vector2(3000, 3000);
	this.initEvent = function()
	{
		var mouseX = 0;
		var mouseXOnMouseDown = 0;

		var windowHalfX = window.innerWidth / 2;
		var windowHalfY = window.innerHeight / 2;

		window.addEventListener( 'resize', this.onWindowResize, false );
		renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
		renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );

	
		// window.addEventListener("deviceorientation", function(event) {
		// 	// process event.alpha, event.beta and event.gamma
		// 	console.log(event.alpha);
		// 	alpha = parseInt(event.alpha * 100) / 100;
		// 	beta = parseInt(event.beta * 100) / 100;
		// 	gamma = parseInt(event.gamma * 100) / 100;
		// 	$('#test_device #device_alpha').text('alpha = ' + alpha)
		// 	$('#test_device #device_beta').text('beta = ' + beta)
		// 	$('#test_device #device_gamma').text('gamma = ' + gamma)
		// }, true);

		function onDocumentMouseUp( event ) {
			event.preventDefault();
		    var isRightMB;
		    e = event || window.event;
		    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		        isRightMB = e.which == 3; 
		    else if ("button" in e)  // IE, Opera 
		        isRightMB = e.button == 2;
		    if(isRightMB)
		    	return;

			if(IsPreview3DVersion())
			{
				var clickedData = main.getObjectFromMouse();
				if(clickedData)
				{
					var obj = clickedData.object;
					var lineIndex = clickedData.lineIndex;
					var position = clickedData.position;
					var blockIndex = gcreatedObjs.indexOf(obj.object);
					
					mTicketViewMouse.resetTicket(position, lineIndex, controls.getAzimuthalAngle(), blockIndex);
					$('#btn_3dcamera_view').css('opacity', 1);
					var title = obj.title;
					if(!title)
						title = 'block';
					$('#preview_ticket').show();
					$('#preview_ticket .title').text(title + '-' + blockIndex + ': Row ' + lineIndex);
				}
			}
			else
			{
				if(clickedCameraView)
				{
		    		clickedCameraView = false;
					var mouse = new THREE.Vector2();
					var offset = $(event.target).offset();
					mouse.x = ( (event.clientX - offset.left) / event.target.clientWidth ) * 2 - 1;
					mouse.y = - ( (event.clientY - offset.top) / event.target.clientHeight ) * 2 + 1;
					main.animationCamFromObject(pickedObject);
				}
				main.mouseMove(true);
		    	$('#btn_3dcamera_view .on').show();
		    	$('#btn_3dcamera_view .off').hide();
		    }
		}

		function onDocumentMouseMove( event ) {
			event.preventDefault();
			var scrollOffset = $(document).scrollTop();
			var offset = $(event.target).offset();
			mMousePos.x = ( (event.clientX - offset.left) / event.target.clientWidth ) * 2 - 1;
			mMousePos.y = - ( (event.clientY - offset.top + scrollOffset) / event.target.clientHeight ) * 2 + 1;
		}

	    // $('#preview_3d').dblclick(function(e) {
		   //  main.setFullScreen(!main.fullscreen);
	    // })
	    $('#btn_3dpreview_zoom').click(function(e)
	    {
	    	if(main.fullscreen)
	    	{
		    	$('#btn_3dpreview_zoom .off').hide();
		    	$('#btn_3dpreview_zoom .on').show();
	    	}
	    	else
	    	{
		    	$('#btn_3dpreview_zoom .off').show();
		    	$('#btn_3dpreview_zoom .on').hide();
	    	}
	    	main.setFullScreen(!main.fullscreen);
	    })

	    $('#btn_3dcamera_view').click(function(e)
	    {
	    	if(IsPreview3DVersion())
	    	{
	    		if(mTicketViewMouse.ticketView.visible)
	    		{
		    		$(this).css('opacity', 0);
					main.animationCamWithPos(mTicketViewMouse.position, function() {
		    			mTicketViewMouse.hide();
					});
	    		}
	    	}
	    	else
	    	{
		    	$('#btn_3dcamera_view .on').hide();
		    	$('#btn_3dcamera_view .off').show();
		    	clickedCameraView = true;
		    }
			event.preventDefault();
			event.stopPropagation();
	    })

	    $('#btn_preview_refresh').click(function(e)
	    {
			camera.position.x = initCameraPos.x;
			camera.position.y = initCameraPos.y;
			camera.position.z = initCameraPos.z;
	   		if(!main.isMobile)
				controls.refreshTarget(new THREE.Vector3(0, 0, 0));
			main.render();
	    	event.preventDefault();
	    	event.stopPropagation();
	    })
	}

	this.getObjectFromMouse = function()
	{
		function pickBlockObject(obj)
		{
			var intersects = raycaster.intersectObjects( obj.children );
			if(intersects.length > 0)
			{
				if(intersects[0].object.obj_type == 'chair')
				{
					for(var i = 0; i < intersects.length; i++)
					{
						if(intersects[i].object.obj_type == 'box')
						{
							if(intersects[i].object.parent && intersects[i].object.parent.obj_type == 'block')
							{
								var lineIndex = intersects[i].object.lineIndex;
								return {
									object: intersects[i].object.parent.objectData,
									lineIndex: lineIndex,
									position: intersects[i].point,
								};
							}
						}
					}
				}
				else
				{
					return null;
				}
			}
			return null;
		}

		raycaster.setFromCamera( mMousePos, camera );

		for(var i = 0; i < groupObjects.children.length; i++)
		{
			var groupObject = groupObjects.children[i];
			if(groupObject.obj_type == 'shape')
			{
				for(var k = 0; k < groupObject.children.length; k++)
				{
					var res = pickBlockObject(groupObject.children[k]);
					if(res)
						return res;
				}
			}
			else if(groupObject.obj_type == 'block')
			{
				var res = pickBlockObject(groupObject);
				if(res)
					return res;
			}
			else if(groupObject.obj_type == 'wall' && groupObject.video)
			{
				var intersects = raycaster.intersectObjects( groupObject.children );
				if(intersects.length > 0)
				{
					groupObject.video.pauseOrResume();
				}
			}
		}
	}

	this.remove3DObject = function(obj)
	{
		if(obj.obj_type == 'wall') {
			var index = controls.collidableMeshes.indexOf(obj);
			if(index > -1)
				controls.collidableMeshes.splice(index, 1);
		}
		if(obj.type == 'Group')
		{
			for(var i = obj.children.length - 1; i >= 0 ; i --)
			{
				scene.remove(obj.children[i]);
				obj.remove(obj.children[i]);
			}
			if(obj.obj_type == 'wall' && obj.video)
			{
				obj.video.destroy();
				aryVideoBuffers.splice(obj.video.index, 1);
			}
		}
		else
		{
			scene.remove(obj);
		}
		groupObjects.remove(obj);
		obj = null;
	}

	this.removeAllObjects = function()
	{
		for(var i = groupObjects.children.length - 1; i >= 0 ; i --)
		{
			var obj = groupObjects.children[ i ];
			scene.remove(obj);
			groupObjects.remove(obj);
			obj = null;
		}
	}

	this.reset = function()
	{
		for ( var i = scene.children.length - 1; i >= 0 ; i -- ) {
			var obj = scene.children[ i ];
			if ( obj !== group && obj !== camera) {
				scene.remove(obj);
				obj = null;
			}
		}
		this.removeAllObjects();
	}

	this.search3DObject = function(index)
	{
		if(index >= groupObjects.children.length)
			return;
		var obj = groupObjects.children[index];
		return obj;
	}

	this.animationCamWithPos = function(newCamPos, callbackFinished)
	{
		var target_pos;
		if(g_appOptions.targetPosition)
			target_pos = new THREE.Vector3(g_appOptions.targetPosition.x, g_appOptions.targetPosition.z, g_appOptions.targetPosition.y);
		else
			target_pos = new THREE.Vector3(0, 0.5, -1400);
	    if(!main.isMobile)
			controls.animationCamWithPos(newCamPos, target_pos, callbackFinished);
	}

	this.animationCamFromObject = function(object)
	{
		if(object)
		{
			var title_pos = sh_global.getCenterPos(object.prop.blockPoints);
			var temp = title_pos.y;
			title_pos.y = object.prop.baseheight + (object.prop.layerHeight + 1) * object.prop.rows * 0.5 + 1.0;
			title_pos.z = -temp;

			this.animationCamWithPos(title_pos);
			return true;
		}
		return false;
	}

	this.setCameraHeight = function(height)
	{
		camera.position.y = height;
		controls.refreshTarget(new THREE.Vector3(0, 0, 0));
	}

	var pickedObject = null;
	this.mouseMove = function(removeAll)
	{
		if(!groupObjects || groupObjects.children.length == 0)
			return;

		function setEmissiveColor(obj, color)
		{
			var count = obj.prop.rows - 1;
			for(var i = 0; i < obj.children.length; i++)
			{
				if(count <= 0)
					return;
				var mesh = obj.children[i];
				if(mesh.type == 'Mesh')
				{
					if(mesh.material.emissive)
					{
						count--;
						mesh.material.emissive.setHex( color );
					}
				}
			}
		}
		function getEmissiveColor(obj)
		{
			for(var i = 0; i < obj.children.length; i++)
			{
				var mesh = obj.children[i];
				if(mesh.type == 'Mesh')
				{
					if(mesh.material.emissive)
						return mesh.material.emissive.getHex();
				}
			}
			return null;
		}
		function pickBlockObject(obj)
		{
			var intersects = raycaster.intersectObjects( obj.children );
			if(intersects.length > 0)
			{
				if ( pickedObject != obj )
				{
					if ( pickedObject )
					{
						setEmissiveColor(pickedObject, pickedObject.currentHex);
					}

					pickedObject = obj;
					pickedObject.currentHex = getEmissiveColor(pickedObject);
					setEmissiveColor(pickedObject, 0xff0000);
				}
				return true;
			}
			else
			{
				if ( pickedObject )
					setEmissiveColor(pickedObject, pickedObject.currentHex);
				pickedObject = null;
			}
			return false;
		}

		if(removeAll)
		{
			if(pickedObject)
			{
				setEmissiveColor(pickedObject, null);
			}
			pickedObject = null;
		}
		else
		{
			raycaster.setFromCamera( mMousePos, camera );

			for(var i = 0; i < groupObjects.children.length; i++)
			{
				var groupObject = groupObjects.children[i];
				if(groupObject.obj_type == 'shape')
				{
					for(var k = 0; k < groupObject.children.length; k++)
					{
						if(pickBlockObject(groupObject.children[k]))
							return;
					}
				}
				else if(groupObject.obj_type == 'block')
				{
					if(pickBlockObject(groupObject))
						return;
				}
			}
		}
	}

	this.setBlockObjWallImage = function(block, filePath)
	{

	}


	this.changeObject = function(obj, property)
	{
		// var obj = groupObjects.children[index];
		for(var key in property)
		{
			var value = property[key];
			if(key == 'wall_image')
			{
				if(obj.obj_type == 'shape' || obj.obj_type == 'block')
				{
					var filePath = value;
					if(filePath)
					{
						this.setObjWallImage(obj.m3dObj, filePath);
					}
				}
			}
			else if(key == 'backColor')
			{
				if(obj.obj_type == 'shape')
				{
					for(var i = obj.children.length - 1; i >= 0 ; i --)
					{
						var block = obj.children[i];
						for(var k = 0; k < block.children.length; k++)
						{
							var mesh = block.children[k];
							if(mesh.obj_type == 'box')
								mesh.material.color.set(value);
						}
					}
				}
				else
				{
					if(obj.obj_type == 'wall' || obj.obj_type == 'light')
					{
						if(obj.type == 'Group')
						{
							for(var i = 0; i < obj.children.length; i++)
								obj.children[i].material.color.set(value);
						}
						else
						{
							obj.material.color.set(value);
						}
					}
					else
					{
						if(obj.type == 'Mesh')
						{
							obj.material.color.set(value);
						}
						else
						{
							for(var k = 0; k < obj.children.length; k++)
							{
								var mesh = obj.children[k];
								if(mesh.obj_type == 'box')
									mesh.material.color.set(value);
							}
						}
					}
				}
			}
			else if(key == 'seatColor')
			{
				if(obj.obj_type == 'shape')
				{
					for(var i = obj.children.length - 1; i >= 0 ; i --)
					{
						var block = obj.children[i];
						for(var k = 0; k < block.children.length; k++)
						{
							var mesh = block.children[k];
							if(mesh.obj_type == 'chair')
								mesh.material.color.set(value);
						}
					}
				}
				else if(obj.obj_type == 'block')
				{
					for(var k = 0; k < obj.children.length; k++)
					{
						var mesh = obj.children[k];
						if(mesh.obj_type == 'chair')
							mesh.material.color.set(value);
					}
				}
			}
			else if(key == 'lightColor')
			{
				if(obj.obj_type == 'light')
				{
					for(var i = 0; i < obj.children.length; i++)
					{
						var light = obj.children[i];
						if(value.lightType == 'spot') {
							var cylinder = light.children[0];
							cylinder.material.uniforms.lightColor.value.set(value.color);
							if(value.isRealLight) {
								var spotLight = light.children[1];
								spotLight.color.set(value.color);
							}
						}
						else {
							if(value.isRealLight)
							{
								light.color.set(value.color);
								for(var k = 0; k < light.children.length; k++)
								{
									var bulb = light.children[k];
									if(bulb.material.emissive)
										bulb.material.emissive.set(value.color);
									bulb.material.color.set(value.color);
								}
							}
							else
							{
								light.material.color.set(value.color);
								if(light.material.emissive)
									light.material.emissive.set(value.color);
							}
						}
					}
				}
			}
			else if(key == 'materialType')
			{
				if(obj.obj_type == 'wall')
				{
					if(value == 'phong')
					{
						if(obj.type == 'Group')
						{
							for(var i = 0; i < obj.children.length; i++)
								obj.children[i].material = new THREE.MeshPhongMaterial({ color: obj.children[i].material.color });
						}
						else
						{
							obj.material = new THREE.MeshPhongMaterial({ color: obj.material.color });
						}
					}
					else if(value == 'lambert')
					{
						if(obj.type == 'Group')
						{
							for(var i = 0; i < obj.children.length; i++)
								obj.children[i].material = new THREE.MeshLambertMaterial({ color: obj.children[i].material.color });
						}
						else
						{
							obj.material = new THREE.MeshLambertMaterial({ color: obj.material.color });
						}
					}
				}
			}
			else if(key == 'move')
			{
				obj.position.x -= value.x;
				obj.position.y += value.y;
			}
			else if(key == 'show')
			{
				obj.visible = value;
			}
			else if(key == 'vert_angle' && obj.obj_type == 'light')
			{
				obj.rotation.y = value * Math.PI / 180;
			}
			else if(key == 'lightType' && obj.obj_type == 'light') {

			}
		}
	}

	this.changeAllChairSize = function(chairSize)
	{
		// for(var i = 0; i < groupObjects.children.length; i++)
		// {
		// 	var group = groupObjects.children[i];
		// 	if(group.obj_type == 'block' || group.obj_type == 'shape')
		// 	{
		// 		for(var k = 0; k < group.children.length; k++)
		// 		{
		// 			var mesh = group.children[k];
		// 			if(mesh.obj_type == 'chair')
		// 			{
		// 				mesh
		// 			}
		// 		}
		// 	}
		// }
	}

	this.init();
}


function getBlock(points, rows, seatspace, lineSpace)
{
	var lines = [];
	var axisindex = 0;
	var axisindex_end = 1;
	var axisindex_end = axisindex + 1;
	if(axisindex == points.length - 1)
		axisindex_end = 0;
	var distance = lineSpace;
	var sss = 1;
	var isFoundTargetPoints = false;
	var cntlines = 0;
	var targetPoints = [];
	
	var maxDistance = 0, maxDistance1 = 0, maxDistance2 = 0;
    var farIndex1 = axisindex, farIndex2 = axisindex, farIndex = 0;
	for(var i = 0; i < points.length; i++)
    {
        if(i == axisindex || i == axisindex_end)
            continue;
		var tmpd = getDistancePoint2Line(points[i], points[axisindex], points[axisindex_end]);
        var abstmpd = Math.abs(tmpd);
        if(tmpd > 0)
        {
            if(abstmpd > maxDistance1)
            {
                maxDistance1 = abstmpd;
                farIndex1 = i;
            }
        }
        else
        {
            if(abstmpd > maxDistance2)
            {
                maxDistance2 = abstmpd;
                farIndex2 = i;
            }
        }
	}
    if(maxDistance1 > maxDistance2)
        farIndex = farIndex2;
    else
        farIndex = farIndex1;
    maxDistance = maxDistance1 + maxDistance2;

	var lineIndex = 0;

	var block_aspect = true;

    var farPoint1 = points[farIndex];
    var farPoint2 = {
        x: farPoint1.x - (points[axisindex_end].x - points[axisindex].x),
        y: farPoint1.y - (points[axisindex_end].y - points[axisindex].y),
    }
	for(;;) {
		var fparline = getParallelLineFromDistance(farPoint1, farPoint2, distance, sss);
		targetPoints = null;
		targetPoints = [];
		for(var i = 0; i < points.length; i++) {
			if(i != axisindex) {
				var tendpointindex = i+1;
				if(i >= points.length - 1) tendpointindex = 0;
				var flineA = getFormulaLineFromTwoPoints(points[i], points[tendpointindex]);
				var targetPt = getIntersectionFromTwoLines(fparline, flineA);
				if(targetPt && isPointInLine(targetPt, points[i], points[tendpointindex]))
				{
					targetPoints.push({
						x: targetPt.x,
						y: targetPt.y,
						edge_index: i,
					});
				}
			}
		}

		if(targetPoints.length >= 2) {
			isFoundTargetPoints = true;
			for(var i = 0 ; i < targetPoints.length; i++) {
				for(var j = i + 1; j < targetPoints.length; j++) {
					if(targetPoints[i].x > targetPoints[j].x) {
						var tmpx, tmpy;
						tmpx = targetPoints[j].x;
						tmpy = targetPoints[j].y;
						targetPoints[j].x = targetPoints[i].x;
						targetPoints[j].y = targetPoints[i].y;
						targetPoints[i].x = tmpx;
						targetPoints[i].y = tmpy;
					}
				}
			}

			//console.log(targetPoints);
			for(i = 0; i < targetPoints.length; i+=2)
			{
				if(i+1 < targetPoints.length)
				{
					lines.push({
						p1: targetPoints[i],
						p2: targetPoints[i + 1],
						edge_index1: targetPoints[i].edge_index,
						edge_index2: targetPoints[i + 1].edge_index,
						lineIndex: lineIndex,
					});
					// this.drawLineAndSeat(targetPoints[i], targetPoints[i+1], bshowseats, lineIndex, sss);
					block_aspect = false;
				}
			}
            lineIndex++;
		}
		else {
			break;
		}

		distance += lineSpace;
		if(maxDistance <= distance + defaultSeatRadius) break;
	}
    cntlines = lineIndex;

	/*if(!isFoundTargetPoints)*/  {
		sss = -1;
		var distance = 0;//lineSpace;
		for(;;) {
			var fparline = getParallelLineFromDistance(farPoint1, farPoint2, distance, sss);
			targetPoints = null;
			targetPoints = [];
			for(var i = 0; i < points.length; i++) {
				if(i != axisindex) {
					var tendpointindex = i+1;
					if(i == points.length - 1) tendpointindex = 0;
					var flineA = getFormulaLineFromTwoPoints(points[i], points[tendpointindex]);
					var targetPt = getIntersectionFromTwoLines(fparline, flineA);
					if(targetPt != null && isPointInLine(targetPt, points[i], points[tendpointindex]))
					{
						targetPoints.push({
							x: targetPt.x,
							y: targetPt.y,
							edge_index: i,
						});
					}
				}
			}

			if(targetPoints.length >= 2)
			{
				if(distance == 0 && targetPoints.length < 3)
				{
					distance += lineSpace;
					continue;
				}

				isFoundTargetPoints = true;
				for(var i = 0 ; i < targetPoints.length; i++) {
					for(var j = i + 1; j < targetPoints.length; j++) {
						if(targetPoints[i].x > targetPoints[j].x) {
							var tmpx, tmpy;
							tmpx = targetPoints[j].x;
							tmpy = targetPoints[j].y;
							targetPoints[j].x = targetPoints[i].x;
							targetPoints[j].y = targetPoints[i].y;
							targetPoints[i].x = tmpx;
							targetPoints[i].y = tmpy;
						}
					}
				}
				
				for(i = 0; i < targetPoints.length - 1; i++) {
					if(Math.abs(targetPoints[i].x - targetPoints[i+1].x) < 0.1 && 
						Math.abs(targetPoints[i].y - targetPoints[i+1].y) < 0.1) {
						targetPoints.splice(i, 1);
					}
				}

				if(distance == 0 && targetPoints.length == 3) {
					if(Math.abs(points[axisindex].x - targetPoints[0].x) < 0.1 && 
						Math.abs(points[axisindex].y - targetPoints[0].y) < 0.1) {
						targetPoints.splice(0, 1);
					}
					else if(Math.abs(points[axisindex_end].x - targetPoints[0].x) < 0.1 && 
						Math.abs(points[axisindex_end].y - targetPoints[0].y) < 0.1) {
						targetPoints.splice(0, 1);
					}
					else if(Math.abs(points[axisindex].x - targetPoints[2].x) < 0.1 && 
						Math.abs(points[axisindex].y - targetPoints[2].y) < 0.1) {
						targetPoints.splice(2, 1);
					}
					else if(Math.abs(points[axisindex_end].x - targetPoints[2].x) < 0.1 && 
						Math.abs(points[axisindex_end].y - targetPoints[2].y) < 0.1) {
						targetPoints.splice(2, 1);
					}
				}

				for(i = 0; i < targetPoints.length; i+=2)
				{
					if(i+1 < targetPoints.length)
					{
						lines.push({
							p1: targetPoints[i],
							p2: targetPoints[i + 1],
							edge_index1: targetPoints[i].edge_index,
							edge_index2: targetPoints[i + 1].edge_index,
							lineIndex: lineIndex,
						});
						// this.drawLineAndSeat(targetPoints[i], targetPoints[i+1], bshowseats, lineIndex, sss);
					}
				}
                lineIndex++;
			}
			else {
				break;
			}

			distance += lineSpace;
			if(maxDistance <= distance + defaultSeatRadius) break;
		}
	}


	return lines;
}
