// // Admin Login Functionality
// ================================
// Admin Login Functionality
// ================================

document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the admin login page
    const isLoginPage = window.location.pathname.includes('admin-login.html');
    if (!isLoginPage) return;

    // Firebase authentication state observer
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Redirect authenticated users to admin dashboard
            window.location.href = 'admin.html';
        } else {
            // Initialize login form
            initLoginForm();
        }
    });
});

// ================================
// Initialize Login Form
// ================================
function initLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    if (!loginForm) return;

    // Clear errors while typing
    ['email', 'password'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                loginError.textContent = '';
            });
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Basic validation
        if (!email || !password) {
            loginError.textContent = 'Please enter both email and password.';
            return;
        }
        if (!email.includes('@')) {
            loginError.textContent = 'Please enter a valid email address.';
            return;
        }

        // Clear old messages
        loginError.textContent = '';

        // Attempt Firebase sign in
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // Redirect on successful login
                window.location.href = 'admin.html';
            })
            .catch((error) => {
                let friendlyMessage;

                // Firebase Web SDK gives error.code
                // REST API sometimes gives error.message
                const code = error.code || error.message || error.error?.message;

                switch (code) {
                    case 'auth/invalid-email':
                        friendlyMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/too-many-requests':
                        friendlyMessage = 'Too many failed attempts. Try again later.';
                        break;
                    case 'auth/user-disabled':
                        friendlyMessage = 'This account has been disabled. Contact support.';
                        break;
                    case 'auth/operation-not-allowed':
                        friendlyMessage = 'Email/password sign-in is not enabled.';
                        break;
                    case 'INVALID_LOGIN_CREDENTIALS': // REST API response
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        friendlyMessage = 'Invalid email or password. Please try again.';
                        break;
                    default:
                        friendlyMessage = 'Wrong credentials. Please try again.';
                }

                // Show inside your error container
                loginError.textContent = friendlyMessage;
                loginError.style.color = 'red';
            });
    });
}

