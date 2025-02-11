import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';

function DocumentsPage() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchMetrics, setSearchMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recentDocuments, setRecentDocuments] = useState([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

    useEffect(() => {
        fetchRecentDocuments();
    }, []);

    // Debounce search function
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query) {
                handleSearch();
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSearch = async () => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/search/`, {
                params: { q: query }
            });
            setSearchResults(response.data.results);
            setSearchMetrics({
                count: response.data.results.length,
                time: 100 // Mock time for now
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileClick = async (filename) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/file/${filename}/`
            );
            setSelectedFile(response.data);
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedFile(null);
    };

    const fetchRecentDocuments = async () => {
        setIsLoadingDocuments(true);
        try {
            const response = await axios.get('http://localhost:8000/api/documents/');
            setRecentDocuments(response.data);
        } catch (error) {
            console.error('Error fetching recent documents:', error);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="documents-page">
            {/* Search Section */}
            <section className="search-section">
                <h1>Search Your Documents</h1>
                <div className="search-container">
                    <div className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Start typing to search..."
                            className="search-input"
                            aria-label="Search query"
                        />
                    </div>

                    {searchMetrics && (
                        <div className="search-metrics">
                            Found {searchMetrics.count} {searchMetrics.count === 1 ? 'result' : 'results'} in {searchMetrics.time}ms
                        </div>
                    )}

                    <div className="search-results">
                        {isLoading ? (
                            <div className="loading">Searching...</div>
                        ) : (
                            searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="result-item"
                                    onClick={() => handleFileClick(result.filename)}
                                >
                                    <h3>{result.filename}</h3>
                                    <p>{result.content_snippet}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Connect Section */}
            <section className="connect-section">
                <h1>Connect Your Data</h1>
                <div className="connection-options">
                    <div className="card">
                        <h3>File Upload</h3>
                        <FileUpload onUploadComplete={() => {
                            console.log('Upload complete, refreshing documents...');
                            fetchRecentDocuments();
                        }} />
                    </div>

                    <div className="card">
                        <h3>Google Drive</h3>
                        <p>Connect your Google Drive account</p>
                        <button className="button button-secondary" disabled>
                            Coming Soon
                        </button>
                    </div>

                    <div className="card">
                        <h3>Database</h3>
                        <p>Connect your database</p>
                        <button className="button button-secondary" disabled>
                            Coming Soon
                        </button>
                    </div>
                </div>
            </section>

            {/* Recent Documents Section */}
            <section className="recent-documents">
                <div className="section-header">
                    <h2>Recent Documents</h2>
                    <div className="document-stats">
                        <span>{recentDocuments.length} documents</span>
                        <span>•</span>
                        <span>{formatFileSize(recentDocuments.reduce((acc, doc) => acc + doc.size, 0))}</span>
                    </div>
                </div>
                {isLoadingDocuments ? (
                    <div className="loading-documents">Loading recent documents...</div>
                ) : recentDocuments.length === 0 ? (
                    <div className="no-documents">
                        <p>No documents uploaded yet. Start by uploading your first document above!</p>
                    </div>
                ) : (
                    <div className="documents-grid">
                        {recentDocuments.map((doc, index) => (
                            <div key={index} className="document-card" onClick={() => handleFileClick(doc.name)}>
                                <div className="document-icon">
                                    {doc.file_type === 'pdf' ? '📄' :
                                        doc.file_type === 'doc' ? '📝' :
                                            doc.file_type === 'txt' ? '📃' : '📎'}
                                </div>
                                <div className="document-info">
                                    <h3>{doc.name}</h3>
                                    <p className="document-snippet">{doc.content?.substring(0, 100)}...</p>
                                    <div className="document-meta">
                                        <span className="document-type">{doc.file_type.toUpperCase()}</span>
                                        <span className="document-size">{formatFileSize(doc.size)}</span>
                                        <span className="document-date">{formatDate(doc.last_modified)}</span>
                                    </div>
                                    <div className="document-tags">
                                        <span className="tag source-tag">{doc.source}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* File View Modal */}
            {showModal && selectedFile && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h2>{selectedFile.filename}</h2>
                        <div className="file-details">
                            <pre>{selectedFile.content}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentsPage; 