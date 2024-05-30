# core/views.py
from rest_framework import generics
from .models import Organisation, Athlete, Competition, Event, Result
from .serializers import OrganisationSerializer, AthleteSerializer, CompetitionSerializer, EventSerializer, ResultSerializer

# Organisation Views
class OrganisationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

class OrganisationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

# Athlete Views
class AthleteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer

class AthleteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer

# Competition Views
class CompetitionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class CompetitionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

# Event Views
class EventListCreateAPIView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

# Result Views
class ResultListCreateAPIView(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

class ResultDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

# Additional View for Ranked Athletes by Event Result
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def get_athletes_ranked_by_result(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    if event.event_type == 'time':
        results = Result.objects.filter(event=event).order_by('-value')
    else:
        results = Result.objects.filter(event=event).order_by('value')
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)
