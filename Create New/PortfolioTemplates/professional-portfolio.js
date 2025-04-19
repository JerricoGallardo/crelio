// Initialize variables
let undoStack = [];
let redoStack = [];
let editMode = true;

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Professional Portfolio Template Loaded');

    // Force reinitialization of isotope after a short delay
    setTimeout(function() {
        $('.portfolio-items').isotope('destroy');
        $('.portfolio-items').isotope({
            filter: '*',
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows',
            fitRows: {
                gutter: 0
            },
            percentPosition: true,
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
    }, 500);

    // Make all headings and paragraphs editable
    document.querySelectorAll('h1, h2, h3, h4, p, a.btn, small, strong, em').forEach(function(element) {
        // Skip elements that shouldn't be editable
        if (!element.closest('.count') && !element.closest('.percent')) {
            element.setAttribute('contenteditable', 'true');

            // Enable one-click editing without requiring text selection
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // If we're in edit mode, select all text on click for easier editing
                if (element.contentEditable === 'true') {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Focus the element
                    element.focus();
                }
            });
        }
    });

    // Initialize editor functionality
    initializeEditor();

    // Initialize add/remove functionality for sections
    initializeAddRemoveControls();

    // Initialize image uploads
    initializeImageUploads();

    // Initialize skills charts
    initializeSkillCharts();

    // Initialize counters
    initializeCounters();

    // Initialize portfolio filtering
    initializePortfolio();

    // Initialize navigation and smooth scrolling
    initializeNavigation();

    // Load saved state if available
    loadState();

    // Save initial state if no saved state was loaded
    if (undoStack.length === 0) {
        saveState();
    }
});

// Global variables for toolbar functionality
let lastScrollTop = 0;
let toolbarHidden = false;

// Function to show the toolbar
function showToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    const nav = document.querySelector('#nav');

    if (toolbar && nav) {
        toolbar.style.transform = 'translateY(0)';
        toolbar.style.transition = 'transform 0.3s ease-in-out';
        nav.style.top = '50px';
        nav.style.transition = 'top 0.3s ease-in-out';
        toolbarHidden = false;
    }
}

// Function to hide the toolbar
function hideToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    const nav = document.querySelector('#nav');

    if (toolbar && nav) {
        toolbar.style.transform = 'translateY(-100%)';
        toolbar.style.transition = 'transform 0.3s ease-in-out';
        nav.style.top = '0';
        nav.style.transition = 'top 0.3s ease-in-out';
        toolbarHidden = true;
    }
}

// Function to initialize navigation
function initializeNavigation() {
    // Variables for toolbar hide/show functionality
    const toolbar = document.querySelector('.editor-toolbar');
    const nav = document.querySelector('#nav');
    const scrollThreshold = 10; // Minimum scroll amount to trigger hide/show

    // Handle toolbar visibility on scroll
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();

        // Handle toolbar visibility
        if (toolbar && nav) {
            // Determine scroll direction
            const scrollDirection = scrollPos > lastScrollTop ? 'down' : 'up';

            // Only trigger if we've scrolled more than the threshold
            if (Math.abs(scrollPos - lastScrollTop) > scrollThreshold) {
                if (scrollDirection === 'down' && scrollPos > 100) {
                    // Scrolling down - hide toolbar
                    hideToolbar();
                } else {
                    // Scrolling up - show toolbar
                    showToolbar();
                }

                // Update last scroll position
                lastScrollTop = scrollPos;
            }
        }
    });
}

// Function to initialize skill charts
function initializeSkillCharts() {
    $('.chart').easyPieChart({
        scaleColor: false,
        lineWidth: 4,
        lineCap: 'butt',
        barColor: '#1CBB9B',
        trackColor: '#c8c8c8',
        size: 160,
        animate: 1000
    });
}

// Function to initialize counters
function initializeCounters() {
    $('.count').each(function() {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

// Function to initialize portfolio filtering
function initializePortfolio() {
    var $container = $('.portfolio-items');
    $container.isotope({
        filter: '*',
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows',
        fitRows: {
            gutter: 0
        },
        percentPosition: true,
        animationOptions: {
            duration: 750,
            easing: 'linear',
            queue: false
        }
    });

    // Initialize edit link buttons
    document.querySelectorAll('.edit-project-link').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            openProjectLinkModal(projectId);
        });
    });

    // Initialize visit project links
    document.querySelectorAll('.visit-project').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is # (not set yet)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Please set a project link first by clicking the "Edit Link" button.');
            }
        });
    });

    // Initialize save project link button
    const saveProjectLinkBtn = document.getElementById('save-project-link');
    if (saveProjectLinkBtn) {
        saveProjectLinkBtn.addEventListener('click', function() {
            saveProjectLink();
        });
    }
}

// Function to initialize editor
function initializeEditor() {
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

    // Initialize toolbar buttons
    document.getElementById('bold-btn').addEventListener('click', function() {
        document.execCommand('bold', false, null);
        saveState();
    });

    document.getElementById('italic-btn').addEventListener('click', function() {
        document.execCommand('italic', false, null);
        saveState();
    });

    document.getElementById('underline-btn').addEventListener('click', function() {
        document.execCommand('underline', false, null);
        saveState();
    });

    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);

    // Initialize preview button
    document.getElementById('preview-btn').addEventListener('click', togglePreview);

    // Initialize save button
    document.getElementById('save-btn').addEventListener('click', savePortfolio);

    // Initialize exit button
    document.getElementById('exit-btn').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
}

// Function to toggle preview mode
function togglePreview() {
    editMode = !editMode;
    const previewBtn = document.getElementById('preview-btn');
    const toolbar = document.querySelector('.editor-toolbar');

    if (!editMode) {
        // Enter preview mode
        document.body.classList.add('preview-mode');
        toolbar.classList.add('preview-mode');
        previewBtn.classList.add('active');
        previewBtn.innerHTML = '<i class="glyphicon glyphicon-pencil"></i> Edit';

        // Hide all edit controls
        document.querySelectorAll('.item-controls, .section-controls').forEach(control => {
            control.style.display = 'none';
        });

        // Disable contenteditable
        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            element.setAttribute('contenteditable', 'false');
        });
    } else {
        // Exit preview mode
        document.body.classList.remove('preview-mode');
        toolbar.classList.remove('preview-mode');
        previewBtn.classList.remove('active');
        previewBtn.innerHTML = '<i class="glyphicon glyphicon-eye-open"></i> Preview';

        // Show all edit controls
        document.querySelectorAll('.item-controls, .section-controls').forEach(control => {
            control.style.display = '';
        });

        // Enable contenteditable
        document.querySelectorAll('[contenteditable="false"]').forEach(element => {
            if (element.getAttribute('data-editable') !== 'false') {
                element.setAttribute('contenteditable', 'true');
            }
        });
    }
}

// Function to save the portfolio
function savePortfolio() {
    // Show a saving indicator
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="glyphicon glyphicon-refresh glyphicon-spin"></i> Saving...';
    saveBtn.disabled = true;

    // Simulate saving (in a real app, this would save to a server)
    setTimeout(function() {
        saveBtn.innerHTML = '<i class="glyphicon glyphicon-ok"></i> Saved!';

        // Reset button after a delay
        setTimeout(function() {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Function to initialize image uploads
function initializeImageUploads() {
    // About image upload
    const aboutUpload = document.getElementById('about-upload');
    if (aboutUpload) {
        aboutUpload.addEventListener('change', function() {
            handleImageUpload(this, 'about-image');
        });
    }

    // Portfolio image uploads
    document.querySelectorAll('input[type="file"][id^="portfolio-upload-"]').forEach(input => {
        input.addEventListener('change', function() {
            const imgId = input.id.replace('upload', 'image');
            handleImageUpload(this, imgId);
        });
    });
}

// Function to handle image uploads
function handleImageUpload(input, imgId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgElement = document.getElementById(imgId);
            imgElement.src = e.target.result;

            // If this is a portfolio image, also update the large image link
            if (imgId.startsWith('portfolio-image-')) {
                const portfolioItem = imgElement.closest('.portfolio-item');
                if (portfolioItem) {
                    const link = portfolioItem.querySelector('a[rel="prettyPhoto"]');
                    if (link) {
                        link.href = e.target.result;
                    }
                }
            }

            saveState();
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// Function to initialize add/remove controls for sections
function initializeAddRemoveControls() {
    // Skills section controls
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            // Find an existing skill to clone
            const existingSkill = document.querySelector('.skill');
            if (!existingSkill) {
                console.error('No existing skill found to clone');
                return;
            }

            // Clone the existing skill
            const newSkill = existingSkill.cloneNode(true);

            // Reset content
            newSkill.querySelector('h4').textContent = 'NEW SKILL';
            const chart = newSkill.querySelector('.chart');
            chart.setAttribute('data-percent', '75');
            const percent = newSkill.querySelector('.percent');
            percent.textContent = '75';

            // Add remove button functionality
            const removeBtn = newSkill.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    // Check if this is the last skill
                    const allSkills = document.querySelectorAll('.skill');
                    if (allSkills.length <= 1) {
                        alert('Cannot remove the last skill. You need at least one skill.');
                        return;
                    }

                    // Remove the skill
                    newSkill.remove();
                    saveState();
                });
            }

            // Add input event listener to editable elements
            newSkill.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.addEventListener('input', saveState);
            });

            // Add the new skill to the skills container
            const skillsContainer = document.querySelector('#skills .row');
            skillsContainer.appendChild(newSkill);

            // Initialize the chart for the new skill
            $(newSkill).find('.chart').easyPieChart({
                scaleColor: false,
                lineWidth: 4,
                lineCap: 'butt',
                barColor: '#1CBB9B',
                trackColor: '#c8c8c8',
                size: 160,
                animate: 1000
            });

            saveState();
        });
    }

    // Add remove functionality to existing skill items
    document.querySelectorAll('.skill .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const skill = this.closest('.skill');

            // Check if this is the last skill
            const allSkills = document.querySelectorAll('.skill');
            if (allSkills.length <= 1) {
                alert('Cannot remove the last skill. You need at least one skill.');
                return;
            }

            // Remove the skill
            skill.remove();
            saveState();
        });
    });

    // Portfolio section controls
    const addPortfolioBtn = document.getElementById('add-portfolio-btn');
    if (addPortfolioBtn) {
        addPortfolioBtn.addEventListener('click', function() {
            // Generate a new index for the portfolio item
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            const newIndex = portfolioItems.length + 1;

            // Create a new column for the portfolio item using innerHTML
            const newCol = document.createElement('div');
            newCol.className = 'col-sm-6 col-md-4 col-lg-4 portfolio-item';

            // Set the data-link attribute
            newCol.setAttribute('data-link', '#');

            // Use the exact HTML structure from the existing items
            newCol.innerHTML = `
                <div class="item-controls">
                    <button class="section-control-btn remove-btn" title="Remove Portfolio Item"><i class="fa fa-trash"></i></button>
                </div>
                <div class="hover-bg">
                    <div class="hover-text">
                        <h4 contenteditable="true">Project Title</h4>
                        <small contenteditable="true">Web Design</small>
                        <div class="portfolio-buttons">
                            <button class="btn btn-default btn-sm edit-project-link" data-project="${newIndex}">Edit Link</button>
                            <a href="#" class="btn btn-primary btn-sm visit-project" target="_blank">Visit Page</a>
                        </div>
                    </div>
                    <img src="assets/professional/img/portfolio/01-small.jpg" class="img-responsive" alt="Project Title" id="portfolio-image-${newIndex}">
                </div>
                <div class="text-center edit-mode-only" style="margin-top: 10px;">
                    <button class="btn btn-default" onclick="document.getElementById('portfolio-upload-${newIndex}').click()">Change Image</button>
                    <input type="file" id="portfolio-upload-${newIndex}" style="display: none;" accept="image/*">
                </div>
            `;

            // Get references to the elements
            const newItem = newCol; // newCol is now the portfolio-item
            const removeBtn = newItem.querySelector('.remove-btn');
            const editLinkBtn = newItem.querySelector('.edit-project-link');
            const visitBtn = newItem.querySelector('.visit-project');
            const fileInput = newItem.querySelector('input[type="file"]');
            const img = newItem.querySelector('img');
            const hoverBg = newItem.querySelector('.hover-bg');
            const hoverText = newItem.querySelector('.hover-text');

            // Add hover effect manually
            if (hoverBg && hoverText) {
                hoverBg.addEventListener('mouseenter', function() {
                    hoverText.style.opacity = '1';
                });

                hoverBg.addEventListener('mouseleave', function() {
                    hoverText.style.opacity = '0';
                });
            }

            // Add event listeners

            // Remove button
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    // Check if this is the last portfolio item
                    const allItems = document.querySelectorAll('.portfolio-item');
                    if (allItems.length <= 1) {
                        alert('Cannot remove the last portfolio item. You need at least one portfolio item.');
                        return;
                    }

                    // Remove the portfolio item
                    newCol.remove();

                    // Check if row is empty and remove it if it is
                    const row = newCol.closest('.row');
                    if (row && row.querySelectorAll('.portfolio-item').length === 0) {
                        row.remove();
                    }

                    // Rebalance rows if needed
                    rebalancePortfolioRows();

                    // Reinitialize isotope
                    setTimeout(function() {
                        $('.portfolio-items').isotope('reloadItems').isotope();
                    }, 100);

                    saveState();
                });
            }

            // Edit link button
            if (editLinkBtn) {
                editLinkBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const projectId = this.getAttribute('data-project');
                    openProjectLinkModal(projectId);
                });
            }

            // Visit button
            if (visitBtn) {
                visitBtn.addEventListener('click', function(e) {
                    // Only prevent default if the href is # (not set yet)
                    if (this.getAttribute('href') === '#') {
                        e.preventDefault();
                        alert('Please set a project link first by clicking the "Edit Link" button.');
                    }
                });
            }

            // File input
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    handleImageUpload(this, img.id);
                });
            }

            // Editable elements
            newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.addEventListener('input', saveState);

                // Enable one-click editing
                el.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (el.contentEditable === 'true') {
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        // Focus the element
                        el.focus();
                    }
                });
            });

            // Add the new column to the portfolio container
            const portfolioContainer = document.querySelector('.portfolio-items');

            // Add the new column directly to the portfolio container
            portfolioContainer.appendChild(newCol);

            // Force a layout recalculation
            portfolioContainer.offsetHeight;
            newCol.offsetHeight;

            // Force a layout recalculation
            newItem.offsetHeight;

            // Make sure the image is loaded before initializing isotope
            if (img) {
                // Create a new image to preload
                const preloadImg = new Image();
                preloadImg.src = img.src;

                // Function to initialize isotope
                const initIsotope = function() {
                    // Force layout recalculation
                    newCol.style.width = '33.333%';
                    newCol.style.float = 'left';
                    newCol.style.boxSizing = 'border-box';
                    newCol.style.padding = '0 15px';

                    // Force browser to recalculate layout
                    newCol.offsetHeight;

                    // Reinitialize isotope with a delay
                    setTimeout(function() {
                        $('.portfolio-items').isotope('destroy');
                        $('.portfolio-items').isotope({
                            itemSelector: '.portfolio-item',
                            layoutMode: 'fitRows',
                            fitRows: {
                                gutter: 0
                            },
                            percentPosition: true
                        });
                        saveState();
                    }, 200);
                };

                if (preloadImg.complete || img.complete) {
                    // Image is already loaded (from cache)
                    initIsotope();
                } else {
                    // Wait for the image to load
                    preloadImg.onload = initIsotope;

                    // Fallback in case onload doesn't fire
                    setTimeout(initIsotope, 500);
                }
            } else {
                // No image found, still initialize isotope
                setTimeout(function() {
                    $('.portfolio-items').isotope('reloadItems').isotope();
                    saveState();
                }, 200);
            }
        });
    }

    // Add remove functionality to existing portfolio items
    document.querySelectorAll('.portfolio-item .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.portfolio-item');
            const row = item.closest('.row');

            // Check if this is the last portfolio item
            const allItems = document.querySelectorAll('.portfolio-item');
            if (allItems.length <= 1) {
                alert('Cannot remove the last portfolio item. You need at least one portfolio item.');
                return;
            }

            // Remove the portfolio item
            item.remove();

            // Check if row is empty and remove it if it is
            if (row && row.querySelectorAll('.portfolio-item').length === 0) {
                row.remove();
            }

            // Rebalance rows if needed
            rebalancePortfolioRows();

            // Reinitialize isotope with a slight delay to ensure DOM is updated
            setTimeout(function() {
                $('.portfolio-items').isotope('reloadItems').isotope();
            }, 100);

            saveState();
        });
    });

    // Function to rebalance portfolio items
    function rebalancePortfolioRows() {
        // With the new structure, we don't need to rebalance rows
        // Just make sure isotope is reinitialized
        setTimeout(function() {
            $('.portfolio-items').isotope('reloadItems').isotope();
        }, 100);
    }

    // Testimonials section controls
    const addTestimonialBtn = document.getElementById('add-testimonial-btn');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', function() {
            // Find an existing testimonial to clone
            const existingItem = document.querySelector('.testimonial-item');
            if (!existingItem) {
                console.error('No existing testimonial found to clone');
                return;
            }

            // Clone the existing testimonial
            const newItem = existingItem.cloneNode(true);

            // Reset content
            newItem.querySelector('p[contenteditable="true"]').textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sed dapibus leo nec ornare.';
            newItem.querySelector('strong').textContent = 'New Client';
            newItem.querySelector('em').textContent = 'Position, Company';

            // Add remove button functionality
            const removeBtn = newItem.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    // Check if this is the last testimonial
                    const allItems = document.querySelectorAll('.testimonial-item');
                    if (allItems.length <= 1) {
                        alert('Cannot remove the last testimonial. You need at least one testimonial.');
                        return;
                    }

                    // Remove the testimonial
                    newItem.remove();
                    saveState();
                });
            }

            // Add input event listener to editable elements
            newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.addEventListener('input', saveState);
            });

            // Add the new testimonial to the testimonials container
            const testimonialsContainer = document.querySelector('#testimonials .testimonials');
            testimonialsContainer.appendChild(newItem);

            saveState();
        });
    }

    // Add remove functionality to existing testimonials
    document.querySelectorAll('.testimonial-item .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.testimonial-item');

            // Check if this is the last testimonial
            const allItems = document.querySelectorAll('.testimonial-item');
            if (allItems.length <= 1) {
                alert('Cannot remove the last testimonial. You need at least one testimonial.');
                return;
            }

            // Remove the testimonial
            item.remove();
            saveState();
        });
    });

    // Achievements section controls
    const addAchievementBtn = document.getElementById('add-achievement-btn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', function() {
            // Find an existing achievement to clone
            const existingItem = document.querySelector('.achievement-item');
            if (!existingItem) {
                console.error('No existing achievement found to clone');
                return;
            }

            // Clone the existing achievement
            const newItem = existingItem.cloneNode(true);

            // Reset content
            newItem.querySelector('h4').textContent = 'New Achievement';
            const count = newItem.querySelector('.count');
            count.textContent = '100';

            // Add remove button functionality
            const removeBtn = newItem.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    // Check if this is the last achievement
                    const allItems = document.querySelectorAll('.achievement-item');
                    if (allItems.length <= 1) {
                        alert('Cannot remove the last achievement. You need at least one achievement.');
                        return;
                    }

                    // Remove the achievement
                    newItem.remove();
                    saveState();
                });
            }

            // Add input event listener to editable elements
            newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.addEventListener('input', saveState);
            });

            // Add the new achievement to the achievements container
            const achievementsContainer = document.querySelector('#achievements .row');
            achievementsContainer.appendChild(newItem);

            // Initialize the counter for the new achievement
            $(newItem).find('.count').each(function() {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function(now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });

            saveState();
        });
    }

    // Add remove functionality to existing achievements
    document.querySelectorAll('.achievement-item .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.achievement-item');

            // Check if this is the last achievement
            const allItems = document.querySelectorAll('.achievement-item');
            if (allItems.length <= 1) {
                alert('Cannot remove the last achievement. You need at least one achievement.');
                return;
            }

            // Remove the achievement
            item.remove();
            saveState();
        });
    });
}

// Function to save the current state
function saveState() {
    undoStack.push(document.documentElement.innerHTML);
    redoStack = [];
}

// Function to open the project link modal
function openProjectLinkModal(projectId) {
    // Store the current project ID in the modal
    const modal = $('#project-link-modal');
    modal.data('project-id', projectId);

    // Find the portfolio item with the matching project ID
    const editButton = document.querySelector(`.edit-project-link[data-project="${projectId}"]`);
    if (!editButton) return;

    const portfolioItem = editButton.closest('.portfolio-item');
    if (!portfolioItem) return;

    // Get the current link
    const currentLink = portfolioItem.getAttribute('data-link') || '#';

    // Set the input value
    document.getElementById('project-link-input').value = currentLink === '#' ? '' : currentLink;

    // Show the modal
    modal.modal('show');
}

// Function to save the project link
function saveProjectLink() {
    const modal = $('#project-link-modal');
    const projectId = modal.data('project-id');
    const newLink = document.getElementById('project-link-input').value.trim() || '#';

    // Find the portfolio item with the matching project ID
    const editButton = document.querySelector(`.edit-project-link[data-project="${projectId}"]`);
    if (!editButton) return;

    const portfolioItem = editButton.closest('.portfolio-item');
    if (!portfolioItem) return;

    // Update the portfolio item's data-link attribute
    portfolioItem.setAttribute('data-link', newLink);

    // Update the visit button href
    const visitButton = portfolioItem.querySelector('.visit-project');
    if (visitButton) {
        visitButton.href = newLink;
    }

    // Hide the modal
    modal.modal('hide');

    // Save the state
    saveState();
}

// Function to load the saved state
function loadState() {
    // In a real app, this would load from localStorage or a server
    // For now, we'll just initialize the undo stack with the current state
    if (undoStack.length === 0) {
        undoStack.push(document.documentElement.innerHTML);
    }
}

// Function to undo the last change
function undo() {
    if (undoStack.length > 1) { // Keep at least one state in the stack
        redoStack.push(undoStack.pop());
        document.documentElement.innerHTML = undoStack[undoStack.length - 1];

        // Reinitialize event handlers and functionality
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSkillCharts();
        initializeCounters();
        initializePortfolio();
        initializeNavigation();
    }
}

// Function to redo the last undone change
function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        document.documentElement.innerHTML = undoStack[undoStack.length - 1];

        // Reinitialize event handlers and functionality
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSkillCharts();
        initializeCounters();
        initializePortfolio();
        initializeNavigation();
    }
}
