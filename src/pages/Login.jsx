import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle } from "../firebase.js";
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../styles/Auth.css';
import vitalRiskShieldLogo from '../assets/vitalriskshield-logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
      // After login, you can redirect or show success message
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
      // After login, you can redirect or show success message
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      {/* Welcome Section (Left Side) - Now with dashboard content */}
      <div className="welcome-section">
        <img src={vitalRiskShieldLogo} alt="VitalRiskShield Logo" className="welcome-logo" />
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

      {/* Login Form Section (Right Side) */}
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        
        <div className="auth-divider">OR</div>
        
        <button 
          onClick={handleGoogleSignIn}
          className="google-auth-button"
        >
          <img 
            src="https://images.seeklogo.com/logo-png/27/1/google-logo-png_seeklogo-273191.png" 
            alt="Google logo" 
            className="google-logo"
          />
          Continue with Google
        </button>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
