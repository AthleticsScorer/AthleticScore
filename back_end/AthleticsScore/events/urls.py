# core/urls.py
from django.urls import path
from .views import (
    OrganisationListCreateAPIView, OrganisationDetailAPIView,
    AthleteListCreateAPIView, AthleteDetailAPIView,
    CompetitionListCreateAPIView, CompetitionDetailAPIView,
    EventListCreateAPIView, EventDetailAPIView,
    ResultListCreateAPIView, ResultDetailAPIView,
    get_athletes_ranked_by_result,
    search_athletes_by_name,
    search_competitions_by_name,
    search_organisations_by_name
)

urlpatterns = [
    path('organisations/', OrganisationListCreateAPIView.as_view(), name='organisation_list_create'),
    path('organisations/<int:pk>/', OrganisationDetailAPIView.as_view(), name='organisation_detail'),
    path('athletes/', AthleteListCreateAPIView.as_view(), name='athlete_list_create'),
    path('athletes/<int:pk>/', AthleteDetailAPIView.as_view(), name='athlete_detail'),
    path('competitions/', CompetitionListCreateAPIView.as_view(), name='competition_list_create'),
    path('competitions/<int:pk>/', CompetitionDetailAPIView.as_view(), name='competition_detail'),
    path('events/', EventListCreateAPIView.as_view(), name='event_list_create'),
    path('events/<int:pk>/', EventDetailAPIView.as_view(), name='event_detail'),
    path('results/', ResultListCreateAPIView.as_view(), name='result_list_create'),
    path('results/<int:pk>/', ResultDetailAPIView.as_view(), name='result_detail'),
    path('events/<int:event_id>/ranked_athletes/', get_athletes_ranked_by_result, name='ranked_athletes'),
    path('athletes/search/', search_athletes_by_name, name='search_athletes_by_name'),
    path('organisations/search/', search_athletes_by_name, name='search_athletes_by_name'),
    path('competitions/search/', search_athletes_by_name, name='search_athletes_by_name'),
]
