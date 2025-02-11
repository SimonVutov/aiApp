import React, { useState, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchMetrics, setSearchMetrics] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (searchQuery) => {
            if (!searchQuery.trim()) {
                setResults([]);
                setSearchMetrics(null);
                return;
            }

            setIsSearching(true);
            const startTime = performance.now();

            try {
                const response = await axios.get(
                    'http://localhost:8000/api/search/',
                    { params: { q: searchQuery } }
                );
                const endTime = performance.now();
                const searchTime = (endTime - startTime).toFixed(0);

                setResults(response.data.results);
                setSearchMetrics({
                    count: response.data.results.length,
                    time: searchTime
                });
            } catch (error) {
                console.error(error);
                setResults([]);
                setSearchMetrics(null);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    const handleFileClick = async (filename) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/file/${filename}/`
            );
            setSelectedFile(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main>
            <div className="container">
                <h1>Search Your Documents</h1>
                <div className="search-container">
                    <div className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
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

                    {isSearching && (
                        <div className="search-loading">
                            Searching...
                        </div>
                    )}

                    <div className="results-container">
                        {results.map((result, index) => (
                            <article
                                key={index}
                                className="result-card"
                                onClick={() => handleFileClick(result.filename)}
                            >
                                <h4>{result.filename}</h4>
                                <p className="snippet">{result.content_snippet}</p>
                                <span className="distance">
                                    Relevance: {((1 - result.distance) * 100).toFixed(0)}%
                                </span>
                            </article>
                        ))}
                    </div>

                    {selectedFile && (
                        <div className="modal" onClick={() => setSelectedFile(null)}>
                            <div className="modal-content" onClick={e => e.stopPropagation()}>
                                <button
                                    className="close-button"
                                    onClick={() => setSelectedFile(null)}
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                                <h2>{selectedFile.filename}</h2>
                                <div className="file-details">
                                    <p><strong>Content:</strong></p>
                                    <pre>{selectedFile.content}</pre>
                                    {selectedFile.upload_date && (
                                        <p><strong>Upload Date:</strong> {selectedFile.upload_date}</p>
                                    )}
                                    {selectedFile.metadata && Object.keys(selectedFile.metadata).length > 0 && (
                                        <div>
                                            <p><strong>Metadata:</strong></p>
                                            <pre>{JSON.stringify(selectedFile.metadata, null, 2)}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default SearchPage;