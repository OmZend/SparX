// Admin Login Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin login page
    const isLoginPage = window.location.pathname.includes('admin-login.html');
    
    if (!isLoginPage) return;
    
    // Set up authentication state observer
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, redirect to admin dashboard
            window.location.href = 'admin.html';
        } else {
            // Initialize login form
            initLoginForm();
        }
    });
});

// Initialize Login Form
function initLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Clear previous error messages
            loginError.textContent = '';
            
            // Sign in with email and password
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    window.location.href = 'admin.html';
                })
                .catch((error) => {
                    // Handle errors
                    const errorMessage = error.message;
                    loginError.textContent = errorMessage;
                });
        });
    }
}