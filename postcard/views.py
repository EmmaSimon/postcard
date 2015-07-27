
from django.core.files.storage import default_storage
from django.core.mail import EmailMessage
from django.shortcuts import redirect
from django.shortcuts import render
from django.core.files import File
from .forms import ImageUploadForm
from .forms import ImageEditForm
from django.conf import settings
from data_uri import DataURI
from PIL import Image
import os

# Set the base HTML template
base_template = "postcard/base.html"

def index(request):
	if request.method == 'POST':
		form = ImageUploadForm(request.POST, request.FILES)
		if form.is_valid():

			# If the client has posted a snapshot, either from a webcam or the editor, save it right away
			if ('snapshot' in form.cleaned_data and form.cleaned_data['snapshot'] != ''):

				# Change the save location so it doesn't end up in the gallery
				default_storage.location = settings.MEDIA_ROOT
				if (form.cleaned_data['put_in_gallery'] == False):
					default_storage.location = os.path.join(settings.MEDIA_ROOT, 'private/')

				# Process and save the posted image data
				snapshot = DataURI(form.cleaned_data['snapshot']).data
				temp_file = default_storage.open(default_storage.get_available_name('snap.png', max_length=None), 'wb')
				temp_file.write(snapshot)
				save_path = os.path.join(default_storage.location, temp_file.name)
				temp_file.close();

				# If the client wants the image emailed, send it
				if ('email' in form.cleaned_data and form.cleaned_data['email'] != ''):
					subject = form.cleaned_data['email_subject']
					message = form.cleaned_data['email_message']
					if subject == '':
						subject='You got a postcard!'
					if message == '':
						message = 'Someone sent you a postcard from http://jellyfish.software/postcard!'

					postcard = EmailMessage(subject, message, to=[form.cleaned_data['email']])
					postcard.attach_file(save_path)
					postcard.send()

			# If the client has uploaded an image, render the editor so they can add text to it
			if ('image' in request.FILES and request.FILES['image'] != '' and request.FILES['image'].size < 2097152):
				default_storage.location = os.path.join(settings.MEDIA_ROOT, 'private/')
				save_path = default_storage.save(request.FILES['image'].name, request.FILES['image'])
				snap = DataURI.from_file(os.path.join(default_storage.location, save_path))

				# Use Pillow to check the image size for rendering the image correctly
				im = Image.open(os.path.join(default_storage.location, save_path))
				im_width, im_height = im.size

				# Put the image, along with some other form data that was just posted, into a new form
				data = {'snapshot': snap,
						'edit': 'on',
						'put_in_gallery': form.cleaned_data['put_in_gallery'],
						'send_email': form.cleaned_data['send_email'],
						'email': form.cleaned_data['email'],
						'email_subject': form.cleaned_data['email_subject'],
						'email_message': form.cleaned_data['email_message']}
				new_form = ImageUploadForm(data)
				new_form.is_valid()

				# Render the editor
				return render(request, 'postcard/editor.html', {'title': 'Postcard Editor', 'base_template': base_template, 'im_width': im_width, 'im_height': im_height, 'upload_form': new_form, 'edit_form': ImageEditForm()})

			# # In case the storage location was changed to the private folder, reset it to the default
			# default_storage.location = settings.MEDIA_ROOT

		# Redirect to the gallery after submission
		return redirect('gallery')
	else:
		# If a form isn't posted, just render the index
		upload_form = ImageUploadForm()
		edit_form = ImageEditForm()
		return render(request, 'postcard/index.html', {'title': 'Postcard Creator', 'base_template': base_template, 'upload_form': upload_form, 'edit_form': edit_form})

def gallery(request):
	# Get all the public image paths, then render the gallery with those paths
	imgs = []
	media_path = settings.MEDIA_ROOT
	for (path, dirname, filename) in os.walk(media_path):
		imgs.extend(filename)
		break
	return render(request, 'postcard/gallery.html', {'title': 'Postcard Gallery', 'base_template': base_template, 'imgs': imgs})