# core/views.py
from rest_framework import generics
from .models import Team, Athlete, Competition, Event, Result
from .serializers import TeamSerializer, AthleteSerializer, CompetitionSerializer, EventSerializer, ResultSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ResultFilter
from django.core.management import call_command
from rest_framework import status

class BaseListCreateAPIView(generics.ListCreateAPIView):
    def get_queryset(self):
        model = self.serializer_class.Meta.model
        return model.objects.all()

    def perform_create(self, serializer):
        instance = serializer.save()
        self.instance_id = instance.id

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data['id'] = self.instance_id
        return response

class BaseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        model = self.serializer_class.Meta.model
        return model.objects.all()

# Team Views
class TeamListCreateAPIView(BaseListCreateAPIView):
    serializer_class = TeamSerializer

class TeamDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = TeamSerializer

# Athlete Views
class AthleteListCreateAPIView(BaseListCreateAPIView):
    serializer_class = AthleteSerializer

class AthleteDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = AthleteSerializer

# Competition Views
class CompetitionListCreateAPIView(BaseListCreateAPIView):
    serializer_class = CompetitionSerializer

class CompetitionDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = CompetitionSerializer

# Event Views
class EventListCreateAPIView(BaseListCreateAPIView):
    serializer_class = EventSerializer

class EventDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer

# Result Views
class ResultListCreateAPIView(BaseListCreateAPIView):
    serializer_class = ResultSerializer

class ResultDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = ResultSerializer

class ResultFilterAPIView(generics.ListAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ResultFilter

#current constants by can be confiugured
FIRST_PLACE_EDGE = 1
MAX_SCORE_WITHOUT_EDGE = 11

def calc_event_result(event):
    if event.event_type == 'Time':
        results = Result.objects.filter(event=event).order_by('value')  # Ascending for time
    elif event.event_type == 'Distance':
        results = Result.objects.filter(event=event).order_by('-value')  # Descending for distance
    else:
        return Response({"error": "Invalid event measurement type"}, status=400)

    ranked_results = []
    for rank, result in enumerate(results, start=1):
        points = 0
        dist_from_first = rank - 1
        if rank == 1:
            points = MAX_SCORE_WITHOUT_EDGE + FIRST_PLACE_EDGE
        else:
            points = MAX_SCORE_WITHOUT_EDGE - dist_from_first
        ranked_results.append({
            'rank': rank,
            'athlete_id': result.athlete.id,
            'result': result.value,
            'points': points
        })
    return ranked_results

# Additional View for Ranked Athletes by Event Result
@api_view(['GET'])
def get_athletes_ranked_by_result(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    ranked_results = calc_event_result(event)
    for result in ranked_results:
        athlete_id = result['athlete_id']
        athlete = get_object_or_404(Athlete, pk=athlete_id)
        result['athlete_name'] = athlete.name
        del result['athlete_id']
    return Response(ranked_results)

@api_view(['GET'])
def get_teams_points(request, team_id):
    team = get_object_or_404(Team, pk=team_id)
    team_athletes = Athlete.objects.filter(team=team)
    team_athletes_ids = []
    for athlete in team_athletes:
        team_athletes_ids.append(athlete.id)
    events = Event.objects.filter(competition=team.competition)

    total_points = 0
    for event in events:
        ranked_results = calc_event_result(event)
        for result in ranked_results:
            if result['athlete_id'] in team_athletes_ids:
                total_points += result['points']

    return Response(total_points)

# given event, returns all athletes in event
@api_view(['GET'])
def get_event_athletes(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    results = Result.objects.filter(event=event)
    all_athletes = []
    for result in results:
        all_athletes.append(result.athlete)

    serializer = AthleteSerializer(all_athletes, many=True)
    return Response(serializer.data)

# given competition, return all athletes in competition
@api_view(['GET'])
def get_competition_athletes(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    teams = Team.objects.filter(competition=competition)
    all_athletes = Athlete.objects
    for team in teams:
        all_athletes.filter(team=team)

    serializer = AthleteSerializer(all_athletes, many=True)
    return Response(serializer.data)

from .utils import create_search_view

search_teams_by_name = create_search_view(Team)
search_athletes_by_name = create_search_view(Athlete)
search_competitions_by_name = create_search_view(Competition)
search_events_by_name = create_search_view(Event)


# visiting this wipes all database entries
# specifically added for debugging and testing
@api_view(['GET'])
def wipe_events_data(request):
    try:
        call_command('wipe_events')
        return Response({"message": "All entries in all tables in the events app have been wiped."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)