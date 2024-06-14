# core/models.py
from django.db import models
from django.forms import ValidationError

'''
class Account(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
'''
    
class Competition(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name

class Team(models.Model):
    name = models.CharField(max_length=255)
    short_code = models.CharField(max_length=3)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='teams')

    def __str__(self):
        return self.name

class Athlete(models.Model):
    name = models.CharField(max_length=255)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='athletes')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        existing_athlete = Athlete.objects.filter(name=self.name, team=self.team).first()
        if existing_athlete:
            return existing_athlete.id
        else:
            super(Athlete, self).save(*args, **kwargs)
            return self.id


class Event(models.Model):
    EVENT_TYPES = [
        ("Hurdles", "hurdles"),
        ("100 m", "100m"),
        ("200 m", "200m"),
        ("400 m", "400m"),
        ("800 m", "800m"),
        ("1500 m", "1500m"),
        ("2k Steeplechase", "2k"),
        ("Shot Put", "shot put"),
        ("Discus", "discus"),
        ("Javelin", "javelin"),
        ("High Jump", "high jump"),
        ("Long Jump", "long jump"),
        ("Triple Jump", "triple jump"),
    ]

    event_name = models.CharField(max_length=100)
    age_group = models.CharField(max_length=100)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    complete = models.BooleanField()
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='events')

    def __str__(self):
        return f"{self.competition.name} - {self.event_type} ({self.age_group})"


class Result(models.Model):
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, related_name='results')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='results')
    value = models.DecimalField(max_digits=10, decimal_places=3, blank=True, null=True)

    def __str__(self):
        return f"{self.athlete.name} - {self.event} - {self.value}"

    # Makes sure that athlete's team's competition matches event's competition
    # Check should be moved into view in future #
    def save(self, *args, **kwargs):
        if self.athlete.team.competition != self.event.competition:
            raise ValidationError("Athlete's team competition does not match event competition.")
        super().save(*args, **kwargs)
