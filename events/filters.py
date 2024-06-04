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
