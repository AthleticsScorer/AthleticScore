from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response

def create_search_view(model, name_field='name'):
    @api_view(['GET'])
    def search_view(request):
        query = request.query_params.get('name', None)
        if query is not None:
            filter_kwargs = {f'{name_field}__icontains': query}
            instances = model.objects.filter(**filter_kwargs)
            results = [{'id': instance.id, 'name': getattr(instance, name_field)} for instance in instances]
            return Response(results)
        else:
            return Response({"error": "Name parameter is required"}, status=400)
    return search_view

def generate_urlpatterns(viewset, basename):
    list_view = viewset['list']
    detail_view = viewset['detail']
    search_view = viewset.get('search')
    
    urlpatterns = [
        path(f'{basename}/', list_view.as_view()),
        path(f'{basename}/<int:pk>/', detail_view.as_view()),
    ]
    
    if search_view:
        urlpatterns.append(
            path(f'{basename}/search/', search_view)
        )
    
    return urlpatterns


