import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { supabase } from '../supabaseClient';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHlsZXJ3YXluZTEiLCJhIjoiY21oNzlqb2xwMHBybjJscHR5ZXVqcHZ2aCJ9.jHao1snG3bwXFRVWcA8tuQ';
mapboxgl.accessToken = MAPBOX_TOKEN;

const containerStyle = {
  display: 'flex',
  height: 'calc(100vh - 60px)',
  width: '100%',
  position: 'relative'
};

const mapContainerStyle = {
  flex: '1',
  height: '100%',
  position: 'relative'
};

const sidebarStyle = {
  width: '400px',
  height: '100%',
  background: '#fff',
  borderLeft: '1px solid #ddd',
  overflowY: 'auto',
  padding: '0'
};

const propertyCardStyle = {
  padding: '16px',
  borderBottom: '1px solid #eee',
  cursor: 'pointer',
  transition: 'background 0.2s ease'
};

const propertyImageStyle = {
  width: '100%',
  height: '180px',
  background: '#e0e0e0',
  borderRadius: '8px',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  color: '#999'
};

const propertyTitleStyle = {
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 8px',
  color: '#000'
};

const propertyMetaStyle = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 4px'
};

const propertyPriceStyle = {
  fontSize: '18px',
  fontWeight: '800',
  color: '#000',
  margin: '8px 0 0'
};

const statusBadgeStyle = (status) => ({
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: '16px',
  fontSize: '10px',
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

export default function MapView() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Filter states
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [capRateMin, setCapRateMin] = useState('');
  const [capRateMax, setCapRateMax] = useState('');
  const [unitsMin, setUnitsMin] = useState('');
  const [unitsMax, setUnitsMax] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-84.388, 33.749],
      zoom: 6
    });
  }, []);

  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each property
    properties.forEach(property => {
      // Skip if no coordinates
      if (!property.lng || !property.lat) return;

      const el = document.createElement('div');
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.borderRadius = '50% 50% 50% 0';
      el.style.backgroundColor = '#2196f3';
      el.style.border = '2px solid #fff';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      el.style.transform = 'rotate(180deg)';
      el.style.position = 'relative';

      // Add inner dot
      const innerDot = document.createElement('div');
      innerDot.style.width = '8px';
      innerDot.style.height = '8px';
      innerDot.style.borderRadius = '50%';
      innerDot.style.backgroundColor = '#fff';
      innerDot.style.position = 'absolute';
      innerDot.style.top = '50%';
      innerDot.style.left = '50%';
      innerDot.style.transform = 'translate(-50%, -50%)';
      el.appendChild(innerDot);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([property.lng, property.lat])
        .addTo(map.current);

      const popupHTML = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 700;">${property.title || property.address}</h3>
          <p style="margin: 0 0 4px; font-size: 14px; color: #666;">${property.units} Units</p>
          <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700;">$${property.price?.toLocaleString()}</p>
          <button 
            onclick="window.location.href='/property/${property.id}'" 
            style="width: 100%; padding: 8px; background: #000; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;"
          >
            View Property
          </button>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(popupHTML);

      marker.setPopup(popup);
      markers.current.push(marker);
    });
  }, [properties]);

  const loadProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    setAllProperties(data || []);
    setProperties(data || []);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allProperties];
    console.log('All properties:', allProperties);
    console.log('Filters:', { cityFilter, stateFilter, priceMin, priceMax, capRateMin, capRateMax, unitsMin, unitsMax });

    if (cityFilter) {
      filtered = filtered.filter(p => 
        p.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
      console.log('After city filter:', filtered.length);
    }

    if (stateFilter) {
      filtered = filtered.filter(p => 
        p.state?.toLowerCase().includes(stateFilter.toLowerCase())
      );
      console.log('After state filter:', filtered.length);
    }

    if (priceMin) {
      filtered = filtered.filter(p => p.price >= parseFloat(priceMin));
      console.log('After priceMin filter:', filtered.length);
    }

    if (priceMax) {
      filtered = filtered.filter(p => p.price <= parseFloat(priceMax));
      console.log('After priceMax filter:', filtered.length);
    }

    if (capRateMin || capRateMax) {
      filtered = filtered.filter(p => {
        if (!p.monthly_rent || !p.price) return false;
        const capRate = (p.monthly_rent * 12 / p.price) * 100;
        if (capRateMin && capRate < parseFloat(capRateMin)) return false;
        if (capRateMax && capRate > parseFloat(capRateMax)) return false;
        return true;
      });
      console.log('After cap rate filter:', filtered.length);
    }

    if (unitsMin) {
      filtered = filtered.filter(p => p.units >= parseInt(unitsMin));
      console.log('After unitsMin filter:', filtered.length);
    }

    if (unitsMax) {
      filtered = filtered.filter(p => p.units <= parseInt(unitsMax));
      console.log('After unitsMax filter:', filtered.length);
    }

    console.log('Final filtered properties:', filtered);
    setProperties(filtered);
  };

  const clearFilters = () => {
    setCityFilter('');
    setStateFilter('');
    setPriceMin('');
    setPriceMax('');
    setCapRateMin('');
    setCapRateMax('');
    setUnitsMin('');
    setUnitsMax('');
    setProperties(allProperties);
  };

  const handlePropertyClick = (property) => {
    if (property.lng && property.lat) {
      map.current.flyTo({
        center: [property.lng, property.lat],
        zoom: 14
      });
    }
  };

  return (
    <div style={containerStyle}>
      <div ref={mapContainer} style={mapContainerStyle} />
      <div style={sidebarStyle}>
        {/* Filter Bar */}
        <div style={{background: '#fff', borderBottom: '1px solid #ddd'}}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#f5f5f5',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Filters</span>
            <span>{filterOpen ? '▲' : '▼'}</span>
          </button>
          
          {filterOpen && (
            <div style={{padding: '16px', background: '#fafafa'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                <input
                  type="text"
                  placeholder="City"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                />
              </div>

              <div style={{marginBottom: '12px'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px'}}>Price Range</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                </div>
              </div>

              <div style={{marginBottom: '12px'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px'}}>Cap Rate %</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={capRateMin}
                    onChange={(e) => setCapRateMin(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={capRateMax}
                    onChange={(e) => setCapRateMax(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                </div>
              </div>

              <div style={{marginBottom: '12px'}}>
                <div style={{fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '4px'}}>Units</div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={unitsMin}
                    onChange={(e) => setUnitsMin(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={unitsMax}
                    onChange={(e) => setUnitsMax(e.target.value)}
                    style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px'}}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  onClick={applyFilters}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#fff',
                    color: '#000',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{padding: '16px', borderBottom: '2px solid #ddd', background: '#f9f9f9'}}>
          <h2 style={{margin: 0, fontSize: '20px', fontWeight: '700'}}>
            Properties ({properties.length})
          </h2>
        </div>
        {loading ? (
          <div style={{padding: '16px'}}>Loading properties...</div>
        ) : properties.length === 0 ? (
          <div style={{padding: '16px'}}>No properties available yet.</div>
        ) : (
          properties.map(property => (
            <div
              key={property.id}
              style={propertyCardStyle}
              onClick={() => navigate(`/property/${property.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              {property.cover_image ? (
                <img src={property.cover_image} alt={property.title} style={{...propertyImageStyle, objectFit: 'cover'}} />
              ) : (
                <div style={propertyImageStyle}>No Image</div>
              )}
              <h3 style={propertyTitleStyle}>{property.title || property.address}</h3>
              <p style={propertyMetaStyle}>{property.units} Units • {property.city}, {property.state}</p>
              {property.monthly_rent && property.price && (
                <p style={propertyMetaStyle}>Cap Rate: {((property.monthly_rent * 12 / property.price) * 100).toFixed(1)}%</p>
              )}
              <p style={propertyPriceStyle}>${property.price?.toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
