from django import forms

# Form with options for editing a canvas
class ImageEditForm(forms.Form):
	# Colors for the image text
	colors = (('black', 'Black'),
			  ('white', 'White'),
			  ('red', 'Red'),
			  ('orange', 'Orange'),
			  ('yellow', 'Yellow'),
			  ('green', 'Green'),
			  ('blue', 'Blue'),
			  ('indigo', 'Indigo'),
			  ('violet', 'Violet'),
			  ('pink', 'Pink'),
			  ('purple', 'Purple'),
			  ('rainbow', 'Rainbow'),)

	# Styles for the image text
	line_styles = (('solid', 'Solid Text'),
				   ('line', 'Outlined Text'),
				   ('diff', 'Different colored fill and border'),)

	sizes = (('20px ', 'Smallest'),
			 ('40px ', 'Small'),
			 ('60px ', 'Medium'),
			 ('80px ', 'Large'),
			 ('100px ', 'Largest'),)

	fonts = (('Georgia', 'Georgia'), 
			 ('Times', 'Times New Roman'), 
			 ('Arial', 'Arial'), 
			 ('Comic Sans MS', 'Comic Sans'), 
			 ('Impact', 'Impact'), 
			 ('Trebuchet MS', 'Trebuchet'), 
			 ('Courier', 'Courier'),)

	text = forms.CharField(label='', required=False, max_length=100, widget=forms.TextInput(attrs={'class':'image_edit', 'placeholder':'Text to display on image'}))
	text_color = forms.ChoiceField(widget=forms.Select(attrs={'class':'image_edit'}), choices=colors)
	outline = forms.ChoiceField(widget=forms.Select(attrs={'class':'image_edit'}), choices=line_styles)
	outline_color = forms.ChoiceField(widget=forms.Select(attrs={'class':'image_edit'}), choices=colors)
	font = forms.ChoiceField(widget=forms.Select(attrs={'class':'image_edit'}), choices=fonts)
	font_size = forms.ChoiceField(widget=forms.Select(attrs={'class':'image_edit'}), choices=sizes)

# Form for uploading images
class ImageUploadForm(forms.Form):
	image = forms.ImageField(label='Upload an image (You can edit it after you press submit): ', required=False)
	put_in_gallery = forms.BooleanField(label='Add your image to a public gallery: ', required=False)
	send_email = forms.BooleanField(label='Send your image to an email: ', required=False)
	email = forms.EmailField(label='', required=False, widget=forms.EmailInput(attrs={'placeholder':'Email of recipient', 'class':'email_text'}))
	email_subject = forms.CharField(label='', required=False, max_length=78, widget=forms.TextInput(attrs={'placeholder':'Subject', 'class':'email_text'}))
	email_message = forms.CharField(label='', required=False, widget=forms.Textarea(attrs={'placeholder':'Message', 'class':'email_text'}))
	snapshot = forms.CharField(label='', required=False, max_length=5242880, widget=forms.Textarea(attrs={'style':'display:none'}))
