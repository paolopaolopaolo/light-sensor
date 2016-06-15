from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from sensor_data.api.serializers import SensorSerializer
from sensor_data.models import SensorData


class SensorViewset(CreateModelMixin,
                    ListModelMixin,
                    RetrieveModelMixin,
                    GenericViewSet):

    class Meta:
        model = SensorData

    serializer_class = SensorSerializer
    queryset = SensorData.objects.all()
