# core/views.py
from rest_framework import generics
from .models import Organisation, Athlete, Competition, Event, Result
from .serializers import OrganisationSerializer, AthleteSerializer, CompetitionSerializer, EventSerializer, ResultSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

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

    def perform_create(self, serializer):
        competition = serializer.save()
        self.competition_id = competition.id

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.competition_id
        return response

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
@api_view(['GET'])
def get_athletes_ranked_by_result(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    if event.event_type == 'time':
        results = Result.objects.filter(event=event).order_by('value')  # Ascending for time
    elif event.event_type == 'distance':
        results = Result.objects.filter(event=event).order_by('-value')  # Descending for distance
    else:
        return Response({"error": "Invalid event measurement type"}, status=400)

    ranked_results = []
    for rank, result in enumerate(results, start=1):
        ranked_results.append({
            'rank': rank,
            'athlete_name': result.athlete.name,
            event.event_type: result.value
        })

    return Response(ranked_results)

@api_view(['GET'])
def search_athletes_by_name(request):
    query = request.query_params.get('name', None)
    if query is not None:
        athletes = Athlete.objects.filter(name__icontains=query)
        results = [{'id': athlete.id, 'name': athlete.name} for athlete in athletes]
        return Response(results)
    else:
        return Response({"error": "Name parameter is required"}, status=400)

@api_view(['GET'])
def search_competitions_by_name(request):
    query = request.query_params.get('name', None)
    if query is not None:
        competitions = Competition.objects.filter(name__icontains(query))
        results = [{'id': competition.id, 'name': competition.name} for competition in competitions]
        return Response(results)
    else:
        return Response({"error": "Name parameter is required"}, status=400)

@api_view(['GET'])
def search_organisations_by_name(request):
    query = request.query_params.get('name', None)
    if query is not None:
        organisations = Organisation.objects.filter(name__icontains(query))
        results = [{'id': organisation.id, 'name': organisation.name} for organisation in organisations]
        return Response(results)
    else:
        return Response({"error": "Name parameter is required"}, status=400)