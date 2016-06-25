from .base import *

DEBUG = True
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "{{ lookup('vault', 'secret/lightsensor_developmentwithdns', 'secret_key', 'vault_test.json') }}"

ALLOWED_HOSTS = ["light.dpmercado.com", ]
