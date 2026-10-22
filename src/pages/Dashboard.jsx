import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Card from '../components/Card.jsx';

export default function Dashboard() {
  const { token, logout, clearSession } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.me(token)
      .then((u) => !cancelled && setUser(u))
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) {
          clearSession();               // token expired or session ended
          navigate('/login', { replace: true });
        } else {
          setError(err.message);
        }
      });
    return () => { cancelled = true; };
  }, [token, clearSession, navigate]);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Card title={user ? `Hello, ${user.fullName}` : 'Your account'} subtitle="This page is only visible when logged in">
      {error && <div className="alert alert-error">{error}</div>}
      {user && (
        <dl className="profile">
          <dt>Email</dt><dd>{user.email}</dd>
          <dt>Mobile</dt><dd>{user.mobileNumber}</dd>
          <dt>Member since</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
        </dl>
      )}
      <Link className="btn btn-secondary" to="/change-password">Change password</Link>
      <button className="btn btn-danger" onClick={onLogout}>Log out</button>
    </Card>
  );
}
