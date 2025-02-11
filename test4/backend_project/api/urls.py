from django.urls import path
from .views import FileUploadView, SearchView, FileDetailView

urlpatterns = [
    path('', FileUploadView.as_view(), name='upload'),  # Root API endpoint
    path('upload/', FileUploadView.as_view(), name='upload'),
    path('search/', SearchView.as_view(), name='search'),
    path('file/<str:filename>/', FileDetailView.as_view(), name='file-detail'),
]