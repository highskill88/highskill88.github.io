/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( "YXZ" );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alpha = 0;
	this.alphaOffsetAngle = 0;

	this.clock = new THREE.Clock();
	this.elaspetime = 0;

	var onDeviceOrientationChangeEvent = function( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function() {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function() {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

		return function( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

		}

	}();

	this.connect = function() {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = true;

	};

	this.disconnect = function() {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

		scope.enabled = false;

	};

	var EPS = 0.000001;
	var lastQuaternion = new THREE.Quaternion();
	var lastPosition = new THREE.Vector3();
	this.update = function() {

		if ( scope.enabled === false ) return;

		var delta = this.clock.getDelta();
		if(this.elaspetime > 0.5) {
			this.elaspetime = 0;
			this.getLocation();
			// if(curPos) {
			// 	var vector = new THREE.Vector3( 0, 0, -1 );
			// 	vector.applyQuaternion( scope.object.quaternion );
			// 	scope.object.position.addVector(vector);
			// }
		}
		this.elaspetime += delta;

		var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
		var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
		var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
		var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

		setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
		this.alpha = alpha;

		if (8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {
			lastQuaternion.copy( scope.object.quaternion );
			return true;
		}
	};

	this.getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(function(position) {
				if(position) {
					alert('aaa');
					var curPos = new THREE.Vector3(position.coords.latitude, position.coords.longitude, 0);

					var vector = new THREE.Vector3( 0, 0, -10 );
					vector.applyQuaternion( scope.object.quaternion );
					scope.object.position.add(vector);

					if(lastPosition.distanceToSquared(curPos) > EPS) {
						alert('bbb');
						lastPosition.copy(curPos);
						return curPos;
					}
				}
			}, function(error) {
				var strError = '';
			    switch(error.code) {
			        case error.PERMISSION_DENIED:
			            strError = "User denied the request for Geolocation."
			            break;
			        case error.POSITION_UNAVAILABLE:
			            strError = "Location information is unavailable."
			            break;
			        case error.TIMEOUT:
			            strError = "The request to get user location timed out."
			            break;
			        case error.UNKNOWN_ERROR:
			            strError = "An unknown error occurred."
			            break;
			    }
			    // alert(strError);
			});
		} else { 
			// alert("Geolocation is not supported by this browser.");
		}
	}


	this.updateAlphaOffsetAngle = function( angle ) {

		this.alphaOffsetAngle = angle;
		this.update();

	};

	this.dispose = function() {

		this.disconnect();

	};

	this.getAzimuthalAngle = function() {
		return 0;
	}

	this.connect();

};
