from rest_framework.authentication import TokenAuthentication
from rest_framework.viewsets import ModelViewSet
from sensor_data.api.serializers import SensorSerializer


class SensorViewset(ModelViewSet):
    serializer_class = SensorSerializer
    permission_classes = [TokenAuthentication,]


