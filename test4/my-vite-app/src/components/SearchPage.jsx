import React, { useState } from 'react';
import axios from 'axios';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/search/',
                { params: { q: query } }
            );
            setResults(response.data.results);
        } catch (error) {
            console.error(error);
            setResults([]);
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
                        <div key={index} className="card result-card">
                            <h4>{result.filename}</h4>
                            <p className="snippet">{result.content_snippet}</p>
                            <span className="distance">Relevance: {(1 - result.distance).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;