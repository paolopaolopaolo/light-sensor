from .base import *

DEBUG = True
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "{{ lookup('vault', 'secret/lightsensor_development', 'secret_key', 'vault_test.json') }}"

ALLOWED_HOSTS = ["104.236.75.26", ]
