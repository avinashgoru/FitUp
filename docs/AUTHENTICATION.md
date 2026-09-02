# FITUP Authentication Architecture

## 1. Overview

FITUP utilizes a database-backed, session-based authentication strategy. This architecture is designed to avoid the security pitfalls of stateless JWTs stored in `localStorage` by persisting sessions in the backend and delivering opaque tokens securely via HttpOnly cookies.

## 2. Token Security

- **Token Format:** Cryptographically secure 32-byte opaque random tokens.
- **Storage Strategy (Server):** Tokens are hashed with SHA-256 before being stored in the database. This prevents a database leak from resulting in a session compromise.
- **Delivery Strategy:** Tokens are sent directly to the browser via `Set-Cookie`.
- **Cookie Security:** Cookies are flagged as `HttpOnly`, `Secure` (in production), and `SameSite` (Lax or None based on CORS boundaries) preventing cross-site scripting (XSS) from reading them.

## 3. Password Hashing

We use **Argon2id**, the winner of the Password Hashing Competition, to securely hash user passwords. This configuration provides strong protection against GPU-based cracking attempts.

## 4. Frontend Integration

The frontend utilizes a `fetch` wrapper in `js/services/api.js` configured with `credentials: 'include'` to automatically append the session cookie to API requests.
State management (`js/app/app-state.js`) provides an `isAuthenticated` flag which dictates whether the user is viewing the public marketing shell, the authentication shell (`#/login`, `#/signup`), or the protected application shell (`#/app`).

## 5. Middleware and Authorization

`auth.middleware.js` performs the following on every protected route:

1. Reads `req.cookies.session`.
2. Hashes the raw token.
3. Looks up the hash in the `Session` table.
4. Verifies the session has not expired or been revoked.
5. Injects `req.user` for downstream controllers.

## 6. Endpoints

- `POST /api/v1/auth/register`: Validates input, checks for duplicates, hashes password, creates User and Profile, assigns session.
- `POST /api/v1/auth/login`: Verifies credentials, assigns session.
- `POST /api/v1/auth/logout`: Revokes the session in the DB and clears the cookie.
- `GET /api/v1/auth/me`: Validates session existence and returns basic user data.

## 7. Deferred Features

- Password reset workflows.
- Email verification.
- OAuth (Google/Apple) logins.
- Admin portal APIs (Phase 15).
