// Initialize variables
let undoStack = [];
let redoStack = [];
let editMode = true;

// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio Perfect Template Loaded');

    // Make all headings and paragraphs editable
    document.querySelectorAll('h1, h2, h3, h4, p, a.btn').forEach(function(element) {
        element.setAttribute('contenteditable', 'true');
    });

    // Initialize editor functionality
    initializeEditor();

    // Initialize add/remove functionality for sections
    initializeAddRemoveControls();

    // Initialize image uploads
    initializeImageUploads();

    // Initialize portfolio items directly (in addition to being called in initializeImageUploads)
    initializePortfolioItems();

    // Initialize social media link editing
    initializeSocialLinks();

    // Initialize progress bars
    initializeProgressBars();

    // Initialize navigation and smooth scrolling
    initializeNavigation();

    // Initialize skrollr for parallax effects
    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        skrollr.init({
            forceHeight: false,
            smoothScrolling: false
        });
    }

    // Reorganize portfolio items to ensure proper row structure
    setTimeout(() => {
        reorganizePortfolioItems();
    }, 500);

    // Initialize counters with scroll animation
    if ($(".section-counters .start").length > 0) {
        $(".section-counters .start").each(function() {
            var stat_item = $(this),
            offset = stat_item.offset().top;
            $(window).scroll(function() {
                if($(window).scrollTop() > (offset - 1000) && !(stat_item.hasClass('counting'))) {
                    stat_item.addClass('counting');
                    stat_item.countTo();
                }
            });
        });
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

    // Initialize progress bars
    $('.progress-bar').each(function() {
        $(this).attr('contenteditable', 'true');
        $(this).progressbar({
            display_text: 'fill'
        });
    });

    // Load saved state if available
    loadState();

    // Save initial state if no saved state was loaded
    if (undoStack.length === 0) {
        saveState();
    }

    // Reorganize portfolio items after loading saved state
    setTimeout(() => {
        reorganizePortfolioItems();
    }, 1000);
});

// Function to initialize navigation
function initializeNavigation() {
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

    // Add active class to navigation items on scroll
    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        var found = false;

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
            $(this).text(''); // Ensure no text is displayed inside the progress bar
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

            saveState();
        });

        // Add mouse move handler for visual feedback
        progress.on('mousemove', function(e) {
            if (!editMode) return;
            progress.css('cursor', 'pointer');
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

            saveState();
        });
    });
}

// Function to initialize editor
function initializeEditor() {
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

    // Make sure all elements that should be editable are editable
    document.querySelectorAll('h1, h2, h3, h4, p, a.btn, .progress-bar').forEach(element => {
        if (!element.hasAttribute('contenteditable')) {
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

                    // Ensure no text is displayed inside the progress bar
                    progressBar.text('');

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
                progressBar.textContent = ''; // Ensure no text is displayed inside

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

                    // Ensure no text is displayed inside the progress bar
                    progressBar.text('');

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

    // Portfolio section controls
    const addPortfolioBtn = document.getElementById('add-portfolio-btn');
    if (addPortfolioBtn) {
        // Remove any existing click handlers
        addPortfolioBtn.onclick = null;

        // Add a single click event listener
        addPortfolioBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add portfolio button clicked');

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
        });
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

// Function to initialize image uploads
function initializeImageUploads() {
    // Profile image upload
    const profileUpload = document.getElementById('profile-upload');
    if (profileUpload) {
        profileUpload.addEventListener('change', function() {
            handleImageUpload(this, 'profile-image');
        });
    }

    // Portfolio image uploads
    document.querySelectorAll('input[type="file"][id^="portfolio-upload-"]').forEach(input => {
        input.addEventListener('change', function() {
            const imgId = input.id.replace('upload', 'image');
            handleImageUpload(this, imgId);
        });
    });

    // Initialize portfolio item hover effects and modal functionality
    initializePortfolioItems();
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

        // Reinitialize event listeners
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSocialLinks();
        initializeProgressBars();
    }
}

// Function to redo the last undone change
function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        document.documentElement.innerHTML = undoStack[undoStack.length - 1];

        // Reinitialize event listeners
        initializeEditor();
        initializeAddRemoveControls();
        initializeImageUploads();
        initializeSocialLinks();
        initializeProgressBars();
    }
}

// Function to toggle preview mode
function togglePreview() {
    const previewBtn = document.getElementById('preview-btn');
    const editorToolbar = document.querySelector('.editor-toolbar');
    const editables = document.querySelectorAll('[contenteditable="true"]');
    const editableLinks = document.querySelectorAll('a[data-editable="true"]');
    const editModeElements = document.querySelectorAll('.edit-mode-only');
    const previewMode = previewBtn.getAttribute('data-preview') === 'true';

    if (previewMode) {
        // Switch back to edit mode
        editMode = true;
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

        // Reinitialize progress bars
        initializeProgressBars();

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
    } else {
        // Switch to preview mode
        editMode = false;
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
    }
}

// Function to initialize portfolio items
function initializePortfolioItems() {
    // Add click handlers for portfolio item view buttons
    document.querySelectorAll('.view-project').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project');
            openPortfolioModal(projectId);
        });
    });

    // Add click handler for modal close button
    const closeButton = document.querySelector('.portfolio-modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closePortfolioModal);
    }

    // Close modal when clicking outside the content
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closePortfolioModal();
            }
        });
    }

    // Make modal description editable
    const modalDescription = document.getElementById('portfolio-modal-description');
    if (modalDescription) {
        modalDescription.addEventListener('input', function() {
            // Find the current project and update its description
            const projectId = modal.getAttribute('data-current-project');
            if (projectId) {
                // Find the view button with the matching data-project attribute
                const viewButton = document.querySelector(`.view-project[data-project="${projectId}"]`);
                if (viewButton) {
                    // Store the description in a data attribute on the portfolio item
                    const portfolioItem = viewButton.closest('.portfolio-item');
                    if (portfolioItem) {
                        portfolioItem.setAttribute('data-description', this.textContent);
                        saveState();
                    }
                }
            }
        });
    }

    // Make modal link editable
    const modalLink = document.getElementById('portfolio-modal-link');
    if (modalLink) {
        modalLink.addEventListener('click', function(e) {
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
                heading.textContent = 'Edit URL';
                urlDialog.appendChild(heading);

                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'url-input';
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
                cancelButton.id = 'cancel-url';
                cancelButton.textContent = 'Cancel';
                cancelButton.style.marginRight = '10px';
                cancelButton.style.padding = '8px 15px';
                cancelButton.style.background = '#f5f5f5';
                cancelButton.style.border = '1px solid #ddd';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.cursor = 'pointer';
                buttonContainer.appendChild(cancelButton);

                const saveButton = document.createElement('button');
                saveButton.id = 'save-url';
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
                    modalLink.setAttribute('href', newUrl || '#');

                    // Store the URL in a data attribute on the portfolio item
                    const projectId = modal.getAttribute('data-current-project');
                    if (projectId) {
                        // Find the view button with the matching data-project attribute
                        const viewButton = document.querySelector(`.view-project[data-project="${projectId}"]`);
                        if (viewButton) {
                            // Store the URL in a data attribute on the portfolio item
                            const portfolioItem = viewButton.closest('.portfolio-item');
                            if (portfolioItem) {
                                portfolioItem.setAttribute('data-link', newUrl || '#');
                                saveState();
                            }
                        }
                    }

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
        });
    }
}

// Function to open portfolio modal
function openPortfolioModal(projectId) {
    console.log('Opening portfolio modal for project ID:', projectId);

    const modal = document.getElementById('portfolio-modal');
    if (!modal) {
        console.error('Portfolio modal not found');
        return;
    }

    const modalImage = document.getElementById('portfolio-modal-image');
    const modalTitle = document.getElementById('portfolio-modal-title');
    const modalDescription = document.getElementById('portfolio-modal-description');
    const modalLink = document.getElementById('portfolio-modal-link');

    if (!modalImage || !modalTitle || !modalDescription || !modalLink) {
        console.error('Modal elements not found');
        return;
    }

    // Find the portfolio item using the view button with the matching data-project attribute
    const viewButton = document.querySelector(`.view-project[data-project="${projectId}"]`);
    if (!viewButton) {
        console.error('View button not found for project ID:', projectId);
        return;
    }

    const portfolioItem = viewButton.closest('.portfolio-item');
    if (!portfolioItem) {
        console.error('Portfolio item not found for project ID:', projectId);
        return;
    }

    const portfolioImage = portfolioItem.querySelector('img');
    if (!portfolioImage) {
        console.error('Portfolio image not found');
        return;
    }

    const portfolioTitle = portfolioItem.querySelector('h4')?.textContent || 'Project Title';

    // Get description and link from data attributes or set defaults
    const description = portfolioItem.getAttribute('data-description') ||
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo finibus tristique. Maecenas dignissim condimentum sem eu tincidunt. Curabitur in dui quis magna vestibulum pulvinar a ut urna. Nam pellentesque mattis urna. Aenean eget lectus sit amet turpis facilisis consectetur quis vel ante. Integer in massa ut nibh ultricies sagittis imperdiet in ante. Nam sed turpis vel ante placerat feugiat ac tempus magna. Nam aliquet ullamcorper dolor non hendrerit.';

    const link = portfolioItem.getAttribute('data-link') || '#';

    // Set modal content
    modalImage.src = portfolioImage.src;
    modalTitle.textContent = portfolioTitle;
    modalDescription.textContent = description;
    modalLink.href = link;

    // Store current project ID
    modal.setAttribute('data-current-project', projectId);

    // Show modal
    modal.style.display = 'block';

    // Disable scrolling on body
    document.body.style.overflow = 'hidden';

    console.log('Portfolio modal opened successfully');
}

// Function to close portfolio modal
function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    modal.style.display = 'none';

    // Re-enable scrolling on body
    document.body.style.overflow = '';
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

            // Reinitialize all event listeners and functionality
            initializeEditor();
            initializeAddRemoveControls();
            initializeImageUploads();
            initializeSocialLinks();
            initializeProgressBars();
            initializeNavigation();

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
