// Clear localStorage to prevent saved content from overriding CSS styles
localStorage.removeItem('portfolioContent');
localStorage.removeItem('portfolioContent_old');

document.addEventListener('DOMContentLoaded', function() {
    // Clear localStorage to fix content issues
    localStorage.removeItem('portfolioContent');
    console.log('Cleared localStorage to fix content issues');
    
    // Reset brand name styling to ensure CSS is applied correctly
    const brandName = document.querySelector('.brand-name');
    if (brandName) {
        // Remove any inline styles that could override the CSS
        brandName.removeAttribute('style');
        console.log('Reset brand name styling');
    }
    
    // Reset fontSize dropdown to prevent it from showing incorrect value
    // Get early reference to fontSizeSelect for use throughout the script
    const fontSizeSelect = document.getElementById('fontSize');
    if (fontSizeSelect) {
        // Default to a reasonable size
        fontSizeSelect.value = '16';
    }

    // Navigation Active State
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 180) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll to section when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Track currently active (clicked) element
    let activeElement = null;

    // Add click listener to all editable elements
    document.addEventListener('click', function(e) {
        if (e.target.hasAttribute('contenteditable')) {
            activeElement = e.target;
            // Add a subtle highlight to show which element is active
            document.querySelectorAll('[contenteditable]').forEach(el => {
                el.classList.remove('active-edit');
            });
            activeElement.classList.add('active-edit');
        }
    });

    // Font Size Adjustment
    const sizeSelect = document.getElementById('sizeSelect');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            const selectedSize = this.value;
            if (activeElement && activeElement.hasAttribute('contenteditable')) {
                activeElement.style.fontSize = `${selectedSize}px`;
            }
        });
    }

    // Add Project Button
    const addProjectBtn = document.querySelector('.add-project-btn');
    if (addProjectBtn) {
        // Remove any existing handlers by cloning and replacing
        const newBtn = addProjectBtn.cloneNode(true);
        addProjectBtn.parentNode.replaceChild(newBtn, addProjectBtn);
        
        newBtn.addEventListener('click', function() {
            const projectsContainer = document.querySelector('.projects-grid');
            const newProject = document.createElement('div');
            newProject.className = 'project-card';
            newProject.innerHTML = `
                <div class="project-image">
                    <div class="project-image-placeholder">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="project-overlay">
                        <a href="#" class="btn primary">View Project</a>
                    </div>
                    <div class="project-image-actions">
                        <button class="change-image-btn" title="Change Image">
                            <i class="fas fa-camera"></i>
                        </button>
                        <button class="remove-image-btn" title="Remove Image">
                            <i class="fas fa-trash"></i>
                        </button>
                </div>
                    <div class="project-image-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                </div>
                <button class="delete-project" title="Delete Project">
                    <i class="fas fa-times"></i>
                </button>
                <div class="project-info">
                    <h3 contenteditable="true">Project Title</h3>
                    <p contenteditable="true">Project description goes here. Click to edit.</p>
                    <div class="project-tech">
                        <span><span class="tag-text" contenteditable="true">Tag 1</span> <i class="fas fa-times remove-tag"></i></span>
                        <span><span class="tag-text" contenteditable="true">Tag 2</span> <i class="fas fa-times remove-tag"></i></span>
                    </div>
                    <div class="tag-management">
                        <button class="add-tag-btn">Add Tag</button>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(newProject);
        });
    }

    // Add Category Button
    const addCategoryBtn = document.querySelector('.add-category-btn');
    const skillsGrid = document.querySelector('.skills-grid');

    // We'll initialize the skill variables later in the file

    // Add Skill Buttons (including existing ones)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-btn.skill')) {
            const skillCategory = e.target.closest('.skill-category');
            if (skillCategory && skillModal) {
                currentEditingSkill = null;
                if (skillForm) skillForm.reset();
                
                // Store the category reference in the modal's dataset
                const categoryHeader = skillCategory.querySelector('h3');
                if (categoryHeader) {
                    skillModal.dataset.category = categoryHeader.textContent.trim();
                    
                    // Ensure the skill level display is updated
                    if (skillLevelInput && skillLevelDisplay) {
                        skillLevelInput.value = 50; // Default value
                        skillLevelDisplay.textContent = '50%';
                    }
                    
                showModal(skillModal);
                }
            }
        }
    });

    // Text formatting functionality
    const boldBtn = document.querySelector('[data-command="bold"]');
    const italicBtn = document.querySelector('[data-command="italic"]');
    const underlineBtn = document.querySelector('[data-command="underline"]');
    const undoBtn = document.querySelector('[data-command="undo"]');
    const redoBtn = document.querySelector('[data-command="redo"]');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    // Initialize selection tracking
    let lastSelection = null;
    
    // Store history for undo/redo
    const history = [];
    let historyIndex = -1;
    
    // Save initial state
    saveState();
    
    // Attach event listeners to editable elements
    reattachEventListeners();
    
    // Text formatting commands
    if (boldBtn) boldBtn.addEventListener('click', () => execCommand('bold'));
    if (italicBtn) italicBtn.addEventListener('click', () => execCommand('italic'));
    if (underlineBtn) underlineBtn.addEventListener('click', () => execCommand('underline'));
    
    // Undo/Redo
    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (redoBtn) redoBtn.addEventListener('click', redo);
    
    // Document click to clear selection when clicking outside editable elements
    document.addEventListener('click', function(e) {
        // Check if click is outside any contenteditable
        if (!e.target.closest('[contenteditable="true"]') && 
            !e.target.closest('.toolbar') && 
            !e.target.closest('.toolbar-btn') &&
            !e.target.closest('.style-select')) {
            
            // Clear selecting-all class
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.classList.remove('selecting-all');
            });
        }
    });
    
    // Font family and size
    if (fontFamilySelect) fontFamilySelect.addEventListener('change', () => {
        const selectedFont = fontFamilySelect.value;
        
        // Get the active editable element
        const activeElement = document.querySelector('[contenteditable="true"].selecting-all');
        if (activeElement) {
            // Apply font directly to the element
            activeElement.style.fontFamily = selectedFont;
            
            // Select all text again to maintain selection
            const range = document.createRange();
            range.selectNodeContents(activeElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            lastSelection = range;
            
            // Update displayed font in toolbar
            updateFontDropdownDisplay(selectedFont);
            
            // Save state for undo/redo
            saveState();
        }
    });
    
    if (fontSizeSelect) fontSizeSelect.addEventListener('change', () => {
        // Get the active editable element instead of relying on selection
        const activeElement = document.querySelector('[contenteditable="true"].selecting-all');
        if (activeElement) {
            // Apply font size directly to the entire element
            const pxSize = fontSizeSelect.value;
            activeElement.style.fontSize = `${pxSize}px`;
            
            // Force select all text again to maintain selection
            const range = document.createRange();
            range.selectNodeContents(activeElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            lastSelection = range;
            
            // Save state for undo/redo
            saveState();
        }
    });
    
    // Track text selection
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            lastSelection = selection.getRangeAt(0);
            
            // Check if selection is within a contenteditable element
            let containerElement = selection.anchorNode;
            while (containerElement && containerElement.nodeType !== 1) {
                containerElement = containerElement.parentNode;
            }
            
            if (containerElement && containerElement.hasAttribute('contenteditable')) {
                // Update toolbar state based on selection
                updateToolbarState(containerElement);
            }
        }
    });
    
    // Click handler for editable elements
    document.addEventListener('click', (e) => {
        // Find the closest contenteditable element
        const editableElement = e.target.closest('[contenteditable="true"]');
        
        if (editableElement) {
            // If it's inside a button, prevent default navigation
            const buttonParent = editableElement.closest('a.btn');
            if (buttonParent) {
                e.preventDefault();
                buttonParent.addEventListener('click', function(evt) {
                    // Only prevent navigation if the text is selected
                    if (editableElement.classList.contains('selecting-all')) {
                        evt.preventDefault();
                    }
                }, { once: true });
            }
            
            // Focus the element
            editableElement.focus();
            
            // Add class for highlighting selected element
            document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                el.classList.remove('selecting-all');
            });
            editableElement.classList.add('selecting-all');
            
            // Select all text in the element
            const range = document.createRange();
            range.selectNodeContents(editableElement);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            lastSelection = range;
            
            // Update active state of toolbar buttons based on current selection
            updateToolbarState(editableElement);
        }
    });
    
    // Update toolbar state based on selected element's styles
    function updateToolbarState(element) {
        if (!element) return;
        
        // Check if bold/italic/underline are applied
        const isBold = window.getComputedStyle(element).fontWeight >= 600;
        const isItalic = window.getComputedStyle(element).fontStyle === 'italic';
        const isUnderlined = window.getComputedStyle(element).textDecoration.includes('underline');
        
        // Update toolbar buttons
        if (boldBtn) boldBtn.classList.toggle('active', isBold);
        if (italicBtn) italicBtn.classList.toggle('active', isItalic);
        if (underlineBtn) underlineBtn.classList.toggle('active', isUnderlined);
        
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily.replace(/["']/g, '').split(',')[0].trim();
        const fontSize = parseInt(computedStyle.fontSize);
        
        // Update font family dropdown
        if (fontFamilySelect) {
            updateFontDropdownDisplay(fontFamily);
        }
        
        // Update font size dropdown
        if (fontSizeSelect && fontSize) {
            // Find the closest match in the dropdown
            const options = Array.from(fontSizeSelect.options);
            const bestMatch = options.find(opt => parseInt(opt.value) === fontSize) ||
                             options.reduce((prev, curr) => {
                                 const prevDiff = Math.abs(parseInt(prev.value) - fontSize);
                                 const currDiff = Math.abs(parseInt(curr.value) - fontSize);
                                 return currDiff < prevDiff ? curr : prev;
                             });
            
            if (bestMatch) fontSizeSelect.value = bestMatch.value;
        }
    }
    
    // Helper function to update font dropdown display
    function updateFontDropdownDisplay(fontFamily) {
        if (!fontFamilySelect) return;
        
        // Normalize font name for comparison
        const normalizedFont = fontFamily.toLowerCase().trim();
        
        // Find matching option
        const options = Array.from(fontFamilySelect.options);
        const match = options.find(opt => 
            opt.value.toLowerCase() === normalizedFont || 
            normalizedFont.includes(opt.value.toLowerCase())
        );
        
        // Update dropdown value
        if (match) {
            fontFamilySelect.value = match.value;
            
            // Also update visible text if custom dropdown is used
            const dropdownText = fontFamilySelect.parentElement?.querySelector('.selected-value');
            if (dropdownText) {
                dropdownText.textContent = match.text || match.value;
            }
        }
    }
    
    // Execute command function
    function execCommand(command, showUI = false, value = null) {
        // If there's no active selection, check if we have a selected editable element
        const selection = window.getSelection();
        const selectedEditableElement = document.querySelector('[contenteditable="true"].selecting-all');
        
        if (selection.rangeCount === 0 && selectedEditableElement) {
            // Select all text in the element
            const range = document.createRange();
            range.selectNodeContents(selectedEditableElement);
            selection.removeAllRanges();
            selection.addRange(range);
            lastSelection = range;
        } else if (lastSelection) {
            // Restore selection if available
            selection.removeAllRanges();
            selection.addRange(lastSelection);
        }
        
        // Execute the command
        document.execCommand(command, showUI, value);
        
        // Update toolbar state
        if (selectedEditableElement) {
            updateToolbarState(selectedEditableElement);
        }
        
        // Save state for undo/redo
        saveState();
    }
    
    // Save current state for undo/redo
    function saveState() {
        const content = document.querySelector('.portfolio-container').innerHTML;
        
        // If we're not at the end of the history, remove future states
        if (historyIndex < history.length - 1) {
            history.splice(historyIndex + 1);
        }
        
        // Add current state to history
        history.push(content);
        historyIndex = history.length - 1;
        
        // Limit history size
        if (history.length > 50) {
            history.shift();
            historyIndex--;
        }
        
        // Update undo/redo button states
        updateUndoRedoButtons();
    }
    
    // Undo function
    function undo() {
        if (historyIndex > 0) {
            historyIndex--;
            restoreState();
        }
    }
    
    // Redo function
    function redo() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreState();
        }
    }
    
    // Restore state from history
    function restoreState() {
        const portfolioContainer = document.querySelector('.portfolio-container');
        portfolioContainer.innerHTML = history[historyIndex];
        
        // Re-attach event listeners to editable elements
        reattachEventListeners();
        
        updateUndoRedoButtons();
    }
    
    // Re-attach event listeners after DOM changes
    function reattachEventListeners() {
        // Re-attach click listeners to editable elements
        document.querySelectorAll('[contenteditable="true"]').forEach(element => {
            element.addEventListener('click', function(e) {
                // Prevent event bubbling to document click handler
                e.stopPropagation();
                
                // Find the closest contenteditable element (should be this element)
                const editableElement = e.target.closest('[contenteditable="true"]');
                
                if (editableElement) {
                    // If it's inside a button, prevent default navigation
                    const buttonParent = editableElement.closest('a.btn');
                    if (buttonParent) {
                        e.preventDefault();
                        buttonParent.addEventListener('click', function(evt) {
                            // Only prevent navigation if the text is selected
                            if (editableElement.classList.contains('selecting-all')) {
                                evt.preventDefault();
                            }
                        }, { once: true });
                    }
                    
                    // Focus the element
                    editableElement.focus();
                    
                    // Add class for highlighting selected element
                    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
                        el.classList.remove('selecting-all');
                    });
                    editableElement.classList.add('selecting-all');
                    
                    // Select all text in the element
                    const range = document.createRange();
                    range.selectNodeContents(editableElement);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    lastSelection = range;
                    
                    // Update active state of toolbar buttons
                    updateToolbarState(editableElement);
                }
            });
        });
    }
    
    // Update undo/redo button states
    function updateUndoRedoButtons() {
        if (undoBtn) {
            undoBtn.disabled = historyIndex <= 0;
            undoBtn.classList.toggle('disabled', historyIndex <= 0);
        }
        
        if (redoBtn) {
            redoBtn.disabled = historyIndex >= history.length - 1;
            redoBtn.classList.toggle('disabled', historyIndex >= history.length - 1);
        }
    }
    
    // Convert font size to appropriate value (keep this for backward compatibility)
    function getFontSizeValue(px) {
        // Convert px to font size (1-7)
        const size = parseInt(px, 10);
        if (size <= 10) return 1;
        if (size <= 13) return 2;
        if (size <= 16) return 3;
        if (size <= 18) return 4;
        if (size <= 24) return 5;
        if (size <= 32) return 6;
        return 7;
    }

    // Profile Photo Upload and Remove
    const profilePhotoInput = document.querySelector('.profile-photo input[type="file"]');
    const profilePhotoImg = document.querySelector('.profile-photo img');
    const removePhotoBtn = document.querySelector('.profile-photo .remove-photo-btn');
    const defaultProfilePhoto = '../../img/profile-placeholder.jpg';

    if (profilePhotoInput && profilePhotoImg) {
        // Load saved profile photo if exists
        const savedProfilePhoto = localStorage.getItem('profilePhoto');
        if (savedProfilePhoto) {
            profilePhotoImg.src = savedProfilePhoto;
        }

        profilePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoImg.src = e.target.result;
                    localStorage.setItem('profilePhoto', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Remove photo functionality
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', function() {
                profilePhotoImg.src = defaultProfilePhoto;
                localStorage.removeItem('profilePhoto');
            });
        }
    }

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    let isDarkMode = true; // Start with dark mode by default

    if (themeToggle) {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            if (savedTheme === 'light') {
                enableLightMode();
            }
        }

        themeToggle.addEventListener('click', function() {
            if (isDarkMode) {
                enableLightMode();
            } else {
                enableDarkMode();
            }
            // Save theme preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    function enableDarkMode() {
        body.style.setProperty('--dark-bg', '#0a0a0a');
        body.style.setProperty('--darker-bg', '#050505');
        body.style.setProperty('--text-color', '#ffffff');
        body.style.setProperty('--text-secondary', '#b3b3b3');
        themeToggle.querySelector('i').className = 'fas fa-moon';
        isDarkMode = true;
    }

    function enableLightMode() {
        body.style.setProperty('--dark-bg', '#f5f5f5');
        body.style.setProperty('--darker-bg', '#e0e0e0');
        body.style.setProperty('--text-color', '#333333');
        body.style.setProperty('--text-secondary', '#666666');
        themeToggle.querySelector('i').className = 'fas fa-sun';
        isDarkMode = false;
    }

    // Save Functionality
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Save all editable content
            const editableElements = document.querySelectorAll('[contenteditable="true"]');
            const savedContent = {};

            editableElements.forEach((element, index) => {
                // Generate a more reliable key for storage
                // Get the section id and element position to create a more stable identifier
                const section = element.closest('section, div[id], footer, nav');
                const sectionId = section ? (section.id || section.className) : 'other';
                const elementType = element.tagName.toLowerCase();
                const elementClass = element.className ? element.className.split(' ')[0] : '';
                
                // Create a more meaningful key that better preserves location information
                const key = `${sectionId}_${elementType}_${elementClass}_${index}`;
                
                // Get text content for additional verification during content restoration
                const textContent = element.textContent.trim();
                
                // Get parent info for better context
                const parentElement = element.parentElement;
                const parentType = parentElement ? parentElement.tagName.toLowerCase() : null;
                const parentClass = parentElement && parentElement.className ? 
                                  parentElement.className.split(' ')[0] : null;
                
                // Find position among siblings of same type
                const siblings = parentElement ? 
                    Array.from(parentElement.children).filter(el => el.tagName === element.tagName) : [];
                const positionIndex = siblings.indexOf(element);
                
                savedContent[key] = {
                    content: element.innerHTML,
                    id: element.id || null,
                    className: element.className,
                    path: getElementPath(element), // Store path for more reliable element identification
                    sectionId: sectionId,
                    elementType: elementType,
                    elementClass: elementClass,
                    textContent: textContent,
                    parentType: parentType,
                    parentClass: parentClass,
                    positionIndex: positionIndex
                };
                
                // Special handling for contact items (keep for backwards compatibility)
                if (element.closest('.contact-item')) {
                    localStorage.setItem(`contact_${element.textContent}`, element.textContent);
                }
            });

            // Save to localStorage
            localStorage.setItem('portfolioContent', JSON.stringify(savedContent));

            // Show save confirmation
            const icon = this.querySelector('i');
            icon.className = 'fas fa-check';
            setTimeout(() => {
                icon.className = 'fas fa-save';
            }, 2000);
        });

        // Load saved content on page load
        const savedContent = localStorage.getItem('portfolioContent');
        if (savedContent) {
            try {
            const content = JSON.parse(savedContent);
            const editableElements = document.querySelectorAll('[contenteditable="true"]');
                const processedElements = new Set(); // Track elements we've already processed
                
                // First attempt: match by stored path
                editableElements.forEach(element => {
                    const path = getElementPath(element);
                    // Find stored content by path
                    const matchedEntries = Object.entries(content).filter(([key, value]) => 
                        value.path && value.path === path
                    );
                    
                    if (matchedEntries.length > 0) {
                        element.innerHTML = matchedEntries[0][1].content;
                        processedElements.add(element);
                    }
                });
                
                // Second attempt: match by section, parent, and position
                editableElements.forEach(element => {
                    if (processedElements.has(element)) return; // Skip already processed elements
                    
                    const section = element.closest('section, div[id], footer, nav');
                    const sectionId = section ? (section.id || section.className) : 'other';
                    const elementType = element.tagName.toLowerCase();
                    
                    // Get parent info
                    const parentElement = element.parentElement;
                    const parentType = parentElement ? parentElement.tagName.toLowerCase() : null;
                    const parentClass = parentElement && parentElement.className ? 
                                      parentElement.className.split(' ')[0] : null;
                    
                    // Find position among siblings
                    const siblings = parentElement ? 
                        Array.from(parentElement.children).filter(el => el.tagName === element.tagName) : [];
                    const positionIndex = siblings.indexOf(element);
                    
                    // Find matching entries
                    const matchingEntries = Object.entries(content).filter(([key, value]) => {
                        // First check section and element type
                        const basicMatch = value.sectionId === sectionId && 
                                          value.elementType === elementType;
                        
                        // Then check parent info if available
                        const parentMatch = value.parentType === parentType && 
                                          (value.parentClass === parentClass || !parentClass);
                        
                        // Finally, check position index if possible
                        const positionMatch = value.positionIndex === positionIndex;
                        
                        return basicMatch && (parentMatch || !parentType) && (positionMatch || positionIndex === -1);
                    });
                    
                    if (matchingEntries.length > 0) {
                        // If multiple matches, use the one with matching class if possible
                        const elementClass = element.className ? element.className.split(' ')[0] : '';
                        const classMatches = matchingEntries.filter(([key, value]) => 
                            value.elementClass === elementClass
                        );
                        
                        const bestMatch = classMatches.length > 0 ? classMatches[0][1] : matchingEntries[0][1];
                        element.innerHTML = bestMatch.content;
                        processedElements.add(element);
                    }
                });
                
                // Third attempt: any remaining elements with fuzzy matching by section
                editableElements.forEach(element => {
                    if (processedElements.has(element)) return; // Skip already processed elements
                    
                    const section = element.closest('section, div[id], footer, nav');
                    const sectionId = section ? (section.id || section.className) : 'other';
                    
                    // Find any content in the same section
                    const sectionEntries = Object.entries(content).filter(([key, value]) => 
                        value.sectionId === sectionId || 
                        (value.path && value.path.includes(sectionId))
                    );
                    
                    if (sectionEntries.length > 0) {
                        // Calculate path similarity score for each entry
                        const elementPath = getElementPath(element);
                        let bestMatch = null;
                        let bestMatchScore = 0;
                        
                        sectionEntries.forEach(([key, value]) => {
                            // Skip entries with content already used
                            if (!value.used) {
                                const pathParts1 = value.path.split(' > ');
                                const pathParts2 = elementPath.split(' > ');
                                
                                // Calculate path similarity score
                                let score = 0;
                                const minLength = Math.min(pathParts1.length, pathParts2.length);
                                
                                for (let i = 1; i <= minLength; i++) {
                                    if (pathParts1[pathParts1.length - i] === pathParts2[pathParts2.length - i]) {
                                        score += 1;
                                    }
                                }
                                
                                if (score > bestMatchScore) {
                                    bestMatchScore = score;
                                    bestMatch = value;
                                }
                            }
                        });
                        
                        if (bestMatch && bestMatchScore > 0) {
                            element.innerHTML = bestMatch.content;
                            bestMatch.used = true; // Mark as used to prevent duplicate assignments
                            processedElements.add(element);
                        }
                    }
                });
                
                // Clear any localStorage that might be causing conflicts
                localStorage.removeItem('portfolioContent_old');
                localStorage.setItem('portfolioContent_old', localStorage.getItem('portfolioContent'));
            } catch (error) {
                console.error('Error loading saved content:', error);
            }
        }
    }
    
    // Helper function to get a reliable path to element
    function getElementPath(element) {
        let path = [];
        let current = element;
        
        while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            
            // Add most specific identifiers first - ID is most reliable
            if (current.id) {
                selector += `#${current.id}`;
            } else {
                // Add section identification for better context
                if (current.tagName === 'SECTION' && current.id) {
                    selector += `#${current.id}`;
                }
                
                // Add role attribute if present
                if (current.getAttribute('role')) {
                    selector += `[role="${current.getAttribute('role')}"]`;
                }
                
                // Add contenteditable attribute if present
                if (current.getAttribute('contenteditable')) {
                    selector += `[contenteditable="${current.getAttribute('contenteditable')}"]`;
                }
                
                // Add positional information for siblings
                let parent = current.parentElement;
                if (parent) {
                    let siblings = Array.from(parent.children).filter(child => 
                        child.tagName === current.tagName
                    );
                    
                    if (siblings.length > 1) {
                        let index = siblings.indexOf(current);
                        if (index !== -1) {
                            selector += `:nth-of-type(${index + 1})`;
                        }
                    }
                }
                
                // Add classes, but filter out dynamic or state classes
                if (current.className) {
                    const classes = current.className.split(' ')
                        .filter(cls => 
                            cls && 
                            !cls.includes('active') && 
                            !cls.includes('hover') && 
                            !cls.includes('focus') &&
                            !cls.includes('show') &&
                            !cls.includes('hidden')
                        );
                    
                    if (classes.length > 0) {
                        selector += `.${classes.join('.')}`;
                    }
                }
            }
            
            path.unshift(selector);
            current = current.parentElement;
        }
        
        return path.join(' > ');
    }

    // Skills Management
    const skillForm = document.getElementById('skillForm');
    const skillModal = document.getElementById('skillModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    let currentEditingSkill = null;

    // Initialize skill level display
    const skillLevelInput = document.getElementById('skillLevel');
    const skillLevelDisplay = skillLevelInput ? skillLevelInput.nextElementSibling : null;

    if (skillLevelInput && skillLevelDisplay) {
        skillLevelInput.addEventListener('input', function() {
            skillLevelDisplay.textContent = `${this.value}%`;
        });
    }

    // Handle skill form submission
    if (skillForm) {
        skillForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('skillName').value.trim();
            const level = document.getElementById('skillLevel').value;
            
            if (!name) return; // Don't add if name is empty
            
            if (currentEditingSkill) {
                // Update existing skill
                currentEditingSkill.querySelector('.skill-name').textContent = name;
                const progressBar = currentEditingSkill.querySelector('.skill-progress');
                progressBar.style.width = `${level}%`;
                currentEditingSkill = null;
            } else {
                // Create new skill
                const skillItem = createSkillItem(name, level);
                const categoryName = skillModal.dataset.category;
                
                // More robust category finding
                const skillCategories = document.querySelectorAll('.skill-category');
                let targetCategory = null;
                
                // Look through all categories to find a match
                skillCategories.forEach(category => {
                    const header = category.querySelector('h3');
                    if (header && header.textContent.trim() === categoryName) {
                        targetCategory = category;
                    }
                });
                
                if (targetCategory) {
                    const skillItems = targetCategory.querySelector('.skill-items');
                    if (skillItems) {
                        skillItems.appendChild(skillItem);
                        
                        // Scroll to the newly added skill
                        setTimeout(() => {
                            skillItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                }
            }
            
            hideModal(skillModal);
            if (skillForm) skillForm.reset();
        });
    }

    // Create skill item
    function createSkillItem(name, level) {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <span class="skill-name" contenteditable="true">${name}</span>
            <div class="skill-level">
                <div class="skill-progress" style="width: ${level}%;"></div>
            </div>
            <div class="skill-actions">
                <button class="edit-skill" title="Edit Skill">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-skill" title="Delete Skill">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // No event handlers attached here - we use the global event listener instead

        return skillItem;
    }

    // Add cancel button handlers
    document.querySelectorAll('.cancel-btn, .close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal);
                if (modal.querySelector('form')) {
                    modal.querySelector('form').reset();
                }
            }
        });
    });

    // Remove redundant individual skill edit handlers
    // Edit Skill and Delete Skill event handlers are handled by global event listener
    
    // Add global event listener for delete category buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-category')) {
            const deleteBtn = e.target.closest('.delete-category');
            const category = deleteBtn.closest('.skill-category');
            if (category && confirm('Are you sure you want to delete this category and all its skills?')) {
                category.remove();
            }
        }
    });

    // Add global event listener for delete and edit skill buttons
    document.addEventListener('click', function(e) {
        // Check if it's a delete skill button
        if (e.target.closest('.delete-skill')) {
            const deleteBtn = e.target.closest('.delete-skill');
            const skillItem = deleteBtn.closest('.skill-item');
            
            if (skillItem && confirm('Are you sure you want to delete this skill?')) {
                skillItem.remove();
            }
        }
        
        // Check if it's an edit skill button
        if (e.target.closest('.edit-skill')) {
            const editBtn = e.target.closest('.edit-skill');
            const skillItem = editBtn.closest('.skill-item');
            
            if (skillItem) {
            const skillName = skillItem.querySelector('.skill-name');
            const skillProgress = skillItem.querySelector('.skill-progress');
            
            const newName = prompt('Enter new skill name:', skillName.textContent);
            if (newName !== null) {
                skillName.textContent = newName;
            }
            
                const currentWidth = skillProgress.style.width || '0%';
                const currentPercentage = parseInt(currentWidth);
                
                // Improved validation for percentage input
                let newPercentage = promptForPercentage(currentPercentage);
                if (newPercentage !== null) {
                skillProgress.style.width = newPercentage + '%';
                }
            }
        }
    });

    // Function to validate percentage input
    function promptForPercentage(currentValue) {
        let valid = false;
        let result = null;
        
        while (!valid) {
            const input = prompt('Enter new percentage (0-100):', currentValue);
            
            // Check if canceled
            if (input === null) {
                valid = true;
                result = null;
            } 
            // Check if empty
            else if (input.trim() === '') {
                alert('Please enter a value between 0 and 100.');
            }
            // Check if not a number
            else if (isNaN(input) || !(/^\d+$/.test(input.trim()))) {
                alert('Please enter a valid number between 0 and 100.');
            }
            // Check if out of range
            else {
                const num = parseInt(input.trim());
                if (num < 0 || num > 100) {
                    alert('Please enter a number between 0 and 100.');
                } else {
                    valid = true;
                    result = num;
                }
            }
        }
        
        return result;
    }

    // Modal helpers
    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function hideModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Clear any incorrect saved contact information
    const contactItems = document.querySelectorAll('.contact-item span');
    contactItems.forEach(item => {
        const defaultText = item.textContent;
        // Save the default text
        if (!localStorage.getItem(`contact_${item.textContent}`)) {
            localStorage.setItem(`contact_${item.textContent}`, defaultText);
        }
        // Restore from localStorage or use default
        item.textContent = localStorage.getItem(`contact_${item.textContent}`) || defaultText;
        
        // Make social media and contact links clickable
        makeLinkClickable(item);
    });
    
    // Function to make contact links clickable
    function makeLinkClickable(element) {
        // Get the icon element to identify the type of contact
        const iconElement = element.previousElementSibling;
        if (!iconElement) return;
        
        // Default handler - wrap with contenteditable manipulation
        element.addEventListener('click', function(e) {
            // If user is editing via contenteditable, don't make it a link
            if (element.classList.contains('selecting-all') || 
                element.classList.contains('active-edit')) {
                return;
            }
            
            const text = element.textContent.trim();
            
            // If empty or placeholder, don't make clickable
            if (!text || text === 'Your Location' || text === 'Contact Information') {
                return;
            }
            
            // Handle each type of contact differently
            if (iconElement.classList.contains('fa-envelope')) {
                // Email
                window.open(`mailto:${text}`, '_blank');
            } else if (iconElement.classList.contains('fa-phone')) {
                // Phone
                window.open(`tel:${text.replace(/\s+/g, '')}`, '_blank');
            } else if (iconElement.classList.contains('fa-map-marker-alt')) {
                // Location - open in Google Maps
                window.open(`https://www.google.com/maps/search/${encodeURIComponent(text)}`, '_blank');
            } else if (iconElement.classList.contains('fa-github')) {
                // GitHub - ensure it has https:// prefix
                let url = text;
                if (!url.startsWith('http')) {
                    // Check if it's just a username or full URL
                    if (!url.includes('/')) {
                        url = `https://github.com/${url}`;
                    } else if (!url.includes('github.com')) {
                        url = `https://github.com/${url}`;
                    } else {
                        url = `https://${url}`;
                    }
                }
                window.open(url, '_blank');
            } else if (iconElement.classList.contains('fa-linkedin') || 
                       iconElement.classList.contains('fa-linkedin-in')) {
                // LinkedIn - ensure it has https:// prefix
                let url = text;
                if (!url.startsWith('http')) {
                    if (!url.includes('linkedin.com')) {
                        url = `https://linkedin.com/in/${url}`;
                    } else {
                        url = `https://${url}`;
                    }
                }
                window.open(url, '_blank');
            } else if (iconElement.classList.contains('fa-twitter') ||
                       iconElement.classList.contains('fa-x-twitter')) {
                // Twitter/X - ensure it has https:// prefix
                let url = text;
                if (!url.startsWith('http')) {
                    if (!url.includes('twitter.com') && !url.includes('x.com')) {
                        url = `https://twitter.com/${url.replace('@', '')}`;
                    } else {
                        url = `https://${url}`;
                    }
                }
                window.open(url, '_blank');
            }
            
            // Add visual indication that it's clickable
            element.style.cursor = 'pointer';
            
            // Prevent default for the click to avoid unexpected behavior
            e.preventDefault();
        });
        
        // Add visual cues for clickable links when not in edit mode
        element.addEventListener('mouseenter', function() {
            if (!element.classList.contains('selecting-all') && 
                !element.classList.contains('active-edit')) {
                element.style.textDecoration = 'underline';
                element.style.cursor = 'pointer';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (!element.classList.contains('selecting-all') && 
                !element.classList.contains('active-edit')) {
                element.style.textDecoration = 'none';
            }
        });
    }
    
    // Fix for the add category button to ensure it only creates one category at a time
    const addCategoryButtons = document.querySelectorAll('.add-category-btn');
    addCategoryButtons.forEach(btn => {
        // First remove all existing event listeners by replacing with clone
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Now add our single event listener
        newBtn.addEventListener('click', () => {
            const categoryName = prompt('Enter category name:');
            if (categoryName && categoryName.trim()) {
                const skillsGrid = document.querySelector('.skills-grid');
                const category = document.createElement('div');
                category.className = 'skill-category';
                category.innerHTML = `
                    <div class="skill-category-header">
                    <h3 contenteditable="true">${categoryName.trim()}</h3>
                        <button class="delete-category" title="Delete Category">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="skill-items"></div>
                    <button class="add-btn skill">
                        <i class="fas fa-plus"></i> Add Skill
                    </button>
                `;

                // We don't need this handler anymore since we're using the global event listener
                // That handles all "add-btn skill" buttons including dynamically added ones
                
                if (skillsGrid) {
                    skillsGrid.appendChild(category);
                    
                    // Scroll to the new category
                    setTimeout(() => {
                        category.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            }
        });
    });

    // Define a function to fix any specific issues with content restoration
    function fixSpecificContentIssues() {
        console.log("Running content correction function...");
        
        // Fix for the About section content
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            // Make sure paragraphs in the About section only contain text content
            const aboutParagraphs = aboutSection.querySelectorAll('p[contenteditable="true"]');
            aboutParagraphs.forEach(p => {
                // More aggressively check for misplaced content
                if (p.innerHTML.includes('<button') || 
                    p.innerHTML.includes('<a class="btn') || 
                    p.innerHTML.includes('<i class="fas') ||
                    p.innerHTML.includes('skill-') ||
                    p.innerHTML.includes('@')) {
                    
                    console.log("About section has incorrect content, attempting to fix");
                    // Try to find the correct about content in localStorage
                    const savedContent = localStorage.getItem('portfolioContent');
                    if (savedContent) {
                        try {
                            const content = JSON.parse(savedContent);
                            // Look for entries that have "about" in their path or key
                            const aboutEntries = Object.entries(content).filter(([key, value]) => 
                                (key.includes('about') || value.path.includes('about')) && 
                                value.type === 'p' &&
                                !value.content.includes('<button') && 
                                !value.content.includes('<a class="btn') &&
                                !value.content.includes('<i class="fas')
                            );
                            
                            if (aboutEntries.length > 0) {
                                p.innerHTML = aboutEntries[0][1].content;
                                console.log("Fixed about section with saved content");
                            } else {
                                // Fallback to default content
                                p.innerHTML = "I'm a passionate developer with a keen eye for design and a love for creating beautiful, functional websites.";
                                console.log("Fixed about section with default content");
                            }
                        } catch (error) {
                            console.error('Error fixing about section:', error);
                            // Fallback to default content on error
                            p.innerHTML = "I'm a passionate developer with a keen eye for design and a love for creating beautiful, functional websites.";
                        }
                    }
                }
            });
        }
        
        // Fix for footer content
        const footer = document.querySelector('.portfolio-footer');
        if (footer) {
            const footerContent = footer.querySelector('p[contenteditable="true"]');
            if (footerContent) {
                // Expanded check for incorrect footer content
                if (footerContent.innerHTML.includes('<i class="fas') || 
                    footerContent.innerHTML.includes('@') || 
                    footerContent.innerHTML.includes('skill') ||
                    !footerContent.innerHTML.includes('Rights Reserved')) {
                    
                    console.log("Footer has incorrect content, attempting to fix");
                    // Try to find correct footer content
                    const savedContent = localStorage.getItem('portfolioContent');
                    if (savedContent) {
                        try {
                            const content = JSON.parse(savedContent);
                            // Look for entries that have footer in their path or key
                            const footerEntries = Object.entries(content).filter(([key, value]) => 
                                (key.includes('footer') || value.path.includes('footer')) && 
                                value.content.includes('Rights Reserved')
                            );
                            
                            if (footerEntries.length > 0) {
                                footerContent.innerHTML = footerEntries[0][1].content;
                                console.log("Fixed footer with saved content");
                            } else {
                                // Fallback to default
                                footerContent.innerHTML = "© 2025. Your Name. All Rights Reserved.";
                                console.log("Fixed footer with default content");
                            }
                        } catch (error) {
                            console.error('Error fixing footer content:', error);
                            // Fallback to default on error
                            footerContent.innerHTML = "© 2025. Your Name. All Rights Reserved.";
                        }
                    }
                }
            }
        }
        
        // Fix for contact section
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const contactItems = contactSection.querySelectorAll('.contact-item span[contenteditable="true"]');
            contactItems.forEach(item => {
                // Expanded check for incorrect contact content
                if (item.innerHTML.includes('<div class="skill') || 
                    item.innerHTML.includes('passionate developer') ||
                    item.innerHTML.includes('Rights Reserved') ||
                    item.innerHTML.length > 50) { // Contact items should generally be short
                    
                    console.log("Contact item has incorrect content, attempting to fix");
                    // Try to find correct contact content
                    const savedContent = localStorage.getItem('portfolioContent');
                    if (savedContent) {
                        try {
                            const content = JSON.parse(savedContent);
                            // Look for contact entries
                            const contactEntries = Object.entries(content).filter(([key, value]) => 
                                (key.includes('contact') || value.path.includes('contact')) && 
                                value.parentClass === 'contact-item' &&
                                value.type === 'span'
                            );
                            
                            if (contactEntries.length > 0) {
                                // Match based on icon
                                const iconElement = item.previousElementSibling;
                                if (iconElement && iconElement.className) {
                                    const iconClass = iconElement.className;
                                    
                                    // Find matching contact entry with same icon type
                                    const matchingEntry = contactEntries.find(([key, value]) => {
                                        // Extract icon class from the path
                                        return value.path.includes(iconClass);
                                    });
                                    
                                    if (matchingEntry) {
                                        item.innerHTML = matchingEntry[1].content;
                                        console.log("Fixed contact item with matching icon content");
                                    } else if (contactEntries.length > 0) {
                                        // Fallback to any contact entry
                                        item.innerHTML = contactEntries[0][1].content;
                                        console.log("Fixed contact item with any available contact content");
                                    }
                                }
                            } else {
                                // Set default content based on icon
                                const iconElement = item.previousElementSibling;
                                if (iconElement) {
                                    if (iconElement.classList.contains('fa-envelope')) {
                                        item.innerHTML = 'your.email@example.com';
                                    } else if (iconElement.classList.contains('fa-phone')) {
                                        item.innerHTML = '+1 (555) 123-4567';
                                    } else if (iconElement.classList.contains('fa-map-marker-alt')) {
                                        item.innerHTML = 'New York, NY';
                                    } else {
                                        item.innerHTML = 'Contact Information';
                                    }
                                    console.log("Fixed contact item with default content");
                                }
                            }
                        } catch (error) {
                            console.error('Error fixing contact content:', error);
                            // Set fallback content
                            item.innerHTML = 'Contact Information';
                        }
                    } // Close the if(savedContent) statement
                } // Close the if(item.innerHTML.includes...) statement
            });
        }
    }

    // Call the fix function after content is loaded and whenever content is restored
    window.addEventListener('load', function() {
        // Wait a bit to ensure content is loaded
        setTimeout(fixSpecificContentIssues, 500);
    });
    
    // Also run the fix whenever content is restored from localStorage
    document.addEventListener('contentRestored', fixSpecificContentIssues);
    
    // Create a MutationObserver to watch for dynamic content changes
    const contentObserver = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                shouldFix = true;
            }
        });
        
        if (shouldFix) {
            setTimeout(fixSpecificContentIssues, 100);
        }
    });
    
    // Start observing editable content
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        contentObserver.observe(element, { 
            childList: true, 
            characterData: true,
            subtree: true 
        });
    });

    // Fix for empty skill progress bars
    window.addEventListener('load', function() {
        // Fix any skill progress bars that don't have a width set
        document.querySelectorAll('.skill-progress').forEach(progress => {
            if (!progress.style.width || progress.style.width === '0%' || progress.style.width === '0') {
                progress.style.width = '75%'; // Default value
            }
        });
        
        // Add default projects if none exist
        addDefaultProjects();
    });
    
    // Also run the skill progress bar fix whenever content is restored
    document.addEventListener('contentRestored', function() {
        document.querySelectorAll('.skill-progress').forEach(progress => {
            if (!progress.style.width || progress.style.width === '0%' || progress.style.width === '0') {
                progress.style.width = '75%'; // Default value
            }
        });
        
        // Add default projects if none exist
        addDefaultProjects();
    });

    // Function to add default projects if none exist
    function addDefaultProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;
        
        // Only add default projects if there are none
        if (projectsGrid.children.length === 0) {
            console.log("Adding default projects");
            
            // First default project
            const project1 = document.createElement('div');
            project1.className = 'project-card';
            project1.innerHTML = `
                <div class="project-image">
                    <img src="../../img/project-placeholder-1.jpg" alt="Project Image">
                    <div class="project-overlay">
                        <a href="#" class="btn primary">View Project</a>
                    </div>
                    <div class="project-image-actions">
                        <button class="change-image-btn" title="Change Image">
                            <i class="fas fa-camera"></i>
                        </button>
                        <button class="remove-image-btn" title="Remove Image">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="project-image-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                </div>
                <button class="delete-project" title="Delete Project">
                    <i class="fas fa-times"></i>
                </button>
                <div class="project-info">
                    <h3 contenteditable="true">Portfolio Website</h3>
                    <p contenteditable="true">A responsive portfolio website built with HTML, CSS, and JavaScript to showcase my work and skills.</p>
                    <div class="project-tech">
                        <span><span class="tag-text" contenteditable="true">HTML</span> <i class="fas fa-times remove-tag"></i></span>
                        <span><span class="tag-text" contenteditable="true">CSS</span> <i class="fas fa-times remove-tag"></i></span>
                        <span><span class="tag-text" contenteditable="true">JavaScript</span> <i class="fas fa-times remove-tag"></i></span>
                    </div>
                    <div class="tag-management">
                        <button class="add-tag-btn">Add Tag</button>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(project1);
            
            // Second default project
            const project2 = document.createElement('div');
            project2.className = 'project-card';
            project2.innerHTML = `
                <div class="project-image">
                    <img src="../../img/project-placeholder-2.jpg" alt="Project Image">
                    <div class="project-overlay">
                        <a href="#" class="btn primary">View Project</a>
                    </div>
                    <div class="project-image-actions">
                        <button class="change-image-btn" title="Change Image">
                            <i class="fas fa-camera"></i>
                        </button>
                        <button class="remove-image-btn" title="Remove Image">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="project-image-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                </div>
                <button class="delete-project" title="Delete Project">
                    <i class="fas fa-times"></i>
                </button>
                <div class="project-info">
                    <h3 contenteditable="true">E-commerce App</h3>
                    <p contenteditable="true">A full-featured online store with product listings, shopping cart, and secure checkout functionality.</p>
                    <div class="project-tech">
                        <span><span class="tag-text" contenteditable="true">React</span> <i class="fas fa-times remove-tag"></i></span>
                        <span><span class="tag-text" contenteditable="true">Node.js</span> <i class="fas fa-times remove-tag"></i></span>
                        <span><span class="tag-text" contenteditable="true">MongoDB</span> <i class="fas fa-times remove-tag"></i></span>
                    </div>
                    <div class="tag-management">
                        <button class="add-tag-btn">Add Tag</button>
                    </div>
                </div>
            `;
            projectsGrid.appendChild(project2);
        }
    }

    // Add global event listener for delete project buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-project')) {
            const deleteBtn = e.target.closest('.delete-project');
            const projectCard = deleteBtn.closest('.project-card');
            if (projectCard && confirm('Are you sure you want to delete this project?')) {
                projectCard.remove();
            }
        }
    });

    // Add tag management functionality for projects
    document.addEventListener('click', function(e) {
        // Handle adding a new tag
        if (e.target.closest('.add-tag-btn')) {
            const addBtn = e.target.closest('.add-tag-btn');
            const projectInfo = addBtn.closest('.project-info');
            const projectTech = projectInfo.querySelector('.project-tech');
            
            if (projectTech) {
                const newTag = document.createElement('span');
                // Add a unique class to make it stand out temporarily
                newTag.className = 'tag-new';
                newTag.innerHTML = `<span class="tag-text" contenteditable="true">New Tag</span> <i class="fas fa-times remove-tag"></i>`;
                projectTech.appendChild(newTag);
                
                // Add animation to highlight the new tag
                setTimeout(() => {
                    newTag.className = 'tag';
                }, 1000);
                
                // Focus and select the new tag text for immediate editing
                const tagText = newTag.querySelector('.tag-text');
                if (tagText) {
                    setTimeout(() => {
                        tagText.focus();
                        const range = document.createRange();
                        range.selectNodeContents(tagText);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }, 50);
                }
                
                // Save state after adding the tag
                saveState();
            }
        }
        
        // Handle removing a tag
        if (e.target.closest('.remove-tag')) {
            const removeBtn = e.target.closest('.remove-tag');
            const tag = removeBtn.parentElement;
            tag.remove();
            
            // Save state after removing the tag
            saveState();
        }
    });
    
    // Project image management
    document.addEventListener('click', function(e) {
        // Handle clicking on the image upload button
        if (e.target.closest('.project-image-upload') || e.target.closest('.change-image-btn')) {
            const projectCard = e.target.closest('.project-card');
            const imageInput = document.createElement('input');
            imageInput.type = 'file';
            imageInput.accept = 'image/*';
            
            imageInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const imgElement = projectCard.querySelector('.project-image img');
                        if (imgElement) {
                            imgElement.src = e.target.result;
                        } else {
                            // Create image if it doesn't exist
                            const imgContainer = projectCard.querySelector('.project-image');
                            imgContainer.innerHTML = `
                                <img src="${e.target.result}" alt="Project Image">
                                <div class="project-overlay">
                                    <a href="#" class="btn primary">View Project</a>
                                </div>
                                <div class="project-image-actions">
                                    <button class="change-image-btn" title="Change Image">
                                        <i class="fas fa-camera"></i>
                                    </button>
                                    <button class="remove-image-btn" title="Remove Image">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div class="project-image-upload">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </div>
                            `;
                        }
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
            
            imageInput.click();
        }
        
        // Handle removing an image
        if (e.target.closest('.remove-image-btn')) {
            const projectCard = e.target.closest('.project-card');
            const imgContainer = projectCard.querySelector('.project-image');
            
            imgContainer.innerHTML = `
                <div class="project-image-placeholder">
                    <i class="fas fa-image"></i>
                </div>
                <div class="project-image-upload">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
            `;
        }
    });

    function createProjectTagsSection(projectElement) {
        const tagsSection = document.createElement('div');
        tagsSection.className = 'project-tags';
        
        const tagList = document.createElement('div');
        tagList.className = 'tag-list';
        
        const tagManagement = document.createElement('div');
        tagManagement.className = 'tag-management';
        
        const addTagBtn = document.createElement('button');
        addTagBtn.className = 'add-tag-btn';
        addTagBtn.textContent = 'Add Tag';
        
        tagManagement.appendChild(addTagBtn);
        
        tagsSection.appendChild(tagList);
        tagsSection.appendChild(tagManagement);
        projectElement.querySelector('.project-info').appendChild(tagsSection);
        
        addTagBtn.addEventListener('click', function() {
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.contentEditable = true;
            newTag.textContent = 'New Tag';
            newTag.dataset.defaultText = 'Tag Name';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-tag';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this tag?')) {
                    newTag.remove();
                    saveState();
                }
            });
            
            newTag.appendChild(deleteBtn);
            tagList.appendChild(newTag);
            
            // Focus and select all text in the new tag for immediate editing
            newTag.focus();
            const range = document.createRange();
            range.selectNodeContents(newTag);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            
            saveState();
        });
        
        return tagsSection;
    }

    function restoreProjectTags(projects) {
        projects.forEach((project, index) => {
            if (savedContent && savedContent.projectTags && savedContent.projectTags[index]) {
                const tagList = project.querySelector('.tag-list');
                if (tagList) {
                    tagList.innerHTML = '';  // Clear existing tags
                    
                    savedContent.projectTags[index].forEach(tagText => {
                        const tag = document.createElement('span');
                        tag.className = 'tag';
                        tag.contentEditable = true;
                        tag.textContent = tagText;
                        tag.dataset.defaultText = 'Tag Name';
                        
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete-tag';
                        deleteBtn.innerHTML = '&times;';
                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this tag?')) {
                                tag.remove();
                                saveState();
                            }
                        });
                        
                        tag.appendChild(deleteBtn);
                        tagList.appendChild(tag);
                    });
                }
            }
        });
    }

    // Update the project form to handle website and GitHub URLs
    document.addEventListener('click', function(e) {
        // Handle clicking on the view project button
        if (e.target.closest('.project-overlay .btn.primary')) {
            e.preventDefault();
            const viewBtn = e.target.closest('.project-overlay .btn.primary');
            const projectCard = viewBtn.closest('.project-card');
            
            if (projectCard) {
                showProjectDetails(projectCard);
            }
        }
    });

    // Function to show project details in the modal
    function showProjectDetails(projectCard) {
        const modal = document.getElementById('projectViewModal');
        
        if (!modal) return;
        
        // Get project data
        const projectImage = projectCard.querySelector('.project-image img');
        const projectTitle = projectCard.querySelector('.project-info h3');
        const projectDescription = projectCard.querySelector('.project-info p');
        const projectTags = projectCard.querySelectorAll('.project-tech .tag-text');
        
        // Get URLs if they exist (stored as data attributes)
        const demoUrl = projectCard.getAttribute('data-demo-url') || '';
        const githubUrl = projectCard.getAttribute('data-github-url') || '';
        
        // Populate the modal
        const modalImage = document.getElementById('viewProjectImage');
        const modalTitle = document.getElementById('viewProjectTitle');
        const modalDescription = document.getElementById('viewProjectDescription');
        const modalTags = document.getElementById('viewProjectTags');
        const modalDemoBtn = document.getElementById('viewProjectDemo');
        const modalGithubBtn = document.getElementById('viewProjectGithub');
        
        // Populate URL input fields
        const demoInput = document.getElementById('editProjectDemo');
        const githubInput = document.getElementById('editProjectGithub');
        
        if (modalImage && projectImage) modalImage.src = projectImage.src;
        if (modalTitle && projectTitle) modalTitle.textContent = projectTitle.textContent;
        if (modalDescription && projectDescription) modalDescription.textContent = projectDescription.textContent;
        
        // Clear and add tags
        if (modalTags) {
            modalTags.innerHTML = '';
            projectTags.forEach(tag => {
                const span = document.createElement('span');
                span.textContent = tag.textContent;
                modalTags.appendChild(span);
            });
        }
        
        // Set button URLs - always show the buttons regardless of URL
        if (modalDemoBtn) {
            modalDemoBtn.href = demoUrl || '#';
            modalDemoBtn.style.display = 'flex'; // Always show
            modalDemoBtn.innerHTML = '<i class="fas fa-globe"></i> Visit Website <i class="fas fa-external-link-alt"></i>';
            
            // Add click event listener with validation
            modalDemoBtn.onclick = function(e) {
                if (!demoUrl || demoUrl === '#') {
                    e.preventDefault();
                    alert('No website URL has been provided for this project.');
                }
            };
        }
        
        if (modalGithubBtn) {
            modalGithubBtn.href = githubUrl || '#';
            modalGithubBtn.style.display = 'flex'; // Always show
            modalGithubBtn.innerHTML = '<i class="fab fa-github"></i> View on GitHub <i class="fas fa-external-link-alt"></i>';
            
            // Add click event listener with validation
            modalGithubBtn.onclick = function(e) {
                if (!githubUrl || githubUrl === '#') {
                    e.preventDefault();
                    alert('No GitHub repository URL has been provided for this project.');
                }
            };
        }
        
        // Set URL input values
        if (demoInput) demoInput.value = demoUrl;
        if (githubInput) githubInput.value = githubUrl;
        
        // Add event listeners to update buttons
        const updateButtons = modal.querySelectorAll('.update-url-btn');
        updateButtons.forEach(button => {
            // Remove any existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                let inputField, urlAttribute, btnElement;
                
                if (target === 'demo') {
                    inputField = document.getElementById('editProjectDemo');
                    urlAttribute = 'data-demo-url';
                    btnElement = document.getElementById('viewProjectDemo');
                } else if (target === 'github') {
                    inputField = document.getElementById('editProjectGithub');
                    urlAttribute = 'data-github-url';
                    btnElement = document.getElementById('viewProjectGithub');
                }
                
                if (inputField && btnElement) {
                    const newUrl = inputField.value.trim();
                    projectCard.setAttribute(urlAttribute, newUrl);
                    btnElement.href = newUrl || '#';
                    
                    // Update click validation for the button
                    if (target === 'demo') {
                        btnElement.onclick = function(e) {
                            if (!newUrl || newUrl === '#') {
                                e.preventDefault();
                                alert('No website URL has been provided for this project.');
                            }
                        };
                    } else if (target === 'github') {
                        btnElement.onclick = function(e) {
                            if (!newUrl || newUrl === '#') {
                                e.preventDefault();
                                alert('No GitHub repository URL has been provided for this project.');
                            }
                        };
                    }
                    
                    // Visual feedback
                    inputField.style.borderColor = 'var(--neon-blue)';
                    inputField.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.5)';
                    
                    // Save state
                    saveState();
                    
                    // Reset visual feedback after a moment
                    setTimeout(() => {
                        inputField.style.borderColor = '';
                        inputField.style.boxShadow = '';
                    }, 1000);
                }
            });
        });
        
        // Show the modal
        showModal(modal);
    }

    // Update the add project functionality to include website and GitHub URLs
    // When the project form is submitted
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('projectTitle').value;
            const description = document.getElementById('projectDescription').value;
            const tech = document.getElementById('projectTech').value.split(',').map(item => item.trim()).filter(item => item !== '');
            const imageUrl = document.getElementById('projectImage').value;
            const demoUrl = document.getElementById('projectDemo').value;
            const githubUrl = document.getElementById('projectGithub').value;
            
            // Create the project card
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid) {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                
                // Store URLs as data attributes
                if (demoUrl) projectCard.setAttribute('data-demo-url', demoUrl);
                if (githubUrl) projectCard.setAttribute('data-github-url', githubUrl);
                
                // Build the project card HTML
                projectCard.innerHTML = `
                    <div class="project-image">
                        <img src="${imageUrl}" alt="${title}">
                        <div class="project-overlay">
                            <a href="#" class="btn primary">View Project</a>
                        </div>
                        <div class="project-image-actions">
                            <button class="change-image-btn" title="Change Image">
                                <i class="fas fa-camera"></i>
                            </button>
                            <button class="remove-image-btn" title="Remove Image">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="project-image-upload">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                    </div>
                    <button class="delete-project" title="Delete Project">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="project-info">
                        <h3 contenteditable="true">${title}</h3>
                        <p contenteditable="true">${description}</p>
                        <div class="project-tech">
                            ${tech.map(tag => `<span><span class="tag-text" contenteditable="true">${tag}</span> <i class="fas fa-times remove-tag"></i></span>`).join('')}
                        </div>
                        <div class="tag-management">
                            <button class="add-tag-btn">Add Tag</button>
                        </div>
                        
                        <!-- URL Management -->
                        <div class="url-management">
                            <div class="url-field">
                                <div class="url-label"><i class="fas fa-external-link-alt"></i> Website URL:</div>
                                <div class="url-input-container">
                                    <input type="url" class="project-url-input" data-type="demo" placeholder="Enter website URL" value="${demoUrl || ''}">
                                </div>
                            </div>
                            <div class="url-field">
                                <div class="url-label"><i class="fab fa-github"></i> GitHub URL:</div>
                                <div class="url-input-container">
                                    <input type="url" class="project-url-input" data-type="github" placeholder="Enter GitHub repository URL" value="${githubUrl || ''}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                projectsGrid.appendChild(projectCard);
                
                // Close the modal and reset the form
                const modal = document.getElementById('projectModal');
                hideModal(modal);
                projectForm.reset();
                
                // Save state
                saveState();
            }
        });
    }

    // Add URL editing capabilities to existing projects
    document.addEventListener('click', function(e) {
        if (e.target.closest('.project-overlay .btn.primary')) {
            const projectCard = e.target.closest('.project-card');
            const modal = document.getElementById('projectViewModal');
            
            // Add edit buttons for the URLs if user is in editing mode
            if (modal && projectCard) {
                const editDemoBtn = document.createElement('button');
                editDemoBtn.className = 'edit-url-btn';
                editDemoBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editDemoBtn.title = 'Edit Website URL';
                
                const editGithubBtn = document.createElement('button');
                editGithubBtn.className = 'edit-url-btn';
                editGithubBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editGithubBtn.title = 'Edit GitHub URL';
                
                // Append buttons to the view links
                const demoLink = document.getElementById('viewProjectDemo');
                const githubLink = document.getElementById('viewProjectGithub');
                
                if (demoLink) demoLink.appendChild(editDemoBtn);
                if (githubLink) githubLink.appendChild(editGithubBtn);
                
                // Add event listeners for the edit buttons
                editDemoBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const newUrl = prompt('Enter website URL:', projectCard.getAttribute('data-demo-url') || '');
                    if (newUrl !== null) {
                        projectCard.setAttribute('data-demo-url', newUrl);
                        demoLink.href = newUrl;
                        demoLink.style.display = newUrl ? 'flex' : 'none';
                        saveState();
                    }
                });
                
                editGithubBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const newUrl = prompt('Enter GitHub URL:', projectCard.getAttribute('data-github-url') || '');
                    if (newUrl !== null) {
                        projectCard.setAttribute('data-github-url', newUrl);
                        githubLink.href = newUrl;
                        githubLink.style.display = newUrl ? 'flex' : 'none';
                        saveState();
                    }
                });
            }
        }
    });

    // Add event listener for project URL inputs
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('project-url-input')) {
            const projectCard = e.target.closest('.project-card');
            const urlType = e.target.getAttribute('data-type');
            const urlValue = e.target.value.trim();
            
            if (projectCard) {
                // Update the data attribute
                if (urlType === 'demo') {
                    projectCard.setAttribute('data-demo-url', urlValue);
                } else if (urlType === 'github') {
                    projectCard.setAttribute('data-github-url', urlValue);
                }
                
                // Visual feedback
                e.target.style.borderColor = 'var(--neon-blue)';
                e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.5)';
                
                // Save state
                saveState();
                
                // Reset visual feedback after a moment
                setTimeout(() => {
                    e.target.style.borderColor = '';
                    e.target.style.boxShadow = '';
                }, 1000);
            }
        }
    });

    // Toggle Preview/Edit Mode Function
    function togglePreview() {
        const previewBtn = document.querySelector('.preview-btn');
        const isPreviewMode = previewBtn.getAttribute('data-preview') === 'true';
        
        // Find all elements that should be editable - use data attributes to store original state
        const editableElements = document.querySelectorAll('[data-original-editable="true"], [contenteditable]');
        
        // All editing UI elements (buttons, controls, etc.)
        const editControls = document.querySelectorAll(
            '.add-project-btn, .add-category-btn, .add-btn, ' +
            '.delete-project, .delete-category, .delete-skill, .edit-skill, ' +
            '.skill-actions, .project-image-upload, .change-image-btn, ' +
            '.remove-image-btn, .remove-photo-btn, .upload-btn, .photo-overlay, ' +
            '.add-tag-btn, .remove-tag'
        );

        if (isPreviewMode) {
            // Switch back to Edit mode
            document.querySelectorAll('[data-original-editable="true"]').forEach(el => {
                el.setAttribute('contenteditable', 'true');
                // Keep the data attribute for tracking
                el.setAttribute('data-original-editable', 'true');
            });
            
            // Show all edit controls
            editControls.forEach(el => el.style.display = '');
            
            // Update preview button
            previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';
            previewBtn.setAttribute('data-preview', 'false');
            
            // Enable toolbar buttons
            document.querySelectorAll('.toolbar-btn').forEach(btn => {
                if (btn !== previewBtn) btn.disabled = false;
            });
        } else {
            // Switch to Preview mode
            // Store original state before changing
            editableElements.forEach(el => {
                if (el.getAttribute('contenteditable') === 'true') {
                    // Store the fact that this element was editable
                    el.setAttribute('data-original-editable', 'true');
                    el.setAttribute('contenteditable', 'false');
                }
            });
            
            // Hide all edit controls
            editControls.forEach(el => el.style.display = 'none');
            
            // Update preview button
            previewBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            previewBtn.setAttribute('data-preview', 'true');
            
            // Disable toolbar buttons
            document.querySelectorAll('.toolbar-btn').forEach(btn => {
                if (btn !== previewBtn) btn.disabled = true;
            });
        }
        
        // Save the current state to localStorage
        saveState();
    }

    // Event Listeners
    
    // Add event listener for preview button
    const previewBtn = document.querySelector('.preview-btn');
    if (previewBtn) {
        previewBtn.setAttribute('data-preview', 'false');
        previewBtn.addEventListener('click', togglePreview);
    }

    // Check skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        const header = category.querySelector('h3');
        if (header) {
            // Check if header has inappropriate content
            if (header.innerHTML.includes('@') || 
                header.innerHTML.includes('Rights Reserved') ||
                header.innerHTML.includes('passionate developer')) {
                
                console.log("Skill category header has incorrect content, fixing");
                header.innerHTML = 'Skills Category';
            }
        }
        
        // Check skill items
        const skillItems = category.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const skillName = item.querySelector('span[contenteditable="true"]');
            if (skillName && (
                skillName.innerHTML.includes('@') || 
                skillName.innerHTML.includes('Rights Reserved') ||
                skillName.innerHTML.includes('passionate developer'))) {
                
                console.log("Skill item has incorrect content, fixing");
                skillName.innerHTML = 'Skill';
            }
        });
    });
});