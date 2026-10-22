import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Card from '../components/Card.jsx';
import Field from '../components/Field.jsx';
import { PASSWORD_HINT, validateRegister } from '../validation.js';

const empty = { fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '' };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'mobileNumber' ? value.replace(/\D/g, '').slice(0, 10) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = validateRegister(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      await api.register({ ...form, fullName: form.fullName.trim(), email: form.email.trim() });
      navigate('/login', { state: { message: 'Account created. Please log in.' } });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Create your account"
      subtitle="Join us to start shopping"
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <Field label="Full name" name="fullName" value={form.fullName} onChange={onChange} error={errors.fullName} autoComplete="name" />
        <Field label="Email address" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <Field label="Mobile number" name="mobileNumber" inputMode="numeric" value={form.mobileNumber} onChange={onChange} error={errors.mobileNumber} hint="10 digits" autoComplete="tel" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} hint={PASSWORD_HINT} autoComplete="new-password" />
        <Field label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} error={errors.confirmPassword} autoComplete="new-password" />
        <button className="btn" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
      </form>
    </Card>
  );
}
