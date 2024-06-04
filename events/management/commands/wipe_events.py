from django.core.management.base import BaseCommand
from django.apps import apps

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        app = apps.get_app_config('events')
        for model in app.get_models():
            model.objects.all().delete()