/**
 * auth.js — Handles login and registration logic.
 * Communicates with /api/auth/* endpoints.
 */

// Switch between Login and Register tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const msg = document.getElementById('authMessage');

    msg.className = 'auth-message'; // hide message
    msg.style.display = 'none';

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

// Show status message
function showMessage(text, type) {
    const msg = document.getElementById('authMessage');
    msg.textContent = text;
    msg.className = 'auth-message ' + type;
    msg.style.display = 'block';
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            showMessage('Login successful! Redirecting...', 'success');
            // Save user info in sessionStorage
            sessionStorage.setItem('userId', data.userId);
            sessionStorage.setItem('username', data.username);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (err) {
        showMessage('Connection error. Is the server running?', 'error');
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;

    if (password.length < 3) {
        showMessage('Password must be at least 3 characters', 'error');
        return;
    }

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });

        const data = await res.json();

        if (data.success) {
            showMessage('Account created! Signing in...', 'success');
            sessionStorage.setItem('userId', data.userId);
            sessionStorage.setItem('username', data.username);
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } else {
            showMessage(data.message || 'Registration failed', 'error');
        }
    } catch (err) {
        showMessage('Connection error. Is the server running?', 'error');
    }
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('userId')) {
        window.location.href = 'dashboard.html';
    }
});
