document.addEventListener('DOMContentLoaded', function() {
    // Backend API configuration
    const API_BASE_URL = "http://localhost:5000/api"; // For Python Flask
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav ul');
    
    if(mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
                
                const data = await response.json();
                
                if(data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Registration Form
    const registerForm = document.getElementById('registerForm');
    if(registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmInput = document.getElementById('confirmPassword');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            // Get values
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;
            
            // Validate
            if(!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if(password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            try {
                // Disable button during submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registering...';
                
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        name: name,
                        email: email,
                        password: password 
                    }),
                });
                
                const data = await response.json();
                
                if(!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }
                
                alert('Registration successful! You are now logged in.');
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('Registration error:', error);
                alert(error.message || 'Registration failed. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Join Now';
            }
        });
    }

    // Dashboard Functionality
    if(window.location.pathname.includes('dashboard.html')) {
        loadUserProfile();
        setupLogout();
    }

    // Check authentication state on all pages
    checkAuthState();
});

// Load user profile on dashboard
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userMembership').textContent = 
        user.membership.charAt(0).toUpperCase() + user.membership.slice(1);
}

// Setup logout button
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    }
}

// Check and update authentication state
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginBtn = document.querySelector('a.login-btn');
    const accountBtn = document.querySelector('a[href="dashboard.html"]');
    
    if(user) {
        // User is logged in
        if(loginBtn) loginBtn.style.display = 'none';
        if(accountBtn) {
            accountBtn.style.display = 'block';
            accountBtn.textContent = 'My Account';
        }
    } else {
        // User is not logged in
        if(loginBtn) loginBtn.style.display = 'block';
        if(accountBtn) accountBtn.style.display = 'none';
    }
}
// Add this at the bottom of your script.js
function celebrateLaunch() {
    console.log("%c🎉 WEBSITE LAUNCH SUCCESS! 🎉", 
        "font-size: 20px; color: #6e48aa; font-weight: bold;");
    console.log("%cOmkar Fitness Gym is now fully operational!", 
        "font-size: 16px; color: #4cc9f0;");
    
    // Optional: Add a subtle animation to celebrate
    document.documentElement.style.setProperty('--neon-pink', '#ff2d75');
    setTimeout(() => {
        document.documentElement.style.setProperty('--neon-pink', '#ff2d75');
    }, 1000);
}

celebrateLaunch();
// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');

if (mobileMenuBtn && mobileMenu && closeMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });

    // Close menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}
