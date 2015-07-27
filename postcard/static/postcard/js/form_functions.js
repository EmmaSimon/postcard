// Call the other initialization fuctions and add event listeners for updating forms and the canvas
window.onload = function() {
	editor_init();
	if (camera_on) {cam_init();}
	document.getElementById('id_snapshot').addEventListener('click', function() {img = get_cam_image();});
	document.getElementById('id_send_email').addEventListener('change', display_email_options);
	document.getElementById('id_outline_color').addEventListener("change", edit_image);
	document.getElementById('id_outline').addEventListener('change', outline_change);
	document.getElementById('id_text_color').addEventListener('change', edit_image);
	document.getElementById('id_outline').addEventListener("change", edit_image);
	document.getElementById('id_text').addEventListener("keyup", edit_image);
	window.display_email_options();
};


// Checks if the client wants to send an email and displays the email options if they do
function display_email_options() {
	if (document.getElementById('id_send_email').checked) {
		var email_inputs = document.getElementsByClassName("email_text");
		for (var i = 0; i < email_inputs.length; i++) {
			email_inputs[i].style.display = 'inline';
		}
	} else {
		var email_inputs = document.getElementsByClassName("email_text");
		for (var i = 0; i < email_inputs.length; i++) {
			email_inputs[i].style.display = 'none';
		}
	}
}


// Checks if the client wants different colors for the text and displays a second color picker if they do
function outline_change() {
	if (document.getElementById('id_outline').value == 'diff') {
		document.getElementById('id_outline_color').style.display = 'inline';
	} else {
		document.getElementById('id_outline_color').style.display = 'none';
	}
}


// Checks that the input is valid and submits the form if it is, prompts the user if it isn't
function process_form(evt) {
	evt = evt || window.event();
	var bad_input = false;
	// If there is both a snapshot and an image upload, let the client know to make sure that's what they meant to do
	if (camera_on && snapped && document.getElementById('id_image').value != '') {
		if (!confirm('It looks like you took a webcam snapshot and chose an image from your computer. They will both be submitted if you click ok.')) {
			bad_input = true;
		}

	// If there isn't a snapshot or an image upload, send an alert and don't submit
	} else if (!snapped && document.getElementById('id_image').value == '') {
		alert("You haven't taken a snapshot or uploaded an image.");
		bad_input = true;
	}

	// If the client checked the email box but didn't prrovide an email, send an alert and don't submit
	if (document.getElementById('id_send_email').checked && document.getElementById('id_email').value == '') {
		alert("You didn't enter an email address.");
		bad_input = true;
	}

	if (bad_input) {
		evt.preventDefault();
	} else {
		// If the user took a snapshot or was in the editor, save the canvas
		if (snapped || !camera_on) {
			document.getElementById('id_snapshot').value = my_c.toDataURL();
		}
		document.forms['main_form'].submit();
	}
}