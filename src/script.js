// Apply stored preferences for dark mode and compact mode
function applyPreferences() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    document.body.setAttribute('data-theme', darkModeEnabled ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkModeEnabled);

    const compactModeEnabled = localStorage.getItem('compactMode') === 'true';
    document.body.classList.toggle('compact-mode', compactModeEnabled);

    // Set toggle switch states if they exist
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.checked = darkModeEnabled;
}

// Toggle Dark Mode
function toggleDarkMode() {
    const darkModeEnabled = document.body.classList.toggle('dark-mode');
    document.body.setAttribute('data-theme', darkModeEnabled ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
}

// Toggle Compact Mode
function toggleCompactMode() {
    const compactModeEnabled = document.body.classList.toggle('compact-mode');
    localStorage.setItem('compactMode', compactModeEnabled);
    showToast(`Compact mode ${compactModeEnabled ? 'enabled' : 'disabled'}`, 'info');
}

// Toggle Profile Menu
function toggleProfileMenu(event) {
    event.stopPropagation();
    document.getElementById('profileMenu').classList.toggle('active');
}

// Close profile menu when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.profile-trigger, #profileMenu')) {
        document.getElementById('profileMenu')?.classList.remove('active');
    }
});

// Handle Feedback Form Submission
function handleFeedbackSubmit(event) {
    event.preventDefault();
    showToast('Thank you for your feedback!', 'success');
    event.target.reset();
}

// Smooth Scroll for Navigation
function smoothScroll(event) {
    const targetId = this.getAttribute('href');
    if (targetId.startsWith('#')) {
        event.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Highlight Active Navigation on Scroll
function highlightNavOnScroll() {
    const scrollPosition = window.scrollY;
    document.querySelectorAll('section[id]').forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const link = document.querySelector(`.nav-menu a[href="#${section.id}"]`);
        if (scrollPosition >= top && scrollPosition < bottom) {
            link?.classList.add('active');
        } else {
            link?.classList.remove('active');
        }
    });
}

// Show Toast Notification
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;

    toastContainer.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    applyPreferences();

    document.getElementById('themeToggle')?.addEventListener('change', toggleDarkMode);
    document.getElementById('feedbackForm')?.addEventListener('submit', handleFeedbackSubmit);
    document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', smoothScroll));

    window.addEventListener('scroll', highlightNavOnScroll);
});
