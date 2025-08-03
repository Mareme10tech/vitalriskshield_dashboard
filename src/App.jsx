import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OnboardingFlow from './pages/OnBoardingFlow';
import DashboardWelcome from './pages/DashboardWelcome';
import ChronicRisk from './pages/ChronicRisk';
import Lifestyle from './pages/Lifestyle';
import RewardsProgram from './pages/RewardsProgram';
import Resources from './components/Resources';
import Profile from './pages/Profile';
import { Shield } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        setCheckingOnboarding(true);
        
        // Check localStorage first for immediate response
        const cachedOnboardingStatus = localStorage.getItem(`onboarding_${currentUser.uid}`);
        if (cachedOnboardingStatus === 'true') {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          
          setHasCompletedOnboarding(true);
          setCheckingOnboarding(false);
          setLoading(false);
          return;
        }
        
        // If not in cache, check Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const onboardingCompleted = userData.onboardingCompleted || false;
            setHasCompletedOnboarding(onboardingCompleted);
            setUserData(userData);
            
            // Cache the result in localStorage for future quick access
            localStorage.setItem(`onboarding_${currentUser.uid}`, onboardingCompleted.toString());
          } else {
            setHasCompletedOnboarding(false);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setHasCompletedOnboarding(false);
        }
        
        setCheckingOnboarding(false);
      } else {
        setHasCompletedOnboarding(false);
        setCheckingOnboarding(false);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = async (onboardingData) => {
    if (user) {
      try {
        // Save onboarding data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          ...onboardingData,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          points: 0, // Initialize rewards points
          level: 'Bronze', // Initial level
          rewards: [] // Empty rewards array
        });
        
        // Update local state and cache
        setHasCompletedOnboarding(true);
        setUserData({
          ...onboardingData,
          onboardingCompleted: true,
          points: 0,
          level: 'Bronze'
        });
        localStorage.setItem(`onboarding_${user.uid}`, 'true');
      } catch (error) {
        console.error("Error saving onboarding data:", error);
      }
    }
  };

  // Show loading spinner while checking auth state OR onboarding status
  if (loading || checkingOnboarding) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <Shield className="spinner-icon" />
          <div className="loading-text">
            {loading ? "Loading VitalRiskShield..." : "Checking your profile..."}
          </div>
        </div>
      </div>
    );
  }

  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // If user hasn't completed onboarding, redirect to onboarding
    if (!hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }

    return element;
  };

  // Onboarding Route Component
  const OnboardingRoute = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // If already completed onboarding, go to dashboard
    if (hasCompletedOnboarding) {
      return <Navigate to="/dashboard" replace />;
    }

    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  };

  // Auth Route Component (for login/signup)
  const AuthRoute = ({ element }) => {
    if (user) {
      // If logged in but no onboarding, go to onboarding
      if (!hasCompletedOnboarding) {
        return <Navigate to="/onboarding" replace />;
      }
      // If logged in and onboarding complete, go to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Authentication routes */}
        <Route 
          path="/login" 
          element={<AuthRoute element={<Login />} />}
        />
        
        <Route 
          path="/signup" 
          element={<AuthRoute element={<Signup />} />}
        />

        {/* Onboarding route */}
        <Route 
          path="/onboarding" 
          element={<OnboardingRoute />}
        />

        {/* Protected dashboard route */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<DashboardWelcome />} />}
        />

        {/* Chronic Risk */}
        <Route 
          path="/chronic-risk" 
          element={<ProtectedRoute element={<ChronicRisk userData={userData} />} />}
        />

        {/* Lifestyle */}
        <Route 
          path="/lifestyle" 
          element={<ProtectedRoute element={<Lifestyle userData={userData} />} />}
        />

        {/* Rewards Program */}
        <Route 
          path="/rewards-program"
          element={<ProtectedRoute element={<RewardsProgram userData={userData} />} />}
        />

        {/* Profile */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute element={<Profile userData={userData} />} />}
        />
        <Route
          path='/resource'
          element={<ProtectedRoute element={<Resources/>}/>}
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;