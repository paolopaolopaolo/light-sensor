from django.shortcuts import render
from django.contrib.sites.shortcuts import get_current_site

# Create your views here.
def home(request, *args, **kwargs):
    context = {
        'domain': get_current_site(request).domain,
        'protocol': 'http://',
    }
    return render(request, 'base.html')