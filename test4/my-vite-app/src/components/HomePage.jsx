import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="hero">
                <h1>Intelligent Document Search<br />Powered by RAG</h1>
                <p>Connect your documents from multiple sources and search through them with AI-powered semantic understanding.</p>
                <div className="hero-buttons">
                    <Link to="/signup" className="button button-primary">
                        Get Started Free →
                    </Link>
                    <button className="button button-secondary">
                        Watch Demo ▶
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Connect, Index, and Search</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Multiple Sources</h3>
                        <p>Connect documents from Google Drive, S3, SharePoint, or upload directly from your computer.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Smart Search</h3>
                        <p>Use natural language to search through your documents with AI-powered understanding.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="icon">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Real-time Indexing</h3>
                        <p>Documents are automatically indexed and ready for search within seconds.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage; 