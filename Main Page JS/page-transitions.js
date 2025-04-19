/**
 * Page Transitions
 * This script adds smooth transitions between pages when navigating
 * Optimized for performance and responsiveness
 */

// Initialize the page transition system
function initPageTransitions() {
    // Add transition styles to the document
    addTransitionStyles();

    // Add event listeners to all navigation links
    setupNavigationLinks();

    // Add fade-in effect when the page loads
    fadeInOnLoad();

    // Cache the next page when hovering over links for faster transitions
    setupLinkPreloading();
}

// Add the necessary CSS for transitions
function addTransitionStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 1;
            transition: opacity 0.15s ease-out;
            will-change: opacity;
        }

        body.page-transitioning {
            opacity: 0;
            pointer-events: none;
        }

        .nav-item, .action-card, a[href]:not([href="#"]) {
            transition: transform 0.15s ease-out;
            will-change: transform;
        }

        .nav-item:hover, .action-card:hover {
            transform: translateY(-2px);
        }

        /* Optimize rendering performance */
        .sidebar, .main-content {
            backface-visibility: hidden;
            transform: translateZ(0);
        }
    `;
    document.head.appendChild(style);
}

// Set up event listeners for navigation links
function setupNavigationLinks() {
    // Select all navigation links that point to other pages
    const navLinks = document.querySelectorAll('.nav-item[href]:not([href="#"]), .action-card[href], a[href]:not([href="#"]):not([target="_blank"]):not([download])');

    navLinks.forEach(link => {
        // Skip links that have already been processed
        if (link.getAttribute('data-transition-processed')) return;

        // Mark this link as processed
        link.setAttribute('data-transition-processed', 'true');

        // Add click event listener
        link.addEventListener('click', handleLinkClick);
    });
}

// Preload pages when hovering over links for faster transitions
function setupLinkPreloading() {
    const navLinks = document.querySelectorAll('.nav-item[href]:not([href="#"]), .action-card[href]');

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const url = this.getAttribute('href');
            if (url && !url.startsWith('#') && !url.startsWith('javascript:') &&
                !url.startsWith('http://') && !url.startsWith('https://') &&
                !url.startsWith('mailto:') && !url.startsWith('tel:')) {

                // Create a prefetch link
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = url;
                document.head.appendChild(prefetchLink);
            }
        });
    });
}

// Handle link clicks
function handleLinkClick(event) {
    // Skip if modifier keys are pressed (new tab, download, etc.)
    if (event.ctrlKey || event.metaKey || event.shiftKey) return;

    // Get the target URL
    const targetUrl = this.getAttribute('href');

    // Skip for external links, anchors, or javascript: links
    if (!targetUrl ||
        targetUrl.startsWith('#') ||
        targetUrl.startsWith('javascript:') ||
        targetUrl.startsWith('http://') ||
        targetUrl.startsWith('https://') ||
        targetUrl.startsWith('mailto:') ||
        targetUrl.startsWith('tel:')) {
        return;
    }

    // Prevent default navigation
    event.preventDefault();

    // Start the transition
    transitionToPage(targetUrl);
}

// Perform the page transition
function transitionToPage(url) {
    // Add the transitioning class to fade out
    document.body.classList.add('page-transitioning');

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
        // Wait for the fade-out animation to complete
        setTimeout(() => {
            // Navigate to the new page
            window.location.href = url;
        }, 150); // Match this to the CSS transition duration
    });
}

// Add fade-in effect when the page loads
function fadeInOnLoad() {
    // Set initial opacity to 0
    document.body.style.opacity = '0';

    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
}

// Initialize when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    // DOM already loaded, initialize immediately
    initPageTransitions();
}

// Re-initialize when the page is fully loaded (for dynamically added links)
window.addEventListener('load', () => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(setupNavigationLinks);
});
