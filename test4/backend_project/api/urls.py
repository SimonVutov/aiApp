from django.urls import path
from .views import FileUploadView, SearchView, FileDetailView, DocumentsView, AnalyticsView

urlpatterns = [
    path('', FileUploadView.as_view(), name='upload'),  # Root API endpoint
    path('upload/', FileUploadView.as_view(), name='upload'),
    path('search/', SearchView.as_view(), name='search'),
    path('file/<str:filename>/', FileDetailView.as_view(), name='file-detail'),
    path('documents/', DocumentsView.as_view(), name='documents'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
]