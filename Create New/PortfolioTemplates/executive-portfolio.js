// This file enhances the Browny template JS functionality
// It adds custom behavior for the Executive Portfolio template

document.addEventListener('DOMContentLoaded', function() {
    console.log('Executive Portfolio Template Loaded');

    // Initialize add/remove functionality for sections
    initializeAddRemoveControls();

    // Enable group text selection for better editing
    setupTextGroupSelection();
    
    // Ensure toolbar buttons work
    setupToolbarButtons();

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

    // Variables for toolbar hide/show functionality
    let lastScrollTop = 0;
    const toolbar = document.querySelector('.editor-toolbar');
    const mainNav = document.querySelector('.main-nav');
    const scrollThreshold = 10; // Minimum scroll amount to trigger hide/show

    // Update active navigation link on scroll and handle toolbar visibility
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY;

        // Handle toolbar visibility
        if (toolbar && mainNav) {
            // Determine scroll direction
            const scrollDirection = scrollPosition > lastScrollTop ? 'down' : 'up';

            // Only trigger if we've scrolled more than the threshold
            if (Math.abs(scrollPosition - lastScrollTop) > scrollThreshold) {
                if (scrollDirection === 'down' && scrollPosition > 100) {
                    // Scrolling down - hide toolbar
                    toolbar.style.transform = 'translateY(-100%)';
                    toolbar.style.transition = 'transform 0.3s ease-in-out';

                    // Move navigation to top position
                    mainNav.style.top = '0';
                    mainNav.style.transition = 'top 0.3s ease-in-out';
                } else {
                    // Scrolling up - show toolbar
                    toolbar.style.transform = 'translateY(0)';
                    toolbar.style.transition = 'transform 0.3s ease-in-out';

                    // Move navigation below toolbar
                    mainNav.style.top = '50px';
                    mainNav.style.transition = 'top 0.3s ease-in-out';
                }

                // Update last scroll position
                lastScrollTop = scrollPosition;
            }
        }

        // Update active navigation links
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
        // Add CSS for button animations
        const style = document.createElement('style');
        style.textContent = `
            .toolbar-button:hover {
                background-color: #e9ecef !important;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .toolbar-button:active {
                transform: translateY(1px);
                box-shadow: none;
            }

            .toolbar-button.clicked {
                transform: scale(0.95);
            }

            /* Preview mode styles */
            .preview-mode {
                background-color: rgba(255, 255, 255, 0.8) !important;
                backdrop-filter: blur(5px);
            }

            .preview-mode .edit-mode-only {
                display: none !important;
            }

            #preview-btn.active {
                background-color: #28a745 !important;
                color: white !important;
                border-color: #28a745 !important;
            }
        `;
        document.head.appendChild(style);

        // Add toolbar button classes for animations
        const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
        toolbarButtons.forEach(button => {
            button.classList.add('toolbar-button');

            // Add click animation
            button.addEventListener('click', function() {
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 200);
            });
        });

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

        // Undo/Redo buttons
        document.getElementById('undo-btn').addEventListener('click', function() {
            document.execCommand('undo', false, null);
        });

        document.getElementById('redo-btn').addEventListener('click', function() {
            document.execCommand('redo', false, null);
        });

        // Font family and size selectors
        document.getElementById('font-family-select').addEventListener('change', function() {
            const fontFamily = this.value;
            if (fontFamily) {
                document.execCommand('fontName', false, fontFamily);
            }
        });

        document.getElementById('font-size-select').addEventListener('change', function() {
            const fontSize = this.value;
            if (fontSize) {
                // We need to use CSS for font size since execCommand's fontSize is limited
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const span = document.createElement('span');
                    span.style.fontSize = fontSize;
                    range.surroundContents(span);
                }
            }
        });

        document.getElementById('save-btn').addEventListener('click', function() {
            alert('Changes saved successfully!');
            // In a real implementation, this would save the changes to a database or file
        });

        // Get toolbar elements
        const editorToolbar = document.querySelector('.editor-toolbar') || document.getElementById('editor-toolbar');
        const previewBtn = document.getElementById('preview-btn');
        const previewText = document.getElementById('preview-text') || previewBtn.querySelector('span');

        // Add preview mode functionality
        previewBtn.addEventListener('click', function() {
            const editables = document.querySelectorAll('[contenteditable="true"]');
            const editableLinks = document.querySelectorAll('a[data-editable="true"]');
            const previewMode = this.getAttribute('data-preview') === 'true';

            if (previewMode) {
                // Switch back to edit mode
                editables.forEach(el => {
                    el.setAttribute('contenteditable', 'true');
                    el.style.background = '';
                });

                // Show section controls
                document.querySelectorAll('.section-controls').forEach(control => {
                    control.style.display = 'flex';
                });

                // Show item controls
                document.querySelectorAll('.item-controls').forEach(control => {
                    control.style.display = 'flex';
                });

                // Re-enable link editing
                document.querySelectorAll('a[data-editable="true"]').forEach(link => {
                    // Re-attach the click event listeners
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Check if this is a portfolio title link
                        if (this.hasAttribute('data-title')) {
                            // Get the current title and URL
                            const span = this.querySelector('span');
                            const currentTitle = span.textContent;
                            const currentUrl = this.getAttribute('href');
                            const displayUrl = currentUrl === '#' ? '' : currentUrl;

                            // Create a custom edit dialog
                            const editDialog = document.createElement('div');
                            editDialog.className = 'portfolio-edit-dialog';
                            editDialog.style.position = 'fixed';
                            editDialog.style.top = '50%';
                            editDialog.style.left = '50%';
                            editDialog.style.transform = 'translate(-50%, -50%)';
                            editDialog.style.backgroundColor = 'white';
                            editDialog.style.padding = '20px';
                            editDialog.style.borderRadius = '5px';
                            editDialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
                            editDialog.style.zIndex = '10000';
                            editDialog.style.minWidth = '300px';

                            // Add dialog content
                            editDialog.innerHTML = `
                                <h3 style="margin-top: 0; margin-bottom: 15px;">Edit Portfolio Item</h3>
                                <div style="margin-bottom: 15px;">
                                    <label for="portfolio-title-input" style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
                                    <input type="text" id="portfolio-title-input" value="${currentTitle}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div style="margin-bottom: 15px;">
                                    <label for="portfolio-url-input" style="display: block; margin-bottom: 5px; font-weight: bold;">URL:</label>
                                    <input type="text" id="portfolio-url-input" value="${displayUrl}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <button id="cancel-portfolio-edit" style="margin-right: 10px; padding: 8px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancel</button>
                                    <button id="save-portfolio-edit" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                                </div>
                            `;

                            // Add the dialog to the document
                            document.body.appendChild(editDialog);

                            // Focus on the title input
                            setTimeout(() => {
                                document.getElementById('portfolio-title-input').focus();
                            }, 100);

                            // Handle cancel button
                            document.getElementById('cancel-portfolio-edit').addEventListener('click', function() {
                                document.body.removeChild(editDialog);
                            });

                            // Handle save button
                            document.getElementById('save-portfolio-edit').addEventListener('click', function() {
                                const newTitle = document.getElementById('portfolio-title-input').value;
                                const newUrl = document.getElementById('portfolio-url-input').value;

                                // Update the title and URL
                                span.textContent = newTitle;
                                link.setAttribute('href', newUrl || '#');

                                // Remove the dialog
                                document.body.removeChild(editDialog);
                            });

                            // Close dialog when clicking outside or pressing Escape
                            function handleOutsideClick(e) {
                                if (!editDialog.contains(e.target)) {
                                    document.body.removeChild(editDialog);
                                    document.removeEventListener('mousedown', handleOutsideClick);
                                }
                            }

                            function handleEscapeKey(e) {
                                if (e.key === 'Escape') {
                                    document.body.removeChild(editDialog);
                                    document.removeEventListener('keydown', handleEscapeKey);
                                }
                            }

                            // Add event listeners with a slight delay to prevent immediate triggering
                            setTimeout(() => {
                                document.addEventListener('mousedown', handleOutsideClick);
                                document.addEventListener('keydown', handleEscapeKey);
                            }, 100);
                        } else {
                            // Regular social media link
                            const currentUrl = this.getAttribute('href');
                            const displayUrl = currentUrl === '#' ? '' : currentUrl;

                            // Create a custom URL edit dialog
                            const urlDialog = document.createElement('div');
                            urlDialog.className = 'url-edit-dialog';
                            urlDialog.style.position = 'fixed';
                            urlDialog.style.top = '50%';
                            urlDialog.style.left = '50%';
                            urlDialog.style.transform = 'translate(-50%, -50%)';
                            urlDialog.style.backgroundColor = 'white';
                            urlDialog.style.padding = '20px';
                            urlDialog.style.borderRadius = '5px';
                            urlDialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
                            urlDialog.style.zIndex = '10000';
                            urlDialog.style.minWidth = '300px';

                            // Add dialog content
                            urlDialog.innerHTML = `
                                <h3 style="margin-top: 0; margin-bottom: 15px;">Edit Social Media URL</h3>
                                <input type="text" id="social-url-input" value="${displayUrl}" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px;">
                                <div style="display: flex; justify-content: flex-end;">
                                    <button id="cancel-social-url" style="margin-right: 10px; padding: 8px 15px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">Cancel</button>
                                    <button id="save-social-url" style="padding: 8px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                                </div>
                            `;

                            // Add the dialog to the document
                            document.body.appendChild(urlDialog);

                            // Focus on the URL input
                            setTimeout(() => {
                                document.getElementById('social-url-input').focus();
                            }, 100);

                            // Handle cancel button
                            document.getElementById('cancel-social-url').addEventListener('click', function() {
                                document.body.removeChild(urlDialog);
                            });

                            // Handle save button
                            document.getElementById('save-social-url').addEventListener('click', function() {
                                const newUrl = document.getElementById('social-url-input').value;

                                // Update the URL
                                link.setAttribute('href', newUrl || '#');

                                // Remove the dialog
                                document.body.removeChild(urlDialog);
                            });

                            // Close dialog when clicking outside or pressing Escape
                            function handleOutsideClick(e) {
                                if (!urlDialog.contains(e.target)) {
                                    document.body.removeChild(urlDialog);
                                    document.removeEventListener('mousedown', handleOutsideClick);
                                }
                            }

                            function handleEscapeKey(e) {
                                if (e.key === 'Escape') {
                                    document.body.removeChild(urlDialog);
                                    document.removeEventListener('keydown', handleEscapeKey);
                                }
                            }

                            // Add event listeners with a slight delay to prevent immediate triggering
                            setTimeout(() => {
                                document.addEventListener('mousedown', handleOutsideClick);
                                document.addEventListener('keydown', handleEscapeKey);
                            }, 100);
                        }
                    });
                });

                this.setAttribute('data-preview', 'false');
                if (previewText) {
                    previewText.textContent = 'Preview';
                } else {
                    this.innerHTML = '<i class="fa fa-eye" style="margin-right: 5px;"></i> Preview';
                }
                this.classList.remove('active');
                editorToolbar.classList.remove('preview-mode');
                editorToolbar.style.opacity = '1';

                // Show edit mode elements
                document.querySelectorAll('.edit-mode-only').forEach(el => {
                    el.style.display = '';
                });
            } else {
                // Switch to preview mode
                editables.forEach(el => {
                    el.setAttribute('contenteditable', 'false');
                    el.style.background = 'transparent';
                });

                // Hide section controls
                document.querySelectorAll('.section-controls').forEach(control => {
                    control.style.display = 'none';
                });

                // Hide item controls
                document.querySelectorAll('.item-controls').forEach(control => {
                    control.style.display = 'none';
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
                if (previewText) {
                    previewText.textContent = 'Edit';
                } else {
                    this.innerHTML = '<i class="fa fa-edit" style="margin-right: 5px;"></i> Edit';
                }
                this.classList.add('active');
                editorToolbar.classList.add('preview-mode');
                editorToolbar.style.opacity = '0.8';

                // Hide edit mode elements
                document.querySelectorAll('.edit-mode-only').forEach(el => {
                    el.style.display = 'none';
                });
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
                e.stopPropagation();

                // Get the current URL
                const currentUrl = this.getAttribute('href');
                const displayUrl = currentUrl === '#' ? '' : currentUrl;

                // Create a custom URL edit dialog
                const urlDialog = document.createElement('div');
                urlDialog.className = 'url-edit-dialog';
                urlDialog.style.position = 'fixed';
                urlDialog.style.top = '50%';
                urlDialog.style.left = '50%';
                urlDialog.style.transform = 'translate(-50%, -50%)';
                urlDialog.style.backgroundColor = 'white';
                urlDialog.style.padding = '20px';
                urlDialog.style.borderRadius = '5px';
                urlDialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
                urlDialog.style.zIndex = '10000';
                urlDialog.style.minWidth = '300px';

                // Create dialog elements manually instead of using innerHTML
                const heading = document.createElement('h3');
                heading.style.marginTop = '0';
                heading.style.marginBottom = '15px';
                heading.textContent = 'Edit Social Media URL';
                urlDialog.appendChild(heading);

                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'social-url-input';
                input.value = displayUrl;
                input.style.width = '100%';
                input.style.padding = '8px';
                input.style.marginBottom = '15px';
                input.style.border = '1px solid #ddd';
                input.style.borderRadius = '4px';
                urlDialog.appendChild(input);

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'flex-end';
                urlDialog.appendChild(buttonContainer);

                const cancelButton = document.createElement('button');
                cancelButton.id = 'cancel-social-url';
                cancelButton.textContent = 'Cancel';
                cancelButton.style.marginRight = '10px';
                cancelButton.style.padding = '8px 15px';
                cancelButton.style.background = '#f5f5f5';
                cancelButton.style.border = '1px solid #ddd';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.cursor = 'pointer';
                buttonContainer.appendChild(cancelButton);

                const saveButton = document.createElement('button');
                saveButton.id = 'save-social-url';
                saveButton.textContent = 'Save';
                saveButton.style.padding = '8px 15px';
                saveButton.style.background = '#007bff';
                saveButton.style.color = 'white';
                saveButton.style.border = 'none';
                saveButton.style.borderRadius = '4px';
                saveButton.style.cursor = 'pointer';
                buttonContainer.appendChild(saveButton);

                // Add the dialog to the document
                document.body.appendChild(urlDialog);

                // Focus on the URL input
                setTimeout(() => {
                    input.focus();
                }, 100);

                // Function to remove dialog
                function removeDialog() {
                    if (document.body.contains(urlDialog)) {
                        document.body.removeChild(urlDialog);
                        document.removeEventListener('mousedown', handleOutsideClick);
                        document.removeEventListener('keydown', handleEscapeKey);
                    }
                }

                // Handle cancel button
                cancelButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    removeDialog();
                });

                // Handle save button
                saveButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const newUrl = input.value;

                    // Update the URL
                    link.setAttribute('href', newUrl || '#');

                    // Remove the dialog
                    removeDialog();
                });

                // Close dialog when clicking outside
                function handleOutsideClick(e) {
                    if (!urlDialog.contains(e.target)) {
                        removeDialog();
                    }
                }

                // Close dialog when pressing Escape
                function handleEscapeKey(e) {
                    if (e.key === 'Escape') {
                        removeDialog();
                    }
                }

                // Add event listeners with a slight delay to prevent immediate triggering
                setTimeout(() => {
                    document.addEventListener('mousedown', handleOutsideClick);
                    document.addEventListener('keydown', handleEscapeKey);
                }, 100);
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

                // Create the form elements manually
                const heading = document.createElement('h3');
                heading.style.marginTop = '0';
                heading.style.color = '#333';
                heading.textContent = 'Edit Portfolio Item';
                modalContent.appendChild(heading);

                // Title input container
                const titleContainer = document.createElement('div');
                titleContainer.style.marginBottom = '15px';
                modalContent.appendChild(titleContainer);

                const titleLabel = document.createElement('label');
                titleLabel.setAttribute('for', 'portfolio-title');
                titleLabel.style.display = 'block';
                titleLabel.style.marginBottom = '5px';
                titleLabel.style.fontWeight = 'bold';
                titleLabel.textContent = 'Title:';
                titleContainer.appendChild(titleLabel);

                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.id = 'portfolio-title';
                titleInput.value = titleElement.textContent;
                titleInput.style.width = '100%';
                titleInput.style.padding = '8px';
                titleInput.style.border = '1px solid #ddd';
                titleInput.style.borderRadius = '4px';
                titleContainer.appendChild(titleInput);

                // URL input container
                const urlContainer = document.createElement('div');
                urlContainer.style.marginBottom = '20px';
                modalContent.appendChild(urlContainer);

                const urlLabel = document.createElement('label');
                urlLabel.setAttribute('for', 'portfolio-url');
                urlLabel.style.display = 'block';
                urlLabel.style.marginBottom = '5px';
                urlLabel.style.fontWeight = 'bold';
                urlLabel.textContent = 'URL:';
                urlContainer.appendChild(urlLabel);

                const urlInput = document.createElement('input');
                urlInput.type = 'text';
                urlInput.id = 'portfolio-url';
                urlInput.value = '';
                urlInput.style.width = '100%';
                urlInput.style.padding = '8px';
                urlInput.style.border = '1px solid #ddd';
                urlInput.style.borderRadius = '4px';
                urlInput.placeholder = 'https://example.com';
                urlContainer.appendChild(urlInput);

                // Button container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'flex-end';
                modalContent.appendChild(buttonContainer);

                const cancelButton = document.createElement('button');
                cancelButton.id = 'cancel-edit';
                cancelButton.textContent = 'Cancel';
                cancelButton.style.marginRight = '10px';
                cancelButton.style.padding = '8px 15px';
                cancelButton.style.background = '#f5f5f5';
                cancelButton.style.border = '1px solid #ddd';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.cursor = 'pointer';
                buttonContainer.appendChild(cancelButton);

                const saveButton = document.createElement('button');
                saveButton.id = 'save-edit';
                saveButton.textContent = 'Save Changes';
                saveButton.style.padding = '8px 15px';
                saveButton.style.background = '#007bff';
                saveButton.style.color = 'white';
                saveButton.style.border = 'none';
                saveButton.style.borderRadius = '4px';
                saveButton.style.cursor = 'pointer';
                buttonContainer.appendChild(saveButton);

                // Add the modal to the document
                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                // Focus on the title input
                setTimeout(() => {
                    document.getElementById('portfolio-title').focus();
                }, 100);

                // Function to remove modal
                function removeModal() {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }

                // Handle cancel button
                cancelButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    removeModal();
                });

                // Handle save button
                saveButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    const newTitle = titleInput.value;
                    const newUrl = urlInput.value;

                    // Update the title
                    titleElement.textContent = newTitle;

                    // Store the URL as a data attribute for future use
                    titleElement.setAttribute('data-url', newUrl || '#');

                    // Remove the modal
                    removeModal();
                });

                // Close modal when clicking outside
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        removeModal();
                    }
                });

                // Close modal when pressing Escape
                function handleEscapeKey(e) {
                    if (e.key === 'Escape') {
                        removeModal();
                        document.removeEventListener('keydown', handleEscapeKey);
                    }
                }

                // Add escape key listener
                document.addEventListener('keydown', handleEscapeKey);
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

// Function to initialize add/remove controls for sections
function initializeAddRemoveControls() {
    // Education section controls
    const addEducationBtn = document.getElementById('add-education-btn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', function() {
            const educationContainer = document.querySelector('.education-horizontal-timeline .row');
            const educationItems = educationContainer.querySelectorAll('.single-horizontal-timeline');
            const lastItem = educationItems[educationItems.length - 1];

            if (lastItem) {
                const newItem = lastItem.cloneNode(true);
                const newCol = document.createElement('div');
                newCol.className = 'col-sm-4';
                newCol.appendChild(newItem);

                // Reset content to be editable
                newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                    if (el.tagName === 'H2') {
                        el.textContent = 'YYYY - YYYY';
                    } else if (el.tagName === 'H3') {
                        el.textContent = 'Degree Title';
                    } else if (el.tagName === 'SPAN') {
                        el.textContent = 'Institution Name';
                    } else if (el.tagName === 'H5') {
                        el.textContent = 'Location';
                    } else if (el.tagName === 'P') {
                        el.textContent = 'Description of your education and achievements.';
                    }
                });

                // Add remove button functionality
                const removeBtn = newItem.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newCol.remove();
                    });
                }

                educationContainer.appendChild(newCol);
            }
        });
    }

    // Add remove functionality to existing education items
    document.querySelectorAll('.single-horizontal-timeline .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.col-sm-4');
            if (item) {
                // Don't remove if it's the last item
                const container = item.parentElement;
                if (container.querySelectorAll('.col-sm-4').length > 1) {
                    item.remove();
                } else {
                    alert('Cannot remove the last education item. You need at least one.');
                }
            }
        });
    });

    // Skills section controls
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const skillContainers = document.querySelectorAll('.single-skill-content');
            
            // Find the container with fewer skills to balance the columns
            const leftContainer = skillContainers[0];
            const rightContainer = skillContainers[1];
            
            // Count skills in each column
            const leftSkillsCount = leftContainer.querySelectorAll('.barWrapper').length;
            const rightSkillsCount = rightContainer.querySelectorAll('.barWrapper').length;
            
            // Choose the container with fewer skills
            const targetContainer = leftSkillsCount <= rightSkillsCount ? leftContainer : rightContainer;
            const lastSkill = targetContainer.querySelector('.barWrapper:last-child');

            if (lastSkill) {
                const newSkill = lastSkill.cloneNode(true);

                // Reset content to be editable
                newSkill.querySelector('.progressText').textContent = 'New Skill';
                newSkill.querySelector('h3').textContent = '80%';

                // Set progress bar value
                const progressBar = newSkill.querySelector('.progress-bar');
                progressBar.setAttribute('aria-valuenow', '80');
                progressBar.style.width = '80%';

                // Add remove button functionality
                const removeBtn = newSkill.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newSkill.remove();
                    });
                }

                targetContainer.appendChild(newSkill);
            }
        });
    }

    // Add remove functionality to existing skill items
    document.querySelectorAll('.barWrapper .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.barWrapper');
            if (item) {
                // Don't remove if it's the last skill in the container
                const container = item.parentElement;
                if (container.querySelectorAll('.barWrapper').length > 1) {
                    item.remove();
                } else {
                    alert('Cannot remove the last skill. You need at least one skill in each column.');
                }
            }
        });
    });

    // Experience section controls
    const addExperienceBtn = document.getElementById('add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', function() {
            const experienceContainer = document.querySelector('.main-timeline ul');
            const experienceItems = experienceContainer.querySelectorAll('li');
            const lastItem = experienceItems[experienceItems.length - 1];

            if (lastItem) {
                const newItem = lastItem.cloneNode(true);

                // Reset content to be editable
                newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                    if (el.tagName === 'H2' || el.tagName === 'SPAN' && el.closest('h2')) {
                        el.textContent = 'YYYY - YYYY';
                    } else if (el.tagName === 'H3') {
                        el.textContent = 'Job Title';
                    } else if (el.tagName === 'SPAN' && el.closest('h4')) {
                        el.textContent = 'Company Name';
                    } else if (el.tagName === 'H5') {
                        el.textContent = 'Location';
                    } else if (el.tagName === 'P') {
                        el.textContent = 'Description of your responsibilities and achievements.';
                    }
                });

                // Add remove button functionality
                const removeBtn = newItem.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newItem.remove();
                    });
                }

                experienceContainer.appendChild(newItem);
            }
        });
    }

    // Add remove functionality to existing experience items
    document.querySelectorAll('.single-timeline-box .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('li');
            if (item) {
                // Don't remove if it's the last item
                const container = item.parentElement;
                if (container.querySelectorAll('li').length > 1) {
                    item.remove();
                } else {
                    alert('Cannot remove the last experience item. You need at least one.');
                }
            }
        });
    });

    // Portfolio section controls
    const addPortfolioBtn = document.getElementById('add-portfolio-btn');
    if (addPortfolioBtn) {
        addPortfolioBtn.addEventListener('click', function() {
            const portfolioContainer = document.querySelector('.portfolio .row');
            const portfolioItems = portfolioContainer.querySelectorAll('.item');
            const lastItem = portfolioItems[portfolioItems.length - 1];

            if (lastItem) {
                const newItem = lastItem.cloneNode(true);
                const newCol = document.createElement('div');
                newCol.className = 'col-sm-4';
                newCol.appendChild(newItem);

                // Reset content and generate unique IDs
                const newId = 'portfolio-image-' + (portfolioItems.length + 1);
                const newUploadId = 'portfolio-image-upload-' + (portfolioItems.length + 1);

                const img = newItem.querySelector('img');
                img.id = newId;
                img.src = 'browny-assets/images/portfolio/p1.jpg'; // Default image

                const fileInput = newItem.querySelector('input[type="file"]');
                fileInput.id = newUploadId;

                const uploadBtn = newItem.querySelector('.image-upload-btn');
                uploadBtn.setAttribute('onclick', `document.getElementById('${newUploadId}').click()`);

                // Reset title
                const title = newItem.querySelector('[data-title]');
                if (title) {
                    title.textContent = 'NEW PORTFOLIO ITEM';
                }

                // Add remove button functionality
                const removeBtn = newItem.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newCol.remove();
                    });
                }

                // Add file upload functionality
                fileInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            img.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });

                portfolioContainer.appendChild(newCol);
            }
        });
    }

    // Add remove functionality to existing portfolio items
    document.querySelectorAll('.item .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.col-sm-4');
            if (item) {
                // Don't remove if it's the last item
                const container = item.parentElement;
                if (container.querySelectorAll('.col-sm-4').length > 1) {
                    item.remove();
                } else {
                    alert('Cannot remove the last portfolio item. You need at least one.');
                }
            }
        });
    });

    // Set initial state of mode indicators and controls
    document.querySelector('.edit-mode-indicator').style.display = 'inline-block';
    document.querySelector('.preview-mode-indicator').style.display = 'none';
}

// Add this new function at the end of the file
function setupTextGroupSelection() {
    // Get all text containers that should be group-selectable
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(element => {
        element.addEventListener('mousedown', function(e) {
            // When clicking on an editable element, select all its content
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Prevent default behavior to ensure our selection works
            e.preventDefault();
        });
    });
}

// Add this new function to ensure toolbar buttons work
function setupToolbarButtons() {
    // Get the main toolbar buttons - improve selectors to work with any toolbar
    const boldBtn = document.querySelector('#bold-btn, [data-command="bold"]');
    const italicBtn = document.querySelector('#italic-btn, [data-command="italic"]');
    const underlineBtn = document.querySelector('#underline-btn, [data-command="underline"]');
    const undoBtn = document.querySelector('#undo-btn, [data-command="undo"]');
    const redoBtn = document.querySelector('#redo-btn, [data-command="redo"]');
    const fontFamilySelect = document.querySelector('#font-family-select');
    const fontSizeSelect = document.querySelector('#font-size-select');
    
    // Create a function to execute command with improved functionality
    function execCommand(command, value = null) {
        // Focus back to the document to ensure command gets applied
        document.execCommand(command, false, value);
        
        // Force focus back to the document
        setTimeout(() => {
            // Try to restore selection if lost
            const selection = window.getSelection();
            if (selection.rangeCount === 0) {
                const lastFocused = document.activeElement;
                if (lastFocused && lastFocused.getAttribute('contenteditable') === 'true') {
                    lastFocused.focus();
                }
            }
        }, 10);
    }
    
    // Add event listeners to buttons if they exist
    if (boldBtn) {
        boldBtn.addEventListener('click', () => execCommand('bold'));
    }
    
    if (italicBtn) {
        italicBtn.addEventListener('click', () => execCommand('italic'));
    }
    
    if (underlineBtn) {
        underlineBtn.addEventListener('click', () => execCommand('underline'));
    }
    
    if (undoBtn) {
        undoBtn.addEventListener('click', () => execCommand('undo'));
    }
    
    if (redoBtn) {
        redoBtn.addEventListener('click', () => execCommand('redo'));
    }
    
    // Update font family select
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function() {
            if (this.value) {
                execCommand('fontName', this.value);
            }
        });
    }
    
    // Update font size select with improved functionality
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const fontSize = this.value;
            if (fontSize) {
                // Better font size implementation
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    
                    // Check if we have text selected or just a cursor position
                    if (range.collapsed) {
                        // Cursor only - create a wrapper span to insert
                        const span = document.createElement('span');
                        span.style.fontSize = fontSize;
                        span.innerHTML = '&nbsp;'; // Add a space to be able to continue typing
                        
                        range.insertNode(span);
                        
                        // Move cursor inside the span
                        range.setStart(span, 1);
                        range.setEnd(span, 1);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        // Text selected - wrap with span
                        const span = document.createElement('span');
                        span.style.fontSize = fontSize;
                        
                        // Wrap selected content in the span
                        range.surroundContents(span);
                    }
                }
            }
        });
    }
}