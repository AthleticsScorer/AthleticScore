from django.db import IntegrityError
from django.forms import ValidationError
from rest_framework import serializers
from .models import Team, Athlete, Competition, Event, Result

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ["id"]

class AthleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Athlete
        fields = '__all__'
        read_only_fields = ["id"]

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'
        read_only_fields = ["id"]

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ["id"]

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ["id"]

class ResultDetailSerializer(serializers.Serializer):
    value=serializers.DecimalField(max_digits=10, decimal_places=3, allow_null=True)
    athlete_id=serializers.IntegerField()
    athlete=serializers.CharField()
    team=serializers.CharField()

class AthleteEventSerializer(serializers.Serializer):
    name=serializers.CharField()
    event_id=serializers.IntegerField()

class BestPerformerSerializer(serializers.Serializer):
    athlete=serializers.CharField()
    team=serializers.CharField()
    performance=serializers.FloatField()
    age_group=serializers.CharField()
    event=serializers.CharField()
    string=serializers.CharField()
    result=serializers.DecimalField(max_digits=10, decimal_places=3)

class WinnerSerializer(serializers.Serializer):
    string=serializers.CharField()
    age_group=serializers.CharField()
    event_type=serializers.CharField()
    athlete=serializers.CharField()
    team=serializers.CharField()