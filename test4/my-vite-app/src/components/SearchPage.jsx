import React, { useState } from 'react';
import axios from 'axios';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        try {
            const response = await axios.get(
                'http://localhost:8000/api/search/',
                { params: { q: query } }
            );
            setResults(response.data.results);
        } catch (error) {
            console.error(error);
            setResults([]);
        }
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
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your search query..."
                            className="search-input"
                            aria-label="Search query"
                        />
                        <button type="submit" className="button button-primary">
                            Search
                        </button>
                    </form>

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