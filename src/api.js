const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    throw new ApiError(data?.message || 'Something went wrong', res.status, data?.fieldErrors);
  }
  return data;
}

export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors || {};
  }
}

export const api = {
  register: (body) => request('/register', { method: 'POST', body }),
  login: (body) => request('/login', { method: 'POST', body }),
  logout: (token) => request('/logout', { method: 'POST', token }),
  forgotPassword: (identifier) => request('/forgot-password', { method: 'POST', body: { identifier } }),
  verifyOtp: (identifier, otp) => request('/verify-otp', { method: 'POST', body: { identifier, otp } }),
  resetPassword: (body) => request('/reset-password', { method: 'POST', body }),
  changePassword: (body, token) => request('/change-password', { method: 'PUT', body, token }),
  me: (token) => request('/me', { token }),
};
