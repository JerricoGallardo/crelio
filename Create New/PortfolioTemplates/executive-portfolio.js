// This file enhances the Browny template JS functionality
// It adds custom behavior for the Executive Portfolio template

document.addEventListener('DOMContentLoaded', function() {
    console.log('Executive Portfolio Template Loaded');

    // Navigation functionality
    const navLinks = document.querySelectorAll('.smooth-menu a');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scroll when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Update active class
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active navigation link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Initialize progress bars with animation
    const progressBars = document.querySelectorAll('.progress-bar');

    // Function to animate progress bars when they come into view
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('aria-valuenow');
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (barPosition < screenPosition) {
                bar.style.width = width + '%';
            }
        });
    }

    // Initial call to animate progress bars that are already in view
    animateProgressBars();

    // Animate progress bars on scroll
    window.addEventListener('scroll', animateProgressBars);

    // Back to top button functionality
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.parentElement.parentElement.style.display = 'block';
            } else {
                scrollTopBtn.parentElement.parentElement.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Editor functionality
    const editMode = true; // Set to false to disable editing

    if (editMode) {
        // Handle toolbar buttons
        document.getElementById('bold-btn').addEventListener('click', function() {
            document.execCommand('bold', false, null);
        });

        document.getElementById('italic-btn').addEventListener('click', function() {
            document.execCommand('italic', false, null);
        });

        document.getElementById('underline-btn').addEventListener('click', function() {
            document.execCommand('underline', false, null);
        });

        document.getElementById('link-btn').addEventListener('click', function() {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        });

        document.getElementById('save-btn').addEventListener('click', function() {
            alert('Changes saved successfully!');
            // In a real implementation, this would save the changes to a database or file
        });

        document.getElementById('preview-btn').addEventListener('click', function() {
            const editables = document.querySelectorAll('[contenteditable="true"]');
            const editableLinks = document.querySelectorAll('a[data-editable="true"]');
            const previewMode = this.getAttribute('data-preview') === 'true';

            if (previewMode) {
                // Switch back to edit mode
                editables.forEach(el => {
                    el.setAttribute('contenteditable', 'true');
                    el.style.background = '';
                });

                // Re-enable link editing
                document.querySelectorAll('a[data-editable="true"]').forEach(link => {
                    // Re-attach the click event listeners
                    link.addEventListener('click', function(e) {
                        e.preventDefault();

                        // Check if this is a portfolio title link
                        if (this.hasAttribute('data-title')) {
                            // Edit the title
                            const span = this.querySelector('span');
                            const currentTitle = span.textContent;
                            const newTitle = prompt('Enter the portfolio item title:', currentTitle);
                            if (newTitle !== null) {
                                span.textContent = newTitle;
                            }

                            // Edit the link URL
                            const currentUrl = this.getAttribute('href');
                            const newUrl = prompt('Enter the URL for this portfolio item (leave empty for no link):', currentUrl === '#' ? '' : currentUrl);
                            if (newUrl !== null) {
                                this.setAttribute('href', newUrl);
                            }
                        } else {
                            // Regular social media link
                            const currentUrl = this.getAttribute('href');
                            const newUrl = prompt('Enter the social media profile URL:', currentUrl === '#' ? '' : currentUrl);
                            if (newUrl !== null) {
                                this.setAttribute('href', newUrl);
                            }
                        }
                    });
                });

                this.setAttribute('data-preview', 'false');
                this.innerHTML = '<i class="fa fa-eye"></i> Preview';
                document.querySelector('.editor-toolbar').style.opacity = '1';
            } else {
                // Switch to preview mode
                editables.forEach(el => {
                    el.setAttribute('contenteditable', 'false');
                    el.style.background = 'transparent';
                });

                // Disable social media link editing in preview mode but allow clicking
                editableLinks.forEach(link => {
                    // Store the original click handler
                    link.setAttribute('data-original-href', link.getAttribute('href'));

                    // Remove the click event listener temporarily
                    const oldLink = link.cloneNode(true);
                    link.parentNode.replaceChild(oldLink, link);
                });

                this.setAttribute('data-preview', 'true');
                this.innerHTML = '<i class="fa fa-edit"></i> Edit';
                document.querySelector('.editor-toolbar').style.opacity = '0.2';
            }
        });

        // Handle image uploads
        const profileImageUpload = document.getElementById('profile-image-upload');
        if (profileImageUpload) {
            profileImageUpload.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById('profile-image').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle portfolio image uploads
        for (let i = 1; i <= 5; i++) {
            const portfolioImageUpload = document.getElementById(`portfolio-image-upload-${i}`);
            const uploadButton = document.querySelector(`.image-upload-btn[onclick="document.getElementById('portfolio-image-upload-${i}').click()"]`);
            const imageContainer = uploadButton ? uploadButton.closest('.image-container') : null;

            if (portfolioImageUpload && uploadButton) {
                // Make sure the button is visible and clickable
                uploadButton.style.display = 'block';
                uploadButton.style.zIndex = '300';

                // Prevent event propagation to avoid conflicts
                uploadButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                // Prevent the isotope-overlay from appearing when hovering over the image
                if (imageContainer) {
                    const isotope = imageContainer.nextElementSibling;
                    if (isotope && isotope.classList.contains('isotope-overlay')) {
                        imageContainer.addEventListener('mouseenter', function() {
                            isotope.style.pointerEvents = 'none';
                        });
                        imageContainer.addEventListener('mouseleave', function() {
                            isotope.style.pointerEvents = '';
                        });
                    }
                }

                portfolioImageUpload.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const img = document.getElementById(`portfolio-image-${i}`);
                            if (img) {
                                img.src = e.target.result;
                                console.log(`Updated image ${i} with new file`);
                            } else {
                                console.error(`Could not find image element with id portfolio-image-${i}`);
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            } else {
                console.error(`Could not find elements for portfolio image ${i}`);
            }
        }

        // Update progress bar values when edited
        const progressValues = document.querySelectorAll('.single-progress-txt h3[contenteditable="true"]');
        progressValues.forEach(value => {
            value.addEventListener('input', function() {
                const percentage = parseInt(this.textContent);
                if (!isNaN(percentage)) {
                    const progressBar = this.parentElement.querySelector('.progress-bar');
                    progressBar.setAttribute('aria-valuenow', percentage);
                    progressBar.style.width = percentage + '%';
                }
            });
        });

        // Handle social media link editing
        const socialLinks = document.querySelectorAll('a[data-editable="true"]:not([data-title])');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const currentUrl = this.getAttribute('href');
                const newUrl = prompt('Enter the social media profile URL:', currentUrl === '#' ? '' : currentUrl);
                if (newUrl !== null) {
                    this.setAttribute('href', newUrl);
                }
            });
        });

        // Handle portfolio edit buttons
        const portfolioEditButtons = document.querySelectorAll('.portfolio-edit-btn');
        portfolioEditButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();

                // Get the parent item and h4
                const item = this.closest('.item');
                const titleElement = item.querySelector('h4[data-editable][data-title]');

                // Create a modal for editing
                const modal = document.createElement('div');
                modal.className = 'portfolio-edit-modal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000';

                // Create the modal content
                const modalContent = document.createElement('div');
                modalContent.style.backgroundColor = 'white';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '5px';
                modalContent.style.width = '400px';
                modalContent.style.maxWidth = '90%';

                // Create the form
                modalContent.innerHTML = `
                    <h3 style="margin-top: 0; color: #333;">Edit Portfolio Item</h3>
                    <div style="margin-bottom: 15px;">
                        <label for="portfolio-title" style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
                        <input type="text" id="portfolio-title" value="${titleElement.textContent}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 20px;">
                        <label for="portfolio-url" style="display: block; margin-bottom: 5px; font-weight: bold;">URL:</label>
                        <input type="text" id="portfolio-url" value="" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="https://example.com">
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button id="cancel-edit" style="margin-right: 10px; padding: 8px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancel</button>
                        <button id="save-edit" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
                    </div>
                `;

                // Add the modal to the document
                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                // Focus on the title input
                setTimeout(() => {
                    document.getElementById('portfolio-title').focus();
                }, 100);

                // Handle cancel button
                document.getElementById('cancel-edit').addEventListener('click', function() {
                    document.body.removeChild(modal);
                });

                // Handle save button
                document.getElementById('save-edit').addEventListener('click', function() {
                    const newTitle = document.getElementById('portfolio-title').value;
                    const newUrl = document.getElementById('portfolio-url').value;

                    // Update the title
                    titleElement.textContent = newTitle;

                    // Store the URL as a data attribute for future use
                    titleElement.setAttribute('data-url', newUrl || '#');

                    // Remove the modal
                    document.body.removeChild(modal);
                });

                // Close modal when clicking outside
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        document.body.removeChild(modal);
                    }
                });
            });
        });
    } else {
        // Hide editor toolbar if editing is disabled
        document.querySelector('.editor-toolbar').style.display = 'none';
        document.body.style.paddingTop = '0';

        // Disable contenteditable
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.setAttribute('contenteditable', 'false');
        });

        // Hide image upload overlays
        document.querySelectorAll('.image-upload-overlay').forEach(el => {
            el.style.display = 'none';
        });
    }
});
