// Mirrors the backend rules so users get instant feedback (the backend still re-validates everything).
export const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const MOBILE_RE = /^\d{10}$/;
export const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PASSWORD_HINT =
  'At least 8 characters with an uppercase letter, a lowercase letter, a digit and a special character.';

export function validatePassword(password, confirm, field = 'password') {
  const errors = {};
  if (!password) errors[field] = 'Password is required';
  else if (!PASSWORD_RE.test(password)) errors[field] = PASSWORD_HINT;
  if (!confirm) errors.confirmPassword = 'Confirm password is required';
  else if (password !== confirm) errors.confirmPassword = 'Passwords do not match';
  return errors;
}

export function validateRegister(f) {
  const errors = {};
  const name = f.fullName.trim();
  if (!name) errors.fullName = 'Full name is required';
  else if (name.length < 3 || name.length > 100) errors.fullName = 'Full name must be 3 to 100 characters';

  if (!f.email.trim()) errors.email = 'Email address is required';
  else if (!EMAIL_RE.test(f.email.trim())) errors.email = 'Enter a valid email address';

  if (!f.mobileNumber) errors.mobileNumber = 'Mobile number is required';
  else if (!MOBILE_RE.test(f.mobileNumber)) errors.mobileNumber = 'Mobile number must be exactly 10 digits';

  return { ...errors, ...validatePassword(f.password, f.confirmPassword) };
}
