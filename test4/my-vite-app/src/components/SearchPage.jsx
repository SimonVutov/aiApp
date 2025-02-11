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
        <div className="container">
            <h1>Search Your Data</h1>
            <div className="search-container">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your search query..."
                        className="input search-input"
                    />
                    <button type="submit" className="button button-primary">
                        Search
                    </button>
                </form>

                <div className="results-container">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className="card result-card"
                            onClick={() => handleFileClick(result.filename)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h4>{result.filename}</h4>
                            <p className="snippet">{result.content_snippet}</p>
                            <span className="distance">Relevance: {(1 - result.distance).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {selectedFile && (
                    <div className="modal">
                        <div className="modal-content">
                            <span
                                className="close-button"
                                onClick={() => setSelectedFile(null)}
                            >
                                &times;
                            </span>
                            <h2>{selectedFile.filename}</h2>
                            <div className="file-details">
                                <p><strong>Full Content:</strong></p>
                                <pre>{selectedFile.content}</pre>
                                <p><strong>Upload Date:</strong> {selectedFile.upload_date}</p>
                                {selectedFile.metadata && (
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
    );
}

export default SearchPage;