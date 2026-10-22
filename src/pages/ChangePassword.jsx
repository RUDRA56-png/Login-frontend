import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Card from '../components/Card.jsx';
import Field from '../components/Field.jsx';
import { PASSWORD_HINT, validatePassword } from '../validation.js';

export default function ChangePassword() {
  const { token, clearSession } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const found = validatePassword(form.newPassword, form.confirmPassword, 'newPassword');
    if (!form.currentPassword) found.currentPassword = 'Current password is required';
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await api.changePassword(form, token);
      setSuccess('Password changed. Other devices have been logged out.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      if (err.status === 401) {
        clearSession();
        navigate('/login', { replace: true });
        return;
      }
      setError(err.message);
      setErrors(err.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Change password" footer={<Link to="/dashboard">Back to account</Link>}>
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <Field label="Current password" name="currentPassword" type="password" value={form.currentPassword} onChange={onChange} error={errors.currentPassword} autoComplete="current-password" />
        <Field label="New password" name="newPassword" type="password" value={form.newPassword} onChange={onChange} error={errors.newPassword} hint={PASSWORD_HINT} autoComplete="new-password" />
        <Field label="Confirm new password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} autoComplete="new-password" />
        <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Update password'}</button>
      </form>
    </Card>
  );
}
