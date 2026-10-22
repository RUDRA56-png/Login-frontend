import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Card from '../components/Card.jsx';
import Field from '../components/Field.jsx';
import { PASSWORD_HINT, validatePassword } from '../validation.js';

// Three steps: 1) enter email/mobile  2) enter OTP  3) choose new password
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
      setErrors(err.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return setError('Enter your registered email or mobile number');
    run(async () => {
      await api.forgotPassword(identifier.trim());
      setStep(2);
      setMessage('If the account exists, an OTP has been sent.');
    });
  };

  const verify = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit OTP');
    run(async () => {
      const res = await api.verifyOtp(identifier.trim(), otp);
      setResetToken(res.resetToken);
      setStep(3);
    });
  };

  const reset = (e) => {
    e.preventDefault();
    const found = validatePassword(password, confirmPassword, 'newPassword');
    setErrors(found);
    if (Object.keys(found).length) return;
    run(async () => {
      await api.resetPassword({ resetToken, newPassword: password, confirmPassword });
      navigate('/login', { state: { message: 'Password reset successful. Please log in.' } });
    });
  };

  return (
    <Card
      title="Reset your password"
      subtitle={['', 'Step 1 of 3 - Find your account', 'Step 2 of 3 - Verify OTP', 'Step 3 of 3 - New password'][step]}
      footer={<Link to="/login">Back to login</Link>}
    >
      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {step === 1 && (
        <form onSubmit={sendOtp} noValidate>
          <Field label="Email or mobile number" name="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <button className="btn" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verify} noValidate>
          <Field label="6-digit OTP" name="otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
          <button className="btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          <button type="button" className="btn btn-link" onClick={() => { setStep(1); setOtp(''); setError(''); }}>
            Use a different account / resend
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={reset} noValidate>
          <Field label="New password" name="newPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.newPassword} hint={PASSWORD_HINT} autoComplete="new-password" />
          <Field label="Confirm new password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} autoComplete="new-password" />
          <button className="btn" disabled={loading}>{loading ? 'Saving...' : 'Reset password'}</button>
        </form>
      )}
    </Card>
  );
}
