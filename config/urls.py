from django.conf.urls import include, url
from django.contrib import admin
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from sensor_data.api.viewsets import SensorViewset
from sensor_data.views import home
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'light', SensorViewset, base_name='Sensor')

api_v1 = [
    url(r'^', include(router.urls)),
    url(r'^api-token-auth/', views.obtain_auth_token)
]

urlpatterns = [
    url(r'^$', home),
    url(r'^api/v1/', include(api_v1)),
    url(r'^admin/', include(admin.site.urls)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

