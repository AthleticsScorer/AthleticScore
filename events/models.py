# core/models.py
from django.db import models

class Organisation(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Athlete(models.Model):
    name = models.CharField(max_length=255)
    #organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='athletes', blank=True)

    def __str__(self):
        return self.name

class Competition(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Event(models.Model):
    EVENT_TYPES = [
        ("Distance", "distance"),
        ("Time", "time"),
    ]

    #event_name = models.CharField(max_length=100)
    age_group = models.CharField(max_length=100)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return f"{self.competition.name} - {self.event_type} ({self.age_group})"

class Result(models.Model):
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, related_name='results')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='results')
    value = models.DecimalField(max_digits=10, decimal_places=3, blank=True)

    def __str__(self):
        return f"{self.athlete.name} - {self.event} - {self.value}"

