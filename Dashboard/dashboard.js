// Main navigation function
function initializeNavigation() {
    // Get navigation elements
    const dashboardLink = document.querySelector('.nav-item:has(.fa-tachometer-alt)');
    const myProjectsLink = document.querySelector('.nav-item:has(.fa-folder)');
    
    // Get content containers (we'll create/load these)
    let dashboardContent = document.querySelector('.content-wrapper');
    let myProjectsContent = null;
    
    // Store the original dashboard content
    const originalDashboardContent = dashboardContent.innerHTML;
    
    // Function to load My Projects content
    function loadMyProjectsContent() {
        // If we haven't loaded it yet, fetch it
        if (!myProjectsContent) {
            // Normally we would fetch the content from the server
            // For now, we'll just create a placeholder based on your HTML
            myProjectsContent = document.createElement('div');
            myProjectsContent.className = 'content-wrapper';
            
            // Use fetch to get the content from myprojects.html
            fetch('myprojects.html')
                .then(response => response.text())
                .then(html => {
                    // Extract just the content-wrapper part from the full HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const contentWrapper = doc.querySelector('.content-wrapper');
                    
                    if (contentWrapper) {
                        myProjectsContent.innerHTML = contentWrapper.innerHTML;
                    } else {
                        console.error('Could not find content-wrapper in myprojects.html');
                    }
                })
                .catch(error => {
                    console.error('Error loading myprojects.html:', error);
                    // Fallback if fetch fails
                    myProjectsContent.innerHTML = `
                        <div class="page-header">
                            <h1>My Projects</h1>
                            <div class="header-actions">
                                <div class="search-bar">
                                    <i class="fas fa-search"></i>
                                    <input type="text" placeholder="Search projects...">
                                </div>
                                <a href="#" class="btn">Create New Project</a>
                            </div>
                        </div>
                        
                        <!-- Content from myprojects.html would be loaded here -->
                    `;
                });
        }
        
        // Update the active navigation item
        dashboardLink.classList.remove('active');
        myProjectsLink.classList.add('active');
        
        // Swap the content
        dashboardContent.replaceWith(myProjectsContent);
        dashboardContent = myProjectsContent;
        
        // Update browser history (optional)
        history.pushState({page: 'myprojects'}, 'My Projects', '#myprojects');
        
        // Update page title
        document.title = 'Crealio - My Projects';
    }
    
    // Function to load Dashboard content
    function loadDashboardContent() {
        // Create a new container for dashboard if needed
        if (!dashboardContent || dashboardContent !== document.querySelector('.content-wrapper')) {
            const newDashboardContent = document.createElement('div');
            newDashboardContent.className = 'content-wrapper';
            newDashboardContent.innerHTML = originalDashboardContent;
            
            // Swap the content
            document.querySelector('.content-wrapper').replaceWith(newDashboardContent);
            dashboardContent = newDashboardContent;
        }
        
        // Update the active navigation item
        myProjectsLink.classList.remove('active');
        dashboardLink.classList.add('active');
        
        // Update browser history (optional)
        history.pushState({page: 'dashboard'}, 'Dashboard', '#dashboard');
        
        // Update page title
        document.title = 'Crealio - Dashboard';
    }
    
    // Add event listeners to navigation items
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadDashboardContent();
    });
    
    myProjectsLink.addEventListener('click', function(e) {
        e.preventDefault();
        loadMyProjectsContent();
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            if (event.state.page === 'dashboard') {
                loadDashboardContent();
            } else if (event.state.page === 'myprojects') {
                loadMyProjectsContent();
            }
        }
    });
    
    // Initialize browser history
    history.replaceState({page: 'dashboard'}, 'Dashboard', '#dashboard');
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

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

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    themeManager.initialize();
    
    // Load user data from localStorage
    loadUserData();
});

// Function to load user data from localStorage
function loadUserData() {
    const userAuth = localStorage.getItem('userAuth');
    
    if (!userAuth) {
        // If no valid user auth found, redirect to login page
        window.location.href = '../login.html';
        return;
    }
    
    try {
        const userData = JSON.parse(userAuth);
        if (!userData || !userData.isLoggedIn) {
            // If user is not logged in, redirect to login page
            window.location.href = '../login.html';
            return;
        }
        
        // Update username in the dashboard
        const usernameElements = document.querySelectorAll('.user-info h4');
        const emailElements = document.querySelectorAll('.user-info p');
        const welcomeMessage = document.querySelector('.card-title');
        
        // Update username display
        if (userData.name) {
            usernameElements.forEach(element => {
                element.textContent = userData.name;
            });
            
            // Update welcome message if it exists
            if (welcomeMessage && welcomeMessage.textContent.includes('Welcome back')) {
                welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
            }
        }
        
        // Update email display
        if (userData.email) {
            emailElements.forEach(element => {
                element.textContent = userData.email;
            });
        }
    } catch (error) {
        console.error('Error parsing user auth data:', error);
        // If error parsing user data, redirect to login page
        window.location.href = '../login.html';
    }
}

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('active');
    }
}

document.querySelectorAll('.nav-item:not(.with-submenu)').forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all non-submenu nav items
        document.querySelectorAll('.nav-item:not(.with-submenu)').forEach(navItem => {
            navItem.classList.remove('active');
        });
        // Add active class only to the clicked item
        item.classList.add('active');
        
        // Check if sidebar is collapsed and maintain that state
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        // If sidebar is collapsed, ensure it stays collapsed after navigation
        if (isCollapsed) {
            // Use setTimeout to ensure this happens after the page navigation
            setTimeout(() => {
                const newSidebar = document.querySelector('.sidebar');
                const newMainContent = document.querySelector('.main-content');
                if (newSidebar && !newSidebar.classList.contains('collapsed')) {
                    newSidebar.classList.add('collapsed');
                }
                if (newMainContent && !newMainContent.classList.contains('expanded')) {
                    newMainContent.classList.add('expanded');
                }
            }, 100);
        }
    });
});

// For submenu items, handle them separately
document.querySelectorAll('.submenu .nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent bubbling up to parent
        // Remove active class from all submenu items
        document.querySelectorAll('.submenu .nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        // Add active class only to the clicked submenu item
        item.classList.add('active');
        
        // Check if sidebar is collapsed and maintain that state
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        const isCollapsed = sidebar.classList.contains('collapsed');
        
        // If sidebar is collapsed, ensure it stays collapsed after navigation
        if (isCollapsed) {
            // Use setTimeout to ensure this happens after the page navigation
            setTimeout(() => {
                const newSidebar = document.querySelector('.sidebar');
                const newMainContent = document.querySelector('.main-content');
                if (newSidebar && !newSidebar.classList.contains('collapsed')) {
                    newSidebar.classList.add('collapsed');
                }
                if (newMainContent && !newMainContent.classList.contains('expanded')) {
                    newMainContent.classList.add('expanded');
                }
            }, 100);
        }
    });
});

document.documentElement.style.opacity = 0;
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.documentElement.style.opacity = 1;
        document.documentElement.style.transition = 'opacity 0.3s ease';
    }, 0);
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Store the sidebar state in localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Add a sidebar toggle button
function createSidebarToggleButton() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('sidebar-toggle');
    toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    toggleButton.addEventListener('click', () => {
        toggleSidebar();
        // Toggle the chevron direction
        toggleButton.querySelector('i').classList.toggle('fa-chevron-left');
        toggleButton.querySelector('i').classList.toggle('fa-chevron-right');
    });
    sidebar.appendChild(toggleButton);
    
    // Add a hidden element to store the sidebar state
    const sidebarState = document.createElement('div');
    sidebarState.classList.add('sidebar-state');
    sidebarState.setAttribute('data-collapsed', localStorage.getItem('sidebarCollapsed') === 'true');
    sidebar.appendChild(sidebarState);
    
    // Apply the saved sidebar state on page load
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        sidebar.classList.add('collapsed');
        document.querySelector('.main-content').classList.add('expanded');
        toggleButton.querySelector('i').classList.remove('fa-chevron-left');
        toggleButton.querySelector('i').classList.add('fa-chevron-right');
    }
}

// Initialize the sidebar toggle button when the page loads
document.addEventListener('DOMContentLoaded', createSidebarToggleButton);

// Toggle Profile Menu
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    profileMenu.classList.toggle('active');
}


document.addEventListener('DOMContentLoaded', function() {
    // Get the logo element
    const logo = document.querySelector('.logo');
    
    // Add click event listener
    if (logo) {
        logo.addEventListener('click', function() {
            // Get the current page path
            const currentPath = window.location.pathname;
            
            // Determine the correct landing page path based on the current directory depth
            let landingPagePath;
            
            // Check if we're in a nested directory like "Create New"
            if (currentPath.includes('/Create New/')) {
                landingPagePath = '../../Landing Page/index.html';
            } else {
                landingPagePath = '../Landing Page/index.html';
            }
            
            // Navigate to landing page
            window.location.href = landingPagePath;
            
            // Log for debugging
            console.log('Navigating to:', landingPagePath, 'from:', currentPath);
        });
    }
});

// Toast notification system
const toastManager = {
    showToast: function(message, type = 'success') {
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
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add toast to container
        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Function to handle logout
function handleLogout() {
    // Clear user authentication data
    localStorage.removeItem('userAuth');
    
    // Show success message
    toastManager.showToast('Successfully logged out');
    
    // Redirect to landing page after a short delay
    setTimeout(() => {
        window.location.href = '../Landing Page/index.html';
    }, 1000);
}

// Add event listener to logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
});