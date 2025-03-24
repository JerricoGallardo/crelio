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
});

function toggleProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.toggle('active');
    }
}

// Better approach
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Do not add active class on hover
      // Or provide visual feedback without adding the active class
    });
    
    item.addEventListener('click', () => {
      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.classList.remove('active');
      });
      // Add active class only to the clicked item
      item.classList.add('active');
    });
  });

document.documentElement.style.opacity = 0;
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.documentElement.style.opacity = 1;
        document.documentElement.style.transition = 'opacity 0.3s ease';
    }, 0);
});