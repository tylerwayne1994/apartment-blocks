import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { isAdmin } from '../utils/authHelpers';

const containerStyle = {
  padding: '40px',
  maxWidth: '1400px',
  margin: '0 auto',
  background: '#f5f7fa',
  minHeight: 'calc(100vh - 60px)'
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 32px',
  color: '#000'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '24px'
};

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
};

const imageStyle = {
  width: '100%',
  height: '220px',
  background: '#e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  color: '#999'
};

const contentStyle = {
  padding: '20px'
};

const addressStyle = {
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 12px',
  color: '#000'
};

const metaStyle = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 6px'
};

const priceStyle = {
  fontSize: '22px',
  fontWeight: '800',
  color: '#000',
  margin: '12px 0 0'
};

const statusBadgeStyle = (status) => ({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '8px',
  background: status === 'active' ? '#e8f5e9' : 
              status === 'sold' ? '#ffebee' : 
              status === 'pending' ? '#fff3e0' : 
              status === 'contingent' ? '#e3f2fd' : '#f5f5f5',
  color: status === 'active' ? '#2e7d32' : 
         status === 'sold' ? '#c62828' : 
         status === 'pending' ? '#ef6c00' : 
         status === 'contingent' ? '#1565c0' : '#757575'
});

export default function PropertyList() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    loadProperties();
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    console.log('🚀 PropertyList: Starting admin check...');
    const adminStatus = await isAdmin();
    console.log('🚀 PropertyList: Admin status result:', adminStatus);
    setUserIsAdmin(adminStatus);
  };

  const loadProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    setProperties(data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h1 style={titleStyle}>All Properties</h1>
        <p>Loading properties...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>All Properties</h1>
      {properties.length === 0 ? (
        <p>No properties available yet.</p>
      ) : (
        <div style={gridStyle}>
          {properties.map(property => (
            <div
              key={property.id}
              style={cardStyle}
              onClick={() => navigate(`/property/${property.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {property.cover_image ? (
                <img src={property.cover_image} alt={property.title} style={{...imageStyle, objectFit: 'cover'}} />
              ) : (
                <div style={imageStyle}>No Image</div>
              )}
              <div style={contentStyle}>
                <h3 style={addressStyle}>{property.title || property.address}</h3>
                <p style={metaStyle}>{property.units} Units • {property.city}, {property.state}</p>
                {property.monthly_rent && property.price && (
                  <p style={metaStyle}>Cap Rate: {((property.monthly_rent * 12 / property.price) * 100).toFixed(1)}%</p>
                )}
                <p style={priceStyle}>${property.price?.toLocaleString()}</p>
                {userIsAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-property/${property.id}`);
                    }}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Edit Property (Admin)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
