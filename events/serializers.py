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
    value=serializers.DecimalField(decimal_places=3, allow_null=True)
    athlete_id=serializers.IntegerField()
    athlete=serializers.CharField()
    team=serializers.CharField(max_length=3)