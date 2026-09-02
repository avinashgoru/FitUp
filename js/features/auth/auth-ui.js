import { authService } from '../../services/auth.js';

export function renderLogin() {
    const loginView = document.getElementById('login-view');
    loginView.innerHTML = `
        <div class="auth-form-container">
            <h2 class="auth-title">Welcome Back</h2>
            <p class="auth-subtitle">Sign in to continue to FitUp.</p>
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" name="email" autocomplete="email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" name="password" autocomplete="current-password" required>
                </div>
                <div id="login-error" class="auth-error" aria-live="polite"></div>
                <button type="submit" class="btn btn-primary btn-full" id="login-submit">Sign In</button>
            </form>
            <p class="auth-footer">Don't have an account? <a href="#/signup" class="auth-link">Create one</a></p>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');
        const submitBtn = document.getElementById('login-submit');

        errorEl.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
            await authService.login(email, password);
            // Router handles redirect via app-state hydration inside authService
        } catch (err) {
            errorEl.textContent = err.message || 'An error occurred';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}

export function renderSignup() {
    const signupView = document.getElementById('signup-view');
    signupView.innerHTML = `
        <div class="auth-form-container">
            <h2 class="auth-title">Create Account</h2>
            <p class="auth-subtitle">Join FitUp to unlock your potential.</p>
            <form id="signup-form" class="auth-form">
                <div class="form-group">
                    <label for="signup-email">Email</label>
                    <input type="email" id="signup-email" name="email" autocomplete="email" required>
                </div>
                <div class="form-group">
                    <label for="signup-display">Display Name (Optional)</label>
                    <input type="text" id="signup-display" name="displayName" autocomplete="name">
                </div>
                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" name="password" autocomplete="new-password" minlength="10" required>
                    <span class="form-hint">Minimum 10 characters</span>
                </div>
                <div class="form-group">
                    <label for="signup-confirm">Confirm Password</label>
                    <input type="password" id="signup-confirm" name="confirmPassword" autocomplete="new-password" required>
                </div>
                <div id="signup-error" class="auth-error" aria-live="polite"></div>
                <button type="submit" class="btn btn-primary btn-full" id="signup-submit">Create Account</button>
            </form>
            <p class="auth-footer">Already have an account? <a href="#/login" class="auth-link">Sign in</a></p>
        </div>
    `;

    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const displayName = document.getElementById('signup-display').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        const errorEl = document.getElementById('signup-error');
        const submitBtn = document.getElementById('signup-submit');

        errorEl.textContent = '';
        
        if (password !== confirm) {
            errorEl.textContent = 'Passwords do not match.';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';

        try {
            await authService.register(email, password, displayName);
            // Router handles redirect via app-state hydration inside authService
        } catch (err) {
            errorEl.textContent = err.message || 'An error occurred';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}
