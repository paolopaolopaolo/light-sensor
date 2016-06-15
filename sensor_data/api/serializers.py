from rest_framework.serializers import ModelSerializer
from sensor_data.models import SensorData


class SensorSerializer(ModelSerializer):

    class Meta:
        model = SensorData
        fields = ('id', 'timestamp', 'light_level')
