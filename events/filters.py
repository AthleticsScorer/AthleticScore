from django_filters import rest_framework as filters
from .models import Result

class ResultFilter(filters.FilterSet):
    athlete_name = filters.CharFilter(field_name="athlete__name", lookup_expr="icontains")
    athlete_organisation = filters.CharFilter(field_name="athlete__team__name", lookup_expr="icontains")
    event_age_category = filters.CharFilter(field_name="event__age_group", lookup_expr="icontains")
    event_type = filters.CharFilter(field_name="event__event_type", lookup_expr="icontains")
    event_name = filters.CharFilter(field_name="event__event_name", lookup_expr="icontains")
    competition_name = filters.CharFilter(field_name="event__competition__name", lookup_expr="icontains")
    competition_date = filters.DateFromToRangeFilter(field_name="event__competition__date")
    result_min = filters.NumberFilter(field_name="value", lookup_expr="gte")
    result_max = filters.NumberFilter(field_name="value", lookup_expr="lte")

    class Meta:
        model = Result
        fields = [
            'athlete_name', 'athlete_organisation', 'event_age_category', 'event_type', 
            'event_name', 'competition_name', 'competition_date', 'result_min', 'result_max'
        ]

class CompetitionFilter(filters.FilterSet):
    competition_name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    competition_date = filters.DateFromToRangeFilter(field_name="date")

    class Meta:
        model = Competition'athlete_name', 'athlete_organisation'
        fields = [
            'competition_name', 'competition_date'
        ]

class EventFilter(filters.FilterSet):
    event_age_category = filters.CharFilter(field_name="age_group", lookup_expr="icontains")
    event_type = filters.CharFilter(field_name="event_type", lookup_expr="icontains")
    event_name = filters.CharFilter(field_name="event_name", lookup_expr="icontains")
    competition_name = filters.CharFilter(field_name="competition__name", lookup_expr="icontains")
    competition_date = filters.DateFromToRangeFilter(field_name="competition__date")

    class Meta:
        model = Event
        fields = [
            'event_age_category', 'event_type', 'event_name', 'competition_name', 'competition_date'
        ]

class AthleteFilter(filters.FilterSet):
    athlete_name = filters.CharFilter(field_name="name", lookup_expr="icontains")
    athlete_organisation = filters.CharFilter(field_name="team__name", lookup_expr="icontains")
    competition_name = filters.CharFilter(field_name="team__competition__name", lookup_expr="icontains")
    competition_date = filters.DateFromToRangeFilter(field_name="team__competition__date")

    class Meta:
        model = Athlete
        fields = [
            'athlete_name', 'athlete_organisation', 'competition_name', 'competition_date'
        ]