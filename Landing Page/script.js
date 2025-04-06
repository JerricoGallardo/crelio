// Theme management with improved efficiency
const themeManager = (() => {
    // Cache DOM elements and theme state
    let currentTheme = localStorage.getItem('darkMode') === 'enabled' ? 'dark' : 'light';
    
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('darkMode', theme === 'dark' ? 'enabled' : 'disabled');
    }

    function initialize() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            // Set initial state based on saved preference
            themeToggle.checked = currentTheme === 'dark';
            applyTheme(currentTheme);
            
            // Add event listener
            themeToggle.addEventListener('change', () => {
                currentTheme = themeToggle.checked ? 'dark' : 'light';
                applyTheme(currentTheme);
            });
        }
    }
    
    return { initialize, applyTheme };
})();

// Enhanced toast notification system
const toastManager = (() => {
    let toastContainer;
    
    function createContainer() {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        return toastContainer;
    }
    
    function showToast(message, type = 'info') {
        const container = createContainer();
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Create icon based on type
        const icon = document.createElement('i');
        switch(type) {
            case 'success': icon.className = 'fas fa-check-circle'; break;
            case 'error': icon.className = 'fas fa-exclamation-circle'; break;
            case 'info': default: icon.className = 'fas fa-info-circle'; break;
        }
        
        // Add content to toast
        const text = document.createElement('span');
        text.textContent = message;
        toast.appendChild(icon);
        toast.appendChild(text);
        
        // Add and animate
        container.appendChild(toast);
        
        // Force reflow before adding show class for animation
        void toast.offsetWidth;
        toast.classList.add('show');
        
        // Remove toast after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    return { showToast };
})();

// UI interaction manager
const uiManager = (() => {
    function initializeDropdowns() {
        const profileDropdown = document.querySelector('.profile-dropdown');
        if (profileDropdown) {
            profileDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });
        }
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            const dropdowns = document.querySelectorAll('.profile-dropdown, #profileMenu');
            dropdowns.forEach(dropdown => {
                if (dropdown && !dropdown.contains(e.target) && 
                    !e.target.closest('.profile-trigger')) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // Close dropdowns on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.profile-dropdown, #profileMenu, .submenu.active')
                    .forEach(el => el.classList.remove('active'));
            }
        });
    }
    
    function initializeSidebar() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        if (sidebarItems.length) {
            const clickHandler = (e) => {
                sidebarItems.forEach(i => i.classList.remove('active'));
                e.currentTarget.classList.add('active');
            };
            
            sidebarItems.forEach(item => {
                item.addEventListener('click', clickHandler);
            });
        }
    }
    
    function toggleProfileMenu() {
        const profileMenu = document.getElementById('profileMenu');
        if (profileMenu) {
            profileMenu.classList.toggle('active');
        }
    }
    
    function toggleCompactMode() {
        const isCompact = document.body.classList.toggle('compact-mode');
        toastManager.showToast(`Compact mode ${isCompact ? 'enabled' : 'disabled'}`, 'info');
        localStorage.setItem('compactMode', isCompact);
    }
    
    return {
        initializeDropdowns,
        initializeSidebar,
        toggleProfileMenu,
        toggleCompactMode
    };
})();

// Navigation and scrolling handler
const navigationManager = (() => {
    function initializeSmoothScrolling() {
        document.documentElement.style.scrollBehavior = 'smooth';
        
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerOffset = 70;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update active state in navigation
                        document.querySelectorAll('.nav-menu a').forEach(navItem => {
                            navItem.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                }
            });
        });
    }
    
    function initializeScrollSpy() {
        let throttleTimer;
        
        const updateActiveNavItem = () => {
            if (throttleTimer) return;
            
            throttleTimer = setTimeout(() => {
                const sections = document.querySelectorAll('section[id], #home');
                let scrollPosition = window.scrollY;
                let currentSection = null;
                
                // Find the current section
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section;
                    }
                });
                
                // Update navigation items
                document.querySelectorAll('.nav-menu a').forEach(navLink => {
                    const sectionId = navLink.getAttribute('href').substring(1);
                    navLink.classList.remove('active');
                    
                    if (currentSection && currentSection.id === sectionId) {
                        navLink.classList.add('active');
                    }
                });
                
                throttleTimer = null;
            }, 100);
        };
        
        window.addEventListener('scroll', updateActiveNavItem, { passive: true });
        // Call once on page load
        updateActiveNavItem();
    }
    
    return {
        initializeSmoothScrolling,
        initializeScrollSpy
    };
})();

// Menu handling
function toggleSubmenu(submenuId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    
    const parentWrapper = submenu.closest('.menu-item-wrapper');
    
    const isNestedSubmenuItem = event && event.target.closest('.submenu-item');
    if (isNestedSubmenuItem && !event.target.closest('.menu-item-wrapper')) {
        return;
    }
    
    // Efficiently close sibling menus
    const siblings = Array.from(submenu.parentElement.parentElement.querySelectorAll('.submenu'));
    siblings.forEach(sibling => {
        if (sibling !== submenu) {
            sibling.classList.remove('active');
            const siblingWrapper = sibling.closest('.menu-item-wrapper');
            if (siblingWrapper) siblingWrapper.classList.remove('active');
        }
    });
    
    submenu.classList.toggle('active');
    if (parentWrapper) {
        parentWrapper.classList.toggle('active');
    }
}

function handleMenuItemClick(action, param, event) {
    event.preventDefault();
    event.stopPropagation();
    
    switch (action) {
        case 'toggleCompact':
            uiManager.toggleCompactMode();
            break;
    }
}

// Initialize styles
function initializeStyles() {
    document.documentElement.style.setProperty('--transition-speed', '0.3s');
    
    const style = document.createElement('style');
    style.textContent = `
        .toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        }
        
        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            background: white;
            color: #333;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .toast.show {
            transform: translateX(0);
        }
        
        .toast i {
            font-size: 20px;
        }
        
        .toast-success {
            border-left: 4px solid #28a745;
        }
        
        .toast-success i {
            color: #28a745;
        }
        
        .toast-error {
            border-left: 4px solid #dc3545;
        }
        
        .toast-error i {
            color: #dc3545;
        }
        
        .toast-info {
            border-left: 4px solid #007bff;
        }
        
        .toast-info i {
            color: #007bff;
        }
        
        body[data-theme="dark"] .toast {
            background-color: #333;
            color: #fff;
        }
        
        /* Dark mode styles for feedback items */
        body[data-theme="dark"] .feedback-item {
            background-color: #2d2d2d;
            color: #ffffff;
        }
        
        body[data-theme="dark"] .star-rating i {
            color: #ffd700; /* Keep stars yellow in dark mode */
        }
        
        body[data-theme="dark"] .feedback-text {
            color: #e0e0e0;
        }
        
        body[data-theme="dark"] .feedback-header h4 {
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);
}

// Initialize form handlers
function initializeForms() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const feedbackType = document.getElementById('feedbackType').value;
            const message = document.getElementById('message').value;
            
            // Show success message
            toastManager.showToast('Thank you for your feedback!', 'success');
            
            // Reset the form
            feedbackForm.reset();
        });
    }
}

// Function to check user login status and update UI accordingly
function checkUserLoginStatus() {
    const userAuth = localStorage.getItem('userAuth');
    const loginButton = document.getElementById('loginButton');
    const userProfileDisplay = document.getElementById('userProfileDisplay');
    const usernameDisplay = document.getElementById('usernameDisplay');
    
    if (!loginButton || !userProfileDisplay) return; // Exit if elements don't exist
    
    // Default state - show login button, hide user profile
    loginButton.style.display = 'flex';
    userProfileDisplay.style.display = 'none';
    
    // If there's valid user auth data, then override the default
    if (userAuth) {
        try {
            const userData = JSON.parse(userAuth);
            if (userData && userData.isLoggedIn) {
                // User is logged in, show profile
                loginButton.style.display = 'none';
                userProfileDisplay.style.display = 'flex';
                
                // Update username display if it exists
                if (usernameDisplay) {
                    usernameDisplay.textContent = userData.name;
                }
                
                // Update profile menu info if available
                const menuUserName = document.querySelector('.profile-menu .user-info h4');
                const menuUserEmail = document.querySelector('.profile-menu .user-info p');
                
                if (menuUserName && userData.name) {
                    menuUserName.textContent = userData.name;
                }
                
                if (menuUserEmail && userData.email) {
                    menuUserEmail.textContent = userData.email;
                }
            }
        } catch (error) {
            console.error('Error parsing user auth data:', error);
        }
    }
    
    // Clear the login source after checking
    localStorage.removeItem('loginSource');
}

// Function to redirect to login page
function redirectToLogin() {
    // Store the source of login redirect (get-started or direct)
    localStorage.setItem('loginSource', 'direct');
    window.location.href = '../login.html';
}

// Function to redirect to dashboard
function redirectToDashboard() {
    window.location.href = '../Dashboard/dashboard.html';
}

// Function to handle "Get Started" button click
function handleGetStarted() {
    // Check if user is already logged in
    const userAuth = localStorage.getItem('userAuth');
    
    if (userAuth) {
        try {
            const userData = JSON.parse(userAuth);
            if (userData && userData.isLoggedIn) {
                // User is logged in, redirect to dashboard
                redirectToDashboard();
                return;
            }
        } catch (error) {
            console.error('Error parsing user auth data:', error);
        }
    }
    
    // Store that login was initiated from Get Started
    localStorage.setItem('loginSource', 'get-started');
    // User is not logged in, redirect to login page
    window.location.href = '../login.html';
}

// Function to logout user
function logout() {
    // Clear user authentication data
    localStorage.removeItem('userAuth');
    
    // Show success message
    toastManager.showToast('Successfully logged out', 'success');
    
    // Reload the page
    window.location.reload();
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    themeManager.initialize();
    initializeStyles();
    uiManager.initializeDropdowns();
    uiManager.initializeSidebar();
    navigationManager.initializeSmoothScrolling();
    navigationManager.initializeScrollSpy();
    initializeForms();
    
    // Load saved compact mode state
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    if (savedCompactMode) {
        document.body.classList.add('compact-mode');
    }

    // Check if user is logged in
    checkUserLoginStatus();
});

document.addEventListener('DOMContentLoaded', function() {
	const menuItems = document.querySelectorAll('.nav-item.with-submenu');
	
	menuItems.forEach(item => {
		item.addEventListener('click', function(e) {
			if (window.innerWidth > 768) {
				e.preventDefault();
				this.classList.toggle('open');
			}
		});
	});
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('getStartedBtn').addEventListener('click', handleGetStarted);
});

// Make functions globally available
window.showToast = toastManager.showToast;
window.toggleProfileMenu = uiManager.toggleProfileMenu;
window.toggleSubmenu = toggleSubmenu;
window.handleMenuItemClick = handleMenuItemClick;
window.redirectToLogin = redirectToLogin;
window.redirectToDashboard = redirectToDashboard;
window.handleGetStarted = handleGetStarted;
window.logout = logout;