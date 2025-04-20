// ... existing AOS initialization ...

// Add sticky header styles
const stickyStyles = document.createElement('style');
stickyStyles.textContent = `
    // ... existing styles ...

    .format-controls {
        position: fixed !important;
        top: 40px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 30px !important;
        min-height: 30px !important;
        max-height: 30px !important;
        z-index: 999 !important;
        background: #fff !important;
        padding: 0 2rem !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        border: none !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    }

    body {
        padding-top: 70px !important; /* Updated to account for both header and toolbar */
        margin: 0 !important;
        background: #fff !important;
    }
`;
document.head.appendChild(stickyStyles);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables to track selection
    let savedSelection = null;
    let savedRange = null;

    // Function to save the current selection
    function saveSelection() {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            savedSelection = sel;
            savedRange = sel.getRangeAt(0).cloneRange();
        }
    }

    // Function to restore the saved selection
    function restoreSelection() {
        if (savedSelection && savedRange) {
            savedSelection.removeAllRanges();
            savedSelection.addRange(savedRange);
        }
    }

    // Function to handle formatting
    function handleFormat(command, value = null) {
        if (savedSelection && savedRange) {
            restoreSelection();
            document.execCommand(command, false, value);
            saveSelection();
            updateToolbarState();
        }
    }

    // Make all content areas editable
    const editableAreas = document.querySelectorAll(`
        .hero-title-section,
        .hero-role-section,
        .hero-description-section,
        .about-title,
        .about-text p,
        .project-card h3,
        .project-card p,
        .section-title,
        .skill-category h3,
        .skill-item span,
        .contact-item span,
        [contenteditable="true"]
    `);

    editableAreas.forEach(element => {
        if (!element.hasAttribute('contenteditable')) {
            element.contentEditable = true;
        }
        
        // Save selection when focusing on editable areas
        element.addEventListener('focus', saveSelection);
        element.addEventListener('click', saveSelection);
        element.addEventListener('keyup', saveSelection);
        
        // Handle keyboard shortcuts
        element.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 'b':
                        e.preventDefault();
                        handleFormat('bold');
                        break;
                    case 'i':
                        e.preventDefault();
                        handleFormat('italic');
                        break;
                    case 'u':
                        e.preventDefault();
                        handleFormat('underline');
                        break;
                    case 'z':
                        e.preventDefault();
                        document.execCommand('undo', false);
                        break;
                    case 'y':
                        e.preventDefault();
                        document.execCommand('redo', false);
                        break;
                }
            }
        });
    });

    // Toolbar button event listeners
    document.querySelectorAll('.toolbar-btn').forEach(button => {
        button.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent losing focus
            const command = button.getAttribute('data-command') || 
                          (button.classList.contains('bold-btn') ? 'bold' :
                           button.classList.contains('italic-btn') ? 'italic' :
                           button.classList.contains('underline-btn') ? 'underline' :
                           button.classList.contains('undo-btn') ? 'undo' :
                           button.classList.contains('redo-btn') ? 'redo' : null);
            
            if (command) {
                handleFormat(command);
            }
        });
    });

    // Font selector event listener
    const fontSelect = document.querySelector('.font-family-select');
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            handleFormat('fontName', e.target.value);
        });
    }

    // Font size selector event listener
    const fontSizeSelect = document.querySelector('.font-size-select');
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', (e) => {
            const selectedSize = e.target.value;
            handleFormat('fontSize', selectedSize);
        });
    }

    // Update toolbar state when selection changes
    document.addEventListener('selectionchange', updateToolbarState);

    // Function to update toolbar state
    function updateToolbarState() {
        const buttons = document.querySelectorAll('.toolbar-btn');
        buttons.forEach(button => {
            const command = button.getAttribute('data-command') ||
                          (button.classList.contains('bold-btn') ? 'bold' :
                           button.classList.contains('italic-btn') ? 'italic' :
                           button.classList.contains('underline-btn') ? 'underline' : null);
            
            if (command && command !== 'undo' && command !== 'redo') {
                try {
                    const isActive = document.queryCommandState(command);
                    button.classList.toggle('active', isActive);
                } catch (e) {
                    console.warn(`Failed to query command state for ${command}:`, e);
                }
            }
        });
    }

    // ... rest of your existing code ...
}); 