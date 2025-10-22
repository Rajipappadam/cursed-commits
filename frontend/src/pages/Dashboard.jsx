import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import UserProfile from '../components/auth/userProfile';

export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="loading-inline">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="app">
      <div className="dashboard-container">
        <UserProfile />

        <div className="status-card">
          <h2>Welcome, {user.user_metadata?.user_name}! 🎉</h2>
          <p className="muted">Your dashboard is ready. We'll add GitHub commits fetching next!</p>

          <div className="coming-soon">
            <h3>🚧 Coming Soon:</h3>
            <ul className="muted">
              <li>📊 View your GitHub commit graph</li>
              <li>🎮 Generate game level from commits</li>
              <li>👾 Play the game</li>
              <li>🏆 View leaderboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}