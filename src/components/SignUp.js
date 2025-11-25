import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f7fa',
  padding: '24px'
};

const formBoxStyle = {
  background: '#fff',
  padding: '48px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '440px'
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

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone
        }
      }
    });

    if (error) {
      alert('Sign up failed: ' + error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone
        });

      if (profileError) {
        alert('Profile creation failed: ' + profileError.message);
        return;
      }
    }

    navigate('/map');
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h1 style={titleStyle}>Join Apartment Blocks</h1>
        <p style={subtitleStyle}>Start finding off-market deals today</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
            required
          />
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
            Create Account
          </button>
        </form>
        <p style={linkTextStyle}>
          Already have an account?{' '}
          <span style={linkStyle} onClick={() => navigate('/login')}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
