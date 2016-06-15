from django.conf.urls import include, url
from django.contrib import admin
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from sensor_data.api.viewsets import SensorViewset

router = DefaultRouter()
router.register(r'light', SensorViewset, base_name='SensorViewset')

api_v1 = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api-token-auth/', views.obtain_auth_token)
]

urlpatterns = [
    url(r'^api/v1/', include(api_v1)),
    url(r'^admin/', include(admin.site.urls)),
]
