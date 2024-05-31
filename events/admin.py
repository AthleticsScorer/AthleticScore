from django.contrib import admin
from .models import Organisation, Athlete, Competition, Event, Result

admin.site.register(Organisation)
admin.site.register(Athlete)
admin.site.register(Competition)
admin.site.register(Event)
admin.site.register(Result)
