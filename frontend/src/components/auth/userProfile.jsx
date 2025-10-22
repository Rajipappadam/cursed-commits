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
    <div className="user-profile">
      <img
        src={user.user_metadata?.avatar_url}
        alt={user.user_metadata?.user_name}
        className="avatar"
      />
      <div className="user-info">
        <div className="user-name">{user.user_metadata?.user_name || 'GitHub User'}</div>
        <div className="user-email">{user.email}</div>
      </div>
      <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
    </div>
  );
}