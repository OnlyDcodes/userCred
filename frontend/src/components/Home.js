import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  // State management
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [hiddenIPs, setHiddenIPs] = useState(new Set());

  // Hooks
  const { logout, user } = useAuth();

  // Effects
  useEffect(() => {
    fetchCurrentLocation();
    loadHistory();
  }, []);

  // API functions
  const fetchCurrentLocation = async () => {
    try {
      const response = await fetch('https://ipinfo.io/geo');
      const data = await response.json();
      setCurrentLocation(data);
    } catch (err) {
      setError('Failed to fetch current location');
    }
  };

  const fetchIpLocation = async (ip) => {
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/geo`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.title || 'Invalid IP address');
      }
      
      return data;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch location');
    }
  };

  // Event handlers
  const handleSearch = async () => {
    if (!searchIp.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const locationData = await fetchIpLocation(searchIp);
      setSearchedLocation(locationData);
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        ip: searchIp,
        location: locationData,
        timestamp: new Date().toISOString()
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]); // Keep last 10
      saveHistory([newHistoryItem, ...history.slice(0, 9)]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchIp('');
    setSearchedLocation(null);
    setError('');
  };

  const handleHistoryClick = (item) => {
    setSearchIp(item.ip);
    setSearchedLocation(item.location);
    setError('');
  };

  const handleHistoryDelete = () => {
    const newHistory = history.filter(item => !selectedHistory.includes(item.id));
    setHistory(newHistory);
    setSelectedHistory([]);
    saveHistory(newHistory);
  };

  const toggleHistorySelection = (id) => {
    setSelectedHistory(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Utility functions
  const saveHistory = (historyData) => {
    localStorage.setItem('locationHistory', JSON.stringify(historyData));
  };

  const loadHistory = () => {
    const savedHistory = localStorage.getItem('locationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const toggleIPVisibility = (ip) => {
    setHiddenIPs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ip)) {
        newSet.delete(ip);
      } else {
        newSet.add(ip);
      }
      return newSet;
    });
  };

  const maskIP = (ip) => {
    if (!ip) return 'Unknown';
    const parts = ip.split('.');
    return parts.map((part, index) => 
      index < 2 ? part : '***'
    ).join('.');
  };

  const renderIPWithToggle = (ip, label = 'IP') => {
    if (!ip) return `${label}: Unknown`;
    
    const isHidden = hiddenIPs.has(ip);
    const displayIP = isHidden ? maskIP(ip) : ip;
    
    return (
      <div className="ip-with-toggle">
        <span className="ip-label">{label}:</span>
        <span className="ip-value">{displayIP}</span>
        <button 
          onClick={() => toggleIPVisibility(ip)}
          className={`ip-toggle-inline ${isHidden ? 'hidden' : 'visible'}`}
          title={isHidden ? 'Show IP' : 'Hide IP'}
          type="button"
        >
          {isHidden ? '👁️‍🗨️' : '👁️'}
        </button>
      </div>
    );
  };

  // Render functions
  const renderCurrentLocation = () => {
    if (!currentLocation) {
      return <p className="loading-text">Loading current location...</p>;
    }

    return (
      <div className="location-info">
        <div className="location-details">
          <p className="location-text">
            <strong>City:</strong> {currentLocation.city || 'Unknown'}
          </p>
          <p className="location-text">
            <strong>Region:</strong> {currentLocation.region || 'Unknown'}
          </p>
          <p className="location-text">
            <strong>Country:</strong> {currentLocation.country || 'Unknown'}
          </p>
          <div className="location-text">
            {renderIPWithToggle(currentLocation.ip, 'IP')}
          </div>
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    if (!searchedLocation) return null;

    return (
      <div className="search-results">
        <h3 className="results-title">Search Results</h3>
        <div className="location-info">
          <div className="location-text">
            {renderIPWithToggle(searchedLocation.ip, 'IP')}
          </div>
          <p className="location-text">
            <strong>City:</strong> {searchedLocation.city || 'Unknown'}
          </p>
          <p className="location-text">
            <strong>Region:</strong> {searchedLocation.region || 'Unknown'}
          </p>
          <p className="location-text">
            <strong>Country:</strong> {searchedLocation.country || 'Unknown'}
          </p>
          <p className="location-text">
            <strong>Timezone:</strong> {searchedLocation.timezone || 'Unknown'}
          </p>
        </div>
      </div>
    );
  };

  const renderHistoryItem = (item) => (
    <div 
      key={item.id} 
      className={`history-item ${selectedHistory.includes(item.id) ? 'selected' : ''}`}
      onClick={() => handleHistoryClick(item)}
    >
      <div className="history-content">
        <div className="history-ip">
          {renderIPWithToggle(item.ip)}
        </div>
        <div className="history-location">
          {item.location.city}, {item.location.country}
        </div>
        <div className="history-timestamp">
          {new Date(item.timestamp).toLocaleDateString()}
        </div>
      </div>
      <input
        type="checkbox"
        checked={selectedHistory.includes(item.id)}
        onChange={(e) => {
          e.stopPropagation();
          toggleHistorySelection(item.id);
        }}
        className="history-checkbox"
      />
    </div>
  );

  // Main render
  return (
    <div className="home-container">
      {/* Background Image Overlay */}
      <div className="background-overlay" />
      
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="main-title">Location Tracker</h1>
          <div className="user-section">
            <span className="welcome-text">
              Welcome, {user?.name || user?.email || 'User'}!
            </span>
            <button 
              className="logout-btn" 
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Current Location Card */}
        <section className="location-card current-location">
          <h2 className="card-title">📍 Current Location</h2>
          {renderCurrentLocation()}
        </section>

        {/* Search Section */}
        <section className="location-card search-section">
          <h2 className="card-title">🔍 Search IP Location</h2>
          <div className="search-container">
            <div className="search-input-group">
              <input
                type="text"
                value={searchIp}
                onChange={(e) => setSearchIp(e.target.value)}
                placeholder="Enter IP address (e.g., 8.8.8.8)"
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch} 
                disabled={loading || !searchIp.trim()}
                className="search-btn"
                type="button"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
            {searchIp && (
              <button 
                onClick={handleClear} 
                className="clear-btn"
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {renderSearchResults()}
        </section>

        {/* History Section */}
        {history.length > 0 && (
          <section className="location-card history-section">
            <div className="history-header">
              <h2 className="card-title">📚 Search History</h2>
              {selectedHistory.length > 0 && (
                <button 
                  onClick={handleHistoryDelete} 
                  className="delete-selected-btn"
                  type="button"
                >
                  Delete Selected ({selectedHistory.length})
                </button>
              )}
            </div>
            <div className="history-list">
              {history.map(renderHistoryItem)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;

