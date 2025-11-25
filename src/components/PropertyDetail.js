import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import StressTestCalculator from './StressTestCalculator';
import ValueAddCalculator from './ValueAddCalculator';
import LOIBuilder from './LOIBuilder';
import { loadCityRentalData, loadZipStats } from '../utils/rentalDataLoader';
import { isAdmin } from '../utils/authHelpers';

const containerStyle = {
  minHeight: 'calc(100vh - 60px)',
  background: '#f5f7fa',
  padding: '0'
};

const heroStyle = {
  position: 'relative',
  width: '100%',
  height: '500px',
  background: '#000'
};

const heroImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const heroOverlayStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  padding: '40px',
  color: '#fff'
};

const heroTitleStyle = {
  fontSize: '42px',
  fontWeight: '800',
  margin: '0 0 16px',
  color: '#fff'
};

const heroPriceStyle = {
  fontSize: '36px',
  fontWeight: '800',
  margin: '0',
  color: '#fff'
};

const statusBadgeStyle = (status) => ({
  display: 'inline-block',
  padding: '8px 20px',
  borderRadius: '24px',
  fontSize: '14px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '16px',
  background: status === 'active' ? '#4caf50' : 
              status === 'sold' ? '#f44336' : 
              status === 'pending' ? '#ff9800' : 
              status === 'contingent' ? '#2196f3' : '#757575',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
});

const contentWrapperStyle = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '40px 20px',
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: '40px'
};

const mainContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px'
};

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px'
};

const cardStyle = {
  background: '#fff',
  borderRadius: '12px',
  padding: '32px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
};

const sectionTitleStyle = {
  fontSize: '24px',
  fontWeight: '800',
  margin: '0 0 24px',
  color: '#000'
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px'
};

const statCardStyle = {
  background: '#f9f9f9',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center'
};

const statValueStyle = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#000',
  margin: '0 0 8px'
};

const statLabelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#666',
  margin: '0'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px'
};

const fieldStyle = {
  marginBottom: '20px'
};

const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#666',
  display: 'block',
  marginBottom: '6px'
};

const valueStyle = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#000'
};

const buttonStyle = {
  width: '100%',
  padding: '18px 32px',
  fontSize: '18px',
  fontWeight: '700',
  background: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginBottom: '16px'
};

const secondaryButtonStyle = {
  width: '100%',
  padding: '16px 32px',
  fontSize: '16px',
  fontWeight: '600',
  background: '#fff',
  color: '#000',
  border: '2px solid #000',
  borderRadius: '8px',
  cursor: 'pointer'
};

const thumbnailGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '16px',
  marginTop: '24px'
};

const thumbnailStyle = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '2px solid transparent',
  transition: 'all 0.2s ease'
};

const badgeStyle = (color) => ({
  display: 'inline-block',
  padding: '6px 12px',
  background: color || '#000',
  color: '#fff',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '700',
  marginRight: '8px',
  marginBottom: '8px'
});

const documentListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const documentItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  background: '#f9f9f9',
  borderRadius: '8px'
};

const documentButtonStyle = {
  padding: '8px 16px',
  fontSize: '14px',
  fontWeight: '600',
  background: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [daysOnMarket, setDaysOnMarket] = useState(0);
  const [loiCount, setLoiCount] = useState(0);
  const [showLOIModal, setShowLOIModal] = useState(false);
  const [rentalData, setRentalData] = useState(null);
  const [zipStats, setZipStats] = useState(null);
  const [loadingMarketData, setLoadingMarketData] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    loadProperty();
    checkAdminStatus();
  }, [id]);

  const checkAdminStatus = async () => {
    const adminStatus = await isAdmin();
    setUserIsAdmin(adminStatus);
  };

  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProperty(data);
        
        // Calculate days on market
        const listedDate = new Date(data.listed_date || data.created_at);
        const today = new Date();
        const diffTime = Math.abs(today - listedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysOnMarket(diffDays);

        // Load LOI count from offers table
        const { count, error: countError } = await supabase
          .from('offers')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', id);
        
        if (!countError) {
          setLoiCount(count || 0);
        }

        // Increment view count
        await supabase
          .from('properties')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);

        // Load market data
        loadMarketData(data);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const loadMarketData = async (prop) => {
    setLoadingMarketData(true);
    try {
      console.log('Loading market data for:', { city: prop.city, state: prop.state, zipcode: prop.zipcode });
      const [rental, zip] = await Promise.all([
        loadCityRentalData(prop.city, prop.state),
        loadZipStats(prop.zipcode || prop.zip_code || prop.zip)
      ]);
      setRentalData(rental);
      setZipStats(zip);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoadingMarketData(false);
    }
  };

  const refreshLoiCount = async () => {
    try {
      const { count, error } = await supabase
        .from('offers')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', id);
      
      if (!error) {
        setLoiCount(count || 0);
      }
    } catch (error) {
      console.error('Error refreshing LOI count:', error);
    }
  };

  const handleContactSeller = () => {
    if (property.contact_email) {
      window.location.href = `mailto:${property.contact_email}?subject=Interest in ${property.title || property.address}`;
    } else if (property.contact_phone) {
      alert(`Contact Seller: ${property.contact_phone}`);
    }
  };

  const downloadDocument = (url, index) => {
    // Old /raw/ URLs won't work - show error message
    if (url.includes('/raw/upload/')) {
      alert('This document was uploaded with an old format and cannot be downloaded. Please delete this property and re-upload it to fix the documents.');
      return;
    }
    
    // New uploads will work directly
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{padding: '40px', textAlign: 'center'}}>
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={containerStyle}>
        <div style={{padding: '40px', textAlign: 'center'}}>
          <p>Property not found</p>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const documents = property.documents || [];
  const coverImage = property.cover_image || images[0] || null;

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroStyle}>
        {coverImage ? (
          <img src={coverImage} alt={property.title} style={heroImageStyle} />
        ) : (
          <div style={{width:'100%',height:'100%',background:'#e0e0e0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',color:'#999'}}>
            No Image Available
          </div>
        )}
        <div style={heroOverlayStyle}>
          <div style={statusBadgeStyle(property.status || 'active')}>
            {(property.status || 'active').toUpperCase()}
          </div>
          <h1 style={heroTitleStyle}>{property.title || property.address}</h1>
          <p style={{fontSize:'20px',margin:'0 0 16px',color:'#fff'}}>
            {property.address}, {property.city}, {property.state} {property.zip}
          </p>
          <div style={heroPriceStyle}>${property.price?.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentWrapperStyle}>
        {/* Left Column */}
        <div style={mainContentStyle}>
          {/* Tracking Stats */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Property Stats</h2>
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{daysOnMarket}</div>
                <div style={statLabelStyle}>Days on Market</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{property.views || 0}</div>
                <div style={statLabelStyle}>Views</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{loiCount}</div>
                <div style={statLabelStyle}>LOIs Submitted</div>
              </div>
            </div>
          </div>

          {/* Admin Edit Button */}
          {userIsAdmin && (
            <div style={{marginBottom: '24px'}}>
              <button
                onClick={() => navigate(`/edit-property/${property.id}`)}
                style={{
                  padding: '12px 24px',
                  background: '#d32f2f',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  width: '100%'
                }}
              >
                🔧 Edit Property (Admin Access)
              </button>
            </div>
          )}

          {/* Property Overview */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Property Overview</h2>
            <div style={gridStyle}>
              <div style={fieldStyle}>
                <span style={labelStyle}>Property Type</span>
                <span style={valueStyle}>{property.property_type || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Units</span>
                <span style={valueStyle}>{property.units || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Price Per Unit</span>
                <span style={valueStyle}>{property.price && property.units ? `$${Math.round(property.price / property.units).toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Building Class</span>
                <span style={valueStyle}>{property.building_class || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Year Built</span>
                <span style={valueStyle}>{property.year_built || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Square Feet</span>
                <span style={valueStyle}>{property.sqft ? property.sqft.toLocaleString() : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Lot Size</span>
                <span style={valueStyle}>{property.lot_size ? `${property.lot_size} acres` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Creative Financing</span>
                <span style={valueStyle}>
                  {property.seller_financing_available && (
                    <span style={badgeStyle('#007a33')}>Seller Financing</span>
                  )}
                  {property.assumable_loan && (
                    <span style={badgeStyle('#0066cc')}>Assumable Loan</span>
                  )}
                  {!property.seller_financing_available && !property.assumable_loan && 'None'}
                </span>
              </div>
              {property.value_add_possible && (
                <>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>Rehab Per Unit</span>
                    <span style={valueStyle}>{property.rehab_per_unit ? `$${property.rehab_per_unit.toLocaleString()}` : 'N/A'}</span>
                  </div>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>Total Rehab Budget</span>
                    <span style={valueStyle}>{property.total_rehab_budget ? `$${property.total_rehab_budget.toLocaleString()}` : 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Financial Details */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Financial Details</h2>
            <div style={gridStyle}>
              <div style={fieldStyle}>
                <span style={labelStyle}>Asking Price</span>
                <span style={valueStyle}>${property.price?.toLocaleString() || 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Price Per Unit</span>
                <span style={valueStyle}>
                  {property.price && property.units 
                    ? `$${(property.price / property.units).toLocaleString(undefined, {maximumFractionDigits: 0})}` 
                    : 'N/A'}
                </span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Current Rent Per Unit</span>
                <span style={valueStyle}>{property.current_rent_per_unit ? `$${property.current_rent_per_unit.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Market Rent Per Unit</span>
                <span style={valueStyle}>{property.market_rent_per_unit ? `$${property.market_rent_per_unit.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Current Monthly Rent</span>
                <span style={valueStyle}>{property.monthly_rent ? `$${property.monthly_rent.toLocaleString()}` : 'Unknown'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Pro Forma Rent</span>
                <span style={valueStyle}>{property.pro_forma_rent ? `$${property.pro_forma_rent.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Other Monthly Income</span>
                <span style={valueStyle}>{property.other_income ? `$${property.other_income.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Annual NOI</span>
                <span style={{...valueStyle, color: '#4caf50', fontWeight: '700'}}>
                  {property.monthly_rent && property.annual_taxes && property.annual_insurance
                    ? `$${((property.monthly_rent * 12) - (property.annual_opex || 0) - property.annual_taxes - property.annual_insurance).toLocaleString()}`
                    : 'N/A'}
                </span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Cap Rate</span>
                <span style={{...valueStyle, color: '#2196f3', fontWeight: '700'}}>
                  {property.monthly_rent && property.annual_taxes && property.annual_insurance && property.price
                    ? `${(((property.monthly_rent * 12 - (property.annual_opex || 0) - property.annual_taxes - property.annual_insurance) / property.price) * 100).toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Annual Taxes</span>
                <span style={valueStyle}>{property.annual_taxes ? `$${property.annual_taxes.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Annual Insurance</span>
                <span style={valueStyle}>{property.annual_insurance ? `$${property.annual_insurance.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Annual Operating Expenses</span>
                <span style={valueStyle}>{property.annual_opex ? `$${property.annual_opex.toLocaleString()}` : 'N/A'}</span>
              </div>
              <div style={fieldStyle}>
                <span style={labelStyle}>Utilities Paid By</span>
                <span style={valueStyle}>{property.utilities_paid_by || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Market Data & Rental Comps */}
          {(rentalData || zipStats) && (
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>Market Data & Rental Comps</h2>
              
              {loadingMarketData ? (
                <div style={{textAlign:'center',padding:'20px',color:'#666'}}>Loading market data...</div>
              ) : (
                <>
                  {rentalData && (
                    <>
                      <div style={{marginBottom:'24px',padding:'20px',background:'#f0f8ff',borderRadius:'8px',borderLeft:'4px solid #2196f3'}}>
                        <h3 style={{fontSize:'18px',fontWeight:'700',marginBottom:'16px',color:'#000'}}>
                          {property.city}, {property.state} Rental Market
                        </h3>
                        <div style={{marginBottom:'12px',fontSize:'13px',fontWeight:'600',color:'#666',textAlign:'center'}}>
                          Based on 2-Bedroom Units
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px'}}>
                          <div style={{textAlign:'center'}}>
                            <div style={{fontSize:'28px',fontWeight:'800',color:'#4caf50',marginBottom:'4px'}}>
                              ${rentalData.avgRent.toLocaleString()}
                            </div>
                            <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>Avg Rent/Month</div>
                          </div>
                          <div style={{textAlign:'center'}}>
                            <div style={{fontSize:'28px',fontWeight:'800',color:'#ff9800',marginBottom:'4px'}}>
                              ${rentalData.medianRent.toLocaleString()}
                            </div>
                            <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>Median Rent</div>
                          </div>
                        </div>
                      </div>

                      <div style={{marginBottom:'24px'}}>
                        <h4 style={{fontSize:'16px',fontWeight:'700',marginBottom:'12px',color:'#000'}}>
                          Rent by Bedroom Count
                        </h4>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:'12px'}}>
                          {Object.entries(rentalData.avgByBeds).sort((a,b) => a[0] - b[0]).map(([beds, rent]) => (
                            <div key={beds} style={{padding:'16px',background:'#f9f9f9',borderRadius:'8px',textAlign:'center'}}>
                              <div style={{fontSize:'20px',fontWeight:'800',color:'#000',marginBottom:'4px'}}>
                                ${rent.toLocaleString()}
                              </div>
                              <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>
                                {beds} Bed{beds > 1 ? 's' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{padding:'16px',background:'#fff3cd',borderRadius:'8px',marginBottom:'24px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'14px',fontWeight:'600'}}>
                          <span>Rent Range:</span>
                          <span style={{color:'#000'}}>${rentalData.minRent.toLocaleString()} - ${rentalData.maxRent.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {zipStats && (
                    <div style={{padding:'20px',background:'#f0fdf4',borderRadius:'8px',borderLeft:'4px solid #4caf50'}}>
                      <h3 style={{fontSize:'18px',fontWeight:'700',marginBottom:'24px',color:'#000'}}>
                        ZIP {property.zipcode} Demographics
                      </h3>
                      
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',marginBottom:'24px'}}>
                        {/* Renter/Owner Pie Chart */}
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <h4 style={{fontSize:'14px',fontWeight:'700',marginBottom:'16px',color:'#000'}}>Occupancy Type</h4>
                          <svg width="140" height="140" viewBox="0 0 140 140">
                            {(() => {
                              const renterPct = zipStats.pctRenter / 100;
                              const ownerPct = zipStats.pctOwner / 100;
                              
                              if (renterPct >= 0.999) {
                                return <circle cx="70" cy="70" r="60" fill="#4caf50" />;
                              }
                              if (ownerPct >= 0.999) {
                                return <circle cx="70" cy="70" r="60" fill="#2196f3" />;
                              }
                              
                              const renterAngle = renterPct * 360;
                              const renterRad = (renterAngle - 90) * Math.PI / 180;
                              
                              const x = 70 + 60 * Math.cos(renterRad);
                              const y = 70 + 60 * Math.sin(renterRad);
                              
                              const largeArc = renterAngle > 180 ? 1 : 0;
                              
                              return (
                                <>
                                  <path d={`M 70 70 L 70 10 A 60 60 0 ${largeArc} 1 ${x} ${y} Z`} fill="#4caf50" />
                                  <path d={`M 70 70 L ${x} ${y} A 60 60 0 ${1-largeArc} 1 70 10 Z`} fill="#2196f3" />
                                </>
                              );
                            })()}
                          </svg>
                          <div style={{marginTop:'12px',display:'flex',flexDirection:'column',gap:'6px',width:'100%'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center'}}>
                              <div style={{width:'12px',height:'12px',borderRadius:'2px',background:'#4caf50'}}></div>
                              <span style={{fontSize:'13px',fontWeight:'600',color:'#000'}}>
                                Renter: {zipStats.pctRenter.toFixed(1)}%
                              </span>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center'}}>
                              <div style={{width:'12px',height:'12px',borderRadius:'2px',background:'#2196f3'}}></div>
                              <span style={{fontSize:'13px',fontWeight:'600',color:'#000'}}>
                                Owner: {zipStats.pctOwner.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:'16px'}}>
                          <div style={{textAlign:'center',padding:'16px',background:'#fff',borderRadius:'8px'}}>
                            <div style={{fontSize:'32px',fontWeight:'800',color:'#000',marginBottom:'4px'}}>
                              {zipStats.totalUnits.toLocaleString()}
                            </div>
                            <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>Total Housing Units</div>
                          </div>
                          <div style={{textAlign:'center',padding:'16px',background:'#fff',borderRadius:'8px'}}>
                            <div style={{fontSize:'32px',fontWeight:'800',color:'#4caf50',marginBottom:'4px'}}>
                              {zipStats.renterUnits.toLocaleString()}
                            </div>
                            <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>Renter Units</div>
                          </div>
                          <div style={{textAlign:'center',padding:'16px',background:'#fff',borderRadius:'8px'}}>
                            <div style={{fontSize:'32px',fontWeight:'800',color:'#2196f3',marginBottom:'4px'}}>
                              {zipStats.ownerUnits.toLocaleString()}
                            </div>
                            <div style={{fontSize:'13px',fontWeight:'600',color:'#666'}}>Owner Units</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!rentalData && !zipStats && (
                    <div style={{textAlign:'center',padding:'20px',color:'#666'}}>
                      No market data available for this location
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div style={sidebarStyle}>
          {/* Contact Card */}
          <div style={cardStyle}>
            <h3 style={{fontSize:'20px',fontWeight:'700',margin:'0 0 16px',color:'#000'}}>
              Contact Seller
            </h3>
            <div style={{marginBottom:'20px'}}>
              <div style={fieldStyle}>
                <span style={labelStyle}>Name</span>
                <span style={valueStyle}>{property.contact_name || 'N/A'}</span>
              </div>
              {property.contact_phone && (
                <div style={fieldStyle}>
                  <span style={labelStyle}>Phone</span>
                  <span style={valueStyle}>{property.contact_phone}</span>
                </div>
              )}
              {property.contact_email && (
                <div style={fieldStyle}>
                  <span style={labelStyle}>Email</span>
                  <span style={valueStyle}>{property.contact_email}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowLOIModal(true)}
              style={buttonStyle}
            >
              Submit LOI
            </button>
          </div>

          {/* Key Highlights */}
          <div style={cardStyle}>
            <h3 style={{fontSize:'20px',fontWeight:'700',margin:'0 0 16px',color:'#000'}}>
              Key Highlights
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'#f9f9f9',borderRadius:'6px'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:'#666'}}>Units</span>
                <span style={{fontSize:'16px',fontWeight:'700',color:'#000'}}>{property.units}</span>
              </div>
              
              {/* Unit Mix Breakdown - Only show types that exist */}
              {(() => {
                const bed1 = parseInt(property.bed_1_count) || 0;
                const bed2 = parseInt(property.bed_2_count) || 0;
                const bed3 = parseInt(property.bed_3_count) || 0;
                const bed4 = parseInt(property.bed_4_count) || 0;
                
                const unitTypes = [];
                if (bed1 > 0) unitTypes.push({ label: '1 Bed', count: bed1 });
                if (bed2 > 0) unitTypes.push({ label: '2 Bed', count: bed2 });
                if (bed3 > 0) unitTypes.push({ label: '3 Bed', count: bed3 });
                if (bed4 > 0) unitTypes.push({ label: '4+ Bed', count: bed4 });
                
                return unitTypes.map((unit, idx) => (
                  <div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'#f9f9f9',borderRadius:'6px'}}>
                    <span style={{fontSize:'14px',fontWeight:'600',color:'#666'}}>{unit.label}</span>
                    <span style={{fontSize:'16px',fontWeight:'700',color:'#000'}}>{unit.count}</span>
                  </div>
                ));
              })()}
              
              <div style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'#f9f9f9',borderRadius:'6px'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:'#666'}}>Cap Rate</span>
                <span style={{fontSize:'16px',fontWeight:'700',color:'#2196f3'}}>
                  {property.monthly_rent && property.annual_taxes && property.annual_insurance && property.price
                    ? `${(((property.monthly_rent * 12 - (property.annual_opex || 0) - property.annual_taxes - property.annual_insurance) / property.price) * 100).toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'#f9f9f9',borderRadius:'6px'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:'#666'}}>Occupancy</span>
                <span style={{fontSize:'16px',fontWeight:'700',color:'#000'}}>{property.occupancy_percent ? `${property.occupancy_percent}%` : 'N/A'}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',padding:'12px',background:'#f9f9f9',borderRadius:'6px'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:'#666'}}>Year Built</span>
                <span style={{fontSize:'16px',fontWeight:'700',color:'#000'}}>{property.year_built || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div style={cardStyle}>
              <h2 style={{fontSize:'20px',fontWeight:'700',margin:'0 0 16px',color:'#000'}}>
                Property Documents
              </h2>
              <div style={documentListStyle}>
                {documents.map((doc, index) => (
                  <div key={index} style={documentItemStyle}>
                    <span style={{fontSize:'16px',fontWeight:'600',color:'#000'}}>
                      Document {index + 1}
                    </span>
                    <button
                      onClick={() => downloadDocument(doc, index)}
                      style={documentButtonStyle}
                    >
                      View/Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {images.length > 0 && (
            <div style={cardStyle}>
              <h2 style={{fontSize:'20px',fontWeight:'700',margin:'0 0 16px',color:'#000'}}>
                Photo Gallery
              </h2>
              <div style={thumbnailGridStyle}>
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Property ${index + 1}`}
                    style={{
                      ...thumbnailStyle,
                      borderColor: selectedImage === index ? '#000' : 'transparent'
                    }}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#666'}
                    onMouseLeave={(e) => {
                      if (selectedImage !== index) e.currentTarget.style.borderColor = 'transparent';
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              ...secondaryButtonStyle,
              marginTop: '16px'
            }}
          >
            ← Back to Properties
          </button>
        </div>
      </div>

      {/* Deal Tools Section */}
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '40px 20px'}}>
        <h2 style={{fontSize: '32px', fontWeight: '800', marginBottom: '32px'}}>Deal Analysis Tools</h2>
        
        <StressTestCalculator 
          initialPrice={property.price || 1000000}
          initialNOI={(property.monthly_rent * 12 - property.annual_opex - property.annual_taxes - property.annual_insurance) || 100000}
        />
        
        <ValueAddCalculator 
          initialUnits={property.units || 50}
          initialPrice={property.price || 1000000}
        />
      </div>

      {/* LOI Modal */}
      {showLOIModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowLOIModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '32px',
                fontWeight: '700',
                cursor: 'pointer',
                color: '#666',
                zIndex: 10000
              }}
            >
              ×
            </button>
            <LOIBuilder
              price={property.price || 0}
              unitCount={property.units || 0}
              address={property.address || ''}
              noi={(property.monthly_rent * 12 - property.annual_opex - property.annual_taxes - property.annual_insurance) || 0}
              propertyId={property.id}
              sellerId={property.user_id}
              onClose={() => {
                setShowLOIModal(false);
                refreshLoiCount();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
