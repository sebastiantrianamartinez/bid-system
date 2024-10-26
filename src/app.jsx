import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/common/header';

import Dashboard from './features/dashboard';
import Home from './features/home';
import LivePreview from './features/livePreview';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/live-preview" element={<LivePreview />} />
            </Routes>
        </Router>
    );
}

export default App;