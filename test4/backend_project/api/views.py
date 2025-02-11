import os
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from sentence_transformers import SentenceTransformer
from .faiss_index import index, metadata_list, EMBEDDING_DIM
import atexit
from urllib.parse import unquote
from .models import Document, Analytics
from django.db.models import Sum, Q
from django.utils import timezone
from django.db.models.functions import Length

# Initialize the model once at module level
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


class FileUploadView(APIView):
    """
    Handles file uploads. 
    For text-based files, we read the content, generate embeddings, and add them to FAISS.
    """

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)

        # Get file information
        file_name = file.name
        file_size = file.size
        file_type = os.path.splitext(file_name)[1][1:].lower()
        
        # Create document record
        document = Document.objects.create(
            name=file_name,
            content=file.read().decode('utf-8', errors='ignore'),  # Basic content extraction
            file_type=file_type,
            size=file_size,
            source='upload',
            last_modified=timezone.now()
        )

        return Response({
            'message': 'File uploaded successfully',
            'document': {
                'name': document.name,
                'size': document.size,
                'type': document.file_type,
                'last_modified': document.last_modified
            }
        })


class SearchView(APIView):
    """
    Handles semantic search queries.
    """

    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({'results': []})

        # Get exact matches first
        exact_matches = Document.objects.filter(
            Q(content__icontains=query) | Q(name__icontains=query)
        ).order_by('-last_modified')

        # If we have less than 3 results, get additional fuzzy matches
        if exact_matches.count() < 3:
            # Get words from the query
            query_words = query.lower().split()
            
            # Create a Q object for fuzzy matching
            fuzzy_q = Q()
            for word in query_words:
                fuzzy_q |= Q(content__icontains=word) | Q(name__icontains=word)
            
            # Get additional documents, excluding exact matches
            additional_matches = Document.objects.exclude(
                id__in=exact_matches.values_list('id', flat=True)
            ).filter(fuzzy_q).order_by('-last_modified')

            # Combine results
            results = list(exact_matches) + list(additional_matches)
            
            # If still less than 3, add most recent documents
            if len(results) < 3:
                recent_docs = Document.objects.exclude(
                    id__in=[doc.id for doc in results]
                ).order_by('-last_modified')[:3-len(results)]
                results.extend(recent_docs)
        else:
            results = exact_matches

        # Format response
        return Response({
            'results': [{
                'filename': doc.name,
                'content_snippet': doc.content[:200] + '...' if doc.content else '',
                'file_type': doc.file_type,
                'size': doc.size,
                'last_modified': doc.last_modified,
                'match_type': 'exact' if doc in exact_matches else 'similar' if doc not in exact_matches[:3] else 'recent'
            } for doc in results[:10]]  # Limit to 10 total results
        })


class FileDetailView(APIView):
    def get(self, request, filename):
        # Decode the URL-encoded filename
        decoded_filename = unquote(filename)
        
        # Find the file in metadata_list
        file_data = None
        for item in metadata_list:
            if item['filename'] == decoded_filename:
                file_data = item
                break
        
        if file_data:
            return Response({
                'filename': file_data['filename'],
                'content': file_data['content'],
                'upload_date': file_data.get('upload_date', ''),
                'metadata': file_data.get('metadata', {})
            })
            
        # If file not found, return detailed error
        return Response(
            {
                'error': 'File not found',
                'filename_requested': decoded_filename,
                'available_files': [item['filename'] for item in metadata_list]
            },
            status=status.HTTP_404_NOT_FOUND
        )


class DocumentsView(APIView):
    def get(self, request):
        documents = Document.objects.all().order_by('-last_modified')[:10]  # Get 10 most recent
        return Response([{
            'name': doc.name,
            'content': doc.content[:200] if doc.content else '',  # First 200 chars as snippet
            'file_type': doc.file_type,
            'size': doc.size,
            'source': doc.source,
            'last_modified': doc.last_modified
        } for doc in documents])


class AnalyticsView(APIView):
    def get(self, request):
        analytics = Analytics.objects.first()
        if not analytics:
            analytics = Analytics.objects.create()
            
        total_storage = Document.objects.aggregate(Sum('size'))['size__sum'] or 0
        
        return Response({
            'totalDocuments': Document.objects.count(),
            'storageUsed': self.format_size(total_storage),
            'recentSearches': analytics.recent_searches,
            'activeUsers': analytics.active_users
        })
        
    def format_size(self, size):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size:.2f} TB"

# Cleanup function
def cleanup():
    try:
        # Clean up FAISS resources
        if hasattr(index, 'reset'):
            index.reset()
        # Clean up sentence-transformers resources
        if hasattr(model, 'close'):
            model.close()
    except Exception as e:
        print(f"Error during cleanup: {e}")

# Register cleanup function to run at exit
atexit.register(cleanup)