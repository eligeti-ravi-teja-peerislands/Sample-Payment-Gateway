// Mock user data (replace with actual backend integration)
const users = [
    {
        email: 'admin@paygate.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        email: 'user@paygate.com',
        password: 'user123',
        role: 'user'
    }
];

// Utility functions
const showAlert = (message, type = 'error') => {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);

    // Clear alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
};

// Check if user is logged in
const checkAuth = () => {
    const user = localStorage.getItem('user');
    if (!user) {
        if (!window.location.pathname.includes('/pages/login.html') && 
            !window.location.pathname.includes('/pages/reset.html') && 
            !window.location.pathname.includes('/index.html')) {
            window.location.href = '../pages/login.html';
        }
    } else {
        const userData = JSON.parse(user);
        if (window.location.pathname.includes('/pages/login.html')) {
            window.location.href = userData.role === 'admin' ? 'admin.html' : 'dashboard.html';
        }
    }
};

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Find user
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store user data (in practice, store a token instead)
            const userData = {
                email: user.email,
                role: user.role
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect based on role
            window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
        } else {
            showAlert('Invalid email or password');
        }
    });
}

// Handle logout
const logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};

// Handle password reset
const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const user = users.find(u => u.email === email);

        if (user) {
            showAlert('Password reset link sent to your email', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert('Email not found');
        }
    });
}

// Check authentication status on page load
checkAuth(); 