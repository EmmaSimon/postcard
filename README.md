Postcard Creator
================

Take an image with your webcam or upload one from your computer, then add text to it and choose to email the generated image or post it in a public gallery.
It's running at jellyfish.software/postcard.


Requirements
------------

This app was written in Python using Django.
I have it running on a Raspberry Pi running Raspian Wheezy, but it should run on most Linux systems.
Django 1.8.3
https://github.com/jhuckaby/webcamjs is used for managing the webcam (already installed with static js files)
https://gist.github.com/zacharyvoase/5538178 is used for decoding base 64 data URIs (already installed in postcard directory)
Pillow
Gunicorn (If you want to use the manage.py development server instead, you can remove it from INSTALLED_APPS in settings.py)
virtualenv (Not necessary, but good for containing the python files)

Configuration
-------------

You should only have to change information in settings.py.
Change SECRET_KEY to a secret key of your choosing
If you want remote access, add your domain to ALLOWED_HOSTS
Under Email settings at the end, you must add the host of your SMTP server, the user, the password, the default from email, and change the port if necessary.