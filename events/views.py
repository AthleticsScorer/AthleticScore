# core/views.py
from rest_framework import generics
from .models import Team, Athlete, Competition, Event, Result
from .serializers import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.management import call_command
from rest_framework import status
from django.forms import ValidationError
from datetime import date
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ResultFilter, EventFilter, CompetitionFilter, AthleteFilter
from .best_performance import *

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

    def update(news:list, rs:list, es:list, field:str):
        update=[]
        for r in rs:
            if not r in es:
                news.append(r)
        for e in es:
            if not e in rs:
                new = None if len(news) == 0 else news.pop(0)
                for event in existing.filter(**{field:e}):
                    if new is None:
                        event.delete()
                    else:
                        setattr(event, field, new)
                        update.append(event)
        Event.objects.bulk_update(update,[field])
    
    r_age_groups=request.data['age_groups'] if request.data['age_groups'] else [""] # Allows no age groups to be defined
    new_age_groups=[] # If this isn't empty by the bulk_update of age groups it contains all of the new age groups to be created
    update(new_age_groups, r_age_groups, age_groups, "age_group")
    r_event_types=request.data['event_types']
    new_event_types=[]
    update(new_event_types, r_event_types, event_types, "event_type")
    r_names=request.data['names'] if request.data['names'] else [""] # Allows no strings to be defined
    new_names=[]
    update(new_names, r_names, names, "event_name")
    
    new_events=[]

    def create(age_groups :list, event_types:list, names:list):
        for age_group in age_groups:
            for event_type in event_types:
                for name in names:
                    new_events.append(Event(
                        event_name=name,
                        age_group=age_group,
                        event_type=event_type,
                        competition_id=f_id,
                        complete=False
                    ))

    if new_age_groups:
        create(new_age_groups,r_event_types,r_names)
    elif new_event_types:
        create(r_age_groups,new_event_types,r_names)
    elif new_names:
        create(r_age_groups,r_event_types,new_names)
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
    new_events={}
    athlete_events={}
    for athlete_data in athletes_data_list:
        name=athlete_data['name']
        event=get_object_or_404(Event, pk=athlete_data['event_id'])
        new_events[event] = name
        if name in athlete_events:
            athlete_events[name].append(event)
        else:
            athlete_events[name] = [event]
    existing_athletes={
        athlete.name:athlete
        for athlete in athletes_in_team
    }
    new_results=[] # List containing results to be bulk created and added to database
    updated_results=[] # List containing existing results that have either had their athlete or event updated
    updated_athletes=[] # List containing existing athletes that have had their name updated

    def replaceable_result(name: str):
        result = athlete_results[name].exclude(event__in=athlete_events[name] if name in athlete_events else []).first()
        if result:
            athlete_results[name]=athlete_results[name].exclude(pk=result.pk)
        return result
    def check_filled(event:Event, replace: bool):
        if event in filled_events: # If someone else was doing that event
            prev_athlete=filled_events[event]
            if replace:
                if prev_athlete.name in athlete_events: # If that person is still doing event(s)
                    athlete_results[prev_athlete.name].filter(event=event).first().delete() # Remove their result in the event they are no longer doing
                else: # If that person is no longer doing events then you can delete them
                    existing_athletes.pop(prev_athlete.name).delete()
            else:
                result = replaceable_result(prev_athlete.name)
                if result is None:
                    new_results.append(Result(
                        athlete=existing_athletes[name],
                        event=event
                    ))
                else:
                    result.athlete = existing_athletes[name]
                    updated_results.append(result)
        else:
            new_results.append(Result(
                athlete=existing_athletes[name],
                event=event
            ))

    for name,events in athlete_events.items():
        if name not in existing_athletes:
            prev_athlete = None
            for event in events:
                if event in filled_events:
                    prev_athlete=filled_events[event]
                    break
            if prev_athlete:
                replace = True
                for result in athlete_results[prev_athlete.name]:
                    if result.event not in events:
                        replace = False
                        break
                if replace:
                    athlete_results[name]=athlete_results.pop(prev_athlete.name)
                    existing_athletes[name]=existing_athletes.pop(prev_athlete.name)
                    prev_athlete.name=name
                    updated_athletes.append(prev_athlete)

    for event,name in new_events.items():
        if name in existing_athletes: # Athlete already exists
            if name in athlete_results: # Athlete existed before this query
                if event in [result.event for result in athlete_results[name]]:
                    pass
                else:
                    result = replaceable_result(name)
                    if result is None:
                        check_filled(event, False)
                    else:
                        check_filled(event, True)
                        result.event = event
                        updated_results.append(result)
            else: # Athlete didn't exist before this query
                check_filled(event, False)
        else:
            existing_athletes[name]=Athlete.objects.create(
                name=name,
                team_id=f_id
            )
            check_filled(event, False)

    Result.objects.bulk_create(new_results)
    Result.objects.bulk_update(updated_results,["athlete","event"])
    Athlete.objects.bulk_update(updated_athletes,["name"])
    # update variables with new values
    athletes_in_team = Athlete.objects.filter(team_id=f_id)
    print(athletes_in_team)
    athlete_results = {
        athlete.name:Result.objects.filter(athlete=athlete)
        for athlete in athletes_in_team
    }
    athlete_names = athlete_events.keys()
    print(athlete_names)
    team_events=new_events.keys()
    for athlete in athletes_in_team:
        if athlete.name not in athlete_names:
            athlete.delete()
        else:
            for result in athlete_results[athlete.name]:
                if result.event not in team_events:
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

@api_view(['GET'])
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

class AthleteFilterAPIView(generics.ListAPIView):
    queryset = Athlete.objects.all()
    serializer_class = AthleteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = AthleteFilter

# Competition Views
class CompetitionListCreateAPIView(BaseListCreateAPIView):
    serializer_class = CompetitionSerializer

class CompetitionDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = CompetitionSerializer

class CompetitionFilterAPIView(generics.ListAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = CompetitionFilter

# Event Views
class EventListCreateAPIView(BaseListCreateAPIView):
    serializer_class = EventSerializer

class EventDetailAPIView(BaseRetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer

class EventFilterAPIView(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter

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

time_events = ["Hurdles", "100m", "200m", "400m", "800m", "1500m", "2k Steeplechase"]
dist_events = ["Shot Put", "Discus", "Javelin", "High Jump", "Long Jump", "Triple Jump"]
    
def calc_event_result(event):
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
            'athlete': result.athlete,
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
        result['athlete_name'] = result['athlete'].pop().name
    return Response(ranked_results)

@api_view(['GET'])
def get_teams_points(request, competition_id):
    event_results:dict[Event,list]={}
    for result in Result.objects.filter(value__isnull=False):
        if result.event.competition_id == competition_id:
            if result.event in event_results:
                event_results[result.event].append(result)
            else:
                event_results[result.event]=[result]

    team_points = {}
    for event,results in event_results.items():
        if event.event_type in time_events: # Time based event order
            results.sort(key=lambda a: a.value)
        elif event.event_type in dist_events: # Distance based event order
            results.sort(key=lambda a: a.value,reverse=True)
        for rank, result in enumerate(results, start=1):
            points = 0
            dist_from_first = rank - 1
            if rank == 1:
                points = MAX_SCORE_WITHOUT_EDGE + FIRST_PLACE_EDGE
            else:
                points = MAX_SCORE_WITHOUT_EDGE - dist_from_first
            team_points[result.athlete.team] = points + team_points[result.athlete.team] if result.athlete.team in team_points else points
    serializer=TeamPointsSerializer([{
        'team':team.name,
        'points':points
    } for team,points in team_points.items()],many=True)
    return Response(serializer.data)

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
        for athlete in Athlete.objects.filter(team=team):
            all_athletes.append({
                "name":athlete.name,
                "id":athlete.id,
                "team":athlete.team.name
            })
    serializer = AthleteTeamSerializer(all_athletes, many=True)
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
@api_view(['POST'])
def wipe_events_data(request):
    try:
        call_command('wipe_events')
        return Response({"message": "All entries in all tables in the events app have been wiped."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     for result in event_results:
    #         age_group = event.age_group
    #         if age_group not in best_performers:
    #             best_performers[age_group] = {
    #                 'athlete': None,
    #                 'best_performance': {
    #                     'performance': float('inf'),
    #                     'event':event.event_type,
    #                     'string':event.event_name,
    #                     'result':0
    #                 }
    #             }
            
    #         event_stats = event_statistics.get(event.event_type, None)

    #         if event_stats:
    #             performance_value = event_stats.calculate_performance(float(result.value))
    #             if performance_value < best_performers[age_group]['best_performance']['performance']:
    #                 best_performers[age_group]['best_performance']['performance'] = performance_value
    #                 best_performers[age_group]['best_performance']['event'] = event.event_type
    #                 best_performers[age_group]['best_performance']['string'] = event.event_name
    #                 best_performers[age_group]['best_performance']['result'] = result.value
    #                 best_performers[age_group]['athlete'] = result.athlete
                    
    # serializer = BestPerformerSerializer([{
    #     'athlete':best_performers[age_group]['athlete'].name,
    #     'team':best_performers[age_group]['athlete'].team.short_code,
    #     'performance':best_performers[age_group]['best_performance']['performance'],
    #     'age_group':age_group,
    #     'event':best_performers[age_group]['best_performance']['event'],
    #     'string':best_performers[age_group]['best_performance']['string'],
    #     'result':best_performers[age_group]['best_performance']['result'],
    # }
    # for age_group in best_performers.keys()], many=True)

@api_view(['GET'])
def get_best_performers(request, competition_id):
    competition = get_object_or_404(Competition, pk=competition_id)
    events = Event.objects.filter(competition=competition, complete=True)
    
    best_performers = {}

    for event in events:
        event_results = Result.objects.filter(event=event, value__isnull=False)
        event_stats = event_statistics.get(event.event_type, None)
        if event_stats and event_results:
            for result in event_results:
                performance_value = event_stats.calculate_performance(float(result.value))
                if event not in best_performers or performance_value < best_performers[event]['performance']:
                    best_performers[event]={
                        'athlete':result.athlete.name,
                        'team':result.athlete.team.short_code,
                        'performance':performance_value,
                        'age_group':event.age_group,
                        'event':event.event_type,
                        'string':event.event_name,
                        'result':result.value,
                    }
    
    serializer = BestPerformerSerializer(best_performers.values(),many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_winners(request, competition_id):
    winners=[]
    for event in Event.objects.filter(competition_id=competition_id, complete=True):
        results = Result.objects.filter(event=event,value__isnull=False)
        if results.count() > 0:
            if event.event_type in time_events: # Time based event order
                results = results.order_by('value')  # Ascending for time
            elif event.event_type in dist_events: # Distance based event order
                results = results.order_by('-value')  # Descending for distance
            else:
                raise ValidationError("Invalid Event Type:" + event.event_type)
            winners.append({
                'string':event.event_name,
                'age_group':event.age_group,
                'event_type':event.event_type,
                'athlete':results.first().athlete.name,
                'team':results.first().athlete.team.short_code,
            })
    serializer = WinnerSerializer(winners, many=True)
    return Response(serializer.data)