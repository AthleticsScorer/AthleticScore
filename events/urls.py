from django.urls import path, include
from .utils import generate_urlpatterns

from .views import (
    TeamListCreateAPIView, TeamDetailAPIView,
    AthleteListCreateAPIView, AthleteDetailAPIView,
    CompetitionListCreateAPIView, CompetitionDetailAPIView,
    EventListCreateAPIView, EventDetailAPIView,
    ResultListCreateAPIView, ResultDetailAPIView,
    get_athletes_ranked_by_result, get_teams_points,
    get_competition_athletes, get_competition_teams, get_competition_events,
    get_event_results,
    search_athletes_by_name, search_teams_by_name,
    search_competitions_by_name, search_events_by_name,
    wipe_events_data, 
    bulk_create_events, bulk_create_teams,
    bulk_create_athletes, bulk_create_results,
    mark_competition_complete,
)

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
        'bulk_create': bulk_create_athletes
    },
    'competitions': {
        'list': CompetitionListCreateAPIView,
        'detail': CompetitionDetailAPIView,
        'search': search_competitions_by_name,
    },
    'events': {
        'list': EventListCreateAPIView,
        'detail': EventDetailAPIView,
        'search': search_events_by_name,
        'bulk_create': bulk_create_events
    },
    'results': {
        'list': ResultListCreateAPIView,
        'detail': ResultDetailAPIView,
        'bulk_create': bulk_create_results
    }
}

# Generate URL patterns for each viewset
urlpatterns = []
for basename, viewset in viewsets.items():
    urlpatterns += generate_urlpatterns(viewset, basename)

# Add additional custom URL patterns
urlpatterns += [
    path('events/<int:event_id>/ranked_athletes/', get_athletes_ranked_by_result, name='ranked-athletes'),
    path('teams/<int:team_id>/total_points/', get_teams_points, name='total-points'),
    path('competitions/<int:competition_id>/all_athletes/', get_competition_athletes, name='comp-all-athletes'),
    path('competitions/<int:competition_id>/all_teams/', get_competition_teams, name='comp-all-teams'),
    path('competitions/<int:competition_id>/all_events/', get_competition_events, name='comp-all-events'),
    path('competitions/<int:competition_id>/complete/', mark_competition_complete, name='comp-mark-complete')
    path('events/<int:event_id>/all_results/', get_event_results, name='event-all-results'),
    path('wipe/', wipe_events_data, name='wipe-events-data'),
]
