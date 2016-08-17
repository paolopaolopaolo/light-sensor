from django.core.management.base import BaseCommand
from sensor_data.models import SensorData

class Command(BaseCommand):
    help = 'Clears sensor data (to speed up system)'

    def handle(self, *args, **options):
        SensorData.objects.all().delete()
