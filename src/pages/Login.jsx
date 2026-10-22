import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Card from '../components/Card.jsx';
import Field from '../components/Field.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Enter your email or mobile number and your password');
      return;
    }
    setLoading(true);
    try {
      await login(identifier.trim(), password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Welcome back"
      subtitle="Log in with your email or mobile number"
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      {location.state?.message && <div className="alert alert-success">{location.state.message}</div>}
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="alert alert-error">{error}</div>}
        <Field label="Email or mobile number" name="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
        <Field label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <div className="right"><Link to="/forgot-password">Forgot password?</Link></div>
        <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
    </Card>
  );
}
