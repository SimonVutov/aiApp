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
            <Link to="/" className="logo">DataSearch</Link>
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
      </div>
    </Router>
  );
}

export default App;