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
    return <div style={{ padding: '2rem', color: 'white' }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <UserProfile />

        <div style={{
          marginTop: '2rem',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1rem' }}>
            Welcome, {user.user_metadata?.user_name}! 🎉
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Your dashboard is ready. We'll add GitHub commits fetching next!
          </p>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>
              🚧 Coming Soon:
            </h3>
            <ul style={{ color: '#666', lineHeight: '2' }}>
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