import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ConnectPage from './components/ConnectPage';
import SearchPage from './components/SearchPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <nav className="navbar">
          <div className="navbar-content">
            <Link to="/" className="logo">Enterprise RAG Search</Link>
            <div className="nav-links">
              <Link to="/connect">Connect</Link>
              <Link to="/search">Search</Link>
              <Link to="/signin" className="button button-secondary">Sign In</Link>
              <Link to="/signup" className="button button-primary">Sign Up</Link>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <span>Enterprise RAG Search</span>
              </div>
              <p className="footer-description">
                Intelligent document search for modern enterprises
              </p>
            </div>

            <div className="footer-column">
              <h3>Product</h3>
              <ul className="footer-links">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/security">Security</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <ul className="footer-links">
                <li><Link to="/documentation">Documentation</Link></li>
                <li><Link to="/api">API Reference</Link></li>
                <li><Link to="/blog">Blog</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul className="footer-links">
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;