import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Heart, Zap, ChevronRight } from 'lucide-react';
import Nav from '../components/Nav';
import '../styles/ChronicRisk.css';

function ChronicRisk({ userData }) {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get risk assessment
    const fetchRiskData = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // that processes the user data with your Python model
        setTimeout(() => {
          const mockRiskData = calculateRisk(userData);
          setRiskData(mockRiskData);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching risk data:', error);
        setLoading(false);
      }
    };

    if (userData) {
      fetchRiskData();
    }
  }, [userData]);

  // Mock risk calculation function - replace with actual API call
  const calculateRisk = (userData) => {
    if (!userData) return null;
    
    // Simple mock calculation - replace with your actual model logic
    let diabetesRisk = 0;
    let heartDiseaseRisk = 0;
    let cancerRisk = 0;
    
    // Calculate based on BMI
    if (userData.bmi >= 30) {
      diabetesRisk += 40;
      heartDiseaseRisk += 30;
      cancerRisk += 10;
    } else if (userData.bmi >= 25) {
      diabetesRisk += 25;
      heartDiseaseRisk += 20;
    }
    
    // Adjust based on smoking
    if (userData.smoking_status === 'smoker') {
      heartDiseaseRisk += 35;
      cancerRisk += 30;
    } else if (userData.smoking_status === 'former-smoker') {
      heartDiseaseRisk += 15;
      cancerRisk += 10;
    }
    
    // Adjust based on family history
    if (userData.family_history === 'yes') {
      diabetesRisk += 15;
      heartDiseaseRisk += 20;
    }
    
    // Adjust based on lifestyle factors
    if (userData.salt_intake > 5) heartDiseaseRisk += 10;
    if (userData.stress_score > 5) {
      diabetesRisk += 5;
      heartDiseaseRisk += 10;
    }
    if (userData.sleep_duration < 7) {
      diabetesRisk += 5;
      heartDiseaseRisk += 5;
    }
    
    // Cap at 100%
    diabetesRisk = Math.min(100, diabetesRisk);
    heartDiseaseRisk = Math.min(100, heartDiseaseRisk);
    cancerRisk = Math.min(100, cancerRisk);
    
    // Generate recommendations
    const recommendations = generateRecommendations(userData);
    
    return {
      diabetesRisk,
      heartDiseaseRisk,
      cancerRisk,
      recommendations,
      lastUpdated: new Date().toLocaleDateString()
    };
  };

  const generateRecommendations = (userData) => {
    const recs = [];
    
    if (userData.bmi >= 25) {
      recs.push({
        id: 1,
        title: 'Weight Management',
        description: 'Consider a balanced diet and regular exercise to reach a healthy BMI',
        priority: 'high',
        icon: <Activity />
      });
    }
    
    if (userData.smoking_status === 'smoker') {
      recs.push({
        id: 2,
        title: 'Smoking Cessation',
        description: 'Quitting smoking can significantly reduce your health risks',
        priority: 'critical',
        icon: <AlertTriangle />
      });
    }
    
    if (userData.salt_intake > 5) {
      recs.push({
        id: 3,
        title: 'Reduce Salt Intake',
        description: 'Aim for less than 5g of salt per day to lower blood pressure risk',
        priority: 'medium',
        icon: <Heart />
      });
    }
    
    if (userData.sleep_duration < 7) {
      recs.push({
        id: 4,
        title: 'Improve Sleep',
        description: 'Aim for 7-9 hours of quality sleep per night',
        priority: 'medium',
        icon: <Zap />
      });
    }
    
    // Add general recommendations
    recs.push({
      id: 5,
      title: 'Regular Check-ups',
      description: 'Schedule annual health screenings with your doctor',
      priority: 'high',
      icon: <Heart />
    });
    
    return recs;
  };

  const getRiskLevel = (risk) => {
    if (risk >= 50) return 'High';
    if (risk >= 30) return 'Moderate';
    if (risk >= 15) return 'Elevated';
    return 'Low';
  };

  const getRiskColor = (risk) => {
    if (risk >= 50) return 'high-risk';
    if (risk >= 30) return 'moderate-risk';
    if (risk >= 15) return 'elevated-risk';
    return 'low-risk';
  };

  return (
    <div className="page-container">
      <Nav />
      
      <div className="chronic-risk-container">
        <h1 className="page-title">
          <Activity className="title-icon" />
          Chronic Disease Risk Assessment
        </h1>
        
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Analyzing your health data...</p>
          </div>
        ) : riskData ? (
          <>
            <div className="risk-summary">
              <p className="last-updated">Last updated: {riskData.lastUpdated}</p>
              
              <div className="risk-cards">
                <div className={`risk-card ${getRiskColor(riskData.diabetesRisk)}`}>
                  <h3>Diabetes Risk</h3>
                  <div className="risk-value">{riskData.diabetesRisk}%</div>
                  <div className="risk-level">{getRiskLevel(riskData.diabetesRisk)} Risk</div>
                </div>
                
                <div className={`risk-card ${getRiskColor(riskData.heartDiseaseRisk)}`}>
                  <h3>Heart Disease Risk</h3>
                  <div className="risk-value">{riskData.heartDiseaseRisk}%</div>
                  <div className="risk-level">{getRiskLevel(riskData.heartDiseaseRisk)} Risk</div>
                </div>
                
                <div className={`risk-card ${getRiskColor(riskData.cancerRisk)}`}>
                  <h3>Cancer Risk</h3>
                  <div className="risk-value">{riskData.cancerRisk}%</div>
                  <div className="risk-level">{getRiskLevel(riskData.cancerRisk)} Risk</div>
                </div>
              </div>
            </div>
            
            <div className="recommendations-section">
              <h2>Personalized Recommendations</h2>
              <p className="section-description">
                Based on your health profile, here are actions you can take to reduce your risks:
              </p>
              
              <div className="recommendations-list">
                {riskData.recommendations.map(rec => (
                  <div key={rec.id} className={`recommendation-card ${rec.priority}`}>
                    <div className="rec-icon">{rec.icon}</div>
                    <div className="rec-content">
                      <h3>{rec.title}</h3>
                      <p>{rec.description}</p>
                    </div>
                    <div className="rec-action">
                      <ChevronRight />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="info-section">
              <h3>Understanding Your Risk Scores</h3>
              <p>
                These scores estimate your 10-year risk of developing each condition compared 
                to people with similar health profiles. They are based on statistical models 
                and should be discussed with your healthcare provider.
              </p>
            </div>
          </>
        ) : (
          <div className="error-section">
            <p>Unable to load your risk assessment data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChronicRisk;