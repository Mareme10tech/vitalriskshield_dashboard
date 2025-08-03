import React, { useState, useEffect } from 'react';
import { Heart, Activity, Moon, Coffee, CigaretteOff, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../styles/Lifestyle.css';

function Lifestyle({ userData }) {
  const [habits, setHabits] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading lifestyle data
    setTimeout(() => {
      if (userData) {
        setHabits(analyzeLifestyle(userData));
      }
      setLoading(false);
    }, 1000);
  }, [userData]);

  const analyzeLifestyle = (userData) => {
    if (!userData) return null;
    
    return {
      sleep: {
        score: userData.sleep_duration >= 7 ? 'Good' : 'Needs Improvement',
        value: `${userData.sleep_duration} hours/night`,
        recommendation: userData.sleep_duration >= 7 
          ? 'Maintain your healthy sleep habits' 
          : 'Aim for 7-9 hours of sleep per night'
      },
      diet: {
        score: userData.salt_intake <= 5 ? 'Good' : 'Needs Improvement',
        value: `${userData.salt_intake}g salt/day`,
        recommendation: userData.salt_intake <= 5 
          ? 'Your salt intake is within recommended limits' 
          : 'Try to reduce salt intake to less than 5g per day'
      },
      smoking: {
        score: userData.smoking_status === 'non-smoker' ? 'Good' : 'High Risk',
        value: userData.smoking_status === 'non-smoker' 
          ? 'Non-smoker' 
          : userData.smoking_status === 'former-smoker' 
            ? 'Former smoker' 
            : 'Current smoker',
        recommendation: userData.smoking_status === 'non-smoker' 
          ? 'Great job not smoking!' 
          : userData.smoking_status === 'former-smoker' 
            ? 'Consider programs to prevent relapse' 
            : 'Quitting smoking would significantly improve your health'
      },
      stress: {
        score: userData.stress_score <= 5 ? 'Good' : 'Needs Improvement',
        value: `${userData.stress_score}/10`,
        recommendation: userData.stress_score <= 5 
          ? 'Your stress levels are well managed' 
          : 'Consider stress-reduction techniques like meditation or exercise'
      },
      lastUpdated: new Date().toLocaleDateString()
    };
  };

  const getScoreColor = (score) => {
    switch (score) {
      case 'Good': return 'good';
      case 'Needs Improvement': return 'medium';
      case 'High Risk': return 'bad';
      default: return '';
    }
  };

  const lifestyleCategories = [
    {
      id: 'sleep',
      name: 'Sleep',
      icon: <Moon />,
      description: 'Quality and duration of sleep'
    },
    {
      id: 'diet',
      name: 'Diet',
      icon: <Coffee />,
      description: 'Nutritional habits and intake'
    },
    {
      id: 'smoking',
      name: 'Tobacco Use',
      icon: <CigaretteOff />,
      description: 'Smoking status and history'
    },
    {
      id: 'stress',
      name: 'Stress',
      icon: <Heart />,
      description: 'Stress levels and management'
    }
  ];

  return (
    <div className="page-container">
      <Nav />
      
      <div className="lifestyle-container">
        <h1 className="page-title">
          <Activity className="title-icon" />
          Lifestyle Analysis
        </h1>
        
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Analyzing your lifestyle data...</p>
          </div>
        ) : habits ? (
          <>
            <div className="habits-summary">
              <p className="last-updated">Last updated: {habits.lastUpdated}</p>
              
              <div className="habits-overview">
                {lifestyleCategories.map(category => (
                  <div key={category.id} className="habit-card">
                    <div className="habit-icon">{category.icon}</div>
                    <div className="habit-content">
                      <h3>{category.name}</h3>
                      <p className="habit-description">{category.description}</p>
                      
                      <div className="habit-details">
                        <div className={`habit-score ${getScoreColor(habits[category.id].score)}`}>
                          {habits[category.id].score}
                        </div>
                        <div className="habit-value">{habits[category.id].value}</div>
                      </div>
                      
                      <div className="habit-recommendation">
                        <p>{habits[category.id].recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="action-plan">
              <h2>Your Personalized Action Plan</h2>
              
              <div className="action-items">
                {lifestyleCategories.map(category => {
                  if (habits[category.id].score !== 'Good') {
                    return (
                      <div key={`action-${category.id}`} className="action-item">
                        <div className="action-icon">{category.icon}</div>
                        <div className="action-content">
                          <h3>Improve Your {category.name}</h3>
                          <p>{habits[category.id].recommendation}</p>
                          <button className="action-button" onClick={()=>{navigate('/resource')}}>
                            View Resources <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="error-section">
            <p>Unable to load your lifestyle data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lifestyle;