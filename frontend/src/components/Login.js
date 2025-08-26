import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  // State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // Event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Render functions
  const renderLoadingSpinner = () => (
    <span className="loading-spinner">
      <div className="spinner" />
      Signing in...
    </span>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
          className="form-input"
          required
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading} 
        className="login-button"
      >
        {loading ? renderLoadingSpinner() : 'Sign In'}
      </button>
    </form>
  );

  // Main render
  return (
    <div className="login-container">
      {/* Background with Location Pin Theme */}
      <div className="login-background">
        <div className="location-pin-bg" />
        <div className="login-overlay" />
      </div>
      
      {/* Login Content */}
      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>
          
          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
          
          {/* Login Form */}
          {renderForm()}
          
          {/* Footer */}
          <div className="login-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <span className="signup-link">Contact Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

