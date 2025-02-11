import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container">
            <section className="hero">
                <h1>Semantic Search for Your Data</h1>
                <p>Connect your data sources and search through them using natural language.</p>
                <div className="hero-buttons">
                    <Link to="/signup" className="button button-primary">Get Started</Link>
                    <Link to="/connect" className="button button-secondary">Learn More</Link>
                </div>
            </section>

            <section className="features">
                <h2>Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Natural Language Search</h3>
                        <p>Search your data using everyday language</p>
                    </div>
                    <div className="feature-card">
                        <h3>Multiple Data Sources</h3>
                        <p>Connect files, Google Drive, and databases</p>
                    </div>
                    <div className="feature-card">
                        <h3>Fast & Accurate</h3>
                        <p>Powered by advanced semantic search</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage; 