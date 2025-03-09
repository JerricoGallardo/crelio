// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
    } else {
        document.body.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', themeToggle.checked ? 'enabled' : 'disabled');
});

// Dropdown Menu
const profileDropdown = document.querySelector('.profile-dropdown');
if (profileDropdown) {
    profileDropdown.addEventListener('click', (e) => {
        profileDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

// Sidebar item active state
const sidebarItems = document.querySelectorAll('.sidebar-item');
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
} 

// Profile menu toggle function
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('active');

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = profileMenu.contains(event.target) || 
                            event.target.closest('.profile-trigger');
        
        if (!isClickInside && profileMenu.classList.contains('active')) {
            profileMenu.classList.remove('active');
        }
    });
}

// Optional: Close menu when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const profileMenu = document.getElementById('profileMenu');
        profileMenu.classList.remove('active');
    }
});

// Update the toggleSubmenu function
function toggleSubmenu(submenuId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Get the submenu
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    
    // Get all parent menu-item-wrappers
    const parentWrapper = submenu.closest('.menu-item-wrapper');
    
    // If clicking a nested submenu item, don't close the parent menus
    const isNestedSubmenuItem = event && event.target.closest('.submenu-item');
    if (isNestedSubmenuItem && !event.target.closest('.menu-item-wrapper')) {
        return;
    }
    
    // Close other submenus at the same level
    const siblings = submenu.parentElement.parentElement.querySelectorAll('.submenu');
    siblings.forEach(sibling => {
        if (sibling !== submenu) {
            sibling.classList.remove('active');
            const siblingWrapper = sibling.closest('.menu-item-wrapper');
            if (siblingWrapper) siblingWrapper.classList.remove('active');
        }
    });
    
    // Toggle the clicked submenu
    submenu.classList.toggle('active');
    if (parentWrapper) {
        parentWrapper.classList.toggle('active');
    }
}

// Update the click handlers for menu items
function handleMenuItemClick(action, param, event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Execute the appropriate action
    switch (action) {
        case 'color':
            changeColorScheme(param);
            break;
        case 'toggleCompact':
            toggleCompactMode();
            break;
    }
    
    // Don't close the menus immediately after changing settings
    event.stopPropagation();
}

function toggleCompactMode() {
    document.body.classList.toggle('compact-mode');
    const isCompact = document.body.classList.contains('compact-mode');
    showToast(`Compact mode ${isCompact ? 'enabled' : 'disabled'}`, 'info');
    localStorage.setItem('compactMode', isCompact);
}

// Feedback form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    // Apply saved preference
    if (darkModeEnabled) {
        document.body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    } else {
        document.body.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark-mode');
        if (themeToggle) themeToggle.checked = false;
    }
    
    // Load saved compact mode state
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    if (savedCompactMode) {
        document.body.classList.add('compact-mode');
    }
    
    const feedbackForm = document.getElementById('feedbackForm');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const feedbackType = document.getElementById('feedbackType').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the data to your server
            // For now, let's just show a success message
            
            // Create a success message
            showToast('Thank you for your feedback!', 'success');
            
            // Reset the form
            feedbackForm.reset();
        });
    }
    
    // Add smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for internal links
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 70; // Account for fixed header
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
    
    // Set active nav based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-menu a[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-menu a[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });
});

// Add CSS variables for transition control
document.documentElement.style.setProperty('--transition-speed', '0.3s');

// Enhanced toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Create icon based on type
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'info':
        default:
            icon.className = 'fas fa-info-circle';
            break;
    }
    
    // Create message text
    const text = document.createElement('span');
    text.textContent = message;
    
    // Add icon and text to toast
    toast.appendChild(icon);
    toast.appendChild(text);
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add show class after a small delay (for animation)
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add these styles programmatically
document.addEventListener('DOMContentLoaded', function() {
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
});