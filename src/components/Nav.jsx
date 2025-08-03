import React from 'react';
import { Shield, BarChart3, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, NavLink } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-wrapper">
        <div className="navbar-inner">
          <div className="logo-section">
            <div className="icon-container">
              <Shield className="shield-icon" />
              <BarChart3 className="chart-icon" />
            </div>
            <span className="logo-text">VitalRiskShield</span>
          </div>

          <div className="nav-links">
            {/* Use NavLink for SPA routing and active class toggling */}
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              Dashboard
            </NavLink>
            
            
            
            <NavLink 
              to="/profile" 
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
            >
              Profile
            </NavLink>
            
            <button onClick={handleLogout} className="nav-link logout-button">
              <LogOut className="logout-icon" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
