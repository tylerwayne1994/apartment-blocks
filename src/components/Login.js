import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url(/Gemini_Generated_Image_6xhbzj6xhbzj6xhb.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '24px'
};

const formBoxStyle = {
  background: '#fff',
  padding: '48px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '440px',
  marginRight: '10%'
};

const titleStyle = {
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 8px',
  color: '#000',
  textAlign: 'center'
};

const subtitleStyle = {
  fontSize: '16px',
  color: '#666',
  textAlign: 'center',
  margin: '0 0 32px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '16px',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const buttonStyle = {
  width: '100%',
  padding: '16px',
  fontSize: '18px',
  fontWeight: '700',
  background: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '8px'
};

const linkTextStyle = {
  textAlign: 'center',
  marginTop: '24px',
  fontSize: '14px',
  color: '#666'
};

const linkStyle = {
  color: '#000',
  fontWeight: '600',
  textDecoration: 'none',
  cursor: 'pointer'
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }

    navigate('/map');
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h1 style={titleStyle}>Welcome Back</h1>
        <p style={subtitleStyle}>Log in to access your deals</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <div style={{position:'relative', marginBottom:'16px'}}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{...inputStyle, marginBottom:0, paddingRight:'50px'}}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'14px', color:'#666'}}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" style={buttonStyle}>
            Log In
          </button>
        </form>
        <p style={linkTextStyle}>
          Don't have an account?{' '}
          <span style={linkStyle} onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
