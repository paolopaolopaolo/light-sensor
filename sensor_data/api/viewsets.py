from rest_framework.decorators import list_route
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response
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

    @list_route(methods=['POST'])
    def bulk_post(self, request):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            sensor_data = [SensorData(**datum) for datum in serializer.data]
            SensorData.objects.bulk_create(sensor_data)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)

    @list_route(methods=['GET'])
    def latest(self, request):
        serializer = self.get_serializer(self.get_queryset().order_by('-timestamp').first())
        return Response(serializer.data)

    @list_route(methods=['GET'])
    def latest_hundred(self, request):
        serializer = self.get_serializer(self.get_queryset().order_by('-timestamp')[0:100], many=True)
        return Response(serializer.data)
