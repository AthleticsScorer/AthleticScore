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

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.object.id
        return response

class OrganisationDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

# Athlete Views
class AthleteListCreateAPIView(generics.ListCreateAPIView):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.object.id
        return response

class AthleteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer

# Competition Views
class CompetitionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.object.id
        return response

class CompetitionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

# Event Views
class EventListCreateAPIView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.object.id
        return response

class EventDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

# Result Views
class ResultListCreateAPIView(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.object.id
        return response

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