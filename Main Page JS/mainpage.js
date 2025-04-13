// Toast notification system
const toastManager = {
    showToast: function(message, type = 'success') {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Navigation and Content Loading
function initializeNavigation() {
    const dashboardLink = document.querySelector('.nav-item:has(.fa-tachometer-alt)');
    const myProjectsLink = document.querySelector('.nav-item:has(.fa-folder)');
    
    let dashboardContent = document.querySelector('.content-wrapper');
    
    const originalDashboardContent = dashboardContent?.innerHTML;
    
    function loadDashboardContent() {
        if (!dashboardContent || dashboardContent !== document.querySelector('.content-wrapper')) {
            const newDashboardContent = document.createElement('div');
            newDashboardContent.className = 'content-wrapper';
            newDashboardContent.innerHTML = originalDashboardContent;
            
            document.querySelector('.content-wrapper')?.replaceWith(newDashboardContent);
            dashboardContent = newDashboardContent;
        }
        
        myProjectsLink?.classList.remove('active');
        dashboardLink?.classList.add('active');
        
        history.pushState({page: 'dashboard'}, 'Dashboard', '#dashboard');
        document.title = 'Crealio - Dashboard';
    }
    
    dashboardLink?.addEventListener('click', function(e) {
        e.preventDefault();
        loadDashboardContent();
    });
    
    myProjectsLink?.addEventListener('click', function(e) {
        // Don't prevent default - let the link navigate normally
        window.location.href = '../My Portfolio/myportfolio.html';
    });
    
    // Initialize state
    if (window.location.hash === '#dashboard') {
        loadDashboardContent();
    }
}

// Theme Management
const themeManager = (() => {
    let currentTheme = localStorage.getItem('darkMode') === 'enabled' ? 'dark' : 'light';
    
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('darkMode', theme === 'dark' ? 'enabled' : 'disabled');
    }

    function initialize() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = currentTheme === 'dark';
            applyTheme(currentTheme);
            
            themeToggle.addEventListener('change', () => {
                currentTheme = themeToggle.checked ? 'dark' : 'light';
                applyTheme(currentTheme);
            });
        }
    }
    
    return { initialize, applyTheme };
})();

// User Data Management
function loadUserData() {
    const userAuth = localStorage.getItem('userAuth');
    
    if (!userAuth) {
        window.location.href = '../login.html';
        return;
    }
    
    try {
        const userData = JSON.parse(userAuth);
        if (!userData || !userData.isLoggedIn) {
            window.location.href = '../login.html';
            return;
        }
        
        const usernameElements = document.querySelectorAll('.user-info h4');
        const emailElements = document.querySelectorAll('.user-info p');
        const welcomeMessage = document.querySelector('.card-title');
        
        if (userData.name) {
            usernameElements.forEach(element => {
                element.textContent = userData.name;
            });
            
            if (welcomeMessage?.textContent.includes('Welcome back')) {
                welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
            }
        }
        
        if (userData.email) {
            emailElements.forEach(element => {
                element.textContent = userData.email;
            });
        }
    } catch (error) {
        console.error('Error parsing user auth data:', error);
        window.location.href = '../login.html';
    }
}

// UI Controls
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('active');
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleButton = sidebar.querySelector('.sidebar-toggle i');
    
    if (sidebar && mainContent) {
        const isCollapsed = !sidebar.classList.contains('collapsed'); // Get the future state
        
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Store the sidebar state
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        
        // Update toggle button icon based on collapsed state
        if (toggleButton) {
            toggleButton.classList.remove('fa-chevron-left', 'fa-chevron-right');
            toggleButton.classList.add(isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left');
        }
    }
}

function createSidebarToggleButton() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'sidebar-toggle';
        toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        toggleButton.addEventListener('click', toggleSidebar);
        
        // Position the button at the bottom center
        toggleButton.style.position = 'absolute';
        toggleButton.style.bottom = '20px';
        toggleButton.style.left = '50%';
        toggleButton.style.transform = 'translateX(-50%)';
        
        sidebar.appendChild(toggleButton);
        
        // Apply saved sidebar state
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            toggleButton.querySelector('i').classList.remove('fa-chevron-left');
            toggleButton.querySelector('i').classList.add('fa-chevron-right');
        }
    }
}

// Navigation Item Management
document.querySelectorAll('.nav-item:not(.with-submenu)').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item:not(.with-submenu)').forEach(navItem => {
            navItem.classList.remove('active');
        });
        item.classList.add('active');
        
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const isCollapsed = sidebar?.classList.contains('collapsed');
        
        if (isCollapsed) {
            setTimeout(() => {
                const newSidebar = document.querySelector('.sidebar');
                const newMainContent = document.querySelector('.main-content');
                if (newSidebar && newMainContent) {
                    newSidebar.classList.add('collapsed');
                    newMainContent.classList.add('expanded');
                }
            }, 100);
        }
    });
});

// Submenu Management
document.querySelectorAll('.nav-item.with-submenu').forEach(item => {
    item.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            e.preventDefault();
            this.classList.toggle('open');
        }
    });
});

// Project Management
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
}

function sortProjects(criteria) {
    const projectsGrid = document.querySelector('.projects-grid');
    const projects = Array.from(projectsGrid.children);
    
    projects.sort((a, b) => {
        switch(criteria) {
            case 'name':
                return a.querySelector('.project-title').textContent
                    .localeCompare(b.querySelector('.project-title').textContent);
            case 'date':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'views':
                return b.dataset.views - a.dataset.views;
            default:
                return 0;
        }
    });
    
    projects.forEach(project => projectsGrid.appendChild(project));
}

// Logout Handler
function handleLogout() {
    localStorage.removeItem('userAuth');
    toastManager.showToast('Successfully logged out');
    setTimeout(() => {
        window.location.href = '../Landing Page/index.html';
    }, 1000);
}

// Compact Mode Toggle
function toggleCompactMode() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('compact');
    mainContent.classList.toggle('expanded');
    
    // Store the compact mode state
    const isCompact = sidebar.classList.contains('compact');
    localStorage.setItem('compactMode', isCompact);
    
    toastManager.showToast('Compact mode ' + (isCompact ? 'enabled' : 'disabled'));
}

// Logo Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code...
    initializeNavigation();
    themeManager.initialize();
    loadUserData();
    createSidebarToggleButton();
    
    // Add logo click handler
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            // Get the current page path
            const currentPath = window.location.pathname;
            
            // Determine the correct landing page path based on the current directory depth
            let landingPagePath;
            
            // Check if we're in a nested directory
            if (currentPath.split('/').length > 2) {
                landingPagePath = '../Landing Page/index.html';
            } else {
                landingPagePath = './Landing Page/index.html';
            }
            
            // Navigate to landing page
            window.location.href = landingPagePath;
        });
        
        // Add pointer cursor to logo
        logo.style.cursor = 'pointer';
    }
    
    // Setup logout button
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Apply saved compact mode state
    const savedCompactMode = localStorage.getItem('compactMode');
    if (savedCompactMode === 'true') {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        if (sidebar && mainContent) {
            sidebar.classList.add('compact');
            mainContent.classList.add('expanded');
        }
    }

    // Setup project filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            filterProjects(btn.dataset.category);
        });
    });

    // Setup project sort
    const sortSelect = document.querySelector('#sortProjects');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProjects(e.target.value);
        });
    }

    // Add fade-in effect on page load
    document.documentElement.style.opacity = 0;
    setTimeout(() => {
        document.documentElement.style.opacity = 1;
        document.documentElement.style.transition = 'opacity 0.3s ease';
    }, 0);
}); 