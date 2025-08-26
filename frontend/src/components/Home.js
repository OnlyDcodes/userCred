import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { logout, user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);

  useEffect(() => {
    fetchCurrentLocation();
    loadHistory();
  }, []);

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

  const saveHistory = (historyData) => {
    localStorage.setItem('ipHistory', JSON.stringify(historyData));
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('ipHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  const displayLocation = searchedLocation || currentLocation;

  return (
    <div className="home-container">
      <header className="header">
        <h1>IP Geolocation App</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="main-content">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter IP address..."
              value={searchIp}
              onChange={(e) => setSearchIp(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </div>

        {displayLocation && (
          <div className="location-display">
            <h3>Location Information</h3>
            <div className="location-grid">
              <div className="location-item">
                <strong>IP:</strong> {displayLocation.ip}
              </div>
              <div className="location-item">
                <strong>City:</strong> {displayLocation.city}
              </div>
              <div className="location-item">
                <strong>Region:</strong> {displayLocation.region}
              </div>
              <div className="location-item">
                <strong>Country:</strong> {displayLocation.country}
              </div>
              <div className="location-item">
                <strong>Location:</strong> {displayLocation.loc}
              </div>
              <div className="location-item">
                <strong>Timezone:</strong> {displayLocation.timezone}
              </div>
            </div>
          </div>
        )}

        <div className="history-section">
          <div className="history-header">
            <h3>Search History</h3>
            {selectedHistory.length > 0 && (
              <button onClick={handleHistoryDelete} className="delete-btn">
                Delete Selected ({selectedHistory.length})
              </button>
            )}
          </div>
          
          <div className="history-list">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`history-item ${searchedLocation?.ip === item.ip ? 'active' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedHistory.includes(item.id)}
                  onChange={() => toggleHistorySelection(item.id)}
                />
                <div 
                  className="history-content"
                  onClick={() => handleHistoryClick(item)}
                >
                  <div className="history-ip">{item.ip}</div>
                  <div className="history-location">
                    {item.location.city}, {item.location.country}
                  </div>
                  <div className="history-time">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="no-history">No search history yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

