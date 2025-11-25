import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MapView from './components/MapView';
import PropertyList from './components/PropertyList';
import Dashboard from './components/Dashboard';
import SubmitProperty from './components/SubmitProperty';
import PropertyDetail from './components/PropertyDetail';
import EditProperty from './components/EditProperty';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHlsZXJ3YXluZTEiLCJhIjoiY21oNzlqb2xwMHBybjJscHR5ZXVqcHZ2aCJ9.jHao1snG3bwXFRVWcA8tuQ';

const navStyle = {
  background: '#000',
  padding: '20px 48px',
  display: 'flex',
  gap: '32px',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  position: 'sticky',
  top: 0,
  zIndex: 1000
};

const titleStyle = {
  margin: 0,
  color: '#fff',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.5px',
  marginRight: 'auto'
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'opacity 0.2s ease'
};

const containerStyle = {
  margin: 0,
  padding: 0,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  minHeight: '100vh',
  background: '#f5f7fa'
};

const contentStyle = {
  padding: '0',
  maxWidth: '100%',
  margin: '0'
};

const placeholderStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '48px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  fontSize: '18px',
  color: '#333',
  fontWeight: '500'
};

export default function App() {
  return (
    <Router>
      <div style={containerStyle}>
        <nav style={navStyle}>
          <h1 style={titleStyle}>Apartment Blocks</h1>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/properties" style={linkStyle}>Properties</Link>
          <Link to="/map" style={linkStyle}>Map</Link>
          <Link to="/submit" style={linkStyle}>Submit Property</Link>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        </nav>
        <div style={contentStyle}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/properties" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/map" element={<MapView />} />
            <Route path="/submit" element={<SubmitProperty />} />
            <Route path="/search" element={<div style={placeholderStyle}>Search Results Placeholder</div>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
