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
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '5rem',
          fontWeight: 'bold',
          margin: '0 0 1rem 0',
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)'
        }}>
          🎮 Cursed Commits
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          marginBottom: '3rem',
          opacity: 0.95
        }}>
          Turn your GitHub contribution graph into a horror survival game!
        </p>

        <div style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '3rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            How It Works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
            fontSize: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>1️⃣</div>
              <strong>Connect GitHub</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Login with your GitHub account
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>2️⃣</div>
              <strong>Generate Level</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Your commits become safe zones
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>3️⃣</div>
              <strong>Survive!</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Avoid monsters in gaps
              </p>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>4️⃣</div>
              <strong>Compete</strong>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Top the leaderboard!
              </p>
            </div>
          </div>
        </div>

        <LoginButton />

        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          opacity: 0.8
        }}>
          Built for Halloween Hacks 2024 🎃
        </div>
      </div>
    </div>
  );
}