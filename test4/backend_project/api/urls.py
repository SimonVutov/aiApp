from django.urls import path
from .views import FileUploadView, SearchView

urlpatterns = [
    path('', FileUploadView.as_view(), name='upload'),  # Root API endpoint
    path('upload/', FileUploadView.as_view(), name='upload'),
    path('search/', SearchView.as_view(), name='search'),
]