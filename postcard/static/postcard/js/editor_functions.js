var img;
var my_c;
var my_ctx;

// Initialize editor image and canvas
function editor_init() {
	// Only do this if it's being called from the editor
	if (document.title == 'Postcard Editor') {
		snapped = true;
		camera_on = false;
		img = new Image;
		img.src = document.getElementById('id_snapshot').value;
		my_c = document.getElementById('my_canvas');
		my_c.width = parseInt(document.getElementById('my_canvas').style.width, 10);
		my_c.height = parseInt(document.getElementById('my_canvas').style.height, 10)
		my_ctx = my_c.getContext('2d');
		my_ctx.drawImage( img, 0, 0 );
	}
};

// Render all canvas effects
function edit_image() {
	// Only render if the webcam isn't showing
	if (snapped) {
		if (camera_on == true) {
			img = get_snapshot();
		}

		// Create a temporary canvas for storing the text data
		var temp_canvas = document.createElement('canvas');
		temp_canvas.width = my_c.width;
		temp_canvas.height = my_c.height;
		var temp_context = temp_canvas.getContext('2d');

		// Set the position and font of the text
		var text_x = parseInt(my_c.width/50);
		var text_y = my_c.height - parseInt(my_c.width/50);
		temp_context.font = parseInt(my_c.height/8) + 'px Arial';

		// Process tex
		if (document.getElementById('id_text') != null) {
			text = document.getElementById('id_text').value;

			// If outline is solid, use fillText
			if (document.getElementById('id_outline').value == 'solid') {
				// If the color is rainbow, call rainbowizer to get a canvas with a rainbow fill and stroke style
				if (document.getElementById('id_text_color').value == 'rainbow') {
					temp_canvas = rainbowize( temp_canvas, text_x, text_y );
				} else {
					temp_context.fillStyle = document.getElementById('id_text_color').value;
				}
				temp_context.fillText( text, text_x, text_y );

			// If the outline is line, use strokeText
			} else if (document.getElementById('id_outline').value == 'line') {
				if (document.getElementById('id_text_color').value == 'rainbow') {
					temp_canvas = rainbowize( temp_canvas, text_x, text_y );
				} else {
					temp_context.strokeStyle = document.getElementById('id_text_color').value;
				}
				temp_context.strokeText( text, text_x, text_y );

			// If the outline is stroke and fill, use both
			} else if (document.getElementById('id_outline').value == 'diff') {
				if (document.getElementById('id_text_color').value == 'rainbow' && document.getElementById('id_outline_color').value == 'rainbow') {
					temp_canvas = rainbowize( temp_canvas, text_x, text_y );
				} else if (document.getElementById('id_text_color').value == 'rainbow') {
					temp_canvas = rainbowize( temp_canvas, text_x, text_y );
					temp_context.strokeStyle = document.getElementById('id_outline_color').value;
				} else if (document.getElementById('id_outline_color').value == 'rainbow') {
					temp_canvas = rainbowize( temp_canvas, text_x, text_y );
					temp_context.fillStyle = document.getElementById('id_text_color').value;
				} else {
					temp_context.fillStyle = document.getElementById('id_text_color').value;
					temp_context.strokeStyle = document.getElementById('id_outline_color').value;
				}
				temp_context.fillText( text, text_x, text_y );
				temp_context.strokeText( text, text_x, text_y );
			}
		}

		// Draw the base image then the text, to avoid stacking text
		my_ctx.drawImage( img, 0, 0 );
		my_ctx.drawImage( temp_canvas, 0, 0 );
		return temp_canvas;
	}
}

// Creates a rainbow gradient then sets it to both fill and stroke
function rainbowize( canvas, x, y ) {
	var ctx = canvas.getContext('2d');
	var rainbow = ctx.createLinearGradient( x, y, ctx.measureText(document.getElementById('id_text').value).width, y );
	rainbow.addColorStop( 0, 'red' );
	rainbow.addColorStop( 1/6, 'orange' );
	rainbow.addColorStop( 2/6, 'yellow' );
	rainbow.addColorStop( 3/6, 'green' );
	rainbow.addColorStop( 4/6, 'blue' );
	rainbow.addColorStop( 5/6, 'indigo' );
	rainbow.addColorStop( 1, 'violet' );
	ctx.fillStyle = rainbow;
	ctx.strokeStyle = rainbow;
	return canvas;
}