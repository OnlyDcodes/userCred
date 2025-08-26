import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ContactAdmin from './components/ContactAdmin';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Private route component - requires authentication
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public route component - redirects if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Main app component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Login Route */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Contact Admin Route */}
            <Route 
              path="/contact-admin" 
              element={
                <PublicRoute>
                  <ContactAdmin />
                </PublicRoute>
              } 
            />
            
            {/* Home Route */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
