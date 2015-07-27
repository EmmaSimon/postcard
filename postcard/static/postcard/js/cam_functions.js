Webcam.attach( '#my_camera' );

var cam_image;
var camera_on = true;
var snapped = false;
var my_c=document.getElementById('my_canvas');
var my_ctx=my_c.getContext('2d');
var width;
var height;


// Initialize camera width and height values
function cam_init() {
	width = parseInt(document.getElementById('my_camera').style.width, 10);
	height = parseInt(document.getElementById('my_camera').style.height, 10);
	my_c.width = width;
	my_c.height = height;
}


// Takes a snapshot from the live webcam feed
function take_snapshot() {
	snapped = true;

	// Capture an image from the webcam stream
	Webcam.snap( function(data_uri, c, ctx) {
	 	cam_image = document.createElement('canvas');
	 	cam_image.width = width;
	 	cam_image.height = height;
	 	cam_image.getContext('2d').drawImage( c, 0, 0 );
	 	edit_image();
	} );

	// Hide the webcam stream
	document.getElementById('my_camera').style.display = 'none';
	// Hide the button for taking a snapshot and show the one for resetting
	document.getElementById('snap').style.display = 'none';
	document.getElementById('retry').style.display = 'inline';
}


// Resets the webcam
function retake_snapshot() {
	// Reinitializes the webcam stream
	document.getElementById('my_camera').style.display = 'inline';
	snapped = false;
	// Clear the canvas so you can see the webcam
	my_ctx.clearRect( 0, 0, my_c.width, my_c.height );
	document.getElementById('id_snapshot').value = '';
	// Hide the button for resetting and show the one for taking a snapshot
	document.getElementById('snap').style.display = 'inline';
	document.getElementById('retry').style.display = 'none';
}


// Returns a canvas of the unedited image
function get_snapshot() {
	if (snapped == true) {
		return cam_image;
	}
}
