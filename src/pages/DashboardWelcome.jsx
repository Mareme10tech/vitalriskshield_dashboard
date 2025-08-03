import React from 'react';
import { Shield, BarChart3, Heart, Activity, TrendingUp, Award } from 'lucide-react';
import Nav from '../components/Nav';
import '../styles/DashboardWelcome.css';
import { useNavigate } from 'react-router-dom';

function DashboardWelcome() {
  const navigate = useNavigate();
  
  // Navigation handlers for each feature card
  const handleChronicRiskClick = () => {
    console.log('Chronic Risk clicked'); // Debug log
    navigate('/chronic-risk');
  };

  const handleLifestyleClick = () => {
    console.log('Lifestyle clicked'); // Debug log
    navigate('/lifestyle');
  };

  const handleRewardsClick = () => {
    console.log('Rewards clicked'); // Debug log
    navigate('/rewards-program');
  };

  return (
    <div className="page-container">
      <Nav />
      
      {/* Main Welcome Section */}
      <div className="dashboard-welcome">
        {/* Logo replacement with icon combination */}
        <div className="welcome-logo-container">
          <div className="logo-circle">
            <Shield className="logo-shield" />
          </div>
          <div className="logo-accent">
            <BarChart3 className="logo-chart" />
          </div>
        </div>
        
        <h1>Welcome to VitalRiskShield</h1>
        
        <div className="welcome-message">
          <p>
            VitalRiskShield is your AI-powered health risk forecasting platform. 
            We analyze your health data to identify potential risks for chronic conditions 
            like diabetes, cardiovascular disease, and cancer — helping you take 
            proactive steps toward better health.
          </p>
          <p>
            Get personalized recommendations, track your progress, and earn rewards 
            for healthy behaviors — all in one place.
          </p>
        </div>
        
      </div>
      
      {/* Feature Cards */}
      <div className="features-container">
        <div 
          className="feature-card clickable-card" 
          onClick={handleChronicRiskClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-icon health-icon">
            <Activity className="icon" />
          </div>
          <h3>Chronic Risk</h3>
          <p>Advanced AI algorithms analyze your health data to predict potential risks</p>
        </div>
        
        <div 
          className="feature-card clickable-card" 
          onClick={handleLifestyleClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-icon activity-icon">
            <Heart className="icon" />
          </div>
          <h3>Lifestyle</h3>
          <p>Track your health metrics and receive instant alerts about concerning changes</p>
        </div>
        
        <div 
          className="feature-card clickable-card" 
          onClick={handleRewardsClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="feature-icon reward-icon">
            <Award className="icon" />
          </div>
          <h3>Rewards Program</h3>
          <p>Earn points and unlock benefits for maintaining healthy lifestyle choices</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardWelcome;