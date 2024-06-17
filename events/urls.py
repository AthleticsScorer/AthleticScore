from django.urls import path, include
from .utils import generate_urlpatterns

from .views import *

# Define viewsets
viewsets = {
    'teams': {
        'list': TeamListCreateAPIView,
        'detail': TeamDetailAPIView,
        'search': search_teams_by_name,
        'bulk_create': bulk_create_teams
    },
    'athletes': {
        'list': AthleteListCreateAPIView,
        'detail': AthleteDetailAPIView,
        'search': search_athletes_by_name,
        'bulk_create': bulk_create_athletes,
        'filter': AthleteFilterAPIView,
    },
    'competitions': {
        'list': CompetitionListCreateAPIView,
        'detail': CompetitionDetailAPIView,
        'search': search_competitions_by_name,
        'filter': CompetitionFilterAPIView,
    },
    'events': {
        'list': EventListCreateAPIView,
        'detail': EventDetailAPIView,
        'search': search_events_by_name,
        'bulk_create': bulk_create_events,
        'filter': EventFilterAPIView,
    },
    'results': {
        'list': ResultListCreateAPIView,
        'detail': ResultDetailAPIView,
        'bulk_create': bulk_create_results,
        'filter': ResultFilterAPIView,
    }
}

urlpatterns = []
for basename, viewset in viewsets.items():
    urlpatterns += generate_urlpatterns(viewset, basename)

urlpatterns += [
    path('events/<int:event_id>/ranked_athletes/', get_athletes_ranked_by_result, name='ranked-athletes'),
    path('events/<int:event_id>/all_results/', get_event_results, name='event-all-results'),
    path('teams/<int:team_id>/total_points/', get_teams_points, name='total-points'),
    path('teams/<int:team_id>/athlete_events/', get_team_athlete_events, name='team-athlete-events'),
    path('competitions/<int:competition_id>/all_athletes/', get_competition_athletes, name='comp-all-athletes'),
    path('competitions/<int:competition_id>/all_teams/', get_competition_teams, name='comp-all-teams'),
    path('competitions/<int:competition_id>/all_events/', get_competition_events, name='comp-all-events'),
    path('competitions/<int:competition_id>/complete/', mark_competition_complete, name='comp-mark-complete'),
    path('competitions/<int:competition_id>/best_performers/', get_best_performers, name='best-performer'),
    path('competitions/<int:competition_id>/winners/', get_winners, name='winners'),
    path('wipe/', wipe_events_data, name='wipe-events-data'),
]
