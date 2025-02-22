// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.setAttribute('data-theme', themeToggle.checked ? 'dark' : 'light');
});

// Dropdown Menu
const profileDropdown = document.querySelector('.profile-dropdown');
profileDropdown.addEventListener('click', (e) => {
    profileDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!profileDropdown.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
});

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

// Add this function to your existing JavaScript file
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

// Load saved compact mode state
document.addEventListener('DOMContentLoaded', () => {
    const savedCompactMode = localStorage.getItem('compactMode') === 'true';
    if (savedCompactMode) {
        document.body.classList.add('compact-mode');
    }
});

// Add CSS variables for transition control
document.documentElement.style.setProperty('--transition-speed', '0.3s');