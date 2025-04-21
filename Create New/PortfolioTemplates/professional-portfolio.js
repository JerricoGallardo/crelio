// Initialize variables
let undoStack = [];
let redoStack = [];
let editMode = true;
let isUndoRedoOperation = false; // Flag to prevent saveState during undo/redo

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
    document.querySelectorAll('h1, h2, h3, h4, p, a.btn, small, strong, em, .percent').forEach(function(element) {
        // Skip elements that shouldn't be editable
        if (!element.closest('.count') || element.classList.contains('percent')) {
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

                    // Add editing class for percentages
                    if (element.classList.contains('percent')) {
                        element.classList.add('percent-editing');
                    }
                }
            });

            // Add input event listener to save state when content changes
            element.addEventListener('input', function() {
                // If this is a percent element, only validate the input but don't update the chart yet
                if (element.classList.contains('percent')) {
                    // Get the new percentage value (remove the % if it exists)
                    let newPercent = element.textContent.replace('%', '');

                    // Only validate if it's a number, but don't force it to be between 0-100 yet
                    // This allows the user to type multi-digit numbers without interference
                    if (isNaN(parseInt(newPercent)) && newPercent !== '') {
                        // If it's not a number and not empty, revert to a valid number
                        newPercent = parseInt(newPercent) || 0;
                        element.textContent = newPercent;
                    }

                    // Store the current value as a data attribute for later use
                    element.setAttribute('data-current-value', newPercent);

                    // Add keydown event handler for Enter key if not already added
                    if (!element.hasEnterKeyHandler) {
                        element.hasEnterKeyHandler = true;
                        element.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                e.preventDefault(); // Prevent default behavior

                                // Update the percentage value
                                let newPercent = this.textContent.replace('%', '');
                                newPercent = Math.min(100, Math.max(0, parseInt(newPercent) || 0));
                                this.textContent = newPercent;

                                // Update the chart
                                const chart = this.closest('.chart');
                                if (chart) {
                                    chart.setAttribute('data-percent', newPercent);
                                    setTimeout(function() {
                                        $(chart).data('easyPieChart').update(newPercent);
                                    }, 50);
                                }

                                // Remove editing class
                                this.classList.remove('percent-editing');

                                // Blur the element to remove focus
                                this.blur();
                            }
                        });
                    }
                }

                // Use a small delay to ensure we capture the final state after typing
                clearTimeout(element.saveTimeout);
                element.saveTimeout = setTimeout(function() {
                    saveState();
                }, 300); // 300ms delay to avoid saving too frequently while typing
            });

            // Also save state when user clicks away (blur event)
            element.addEventListener('blur', function() {
                // Remove editing class for percentages
                if (element.classList.contains('percent')) {
                    element.classList.remove('percent-editing');
                }
                // If this is a percent element, now we update the chart when the user finishes typing
                if (element.classList.contains('percent')) {
                    let newPercent = element.textContent.replace('%', '');
                    newPercent = Math.min(100, Math.max(0, parseInt(newPercent) || 0));
                    element.textContent = newPercent;

                    // Update the chart's data-percent attribute
                    const chart = element.closest('.chart');
                    if (chart) {
                        chart.setAttribute('data-percent', newPercent);

                        // Update the chart with the new percentage
                        setTimeout(function() {
                            $(chart).data('easyPieChart').update(newPercent);
                        }, 50);
                    }
                }

                // Small delay to ensure we capture the final state
                setTimeout(function() {
                    saveState();
                }, 100);
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
        animate: 1000,
        onStep: function(from, to, percent) {
            // Update the percent text when the chart is animated
            $(this.el).find('.percent').text(Math.round(percent));
        }
    });

    // Add click handler to make editing percentages easier
    $('.chart').on('click', function(e) {
        // Only if we're not already editing
        if (!$(this).find('.percent').is(':focus')) {
            // Focus and select all text in the percent span
            const percentEl = $(this).find('.percent')[0];
            if (percentEl) {
                // Add editing class
                percentEl.classList.add('percent-editing');

                // Create a range and select all text
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(percentEl);
                selection.removeAllRanges();
                selection.addRange(range);

                // Focus the element
                percentEl.focus();

                // Prevent event bubbling
                e.stopPropagation();
            }
        }
    });

    // Add blur handler to remove editing class and animate the chart
    $('.percent').on('blur', function() {
        // Remove editing class
        this.classList.remove('percent-editing');

        // Get the chart element
        const chart = $(this).closest('.chart')[0];

        // Apply animation
        chart.style.animation = 'chartPulse 0.5s ease';

        // Remove animation after it completes
        setTimeout(() => {
            chart.style.animation = '';
        }, 500);
    });

    // Add keydown handler for Enter key
    $('.percent').on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.blur(); // This will trigger the blur event above
        }
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
    // Add CSS for button animations - we'll use the styles from the HTML now
    const style = document.createElement('style');
    style.textContent = `
        .toolbar-button.clicked {
            transform: scale(0.95);
        }

        /* Add styles for font size spans */
        .custom-font-size {
            display: inline;
        }
    `;
    document.head.appendChild(style);

    // Track the currently active editable element
    let activeEditableElement = null;

    // Function to get the current selection
    function getSelection() {
        return window.getSelection();
    }

    // Function to get the current range if there's a selection
    function getRange() {
        const selection = getSelection();
        if (selection && selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return null;
    }

    // Function to select all text in an element
    function selectAllInElement(element) {
        if (!element) return false;

        const selection = getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
    }

    // Function to apply basic formatting (bold, italic, underline)
    function applyBasicFormatting(command) {
        // Save the current selection
        const selection = getSelection();
        const range = getRange();

        // If there's a selection, apply formatting directly
        if (range && !range.collapsed) {
            document.execCommand(command, false, null);
            saveState();
            return true;
        }

        // If no selection but we have an active element, select all its text
        if (activeEditableElement) {
            if (selectAllInElement(activeEditableElement)) {
                document.execCommand(command, false, null);
                saveState();
                return true;
            }
        }

        return false;
    }

    // Function to apply font family
    function applyFontFamily(fontFamily) {
        console.log('Applying font family:', fontFamily);

        // Save the current selection
        const selection = getSelection();
        const range = getRange();

        // If there's a selection, apply font family directly
        if (range && !range.collapsed) {
            document.execCommand('fontName', false, fontFamily);
            saveState();
            return true;
        }

        // If no selection but we have an active element, select all its text
        if (activeEditableElement) {
            if (selectAllInElement(activeEditableElement)) {
                document.execCommand('fontName', false, fontFamily);
                saveState();
                return true;
            }
        }

        return false;
    }

    // Function to apply font size
    function applyFontSize(fontSize) {
        console.log('Applying font size:', fontSize);

        // Save the current selection
        const selection = getSelection();
        const range = getRange();

        // If there's a selection, wrap it in a span with the font size
        if (range && !range.collapsed) {
            try {
                // Create a span with the font size
                const span = document.createElement('span');
                span.className = 'custom-font-size';
                span.style.fontSize = fontSize;

                // Extract the selected content and wrap it in the span
                const fragment = range.extractContents();
                span.appendChild(fragment);
                range.insertNode(span);

                // Select the span
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                selection.addRange(newRange);

                saveState();
                return true;
            } catch (e) {
                console.error('Error applying font size to selection:', e);
            }
        }

        // If no selection but we have an active element, apply to the whole element
        if (activeEditableElement) {
            try {
                // If the element already has a font size, update it
                if (activeEditableElement.style.fontSize) {
                    activeEditableElement.style.fontSize = fontSize;
                } else {
                    // Otherwise, select all and wrap in a span
                    if (selectAllInElement(activeEditableElement)) {
                        const span = document.createElement('span');
                        span.className = 'custom-font-size';
                        span.style.fontSize = fontSize;

                        const range = getRange();
                        const fragment = range.extractContents();
                        span.appendChild(fragment);
                        range.insertNode(span);

                        // Select the span
                        selection.removeAllRanges();
                        const newRange = document.createRange();
                        newRange.selectNodeContents(span);
                        selection.addRange(newRange);
                    }
                }

                saveState();
                return true;
            } catch (e) {
                console.error('Error applying font size to element:', e);
            }
        }

        return false;
    }

    // Function to update toolbar state based on current selection or active element
    function updateToolbarState() {
        // Get the element to check - either the selected text's parent or the active element
        let elementToCheck = null;

        const range = getRange();
        if (range && !range.collapsed) {
            // We have a text selection, get its parent element
            const selectedNode = range.commonAncestorContainer;
            elementToCheck = selectedNode.nodeType === 3 ? selectedNode.parentElement : selectedNode;
        } else if (activeEditableElement) {
            // No selection but we have an active element
            elementToCheck = activeEditableElement;
        }

        if (elementToCheck) {
            // Get computed styles
            const computedStyle = window.getComputedStyle(elementToCheck);

            // Update font selector
            const fontSelector = document.getElementById('font-selector');
            if (fontSelector) {
                const fontFamily = computedStyle.fontFamily.split(',')[0].replace(/['"\/]/g, '').trim();

                // Find the closest match in the dropdown
                for (let i = 0; i < fontSelector.options.length; i++) {
                    if (fontSelector.options[i].value.toLowerCase() === fontFamily.toLowerCase()) {
                        fontSelector.selectedIndex = i;
                        break;
                    }
                }
            }

            // Update font size selector
            const fontSizeSelector = document.getElementById('font-size-selector');
            if (fontSizeSelector) {
                const fontSize = parseInt(computedStyle.fontSize);

                // Find the closest match in the dropdown
                let bestMatch = 0;
                let minDiff = Number.MAX_VALUE;

                for (let i = 0; i < fontSizeSelector.options.length; i++) {
                    // Parse the pixel value from the option (e.g., "16px" -> 16)
                    const optionSize = parseInt(fontSizeSelector.options[i].value);
                    const diff = Math.abs(optionSize - fontSize);

                    if (diff < minDiff) {
                        minDiff = diff;
                        bestMatch = i;
                    }
                }

                fontSizeSelector.selectedIndex = bestMatch;
            }
        }
    }

    // Track clicks on editable elements to maintain the active element
    document.addEventListener('mousedown', function(e) {
        // Find if we clicked on or within an editable element
        const clickedElement = e.target.closest('[contenteditable="true"]');

        if (clickedElement) {
            // Update the active element
            activeEditableElement = clickedElement;
            console.log('Active element set to:', activeEditableElement);
        } else {
            // If we clicked outside editable elements, clear the active element
            // but only if we didn't click on a toolbar button
            if (!e.target.closest('.editor-toolbar')) {
                activeEditableElement = null;
            }
        }
    });

    // Track selection changes to update toolbar state
    document.addEventListener('selectionchange', function() {
        updateToolbarState();
    });

    // Initialize toolbar buttons
    document.getElementById('bold-btn').addEventListener('click', function() {
        applyBasicFormatting('bold');
    });

    document.getElementById('italic-btn').addEventListener('click', function() {
        applyBasicFormatting('italic');
    });

    document.getElementById('underline-btn').addEventListener('click', function() {
        applyBasicFormatting('underline');
    });

    // Initialize font selector
    const fontSelector = document.getElementById('font-selector');
    if (fontSelector) {
        fontSelector.addEventListener('change', function() {
            applyFontFamily(this.value);
        });
    }

    // Initialize font size selector
    const fontSizeSelector = document.getElementById('font-size-selector');
    if (fontSizeSelector) {
        fontSizeSelector.addEventListener('change', function() {
            applyFontSize(this.value);
        });
    }

    document.getElementById('undo-btn').addEventListener('click', function() {
        // Add visual feedback
        const btn = this;
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 300);

        // Perform undo
        undo();
    });

    document.getElementById('redo-btn').addEventListener('click', function() {
        // Add visual feedback
        const btn = this;
        btn.classList.add('active');
        setTimeout(() => btn.classList.remove('active'), 300);

        // Perform redo
        redo();
    });

    // Initialize preview button
    document.getElementById('preview-btn').addEventListener('click', togglePreview);

    // Initialize save button
    document.getElementById('save-btn').addEventListener('click', savePortfolio);

    // Initialize exit button
    document.getElementById('exit-btn').addEventListener('click', function() {
        window.location.href = '../index.html';
    });

    // Add keyboard shortcuts for undo/redo
    document.addEventListener('keydown', function(e) {
        // Ctrl+Z for undo
        if (e.ctrlKey && e.key === 'z') {
            // Don't interfere with browser's native undo in editable elements
            const activeElement = document.activeElement;
            const isInEditableField = activeElement.isContentEditable ||
                                     activeElement.tagName === 'INPUT' ||
                                     activeElement.tagName === 'TEXTAREA';

            if (!isInEditableField) {
                e.preventDefault();
                const undoBtn = document.getElementById('undo-btn');
                if (undoBtn && !undoBtn.classList.contains('disabled')) {
                    undoBtn.classList.add('active');
                    setTimeout(() => undoBtn.classList.remove('active'), 300);
                    undo();
                }
            }
        }

        // Ctrl+Y for redo
        if (e.ctrlKey && e.key === 'y') {
            // Don't interfere with browser's native redo in editable elements
            const activeElement = document.activeElement;
            const isInEditableField = activeElement.isContentEditable ||
                                     activeElement.tagName === 'INPUT' ||
                                     activeElement.tagName === 'TEXTAREA';

            if (!isInEditableField) {
                e.preventDefault();
                const redoBtn = document.getElementById('redo-btn');
                if (redoBtn && !redoBtn.classList.contains('disabled')) {
                    redoBtn.classList.add('active');
                    setTimeout(() => redoBtn.classList.remove('active'), 300);
                    redo();
                }
            }
        }
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
        previewBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> Edit';

        // Hide all edit controls
        document.querySelectorAll('.item-controls, .section-controls').forEach(control => {
            control.style.display = 'none';
        });

        // Store original state and disable contenteditable
        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            element.setAttribute('data-original-editable', 'true');
            element.setAttribute('contenteditable', 'false');
            // Remove highlighting classes
            element.classList.remove('selecting-all');
            element.classList.remove('active-edit');
        });

        // Make links clickable in preview mode
        document.querySelectorAll('a').forEach(link => {
            link.style.pointerEvents = 'auto';
        });
    } else {
        // Exit preview mode
        document.body.classList.remove('preview-mode');
        toolbar.classList.remove('preview-mode');
        previewBtn.classList.remove('active');
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';

        // Show all edit controls
        document.querySelectorAll('.item-controls, .section-controls').forEach(control => {
            control.style.display = '';
        });

        // Restore contenteditable state
        document.querySelectorAll('[data-original-editable="true"]').forEach(element => {
            element.setAttribute('contenteditable', 'true');
        });

        // Prevent links from navigating in edit mode
        document.querySelectorAll('a').forEach(link => {
            if (!link.classList.contains('visit-project')) {
                link.style.pointerEvents = 'none';
            }
        });
    }
}

// Function to save the portfolio
function savePortfolio() {
    // Show a saving indicator
    const saveBtn = document.getElementById('save-btn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    saveBtn.classList.add('saving');

    // Simulate saving (in a real app, this would save to a server)
    setTimeout(function() {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';

        // Reset button after a delay
        setTimeout(function() {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
            saveBtn.classList.remove('saving');
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
            percent.setAttribute('contenteditable', 'true');

            // Add event listeners for the percent element
            percent.addEventListener('input', function() {
                // Get the new percentage value (remove the % if it exists)
                let newPercent = this.textContent.replace('%', '');

                // Only validate if it's a number, but don't force it to be between 0-100 yet
                // This allows the user to type multi-digit numbers without interference
                if (isNaN(parseInt(newPercent)) && newPercent !== '') {
                    // If it's not a number and not empty, revert to a valid number
                    newPercent = parseInt(newPercent) || 0;
                    this.textContent = newPercent;
                }

                // Store the current value as a data attribute for later use
                this.setAttribute('data-current-value', newPercent);
            });

            // Add keydown event to handle Enter key
            percent.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent default behavior

                    // Update the percentage value
                    let newPercent = this.textContent.replace('%', '');
                    newPercent = Math.min(100, Math.max(0, parseInt(newPercent) || 0));
                    this.textContent = newPercent;

                    // Update the chart
                    chart.setAttribute('data-percent', newPercent);
                    setTimeout(function() {
                        $(chart).data('easyPieChart').update(newPercent);
                    }, 50);

                    // Blur the element to remove focus
                    this.blur();
                }
            });

            percent.addEventListener('blur', function() {
                // Make sure it has a valid value
                let newPercent = this.textContent.replace('%', '');
                newPercent = Math.min(100, Math.max(0, parseInt(newPercent) || 0));
                this.textContent = newPercent;

                // Update the chart's data-percent attribute
                chart.setAttribute('data-percent', newPercent);

                // Update the chart with the new percentage
                setTimeout(function() {
                    $(chart).data('easyPieChart').update(newPercent);

                    // Add animation to the chart
                    chart.style.animation = 'chartPulse 0.5s ease';

                    // Remove animation after it completes
                    setTimeout(() => {
                        chart.style.animation = '';
                    }, 500);
                }, 50);

                saveState();
            });

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

// Function to capture the current state of editable elements
function captureState() {
    const state = {};

    // Capture text content of all editable elements
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        const id = element.id || generateUniqueId(element);
        state[id] = {
            content: element.innerHTML,
            path: getElementPath(element)
        };
    });

    // Capture portfolio items
    state.portfolioItems = [];
    document.querySelectorAll('.portfolio-item').forEach((item, index) => {
        const itemState = {
            index: index,
            title: item.querySelector('h4') ? item.querySelector('h4').innerHTML : '',
            category: item.querySelector('small') ? item.querySelector('small').innerHTML : '',
            link: item.getAttribute('data-link') || '#',
            imageSrc: item.querySelector('img') ? item.querySelector('img').src : ''
        };
        state.portfolioItems.push(itemState);
    });

    // Capture skills
    state.skills = [];
    document.querySelectorAll('.skill').forEach((skill, index) => {
        const chart = skill.querySelector('.chart');
        const percent = skill.querySelector('.percent');
        const skillState = {
            index: index,
            title: skill.querySelector('h4') ? skill.querySelector('h4').innerHTML : '',
            percent: percent ? percent.innerHTML : '',
            dataPercent: chart ? chart.getAttribute('data-percent') : ''
        };
        state.skills.push(skillState);
    });

    // Capture about image
    const aboutImage = document.getElementById('about-image');
    if (aboutImage) {
        state.aboutImage = aboutImage.src;
    }

    return state;
}

// Generate a unique ID for elements without IDs
function generateUniqueId(element) {
    const path = getElementPath(element);
    return 'element_' + btoa(path).replace(/[^a-zA-Z0-9]/g, '');
}

// Get the CSS selector path for an element
function getElementPath(element) {
    if (!element) return '';

    let path = '';
    while (element && element !== document.body) {
        let selector = element.tagName.toLowerCase();
        if (element.id) {
            selector += '#' + element.id;
            return selector + path;
        } else {
            let sibling = element;
            let index = 1;
            while (sibling = sibling.previousElementSibling) {
                if (sibling.tagName === element.tagName) index++;
            }
            selector += ':nth-of-type(' + index + ')';
        }
        path = ' > ' + selector + path;
        element = element.parentElement;
    }
    return path.substring(3); // Remove the first ' > '
}

// Function to save the current state
function saveState() {
    // Don't save state during undo/redo operations
    if (isUndoRedoOperation) return;

    // Capture the current state
    const currentState = captureState();

    // Check if this is a new state (different from the last one)
    let isNewState = true;
    if (undoStack.length > 0) {
        const lastState = undoStack[undoStack.length - 1];
        // Simple comparison - in a real app you'd do a deep comparison
        isNewState = JSON.stringify(currentState) !== JSON.stringify(lastState);
    }

    // Only add to stack if it's a new state
    if (isNewState) {
        // Add to undo stack
        undoStack.push(currentState);

        // Clear redo stack when a new change is made
        redoStack = [];

        // Enable/disable undo/redo buttons based on stack state
        updateUndoRedoButtons();

        console.log('State saved. Undo stack size:', undoStack.length);
    }
}

// Function to apply a state
function applyState(state) {
    // Set flag to prevent saveState calls during state application
    isUndoRedoOperation = true;

    // Store the current scroll position
    const scrollPos = window.scrollY;

    try {
        // Apply text content to editable elements
        for (const id in state) {
            if (id === 'portfolioItems' || id === 'skills' || id === 'aboutImage') continue;

            let element;
            if (id.startsWith('element_')) {
                // Find by path for generated IDs
                const path = state[id].path;
                element = document.querySelector(path);
            } else {
                // Find by ID
                element = document.getElementById(id);
            }

            if (element && state[id].content) {
                element.innerHTML = state[id].content;
            }
        }

        // Apply about image if it exists
        if (state.aboutImage) {
            const aboutImage = document.getElementById('about-image');
            if (aboutImage) {
                aboutImage.src = state.aboutImage;
            }
        }

        // Apply portfolio items state
        if (state.portfolioItems && state.portfolioItems.length > 0) {
            const portfolioItems = document.querySelectorAll('.portfolio-item');

            // Only update if we have the same number of items
            // Otherwise, we'd need more complex logic to add/remove items
            if (portfolioItems.length === state.portfolioItems.length) {
                state.portfolioItems.forEach((itemState, index) => {
                    if (index < portfolioItems.length) {
                        const item = portfolioItems[index];

                        // Update title
                        const title = item.querySelector('h4');
                        if (title && itemState.title) {
                            title.innerHTML = itemState.title;
                        }

                        // Update category
                        const category = item.querySelector('small');
                        if (category && itemState.category) {
                            category.innerHTML = itemState.category;
                        }

                        // Update link
                        item.setAttribute('data-link', itemState.link);
                        const visitBtn = item.querySelector('.visit-project');
                        if (visitBtn) {
                            visitBtn.href = itemState.link;
                        }

                        // Update image
                        const img = item.querySelector('img');
                        if (img && itemState.imageSrc) {
                            img.src = itemState.imageSrc;
                        }
                    }
                });
            }
        }

        // Apply skills state
        if (state.skills && state.skills.length > 0) {
            const skills = document.querySelectorAll('.skill');

            // Only update if we have the same number of skills
            if (skills.length === state.skills.length) {
                state.skills.forEach((skillState, index) => {
                    if (index < skills.length) {
                        const skill = skills[index];

                        // Update title
                        const title = skill.querySelector('h4');
                        if (title && skillState.title) {
                            title.innerHTML = skillState.title;
                        }

                        // Update percent
                        const percent = skill.querySelector('.percent');
                        const chart = skill.querySelector('.chart');
                        if (percent && skillState.percent) {
                            percent.innerHTML = skillState.percent;
                        }

                        // Update chart data-percent attribute
                        if (chart && skillState.dataPercent) {
                            chart.setAttribute('data-percent', skillState.dataPercent);
                            // Update the chart
                            $(chart).data('easyPieChart').update(parseInt(skillState.dataPercent));
                        }
                    }
                });
            }
        }

        // Reinitialize charts and counters
        initializeSkillCharts();
        initializeCounters();

        // Reinitialize portfolio
        $('.portfolio-items').isotope('reloadItems').isotope();

        // Re-add input event listeners to all editable elements
        document.querySelectorAll('[contenteditable="true"]').forEach(function(element) {
            // Remove existing input listeners to avoid duplicates
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);

            // Add input event listener with debounce
            newElement.addEventListener('input', function() {
                // Use a small delay to ensure we capture the final state after typing
                clearTimeout(newElement.saveTimeout);
                newElement.saveTimeout = setTimeout(function() {
                    saveState();
                }, 300); // 300ms delay to avoid saving too frequently while typing
            });

            // Also save state when user clicks away (blur event)
            newElement.addEventListener('blur', function() {
                // Small delay to ensure we capture the final state
                setTimeout(function() {
                    saveState();
                }, 100);
            });

            // Re-add click listener for selection
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (newElement.contentEditable === 'true') {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(newElement);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    newElement.focus();
                }
            });
        });

        // Restore scroll position
        window.scrollTo(0, scrollPos);

        // Update undo/redo buttons
        updateUndoRedoButtons();
    } catch (error) {
        console.error('Error applying state:', error);
    } finally {
        // Reset flag
        isUndoRedoOperation = false;
    }
}

// Function to update undo/redo buttons state
function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    if (undoBtn) {
        undoBtn.disabled = undoStack.length <= 1;
        undoBtn.classList.toggle('disabled', undoStack.length <= 1);
    }

    if (redoBtn) {
        redoBtn.disabled = redoStack.length === 0;
        redoBtn.classList.toggle('disabled', redoStack.length === 0);
    }
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
        saveState();
    }

    // Update undo/redo buttons
    updateUndoRedoButtons();
}

// Function to undo the last change
function undo() {
    if (undoStack.length > 1) { // Keep at least one state in the stack
        // Save the current state to redo stack and remove it from undo stack
        redoStack.push(undoStack.pop());

        // Apply the previous state
        applyState(undoStack[undoStack.length - 1]);

        console.log('Undo performed. Undo stack:', undoStack.length, 'Redo stack:', redoStack.length);
    }
}

// Function to redo the last undone change
function redo() {
    if (redoStack.length > 0) {
        // Get the state to redo
        const stateToRedo = redoStack.pop();

        // Add it to the undo stack
        undoStack.push(stateToRedo);

        // Apply the state
        applyState(stateToRedo);

        console.log('Redo performed. Undo stack:', undoStack.length, 'Redo stack:', redoStack.length);
    }
}
