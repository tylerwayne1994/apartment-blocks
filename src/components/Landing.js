import React from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  minHeight: '100vh',
  background: '#fff'
};

const heroStyle = {
  position: 'relative',
  height: '600px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: 'url(/Gemini_Generated_Image_hm9vc9hm9vc9hm9v.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  zIndex: 1
};

const heroContentStyle = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: '#fff',
  maxWidth: '900px',
  padding: '0 24px'
};

const heroTitleStyle = {
  fontSize: '64px',
  fontWeight: '900',
  margin: '0 0 24px',
  letterSpacing: '-2px',
  lineHeight: '1.1'
};

const heroSubtitleStyle = {
  fontSize: '24px',
  fontWeight: '400',
  margin: '0 0 40px',
  lineHeight: '1.5',
  opacity: '0.95'
};

const ctaContainerStyle = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center'
};

const primaryButtonStyle = {
  padding: '16px 40px',
  fontSize: '18px',
  fontWeight: '700',
  background: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease'
};

const secondaryButtonStyle = {
  padding: '16px 40px',
  fontSize: '18px',
  fontWeight: '700',
  background: '#fff',
  color: '#000',
  border: '2px solid #fff',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease'
};

const sectionStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '80px 24px'
};

const sectionTitleStyle = {
  fontSize: '48px',
  fontWeight: '800',
  textAlign: 'center',
  margin: '0 0 16px',
  color: '#000'
};

const sectionSubtitleStyle = {
  fontSize: '20px',
  textAlign: 'center',
  margin: '0 0 64px',
  color: '#555',
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '32px',
  marginBottom: '48px'
};

const featureCardStyle = {
  background: '#f9f9f9',
  padding: '32px',
  borderRadius: '12px',
  border: '1px solid #e0e0e0'
};

const featureTitleStyle = {
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px',
  color: '#000'
};

const featureTextStyle = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333',
  margin: 0
};

const finalCTAStyle = {
  textAlign: 'center',
  padding: '80px 24px',
  background: '#000',
  color: '#fff'
};

const finalTitleStyle = {
  fontSize: '56px',
  fontWeight: '900',
  margin: '0 0 24px'
};

const finalSubtitleStyle = {
  fontSize: '22px',
  margin: '0 0 40px',
  opacity: '0.9'
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={heroStyle}>
        <div style={overlayStyle}></div>
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>Find Real Multifamily Deals Before Everyone Else</h1>
          <p style={heroSubtitleStyle}>
            Off-market properties. Instant analysis. Creative financing. Zero noise.
          </p>
          <div style={ctaContainerStyle}>
            <button style={primaryButtonStyle} onClick={() => navigate('/signup')}>
              Get Started
            </button>
            <button style={secondaryButtonStyle} onClick={() => navigate('/properties')}>
              Browse Deals
            </button>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Built for Investors Who Close Deals</h2>
        <p style={sectionSubtitleStyle}>
          Most platforms show you retail garbage. Apartment Blocks gives you off-market multifamily opportunities that actually cash flow.
        </p>

        <div style={gridStyle}>
          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Off-Market Properties</h3>
            <p style={featureTextStyle}>
              Small, medium, and large multifamily deals that owners haven't listed publicly. Direct-to-seller opportunities before brokers get them.
            </p>
          </div>

          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Your Personal Buy Box</h3>
            <p style={featureTextStyle}>
              Set your criteria: city, unit count, price range, cap rate, value-add potential, seller carry requirements. The system hunts for you.
            </p>
          </div>

          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Real-Time Alerts</h3>
            <p style={featureTextStyle}>
              Get instant notifications every time a new off-market or distressed deal matches your buy box. No scrolling. No wasted time.
            </p>
          </div>

          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Instant Underwriting</h3>
            <p style={featureTextStyle}>
              Cash flow projections, cap rate, DSCR, value-add upside, rent comps, rehab ROI. Know immediately if the deal is worth pursuing.
            </p>
          </div>

          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>Creative Financing Highlighted</h3>
            <p style={featureTextStyle}>
              Seller carry, zero-down structures, partner-funded equity, deferred payments, equity buyouts. Find deals you can actually afford.
            </p>
          </div>

          <div style={featureCardStyle}>
            <h3 style={featureTitleStyle}>One Dashboard</h3>
            <p style={featureTextStyle}>
              Compare every opportunity in one place. No spreadsheets. No forty tabs. Ranked deals based on your strategy.
            </p>
          </div>
        </div>
      </div>

      <div style={finalCTAStyle}>
        <h2 style={finalTitleStyle}>Turn Into a Closer</h2>
        <p style={finalSubtitleStyle}>
          Join investors who find multifamily properties that cash flow day one.
        </p>
        <button style={{...primaryButtonStyle, background:'#fff', color:'#000'}} onClick={() => navigate('/signup')}>
          Start Finding Deals
        </button>
      </div>

      <div style={{padding: '60px 24px', background: '#f5f5f5', borderTop: '1px solid #e0e0e0'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', marginBottom: '48px'}}>
            <div>
              <h3 style={{fontSize: '24px', fontWeight: '800', margin: '0 0 16px', color: '#000'}}>Apartment Blocks</h3>
              <p style={{fontSize: '14px', lineHeight: '1.6', color: '#555', margin: 0}}>
                Off-market multifamily deals for serious investors. Find properties that actually cash flow.
              </p>
            </div>
            
            <div>
              <h4 style={{fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#000'}}>Quick Links</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <a href="/properties" style={{fontSize: '14px', color: '#555', textDecoration: 'none'}}>Browse Properties</a>
                <a href="/signup" style={{fontSize: '14px', color: '#555', textDecoration: 'none'}}>Sign Up</a>
                <a href="/login" style={{fontSize: '14px', color: '#555', textDecoration: 'none'}}>Login</a>
              </div>
            </div>

            <div>
              <h4 style={{fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#000'}}>Contact Us</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <a href="tel:7605241227" style={{fontSize: '14px', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '18px'}}>📞</span> (760) 524-1227
                </a>
                <a href="mailto:terraaisup@gmail.com" style={{fontSize: '14px', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '18px'}}>✉️</span> terraaisup@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div style={{borderTop: '1px solid #ddd', paddingTop: '32px', textAlign: 'center'}}>
            <p style={{fontSize: '14px', color: '#777', margin: 0}}>
              © {new Date().getFullYear()} Apartment Blocks. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
