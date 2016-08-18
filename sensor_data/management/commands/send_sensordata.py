from django.core.management.base import BaseCommand
from sensor_data.models import SensorData
from django.conf import settings
import csv
import datetime
import zipfile
import os

class Command(BaseCommand):
    help = 'Clears sensor data (to speed up system)'

    def add_arguments(self, parser):
        parser.add_argument('email', nargs='+', type=str)

    def handle(self, *args, **options):
        to_email = options.get('email')[1]
        now = datetime.datetime.now().isoformat()
        total_sensor_data = ([sensordata.timestamp, sensordata.light_level] for sensordata in SensorData.objects.iterator())
        with open('./lightsensor{}.csv'.format(now), 'w') as csvfile:
            csvwriter = csv.writer(csvfile)
            csvwriter.writerow(['time', 'light_level'])
            for sensor_data in total_sensor_data:
                csvwriter.writerow(sensor_data)
        with zipfile.ZipFile('./lightsensor{}.csv.zip'.format(now), 'w') as csvzip:
            csvzip.write('./lightsensor{}.csv'.format(now))
            os.remove('./lightsensor{}.csv'.format(now))

        from django.core.mail import EmailMessage
        email = EmailMessage(
            'Light Sensor: {}'.format(datetime.datetime.now().isoformat()),
            'Attached to this email is an amazing CSV. Enjoy!',
            settings.EMAIL_HOST_USER,
            [to_email, ],
        )
        email.attach_file('./lightsensor{}.csv.zip'.format(now))
        os.remove('./lightsensor{}.csv.zip'.format(now))
        email.send()
        SensorData.objects.all().delete()
