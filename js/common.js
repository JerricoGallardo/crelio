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