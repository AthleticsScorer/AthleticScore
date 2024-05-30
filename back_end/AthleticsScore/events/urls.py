from django.urls import path
from .views import EventListAPIView, EventDetailAPIView, ResultCreateAPIView, get_athletes_ranked_by_result

urlpatterns = [
    path('events/', EventListAPIView.as_view(), name='api_event_list'),
    path('events/<int:pk>/', EventDetailAPIView.as_view(), name='api_event_detail'),
    path('results/new/', ResultCreateAPIView.as_view(), name='api_result_create'),
    path('events/<int:event_id>/ranked_athletes/', get_athletes_ranked_by_result, name='api_ranked_athletes'),
]

