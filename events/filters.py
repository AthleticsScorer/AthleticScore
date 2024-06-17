from django_filters import rest_framework as filters
from .models import Result, Competition, Athlete, Event

class ResultFilter(filters.FilterSet):
    athlete_id = filters.NumberFilter(field_name="athlete__id")
    event_id = filters.NumberFilter(field_name="event__id")
    competition_id = filters.NumberFilter(field_name="competition__id")
    result_min = filters.NumberFilter(field_name="value", lookup_expr="gte")
    result_max = filters.NumberFilter(field_name="value", lookup_expr="lte")

    class Meta:
        model = Result
        fields = [
            'athlete_id', 'event_id', 'competition_id', 'result_min', 'result_max'
        ]

class CompetitionFilter(filters.FilterSet):
    competition_name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    competition_date = filters.DateFromToRangeFilter(field_name="date")

    class Meta:
        model = Competition
        fields = [
            'competition_name', 'competition_date'
        ]

class EventFilter(filters.FilterSet):
    event_age_category = filters.CharFilter(field_name="age_group", lookup_expr="icontains")
    event_type = filters.CharFilter(field_name="event_type", lookup_expr="icontains")
    event_name = filters.CharFilter(field_name="event_name", lookup_expr="icontains")
    competition_id = filters.NumberFilter(field_name="competition__id")

    class Meta:
        model = Event
        fields = [
            'event_age_category', 'event_type', 'event_name', 'competition_id'
        ]

class AthleteFilter(filters.FilterSet):
    athlete_name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    athlete_organisation = filters.CharFilter(field_name="team__name", lookup_expr="icontains")
    competition_id = filters.NumberFilter(field_name="team__competition__id")

    class Meta:
        model = Athlete
        fields = [
            'athlete_name', 'athlete_organisation', 'competition_id'
        ]