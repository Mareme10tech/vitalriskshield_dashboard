import React, { useState, useEffect } from 'react';
import { User, Shield, Mail, Phone, Ruler, Scale, Award, ChevronRight, Smartphone, Activity, Wifi, WifiOff, RefreshCw, Calendar, TrendingUp, Plus, X } from 'lucide-react';
import Nav from '../components/Nav';
import '../styles/Profile.css';

function Profile({ userData }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [syncingDevices, setSyncingDevices] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)); // 2 days ago
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [showDeviceSelection, setShowDeviceSelection] = useState(false);
  
  // Available devices that users can choose from
  const availableDevices = [
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      description: 'Track steps, sleep, heart rate, and health metrics',
      icon: 'Smartphone',
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Weight', 'Stress']
    },
    {
      id: 'vitality',
      name: 'Vitality Connect',
      description: 'Activity tracking and health metrics monitoring',
      icon: 'Activity',
      dataTypes: ['Activity', 'Sleep', 'Health Metrics']
    },
    {
      id: 'apple_health',
      name: 'Apple Health',
      description: 'Comprehensive health and fitness tracking',
      icon: 'Smartphone',
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Workouts', 'Nutrition']
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Activity, sleep, and health monitoring',
      icon: 'Activity',
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Exercise', 'Weight']
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      description: 'Advanced fitness and health tracking',
      icon: 'Activity',
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'GPS', 'Performance']
    }
  ];

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        age: userData.age || '',
        height: userData.height || '',
        weight: userData.weight || '',
        salt_intake: userData.salt_intake || 5.0,
        stress_score: userData.stress_score || 5,
        sleep_duration: userData.sleep_duration || 7.0,
        family_history: userData.family_history || 'no',
        smoking_status: userData.smoking_status || 'non-smoker',
        // New health device synced data
        daily_steps: userData.daily_steps || 8500,
        resting_heart_rate: userData.resting_heart_rate || 68,
        sleep_quality: userData.sleep_quality || 85
      });
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you would save to your backend here
      // await updateUserProfile(formData);
      setTimeout(() => {
        setSaving(false);
        setEditing(false);
      }, 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaving(false);
    }
  };

  const addDevice = (deviceInfo) => {
    const newDevice = {
      ...deviceInfo,
      connected: false,
      lastSync: null,
      addedAt: new Date(),
      hasEverSynced: false // Track if device has ever been synced
    };
    setConnectedDevices(prev => [...prev, newDevice]);
    setShowDeviceSelection(false);
  };

  const removeDevice = (deviceId) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  // Auto-sync effect - runs daily for connected devices
  useEffect(() => {
    if (connectedDevices.length === 0 || !autoSyncEnabled) return;

    const checkAndAutoSync = () => {
      const now = new Date();
      const lastSyncTime = lastSyncDate.getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      // Check if it's been more than 24 hours since last sync
      if (now.getTime() - lastSyncTime >= oneDayInMs) {
        // Auto-sync all connected devices
        const connectedDeviceIds = connectedDevices
          .filter(device => device.connected)
          .map(device => device.id);
        
        if (connectedDeviceIds.length > 0) {
          console.log('Auto-syncing devices:', connectedDeviceIds);
          performAutoSync(connectedDeviceIds);
        }
      }
    };

    // Check immediately on mount/device changes
    checkAndAutoSync();

    // Set up interval to check every hour
    const interval = setInterval(checkAndAutoSync, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(interval);
  }, [connectedDevices, lastSyncDate, autoSyncEnabled]);

  const performAutoSync = async (deviceIds) => {
    console.log('Performing automatic sync for devices:', deviceIds);
    
    // Simulate auto-sync (in real app, this would be a background process)
    const mockHealthData = {
      weight: (65 + Math.random() * 10).toFixed(1),
      sleep_duration: (6.5 + Math.random() * 2).toFixed(1),
      stress_score: Math.floor(Math.random() * 5) + 3,
      daily_steps: Math.floor(8000 + Math.random() * 4000),
      resting_heart_rate: Math.floor(60 + Math.random() * 20),
      sleep_quality: Math.floor(75 + Math.random() * 20)
    };

    // Update form data with new health data
    setFormData(prev => ({ ...prev, ...mockHealthData }));
    
    // Update all connected devices' last sync time and hasEverSynced flag
    setConnectedDevices(prev => prev.map(device => 
      deviceIds.includes(device.id) && device.connected
        ? { ...device, lastSync: new Date(), hasEverSynced: true }
        : device
    ));
    
    setLastSyncDate(new Date());
    
    // In a real app, you would save to backend here
    console.log('Auto-synced health data:', mockHealthData);
  };

  const handleManualSync = async (deviceId) => {
    setSyncingDevices(true);
    
    // Simulate manual sync API call
    setTimeout(() => {
      const mockHealthData = {
        weight: (65 + Math.random() * 10).toFixed(1),
        sleep_duration: (6.5 + Math.random() * 2).toFixed(1),
        stress_score: Math.floor(Math.random() * 5) + 3,
        daily_steps: Math.floor(8000 + Math.random() * 4000),
        resting_heart_rate: Math.floor(60 + Math.random() * 20),
        sleep_quality: Math.floor(75 + Math.random() * 20)
      };

      // Update form data with new health data
      setFormData(prev => ({ ...prev, ...mockHealthData }));
      
      // Update device sync status and mark as having been synced
      setConnectedDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, lastSync: new Date(), connected: true, hasEverSynced: true }
          : device
      ));
      
      setLastSyncDate(new Date());
      setSyncingDevices(false);
      
      console.log('Manual sync completed for device:', deviceId, mockHealthData);
    }, 2000);
  };

  const handleDeviceConnection = (deviceId) => {
    setConnectedDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            connected: true,
            lastSync: null, // First connection, no sync yet
            hasEverSynced: false // Reset sync status on connection
          }
        : device
    ));
    
    // Immediately trigger first sync after connection
    setTimeout(() => {
      handleManualSync(deviceId);
    }, 500);
  };

  const handleDeviceDisconnection = (deviceId) => {
    setConnectedDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            connected: false,
            lastSync: null,
            hasEverSynced: false // Reset sync status on disconnection
          }
        : device
    ));
  };

  // Helper function to determine if manual sync should be disabled
  const shouldDisableManualSync = (device) => {
    return autoSyncEnabled && device.hasEverSynced && device.connected;
  };

  const isDailySync = () => {
    if (connectedDevices.length === 0) return false;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return lastSyncDate < oneDayAgo;
  };

  const getNextAutoSync = () => {
    if (!lastSyncDate) return 'Soon';
    const nextSync = new Date(lastSyncDate.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (nextSync <= now) return 'Now';
    
    const hoursUntil = Math.ceil((nextSync - now) / (1000 * 60 * 60));
    if (hoursUntil === 1) return 'In 1 hour';
    if (hoursUntil < 24) return `In ${hoursUntil} hours`;
    
    return 'Tomorrow';
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    if (bmi >= 30) return 'Obese';
    return '';
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightNum = parseFloat(formData.weight);
      const bmi = weightNum / (heightInMeters * heightInMeters);
      return parseFloat(bmi.toFixed(1));
    }
    return 0;
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const bmi = calculateBMI();

  return (
    <div className="page-container">
      <Nav />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="page-title">
            <User className="title-icon" />
            My Profile
          </h1>
          
          {!editing ? (
            <button className="edit-button" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-button" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-content">
          <div className="personal-info-section">
            <h2>Personal Information</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <User />
                </div>
                <div className="info-content">
                  <label>Name</label>
                  {editing ? (
                    <div className="name-fields">
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                  ) : (
                    <p>{userData.firstName} {userData.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Mail />
                </div>
                <div className="info-content">
                  <label>Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Email"
                    />
                  ) : (
                    <p>{userData.email}</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Phone />
                </div>
                <div className="info-content">
                  <label>Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Phone"
                    />
                  ) : (
                    <p>{userData.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <User />
                </div>
                <div className="info-content">
                  <label>Age</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="120"
                    />
                  ) : (
                    <p>{userData.age} years</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* HEALTH DEVICES SECTION */}
          <div className="health-devices-section">
            <div className="section-header">
              <h2>Connected Health Devices</h2>
              {isDailySync() && connectedDevices.some(d => d.connected) && (
                <div className="sync-indicator">
                  <Calendar className="sync-icon" />
                  <span>Daily sync recommended</span>
                </div>
              )}
            </div>
            
            {connectedDevices.length === 0 ? (
              <div className="no-devices">
                <div className="no-devices-content">
                  <Smartphone className="no-devices-icon" />
                  <h3>No Health Devices Connected</h3>
                  <p>Connect your health devices to automatically sync your health data and get personalized insights.</p>
                  <button 
                    className="add-device-button"
                    onClick={() => setShowDeviceSelection(true)}
                  >
                    <Plus className="add-icon" />
                    Add Health Device
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="devices-grid">
                  {connectedDevices.map(device => {
                    const isManualSyncDisabled = shouldDisableManualSync(device);
                    
                    return (
                      <div key={device.id} className={`device-card ${device.connected ? 'connected' : 'disconnected'}`}>
                        <div className="device-header">
                          <div className="device-info">
                            <Smartphone className="device-icon" />
                            <div>
                              <h3>{device.name}</h3>
                              <div className="device-status">
                                {device.connected ? (
                                  <>
                                    <Wifi className="status-icon connected" />
                                    <span>Connected</span>
                                  </>
                                ) : (
                                  <>
                                    <WifiOff className="status-icon disconnected" />
                                    <span>Disconnected</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="device-actions">
                            {device.connected ? (
                              <>
                                <button 
                                  className={`sync-button ${isManualSyncDisabled ? 'disabled' : ''}`}
                                  onClick={() => !isManualSyncDisabled && handleManualSync(device.id)}
                                  disabled={syncingDevices || isManualSyncDisabled}
                                  title={isManualSyncDisabled ? 'Auto-sync is enabled - manual sync disabled' : 'Sync now'}
                                >
                                  <RefreshCw className={`sync-icon ${syncingDevices ? 'spinning' : ''}`} />
                                  {isManualSyncDisabled ? 'Auto-synced' : syncingDevices ? 'Syncing...' : 'Sync Now'}
                                </button>
                                <button 
                                  className="disconnect-button"
                                  onClick={() => handleDeviceDisconnection(device.id)}
                                  title="Disconnect device"
                                >
                                  <WifiOff className="disconnect-icon" />
                                </button>
                              </>
                            ) : (
                              <button 
                                className="connect-button"
                                onClick={() => handleDeviceConnection(device.id)}
                              >
                                <Wifi className="connect-icon" />
                                Connect
                              </button>
                            )}
                            <button 
                              className="remove-button"
                              onClick={() => removeDevice(device.id)}
                              title="Remove device"
                            >
                              <X className="remove-icon" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="device-details">
                          <div className="last-sync">
                            <strong>Last Sync:</strong> {formatLastSync(device.lastSync)}
                          </div>
                          <div className="data-types">
                            <strong>Data Types:</strong> {device.dataTypes.join(', ')}
                          </div>
                          {isManualSyncDisabled && (
                            <div className="auto-sync-note">
                              <Activity className="auto-sync-icon" />
                              <span>Automatic sync enabled</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="add-more-devices">
                  <button 
                    className="add-device-button secondary"
                    onClick={() => setShowDeviceSelection(true)}
                  >
                    <Plus className="add-icon" />
                    Add Another Device
                  </button>
                </div>
              </>
            )}

            {/* Device Selection Modal */}
            {showDeviceSelection && (
              <div className="device-selection-overlay">
                <div className="device-selection-modal">
                  <div className="modal-header">
                    <h3>Select Health Device</h3>
                    <button 
                      className="close-button"
                      onClick={() => setShowDeviceSelection(false)}
                    >
                      <X className="close-icon" />
                    </button>
                  </div>
                  
                  <div className="available-devices">
                    {availableDevices
                      .filter(device => !connectedDevices.find(connected => connected.id === device.id))
                      .map(device => (
                        <div key={device.id} className="available-device">
                          <div className="available-device-info">
                            {device.icon === 'Smartphone' ? (
                              <Smartphone className="available-device-icon" />
                            ) : (
                              <Activity className="available-device-icon" />
                            )}
                            <div>
                              <h4>{device.name}</h4>
                              <p>{device.description}</p>
                              <div className="available-data-types">
                                {device.dataTypes.join(', ')}
                              </div>
                            </div>
                          </div>
                          <button 
                            className="select-device-button"
                            onClick={() => addDevice(device)}
                          >
                            Select
                          </button>
                        </div>
                      ))
                    }
                    
                    {availableDevices.filter(device => !connectedDevices.find(connected => connected.id === device.id)).length === 0 && (
                      <div className="no-available-devices">
                        <p>All available devices have been added to your profile.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {connectedDevices.length > 0 && (
              <div className="sync-schedule">
                <div className="schedule-info">
                  <TrendingUp className="schedule-icon" />
                  <div>
                    <h4>Automatic Daily Sync</h4>
                    <p>
                      Your profile automatically updates with the latest health data every 24 hours. 
                      {connectedDevices.some(d => d.connected) && (
                        <span className="next-sync"> Next sync: {getNextAutoSync()}</span>
                      )}
                    </p>
                    <div className="auto-sync-toggle">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={autoSyncEnabled}
                          onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                          className="toggle-input"
                        />
                        <span className="toggle-slider"></span>
                        Enable automatic sync
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="health-info-section">
            <div className="section-header">
              <h2>Health Metrics</h2>
              {connectedDevices.some(d => d.connected) && (
                <div className="auto-updated-badge">
                  <Activity className="badge-icon" />
                  <span>Auto-updated from devices</span>
                </div>
              )}
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <Ruler />
                </div>
                <div className="info-content">
                  <label>Height</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="Height (cm)"
                    />
                  ) : (
                    <p>{userData.height} cm</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Scale />
                </div>
                <div className="info-content">
                  <label>Weight</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Weight (kg)"
                    />
                  ) : (
                    <p>{formData.weight} kg</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Shield />
                </div>
                <div className="info-content">
                  <label>BMI</label>
                  <p>
                    {bmi} ({getBMICategory(bmi)})
                  </p>
                </div>
              </div>

              {/* New device-synced metrics */}
              <div className="info-item">
                <div className="info-icon">
                  <Activity />
                </div>
                <div className="info-content">
                  <label>Daily Steps</label>
                  <p>{formData.daily_steps?.toLocaleString()} steps</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Activity />
                </div>
                <div className="info-content">
                  <label>Resting Heart Rate</label>
                  <p>{formData.resting_heart_rate} bpm</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Activity />
                </div>
                <div className="info-content">
                  <label>Sleep Quality</label>
                  <p>{formData.sleep_quality}%</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Award />
                </div>
                <div className="info-content">
                  <label>Smoking Status</label>
                  {editing ? (
                    <select
                      value={formData.smoking_status}
                      onChange={(e) => handleInputChange('smoking_status', e.target.value)}
                    >
                      <option value="non-smoker">Non-smoker</option>
                      <option value="former-smoker">Former smoker</option>
                      <option value="smoker">Current smoker</option>
                    </select>
                  ) : (
                    <p>
                      {userData.smoking_status === 'non-smoker' ? 'Non-smoker' : 
                       userData.smoking_status === 'former-smoker' ? 'Former smoker' : 'Current smoker'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lifestyle-section">
            <h2>Lifestyle Factors</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <Shield />
                </div>
                <div className="info-content">
                  <label>Family History of Hypertension</label>
                  {editing ? (
                    <select
                      value={formData.family_history}
                      onChange={(e) => handleInputChange('family_history', e.target.value)}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : (
                    <p>{userData.family_history === 'yes' ? 'Yes' : 'No'}</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Shield />
                </div>
                <div className="info-content">
                  <label>Daily Salt Intake</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.salt_intake}
                      onChange={(e) => handleInputChange('salt_intake', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="70"
                    />
                  ) : (
                    <p>{userData.salt_intake}g/day</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Shield />
                </div>
                <div className="info-content">
                  <label>Stress Level (1-10)</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.stress_score}
                      onChange={(e) => handleInputChange('stress_score', parseInt(e.target.value))}
                      min="0"
                      max="10"
                    />
                  ) : (
                    <p>{formData.stress_score}/10</p>
                  )}
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <Shield />
                </div>
                <div className="info-content">
                  <label>Sleep Duration</label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.sleep_duration}
                      onChange={(e) => handleInputChange('sleep_duration', parseFloat(e.target.value))}
                      step="0.5"
                      min="0"
                      max="24"
                    />
                  ) : (
                    <p>{formData.sleep_duration} hours/night</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="account-section">
            <h2>Account Settings</h2>
            
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-content">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </div>
                <div className="setting-action">
                  <ChevronRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;