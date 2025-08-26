import React from 'react';
import { Link } from 'react-router-dom';
import './ContactAdmin.css';

const ContactAdmin = () => {
  const handleCall = () => {
    window.open('tel:09949279910', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:dcamorganda@gmail.com', '_self');
  };

  return (
    <div className="contact-container">
      <div className="contact-background">
        <div className="location-pin-bg" />
        <div className="contact-overlay" />
      </div>
      
      <div className="contact-content">
        <div className="contact-card">
          {/* Header */}
          <div className="contact-header">
            <h1 className="contact-title">Contact Admin</h1>
            <p className="contact-subtitle">Get in touch for account access</p>
          </div>
          
          {/* Contact Information */}
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon">📱</div>
              <div className="contact-details">
                <h3 className="contact-label">Phone Number</h3>
                <p className="contact-value">09949279910</p>
                <button 
                  onClick={handleCall}
                  className="contact-action-btn call-btn"
                  type="button"
                >
                  Call Now
                </button>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h3 className="contact-label">Email Address</h3>
                <p className="contact-value">dcamorganda@gmail.com</p>
                <button 
                  onClick={handleEmail}
                  className="contact-action-btn email-btn"
                  type="button"
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="contact-note">
            <p className="note-text">
              Please contact the admin to request account creation or if you're experiencing login issues.
            </p>
          </div>
          
          {/* Back to Login */}
          <div className="contact-footer">
            <Link to="/login" className="back-to-login-btn">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdmin;
