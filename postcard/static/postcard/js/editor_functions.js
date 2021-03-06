var img;
var my_c;
var my_ctx;
var mouse_over = false;
var mouse_down = false;
var text_x = 0;
var text_y = 0;
var font;
var font_size;

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
	}

	// Set the initial position and font of the text
	text_x = parseInt(my_c.width/30);
	text_y = my_c.height - parseInt(my_c.width/30, 10);
	document.getElementById('id_font_size').value = '60px ';
	font_size = document.getElementById('id_font_size').value;
	font = font_size + document.getElementById('id_font').value;
	my_c.getContext('2d').font = font;
	edit_image();
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
		update_font(temp_canvas);

		// Draw the base image before the text, to avoid stacking text
		my_ctx.drawImage( img, 0, 0 );

		// Process text style
		if (document.getElementById('id_text') != null && document.getElementById('id_text').value != '') {
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

			// Draw the text canvas over the image
			my_ctx.drawImage( temp_canvas, 0, 0 );
		}
	}
}


// Creates a rainbow gradient then sets it to both fill and stroke
function rainbowize( canvas, x, y ) {
	var ctx = canvas.getContext('2d');
	x = parseInt(x);
	y = parseInt(y);
	w = parseInt(ctx.measureText(document.getElementById('id_text').value).width);
	var rainbow = ctx.createLinearGradient( x, y, (x + w), y );
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


// Updates the current X and Y positions of the mouse
function update_mouse_position( event ) {
	if (mouse_down && mouse_over) {
		text_x = event.pageX - (my_ctx.measureText(document.getElementById('id_text').value).width / 2);
		text_y = event.pageY - (parseInt(font_size, 10) / 2);
	}
}


// Updates the font with the currently selected value
function update_font( canvas ) {
	font_size = document.getElementById('id_font_size').value;
	font = font_size + document.getElementById('id_font').value;
	canvas.getContext('2d').font = font;
}