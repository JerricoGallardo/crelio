// Initialize variables
let undoStack = [];
let redoStack = [];
let editMode = true;

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Ensure editMode global variable is properly initialized
    window.editMode = true;
    
    // Initialize all components
    initializeCounters();
    initializeNavigation();
    initializeProgressBars();
    initializeEditor();
    initializeAddRemoveControls();
    initializeImageUploads();
    initializePortfolioItems();
    initializeSocialLinks();

    // Load saved state
    loadState();
    
    // Initialize the preview toggle button with a proper click handler
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        // Remove any existing handlers
        const newPreviewBtn = previewBtn.cloneNode(true);
        if (previewBtn.parentNode) {
            previewBtn.parentNode.replaceChild(newPreviewBtn, previewBtn);
        }
        
        // Make sure the button is properly styled and has the correct data attribute
        newPreviewBtn.setAttribute('data-preview', 'false');
        newPreviewBtn.innerHTML = '<i class="glyphicon glyphicon-eye-open" style="margin-right: 5px;"></i> Preview';
        newPreviewBtn.classList.remove('active');
        
        // Add click handler with preventDefault
        newPreviewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePreview();
            return false;
        });
    }
    
    // Initialize save button
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', savePortfolio);
    }
    
    // Add an event listener for 'preview-toggle' custom event
    document.addEventListener('preview-toggle', function(e) {
        togglePreview();
    });
    
    // Patch any default navigation behavior in the preview button
    document.querySelectorAll('#preview-btn, [data-action="toggle-preview"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            togglePreview();
            return false;
        }, true);
    });
});

// Global variables for toolbar functionality
let lastScrollTop = 0;
let toolbarHidden = false;

// Function to initialize counters
function initializeCounters() {
    // Reset any existing counters
    $('.counter').removeClass('counting');

    // Initialize counters with scroll animation
    if ($(".section-counters .start").length > 0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;

            // Check if counter is already in view and start it immediately
            if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                stat_item.addClass('counting');
                stat_item.countTo();
            }

            // Add scroll event for future scrolling
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });

        // Trigger a scroll event to initialize counters that are already in view
        $(window).trigger('scroll');
    }

    // Custom callback for counting to infinity
    $('#infinity').data('countToOptions', {
        onComplete: function (value) {
            count.call(this, {
                from: value,
                to: value + 1
            });
        }
    });

    $('#infinity').each(count);

    function count(options) {
        var $this = $(this);
        options = $.extend({}, options || {}, $this.data('countToOptions') || {});
        $this.countTo(options);
    }
}

// Function to show the toolbar
function showToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    const siteHeader = document.querySelector('.site-header');

    if (toolbar && siteHeader) {
        toolbar.style.transform = 'translateY(0)';
        toolbar.style.transition = 'transform 0.3s ease-in-out';
        siteHeader.style.top = '50px';
        siteHeader.style.transition = 'top 0.3s ease-in-out';
        toolbarHidden = false;
    }
}

// Function to hide the toolbar
function hideToolbar() {
    const toolbar = document.querySelector('.editor-toolbar');
    const siteHeader = document.querySelector('.site-header');

    if (toolbar && siteHeader) {
        toolbar.style.transform = 'translateY(-100%)';
        toolbar.style.transition = 'transform 0.3s ease-in-out';
        siteHeader.style.top = '0';
        siteHeader.style.transition = 'top 0.3s ease-in-out';
        toolbarHidden = true;
    }
}

// Function to initialize navigation
function initializeNavigation() {
    // Variables for toolbar hide/show functionality
    const toolbar = document.querySelector('.editor-toolbar');
    const siteHeader = document.querySelector('.site-header');
    const scrollThreshold = 10; // Minimum scroll amount to trigger hide/show

    // Smooth scrolling for all navigation links
    $('.page-scroll a, .site-navigation ul li a').on('click', function(event) {
        var $anchor = $(this);
        var target = $($anchor.attr('href'));

        if (target.length) {
            event.preventDefault();
            // Calculate offset based on section
            var offset = 120; // Default offset for header + toolbar

            // Different offset for different sections if needed
            if ($anchor.attr('href') === '#hero') {
                offset = 80;
            }

            $('html, body').stop().animate({
                scrollTop: target.offset().top - offset
            }, 1000, 'easeInOutExpo');

            // Update active class
            $('.site-navigation ul li').removeClass('active');
            $(this).parent().addClass('active');

            // Close mobile menu if open
            if ($('.site-navigation').hasClass('active')) {
                $('.site-navigation').removeClass('active');
            }
        }
    });

    // Highlight the active navigation item
    $('body').scrollspy({
        target: '.site-header',
        offset: 150  // Adjusted offset to better detect sections
    });

    // Refresh scrollspy after a short delay to ensure proper initialization
    setTimeout(function() {
        $(window).trigger('scroll');
    }, 200);

    // Add active class to navigation items on scroll and handle toolbar visibility
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        var found = false;

        // Handle toolbar visibility
        if (toolbar && siteHeader) {
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

        // Check each section in reverse order (to prioritize later sections)
        var sections = ['#contact', '#portfolio', '#service', '#about', '#hero'];

        for (var i = 0; i < sections.length; i++) {
            var section = $(sections[i]);
            if (section.length && section.offset().top - 150 <= scrollPos &&
                section.offset().top + section.height() > scrollPos) {
                $('.site-navigation ul li').removeClass('active');
                $('.site-navigation ul li a[href="' + sections[i] + '"]').parent().addClass('active');
                found = true;
                break;
            }
        }

        // If no section is active and we're at the top, activate home
        if (!found && scrollPos < 150) {
            $('.site-navigation ul li').removeClass('active');
            $('.site-navigation ul li a[href="#hero"]').parent().addClass('active');
        }
    });

    // Mobile menu toggle
    $('.navbar-toggle').on('click', function() {
        $('.site-navigation').toggleClass('active');
    });

    // Close mobile menu on window resize to desktop size
    $(window).on('resize', function() {
        if ($(window).width() > 767 && $('.site-navigation').hasClass('active')) {
            $('.site-navigation').removeClass('active');
        }
    });

    // Force active class update on page load
    setTimeout(function() {
        var scrollPos = $(document).scrollTop();
        var found = false;
        var sections = ['#contact', '#portfolio', '#service', '#about', '#hero'];

        for (var i = 0; i < sections.length; i++) {
            var section = $(sections[i]);
            if (section.length && section.offset().top - 150 <= scrollPos &&
                section.offset().top + section.height() > scrollPos) {
                $('.site-navigation ul li').removeClass('active');
                $('.site-navigation ul li a[href="' + sections[i] + '"]').parent().addClass('active');
                found = true;
                break;
            }
        }

        if (!found) {
            $('.site-navigation ul li').removeClass('active');
            $('.site-navigation ul li a[href="#hero"]').parent().addClass('active');
        }
    }, 500);
}

// Function to initialize progress bars
function initializeProgressBars() {
    // Set up the progress bar animation on scroll
    var $section = $('.section-skills');

    function loadDaBars() {
        $('.progress .progress-bar').each(function() {
            var percentage = $(this).attr('data-percentage');
            $(this).css('width', percentage + '%');
            $(this).text(''); // Clear any existing text
            $(this).attr('data-content', percentage + '%'); // Use data-content for CSS ::after
        });
    }

    // Make sure all progress bars have the correct percentage display

    // Load progress bars immediately
    loadDaBars();

    // Also load on scroll for animation effect
    $(document).bind('scroll', function(ev) {
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            loadDaBars();
            // unbind event not to load scroll again
            $(document).unbind('scroll');
        }
    });

    // Remove any existing click handlers before adding new ones
    $('.progress').off('click touchstart mousemove');

    // Only make progress bars interactive if in edit mode
    if (editMode) {
    // Make progress bars clickable for width adjustment
    $('.progress').each(function() {
        var progress = $(this);
        var progressBar = progress.find('.progress-bar');

        // Add click handler to set width at click position
        progress.on('click', function(e) {
            if (!editMode) return;

            var totalWidth = progress.width();
            var clickPosition = e.pageX - progress.offset().left;
            var percentage = Math.min(100, Math.max(0, Math.round((clickPosition / totalWidth) * 100)));

            // Update width and data attributes
            progressBar.css('width', percentage + '%');
            progressBar.attr('data-percentage', percentage);
            progressBar.attr('data-transitiongoal', percentage);
            progressBar.text(''); // Clear any existing text
            progressBar.attr('data-content', percentage + '%'); // Use data-content for CSS ::after

            saveState();
        });

        // Add mouse move handler for visual feedback
        progress.on('mousemove', function(e) {
            if (!editMode) return;
                progress.css('cursor', editMode ? 'pointer' : 'default');
        });

        // Add touch support for mobile devices
        progress.on('touchstart', function(e) {
            if (!editMode) return;
            e.preventDefault();

            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var totalWidth = progress.width();
            var touchPosition = touch.pageX - progress.offset().left;
            var percentage = Math.min(100, Math.max(0, Math.round((touchPosition / totalWidth) * 100)));

            // Update width and data attributes
            progressBar.css('width', percentage + '%');
            progressBar.attr('data-percentage', percentage);
            progressBar.attr('data-transitiongoal', percentage);
            progressBar.text(''); // Clear any existing text
            progressBar.attr('data-content', percentage + '%'); // Use data-content for CSS ::after

            saveState();
        });
    });
    } else {
        // In preview mode, ensure cursor is default and no interaction
        $('.progress').css('cursor', 'default');
    }
}

// Function to initialize editor
function initializeEditor() {
    // Special handling for site title
    const siteTitle = document.getElementById('site-title');
    if (siteTitle) {
        // Make sure it's editable
        siteTitle.setAttribute('contenteditable', 'true');

        // Add click handler to make it editable on click
        siteTitle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Select all text on click
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(this);
            selection.removeAllRanges();
            selection.addRange(range);
        });

        // Make sure the title is saved when edited
        siteTitle.addEventListener('input', function() {
            saveState();
        });
    }

    // Handle the site logo container to prevent it from interfering with editing
    const siteLogoContainer = document.querySelector('.site-logo-container');
    if (siteLogoContainer) {
        siteLogoContainer.addEventListener('click', function(e) {
            // If the click is directly on the container (not on the h1), focus the h1
            if (e.target === this) {
                const h1 = this.querySelector('#site-title');
                if (h1) {
                    e.preventDefault();
                    e.stopPropagation();
                    // Trigger a click on the h1
                    h1.click();
                }
            }
        });
    }

    // Add CSS for button animations and portfolio items
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

        /* Section controls styles */
        .section-controls {
            display: flex;
            justify-content: center;
            margin: 10px 0;
        }

        .section-control-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: #fff;
            border: 1px solid #ddd;
            color: #333;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .section-control-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .section-control-btn:active {
            transform: translateY(1px);
            box-shadow: none;
        }

        .add-btn {
            background-color: #28a745;
            color: white;
            border-color: #28a745;
        }

        .remove-btn {
            background-color: #dc3545;
            color: white;
            border-color: #dc3545;
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

        /* Portfolio item styles */
        .portfolio-item-wrapper {
            position: relative;
            overflow: hidden;
            margin-bottom: 15px;
            cursor: pointer;
        }

        .portfolio-item-wrapper img {
            display: block;
            width: 100%;
            height: auto;
        }

        .portfolio-item-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 15px 0;
            z-index: 10;
            /* Always visible, not just on hover */
        }

        .portfolio-item-overlay h4 {
            color: white;
            margin-bottom: 15px;
            text-align: center;
            padding: 0 10px;
            font-size: 18px;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
        }

        .portfolio-item-buttons {
            display: flex;
            gap: 10px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 30px;
            padding: 5px 10px;
        }

        .portfolio-item-button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: white;
            color: #333;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .portfolio-item-button:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
        }

        .portfolio-item-button i {
            font-size: 16px;
        }

        /* Portfolio modal styles */
        .portfolio-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
        }

        .portfolio-modal-content {
            position: relative;
            background-color: #fff;
            margin: 3% auto;
            padding: 0;
            width: 85%;
            max-width: 1000px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: modalFadeIn 0.4s;
            border-radius: 5px;
            overflow: hidden;
        }

        @keyframes modalFadeIn {
            from {opacity: 0; transform: translateY(-50px);}
            to {opacity: 1; transform: translateY(0);}
        }

        .portfolio-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            color: white;
            font-size: 30px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .portfolio-modal-close:hover {
            background-color: rgba(0, 0, 0, 0.8);
            transform: rotate(90deg);
        }

        .portfolio-modal-body {
            display: flex;
            flex-direction: column;
        }

        #portfolio-modal-image {
            width: 100%;
            height: auto;
            max-height: 550px;
            object-fit: cover;
            border-bottom: 1px solid #eee;
        }

        .portfolio-modal-details {
            padding: 30px;
            background-color: white;
        }

        .portfolio-modal-details h2 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #333;
            font-size: 28px;
            font-weight: 600;
            position: relative;
            padding-bottom: 10px;
        }

        .portfolio-modal-details h2:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background-color: #333;
        }

        .portfolio-modal-details p {
            color: #666;
            line-height: 1.8;
            margin-bottom: 25px;
            font-size: 16px;
        }

        #portfolio-modal-link {
            display: inline-block;
            padding: 12px 25px;
            background-color: #333;
            color: white;
            text-decoration: none;
            text-transform: uppercase;
            font-weight: bold;
            transition: all 0.3s;
            border-radius: 3px;
            letter-spacing: 1px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        #portfolio-modal-link:hover {
            background-color: #555;
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        /* Responsive adjustments for modal */
        @media (max-width: 768px) {
            .portfolio-modal-content {
                width: 95%;
                margin: 5% auto;
            }

            .portfolio-modal-details {
                padding: 20px;
            }

            .portfolio-modal-details h2 {
                font-size: 24px;
            }

            #portfolio-modal-image {
                max-height: 400px;
            }
        }
    `;
    document.head.appendChild(style);

    // Add toolbar button classes for animations
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
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

    // Make all contenteditable elements editable
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        // Add input event listener to save state
        element.addEventListener('input', function() {
            saveState();
        });

        // Enable one-click editing without requiring text selection
        element.addEventListener('click', function(e) {
            // If we're in edit mode, select all text on click for easier editing
            if (element.contentEditable === 'true' && !window.getSelection().toString()) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });
    });

    // Make sure all elements that should be editable are editable (except counter section)
    document.querySelectorAll('h1, h2, h3, h4, p, a.btn, .progress-bar').forEach(element => {
        // Skip elements in the counter section
        if (!element.closest('.section-counters') && !element.hasAttribute('contenteditable')) {
            element.setAttribute('contenteditable', 'true');

            // Add input event listener to save state
            element.addEventListener('input', function() {
                saveState();
            });

            // Enable one-click editing without requiring text selection
            element.addEventListener('click', function(e) {
                // If we're in edit mode, select all text on click for easier editing
                if (element.contentEditable === 'true' && !window.getSelection().toString()) {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            });
        }
    });

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
}

// Function to initialize add/remove controls for sections
function initializeAddRemoveControls() {
    // Skills section controls
    const addSkillBtn = document.getElementById('add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const skillsRows = document.querySelectorAll('.section-skills .row');
            const lastRow = skillsRows[skillsRows.length - 1];
            const skillColumns = lastRow.querySelectorAll('.col-md-4');

            // Find the column with the fewest skills
            let targetColumn = null;
            let minSkills = Infinity;

            for (const column of skillColumns) {
                const skillCount = column.querySelectorAll('.skill').length;
                if (skillCount < minSkills) {
                    minSkills = skillCount;
                    targetColumn = column;
                }
            }

            // If all columns have the same number of skills, use the first column
            if (!targetColumn && skillColumns.length > 0) {
                targetColumn = skillColumns[0];
            }

            // If no column was found and we have less than 3 columns, create a new one
            if (!targetColumn && skillColumns.length < 3) {
                targetColumn = document.createElement('div');
                targetColumn.className = 'col-md-4';
                lastRow.appendChild(targetColumn);
            }

            // If we have a target column, add a new skill to it
            if (targetColumn) {
                const existingSkill = document.querySelector('.skill');
                const newSkill = existingSkill.cloneNode(true);

                // Reset content to be editable
                newSkill.querySelector('h4').textContent = 'NEW SKILL';
                const progressBar = newSkill.querySelector('.progress-bar');
                progressBar.setAttribute('data-transitiongoal', '80');
                progressBar.setAttribute('data-percentage', '80');
                progressBar.style.width = '80%';
                progressBar.textContent = '80%'; // Add percentage text

                // Add remove button functionality
                const removeBtn = newSkill.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newSkill.remove();
                        // If the column is now empty, remove it
                        if (targetColumn.querySelectorAll('.skill').length === 0) {
                            targetColumn.remove();
                        }
                        saveState();
                    });
                }

                // Add input event listener to editable elements
                newSkill.querySelectorAll('[contenteditable="true"]').forEach(el => {
                    el.addEventListener('input', saveState);
                });

                targetColumn.appendChild(newSkill);

                // Initialize the progress bar click functionality

                // Get the progress bar element
                var newProgress = $(newSkill).find('.progress');

                // Add click handler to set width at click position
                newProgress.on('click', function(e) {
                    if (!editMode) return;

                    var progress = $(this);
                    var progressBar = progress.find('.progress-bar');
                    var totalWidth = progress.width();
                    var clickPosition = e.pageX - progress.offset().left;
                    var percentage = Math.min(100, Math.max(0, Math.round((clickPosition / totalWidth) * 100)));

                    // Update the progress bar width and data attributes
                    progressBar.css('width', percentage + '%');
                    progressBar.attr('data-percentage', percentage);
                    progressBar.attr('data-transitiongoal', percentage);

                    // No need to set text - the ::after pseudo-element will display the percentage

                    saveState();
                });
            } else {
                // All columns are full, create a new row
                const newRow = document.createElement('div');
                newRow.className = 'row';
                const newColumn = document.createElement('div');
                newColumn.className = 'col-md-4';
                const existingSkill = document.querySelector('.skill');
                const newSkill = existingSkill.cloneNode(true);

                // Reset content to be editable
                newSkill.querySelector('h4').textContent = 'NEW SKILL';
                const progressBar = newSkill.querySelector('.progress-bar');
                progressBar.setAttribute('data-transitiongoal', '80');
                progressBar.setAttribute('data-percentage', '80');
                progressBar.style.width = '80%';
                progressBar.textContent = '80%'; // Set text for display

                // Add remove button functionality
                const removeBtn = newSkill.querySelector('.remove-btn');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        newSkill.remove();
                        // If the column is now empty, remove it
                        if (newColumn.querySelectorAll('.skill').length === 0) {
                            newColumn.remove();
                            // If the row is now empty, remove it
                            if (newRow.querySelectorAll('.col-md-4').length === 0) {
                                newRow.remove();
                            }
                        }
                        saveState();
                    });
                }

                // Add input event listener to editable elements
                newSkill.querySelectorAll('[contenteditable="true"]').forEach(el => {
                    el.addEventListener('input', saveState);
                });

                newColumn.appendChild(newSkill);
                newRow.appendChild(newColumn);

                // Add the new row after the last row
                const skillsSection = document.querySelector('.section-skills .container');
                skillsSection.appendChild(newRow);

                // Initialize the progress bar click functionality

                // Get the progress bar element
                var newProgress = $(newSkill).find('.progress');

                // Add click handler to set width at click position
                newProgress.on('click', function(e) {
                    if (!editMode) return;

                    var progress = $(this);
                    var progressBar = progress.find('.progress-bar');
                    var totalWidth = progress.width();
                    var clickPosition = e.pageX - progress.offset().left;
                    var percentage = Math.min(100, Math.max(0, Math.round((clickPosition / totalWidth) * 100)));

                    // Update the progress bar width and data attributes
                    progressBar.css('width', percentage + '%');
                    progressBar.attr('data-percentage', percentage);
                    progressBar.attr('data-transitiongoal', percentage);

                    progressBar.text(percentage + '%'); // Set text for display

                    saveState();
                });
            }

            saveState();
        });
    }

    // Add remove functionality to existing skill items
    document.querySelectorAll('.skill .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const skill = this.closest('.skill');
            const column = skill.parentElement;
            const row = column.parentElement;
            const skillsSection = row.parentElement;

            // Check if this is the last skill in the entire section
            const allSkills = skillsSection.querySelectorAll('.skill');
            if (allSkills.length <= 1) {
                alert('Cannot remove the last skill. You need at least one skill.');
                return;
            }

            // Remove the skill
            skill.remove();

            // If the column is now empty, remove it
            if (column.querySelectorAll('.skill').length === 0) {
                column.remove();

                // If the row is now empty, remove it
                if (row.querySelectorAll('.col-md-4').length === 0) {
                    // Only remove the row if it's not the last one
                    const allRows = skillsSection.querySelectorAll('.row');
                    if (allRows.length > 1) {
                        row.remove();
                    }
                }
            }

            saveState();
        });
    });

    // Services section controls
    const addServiceBtn = document.getElementById('add-service-btn');
    console.log('Add service button found:', addServiceBtn);

    // Define the addNewService function globally
    window.addNewService = function() {
        console.log('addNewService function called');

        // Find the services container
        const servicesContainer = document.querySelector('.section-services .container');
        if (!servicesContainer) {
            console.error('Services container not found');
            return;
        }

        // Find the services row
        const servicesRow = servicesContainer.querySelector('.row');
        if (!servicesRow) {
            console.error('Services row not found');
            return;
        }

        // Find the first service as a template
        const firstService = document.querySelector('.service');
        if (!firstService) {
            console.error('Service template not found');
            return;
        }

        // Count all existing services across all rows
        const allExistingServices = document.querySelectorAll('.section-services .service');
        const serviceCount = allExistingServices.length;

        // Get all rows in the services section
        const allRows = servicesContainer.querySelectorAll('.row:not(:first-child)');

        // Check if we need to create a new row (if we already have a multiple of 3 services)
        let targetRow;

        // First row is for the title, so we need to check if we need a new row for services
        if (serviceCount > 0 && serviceCount % 3 === 0) {
            // We need to create a new row
            const newRow = document.createElement('div');
            newRow.className = 'row';
            newRow.style.marginTop = '30px'; // Add spacing between rows
            servicesContainer.appendChild(newRow);
            targetRow = newRow;
        } else {
            // Find the last row that isn't the title row
            const lastServiceRow = allRows.length > 0 ?
                allRows[allRows.length - 1] :
                servicesRow;

            // Check if the last row has less than 3 services
            const servicesInLastRow = lastServiceRow.querySelectorAll('.col-sm-4').length;
            if (servicesInLastRow < 3) {
                targetRow = lastServiceRow;
            } else {
                // Create a new row if the last one is full
                const newRow = document.createElement('div');
                newRow.className = 'row';
                newRow.style.marginTop = '30px'; // Add spacing between rows
                servicesContainer.appendChild(newRow);
                targetRow = newRow;
            }
        }

        // Create a new column
        const newColumn = document.createElement('div');
        newColumn.className = 'col-sm-4';

        // Clone the first service
        const newService = firstService.cloneNode(true);

        // Reset content to be editable
        newService.querySelector('h4').textContent = 'New Service';
        newService.querySelector('p').textContent = 'Description of your service goes here.';

        // Use a different icon for new services to avoid duplication
        const serviceImg = newService.querySelector('img');
        if (serviceImg) {
            // Rotate between the three available icons
            const icons = ['front-end.svg', 'back-end.svg', 'consultancy.svg'];
            const iconIndex = serviceCount % icons.length;
            serviceImg.src = 'assets/img/' + icons[iconIndex];
            serviceImg.alt = 'New Service';
        }

        // Add remove button functionality
        const removeBtn = newService.querySelector('.remove-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                // Don't remove if it's the last service
                const allServices = document.querySelectorAll('.service');
                if (allServices.length > 1) {
                    // Get the parent row before removing the column
                    const parentRow = newColumn.parentElement;

                    // Remove the column
                    newColumn.remove();

                    // If this was the only item in its row and it's not the main row, remove the row too
                    if (parentRow && parentRow !== servicesRow && parentRow.querySelectorAll('.col-sm-4').length === 0) {
                        parentRow.remove();
                    }

                    // Reorganize remaining services if needed
                    reorganizeServices();

                    saveState();
                } else {
                    alert('Cannot remove the last service. You need at least one service.');
                }
            });
        }

        // Add input event listener to editable elements
        newService.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.addEventListener('input', saveState);
        });

        // Append the new service to the column
        newColumn.appendChild(newService);

        // Append the column to the target row
        targetRow.appendChild(newColumn);

        // Log success message
        console.log('New service added successfully');

        // Save the state
        saveState();

        return false; // Prevent default behavior
    };

    // Add click event listener to the add service button
    if (addServiceBtn) {
        // Remove any existing click handlers
        addServiceBtn.onclick = null;

        // Add a single click event listener
        addServiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add service button clicked');
            addNewService();
            return false;
        });
    }

    // Function to reorganize services after removal
    window.reorganizeServices = function() {
        // Get all service containers
        const servicesContainer = document.querySelector('.section-services .container');

        // Get the title row (first row)
        const titleRow = servicesContainer.querySelector('.row:first-child');

        // Get all service rows (excluding the title row)
        const serviceRows = Array.from(servicesContainer.querySelectorAll('.row')).filter(row => row !== titleRow);

        // Get all service columns
        const allServiceColumns = document.querySelectorAll('.section-services .col-sm-4');

        // If we have no services or only one row with 3 or fewer services, no need to reorganize
        if (allServiceColumns.length === 0 || (serviceRows.length === 1 && allServiceColumns.length <= 3)) {
            return;
        }

        // Store the original services (don't clone them to avoid duplicating)
        const allServices = Array.from(allServiceColumns);

        // Remove all existing service rows
        serviceRows.forEach(row => row.remove());

        // Create the first service row
        let currentRow = document.createElement('div');
        currentRow.className = 'row';
        servicesContainer.appendChild(currentRow);

        // Redistribute services across rows, 3 per row
        allServices.forEach((serviceColumn, index) => {
            // If we've filled a row with 3 services, create a new one
            if (index > 0 && index % 3 === 0) {
                currentRow = document.createElement('div');
                currentRow.className = 'row';
                currentRow.style.marginTop = '30px';
                servicesContainer.appendChild(currentRow);
            }

            // Add the service to the current row
            currentRow.appendChild(serviceColumn);
        });
    };

    // Add remove functionality to existing service items
    document.querySelectorAll('.service .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const column = this.closest('.col-sm-4');
            const container = column.parentElement;

            // Don't remove if it's the last service
            const allServices = document.querySelectorAll('.service');
            if (allServices.length > 1) {
                column.remove();
                reorganizeServices();
                saveState();
            } else {
                alert('Cannot remove the last service. You need at least one service.');
            }
        });
    });

    // Portfolio section controls
    const addPortfolioBtn = document.getElementById('add-portfolio-btn');
    if (addPortfolioBtn) {
        // PREVENT DOUBLE EVENT HANDLERS
        // Remove any existing click handlers by cloning and replacing the button
        const newAddPortfolioBtn = addPortfolioBtn.cloneNode(true);
        addPortfolioBtn.parentNode.replaceChild(newAddPortfolioBtn, addPortfolioBtn);

        // Add a single click event listener
        newAddPortfolioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            console.log('Add portfolio button clicked - NEW IMPLEMENTATION');

            // Find the portfolio container and items
            const portfolioSection = document.querySelector('.section-portfolio');
            if (!portfolioSection) {
                console.error('Portfolio section not found');
                return;
            }

            const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
            if (portfolioItems.length === 0) {
                console.error('No portfolio items found');
                return;
            }

            const lastItem = portfolioItems[portfolioItems.length - 1];
            if (!lastItem) {
                console.error('Last portfolio item not found');
                return;
            }

            console.log('Creating new portfolio item');

            // Create new column and clone the last item
            const newColumn = document.createElement('div');
            newColumn.className = 'col-md-4 col-xs-6';
            const newItem = lastItem.cloneNode(true);

            // Generate unique IDs for the new portfolio item
            const newIndex = portfolioItems.length + 1;
            console.log('New portfolio item index:', newIndex);

            // Update image ID
            const imgWrapper = newItem.querySelector('.portfolio-item-wrapper');
            if (!imgWrapper) {
                console.error('Image wrapper not found');
                return;
            }

            const img = imgWrapper.querySelector('img');
            if (!img) {
                console.error('Image not found');
                return;
            }
            img.id = 'portfolio-image-' + newIndex;

            // Update file input ID
            const fileInput = newItem.querySelector('input[type="file"]');
            if (!fileInput) {
                console.error('File input not found');
                return;
            }
            fileInput.id = 'portfolio-upload-' + newIndex;

            // Update edit button in overlay
            const editBtn = newItem.querySelector('.portfolio-item-button.edit-project');
            if (editBtn) {
                editBtn.setAttribute('onclick', `document.getElementById('portfolio-upload-${newIndex}').click(); return false;`);
            } else {
                console.warn('Edit button not found');
            }

            // Update view button in overlay
            const viewBtn = newItem.querySelector('.portfolio-item-button.view-project');
            if (viewBtn) {
                viewBtn.setAttribute('data-project', newIndex);
            } else {
                console.warn('View button not found');
            }

            // Reset content to be editable
            const titleElement = newItem.querySelector('h4');
            if (titleElement) {
                titleElement.textContent = 'Project Title';
            }

            // Reset data attributes
            newItem.removeAttribute('data-description');
            newItem.removeAttribute('data-link');

            // Add remove button functionality
            const removeBtn = newItem.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    newColumn.remove();
                    reorganizePortfolioItems();
                    saveState();
                });
            }

            // Add input event listener to editable elements
            newItem.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.addEventListener('input', saveState);
            });

            // Add file upload event listener
            fileInput.addEventListener('change', function() {
                handleImageUpload(this, img.id);
            });

            // Add view project functionality
            if (viewBtn) {
                viewBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const projectId = this.getAttribute('data-project');
                    openPortfolioModal(projectId);
                });
            }

            // Append the new item to the column
            newColumn.appendChild(newItem);

            // Add the column to a temporary container
            const tempContainer = document.createElement('div');
            tempContainer.appendChild(newColumn);

            // Reorganize all portfolio items including the new one
            const allPortfolioColumns = document.querySelectorAll('.section-portfolio .col-md-4');
            const allColumns = Array.from(allPortfolioColumns).concat([newColumn]);

            // Get the portfolio container
            const portfolioContainer = portfolioSection.querySelector('.container');
            if (!portfolioContainer) {
                console.error('Portfolio container not found');
                return;
            }

            // Get all existing rows (excluding the title row)
            const titleRow = portfolioContainer.querySelector('.text-center');
            const existingRows = Array.from(portfolioContainer.querySelectorAll('.row')).filter(row => row !== titleRow.parentElement);

            // Remove all existing rows except the title row
            existingRows.forEach(row => row.remove());

            // Create a new row for portfolio items
            let currentRow = document.createElement('div');
            currentRow.className = 'row';
            portfolioContainer.appendChild(currentRow);

            // Redistribute portfolio items across rows, 3 per row
            allColumns.forEach((column, index) => {
                // If we've filled a row with 3 items, create a new one
                if (index > 0 && index % 3 === 0) {
                    currentRow = document.createElement('div');
                    currentRow.className = 'row';
                    currentRow.style.marginTop = '30px'; // Add spacing between rows
                    portfolioContainer.appendChild(currentRow);
                }

                // Add the portfolio item to the current row
                currentRow.appendChild(column);
            });

            console.log('New portfolio item added successfully');
            saveState();

            return false; // Prevent default behavior
        }, {capture: true}); // Use capture to ensure this handler runs first
    }

    // Add remove functionality to existing portfolio items
    document.querySelectorAll('.portfolio-item .remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const column = this.closest('.col-md-4');

            // Don't remove if it's the last portfolio item
            const allPortfolioItems = document.querySelectorAll('.portfolio-item');
            if (allPortfolioItems.length > 1) {
                column.remove();
                reorganizePortfolioItems();
                saveState();
            } else {
                alert('Cannot remove the last portfolio item. You need at least one portfolio item.');
            }
        });
    });
}

// Function to initialize image uploads with preview mode validation
function initializeImageUploads() {
    console.log('Initializing image uploads');
    
    // First, check if we're in preview mode
    const inPreviewMode = function() {
        return document.getElementById('preview-btn')?.getAttribute('data-preview') === 'true';
    };
    
    // Clean up all existing image-related event handlers by cloning elements
    
    // Profile image change
    const profileUploadBtn = document.querySelector('.hero-image-wrapper .btn');
    const profileUploadInput = document.getElementById('profile-upload');
    
    if (profileUploadBtn) {
        // Store original attributes and HTML
        const originalOnclick = profileUploadBtn.getAttribute('onclick');
        const originalHTML = profileUploadBtn.innerHTML;
        const originalClasses = profileUploadBtn.className;
        
        // Create a fresh button
        const newProfileUploadBtn = document.createElement('button');
        newProfileUploadBtn.className = originalClasses;
        newProfileUploadBtn.innerHTML = originalHTML;
        
        // Replace the original
        if (profileUploadBtn.parentNode) {
            profileUploadBtn.parentNode.replaceChild(newProfileUploadBtn, profileUploadBtn);
        }
        
        // Add our custom click handler
        newProfileUploadBtn.addEventListener('click', function(e) {
            // Check if in preview mode
            if (inPreviewMode()) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                alert("You can't change image in Preview Mode. Go Back to Edit Mode");
                return false;
            }
            
            // If not in preview mode, trigger the file input
            if (profileUploadInput && !inPreviewMode()) {
                // Clone and replace the input to ensure it has fresh event handlers
                const newInput = profileUploadInput.cloneNode(true);
                if (profileUploadInput.parentNode) {
                    profileUploadInput.parentNode.replaceChild(newInput, profileUploadInput);
                }
                
                // Add change handler to the new input
                newInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
            handleImageUpload(this, 'profile-image');
                    }
                });
                
                // Trigger the click
                newInput.click();
            } else if (originalOnclick) {
                // If there was an original onclick, evaluate it
                try {
                    eval(originalOnclick);
                } catch (e) {
                    console.error('Error executing onclick handler:', e);
                }
            }
        });
    }
    
    // Portfolio item image changes - Edit icons
    const portfolioEditBtns = document.querySelectorAll('.portfolio-item-button.edit-project');
    
    portfolioEditBtns.forEach((btn, index) => {
        // Store the original properties
        const originalHTML = btn.innerHTML;
        const originalClasses = btn.className;
        const buttonNumber = btn.getAttribute('data-project') || (index + 1);
        const inputId = `portfolio-upload-${buttonNumber}`;
        
        // Create a fresh button
        const newBtn = document.createElement('a');
        newBtn.className = originalClasses;
        newBtn.innerHTML = originalHTML;
        newBtn.href = '#';
        newBtn.setAttribute('data-project', buttonNumber);
        
        // Replace the original
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }
        
        // Add our custom click handler
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if in preview mode
            if (inPreviewMode()) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                alert("You can't change image in Preview Mode. Go Back to Edit Mode");
                return false;
            }
            
            // If not in preview mode, trigger the appropriate file input
            const input = document.getElementById(inputId);
            if (input && !inPreviewMode()) {
                // Clone and replace the input to ensure it has fresh event handlers
                const newInput = input.cloneNode(true);
                if (input.parentNode) {
                    input.parentNode.replaceChild(newInput, input);
                }
                
                // Add change handler to the new input
                newInput.addEventListener('change', function() {
                    if (this.files && this.files[0]) {
                        handleImageUpload(this, `portfolio-image-${buttonNumber}`);
                    }
                });
                
                // Trigger the click
                newInput.click();
            }
        });
    });
    
    // Also check for standalone Change Image buttons in portfolio modal or elsewhere
    const changeImageBtns = document.querySelectorAll('button:not(.portfolio-item-button):not(.hero-image-wrapper .btn)');
    
    changeImageBtns.forEach(btn => {
        // If this is a Change Image button
        if (btn.textContent.toLowerCase().includes('change image') || 
            btn.innerText.toLowerCase().includes('change image') || 
            btn.classList.contains('change-image')) {
            
            // Store original properties
            const originalHTML = btn.innerHTML;
            const originalClasses = btn.className;
            const originalOnclick = btn.getAttribute('onclick');
            
            // Create a fresh button
            const newBtn = document.createElement('button');
            newBtn.className = originalClasses;
            newBtn.innerHTML = originalHTML;
            
            // Replace the original
            if (btn.parentNode) {
                btn.parentNode.replaceChild(newBtn, btn);
            }
            
            // Add our custom click handler
            newBtn.addEventListener('click', function(e) {
                // Check if in preview mode
                if (inPreviewMode()) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    alert("You can't change image in Preview Mode. Go Back to Edit Mode");
                    return false;
                }
                
                // If not in preview mode, execute original onclick or look for nearby inputs
                if (originalOnclick && !inPreviewMode()) {
                    // If there was an original onclick, evaluate it
                    try {
                        eval(originalOnclick);
                    } catch (e) {
                        console.error('Error executing onclick handler:', e);
                    }
                } else {
                    // Look for a nearby input[type=file]
                    const section = newBtn.closest('section') || newBtn.closest('div');
                    if (section) {
                        const fileInput = section.querySelector('input[type="file"]');
                        if (fileInput && !inPreviewMode()) {
                            // Clone and replace the input to ensure it has fresh event handlers
                            const newInput = fileInput.cloneNode(true);
                            if (fileInput.parentNode) {
                                fileInput.parentNode.replaceChild(newInput, fileInput);
                            }
                            
                            // Add change handler to the new input
                            newInput.addEventListener('change', function() {
                                if (this.files && this.files[0]) {
                                    // Try to find an image ID to update
                                    const imgId = newInput.id.replace('upload', 'image');
            handleImageUpload(this, imgId);
                                }
                            });
                            
                            // Trigger the click
                            newInput.click();
                        }
                    }
                }
            });
        }
    });
    
    // Re-setup all file input change handlers
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        // Store original ID
        const inputId = input.id;
        
        // Create a fresh input
        const newInput = document.createElement('input');
        newInput.type = 'file';
        newInput.id = inputId;
        newInput.accept = 'image/*';
        newInput.style.display = 'none';
        
        // Replace the original
        if (input.parentNode) {
            input.parentNode.replaceChild(newInput, input);
        }
        
        // Add change handler to the new input
        newInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const imgId = inputId.replace('upload', 'image');
                handleImageUpload(this, imgId);
            }
        });
        
        // Override the click method to prevent opening in preview mode
        const originalClick = newInput.click;
        const clickHandler = function() {
            if (inPreviewMode()) {
                alert("You can't change image in Preview Mode. Go Back to Edit Mode");
                return false;
            }
            return originalClick.apply(this, arguments);
        };
        
        // Use Object.defineProperty to override the click method
        try {
            Object.defineProperty(newInput, 'click', {
                value: clickHandler,
                writable: true
            });
        } catch (e) {
            console.error('Error overriding click method:', e);
        }
    });
    
    console.log('Image uploads initialized');
}

// Function to handle image uploads
function handleImageUpload(input, imgId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgElement = document.getElementById(imgId);
            imgElement.src = e.target.result;

            // If this is a portfolio image, also update the modal image if it's open
            if (imgId.startsWith('portfolio-image-')) {
                const projectId = imgId.split('-').pop();
                const modalImage = document.getElementById('portfolio-modal-image');
                const modalTitle = document.getElementById('portfolio-modal-title');
                const portfolioItem = document.querySelector(`.portfolio-item-button[data-project="${projectId}"]`).closest('.portfolio-item');
                const portfolioTitle = portfolioItem.querySelector('h4').textContent;

                if (modalImage && modalTitle && modalTitle.textContent === portfolioTitle) {
                    modalImage.src = e.target.result;
                }
            }

            saveState();
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// Function to initialize social media link editing
function initializeSocialLinks() {
    document.querySelectorAll('a[data-editable="true"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (editMode) {
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
                    saveState();

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
            }
            // If not in edit mode, let the link work normally
        });
    });
}

// Function to save the current state
function saveState() {
    undoStack.push(document.documentElement.innerHTML);
    redoStack = [];
}

// Function to undo the last change
function undo() {
    if (undoStack.length > 1) { // Keep at least one state in the stack
        redoStack.push(undoStack.pop());
        document.documentElement.innerHTML = undoStack[undoStack.length - 1];

        // Ensure edit mode is active
        editMode = true;

        // Make all headings and paragraphs editable except for the counter section
        document.querySelectorAll('h1, h2, h3, h4, p, a.btn').forEach(function(element) {
            // Skip elements in the counter section
            if (!element.closest('.section-counters')) {
                element.setAttribute('contenteditable', 'true');
            } else {
                // Ensure counter section elements are NOT editable
                element.setAttribute('contenteditable', 'false');
            }
        });

        // Force contenteditable attribute on specific elements that must be editable
        document.querySelectorAll('.site-section h1, .site-section h2, .site-section h3, .site-section h4, .site-section p, .site-section a.btn, .portfolio-item h4, .service h4, .service p, .skill h4').forEach(function(element) {
            // Skip elements in the counter section
            if (!element.closest('.section-counters')) {
                element.setAttribute('contenteditable', 'true');
            }
        });

        // Reinitialize event listeners
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSocialLinks();
        initializeProgressBars();
        initializeCounters();

        // Force toolbar to be visible
        showToolbar();

        // Reset the last scroll position to current position
        // This ensures the toolbar won't hide until user scrolls down again
        lastScrollTop = $(document).scrollTop();
        toolbarHidden = false;

        // Reinitialize navigation (which includes scroll event handler)
        initializeNavigation();
    }
}

// Function to redo the last undone change
function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        document.documentElement.innerHTML = undoStack[undoStack.length - 1];

        // Ensure edit mode is active
        editMode = true;

        // Make all headings and paragraphs editable except for the counter section
        document.querySelectorAll('h1, h2, h3, h4, p, a.btn').forEach(function(element) {
            // Skip elements in the counter section
            if (!element.closest('.section-counters')) {
                element.setAttribute('contenteditable', 'true');
            } else {
                // Ensure counter section elements are NOT editable
                element.setAttribute('contenteditable', 'false');
            }
        });

        // Force contenteditable attribute on specific elements that must be editable
        document.querySelectorAll('.site-section h1, .site-section h2, .site-section h3, .site-section h4, .site-section p, .site-section a.btn, .portfolio-item h4, .service h4, .service p, .skill h4').forEach(function(element) {
            // Skip elements in the counter section
            if (!element.closest('.section-counters')) {
                element.setAttribute('contenteditable', 'true');
            }
        });

        // Reinitialize event listeners
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSocialLinks();
        initializeProgressBars();
        initializeCounters();

        // Force toolbar to be visible
        showToolbar();

        // Reset the last scroll position to current position
        // This ensures the toolbar won't hide until user scrolls down again
        lastScrollTop = $(document).scrollTop();
        toolbarHidden = false;

        // Reinitialize navigation (which includes scroll event handler)
        initializeNavigation();
    }
}

// Function to toggle preview mode
function togglePreview() {
    console.log('Toggling preview mode');
    const previewBtn = document.getElementById('preview-btn');
    const editorToolbar = document.querySelector('.editor-toolbar');
    const editables = document.querySelectorAll('[contenteditable="true"]');
    const editableLinks = document.querySelectorAll('a[data-editable="true"]');
    const editModeElements = document.querySelectorAll('.edit-mode-only');
    const previewMode = previewBtn.getAttribute('data-preview') === 'true';
    
    // Save current scroll position
    const scrollPosition = window.scrollY;

    if (previewMode) {
        console.log('Switching to edit mode');
        // Switch back to edit mode
        window.editMode = true;
        editables.forEach(el => {
            el.setAttribute('contenteditable', 'true');
            el.style.outline = '';
        });

        // Show edit mode indicator if it exists
        const editModeIndicator = document.querySelector('.edit-mode-indicator');
        const previewModeIndicator = document.querySelector('.preview-mode-indicator');
        if (editModeIndicator) editModeIndicator.style.display = 'inline-block';
        if (previewModeIndicator) previewModeIndicator.style.display = 'none';

        // Show section controls
        document.querySelectorAll('.section-controls').forEach(control => {
            control.style.display = 'flex';
        });

        // Show item controls
        document.querySelectorAll('.item-controls').forEach(control => {
            control.style.display = '';
        });

        // Re-enable link editing
        initializeSocialLinks();

        // Reinitialize progress bars for edit mode
        initializeProgressBars();
        
        // Reinitialize image upload buttons
        setTimeout(() => {
            initializeImageUploads();
        }, 50);
        
        // Reinitialize portfolio items to restore event handlers
        setTimeout(() => {
            initializePortfolioItems();
        }, 100);

        // Update preview button
        previewBtn.setAttribute('data-preview', 'false');
        previewBtn.innerHTML = '<i class="glyphicon glyphicon-eye-open" style="margin-right: 5px;"></i> Preview';
        previewBtn.classList.remove('active');

        // Update toolbar
        if (editorToolbar) {
            editorToolbar.classList.remove('preview-mode');
            editorToolbar.style.opacity = '1';
        }

        // Show edit mode elements
        editModeElements.forEach(el => {
            el.style.display = '';
        });
        
        console.log('Edit mode enabled');
    } else {
        console.log('Switching to preview mode');
        // Switch to preview mode
        window.editMode = false;
        editables.forEach(el => {
            el.setAttribute('contenteditable', 'false');
            el.style.outline = 'none';
        });

        // Show preview mode indicator if it exists
        const editModeIndicator = document.querySelector('.edit-mode-indicator');
        const previewModeIndicator = document.querySelector('.preview-mode-indicator');
        if (editModeIndicator) editModeIndicator.style.display = 'none';
        if (previewModeIndicator) previewModeIndicator.style.display = 'inline-block';

        // Hide section controls
        document.querySelectorAll('.section-controls').forEach(control => {
            control.style.display = 'none';
        });

        // Hide item controls
        document.querySelectorAll('.item-controls').forEach(control => {
            control.style.display = 'none';
        });

        // Disable link editing in preview mode but allow clicking
        editableLinks.forEach(link => {
            const clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
        });

        // Remove interaction from progress bars in preview mode
        $('.progress').off('click touchstart mousemove').css('cursor', 'default');

        // Update preview button
        previewBtn.setAttribute('data-preview', 'true');
        previewBtn.innerHTML = '<i class="glyphicon glyphicon-edit" style="margin-right: 5px;"></i> Edit';
        previewBtn.classList.add('active');

        // Update toolbar
        if (editorToolbar) {
            editorToolbar.classList.add('preview-mode');
            editorToolbar.style.opacity = '0.8';
        }

        // Hide edit mode elements
        editModeElements.forEach(el => {
            el.style.display = 'none';
        });
        
        console.log('Preview mode enabled');
    }
    
    // Restore scroll position after a short delay to allow DOM updates to complete
    setTimeout(() => {
        window.scrollTo(0, scrollPosition);
    }, 10);
    
    // Prevent default behavior to avoid navigation
    return false;
}

// Function to initialize portfolio items
function initializePortfolioItems() {
    // Initialize View Project buttons
    const viewProjectButtons = document.querySelectorAll('.view-project');
    
    viewProjectButtons.forEach(btn => {
        // Clean up any existing event listeners
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }
        
        // Add event listener to open modal
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            if (projectId) {
            openPortfolioModal(projectId);
            }
        });
    });

    // Make titles in grid view non-editable but store their original content
    const portfolioTitles = document.querySelectorAll('.portfolio-item h4');
    portfolioTitles.forEach((title, index) => {
        // Remove contenteditable attribute
        title.removeAttribute('contenteditable');
        
        // Store the original title for reference
        const originalTitle = title.textContent;
        title.setAttribute('data-original-title', originalTitle);
        
        // Also store the index for easier reference
        const portfolioItem = title.closest('.portfolio-item');
        if (portfolioItem) {
            portfolioItem.setAttribute('data-item-index', index + 1);
            portfolioItem.setAttribute('data-title', originalTitle);
            }
        });
    }

// Function to open portfolio modal
function openPortfolioModal(projectId) {
    console.log('Opening project modal for project ID:', projectId);
    
    const modal = document.getElementById('portfolio-modal');
    if (!modal) {
        console.error('Project modal not found!');
        return;
    }

    // Find the corresponding portfolio item more reliably
    // First try by index
    let portfolioItem = document.querySelector(`.portfolio-item:nth-of-type(${projectId})`);
    
    // If not found, try by data attribute
    if (!portfolioItem) {
                const viewButton = document.querySelector(`.view-project[data-project="${projectId}"]`);
                if (viewButton) {
            portfolioItem = viewButton.closest('.portfolio-item');
        }
    }
    
    if (!portfolioItem) {
        console.error('Could not find portfolio item for project ID:', projectId);
    }
    
    // Get the title element from the portfolio item
    const projectTitleElement = portfolioItem ? portfolioItem.querySelector('h4') : null;
    const projectTitle = projectTitleElement ? projectTitleElement.textContent : 'Project Title';
    const projectImage = document.getElementById(`portfolio-image-${projectId}`);
    
    // Store current project ID and reference to the source item for later updates
    modal.setAttribute('data-current-project', projectId);
    if (portfolioItem) {
        // Store a data attribute pointer to identify this portfolio item later
        portfolioItem.setAttribute('data-current-modal-item', 'true');
    }
    
    // Get project data from localStorage if available
    let projectData = {};
    const savedData = localStorage.getItem('portfolioProjectData');
    if (savedData) {
        try {
            const allProjectData = JSON.parse(savedData);
            projectData = allProjectData[projectId] || {};
        } catch (e) {
            console.error('Error parsing saved project data', e);
        }
    }
    
    // Update modal with project info
    const modalTitle = document.getElementById('portfolio-modal-title');
    const modalDescription = document.getElementById('portfolio-modal-description');
    const modalImage = document.getElementById('portfolio-modal-image');
    const modalLink = document.getElementById('portfolio-modal-link');
    const modalGithub = document.getElementById('portfolio-modal-github');
    
    // Remove any existing edit URL button
    const existingEditBtn = modal.querySelector('.edit-url-btn');
    if (existingEditBtn) {
        existingEditBtn.remove();
    }
    
    // Check if we're in edit mode
    const inEditMode = document.getElementById('preview-btn').getAttribute('data-preview') !== 'true';
    
    // Add Edit URL button in edit mode
    if (inEditMode) {
        const buttonContainer = modal.querySelector('.portfolio-modal-buttons');
        if (buttonContainer) {
            // Create Edit URL button
            const editUrlBtn = document.createElement('button');
            editUrlBtn.className = 'btn btn-border edit-url-btn';
            editUrlBtn.style.marginTop = '10px';
            editUrlBtn.style.width = '100%';
            editUrlBtn.textContent = 'EDIT URLS';
            
            // Add event listener for the Edit URL button
            editUrlBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get current URLs
                const websiteUrl = projectData.websiteUrl || '';
                const githubUrl = projectData.githubUrl || '';
                
                // Create URL edit dialog
                createUrlEditDialog(websiteUrl, githubUrl, function(newWebsiteUrl, newGithubUrl) {
                    // Update project data
                    projectData.websiteUrl = newWebsiteUrl;
                    projectData.githubUrl = newGithubUrl;
                    
                    // Update button links
                    if (modalLink) {
                        if (newWebsiteUrl.trim()) {
                            modalLink.href = newWebsiteUrl;
                            modalLink.target = "_blank";
                            modalLink.removeEventListener('click', handleWebsiteValidation);
                        } else {
                            modalLink.removeAttribute('href');
                            modalLink.addEventListener('click', handleWebsiteValidation);
                        }
                    }
                    
                    if (modalGithub) {
                        if (newGithubUrl.trim()) {
                            modalGithub.href = newGithubUrl;
                            modalGithub.target = "_blank";
                            modalGithub.removeEventListener('click', handleGithubValidation);
                        } else {
                            modalGithub.removeAttribute('href');
                            modalGithub.addEventListener('click', handleGithubValidation);
                        }
                    }
                    
                    // Save data
                    saveProjectData(projectId, projectData);
                });
            });
            
            // Add Edit URL button after the existing buttons
            buttonContainer.appendChild(editUrlBtn);
        }
    }
    
    // Update modal content
    if (modalTitle) {
        modalTitle.textContent = projectData.title || projectTitle;
        // Store the original title for reference
        modalTitle.setAttribute('data-original-title', projectTitle);
    }
    
    if (modalDescription) {
        modalDescription.textContent = projectData.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo finibus tristique. Maecenas dignissim condimentum sem eu tincidunt. Curabitur in dui quis magna vestibulum pulvinar a ut urna. Nam pellentesque mattis urna. Aenean eget lectus sit amet turpis facilisis consectetur quis vel ante. Integer in massa ut nibh ultricies sagittis imperdiet in ante. Nam sed turpis vel ante placerat feugiat ac tempus magna. Nam aliquet ullamcorper dolor non hendrerit.';
    }
    
    // Make sure the title and description are editable only in edit mode
    if (modalTitle) modalTitle.setAttribute('contenteditable', inEditMode.toString());
    if (modalDescription) modalDescription.setAttribute('contenteditable', inEditMode.toString());
    
    // Set image source
    if (modalImage) {
        if (projectData.image) {
            modalImage.src = projectData.image;
        } else if (projectImage && projectImage.src) {
            modalImage.src = projectImage.src;
        } else {
            modalImage.src = 'assets/img/portfolio/portfolio-1.jpg';
        }
    }
    
    // Set up links with validation
    if (modalLink) {
        const websiteUrl = projectData.websiteUrl || '';
        if (websiteUrl.trim() === '') {
            // Empty website URL - set up validation click handler
            modalLink.removeAttribute('href');
            modalLink.addEventListener('click', handleWebsiteValidation);
            
            // Store reference to the handler for cleanup
            modalLink.setAttribute('data-has-validation', 'true');
        } else {
            modalLink.href = websiteUrl;
            modalLink.target = "_blank";
        }
    }
    
    if (modalGithub) {
        const githubUrl = projectData.githubUrl || '';
        if (githubUrl.trim() === '') {
            // Empty GitHub URL - set up validation click handler
            modalGithub.removeAttribute('href');
            modalGithub.addEventListener('click', handleGithubValidation);
            
            // Store reference to the handler for cleanup
            modalGithub.setAttribute('data-has-validation', 'true');
        } else {
            modalGithub.href = githubUrl;
            modalGithub.target = "_blank";
        }
    }
    
    // Make modal visible
    modal.style.display = 'block';
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Set up close button - IMPROVED VERSION
    const closeBtn = modal.querySelector('.portfolio-modal-close');
    if (closeBtn) {
        // Create a completely new close button for reliability
        const newCloseBtn = document.createElement('span');
        newCloseBtn.className = 'portfolio-modal-close';
        newCloseBtn.innerHTML = '&times;';
        newCloseBtn.style.position = 'absolute';
        newCloseBtn.style.top = '15px';
        newCloseBtn.style.right = '20px';
        newCloseBtn.style.fontSize = '28px';
        newCloseBtn.style.fontWeight = 'bold';
        newCloseBtn.style.cursor = 'pointer';
        newCloseBtn.style.zIndex = '9999';
        
        // Replace the old close button
        if (closeBtn.parentNode) {
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        }
        
        // Add multiple event listeners for maximum reliability
        newCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            closePortfolioModal();
        });
        
        // Also add mousedown event for better reliability
        newCloseBtn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button mousedown');
            closePortfolioModal();
        });
    } else {
        // If no close button exists, create one
        console.log('Creating new close button');
        const modalContent = modal.querySelector('.portfolio-modal-content');
        if (modalContent) {
            const newCloseBtn = document.createElement('span');
            newCloseBtn.className = 'portfolio-modal-close';
            newCloseBtn.innerHTML = '&times;';
            newCloseBtn.style.position = 'absolute';
            newCloseBtn.style.top = '15px';
            newCloseBtn.style.right = '20px';
            newCloseBtn.style.fontSize = '28px';
            newCloseBtn.style.fontWeight = 'bold';
            newCloseBtn.style.cursor = 'pointer';
            newCloseBtn.style.zIndex = '9999';
            
            newCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('New close button clicked');
                closePortfolioModal();
            });
            
            modalContent.appendChild(newCloseBtn);
        }
    }
    
    // Add real-time title update handler
    if (modalTitle && projectTitleElement) {
        // Remove any existing input handler
        modalTitle.removeEventListener('input', updateGridTitle);
        
        // Add a named function handler for title updates
        function updateGridTitle() {
            // Update the grid title in real-time
            projectTitleElement.textContent = this.textContent;
            
            // Also update any other references to this title
            if (portfolioItem) {
                portfolioItem.setAttribute('data-title', this.textContent);
            }
        }
        
        // Store the update function reference for cleanup
        modalTitle._updateGridTitle = updateGridTitle;
        
        // Add the input event listener
        modalTitle.addEventListener('input', updateGridTitle);
    }
    
    // Named handlers for window events
                function handleOutsideClick(e) {
        if (e.target === modal) {
            console.log('Clicked outside modal - closing');
            closePortfolioModal();
                    }
                }

                function handleEscapeKey(e) {
                    if (e.key === 'Escape') {
            console.log('Escape key pressed - closing modal');
            closePortfolioModal();
        }
    }
    
    // Named handler functions for validation alerts
    function handleWebsiteValidation(e) {
        e.preventDefault();
        if (document.getElementById('preview-btn').getAttribute('data-preview') === 'true') {
            alert('No website URL has been provided for this project.');
        }
    }
    
    function handleGithubValidation(e) {
        e.preventDefault();
        if (document.getElementById('preview-btn').getAttribute('data-preview') === 'true') {
            alert('No GitHub repository URL has been provided for this project.');
        }
    }
    
    // Store references to the handlers
    modal._handleOutsideClick = handleOutsideClick;
    modal._handleEscapeKey = handleEscapeKey;
    
    // Add event listeners
    window.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Save original content to detect changes
    if (modalTitle) modalTitle.setAttribute('data-original-content', modalTitle.textContent);
    if (modalDescription) modalDescription.setAttribute('data-original-content', modalDescription.textContent);
    
    // Add a fallback close button for extra reliability
    const fallbackCloseBtn = document.createElement('button');
    fallbackCloseBtn.className = 'fallback-close-btn';
    fallbackCloseBtn.textContent = 'Close';
    fallbackCloseBtn.style.position = 'absolute';
    fallbackCloseBtn.style.bottom = '15px';
    fallbackCloseBtn.style.right = '20px';
    fallbackCloseBtn.style.padding = '5px 15px';
    fallbackCloseBtn.style.background = '#000';
    fallbackCloseBtn.style.color = '#fff';
    fallbackCloseBtn.style.border = 'none';
    fallbackCloseBtn.style.borderRadius = '4px';
    fallbackCloseBtn.style.cursor = 'pointer';
    fallbackCloseBtn.style.zIndex = '9999';
    fallbackCloseBtn.style.display = 'none';  // Hide by default, show after 2 seconds if modal is still open
    
    fallbackCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Fallback close button clicked');
        closePortfolioModal();
    });
    
    const modalContent = modal.querySelector('.portfolio-modal-content');
    if (modalContent) {
        modalContent.appendChild(fallbackCloseBtn);
        
        // Show fallback button after 2 seconds if modal is still open
        setTimeout(() => {
            if (modal.style.display === 'block') {
                fallbackCloseBtn.style.display = 'block';
            }
        }, 2000);
    }
}

// Function to close portfolio modal
function closePortfolioModal() {
    console.log('Closing portfolio modal');
    const modal = document.getElementById('portfolio-modal');
    if (!modal) {
        console.error('Modal not found when closing');
        return;
    }

    // Get updated values from the modal
    const modalTitle = document.getElementById('portfolio-modal-title');
    const modalDescription = document.getElementById('portfolio-modal-description');
    const websiteUrlInput = document.getElementById('portfolio-website-url');
    const githubUrlInput = document.getElementById('portfolio-github-url');
    const projectId = modal.getAttribute('data-current-project');
    
    // Find the corresponding portfolio item
    const portfolioItem = document.querySelector('.portfolio-item[data-current-modal-item="true"]');
    
    try {
        // Save changes
        if (projectId) {
            const data = {};
            
            if (modalTitle) {
                data.title = modalTitle.textContent;
            }
            
            if (modalDescription) {
                data.description = modalDescription.textContent;
            }
            
            if (websiteUrlInput) {
                data.websiteUrl = websiteUrlInput.value;
            }
            
            if (githubUrlInput) {
                data.githubUrl = githubUrlInput.value;
            }
            
            saveProjectData(projectId, data);
            
            // Make a final update to the grid title
            if (portfolioItem && modalTitle) {
                const gridTitle = portfolioItem.querySelector('h4');
                if (gridTitle) {
                    gridTitle.textContent = modalTitle.textContent;
                }
            }
        }
        
        // Clean up portfolio item references
        document.querySelectorAll('.portfolio-item[data-current-modal-item]').forEach(item => {
            item.removeAttribute('data-current-modal-item');
        });
    } catch (e) {
        console.error('Error saving project data:', e);
        // Continue with closing even if saving fails
    }
    
    // Hide the modal first - this is the most important part
    modal.style.display = 'none';
    
    try {
        // Re-enable scrolling on body
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');
        
        // Clean up event listeners using stored references
        if (modal._handleOutsideClick) {
            window.removeEventListener('click', modal._handleOutsideClick);
            delete modal._handleOutsideClick;
        }
        
        if (modal._handleEscapeKey) {
            document.removeEventListener('keydown', modal._handleEscapeKey);
            delete modal._handleEscapeKey;
        }
        
        // Clean up title update handler
        if (modalTitle && modalTitle._updateGridTitle) {
            modalTitle.removeEventListener('input', modalTitle._updateGridTitle);
            delete modalTitle._updateGridTitle;
        }
        
        // Clean up the buttons - replace them with fresh clones
        const closeBtn = modal.querySelector('.portfolio-modal-close');
        if (closeBtn) {
            closeBtn.remove();
        }
        
        const fallbackCloseBtn = modal.querySelector('.fallback-close-btn');
        if (fallbackCloseBtn) {
            fallbackCloseBtn.remove();
        }
        
        const modalLink = document.getElementById('portfolio-modal-link');
        if (modalLink) {
            const newModalLink = modalLink.cloneNode(true);
            modalLink.parentNode.replaceChild(newModalLink, modalLink);
        }
        
        const modalGithub = document.getElementById('portfolio-modal-github');
        if (modalGithub) {
            const newModalGithub = modalGithub.cloneNode(true);
            modalGithub.parentNode.replaceChild(newModalGithub, modalGithub);
        }
    } catch (e) {
        console.error('Error cleaning up modal:', e);
        // Even if cleanup fails, the modal should still be hidden
    }
    
    console.log('Modal closed successfully');
}

// Function to create URL edit dialog
function createUrlEditDialog(websiteUrl, githubUrl, callback) {
    // Create dialog overlay
    const dialogOverlay = document.createElement('div');
    dialogOverlay.className = 'url-edit-dialog-overlay';
    dialogOverlay.style.position = 'fixed';
    dialogOverlay.style.top = '0';
    dialogOverlay.style.left = '0';
    dialogOverlay.style.width = '100%';
    dialogOverlay.style.height = '100%';
    dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    dialogOverlay.style.zIndex = '10000';
    dialogOverlay.style.display = 'flex';
    dialogOverlay.style.justifyContent = 'center';
    dialogOverlay.style.alignItems = 'center';
    
    // Create dialog content
    const dialog = document.createElement('div');
    dialog.className = 'url-edit-dialog';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '25px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
    dialog.style.width = '90%';
    dialog.style.maxWidth = '500px';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Edit Project URLs';
    header.style.marginTop = '0';
    header.style.marginBottom = '20px';
    header.style.fontSize = '20px';
    header.style.fontWeight = 'bold';
    dialog.appendChild(header);
    
    // Create website URL field
    const websiteLabel = document.createElement('label');
    websiteLabel.setAttribute('for', 'edit-website-url');
    websiteLabel.textContent = 'Website URL:';
    websiteLabel.style.display = 'block';
    websiteLabel.style.marginBottom = '5px';
    websiteLabel.style.fontWeight = 'bold';
    dialog.appendChild(websiteLabel);
    
    const websiteInput = document.createElement('input');
    websiteInput.id = 'edit-website-url';
    websiteInput.type = 'text';
    websiteInput.value = websiteUrl;
    websiteInput.placeholder = 'Enter website URL';
    websiteInput.style.width = '100%';
    websiteInput.style.padding = '10px';
    websiteInput.style.marginBottom = '20px';
    websiteInput.style.border = '1px solid #ddd';
    websiteInput.style.borderRadius = '4px';
    websiteInput.style.fontSize = '14px';
    dialog.appendChild(websiteInput);
    
    // Create GitHub URL field
    const githubLabel = document.createElement('label');
    githubLabel.setAttribute('for', 'edit-github-url');
    githubLabel.textContent = 'GitHub URL:';
    githubLabel.style.display = 'block';
    githubLabel.style.marginBottom = '5px';
    githubLabel.style.fontWeight = 'bold';
    dialog.appendChild(githubLabel);
    
    const githubInput = document.createElement('input');
    githubInput.id = 'edit-github-url';
    githubInput.type = 'text';
    githubInput.value = githubUrl;
    githubInput.placeholder = 'Enter GitHub repository URL';
    githubInput.style.width = '100%';
    githubInput.style.padding = '10px';
    githubInput.style.marginBottom = '25px';
    githubInput.style.border = '1px solid #ddd';
    githubInput.style.borderRadius = '4px';
    githubInput.style.fontSize = '14px';
    dialog.appendChild(githubInput);
    
    // Create buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.padding = '10px 20px';
    cancelButton.style.backgroundColor = '#f5f5f5';
    cancelButton.style.border = '1px solid #ddd';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '14px';
    buttonContainer.appendChild(cancelButton);
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.padding = '10px 20px';
    saveButton.style.backgroundColor = '#212121';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.fontSize = '14px';
    buttonContainer.appendChild(saveButton);
    
    dialog.appendChild(buttonContainer);
    
    // Add dialog to overlay
    dialogOverlay.appendChild(dialog);
    
    // Add overlay to body
    document.body.appendChild(dialogOverlay);
    
    // Focus first input
    setTimeout(() => websiteInput.focus(), 100);
    
    // Handle cancel button
    cancelButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.removeChild(dialogOverlay);
    });
    
    // Handle save button
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        const newWebsiteUrl = websiteInput.value.trim();
        const newGithubUrl = githubInput.value.trim();
        
        // Remove dialog
        document.body.removeChild(dialogOverlay);
        
        // Call callback with new values
        if (typeof callback === 'function') {
            callback(newWebsiteUrl, newGithubUrl);
        }
    });
    
    // Close on overlay click
    dialogOverlay.addEventListener('click', function(e) {
        if (e.target === dialogOverlay) {
            document.body.removeChild(dialogOverlay);
        }
    });
    
    // Close on ESC key
    function handleEscKey(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(dialogOverlay)) {
                document.body.removeChild(dialogOverlay);
                document.removeEventListener('keydown', handleEscKey);
            }
        }
    }
    
    document.addEventListener('keydown', handleEscKey);
}

// Function to save project data
function saveProjectData(projectId, data) {
    // Get existing data
    let allProjectData = {};
    const savedData = localStorage.getItem('portfolioProjectData');
    if (savedData) {
        try {
            allProjectData = JSON.parse(savedData);
        } catch (e) {
            console.error('Error parsing saved project data', e);
        }
    }
    
    // Update data for this project
    allProjectData[projectId] = {
        ...(allProjectData[projectId] || {}),
        ...data
    };
    
    // Save updated data
    localStorage.setItem('portfolioProjectData', JSON.stringify(allProjectData));
}

// Function to save the portfolio
function savePortfolio() {
    const portfolioData = {
        content: document.documentElement.innerHTML,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage for now
    localStorage.setItem('portfolioPerfectData', JSON.stringify(portfolioData));
    alert('Portfolio saved successfully!');
}

// Function to load the saved state
function loadState() {
    const savedData = localStorage.getItem('portfolioPerfectData');
    if (savedData) {
        try {
            const portfolioData = JSON.parse(savedData);
            document.documentElement.innerHTML = portfolioData.content;

            // Ensure edit mode is active
            editMode = true;

            // Make all headings and paragraphs editable except for the counter section
            document.querySelectorAll('h1, h2, h3, h4, p, a.btn').forEach(function(element) {
                // Skip elements in the counter section
                if (!element.closest('.section-counters')) {
                    element.setAttribute('contenteditable', 'true');
                } else {
                    // Ensure counter section elements are NOT editable
                    element.setAttribute('contenteditable', 'false');
                }
            });

            // Force contenteditable attribute on specific elements that must be editable
            document.querySelectorAll('.site-section h1, .site-section h2, .site-section h3, .site-section h4, .site-section p, .site-section a.btn, .portfolio-item h4, .service h4, .service p, .skill h4').forEach(function(element) {
                // Skip elements in the counter section
                if (!element.closest('.section-counters')) {
                    element.setAttribute('contenteditable', 'true');
                }
            });

            // Reinitialize all event listeners and functionality
            initializeEditor();
            initializeAddRemoveControls();
            initializeImageUploads();
            initializeSocialLinks();
            initializeProgressBars();
            initializeNavigation();
            initializeCounters();

            // Reorganize portfolio items to ensure proper row structure
            setTimeout(() => {
                reorganizePortfolioItems();
            }, 500);

            console.log('Portfolio state loaded successfully');
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }
}

// Ensure the MINIMAL text in the header remains editable
$(document).ready(function() {
    // Make sure the site logo text is editable
    $('.site-logo h1').attr('contenteditable', 'true');

    // Prevent the site-logo link from being followed when editing the text
    $('.site-logo').on('click', function(e) {
        if ($(e.target).is('h1')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Ensure the h1 inside site-logo gets focus when clicked
    $('.site-logo h1').on('click', function(e) {
        e.stopPropagation();
        $(this).focus();
    });
});

// Function to reorganize portfolio items after adding or removing
window.reorganizePortfolioItems = function() {
    console.log('Reorganizing portfolio items');

    // Get the portfolio container
    const portfolioSection = document.querySelector('.section-portfolio');
    if (!portfolioSection) {
        console.error('Portfolio section not found');
        return;
    }

    const portfolioContainer = portfolioSection.querySelector('.container');
    if (!portfolioContainer) {
        console.error('Portfolio container not found');
        return;
    }

    // Get all existing rows (excluding the title row)
    const titleRow = portfolioContainer.querySelector('.text-center');
    const existingRows = Array.from(portfolioContainer.querySelectorAll('.row')).filter(row => row !== titleRow.parentElement);

    // Get all portfolio columns
    const allPortfolioColumns = document.querySelectorAll('.section-portfolio .col-md-4');
    if (allPortfolioColumns.length === 0) {
        console.warn('No portfolio items found');
        return;
    }

    // Store the original portfolio items (don't clone them to avoid duplicating)
    const allPortfolioItems = Array.from(allPortfolioColumns);

    // Remove all existing rows except the title row
    existingRows.forEach(row => row.remove());

    // Create a new row for portfolio items
    let currentRow = document.createElement('div');
    currentRow.className = 'row';
    portfolioContainer.appendChild(currentRow);

    // Redistribute portfolio items across rows, 3 per row
    allPortfolioItems.forEach((column, index) => {
        // If we've filled a row with 3 items, create a new one
        if (index > 0 && index % 3 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row';
            currentRow.style.marginTop = '30px'; // Add spacing between rows
            portfolioContainer.appendChild(currentRow);
        }

        // Add the portfolio item to the current row
        currentRow.appendChild(column);
    });

    console.log('Portfolio items reorganized successfully');
};
