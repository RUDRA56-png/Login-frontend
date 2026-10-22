# Registration & Login - Frontend

React 18 + Vite + React Router. Talks to the Spring Boot backend (`registration-login-service-backend.zip`).

## Run
1. Start the backend first (`mvn spring-boot:run`, port 8080).
2. In this folder:
```bash
npm install
npm run dev
```
Open http://localhost:5173

In development, Vite forwards `/api/*` to `http://localhost:8080` (see `vite.config.js`), so no CORS setup is needed.

## Pages
| Route | Access | What it does |
|---|---|---|
| `/register` | public | Register with full name, email, mobile, password + confirm (client-side validation mirrors the backend rules) |
| `/login` | public | Log in with email **or** mobile |
| `/forgot-password` | public | 3 steps: send OTP -> verify OTP -> set new password |
| `/dashboard` | logged in | Shows profile from `GET /me`, logout |
| `/change-password` | logged in | Change password (needs current password) |

Logged-out users are redirected to `/login`. If the server reports the token invalid/expired (401), the app clears it and returns to login.

**Testing forgot-password:** the backend prints the OTP in its console (`[DEV ONLY] OTP for ... is 123456`).

## Production build
```bash
VITE_API_URL=https://your-backend.example.com npm run build   # output in dist/
```
Then add your frontend URL to the backend's `CORS_ALLOWED_ORIGINS` environment variable.

## Structure
```
src/
├── api.js              fetch wrapper + all API calls
├── AuthContext.jsx     token state (localStorage), login/logout
├── validation.js       form validation rules
├── components/         Card, Field, ProtectedRoute
└── pages/              Register, Login, ForgotPassword, Dashboard, ChangePassword
```

## Note on token storage
The JWT is kept in `localStorage` for simplicity. It is readable by any script on the page, so keep the app free of XSS; for higher-security apps use an httpOnly-cookie approach instead.
