import React, { useState, useEffect } from 'react';
import { Award, Gift, Zap, Star, CheckCircle, ChevronRight, Flame, Trophy, Shield, Heart } from 'lucide-react';
import { Progress, Badge, Modal } from 'antd';
import Nav from '../components/Nav';
import '../styles/RewardsProgram.css';

function RewardsProgram({ userData }) {
  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Simulate loading rewards data
    setTimeout(() => {
      if (userData) {
        const data = generateRewardsData(userData);
        setRewardsData(data);
        
        // Load streaks from localStorage
        const savedStreaks = JSON.parse(localStorage.getItem('healthStreaks')) || {
          current: 0,
          longest: 0
        };
        setCurrentStreak(savedStreaks.current);
        setLongestStreak(savedStreaks.longest);
        
        // Generate leaderboard data
        setLeaderboardData(generateLeaderboard());
      }
      setLoading(false);
    }, 1000);
  }, [userData]);

  const generateRewardsData = (userData) => {
    // Calculate points based on health metrics
    let points = userData.points || 0;
    
    // Add points based on healthy behaviors
    if (userData.bmi && userData.bmi <= 24.9) points += 100;
    if (userData.smoking_status === 'non-smoker') points += 150;
    if (userData.sleep_duration >= 7) points += 50;
    if (userData.salt_intake <= 5) points += 75;
    if (userData.stress_score <= 5) points += 50;
    
    // Determine level
    let level = 'Bronze';
    if (points >= 500) level = 'Silver';
    if (points >= 1000) level = 'Gold';
    if (points >= 2000) level = 'Platinum';
    
    // Calculate progress to next level
    let nextLevelPoints = 500;
    if (level === 'Silver') nextLevelPoints = 1000;
    if (level === 'Gold') nextLevelPoints = 2000;
    if (level === 'Platinum') nextLevelPoints = Infinity;
    
    const progress = level === 'Platinum' ? 100 : Math.floor((points / nextLevelPoints) * 100);
    
    return {
      points,
      level,
      progress,
      nextLevel: level === 'Bronze' ? 'Silver' : 
                 level === 'Silver' ? 'Gold' : 
                 level === 'Gold' ? 'Platinum' : null,
      nextLevelPoints: level === 'Platinum' ? null : nextLevelPoints,
      activities: [
        { id: 1, name: 'Healthy BMI', points: 100, date: new Date().toLocaleDateString(), icon: <CheckCircle /> },
        { id: 2, name: 'Non-smoker', points: 150, date: new Date().toLocaleDateString(), icon: <Zap /> },
        { id: 3, name: 'Good sleep habits', points: 50, date: new Date().toLocaleDateString(), icon: <Star /> },
        { id: 4, name: 'Low salt intake', points: 75, date: new Date().toLocaleDateString(), icon: <Award /> }
      ],
      rewards: [
        { id: 1, name: 'Fitness Tracker', points: 300, level: 'Bronze', icon: <Gift />, redeemed: false },
        { id: 2, name: 'Health Consultation', points: 500, level: 'Silver', icon: <Star />, redeemed: false },
        { id: 3, name: 'Premium Membership', points: 1000, level: 'Gold', icon: <Award />, redeemed: false },
        { id: 4, name: 'Wellness Retreat', points: 2000, level: 'Platinum', icon: <Zap />, redeemed: false }
      ],
      quests: [
        { id: 1, name: '7-Day Step Challenge', description: 'Walk 10,000 steps daily for 7 days', points: 200, difficulty: 'Medium', icon: <Flame />, completed: false },
        { id: 2, name: 'Sleep Warrior', description: 'Get 7+ hours of sleep for 5 nights', points: 150, difficulty: 'Easy', icon: <Star />, completed: false },
        { id: 3, name: 'Hydration Hero', description: 'Drink 2L of water daily for 3 days', points: 100, difficulty: 'Easy', icon: <Shield />, completed: false },
        { id: 4, name: 'Meditation Master', description: 'Meditate 10 mins daily for 5 days', points: 175, difficulty: 'Medium', icon: <Heart />, completed: false },
        { id: 5, name: 'Sugar Free Week', description: 'No added sugar for 7 days', points: 250, difficulty: 'Hard', icon: <Trophy />, completed: false }
      ]
    };
  };

  const generateLeaderboard = () => {
    return [
      { id: 1, name: 'You', points: rewardsData?.points || 0, level: rewardsData?.level || 'Bronze', riskReduction: '15%' },
      { id: 2, name: 'HealthMaster42', points: 1850, level: 'Gold', riskReduction: '32%' },
      { id: 3, name: 'FitLife', points: 1420, level: 'Silver', riskReduction: '28%' },
      { id: 4, name: 'WellnessPro', points: 2100, level: 'Platinum', riskReduction: '38%' },
      { id: 5, name: 'ActiveLiving', points: 920, level: 'Silver', riskReduction: '22%' }
    ].sort((a, b) => b.points - a.points);
  };

  const redeemReward = (rewardId) => {
    setRewardsData(prev => {
      const updatedRewards = prev.rewards.map(reward => 
        reward.id === rewardId ? { ...reward, redeemed: true } : reward
      );
      
      return {
        ...prev,
        rewards: updatedRewards,
        points: prev.points - prev.rewards.find(r => r.id === rewardId).points
      };
    });
  };

  const completeQuest = (questId) => {
    setRewardsData(prev => {
      const updatedQuests = prev.quests.map(quest => 
        quest.id === questId ? { ...quest, completed: true } : quest
      );
      
      const questPoints = prev.quests.find(q => q.id === questId).points;
      
      // Update streak
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
      }
      
      // Save to localStorage
      localStorage.setItem('healthStreaks', JSON.stringify({
        current: newStreak,
        longest: Math.max(newStreak, longestStreak)
      }));
      
      return {
        ...prev,
        quests: updatedQuests,
        points: prev.points + questPoints,
        activities: [
          ...prev.activities,
          {
            id: Date.now(),
            name: `Completed: ${prev.quests.find(q => q.id === questId).name}`,
            points: questPoints,
            date: new Date().toLocaleDateString(),
            icon: <CheckCircle />
          }
        ]
      };
    });
    
    setShowQuestModal(false);
  };

  const openQuestModal = (quest) => {
    setSelectedQuest(quest);
    setShowQuestModal(true);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
      default: return '#f39c12';
    }
  };

  return (
    <div className="page-container">
      <Nav />
      
      <div className="rewards-container">
        <h1 className="page-title">
          <Award className="title-icon" />
          Vitality Rewards Program
        </h1>
        
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Loading your rewards data...</p>
          </div>
        ) : rewardsData ? (
          <>
            <div className="gamification-header">
              <div className="streak-counter">
                <Badge count={currentStreak} showZero>
                  <span className="streak-label">Current Streak <Flame color="#f39c12" /></span>
                </Badge>
                <Badge count={longestStreak}>
                  <span className="streak-label">Longest Streak <Trophy color="#f39c12" /></span>
                </Badge>
              </div>
              
              <div className="points-summary">
                <div className="points-card">
                  <div className="points-value">{rewardsData.points}</div>
                  <div className="points-label">Total Points</div>
                </div>
                
                <div className="level-card">
                  <div 
                    className="level-badge" 
                    style={{ background: getLevelColor(rewardsData.level) }}
                  >
                    {rewardsData.level}
                  </div>
                  <div className="level-progress">
                    <Progress
                      percent={rewardsData.progress}
                      strokeColor={{
                        '0%': '#f39c12',
                        '100%': '#e67e22',
                      }}
                      showInfo={false}
                    />
                    {rewardsData.nextLevel && (
                      <div className="level-text">
                        {rewardsData.progress}% to {rewardsData.nextLevel} ({rewardsData.nextLevelPoints - rewardsData.points} points needed)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="quests-section">
              <h2>Vitality Quests</h2>
              <p className="section-description">Complete challenges to earn bonus points and rewards</p>
              
              <div className="quests-grid">
                {rewardsData.quests.map(quest => (
                  <div 
                    key={quest.id} 
                    className={`quest-card ${quest.completed ? 'completed' : ''}`}
                    onClick={() => !quest.completed && openQuestModal(quest)}
                  >
                    <div className="quest-icon">{quest.icon}</div>
                    <div className="quest-details">
                      <h3>{quest.name}</h3>
                      <div className="quest-meta">
                        <span className={`difficulty ${quest.difficulty.toLowerCase()}`}>
                          {quest.difficulty}
                        </span>
                        <span className="points">+{quest.points} pts</span>
                      </div>
                      <p>{quest.description}</p>
                    </div>
                    <div className="quest-status">
                      {quest.completed ? (
                        <CheckCircle color="#2ecc71" />
                      ) : (
                        <ChevronRight />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="rewards-section">
              <h2>Available Rewards</h2>
              
              <div className="rewards-grid">
                {rewardsData.rewards
                  .filter(reward => reward.level === rewardsData.level || 
                                  (rewardsData.level === 'Silver' && reward.level === 'Bronze') ||
                                  (rewardsData.level === 'Gold' && (reward.level === 'Bronze' || reward.level === 'Silver')) ||
                                  (rewardsData.level === 'Platinum'))
                  .map(reward => (
                    <div key={reward.id} className={`reward-card ${reward.redeemed ? 'redeemed' : ''}`}>
                      <div className="reward-icon">{reward.icon}</div>
                      <div className="reward-details">
                        <h3>{reward.name}</h3>
                        <p>{reward.points} points</p>
                        <small>{reward.level} level</small>
                        <button 
                          className={`redeem-button ${reward.redeemed ? 'redeemed' : ''}`}
                          onClick={() => !reward.redeemed && rewardsData.points >= reward.points && redeemReward(reward.id)}
                          disabled={reward.redeemed || rewardsData.points < reward.points}
                        >
                          {reward.redeemed ? 'Redeemed' : 'Redeem'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="leaderboard-section">
              <h2>Risk Reduction Leaderboard</h2>
              <p className="section-description">See how you compare to others in improving health</p>
              
              <div className="leaderboard">
                {leaderboardData.map((user, index) => (
                  <div key={user.id} className={`leaderboard-item ${user.name === 'You' ? 'you' : ''}`}>
                    <div className="rank">{index + 1}</div>
                    <div className="user-info">
                      <span className="name">{user.name}</span>
                      <span className="level" style={{ color: getLevelColor(user.level) }}>
                        {user.level}
                      </span>
                    </div>
                    <div className="points">{user.points} pts</div>
                    <div className="risk-reduction">
                      <span className="reduction-value">{user.riskReduction}</span>
                      <span className="reduction-label">risk reduction</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="activities-section">
              <h2>Recent Activities</h2>
              
              <div className="activities-list">
                {rewardsData.activities.map(activity => (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-details">
                      <h3>{activity.name}</h3>
                      <p>+{activity.points} points</p>
                      <small>{activity.date}</small>
                    </div>
                    <div className="activity-action">
                      <ChevronRight />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="error-section">
            <p>Unable to load your rewards data. Please try again later.</p>
          </div>
        )}
      </div>
      
      <Modal
        title={selectedQuest?.name}
        visible={showQuestModal}
        onOk={() => completeQuest(selectedQuest?.id)}
        onCancel={() => setShowQuestModal(false)}
        okText="Complete Quest"
        cancelText="Not Now"
      >
        {selectedQuest && (
          <div className="quest-modal-content">
            <div className="quest-icon-large">{selectedQuest.icon}</div>
            <p>{selectedQuest.description}</p>
            <div className="quest-reward">
              <span className="reward-label">Reward:</span>
              <span className="reward-value">+{selectedQuest.points} points</span>
            </div>
            <div className="quest-difficulty">
              <span className="difficulty-label">Difficulty:</span>
              <span className={`difficulty-value ${selectedQuest.difficulty.toLowerCase()}`}>
                {selectedQuest.difficulty}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default RewardsProgram;