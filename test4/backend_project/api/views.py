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
from django.db.models import Sum

# Initialize the model once at module level
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')


class FileUploadView(APIView):
    """
    Handles file uploads. 
    For text-based files, we read the content, generate embeddings, and add them to FAISS.
    """

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Read file content as text
        file_content = file_obj.read().decode('utf-8', errors='ignore')
        
        # Generate embedding of the file content
        embedding = model.encode([file_content])
        embedding = embedding.astype('float32')
        
        # Add to FAISS index
        index.add(embedding)
        
        # Store file information in the database
        document = Document.objects.create(
            name=file_obj.name,
            content=file_content,
            file_type=file_obj.name.split('.')[-1] if '.' in file_obj.name else 'txt',
            source='upload',
            size=file_obj.size
        )
        
        # Keep track of metadata
        metadata_list.append({
            'filename': file_obj.name,
            'content': file_content,
            'document_id': document.id
        })
        
        return Response({'message': 'File uploaded and indexed successfully'})


class SearchView(APIView):
    """
    Handles semantic search queries.
    """

    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return Response({'results': []})

        # Generate embedding for the query
        query_embedding = model.encode([query])
        
        # Search in FAISS index
        D, I = index.search(query_embedding.astype('float32'), k=5)
        
        results = []
        for dist, idx in zip(D[0], I[0]):
            if idx < len(metadata_list):  # Ensure index is valid
                file_data = metadata_list[idx]
                
                # Convert distance to similarity score (percentage)
                # FAISS L2 distance: smaller is better, convert to percentage
                max_distance = 20  # Empirical maximum L2 distance for normalization
                similarity = max(0, min(100, (1 - dist/max_distance) * 100))
                
                # Get document from database if it exists
                doc = Document.objects.filter(name=file_data['filename']).first()
                
                # Format file size
                size = "Unknown"
                if doc and doc.size:
                    size = self.format_size(doc.size)
                
                # Get file format from extension
                file_format = file_data['filename'].split('.')[-1].upper() if '.' in file_data['filename'] else 'TXT'
                
                results.append({
                    'filename': file_data['filename'],
                    'content_snippet': file_data['content'][:200] + '...',
                    'match': round(similarity),
                    'distance': float(dist),
                    'format': file_format,
                    'size': size,
                    'dateAdded': doc.created_at.strftime('%Y-%m-%d') if doc else 'Unknown'
                })
        
        return Response({'results': results})

    def format_size(self, size_in_bytes):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_in_bytes < 1024:
                return f"{size_in_bytes:.1f} {unit}"
            size_in_bytes /= 1024
        return f"{size_in_bytes:.1f} TB"


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
        search = request.GET.get('search', '')
        sort_by = request.GET.get('sortBy', 'date')
        sort_order = request.GET.get('sortOrder', 'desc')
        
        queryset = Document.objects.all()
        
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        order_field = '-last_modified' if sort_order == 'desc' else 'last_modified'
        if sort_by == 'name':
            order_field = '-name' if sort_order == 'desc' else 'name'
        elif sort_by == 'type':
            order_field = '-file_type' if sort_order == 'desc' else 'file_type'
            
        documents = queryset.order_by(order_field)
        
        return Response([{
            'name': doc.name,
            'type': doc.file_type,
            'source': doc.source,
            'size': doc.size,
            'lastModified': doc.last_modified
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