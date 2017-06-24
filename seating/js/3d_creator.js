
var C3DCreator = function(init_width, init_height, callbackLoaded)
{
	var main = this;
	var m3dview = null;

	var width_3d = 300;
	this.rate = 1;
	this.height_3d = 0;
	this.center_x = 0;
	this.center_y = 0;
	this.loadingCnt = 0;
	this.loaded = false;
	this.fullscreen = false;

	this.meshFloor = null;

	this.init = function()
	{
		m3dview = new C3DMain(init_width, init_height, callbackLoaded);
		this.initEvent();
	}

	this.initEvent = function()
	{
	}

	this.initPreview = function()
	{
		main.loaded = false;
		m3dview.initCameraEvent();

		var width = garena.width;
		var height = garena.height;
		width_3d = width;
		this.rate = 1;//width_3d / width;
		this.height_3d = garena.height * this.rate;
		if(IsPreview3DVersion())
		{
			this.center_x = (width * 0.5) * this.rate;
			this.center_y = (height * 0.5) * this.rate;
		}
		else
		{
			if(garena.imgObj) {
				this.center_x = (width * 0.5 + garena.imgObj.originalLeft) * this.rate;
				this.center_y = (height * 0.5 + garena.imgObj.originalTop) * this.rate;
			}
			else {
				this.center_x = (width * 0.5) * this.rate;
				this.center_y = (height * 0.5) * this.rate;
			}
		}

		this.meshFloor = m3dview.init3DMap(width_3d, this.height_3d);

		m3dview.removeAllObjects();
		
		if(gcreatedObjs.length > 0)
		{
			$('#uploadprogressbar').css('width', '0');
			var progressModal = document.getElementById('progressModal');
			progressModal.style.display = "block";

			this.loadingCnt = 0;
			this.load_progress();
		}
		else
		{
			main.loaded = true;
			m3dview.render();
			// $('#main-area').hide();
			// $('#preview_3d').show();
		}
		// for(var i = 0; i < gcreatedObjs.length; i++)
		// {
		// 	main.addObject(gcreatedObjs[i]);
		// }
		// m3dview.render();
	}

	this.addNew3DObjects = function(nCnt)
	{
		for(var i = 0; i < nCnt; i++)
		{
			this.addObject(gcreatedObjs[gcreatedObjs.length - nCnt + i]);
			m3dview.render();
		}
	}

	this.addNew3DObject = function()
	{
		this.addObject(gcreatedObjs[gcreatedObjs.length - 1]);
		m3dview.render();
	}
	this.remove3DObject = function(obj)
	{
		if(obj.m3dObj)
		{
			m3dview.remove3DObject(obj.m3dObj);
			m3dview.render();
		}
		else
		{
			// alert('obj.m3dObj == null');
		}
		// var index = gcreatedObjs.indexOf(obj);
		// if(index >= 0)
		// {
		// 	m3dview.removeObject(index);
		// 	m3dview.render();
		// }
	}
	this.modify3DObject = function(obj, porperty)
	{
		if(obj.m3dObj)
		{
			if(porperty)
			{
				m3dview.changeObject(obj.m3dObj, porperty);
			}
			else
			{
				m3dview.remove3DObject(obj.m3dObj);
				main.addObject(obj);
				// m3dview.modify3DObject();
			}
			m3dview.render();
		}
		else
		{
			// alert('obj.m3dObj == null');
		}
		// if(main.loaded)
		// {
		// 	var index = gcreatedObjs.indexOf(obj);
		// 	if(index >= 0)
		// 	{
		// 		if(porperty)
		// 		{
		// 			m3dview.changeObject(index, porperty);
		// 		}
		// 		else
		// 		{
		// 			m3dview.removeObject(index);
		// 			main.addObject(obj, index);
		// 			// m3dview.modify3DObject();
		// 		}
		// 		m3dview.render();
		// 	}
		// }
	}
	this.modify3DGroup = function(group, porperty)
	{
		if(main.loaded && group)
		{
			for(var i = 0; i < group.length; i++)
			{
				this.modify3DObject(group[i], porperty);
				// var index = gcreatedObjs.indexOf(group[i]);
				// if(index >= 0)
				// {
				// 	m3dview.removeObject(index);
				// 	main.addObject(group[i], index);
				// }
			}
			m3dview.render();
		}
	}
	this.remove3DGroup = function(group)
	{
		if(main.loaded && group)
		{
			for(var i = group.length - 1; i >= 0; i--)
			{
				if(group[i].m3dview)
				{
					m3dview.remove3DObject(group[i].m3dObj);
				}
			}
			m3dview.render();
		}
	}
	
	this.load_progress = function()
	{
		var percentComplete = 100 * main.loadingCnt / gcreatedObjs.length;
		$('#uploadprogressbar').css('width', percentComplete + '%');

		// console.log(main.loadingCnt + 'dsd');
		if(main.loadingCnt == 76)
			var jjj = 0;
		main.addObject(gcreatedObjs[main.loadingCnt]);

		main.loadingCnt++;
		if(main.loadingCnt < gcreatedObjs.length) {
			setTimeout(function() {
				main.load_progress();
			}, 100)
		}
		else {
			var progressModal = document.getElementById('progressModal');
			progressModal.style.display = "none";
			m3dview.initSeatMesh();
			m3dview.render();
			// $('#main-area').hide();
			// $('#preview_3d').show();
			main.loaded = true;
			return;
		}
	}

	// this.crate3DView = function()
	// {
	// 	main.loaded = false;
	// 	m3dview.initCameraEvent();

	// 	var width = garena.width;
	// 	var height = garena.height;
	// 	width_3d = width;
	// 	this.rate = 1;//width_3d / width;
	// 	this.height_3d = garena.height * this.rate;
	// 	this.center_x = (width * 0.5 + garena.imgObj.originalLeft) * this.rate;
	// 	this.center_y = (height * 0.5 + garena.imgObj.originalTop) * this.rate;

	// 	m3dview.create3DPlane(width_3d, this.height_3d);

	// 	if(gcreatedObjs.length > 0)
	// 	{
	// 		$('#uploadprogressbar').css('width', '0');
	// 		var progressModal = document.getElementById('progressModal');
	// 		progressModal.style.display = "block";

	// 		this.loadingCnt = 0;
	// 		this.load_progress();
	// 	}
	// 	else
	// 	{
	// 		m3dview.render();
	// 		// $('#main-area').hide();
	// 		// $('#preview_3d').show();
	// 	}
	// }

	this.addObject = function(obj)
	{
		if(obj.type == 'BlockObj')
		{
			if(obj.showlines)
			{
				var block = this.create3DBlock(obj, true);
				var blockProp = {
					baseheight: obj.baseheight,
					layerHeight: obj.layerheight,
					raiseHeight: obj.raiseHeight,
					seatColor: obj.seatColor,
					angle: obj.targetalpha,
				}
				// var seatColor = '0x' + obj.seatColor.substr(1, obj.seatColor.length - 1);
				var seats = [];
				if(obj.showchair)
				{
					for(var i = 0; i < obj.drawData.seats.length; i++)
					{
						seats.push({
							x: obj.drawData.seats[i].left * this.rate - this.center_x,
							y: this.center_y - obj.drawData.seats[i].top * this.rate,
							lineIndex: obj.drawData.seats[i].lineIndex,
							// angle: obj.targetalpha,
						})
					}
					m3dview.addChairs(block, seats, blockProp);
				}
				m3dview.pushGroupObjets(block, 'block', obj);
			}
			else
			{
				var absolutePoints = obj.getAbsolutePoints();
				if(absolutePoints)
				{
					var tempPoints = [];
					for(var i = 0; i < absolutePoints.length; i++)
					{
						tempPoints.push({
							x: absolutePoints[i].x * this.rate - this.center_x,
							y: this.center_y - absolutePoints[i].y * this.rate
						});
					}
					var mesh = null;
					if(obj.bgImagePath)
					{
						m3dview.add3DPlanWithMapping(tempPoints, obj.layerheight, obj.raiseHeight, obj.bgImagePath, obj.imgProp, obj.angleCount, function(mesh)
						{
							m3dview.pushGroupObjets(mesh, 'block', obj);
							m3dview.render();
						})
					}
					else
						m3dview.pushGroupObjets(m3dview.add3DPlan(tempPoints, obj.layerheight, obj.raiseHeight, obj.backColor, true), 'block', obj);
					tempPoints = [];
				}
			}
		}
		else if(obj.type == 'LightObj')
		{
			if(obj.fabriclines == null || (obj.fabriclines && obj.fabriclines.length == 0))
				obj.drawSeatLines();
			var absolutePoints = obj.getAbsolutePoints();
			if(absolutePoints)
			{
				var tempPoints = [];
				for(var i = 0; i < absolutePoints.length; i++)
				{
					tempPoints.push({
						x: absolutePoints[i].x * this.rate - this.center_x,
						y: this.center_y - absolutePoints[i].y * this.rate
					});
				}
				var size = getSizeFromPoints(tempPoints);
				var center = getCenterPosition(tempPoints);
				var newPts = [];
				for(var i = 0; i < tempPoints.length; i++) {
					newPts.push({
						x: tempPoints[i].x - center.x,
						y: tempPoints[i].y - center.y,
					})
				}
				var mesh = null;
				if(obj.bgImagePath)
				{
					m3dview.add3DPlanWithMapping(newPts, obj.thickness, obj.baseheight, obj.bgImagePath, obj.imgProp, obj.angleCount, function(block)
					{
						block.position.z = -0.5 * obj.thickness;
						if(obj.isShow)
						{
							if(g_appOptions.graphic_quality == 0) {
								for(var i = 0; i < obj.drawData.seats.length; i++) {
									m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
										this.center_y - obj.drawData.seats[i].top - center.y, 
										obj.lightDistance, obj, false);
								}	
							} else if(g_appOptions.graphic_quality == 1) {
								if(obj.isRealLight) {
									var realLightIndex = parseInt(obj.colsNum / 2) * obj.rowsNum + parseInt(obj.rowsNum / 2);
									for(var i = 0; i < obj.drawData.seats.length; i++) {
										if(i == realLightIndex) {
											m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
												this.center_y - obj.drawData.seats[i].top - center.y, 
												obj.lightDistance, obj, true);
										}
										else {
											m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
												this.center_y - obj.drawData.seats[i].top - center.y, 
												obj.lightDistance, obj, false);
										}
									}
								}
								else {
									for(var i = 0; i < obj.drawData.seats.length; i++) {
										m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
											this.center_y - obj.drawData.seats[i].top - center.y, 
											obj.lightDistance, obj, true);
									}
								}
							} else if(g_appOptions.graphic_quality == 2) {
								for(var i = 0; i < obj.drawData.seats.length; i++) {
									m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
										this.center_y - obj.drawData.seats[i].top - center.y, 
										obj.lightDistance, obj, true);
								}
							}
						}
						var group = new THREE.Group();
						group.add(block);
						group.position.x = center.x;
						group.position.y = center.y;
						group.position.z = obj.baseheight + 0.5 * obj.thickness;
						block.castShadow = false;
						m3dview.pushGroupObjets(group, 'light', obj);
						if(obj.isVertical)
						{
							group.rotation.x = Math.PI * 0.5;
							group.rotation.y = obj.angle_vertical * Math.PI / 180;
						}
						m3dview.render();
					})
				}
				else
				{
					var group = new THREE.Group();
					group.position.x = center.x;
					group.position.y = center.y;
					group.position.z = obj.baseheight + 0.5 * obj.thickness;
					m3dview.pushGroupObjets(group, 'light', obj);
					
					var block = m3dview.add3DPlan(newPts, obj.thickness, obj.baseheight, obj.backColor, true);
					group.add(block);
					block.castShadow = false;
					block.position.z = -0.5 * obj.thickness;
					// var block = m3dview.addLightObject(tempPoints, 0.2 + obj.baseheight * this.rate - obj.thickness, obj.thickness, obj.backColor);
					if(obj.isShow)
					{
						if(g_appOptions.graphic_quality == 0) {
							for(var i = 0; i < obj.drawData.seats.length; i++) {
								m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
									this.center_y - obj.drawData.seats[i].top - center.y, 
									obj.lightDistance, obj, false);
							}	
						} else if(g_appOptions.graphic_quality == 1) {
							if(obj.isRealLight) {
								var realLightIndex = parseInt(obj.colsNum / 2) * obj.rowsNum + parseInt(obj.rowsNum / 2);
								for(var i = 0; i < obj.drawData.seats.length; i++) {
									if(i == realLightIndex) {
										m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
											this.center_y - obj.drawData.seats[i].top - center.y, 
											obj.lightDistance, obj, true);
									}
									else {
										m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
											this.center_y - obj.drawData.seats[i].top - center.y, 
											obj.lightDistance, obj, false);
									}
								}
							}
							else {
								for(var i = 0; i < obj.drawData.seats.length; i++) {
									m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
										this.center_y - obj.drawData.seats[i].top - center.y, 
										obj.lightDistance, obj, true);
								}
							}
						} else if(g_appOptions.graphic_quality == 2) {
							for(var i = 0; i < obj.drawData.seats.length; i++) {
								m3dview.addLight(block, obj.drawData.seats[i].left - this.center_x - center.x, 
									this.center_y - obj.drawData.seats[i].top - center.y, 
									obj.lightDistance, obj, true);
							}
						}
					}
					if(obj.isVertical)
					{
						group.rotation.x = Math.PI * 0.5;
						group.rotation.y = obj.angle_vertical * Math.PI / 180;
					}
					if(obj.lightProperty.isHideLightBlock)
					{
						block.material.transparent = true;
						block.material.opacity = 0;
					}
					else
					{
					}
				}
			}
		}
		else if(obj.type == 'ShapeObj')
		{
			if(obj.showlines)
			{
				var newShape = new THREE.Group();
				var bolckInfos = obj.getBlockObjs();
				for(var blockCnt = 0; blockCnt < bolckInfos.length; blockCnt++)
				{
					var blockInfo = bolckInfos[blockCnt];
					var absolutePoints = blockInfo.points;
					var tempPoints = [];
					for(var i = 0; i < absolutePoints.length; i++)
					{
						tempPoints.push({
							x: absolutePoints[i].x * this.rate - this.center_x,
							y: this.center_y - absolutePoints[i].y * this.rate
						});
					}
					var prop = {
						// index: blockObj.index,
						baseheight: obj.baseheight,
						layerHeight: obj.layerheight,
						raiseHeight: obj.raiseHeight,
						lineSpace: obj.lineSpace,
						backColor: obj.backColor,
						wall_front: obj.wall_front,
						wall_back: obj.wall_back,
						wall_left: obj.wall_left,
						wall_right: obj.wall_right,
						seatColor: obj.seatColor,
						upstair: obj.upstair,
						handrail_img: obj.handrail_img,
						handrail_height: obj.handrail_height,
						bgImagePath: obj.bgImagePath,
						blockPoints: tempPoints,
						isStair: obj.isStair,
						rowStart: obj.rowStart,
						rows: obj.rows,
						seatspace: obj.seatspace,
						block_aspect: true,
					}

				// 	if(blockObj.shapeObj)
				// 	{
				// 		prop.shapeProp = {
				// 			index: blockObj.shapeObj.index,
				// 			seatTotal: blockObj.shapeObj.seatTotal,
				// 			lineSpace: blockObj.shapeObj.lineSpace,
				// 			rows: blockObj.shapeObj.rows,
				// 			seatspace: blockObj.shapeObj.seatspace,
				// 		};
				// 	}

					var groupBlock = this.create3DBlockOfShape(prop);
					groupBlock.objectData = {
						type: 'shape',
						object: obj,
						blockCnt: blockCnt,
					};
					newShape.add(groupBlock);
						
				// 	// this.create3DBlock(blockObjs[blockCnt], false);

				// 	canvas.remove(blockObj.blockshape);
				// 	blockObj.removeSeatLines();
				// 	delete blockObj.blockshape;
					// bolckInfos = null;
				}

				m3dview.pushGroupObjets(newShape, 'shape', obj);
			}
			else
			{
				var newShape = new THREE.Group();
				var bolckInfos = obj.getBlockObjs();
				for(var blockCnt = 0; blockCnt < bolckInfos.length; blockCnt++)
				{
					var blockInfo = bolckInfos[blockCnt];
					var absolutePoints = blockInfo.points;
					var tempPoints = [];
					for(var i = 0; i < absolutePoints.length; i++)
					{
						tempPoints.push({
							x: absolutePoints[i].x * this.rate - this.center_x,
							y: this.center_y - absolutePoints[i].y * this.rate
						});
					}
					newShape.add(m3dview.add3DPlan(tempPoints, obj.layerheight, obj.raiseHeight, obj.backColor, true));
					tempPoints = [];
				}
				m3dview.pushGroupObjets(newShape, 'shape', obj);
			}
		}
		else if(obj.type == 'WallObj')
		{
			var absolutePoints = obj.getAbsolutePoints();
			if(absolutePoints)
			{
				var prop = {
					baseheight: obj.baseheight,
					wall_thickness: obj.wall_thickness,
					raise_offset: obj.raise_offset,
					backColor: obj.backColor,
					bgImagePath: obj.bgImagePath,
					imgProp: obj.imgProp,
					bgVideoPath: obj.bgVideoPath,
					materialType: obj.materialType,
				}
				var tempPoints = [];
				for(var i = 0; i < absolutePoints.length; i++)
				{
					tempPoints.push({
						x: absolutePoints[i].x * this.rate - this.center_x,
						y: this.center_y - absolutePoints[i].y * this.rate
					});
				}
				if(obj.bgImagePath)
				{
					m3dview.add3DWallWithMapping(tempPoints, prop, function(mesh)
					{
						m3dview.pushGroupObjets(mesh, 'wall', obj);
						m3dview.render();
					})
				}
				else if(obj.bgVideoPath)
				{
					m3dview.add3DWallWithVideo(tempPoints, prop, function(mesh)
					{
						m3dview.pushGroupObjets(mesh, 'wall', obj);
						m3dview.render();
					})
				}
				else
				{
					m3dview.pushGroupObjets(m3dview.createWalls(tempPoints, prop), 'wall', obj);
				}
			}
		}
	}

	this.create3DBlockOfShape = function(blockProp)
	{
		var result = sh_2dman.getBlockAtShape(blockProp.blockPoints, blockProp.rows, blockProp.seatspace, blockProp.lineSpace, blockProp.rowStart);
		blockProp.angle = result.targetalpha;
		var groupBlock = m3dview.create3DBlock(result.lines, blockProp, true);
		groupBlock.prop = blockProp;

		m3dview.addChairs(groupBlock, result.seats, blockProp);
		// for(var i = 0; i < result.seats.length; i++)
		// {
		// 	var seat = result.seats[i];
		// 	m3dview.addChairGroup(groupBlock, seat.x, seat.y, blockProp.baseheight + seat.lineIndex * blockProp.layerHeight, seat.angle, blockProp.seatColor);
		// }
		result = null;
		return groupBlock;
	}

	this.create3DBlock = function(blockObj, isNumber)
	{
		if(blockObj.fabriclines == null || (blockObj.fabriclines && blockObj.fabriclines.length == 0))
		{
			blockObj.drawSeatLines();
		}
		var lines = [];
		for(var k = 0; k < blockObj.drawData.lines.length; k++)
		{
			var lineObj = blockObj.drawData.lines[k];
			var line = {};
			line.p1 = new THREE.Vector2(lineObj.pt1.x * this.rate - this.center_x, this.center_y - lineObj.pt1.y * this.rate);
			line.p2 = new THREE.Vector2(lineObj.pt2.x * this.rate - this.center_x, this.center_y - lineObj.pt2.y * this.rate);
			line.index = k;
			line.edge_index1 = lineObj.edge_index1;
			line.edge_index2 = lineObj.edge_index2;
			line.lineIndex = lineObj.lineIndex;
			line.textNumber = sh_2dman.getNumberText(k + 1, blockObj.rowStart);
			lines.push(line);
		}
		var absolutePoints = blockObj.getAbsolutePoints();
		var tempPoints = [];
		for(var i = 0; i < absolutePoints.length; i++)
		{
			tempPoints.push({
				x: absolutePoints[i].x * this.rate - this.center_x,
				y: this.center_y - absolutePoints[i].y * this.rate
			});
		}
		var prop = {
			index: blockObj.index,
			baseheight: blockObj.baseheight,
			layerHeight: blockObj.layerheight,
			raiseHeight: blockObj.raiseHeight,
			lineSpace: blockObj.lineSpace,
			backColor: blockObj.backColor,
			angle: blockObj.targetalpha,
			wall_front: blockObj.wall_front,
			wall_back: blockObj.wall_back,
			wall_left: blockObj.wall_left,
			wall_right: blockObj.wall_right,
			seatColor: blockObj.seatColor,
			upstair: blockObj.upstair,
			handrail_img: blockObj.handrail_img,
			handrail_height: blockObj.handrail_height,
			bgImagePath: blockObj.bgImagePath,
			blockPoints: tempPoints,
			title: blockObj.property.title,
			isStair: blockObj.isStair,
			block_aspect: blockObj.block_aspect,
			rows: lines.length,
			showchair: blockObj.showchair,
			showLabel: blockObj.showLabel,
			showLabel3D: blockObj.showLabel3D,
		}

		// if(blockObj.shapeObj)
		// {
		// 	prop.shapeProp = {
		// 		index: blockObj.shapeObj.index,
		// 		seatTotal: blockObj.shapeObj.seatTotal,
		// 		lineSpace: blockObj.shapeObj.lineSpace,
		// 		rows: blockObj.shapeObj.rows,
		// 		seatspace: blockObj.shapeObj.seatspace,
		// 	};
		// }

		var groupBlock = null;
		if(lines.length > 0)
		{
			groupBlock = m3dview.create3DBlock(lines, prop, this.rate, isNumber);
			groupBlock.objectData = {
				type: 'block',
				object: blockObj,
			};
		}
		lines = [];
		return groupBlock;
	}

	// this.create3DPlane = function(blockObj)
	// {
	// 	var absolutePoints = blockObj.getPointsFromArena();
	// 	var tempPoints = [];
	// 	for(var i = 0; i < absolutePoints.length; i++)
	// 	{
	// 		tempPoints.push({
	// 			x: absolutePoints[i].x * this.rate - this.center_x,
	// 			y: this.center_y - absolutePoints[i].y * this.rate
	// 		});
	// 	}
	// 	m3dview.add3DPlan(tempPoints, blockObj.baseheight * this.rate, 0.1, blockObj.backColor, false);
	// 	tempPoints = [];
	// }

	this.dispose = function()
	{
		m3dview.reset();
		m3dview.dispose();
	}

	this.selectedCameraObject = function(blockObj)
	{
		if(blockObj && blockObj.type == 'BlockObj')
		{
			if(main.loaded)
			{
				var index = gcreatedObjs.indexOf(blockObj);
				if(index >= 0)
				{
					var obj = m3dview.search3DObject(index);
					m3dview.animationCamFromObject(obj);
				}
			}
		}
	}

	this.setCameraHeight = function(height)
	{
		m3dview.setCameraHeight(height);
	}

	this.changeFloorColor = function(color)
	{
		if(m3dview.materialGround)
		{
			m3dview.materialGround.color.set(color);
			// this.meshFloor.material.color.set(color);
			m3dview.render();
		}
	}

	this.changeAllObjectSetting = function()
	{
		m3dview.removeAllObjects();
		
		if(gcreatedObjs.length > 0)
		{
			$('#uploadprogressbar').css('width', '0');
			var progressModal = document.getElementById('progressModal');
			progressModal.style.display = "block";

			this.loadingCnt = 0;
			this.load_progress();
		}
		else
		{
			main.loaded = true;
			m3dview.render();
			// $('#main-area').hide();
			// $('#preview_3d').show();
		}
	}

	this.changeAllChairSize = function(chairSize)
	{
		m3dview.changeAllChairSize(chairSize);
	}

	this.changeLightMain = function(color, intensity)
	{
		if(m3dview.lightMain)
		{
			m3dview.lightMain.color.set(color);
			m3dview.lightMain.intensity = intensity;
			m3dview.render();
		}
	}

	function getBlockFromIndex(blockIndex)
	{
		var index = 0;
		for(var i = 0; i < gcreatedObjs.length; i++)
		{
			var obj = gcreatedObjs[i];
			if(obj.type == 'BlockObj' || obj.type == 'ShapeObj')
			{
				if(blockIndex == index)
				{
					return obj;
				}
				index++;
			}
		}
	}
	this.moveCameraSeating = function(blockIndex, row, col)
	{
		var obj = getBlockFromIndex(blockIndex);
		if(obj && obj.m3dObj)
		{
			for(var i = 0; i < obj.m3dObj.children.length; i++)
			{
				var meshLine = obj.m3dObj.children[i];
				if(meshLine.obj_type == 'box')
				{
					if(meshLine.lineIndex == row)
					{
						var pos = {
							x: meshLine.pos_.x,
							y: meshLine.pos_.z + 20,
							z: -meshLine.pos_.y,
						}
						// obj.m3dview.
						m3dview.animationCamWithPos(pos);
						return;
					}
				}
			}
		}
	}

	this.setCameraTarget = function(position) {
		m3dview.setCameraTarget(position);
	}

	this.init();
}
