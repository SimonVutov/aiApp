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
                                    <div className="result-header">
                                        <h3>{result.filename}</h3>
                                        <span className="match-percentage">
                                            {result.match}% Match
                                        </span>
                                    </div>
                                    <p>{result.content_snippet}</p>
                                    <div className="result-metadata">
                                        <span>{result.format}</span>
                                        <span>•</span>
                                        <span>{result.size}</span>
                                        <span>•</span>
                                        <span>Added: {result.dateAdded}</span>
                                    </div>
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
                        <FileUpload />
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