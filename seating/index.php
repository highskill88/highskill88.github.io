<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="language" content="en">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Seating Map Editor</title>
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<link rel="stylesheet" type="text/css" href="css/designer_app.css" />
	<link rel="stylesheet" type="text/css" href="css/font-awesome.css" />
	<link rel="stylesheet" type="text/css" href="css/progressbar-style.css" />
	<link rel="stylesheet" href="css/colorpicker.css" type="text/css" />
	<link rel="stylesheet" type="text/css" href="css/common.css" />

	<script type="text/javascript" src="js/lib/jquery-2.1.0.min.js"></script>
	<script type="text/javascript" src="js/lib/localforage.min.js"></script>
	<script type="text/javascript" src="js/lib/localforage.nopromises.min.js"></script>
	<script type="text/javascript" src="js/lib/jsonpack.js"></script>
	<script type="text/javascript" src="js/lib/jquery-ui.js"></script>
	<!--<script type="text/javascript" src="js/lib/fabric-cutomize-seatingmap.js"></script>-->
	<script type="text/javascript" src="js/lib/fabric.js"></script>
	<script type="text/javascript" src="js/lib/circle-progress.min.js"></script>
	<!-- <script type="text/javascript" src="js/main-template-arena.js"></script> -->
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="js/main_ex.js"></script>
	<script type="text/javascript" src="js/2dmain.js"></script>
	<script type="text/javascript" src="js/toolbar.js"></script>
	<script type="text/javascript" src="js/layersdlg.js"></script>
	<script type="text/javascript" src="js/arenaobj.js"></script>
	<script type="text/javascript" src="js/objects/blockobj.js"></script>
	<script type="text/javascript" src="js/objects/shapeobj.js"></script>
	<script type="text/javascript" src="js/objects/wallobj.js"></script>
	<script type="text/javascript" src="js/objects/lightobj.js"></script>
	<script type="text/javascript" src="js/objects/eyeobj.js"></script>

	<script type="text/javascript" src="js/lib/colorpicker.js"></script>

	<script type="text/javascript" src="js/lib/three.js"></script>
	<script type="text/javascript" src="js/utils/rendering_ex.js"></script>
	<script type="text/javascript" src="js/utils/volumetricspotlightmaterial.js"></script>
	<!-- <script type="text/javascript" src="js/lib/ShadowMesh.js"></script> -->
	<!-- <script src="js/shaders/UnpackDepthRGBAShader.js"></script> -->
	<!-- <script src="js/utils/ShadowMapViewer.js"></script> -->
	<!-- <script src="js/lib/Detector.js"></script> -->
	<!-- <script type="text/javascript" src="js/renderers/Projector.js"></script>
	<script type="text/javascript" src="js/renderers/CanvasRenderer.js"></script> -->
	<script type="text/javascript" src="js/lib/threex.videotexture.js"></script>
	<!-- <script type="text/javascript" src="js/lib/FBXLoader.js"></script> -->
	<script type="text/javascript" src="js/3d_creator.js"></script>
	<script type="text/javascript" src="js/3d_main.js"></script>
	<!-- <script type="text/javascript" src="js/controls/TrackballControls.js"></script> -->
	<script type="text/javascript" src="js/controls/OrbitControls.js"></script>
	<!-- <script src="js/controls/PointerLockControls.js"></script> -->
	<script type="text/javascript" src="js/lib/jquery.fileupload.js"></script>
	<script type="text/javascript" src="js/global.js"></script>
	<script type="text/javascript" src="js/3d_main_ex.js"></script>
	<script type="text/javascript" src="js/lib/Tween.js"></script>
	<!-- <script type="text/javascript" src="js/lib/jquery.fileDownload.js"></script> -->
	<script type="text/javascript" src="js/lib/jquery.ui-contextmenu.js"></script>
</head>

<body>

	<div id="menu-area">
		<div id="logo-company">
			<section>
				<img src="images/icon.png">
			</section>
			<section class="app_title">
				<span onclick="#" style="cursor:pointer;">Seat Map Editor</span>
			</section>
		</div>
		<ul class="maintoolbar">
			<!--<li id="label_help"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Need help?</span></li>-->
			<li id="btn_newpage" class="topbar_button">
				<img src="images/maintool_new.png" style="padding: 7px 0px;">
			</li>

			<li id="btn_import" class="topbar_button">
				<img src="images/toolbar_import.png" style="padding: 0px 0px;">
				<form class="simple_fileupload" action="" method="POST" enctype="multipart/form-data">
					<input type="file" accept=".bin" name="files" id="fileupload_fileimport" class="btn_fileupload_fileopen" single>
				</form>
			</li>
			<li id="btn_export" class="topbar_button"><img src="images/toolbar_export.png" style="padding: 0px 0px;"></li>

			<li id="btn_open" class="topbar_button">
				<img src="images/maintool_fileopen.png" style="padding: 12px 0px;">
				<form class="simple_fileupload" action="" method="POST" enctype="multipart/form-data">
					<input type="file" accept=".map, .bin" name="files" id="fileupload_fileopen" class="btn_fileupload_fileopen" single>
				</form>
			</li>
			<li id="btn_save_file" class="topbar_button">
				<img src="images/maintool_savefile.png" style="padding: 7px 0px;">
			</li>
			<li id="btn_save" class="topbar_button">
				<img src="images/maintool_savelocal.png" style="padding: 7px 0px;">
			</li>
			<li id="btn_3dpreview" class="topbar_button"><span>Generate 3D map</span></li>
			<li id="btn_2dpreview" class="topbar_button"><span>2D Preview</span></li>
			<li id="btn_close" class="topbar_button"><img src="images/maintool_close.png" style="padding: 12px 0px;"></li>
		</ul>
	</div>
	<!-- <div id="tab-area" class="noselect">
		<ul>
			<sli style="color:#fff;float:right">Seats Total:&nbsp;<span id="seatstotal" style="color:#c2fd22">0</span></sli>
		</ul>
	</div> -->

	<div id="main-area">
		<div id="draw-board">
			<canvas id="drawcanvas"></canvas>
		</div>

		<div id="footer_zoom">
			<section class="zoombar_item">
				<img src="images/zoom_bar/zoom_in.png" id="slider_inc" class="noselect"/>
			</section>
			<div id="size_slider" class="zoombar_item">
				<div id="slider_tmp"></div>
				<div id="slider_body"></div>
			</div>
			<section class="zoombar_item">
				<img src="images/zoom_bar/zoom_out.png" id="slider_dec" class="noselect"/>
			</section>
			<section id="btn_zoom_reset" class="zoombar_item">
				<img src="images/zoom_bar/refresh.png">
			</section>
		</div>
		<div id="footer_move">
			<section>
				<div id="move_left" class="zoombar_item noselect">
					<img src="images/zoom_bar/arrow_left.png">
				</div>
			</section>
			<section>
				<div id="move_top" class="zoombar_item noselect">
					<img src="images/zoom_bar/arrow_up.png">
				</div>
				<div id="move_down" class="zoombar_item noselect">
					<img src="images/zoom_bar/arrow_down.png">
				</div>
			</section>
			<section>
				<div id="move_right" class="zoombar_item noselect">
					<img src="images/zoom_bar/arrow_right.png">
				</div>
			</section>
		</div>

		<div id="toolbar_drawing">
			<section>
				<div class="toolbar_item noselect" id="toolbar_selection">
					<img class="set_filter" src="images/toolbar_select.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_pencil">
					<img class="set_filter" src="images/toolbar_block.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_magic">
					<img class="set_filter" src="images/toolbar_magic.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_image">
					<img class="set_filter" src="images/toolbar_image.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_wall">
					<img class="set_filter" src="images/toolbar_wall.png"><BR>
				</div>			
				<div class="toolbar_item noselect" id="toolbar_shape">
					<img class="set_filter" src="images/toolbar_section.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_light">
					<img class="set_filter" src="images/toolbar_light.png"><BR>
				</div>			
				<div class="toolbar_item noselect disable" id="toolbar_scale">
					<img class="set_filter" src="images/toolbar_scale.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_options">
					<img class="set_filter" src="images/toolbar_setting.png"><BR>
				</div>
				<div class="toolbar_item noselect" id="toolbar_eye">
					<img class="set_filter" src="images/toolbar_eye.png"><BR>
				</div>
			</section>
			<section>
				<div class="toolbar_item noselect disable" id="toolbar_undo">
					<img class="set_filter" src="images/toolbar_undo.png"><BR>
				</div>
				<div class="toolbar_item noselect disable" id="toolbar_redo">
					<img class="set_filter" src="images/toolbar_redo.png"><BR>
				</div>
			</section>
		</div>

		<!-- Arena Obj -->
		<form enctype="multipart/form-data" onsubmit="return false;" id="SeatMapArenaUpload" name="SeatMapArenaUpload" action="uploadarena.php" method="post">
			<input autocomplete="off" class="fileUpload" name="imagelinkvalue" id="imagelinkvalue" type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*">
		</form>
		<form enctype="multipart/form-data" onsubmit="return false;" id="SeatMapImageUpload" name="SeatMapImageUpload" action="uploadimage.php" method="post">
			<input autocomplete="off" class="fileUpload" name="mapping_imgupload" id="mapping_imgupload" type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*">
		</form>
		<form enctype="multipart/form-data" onsubmit="return false;" id="SeatMapVideUpload" name="SeatMapVideUpload" action="uploadimage.php" method="post">
			<input autocomplete="off" class="fileUpload" name="mapping_videoupload" id="mapping_videoupload" type="file" accept=".webm, .mp4, .ogg, .gif, .bmp, .tif, .tiff|videos/*">
		</form>
		<!-- <form enctype="multipart/form-data" onsubmit="return false;" id="SeatMapImage_Wall" name="SeatMapImage_Wall" action="uploadimage.php" method="post">
			<input autocomplete="off" class="fileUpload" name="mapping_imgupload_wall" id="mapping_imgupload_wall" type="file">
		</form> -->
		<!-- Arena Normal -->
		<div class="context-menu__flyover animated-slow fadeInDown" id="arena_creating" style="display: none;">
			<ul class="split-form__data">
				<li>
					<button class="btn btn--full-width" id="btn_arena_create">Create</button>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" id="transvalue">Transparency : 100%</label>
					<div id="transslider"></div>
				</li>
			</ul>
			<div style="width:100%;height:60px;">
				<div style="position:absolute;width:50%;height:70px;left:25%;top:110px;cursor:pointer;padding-top:20px;" align=center id="arena_creating_cancel">
					<img src="images/delete-icon.png"><BR>
					<label class="split-form__label noselect" style="cursor:pointer;">Cancel</label>
				</div>
			</div>
		</div>

		<!-- Points Tab -->
		<div class="context-menu__flyover animated-slow fadeInDown" id="blockpoints" style="display: none;">
			<header class="has-centered-inline-content l-pad-bot-2">
				<span class="text-body--faint text-body--significant">Block Points</span>
			</header>
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Points</label>
					<input type="number" class="split-form__input" id="blockpoints_count" readonly>
				</li>
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="btn btn--full-width" id="btn_blockpoints_create">Create</button>
				</li>
				<li class="l-mar-top-1">
					<button class="btn btn--secondary btn--full-width" id="btn_blockpoints_cancel">Cancel</button>
				</li>
			</ul>
		</div>

		<div class="context-menu__flyover animated-slow fadeInDown" id="option_dlg" style="display: none;">
			<header class="has-centered-inline-content l-pad-bot-2">
				<span class="text-body--faint text-body--significant">Option</span>
			</header>
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Chair Space</label>
					<input type="number" step="0.01" class="split-form__input" id="chair_space">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row Distance</label>
					<input type="number" step="0.01" class="split-form__input" id="line_space">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Chair Size</label>
					<input type="number" step="0.01" class="split-form__input" id="chair_size">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Floor Color</label>
					<!-- <input type="color" class="color_form__input" id="color_floor"> -->
					<div id="color_floor" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Light Color</label>
					<div id="color_mainlight" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Light Intensity</label>
					<input type="number" step="0.01" class="split-form__input" id="mainlight_intensity">
				</li>
			</ul>
			<!-- <ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Ceiling</label>
					<input type="checkbox" class="split-form__input property_check" id="ceiling_check">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Height</label>
					<input type="number" class="split-form__input" id="ceiling_height">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Section Color</label>
					<input type="color" class="color_form__input" id="ceiling_color">
				</li>
				<li class="l-mar-top-4" id="">
					<label class="split-form__label">Mapping</label>
					<button class="btn btn--small pull_right btn_reset_image" id="">X</button>
					<button class="btn btn--small pull_right btn_background_image" id="btn_ceiling_image" style="width:80px;">Image</button>
				</li>
			</ul> -->
			<ul class="split-form__data">
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="btn btn--full-width btn_dlg_ok btn_dlg_close">OK</button>
				</li>
				<li class="l-mar-top-1">
					<button class="btn btn--secondary btn--full-width btn_dlg_close">Cancel</button>
				</li>
			</ul>
		</div>

		<div class="context-menu__flyover animated-slow fadeInDown" id="dlg_setting_eye" style="display: none;">
			<!-- <header class="has-centered-inline-content l-pad-bot-2">
				<span class="text-body--faint text-body--significant">Setting Eye</span>
			</header> -->
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Eye Height</label>
					<input type="number" step="0.01" class="split-form__input" id="eye_height" style="width:60px;">
				</li>
			</ul>
			<!-- <ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="btn btn--full-width btn_dlg_ok btn_dlg_close">OK</button>
				</li>
				<li class="l-mar-top-1">
					<button class="btn btn--secondary btn--full-width btn_dlg_close">Cancel</button>
				</li>
			</ul> -->
		</div>

		<!-- Block Object -->
		<div class="context-edit animated-slow fadeInDown" id="blockobj_normal" style="display:none;">
			<!-- <header class="has-centered-inline-content">
				<span class="text-body--faint text-body--significant">Block</span>
			</header> -->
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Block</label>
					<input type="text" class="split-form__input width150 text_object_title" id="blockobj_title" placeholder="Enter Name">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Tags</label>
					<input type="text" class="split-form__input width150" id="blockobj_tags">
					<!-- <input type="number" class="split-form__input" id="blockobj_seatcount" readonly> -->
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">view score (1~10)</label>
					<input type="number" class="split-form__input" id="blockobj_viewscore">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row Distance</label>
					<input type="number" step="0.01" class="split-form__input" id="blockobj_lineSpace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Seat Space</label>
					<input type="number" step="0.01" class="split-form__input" id="blockobj_seatspace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Section Height</label>
					<input type="number" step="0.01" class="split-form__input text_object_3dheight" id="blockobj_3dheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Row Height</label>
					<input type="number" step="0.01" class="split-form__input" id="blockobj_layer_height">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Raise Section</label>
					<input type="number" step="0.01" class="split-form__input" id="blockobj_raise">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row start Character</label>
					<input type="text" class="split-form__input" id="blockobj_row_char">
<!-- 					<select class="select_form" id="blockobj_linenumbertype">
						<option value="Number">Number</option>
						<option value="Alphabetic">Alphabetic</option>
					</select> -->
				</li>
				<li class="l-mar-top-6 object_wall_property">
					<label class="split-form__label pull_left">Wall Property</label>
					<div class="btn_wallprop">
						<img src="images/dlg/btn_show.png" class="show">
						<img src="images/dlg/btn_hide.png" class="hide" style="display: none;">
					</div>
					<section class="section_wall_prop" style="display: none">
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Front</label>
							<input type="checkbox" class="split-form__input property_check" id="block_wall_front">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Back</label>
							<input type="checkbox" class="split-form__input property_check" id="block_wall_back">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Left</label>
							<input type="checkbox" class="split-form__input property_check" id="block_wall_left">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Right</label>
							<input type="checkbox" class="split-form__input property_check" id="block_wall_right">
						</li>
						<li class="l-mar-top-4">
							<section id="block_wall_image">
								<label class="split-form__label">Mapping</label>
								<button class="btn_small pull_right btn_object_wall_image_reset" style="margin-left: 2px;">X</button>
								<button class="btn_small pull_right btn_object_wall_image" style="width:80px;">Image
									<form class="simple_fileupload" action="" method="POST" enctype="multipart/form-data">
										<input type="file" accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|images/*" name="files" id="fileupload_wallmapping" class="btn_fileupload_fileopen" single>
									</form>
								</button>
							</section>
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Height</label>
							<input type="number" step="0.01" class="split-form__input text_object_wall_height">
						</li>
					</section>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Seat Color</label>
					<div id="blockobj_seat_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Upstair Section</label>
					<input type="number" class="split-form__input" id="blockobj_upstair">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide Seat</label>
					<input type="checkbox" class="split-form__input property_check" id="blockobj_showchair">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide Lines</label>
					<input type="checkbox" class="split-form__input property_check" id="blockobj_showlines">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide 2D Label</label>
					<input type="checkbox" class="split-form__input property_check" id="blockobj_showlabel">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide 3D Label</label>
					<input type="checkbox" class="split-form__input property_check" id="blockobj_showlabel_3d">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Section Color</label>
					<!-- <input type="color" class="color_form__input" id="blockobj_color"> -->
					<div id="blockobj_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4" id="blockobj_bgImage">
					<label class="split-form__label">Mapping</label>
					<button class="btn_small pull_right btn_reset_image" id="">X</button>
					<button class="btn_small pull_right btn_background_image" id="btn_blockobj_image" style="width:100px;">Image</button>
				</li>
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="property_btn" id="btn_blockobj_fliph">
						<img src="images/dlg/flip_horiz.png">
					</button>
					<button class="property_btn" id="btn_blockobj_flipv">
						<img src="images/dlg/flip_vert.png">
					</button>
					<button class="property_btn" id="btn_blockobj_setaxis">
						<img src="images/dlg/setaxis.png">
					</button>
					<button class="property_btn btn_object_backwards">
						<img src="images/dlg/backward.png">
					</button>
				</li>
				<li class="l-mar-top-4">
					<button class="property_btn property_text_btn" id="btn_blockobj_save">Save</button>
					<button class="property_btn property_text_btn btn_object_delete">Delete</button>
				</li>
<!-- 				<li class="l-mar-top-4">
					<label class="split-form__label">Selectable</label>
					<input type="checkbox" class="split-form__input property_check check_object_selectable">
				</li> -->
			</ul>
		</div>

		<!-- Wall Object -->
		<div class="context-edit animated-slow fadeInDown" id="wallobj_normal" style="display:none;">
			<!-- <header class="has-centered-inline-content l-pad-bot-2">
				<span class="text-body--faint text-body--significant">Wall</span>
			</header> -->
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Wall</label>
					<input type="text" class="split-form__input width150 text_object_title" id="wallobj_title" placeholder="Enter Name">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Wall Height</label>
					<input type="number" step="0.01" class="split-form__input text_object_3dheight" id="wallobj_height">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Wall Thickness</label>
					<input type="number" step="0.01" class="split-form__input" id="wallobj_thickness">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Raise Offset</label>
					<input type="number" step="0.01" class="split-form__input" id="wallobj_raiseOffset">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Color</label>
					<!-- <input type="color" class="color_form__input" id="wallobj_color"> -->
					<div id="wallobj_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4 image_upload" id="wallobj_bgImage">
				</li>
				<li class="l-mar-top-4" id="wallobj_bgVideo">
					<label class="split-form__label">Video</label>
					<button class="btn_small pull_right btn_reset_image" id="btn_wallobj_image_reset">X</button>
					<button class="btn_small pull_right btn_background_video" id="btn_wallobj_video" style="width:100px;">Video</button>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Material Type</label>
					<select class="select_form" id="wallobj_material_type">
						<option value="phong">Phong</option>
						<option value="lambert">Lambert</option>
					</select>
				</li>
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="property_btn btn_object_backwards">
						<img src="images/dlg/backward.png">
					</button>
				</li>
				<li class="l-mar-top-4">
					<button class="property_btn property_text_btn" id="btn_blockobj_save">Save</button>
					<button class="property_btn property_text_btn btn_object_delete">Delete</button>
				</li>
<!-- 				<li class="l-mar-top-4">
					<label class="split-form__label">Selectable</label>
					<input type="checkbox" class="split-form__input property_check check_object_selectable">
				</li> -->
			</ul>
		</div>

		<!-- Light Object -->
		<div class="context-edit animated-slow fadeInDown" id="dlg_lightobj" style="display:none;">
			<!-- <header class="has-centered-inline-content">
				<span class="text-body--faint text-body--significant">Light</span>
			</header> -->
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Light</label>
					<input type="text" class="split-form__input width150 text_object_title" id="lightobj_title" placeholder="Enter Name">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row Number</label>
					<input type="number" class="split-form__input" id="lightobj_linenumber">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Col Number</label>
					<input type="number" class="split-form__input" id="lightobj_cols">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Section Height</label>
					<input type="number" step="0.01" class="split-form__input text_object_3dheight" id="lightobj_baseheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Thickness</label>
					<input type="number" step="0.01" class="split-form__input" id="lightobj_thickness">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Light Distance</label>
					<input type="number" step="0.01" class="split-form__input" id="lightobj_distance">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide Light</label>
					<input type="checkbox" class="split-form__input property_check" id="lightobj_showlight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Light Intensity</label>
					<input type="number" step="0.01" class="split-form__input" id="lightobj_intensity">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Lighting Range</label>
					<input type="number" step="0.01" class="split-form__input" id="lightobj_range">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Light Color</label>
					<!-- <input type="color" class="color_form__input" id="lightobj_light_color"> -->
					<div id="lightobj_light_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Section Color</label>
					<!-- <input type="color" class="color_form__input" id="lightobj_backcolor"> -->
					<div id="lightobj_backcolor" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Real Light</label>
					<input type="checkbox" class="split-form__input property_check" id="lightobj_reallight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Light Type</label>
					<select class="select_form" id="lightobj_light_type">
						<option value="bulb">bulb</option>
						<option value="spot">spot</option>
					</select>
				</li>
			</ul>
			<section id="lightobj_setting_bulb">
				<ul class="split-form__data">
					<li class="l-mar-top-4">
						<label class="split-form__label">Show/Hide Light Bulb</label>
						<input type="checkbox" class="split-form__input property_check" id="lightobj_showlight_bulb">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Vertical</label>
						<input type="checkbox" class="split-form__input property_check" id="lightobj_vertical">
					</li>
					<li class="l-mar-top-4" id="lightobj_vertical_angle">
						<section style="width:70%">
							<div id="slider_lightobj_vert_angle"></div>
						</section>
						<section style="width:30%">
							<input type="number" step="0.01" class="split-form__input" id="text_lightobj_vert_angle">
						</section>
					</li>
					<li class="l-mar-top-4" id="lightobj_bgImage">
						<label class="split-form__label">Mapping</label>
						<button class="btn_small pull_right btn_reset_image" id="">X</button>
						<button class="btn_small pull_right btn_background_image" id="btn_lightobj_image" style="width:100px;">Image</button>
					</li>
				</ul>
			</section>
			<section id="lightobj_setting_spot">
				<ul class="split-form__data">
					<li class="l-mar-top-4">
						<label class="split-form__label">Hide Volumetric</label>
						<input type="checkbox" class="split-form__input property_check" id="lightobj_showlight_volumetric">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Hide Block</label>
						<input type="checkbox" class="split-form__input property_check" id="lightobj_showlight_block">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Target Position X</label>
						<input type="number" class="split-form__input" id="lightobj_target_x">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Target Position Y</label>
						<input type="number" class="split-form__input" id="lightobj_target_y">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Target Light Radius</label>
						<input type="number" step="0.01" class="split-form__input" id="lightobj_target_radius">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Attenuation</label>
						<input type="number" class="split-form__input" id="lightobj_attenuation">
					</li>
					<li class="l-mar-top-4">
						<label class="split-form__label">Angle Power</label>
						<input type="number" step="0.01" class="split-form__input" id="lightobj_anglePower">
					</li>
				</ul>
			</section>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="property_btn btn_object_backwards">
						<img src="images/dlg/backward.png">
					</button>
					<button class="property_btn" id="btn_lightobj_setaxis">
						<img src="images/dlg/setaxis.png">
					</button>
				</li>
				<li class="l-mar-top-4">
					<button class="property_btn property_text_btn btn_object_save">Save</button>
					<button class="property_btn property_text_btn btn_object_delete">Delete</button>
				</li>
<!-- 				<li class="l-mar-top-4">
					<label class="split-form__label">Selectable</label>
					<input type="checkbox" class="split-form__input property_check check_object_selectable">
				</li> -->
			</ul>
		</div>

		<!-- Shape Object -->
		<div class="context-edit animated-slow fadeInDown" id="shapeobj_normal" style="display:none;">
			<!-- <header class="has-centered-inline-content l-pad-bot-2">
				<span class="text-body--faint text-body--significant">Shape</span>
			</header> -->
			<ul class="split-form__data">
				<li class="l-mar-top-4">
					<label class="split-form__label">Shape</label>
					<input type="text" class="split-form__input width150 text_object_title" id="shapeobj_title" placeholder="Enter Name">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Tags</label>
					<input type="text" class="split-form__input width150 text_object_tags" id="shapeobj_tags">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Total Seats</label>
					<input type="number" class="split-form__input" id="shapeobj_seatcount" readonly>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row Distance</label>
					<input type="number" step="0.01" class="split-form__input" id="shapeobj_lineSpace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Rows</label>
					<input type="number" class="split-form__input" id="shapeobj_rows" min="1" max="50" maxlength="2">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row start Character</label>
					<input type="text" class="split-form__input" id="shapeobj_row_char">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Seat Space</label>
					<input type="number" step="0.01" class="split-form__input" id="shapeobj_seatspace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide Lines</label>
					<input type="checkbox" class="split-form__input property_check" id="shapeobj_showlines">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Section Height</label>
					<input type="number" step="0.01" class="split-form__input text_object_3dheight" id="shapeobj_3dheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Row Height</label>
					<input type="number" step="0.01" class="split-form__input" id="shapeobj_3dLayerheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Raise Section</label>
					<input type="number" step="0.01" class="split-form__input" id="shapeobj_raise">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="shapeobj_color">Section Color</label>
					<!-- <input type="color" class="color_form__input" id="shapeobj_color"> -->
					<div id="shapeobj_color" class="set_color_picker color_form__input"></div>
				</li>
				<!--<li class="l-mar-top-4">
					<label class="split-form__label">Direction</label>
					Forward<input type="checkbox" class="split-form__input" id="blackobj_direction">
				</li>-->
				<li class="l-mar-top-6">
					<label class="split-form__label">Splite Spaces</label>
					<input type="number" step="0.01" class="split-form__input" id="shapeobj_splitespace">
				</li>
				<li class="l-mar-top-6 object_wall_property">
					<label class="split-form__label pull_left">Wall Property</label>
					<div class="btn_wallprop">
						<img src="images/dlg/btn_show.png" class="show">
						<img src="images/dlg/btn_hide.png" class="hide" style="display: none;">
					</div>
					<section class="section_wall_prop" style="display: none">
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Front</label>
							<input type="checkbox" class="split-form__input property_check" id="shapeobj_wall_front">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Back</label>
							<input type="checkbox" class="split-form__input property_check" id="shapeobj_wall_back">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Left</label>
							<input type="checkbox" class="split-form__input property_check" id="shapeobj_wall_left">
						</li>
						<li class="l-mar-top-4">
							<label class="split-form__label">Wall Right</label>
							<input type="checkbox" class="split-form__input property_check" id="shapeobj_wall_right">
						</li>
					</section>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="blockobj_color">Seat Color</label>
					<!-- <input type="color" class="color_form__input" id="shapeobj_seat_color"> -->
					<div id="shapeobj_seat_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Upstair Section</label>
					<input type="number" class="split-form__input" id="shapeobj_upstair">
				</li>
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="property_btn" id="btn_shapeobj_fliph">
						<img src="images/dlg/flip_horiz.png">
					</button>
					<button class="property_btn" id="btn_shapeobj_flipv">
						<img src="images/dlg/flip_vert.png">
					</button>
					<button class="property_btn" id="btn_shapeobj_splite">
						<img src="images/dlg/setaxis.png">
					</button>
					<button class="property_btn btn_object_backwards">
						<img src="images/dlg/backward.png">
					</button>
				</li>
				<li class="l-mar-top-4">
					<button class="property_btn property_text_btn btn_object_save">Save</button>
					<button class="property_btn property_text_btn btn_object_delete">Delete</button>
				</li>
<!-- 				<li class="l-mar-top-4">
					<label class="split-form__label">Selectable</label>
					<input type="checkbox" class="split-form__input property_check check_object_selectable">
				</li> -->
			</ul>
		</div>

		<!-- Selection Group -->
		<div class="context-edit animated-slow fadeInDown" id="panel_selection_group" style="display:none;">
			<ul class="split-form__data">
				<!--<li class="l-mar-top-4">
					<label class="split-form__label">Seats</label>
					<input type="number" class="split-form__input" id="selection_seatcount" readonly>
				</li>-->
				<li class="l-mar-top-4">
					<label class="split-form__label">View Score (1~10)</label>
					<input type="number" class="split-form__input" id="selection_viewscore">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Row Distance</label>
					<input type="number" step="0.01" class="split-form__input" id="selection_lineSpace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Seat Space</label>
					<input type="number" step="0.01" class="split-form__input" id="selection_seatspace">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">Show/Hide Lines</label>
					<input type="checkbox" class="split-form__input property_check" id="selection_showlines">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Section Height</label>
					<input type="number" step="0.01" class="split-form__input" id="selection_3dheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label">3D Row Height</label>
					<input type="number" step="0.01" class="split-form__input" id="selection_3dLayerheight">
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="selection_color">Section Color</label>
					<!-- <input type="color" class="color_form__input" id="selection_color"> -->
					<div id="selection_color" class="set_color_picker color_form__input"></div>
				</li>
				<li class="l-mar-top-4">
					<label class="split-form__label" for="selection_seatcolor">Seat Color</label>
					<div id="selection_seat_color" class="set_color_picker color_form__input"></div>
				</li>
			</ul>
			<ul class="split-form__actions">
				<li class="l-mar-top-4">
					<button class="property_btn" id="btn_groupobj_fliph">
						<img src="images/dlg/flip_horiz.png">
					</button>
					<button class="property_btn" id="btn_groupobj_flipv">
						<img src="images/dlg/flip_vert.png">
					</button>
				</li>
				<li class="l-mar-top-4">
					<button class="btn btn--secondary btn--full-width" id="btn_selection_delete">Delete</button>
				</li>
			</ul>
		</div>

		<!-- Layer Toolbar -->
		<div class="animated-slow fadeInDown" id="dlg_layers" style="display:block;">
			<header class="">
				<!-- <span class="">Layers</span> -->
				<div>
					<section id="btn_layer_refresh">
						<img src="images/btn_refresh.png">
					</section>
					<section id="btn_layer_show">
						<img src="images/btn_layer_show.png">
					</section>
					<section id="btn_layer_hide">
						<img src="images/btn_layer_hide.png">
					</section>
				</div>
			</header>
			<div id="layers_content">
				<ul>
					<li>
						<section class="btn_tool">
							<div class="button">
								<img src="images/eye.png">
							</div>
							<div class="button">
								<img src="images/toolbar_light.png">
							</div>
						</section>
						<section class="object">
							<img src="images/toolbar_light.png">
						</section>
						<section class="title">
							<span>Light ceiling</span>
						</section>
						<section class="btn_delete button">
							<img src="images/delete-icon.png">
						</section>
					</li>
					<li>
						<section class="btn_tool">
							<div class="button">
								<img src="images/eye.png">
							</div>
							<div class="button">
								<img src="images/toolbar_light.png">
							</div>
						</section>
						<section class="object">
							<img src="images/toolbar_light.png">
						</section>
						<section class="title">
							<span>Light ceiling</span>
						</section>
						<section class="btn_delete button">
							<img src="images/delete-icon.png">
						</section>
					</li>
				</ul>
			</div>
		</div>

	</div>


	<!-- 3D Shape Object -->
	<!-- <div class="context-edit animated-slow fadeInDown" id="3d_shapeobj" style="display:none;">
		<header class="has-centered-inline-content l-pad-bot-2">
			<span class="text-body--faint text-body--significant">Shape</span>
		</header>
		<ul class="split-form__data">
			<li class="l-mar-top-4">
				<label class="split-form__label">Rows</label>
				<input type="number" class="split-form__input" id="3dshapeobj_rows" min="1" max="50" maxlength="2">
			</li>
		</ul>
	</div> -->
	
	<div id="preview">
		<div id="preview_handler">
			<section class="icon">
				<img src="images/3d_preview/icon.png">
			</section>
			<section class="title">
				<span>3D View</span>
			</section>
		</div>
		<div id="preview_3d">
			<div class="toolbar">
				<section id="btn_preview_refresh">
					<img src="images/3d_preview/btn_cam_init.png" class="on" style="padding: 13px 11px;">
				</section>
				<section id="btn_3dpreview_zoom">
					<img src="images/3d_preview/btn_zoom_out.png" class="on" style="padding: 10px 9px;">
					<img src="images/3d_preview/btn_zoom_in.png" class="off" style="padding: 10px 9px;">
				</section>
				<section id="btn_3dcamera_view">
					<img src="images/3d_preview/camearspot.png" class="on" style="padding: 9px 13px;">
					<img src="images/3d_preview/camearspot_on.png" class="off" style="padding: 9px 13px;">
				</section>
			</div>
		</div>
	</div>

	<div style="display:none"><canvas id="canvas_temp"></canvas></div>

	<div id="dlg_save_filename" class="dlg_filesave" type="">
		<div id="background">
			<section>
				<input type="text" name="" id="text_save_filename">
			</section>
			<section>
				<button id="btn_saveasfile">OK</button>
				<button id="btn_save_cancel">Cancel</button>
			</section>
		</div>
	</div>

	<!-- The Modal -->
	<div id="progressModal" class="modal">
		<!--<div id="uploadprogress" class="uploadprogress"></div>-->
		<div class="progress-bar blue shine stripes"><span id="uploadprogressbar" name="uploadprogressbar" style="width: 10%">Processing...</span></div>
	</div>
<!-- 	<div id="dlg_selection">
		<section>
			<button class="btn_selection" id="prev">Prev</button>
			<button class="btn_selection" id="next">Next</button>
			<button class="btn_selection" id="all_enable">All Enable</button>
			<button class="btn_selection" id="close">X</button>
		</ssection>
	</div> -->
	<form enctype="multipart/form-data" class="form-horizontal form-label-left" id="myform" action="index.php" method="post">
	</form>
	<iframe id="file_download_iframe" style="display:none;"></iframe>

</body>
</html>