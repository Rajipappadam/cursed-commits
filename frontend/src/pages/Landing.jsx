import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginButton from '../components/auth/LoginButton';

export default function Landing() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="app loading">Loading...</div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎮 Cursed Commits</h1>

        <p className="subtitle">Turn your GitHub contribution graph into a horror survival game!</p>

        <div className="glass-card">
          <h2 className="card-title">How It Works</h2>
          <div className="how-grid">
            <div className="how-item">
              <div className="how-number">1️⃣</div>
              <div>
                <strong>Connect GitHub</strong>
                <p className="how-desc">Login with your GitHub account</p>
              </div>
            </div>
            <div className="how-item">
              <div className="how-number">2️⃣</div>
              <div>
                <strong>Generate Level</strong>
                <p className="how-desc">Your commits become safe zones</p>
              </div>
            </div>
            <div className="how-item">
              <div className="how-number">3️⃣</div>
              <div>
                <strong>Survive!</strong>
                <p className="how-desc">Avoid monsters in gaps</p>
              </div>
            </div>
            <div className="how-item">
              <div className="how-number">4️⃣</div>
              <div>
                <strong>Compete</strong>
                <p className="how-desc">Top the leaderboard!</p>
              </div>
            </div>
          </div>
        </div>

        <LoginButton />

        <div className="note">Built for Halloween Hacks 2024 🎃</div>
      </div>
    </div>
  );
}