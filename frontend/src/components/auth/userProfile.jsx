import { useAuthStore } from '../../store/authStore';

export default function UserProfile() {
  const { user, signOut } = useAuthStore();

  if (!user) return null;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      alert('Sign out failed: ' + error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '8px',
      color: 'white'
    }}>
      <img
        src={user.user_metadata?.avatar_url}
        alt={user.user_metadata?.user_name}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid white'
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {user.user_metadata?.user_name || 'GitHub User'}
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {user.email}
        </div>
      </div>
      <button
        onClick={handleSignOut}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
      >
        Sign Out
      </button>
    </div>
  );
}