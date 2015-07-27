#!/bin/bash

NAME="photobooth"                              #Name of the application (*)
DJANGODIR= _YOUR_DIRECTORY_             # Django project directory (*)
GROUP=webdata                                     # the group to run as (*)
NUM_WORKERS=1                                     # how many worker processes should Gunicorn spawn (*)
DJANGO_SETTINGS_MODULE=photobooth.settings             # which settings file should Django use (*)
DJANGO_WSGI_MODULE=photobooth.wsgi                     # WSGI module name (*)
VENV_PATH= _YOUR_VENV_

echo "Starting $NAME as `whoami`"

# Activate the virtual environment
cd $DJANGODIR
source $VENV_PATH/bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH

# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec $VENV_PATH/bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
  --name $NAME \
  --workers $NUM_WORKERS \
  --bind="127.0.0.1:9998" \
  --daemon
