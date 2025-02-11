import faiss
import numpy as np
from contextlib import contextmanager

# Set the correct embedding dimension for all-MiniLM-L6-v2
EMBEDDING_DIM = 384

# Initialize FAISS index with proper configuration
index = faiss.IndexFlatL2(EMBEDDING_DIM)
faiss.omp_set_num_threads(4)  # Limit the number of threads

# We'll keep a list of metadata for each vector
metadata_list = []

@contextmanager
def faiss_index_scope():
    """Context manager for safe FAISS index operations"""
    try:
        yield index
    finally:
        # Any cleanup if needed
        pass

def add_to_index(embedding, metadata):
    """Safely add data to the FAISS index"""
    with faiss_index_scope() as idx:
        idx.add(embedding.reshape(1, -1))
        metadata_list.append(metadata)