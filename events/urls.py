from django.urls import path, include
from .utils import generate_urlpatterns

from .views import (
    TeamListCreateAPIView, TeamDetailAPIView,
    AthleteListCreateAPIView, AthleteDetailAPIView,
    CompetitionListCreateAPIView, CompetitionDetailAPIView,
    EventListCreateAPIView, EventDetailAPIView,
    ResultListCreateAPIView, ResultDetailAPIView,
    get_athletes_ranked_by_result,
    search_athletes_by_name, search_teams_by_name,
    search_competitions_by_name, search_events_by_name
)

# Define viewsets
viewsets = {
    'teams': {
        'list': TeamListCreateAPIView,
        'detail': TeamDetailAPIView,
        'search': search_teams_by_name,
    },
    'athletes': {
        'list': AthleteListCreateAPIView,
        'detail': AthleteDetailAPIView,
        'search': search_athletes_by_name,
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
    },
    'results': {
        'list': ResultListCreateAPIView,
        'detail': ResultDetailAPIView,
    },
}

# Generate URL patterns for each viewset
urlpatterns = []
for basename, viewset in viewsets.items():
    urlpatterns += generate_urlpatterns(viewset, basename)

# Add additional custom URL patterns
urlpatterns += [
    path('events/<int:event_id>/ranked_athletes/', get_athletes_ranked_by_result, name='ranked_athletes'),
]
