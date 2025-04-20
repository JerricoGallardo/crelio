// DOM Elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const tabs = document.querySelector('.tabs');
const passwordInputs = document.querySelectorAll('input[type="password"]');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const signupPasswordInput = document.getElementById('signup-password');
const confirmPasswordInput = document.getElementById('signup-confirm-password');
const strengthBar = document.querySelector('.strength-bar');
const loginSubmit = loginForm.querySelector('button[type="submit"]');
const signupSubmit = signupForm.querySelector('button[type="submit"]');
const blobs = document.querySelectorAll('.blob');
const particlesContainer = document.querySelector('.particles-container');
const resumeElementsContainer = document.querySelector('.resume-elements-container');

let googleToken = null;

window.onload = () => {
    google.accounts.id.initialize({
        client_id: "324397955892-2kvjrhdn6nms1lq8fup11l3t3fodu5an.apps.googleusercontent.com",
        callback: (response) => {
            googleToken = response.credential;
            console.log("Google token:", googleToken);
        }
    });

    google.accounts.id.prompt(); // shows the "Continue as..." prompt
};

// Initialize animations for elements
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS class to body when DOM is loaded
    document.body.classList.add('dom-loaded');
    
    // Initialize blob animations with random movements
    initBlobAnimations();
    
    // Initialize floating particles
    createParticles();
    
    // Initialize resume-themed elements
    createResumeElements();
    
    // Add subtle hover effect to the form on mouse move
    addFormHoverEffect();
});

// Tab switching - Completely simplified approach
loginTab.addEventListener('click', () => {
    if (loginTab.classList.contains('active')) return;
    
    // Update tab states
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    tabs.classList.remove('signup');
    
    // Hide signup form, show login form
    signupForm.classList.remove('active-form');
    loginForm.classList.add('active-form');
    
    // Force reflow and trigger animations
    document.body.classList.remove('form-animated');
    void document.body.offsetWidth; // Force reflow
    document.body.classList.add('form-animated');
});

signupTab.addEventListener('click', () => {
    if (signupTab.classList.contains('active')) return;
    
    // Update tab states
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    tabs.classList.add('signup');
    
    // Hide login form, show signup form
    loginForm.classList.remove('active-form');
    signupForm.classList.add('active-form');
    
    // Force reflow and trigger animations
    document.body.classList.remove('form-animated');
    void document.body.offsetWidth; // Force reflow
    document.body.classList.add('form-animated');
});

// Function to initialize blob animations
function initBlobAnimations() {
    blobs.forEach(blob => {
        // Create a unique animation timing for each blob
        const randomDuration = 15 + Math.random() * 20; // Between 15-35s
        const randomDelay = Math.random() * 5; // Between 0-5s
        
        blob.style.animation = `floatBlob ${randomDuration}s infinite ease-in-out ${randomDelay}s`;
    });
}

// Function to create floating particles
function createParticles() {
    if (!particlesContainer) return;
    
    // Create particles
    for (let i = 0; i < 30; i++) { // Reduced from 50 to 30 to make room for resume elements
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2px and 5px
        const size = 2 + Math.random() * 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random opacity between 0.1 and 0.3
        particle.style.opacity = (0.1 + Math.random() * 0.2).toString();
        
        // Random animation duration between 20 and 40 seconds
        const duration = 20 + Math.random() * 20;
        particle.style.animation = `floatParticle ${duration}s infinite linear ${Math.random() * 10}s`;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add styles for particles
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
        }
        
        @keyframes floatParticle {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
            }
            25% {
                transform: translateY(-30px) translateX(20px) rotate(90deg);
            }
            50% {
                transform: translateY(-15px) translateX(40px) rotate(180deg);
            }
            75% {
                transform: translateY(-40px) translateX(10px) rotate(270deg);
            }
            100% {
                transform: translateY(0) translateX(0) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// Function to create resume-themed elements
function createResumeElements() {
    if (!resumeElementsContainer) return;
    
    // Resume-themed elements to create
    const elements = [
        { type: 'resume-page', count: 8 },
        { type: 'resume-text-line', count: 12 },
        { type: 'resume-section', count: 10 },
        { type: 'resume-bullet', count: 15 },
        { type: 'resume-icon', count: 10, icons: ['fas fa-briefcase', 'fas fa-graduation-cap', 'fas fa-pencil-alt', 'fas fa-code', 'fas fa-user', 'fas fa-pencil-ruler', 'fas fa-file-alt', 'fas fa-star', 'fas fa-award', 'fas fa-certificate'] }
    ];
    
    // Create each type of element
    elements.forEach(elementType => {
        for (let i = 0; i < elementType.count; i++) {
            const element = document.createElement('div');
            element.className = `resume-element ${elementType.type}`;
            
            // Set random position
            element.style.left = `${Math.random() * 90 + 5}%`;
            element.style.top = `${Math.random() * 90 + 5}%`;
            
            // For icons, create icon element
            if (elementType.type === 'resume-icon') {
                const iconIndex = i % elementType.icons.length;
                const icon = document.createElement('i');
                icon.className = elementType.icons[iconIndex];
                element.appendChild(icon);
            }
            
            // Add random size variation for some elements
            if (['resume-text-line', 'resume-section'].includes(elementType.type)) {
                const widthVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of original size
                element.style.width = `calc(100% * ${widthVariation})`;
            }
            
            // Add random rotation
            element.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Add animation with random duration and delay
            const duration = 20 + Math.random() * 30; // 20-50s
            const delay = Math.random() * 15; // 0-15s
            element.style.animation = `floatResumeElement ${duration}s infinite ease-in-out ${delay}s`;
            
            // Add to container
            resumeElementsContainer.appendChild(element);
        }
    });
}

// Function to add subtle hover effect to form
function addFormHoverEffect() {
    const formContainer = document.querySelector('.form-container');
    if (!formContainer) return;
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const rect = formContainer.getBoundingClientRect();
        
        // Calculate the center of the form
        const formCenterX = rect.left + rect.width / 2;
        const formCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to form center (normalized)
        const distX = (clientX - formCenterX) / (window.innerWidth / 2) * 5;
        const distY = (clientY - formCenterY) / (window.innerHeight / 2) * 5;
        
        // Apply subtle rotation based on mouse position (only if mouse is near the form)
        if (Math.abs(distX) < 15 && Math.abs(distY) < 15) {
            formContainer.style.transform = `perspective(1000px) rotateX(${-distY}deg) rotateY(${distX}deg) translateY(-5px)`;
        } else {
            formContainer.style.transform = 'translateY(-5px)';
        }
    });
    
    // Reset transform when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        formContainer.style.transform = 'translateY(-5px)';
    });
}

// Password Visibility Toggle - Fixed to prevent interference with typing
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent any default actions
        e.stopPropagation(); // Stop event from bubbling
        
        // Get the associated input field (sibling element)
        const input = button.previousElementSibling;
        // Get the icon inside the button
        const icon = button.querySelector('i');
        
        // Toggle the input type
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
        
        // Add a pulse animation to the button
        button.classList.add('pulse-animation');
        setTimeout(() => {
            button.classList.remove('pulse-animation');
        }, 500);
        
        // Keep focus on the input
        input.focus();
    });
});

// Password Strength Meter
signupPasswordInput.addEventListener('input', () => {
    const password = signupPasswordInput.value;
    const strength = calculatePasswordStrength(password);
    
    updateStrengthIndicator(strength);
});

// Calculate password strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25; // Has uppercase
    if (/[a-z]/.test(password)) strength += 25; // Has lowercase
    if (/[0-9]/.test(password)) strength += 12.5; // Has number
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5; // Has special char
    
    return Math.min(strength, 100);
}

// Update visual strength indicator
function updateStrengthIndicator(strength) {
    const strengthContainer = document.querySelector('.password-strength');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthBar = document.querySelector('.strength-bar');
    
    // Remove all existing strength classes
    strengthContainer.classList.remove('strength-weak', 'strength-fair', 'strength-good', 'strength-strong');
    
    // Update the strength text
    let strengthText = '';
    let strengthClass = '';
    
    if (strength < 25) {
        strengthText = 'Weak';
        strengthClass = 'strength-weak';
    } else if (strength < 50) {
        strengthText = 'Fair';
        strengthClass = 'strength-fair';
    } else if (strength < 75) {
        strengthText = 'Good';
        strengthClass = 'strength-good';
    } else {
        strengthText = 'Strong';
        strengthClass = 'strength-strong';
    }
    
    // Update the strength label
    let strengthLabel = strengthContainer.querySelector('span');
    
    // If there's no strength text element, create one
    if (!strengthContainer.querySelector('.strength-text')) {
        const textSpan = document.createElement('span');
        textSpan.className = 'strength-text';
        strengthLabel.appendChild(textSpan);
    }
    
    // Update the strength text
    const strengthTextElement = strengthContainer.querySelector('.strength-text');
    strengthTextElement.textContent = strengthText;
    
    // Add the appropriate class to the container
    strengthContainer.classList.add(strengthClass);
    
    // Explicitly set the width for the animation effect
    strengthBar.style.width = `${strength}%`;
    
    // Add transition animation
    strengthBar.style.transition = 'width 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), background-color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)';
}

// Password confirmation check
confirmPasswordInput.addEventListener('input', () => {
    if (signupPasswordInput.value === confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = '#4caf50';
        confirmPasswordInput.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
    } else {
        confirmPasswordInput.style.borderColor = '#f44336';
        confirmPasswordInput.style.boxShadow = '0 0 0 2px rgba(244, 67, 54, 0.2)';
    }
});

// Prevent default form submission for demo
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    showLoading(loginSubmit);

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('https://localhost:7258/api/auth/login', {
            method: 'POST',
            body: new URLSearchParams({ email, password }),
        });
    
        const data = await res.json(); // Convert response to JSON
    
        if (!res.ok) {
            throw new Error(data.message || "Login failed.");
        }
    
        if (data.isEmailConfirmed === false) {
            throw new Error("verify"); // This will trigger the special error message
        }
    
        hideLoading(loginSubmit);
        showSuccessMessage(loginForm, data.message || "Login successful!");
    
        storeAuthentication({
            email: data.email || email,
            name: data.name || email.split('@')[0],
            imageUrl: "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name || email),
            isLoggedIn: true,
        });
        
        
    
        setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html";
        }, 1500);
    
    } catch (err) {
        hideLoading(loginSubmit);
        const msg = err.message.includes("verify") 
            ? "Email not verified. Please check your inbox." 
            : "Login failed.";
        showErrorMessage(loginForm, msg);
    }
    
});


signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        showErrorMessage(signupForm, "Passwords do not match!");
        shakeElement(confirmPasswordInput);
        return;
    }

    showLoading(signupSubmit);

    try {
        const res = await fetch('https://localhost:7258/api/auth/register', {
            method: 'POST',
            body: new URLSearchParams({
                fullname,
                email,
                password,
                credential: googleToken // ✅ Send Google token
            }),
        });

        const text = await res.text();

        if (!res.ok) {
            throw new Error(text);
        }

        hideLoading(signupSubmit);
        showSuccessMessage(signupForm, text);

        storeAuthentication({
            email,
            name: fullname,
            imageUrl: data.picture || "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullname),
            isLoggedIn: true
        });

        setTimeout(() => {
            window.location.href = "checkEmailVerification.html";
        }, 1500);

    } catch (err) {
        hideLoading(signupSubmit);
        showErrorMessage(signupForm, err.message || "Registration failed.");
    }
});


// Helper functions
function showLoading(button) {
    button.disabled = true;
    button.querySelector('.btn-text').textContent = "Processing...";
    button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

function hideLoading(button) {
    button.disabled = false;
    button.querySelector('.btn-text').textContent = button.closest('form').id === 'login-form' ? "Sign In" : "Create Account";
    button.querySelector('.btn-icon').innerHTML = '<i class="fas fa-arrow-right"></i>';
}

async function simulateApiCall() {
    return new Promise(resolve => setTimeout(resolve, 1500));
}

function showSuccessMessage(form, message) {
    showMessage(form, message, 'success');
}

function showErrorMessage(form, message) {
    showMessage(form, message, 'error');
}

function showMessage(form, message, type) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Insert after the submit button
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.parentNode.insertBefore(messageElement, submitButton.nextSibling);
    
    // Add entrance animation
    messageElement.style.animation = 'fadeInUp 0.5s ease forwards';
    
    // Auto dismiss after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            messageElement.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 600);
}

function storeAuthentication(userData) {
    localStorage.setItem('userAuth', JSON.stringify(userData));
}

async function handleGoogleSignIn(response) {
    console.log("Google credential received:", response.credential);
    
    try {
        // Ensure jwt_decode is available
        if (typeof jwt_decode !== 'function') {
            throw new Error("JWT decoding library not loaded");
        }
        
        const decoded = jwt_decode(response.credential);
        console.log("Decoded JWT:", decoded);

        const res = await fetch("https://localhost:7258/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                credential: response.credential,
                email: decoded.email,
                name: decoded.name
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Google authentication failed");
        }

        const data = await res.json();
        
        if (data.needsPassword) {
            window.location.href = `createpassword.html?email=${encodeURIComponent(data.email)}&name=${encodeURIComponent(data.name)}&picture=${encodeURIComponent(data.picture || "")}`;
        } else {
            const decoded = jwt_decode(response.credential);

            storeAuthentication({
                email: data.email,
                name: data.name,
                imageUrl: data.picture, // ✅ now pulled from backend
                isLoggedIn: true
            });
            window.location.href = "../Dashboard/dashboard.html";
        }
    } catch (error) {
        console.error("Google sign-in failed:", error);
        showErrorMessage(loginForm, error.message || "Google sign-in failed");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
        showSuccessMessage(loginForm, "Your email has been verified. You may now log in.");
    }
});

// Add css class to handle shake animation
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.shake {
    animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
}
.pulse-animation {
    animation: pulse 0.5s ease-in-out;
}
.message {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 16px 0;
    font-weight: 500;
}
.message.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
}
.message.error {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
}
.password-strength {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-radius: 8px;
    background-color: #f7f7f7;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}
.password-strength .strength-meter {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: #ddd;
}
.password-strength .strength-bar {
    height: 4px;
    border-radius: 2px;
    background-color: #4caf50;
    transition: width 0.3s ease-out, background-color 0.3s ease;
}
.password-strength.strength-weak .strength-bar {
    background-color: #f44336;
}
.password-strength.strength-fair .strength-bar {
    background-color: #ff9800;
}
.password-strength.strength-good .strength-bar {
    background-color: #ffeb3b;
}
.password-strength.strength-strong .strength-bar {
    background-color: #4caf50;
}
.password-strength .strength-text {
    font-size: 14px;
    font-weight: 500;
    margin-left: 8px;
}
.form-entering {
    animation: fadeInUp 0.5s ease forwards;
}
.form-exiting {
    animation: fadeOut 0.5s ease forwards;
}
.switching-forms .form-entering, .switching-forms .form-exiting {
    transition: opacity 0.4s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}
</style>
`);

// Add this at the beginning of the load event listener
window.addEventListener('load', () => {
    console.log("Login page loaded");
    
    // Check localStorage
    const userAuth = localStorage.getItem('userAuth');
    console.log("UserAuth in localStorage:", userAuth);
    
    if (userAuth) {
        const user = JSON.parse(userAuth);
        console.log("User object:", user);
        console.log("isLoggedIn value:", user.isLoggedIn);
        
        if (user.isLoggedIn) {
            console.log("Redirecting to landing page...");
            // Comment out the redirect temporarily for debugging
            // window.location.href = "Landing Page/index.html";
        }
    } else {
        console.log("No user auth found in localStorage");
    }
});