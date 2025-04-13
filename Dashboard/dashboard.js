// Dashboard-specific functionality
function loadDashboardStats() {
    const totalProjects = document.querySelector('.stat-value.total-projects');
    const totalViews = document.querySelector('.stat-value.total-views');
    const totalDownloads = document.querySelector('.stat-value.total-downloads');

    // You would typically fetch these values from a server
    // For now, using placeholder values
    if (totalProjects) totalProjects.textContent = '12';
    if (totalViews) totalViews.textContent = '1,234';
    if (totalDownloads) totalDownloads.textContent = '567';
}

function loadRecentProjects() {
    const recentProjectsGrid = document.querySelector('.recent-projects .project-grid');
    if (!recentProjectsGrid) return;

    // You would typically fetch this data from a server
    const recentProjects = [
        {
            title: 'Portfolio Website',
            description: 'Personal portfolio showcasing my work',
            date: '2024-03-15',
            views: 245,
            category: 'Web Development'
        },
        {
            title: 'Task Manager App',
            description: 'A simple task management application',
            date: '2024-03-10',
            views: 180,
            category: 'Application'
        },
        {
            title: 'E-commerce Template',
            description: 'Responsive e-commerce website template',
            date: '2024-03-05',
            views: 320,
            category: 'Web Development'
        }
    ];

    recentProjectsGrid.innerHTML = recentProjects.map(project => `
        <div class="project-card" data-category="${project.category}" data-date="${project.date}" data-views="${project.views}">
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-date">${new Date(project.date).toLocaleDateString()}</span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-footer">
                <span class="project-category">${project.category}</span>
                <span class="project-views">${project.views} views</span>
            </div>
        </div>
    `).join('');
}

function initializeDashboard() {
    loadDashboardStats();
    loadRecentProjects();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);