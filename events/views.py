# core/views.py
from rest_framework import generics
from .models import Team, Athlete, Competition, Event, Result
from .serializers import TeamSerializer, AthleteSerializer, CompetitionSerializer, EventSerializer, ResultSerializer, ResultDetailSerializer, AthleteEventSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.management import call_command
from rest_framework import status
from django.forms import ValidationError
from datetime import date

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

@api_view(['POST'])
def bulk_create_events(request, f_id):
    existing = Event.objects.filter(competition_id=f_id)
    age_groups=[]
    event_types=[]
    names=[]
    for event in existing:
        if not event.age_group in age_groups:
            age_groups.append(event.age_group)
        if not event.event_name in names:
            names.append(event.event_name)
        if not event.event_type in event_types:
            event_types.append(event.event_type)
    r_age_groups=request.data['age_groups'] if request.data['age_groups'] else [""] # Allows no age groups to be defined
    update_age_group=[]
    new_age_groups=[] # If this isn't empty by the bulk_update of age groups it contains all of the new age groups to be created
    for age_group in r_age_groups:
        if not age_group in age_groups:
            new_age_groups.append(age_group)
    for age_group in age_groups:
        if not age_group in r_age_groups:    
            new_age_group = None if len(new_age_groups) == 0 else new_age_groups.pop(0)
            for event in existing.filter(age_group=age_group):
                if not new_age_group:
                    event.delete()
                else:
                    event.age_group=new_age_group
                    update_age_group.append(event)
    Event.objects.bulk_update(update_age_group,["age_group"])
    r_event_types=request.data['event_types']
    update_event_type=[]
    new_event_types=[]
    for event_type in r_event_types:
        if not event_type in event_types:
            new_event_types.append(event_type)
    for event_type in event_types:
        if not event_type in r_event_types:
            new_event_type = None if len(new_event_types) == 0 else new_event_types.pop(0)
            for event in existing.filter(event_type=event_type):
                if not new_event_type:
                    event.delete()
                else:
                    event.event_type=new_event_type
                    update_event_type.append(event)
    Event.objects.bulk_update(update_event_type,["event_type"])
    r_names=request.data['names'] if request.data['names'] else [""] # Allows no strings to be defined
    update_name=[]
    new_names=[]
    for name in r_names:
        if not name in names:
            new_names.append(name)
    for name in names:
        if not name in r_names:
            new_name = None if len(new_names) == 0 else new_names.pop(0)
            for event in existing.filter(name=name):
                if not new_name:
                    event.delete()
                else:
                    event.event_name=new_name
                    update_name.append(event)
    Event.objects.bulk_update(update_name,["event_name"])
    new_events=[]
    if new_age_groups:
        for age_group in new_age_groups:
            for event_type in r_event_types:
                for name in r_names:
                    new_events.append(Event(
                        event_name=name,
                        age_group=age_group,
                        event_type=event_type,
                        competition_id=f_id,
                        complete=False
                    ))
    elif new_event_types:
        for age_group in r_age_groups:
            for event_type in new_event_types:
                for name in r_names:
                    new_events.append(Event(
                        event_name=name,
                        age_group=age_group,
                        event_type=event_type,
                        competition_id=f_id,
                        complete=False
                    ))
    elif new_names:
        for age_group in r_age_groups:
            for event_type in r_event_types:
                for name in new_names:
                    new_events.append(Event(
                        event_name=name,
                        age_group=age_group,
                        event_type=event_type,
                        competition_id=f_id,
                        complete=False
                    ))
    Event.objects.bulk_create(new_events)
    return Response("Bulk create successful", status=status.HTTP_201_CREATED)

@api_view(['POST'])
def bulk_create_teams(request, f_id):
    team_data_list = request.data["teams"]
    existing_teams = Team.objects.filter(competition=f_id)
    team_code = {}
    code_team = {}
    for team_data in team_data_list:
        print(team_data)
        if not team_data['name'] in team_code and not team_data['short_code'] in code_team: # only the first instance of team name or shortcode is stored
            team_code[team_data['name']]=team_data['short_code'] # This means that team_code and code_team should have matching but inverse results
            code_team[team_data['short_code']]=team_data['name']
    updated_teams = []
    for team in existing_teams:
        if not team.short_code in code_team and not team.name in team_code: # The team has been deleted | It is impossible to tell the difference between deleting a team and changing both its name and shortcode
            team.delete() # If you want to change both without deleting the team you have to do it in two steps | We might want to make a specific way to delete teams to avoid this
        elif not team.short_code in code_team and team.name in team_code: 
            team.short_code=team_code[team.name]
            updated_teams.append(team)
        elif team.short_code in code_team and not team.name in team_code:
            team.name=code_team[team.short_code]
            updated_teams.append(team)
        # else do nothing
    Team.objects.bulk_update(updated_teams, ["name","short_code"])
    existing_teams = Team.objects.filter(competition=f_id)
    new_teams = []
    for name, code in team_code.items():
        if not existing_teams.filter(name=name) and not existing_teams.filter(short_code=code): # Checking both separately might not be needed but it shouldn't matter
            new_teams.append(Team(
                name=name,
                short_code=code,
                competition_id=f_id
            ))
    Team.objects.bulk_create(new_teams)
    return Response("Bulk create successful", status=status.HTTP_201_CREATED)

'''
request.data["athletes"] is a list of entries containing athlete names and event ids in the following format:
{
    'name': ... ,
    'event_id': ...
}
when the list is recieved the following things need to happen:
 - for athletes not in any event:
    - Create new athlete with name and put them into their event(s)
 - for athletes in one event:
    - If their event is also not in the list they should be deleted
    - If their event is in the list with a different name
        - If the name matches another athlete, then update the result entry to match and delete this athlete
        - otherwise update this athlete to match the new name
 - for athletes in multiple events:
    - If all of their events are not in the list they should be deleted
    - If any of their events are in the list with (a) different name(s)
        - if all the names are the same and don't match an existing athlete, then update this athlete
        - otherwise for each event:
            - If the name matches another athlete, then update the result entry to match
            - otherwise create a new athlete and update the result entry to point to them
            - If at the end of this there are no remaining events matching this athlete then delete them
    - If any of their events are not in the list then those result entries should be deleted
'''


@api_view(['POST'])
def bulk_create_athletes(request, f_id):
    athletes_data_list = request.data["athletes"]
    athletes_in_team = Athlete.objects.filter(team_id=f_id)
    athlete_results = { # Make dictionary of athlete names to lists containing their result entries
        athlete.name:Result.objects.filter(athlete=athlete)
        for athlete in athletes_in_team
    }
    filled_events = {} # Make dictionary of events to athlete from this team doing that event
    for athlete in athletes_in_team:
        for result in athlete_results[athlete.name]:
            filled_events[result.event]=athlete
    new_results=[] # List containing results to be bulk created and added to database
    updated_results=[] # List containing existing results that have either had their athlete or event updated
    updated_athletes=[] # List containing existing athletes that have had their name updated
    for athlete_data in athletes_data_list:
        name=athlete_data['name']
        event=get_object_or_404(Event, pk=athlete_data['event_id']) # Finds the event matching the given event id
        if Athlete.objects.filter(team_id=f_id,name=name).first(): # If the athlete already exists
            if name in athlete_results and athlete_results[name].count() == 1: # If the athlete is in only one event
                result = athlete_results[name].first() # Get that event
                if result.event != event: # If the event has changed update the result
                    result.event = event
                    updated_results.append(event)
                    if event in filled_events: # If the event was filled by someone else first
                        prev_athlete = filled_events[event]
                        prev_result = athlete_results[prev_athlete.name].filter(event=event).first()
                        prev_result.delete() # Delete that result entry
                        if athlete_results[prev_athlete.name].count() == 1: # If that was the athlete's only event
                            prev_athlete.delete() # Delete that athlete as well
                # If the event has not changed then you don't need to do anything
            else: # The athlete is in more than one event
                events = athlete_results[name]
                athlete = get_object_or_404(Athlete, name=name, team_id=f_id)
                if not event in events: # The athlete is not already in the event
                    if event in filled_events: # Another athlete is already in the event
                        prev_athlete = filled_events[event]
                        prev_result = athlete_results[prev_athlete.name].filter(event=event).first()
                        prev_result.athlete=athlete # update the result to the new result
                        if athlete_results[prev_athlete.name].count() == 1: # If that was the athlete's only event
                            prev_athlete.delete() # Delete that athlete as well
                    else:
                        new_results.append(Result(
                            athlete=athlete,
                            event=event
                        ))
                # if the athlete is already in the event you don't need to do anything
        else: # The athlete doesn't currently exist
            if event in filled_events: # if there is already an athlete assigned to this event
                athlete = filled_events[event]
                if athlete_results[athlete.name].count() == 1: # this event is the only one assigned to this athlete
                    athlete.name=name # so update the athlete's name to match the new one
                    updated_athletes.append(athlete)
                else: # the athlete is in more than one event
                    result = athlete_results[athlete.name].filter(event=event).first() # So make a new athlete and assign it to the existing result
                    result.athlete=Athlete.objects.create(name=name,team_id=f_id)
                    updated_results.append(result)
            else: # the event is not filled yet
                new_results.append(Result( # so make a new result entry and new athlete
                    athlete = Athlete.objects.create(name=name,team_id=f_id),
                    event = event,
                ))
    Result.objects.bulk_create(new_results)
    Result.objects.bulk_update(updated_results,["athlete","event"])
    Athlete.objects.bulk_update(updated_athletes,["name"])
    # update variables with new values
    athletes_in_team = Athlete.objects.filter(team_id=f_id)
    athlete_results = { 
        athlete.name:Result.objects.filter(athlete=athlete)
        for athlete in athletes_in_team
    }
    athlete_names = []
    team_events=[]
    for athlete_data in athletes_data_list:
        athlete_names.append(athlete_data['name'])
        team_events.append(get_object_or_404(Event, pk=athlete_data['event_id']))
    for athlete in athletes_in_team:
        if not athlete.name in athlete_names:
            athlete.delete()
        else:
            for result in athlete_results[athlete.name]:
                if not result.event in team_events:
                    result.delete()
    return Response("Bulk create successful", status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_team_athlete_events(request, team_id):
    athletes = Athlete.objects.filter(team_id=team_id)
    results = [
        (athlete, Result.objects.filter(athlete=athlete))
        for athlete in athletes
    ]
    athlete_events = []
    for (athlete, events) in results:
        for event in events:
            athlete_events.append({
                'name':athlete.name,
                'event_id':event.event.pk,
            })
    serializer = AthleteEventSerializer(athlete_events, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def bulk_create_results(request, f_id):
    results_data_list = request.data["results"]
    results = Result.objects.filter(event=f_id)
    results_data = {}
    for result in results_data_list:
        results_data[get_object_or_404(Athlete, pk=result['athlete_id'])]=result['value']
    for result in results:
        result.value = results_data[result.athlete]
    Result.objects.bulk_update(results, ["value"])
    event = get_object_or_404(Event, pk=f_id)
    event.complete = True
    event.save()
    return Response("Bulk create successful", status=status.HTTP_201_CREATED)

@api_view(['POST'])
def mark_competition_complete(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    competition.date = date.today()
    competition.save()
    return Response("Competition marked as complete")

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

    def create(self, request, *args, **kwargs):
        existing_athlete = Athlete.objects.filter(name=request.data['name'], team=request.data['team']).first()
        if existing_athlete:
            return Response(AthleteSerializer(existing_athlete).data, status=status.HTTP_200_OK)
        else:
            return super().create(request, *args, **kwargs)
        

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

#current constants by can be confiugured
FIRST_PLACE_EDGE = 1
MAX_SCORE_WITHOUT_EDGE = 11

def calc_event_result(event):
    time_events = ["Hurdles", "100m", "200m", "400m", "800m", "1500m"]
    dist_events = ["Shot Put", "Discus", "Javelin", "High Jump", "Long Jump", "Triple Jump"]
    results = Result.objects.filter(event=event,value__isnull=False)
    if event.event_type in time_events: # Time based event order
        results = results.order_by('value')  # Ascending for time
    elif event.event_type in dist_events: # Distance based event order
        results = results.order_by('-value')  # Descending for distance
    else:
        raise ValidationError("Invalid Event Type:" + event.event_type)

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

@api_view(['GET'])
def get_event_results(request, event_id):
    event = get_object_or_404(Event, pk=event_id)
    results = Result.objects.filter(event=event)
    result_details = [
        {
            'value':result.value,
            'athlete_id':result.athlete.pk,
            'athlete':result.athlete.name,
            'team':result.athlete.team.short_code
        }
        for result in results
    ]
    serializer = ResultDetailSerializer(result_details, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_competition_teams(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    teams = Team.objects.filter(competition=competition)
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)

# given competition, return all athletes in competition
@api_view(['GET'])
def get_competition_athletes(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    teams = Team.objects.filter(competition=competition)
    all_athletes = []
    for team in teams:
        all_athletes += (Athlete.objects.filter(team=team))
    serializer = AthleteSerializer(all_athletes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_competition_events(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    events = Event.objects.filter(competition=competition)
    serializer = EventSerializer(events, many=True)
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
