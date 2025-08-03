import React, { useState, useEffect } from 'react';
import { Shield, BarChart3, User, Heart, Activity, CheckCircle, Info, TrendingUp } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'; // If you're using this library
// If not using react-firebase-hooks, you can use onAuthStateChanged instead
import '../styles/OnboardingFlow.css';

const OnboardingFlow = ({ onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [user] = useAuthState(auth); // If using react-firebase-hooks
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Health Profile - Based on your specifications
    age: '',
    height: '',
    weight: '',
    bmi: 0,
    salt_intake: 5.0,
    stress_score: 5,
    sleep_duration: 7.0,
    family_history: '',
    smoking_status: '',
    
    // Consent
    vitalityConsent: false,
    dataProcessingConsent: false,
    healthScreeningReminders: true
  });

  // Alternative useEffect for auth state if not using react-firebase-hooks
  /*
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserData(user.uid);
      } else {
        setIsLoadingUserData(false);
      }
    });

    return () => unsubscribe();
  }, []);
  */

  // Load user data when user is available
  useEffect(() => {
    if (user) {
      loadUserData(user.uid);
    } else {
      setIsLoadingUserData(false);
    }
  }, [user]);

  const loadUserData = async (userId) => {
    try {
      setIsLoadingUserData(true);
      
      // Get user document from Firestore
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        // Parse name if it's stored as a full name
        const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Update form data with existing user information
        setFormData(prevData => ({
          ...prevData,
          // Only update fields that have data in the database
          firstName: firstName || prevData.firstName,
          lastName: lastName || prevData.lastName,
          email: userData.email || prevData.email,
          phone: userData.phone || prevData.phone,
          age: userData.age || prevData.age,
          height: userData.height || prevData.height,
          weight: userData.weight || prevData.weight,
          bmi: userData.bmi || (userData.height && userData.weight ? 
            calculateBMI(userData.height, userData.weight) : prevData.bmi),
          salt_intake: userData.salt_intake !== undefined ? userData.salt_intake : prevData.salt_intake,
          stress_score: userData.stress_score !== undefined ? userData.stress_score : prevData.stress_score,
          sleep_duration: userData.sleep_duration !== undefined ? userData.sleep_duration : prevData.sleep_duration,
          family_history: userData.family_history || prevData.family_history,
          smoking_status: userData.smoking_status || prevData.smoking_status,
          vitalityConsent: userData.vitalityConsent !== undefined ? userData.vitalityConsent : prevData.vitalityConsent,
          dataProcessingConsent: userData.dataProcessingConsent !== undefined ? userData.dataProcessingConsent : prevData.dataProcessingConsent,
          healthScreeningReminders: userData.healthScreeningReminders !== undefined ? userData.healthScreeningReminders : prevData.healthScreeningReminders,
        }));
        
        console.log('User data loaded successfully:', userData);
      } else {
        console.log('No user document found, using default values');
        // If user document doesn't exist but user is authenticated, 
        // at least set the email from auth
        if (user?.email) {
          setFormData(prevData => ({
            ...prevData,
            email: user.email
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Still set email from auth if available
      if (user?.email) {
        setFormData(prevData => ({
          ...prevData,
          email: user.email
        }));
      }
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const steps = [
    {
      label: 'Welcome',
      icon: <Shield className="step-icon" />,
      title: 'Welcome to VitalRiskShield',
      description: 'Let\'s build your personalized health risk profile'
    },
    {
      label: 'Personal Info',
      icon: <User className="step-icon" />,
      title: 'Basic Information',
      description: 'Tell us about yourself'
    },
    {
      label: 'Health Profile',
      icon: <Heart className="step-icon" />,
      title: 'Health Metrics',
      description: 'Your current health status'
    },
    {
      label: 'Lifestyle',
      icon: <Activity className="step-icon" />,
      title: 'Lifestyle Factors',
      description: 'Daily habits that impact your health'
    },
    {
      label: 'AI Setup',
      icon: <TrendingUp className="step-icon" />,
      title: 'AI Risk Profiling',
      description: 'How our AI will help you'
    },
    {
      label: 'Complete',
      icon: <CheckCircle className="step-icon" />,
      title: 'All Set!',
      description: 'Your health journey begins'
    }
  ];

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightNum = parseFloat(weight);
      const bmi = weightNum / (heightInMeters * heightInMeters);
      return parseFloat(bmi.toFixed(1));
    }
    return 0;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    if (bmi >= 30) return 'Obese';
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate BMI when height or weight changes
      if (field === 'height' || field === 'weight') {
        updated.bmi = calculateBMI(
          field === 'height' ? value : prev.height,
          field === 'weight' ? value : prev.weight
        );
      }
      
      return updated;
    });
  };

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 1: // Personal Info
        return formData.firstName && formData.lastName && formData.email && formData.age;
      case 2: // Health Profile
        return formData.height && formData.weight && formData.family_history && formData.smoking_status;
      case 3: // Lifestyle
        return formData.dataProcessingConsent;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (activeStep === 4) {
      // Start processing
      setIsProcessing(true);
      // Simulate AI processing for 3 seconds
      setTimeout(() => {
        setIsProcessing(false);
        setActiveStep(prev => prev + 1);
      }, 3000);
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const calculateCompletionPercentage = () => {
    return ((activeStep + 1) / steps.length) * 100;
  };

  // Show enhanced loading screen while loading user data
  if (isLoadingUserData) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="loading-logo">
            <div className="logo-background">
              <Shield className="shield-icon" />
            </div>
            <div className="loading-ring"></div>
          </div>
          
          <div className="loading-content">
            <h2 className="loading-title">Loading VitalRiskShield</h2>
            <p className="loading-subtitle">Setting up your personalized health profile</p>
            
            <div className="progress-container">
              <div className="progress-bar-loading">
                <div className="progress-fill-animated"></div>
              </div>
              <span className="progress-text">Preparing your data...</span>
            </div>
            
            <div className="loading-features">
              <div className="feature-loading">
                <Activity className="feature-icon-small" />
                <span>Analyzing health metrics</span>
              </div>
              <div className="feature-loading">
                <TrendingUp className="feature-icon-small" />
                <span>Calculating risk factors</span>
              </div>
              <div className="feature-loading">
                <CheckCircle className="feature-icon-small" />
                <span>Personalizing recommendations</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="loading-footer">
          <p>Powered by AI • Secure & Encrypted • HIPAA Compliant</p>
        </div>
      </div>
    );
  }

  const renderWelcomeStep = () => (
    <div className="onboarding-card welcome-card">
      <div className="welcome-logo-container">
        <div className="logo-circle">
          <Shield className="logo-shield" />
        </div>
        <div className="logo-accent">
          <BarChart3 className="logo-chart" />
        </div>
      </div>
      
      <h1>Welcome to VitalRiskShield{formData.firstName ? `, ${formData.firstName}` : ''}!</h1>
      
      <div className="welcome-message">
        <p>
          Our AI-powered system will analyze your health data to provide 
          personalized risk forecasting and preventive care recommendations.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon health-icon">
            <Activity className="icon" />
          </div>
          <h4>Smart Analysis</h4>
          <p>AI analyzes patterns in your health data</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon activity-icon">
            <TrendingUp className="icon" />
          </div>
          <h4>Risk Forecasting</h4>
          <p>Predict health risks before they become serious</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon reward-icon">
            <CheckCircle className="icon" />
          </div>
          <h4>Vitality Rewards</h4>
          <p>Earn rewards for healthy choices</p>
        </div>
      </div>

      <div className="info-alert">
        <Info className="alert-icon" />
        This process takes about 5-7 minutes. Your data is encrypted and secure.
      </div>
    </div>
  );

  const renderPersonalInfoStep = () => (
    <div className="onboarding-card">
      <h2>Personal Information</h2>
      <p className="step-description">This helps us personalize your health insights</p>

      <div className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', Math.min(120, Math.max(1, parseInt(e.target.value) || '')))}
            min="1"
            max="120"
            placeholder="Your age"
            required
          />
          <small>Age in years (1-120)</small>
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderHealthProfileStep = () => (
    <div className="onboarding-card">
      <h2>Health Metrics</h2>
      <p className="step-description">This information helps our AI understand your current health status</p>

      <div className="form-grid">
        <div className="form-group">
          <label>Height (cm)</label>
          <input
            type="number"
            value={formData.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
            placeholder="Height in centimeters"
            required
          />
        </div>
        <div className="form-group">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="Weight in kilograms"
            required
          />
        </div>

        {formData.bmi > 0 && (
          <div className="bmi-display">
            <div className="info-alert">
              <strong>BMI: {formData.bmi}</strong> ({getBMICategory(formData.bmi)})
            </div>
          </div>
        )}

        <div className="form-group full-width">
          <label>Family History</label>
          <p className="field-description">Do you have a family history of hypertension (high blood pressure)?</p>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="yes"
                checked={formData.family_history === 'yes'}
                onChange={(e) => handleInputChange('family_history', e.target.value)}
              />
              <span>Yes</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="no"
                checked={formData.family_history === 'no'}
                onChange={(e) => handleInputChange('family_history', e.target.value)}
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Smoking Status</label>
          <p className="field-description">Do you currently use tobacco products?</p>
          <div className="radio-group">
            <label className="radio-label">
            <input
              type="radio"
              value="non-smoker"
              checked={formData.smoking_status === 'non-smoker'}
              onChange={(e) => handleInputChange('smoking_status', e.target.value)}
            />
            <span>Non-Smoker</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="smoker"
              checked={formData.smoking_status === 'smoker'}
              onChange={(e) => handleInputChange('smoking_status', e.target.value)}
            />
            <span>Smoker</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="former-smoker"
              checked={formData.smoking_status === 'former-smoker'}
              onChange={(e) => handleInputChange('smoking_status', e.target.value)}
            />
            <span>Former Smoker</span>
          </label>

          </div>
        </div>
      </div>

      <div className="security-notice">
        <Shield className="security-icon" />
        All health information is encrypted and only used for your personalized risk assessment
      </div>
    </div>
  );

  const renderLifestyleStep = () => (
    <div className="onboarding-card">
      <h2>Lifestyle Factors</h2>
      <p className="step-description">Your daily habits significantly impact your health risks</p>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Daily Salt Intake: {formData.salt_intake}g</label>
          <p className="field-description">Recommended: less than 5g/day</p>
          <input
            type="range"
            min="0"
            max="70"
            step="0.5"
            value={formData.salt_intake}
            onChange={(e) => handleInputChange('salt_intake', parseFloat(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>0g</span>
            <span>5g (Recommended)</span>
            <span>10g</span>
            <span>20g</span>
            <span>30g</span>
            <span>50g</span>
            <span>70g</span>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Stress Level: {formData.stress_score}/10</label>
          <p className="field-description">0 = No stress, 10 = Maximum stress</p>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.stress_score}
            onChange={(e) => handleInputChange('stress_score', parseInt(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>0 (No stress)</span>
            <span>5 (Moderate)</span>
            <span>10 (Maximum)</span>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Sleep Duration: {formData.sleep_duration}h</label>
          <p className="field-description">Average hours of sleep per night</p>
          <input
            type="range"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleep_duration}
            onChange={(e) => handleInputChange('sleep_duration', parseFloat(e.target.value))}
            className="slider"
          />
          <div className="slider-labels">
            <span>4h</span>
            <span>7h (Recommended)</span>
            <span>9h</span>
            <span>24h</span>
          </div>
        </div>
      </div>

      <div className="consent-section">
        <h3>Data Consent</h3>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.vitalityConsent}
            onChange={(e) => handleInputChange('vitalityConsent', e.target.checked)}
          />
          <span>Connect my Vitality data for enhanced health insights and rewards</span>
        </label>

        <label className="checkbox-label required">
          <input
            type="checkbox"
            checked={formData.dataProcessingConsent}
            onChange={(e) => handleInputChange('dataProcessingConsent', e.target.checked)}
          />
          <span>I consent to the processing of my health data for AI risk assessment (Required)</span>
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.healthScreeningReminders}
            onChange={(e) => handleInputChange('healthScreeningReminders', e.target.checked)}
          />
          <span>Send me personalized health screening reminders</span>
        </label>

        <button
          type="button"
          className="info-button"
          onClick={() => setShowDataDialog(true)}
        >
          <Info className="button-icon" />
          How is my data used?
        </button>
      </div>
    </div>
  );

  const renderAISetupStep = () => (
    <div className="onboarding-card processing-card">
      <h2>{isProcessing ? 'Building Your AI Health Profile' : 'Ready to Process'}</h2>
      <p className="step-description">
        {isProcessing 
          ? 'Our AI is analyzing your information to create your personalized health risk forecast...'
          : 'Click "Start Processing" to begin the AI analysis of your health data.'
        }
      </p>

      {isProcessing && (
        <div className="processing-bar">
          <div className="progress-fill"></div>
        </div>
      )}

      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon health-icon">
            <Activity className="icon" />
          </div>
          <h4>Data Processing</h4>
          <p>Analyzing your health profile against 50,000+ similar cases</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon activity-icon">
            <TrendingUp className="icon" />
          </div>
          <h4>Risk Modeling</h4>
          <p>Creating your personalized risk timeline for the next 5-10 years</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon reward-icon">
            <CheckCircle className="icon" />
          </div>
          <h4>Recommendations</h4>
          <p>Generating actionable health improvement suggestions</p>
        </div>
      </div>

      {!isProcessing && (
        <button
          className="auth-button processing-button"
          onClick={handleNext}
        >
          Start Processing
        </button>
      )}
    </div>
  );

  const renderCompleteStep = () => (
    <div className="onboarding-card welcome-card">
      <div className="success-icon">
        <CheckCircle className="check-icon" />
      </div>
      
      <h1>Welcome to Your Health Journey!</h1>
      
      <div className="welcome-message">
        <p>Your AI health profile is ready. Here's what happens next:</p>
      </div>

      <div className="completion-grid">
        <div className="completion-card">
          <h4>Immediate Insights</h4>
          <ul>
            <li>View your current health risk assessment</li>
            <li>See personalized recommendations</li>
            <li>Access your Vitality dashboard</li>
          </ul>
        </div>
        <div className="completion-card">
          <h4>Ongoing Monitoring</h4>
          <ul>
            <li>Weekly health insights via email</li>
            <li>Proactive screening reminders</li>
            <li>Updated risk forecasts as data evolves</li>
          </ul>
        </div>
      </div>

      <button
        className="auth-button complete-button"
        onClick={() => onComplete && onComplete(formData)}
      >
        Go to My Health Dashboard
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderWelcomeStep();
      case 1: return renderPersonalInfoStep();
      case 2: return renderHealthProfileStep();
      case 3: return renderLifestyleStep();
      case 4: return renderAISetupStep();
      case 5: return renderCompleteStep();
      default: return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-wrapper">
        {/* Progress Header */}
        <div className="progress-header">
          <div className="progress-info">
            <h3>Health Profile Setup</h3>
            <span className="progress-text">
              {Math.round(calculateCompletionPercentage())}% Complete
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculateCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {steps.map((step, index) => (
            <div 
              key={step.label} 
              className={`step ${index <= activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            >
              <div className="step-icon-container">
                {step.icon}
              </div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content-container">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        {activeStep < 5 && activeStep !== 4 && (
          <div className="navigation-buttons">
            <button
              className="nav-button back-button"
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="nav-button next-button"
              onClick={handleNext}
              disabled={!validateCurrentStep()}
            >
              Next
            </button>
          </div>
        )}

        {/* Data Usage Dialog */}
        {showDataDialog && (
          <div className="dialog-overlay" onClick={() => setShowDataDialog(false)}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
              <h3>How VitalRiskShield Uses Your Data</h3>
              <div className="dialog-body">
                <p><strong>Data Collection:</strong> We collect health information to provide personalized risk assessments and recommendations.</p>
                <p><strong>AI Processing:</strong> Our machine learning models analyze your data alongside anonymized population health trends.</p>
                <p><strong>Privacy:</strong> Your data is encrypted and never shared with third parties without consent.</p>
                <p><strong>Control:</strong> You can update, export, or delete your data at any time through your profile settings.</p>
              </div>
              <button className="dialog-close" onClick={() => setShowDataDialog(false)}>
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;