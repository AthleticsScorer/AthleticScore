# core/views.py
from rest_framework import generics
from .models import Organisation, Athlete, Competition, Event, Result
from .serializers import OrganisationSerializer, AthleteSerializer, CompetitionSerializer, EventSerializer, ResultSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class EventListAPIView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class ResultCreateAPIView(generics.CreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

@api_view(['GET'])
def get_athletes_ranked_by_result(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    results = Result.objects.filter(event=event).order_by('-value')  # Assuming higher values are better
    serializer = ResultSerializer(results, many=True)
    return Response(serializer.data)
