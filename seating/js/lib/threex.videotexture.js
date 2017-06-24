var THREEx = THREEx || {}

THREEx.VideoTexture	= function(url){
	// create the video element
	var video, texture, imageContext, image;

	var video	= document.createElement('video');
	// video.width	= 512;
	// video.height	= 256;
	video.autoplay	= true;
	video.loop	= true;
	video.src	= url;

	// video.videoWidth = 512;
	// video.videoHeight = 256;

	this.init = function() {
		image = document.createElement( 'canvas' );
		image.width = 128;
		image.height = 128;
		imageContext = image.getContext( '2d' );
		imageContext.fillStyle = '#000000';
		imageContext.fillRect( 0, 0, 128, 128 );

		texture = new THREE.Texture( image );
		this.texture	= texture;
	}


	/**
	 * update the object
	 */
	this.update	= function() {
		if(video.readyState !== video.HAVE_ENOUGH_DATA) return;
		imageContext.drawImage( video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 128, 128 );
		if(texture)
			texture.needsUpdate	= true;		
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function() {
		video.pause();
	}

	this.pauseOrResume = function() {
		if(video.paused)
			video.play();
		else
			video.pause();
	}

	this.init();
}