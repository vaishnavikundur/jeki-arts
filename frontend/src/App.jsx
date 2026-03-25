import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Commission from './pages/Commission';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commission" element={<Commission />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/admin-login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
