import os
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from sentence_transformers import SentenceTransformer
from .faiss_index import index, metadata_list, EMBEDDING_DIM
import atexit

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
        # Note: This example assumes the file is text. If it's not, you'll need additional logic.
        file_content = file_obj.read().decode('utf-8', errors='ignore')
        
        # Generate embedding of the file content
        embedding = model.encode([file_content])  # shape: (1, EMBEDDING_DIM)
        
        # Convert embedding to float32, as FAISS works with float32
        embedding = embedding.astype('float32')
        
        # Add to FAISS index
        index.add(embedding)
        
        # Keep track of metadata
        metadata_list.append({
            'filename': file_obj.name,
            'content': file_content
        })
        
        return Response({'message': 'File uploaded and indexed successfully'})


class SearchView(APIView):
    """
    Handles semantic search queries.
    """

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({'results': []})

        try:
            # Generate embedding for the query
            query_embedding = model.encode([query])[0].astype('float32')
            query_embedding = query_embedding.reshape(1, -1)

            # Search the index
            k = 5  # Number of results to return
            distances, indices = index.search(query_embedding, k)

            # Format results
            results = []
            for idx, distance in zip(indices[0], distances[0]):
                if idx < len(metadata_list):  # Check if the index is valid
                    metadata = metadata_list[idx]
                    results.append({
                        'filename': metadata['filename'],
                        'content_snippet': metadata['content'][:200] + '...',  # First 200 chars
                        'distance': float(distance)  # Convert numpy float to Python float
                    })

            return Response({'results': results})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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