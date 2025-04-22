// Modern Portfolio JS
// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Add sticky header styles
const stickyStyles = document.createElement('style');
stickyStyles.textContent = `
    .header {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 40px !important;
        min-height: 40px !important;
        max-height: 40px !important;
        z-index: 1000 !important;
        background: #1a1a1a !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 0 1rem !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    }

    .nav-brand, .nav-links, .nav-links a {
        height: 40px !important;
        min-height: 40px !important;
        max-height: 40px !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
    }

    .nav-links {
        gap: 2rem !important;
    }

    .nav-brand {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        height: 100% !important;
    }

    .nav-links {
        display: flex !important;
        gap: 2rem !important;
        align-items: center !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
        height: 100% !important;
    }

    .nav-links a {
        color: #333 !important;
        text-decoration: none !important;
        font-weight: 500 !important;
        transition: color 0.3s ease !important;
        padding: 0.5rem 0 !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
    }

    .nav-links a:hover {
        color: #4776E6 !important;
    }

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
        background: #1a1a1a !important;
        padding: 0 1rem !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        border: none !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    }

    body {
        padding-top: 70px !important;
        margin: 0 !important;
        background: #fff !important;
    }

    main {
        margin-top: 0 !important;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        padding: 1rem;
        max-width: 1200px;
        margin: 0 auto;
        min-height: 100px;
        position: relative;
    }

    .skills-section {
        padding: 4rem 2rem;
        text-align: center;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .skill-category {
        background: #ffffff;
        border-radius: 15px;
        padding: 2rem;
        position: relative;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        margin-bottom: 1.5rem;
    }

    .skill-category:hover {
        transform: translateY(-5px);
    }

    .skill-category h3 {
        color: #333;
        margin-bottom: 1rem;
        font-size: 1.5rem;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .delete-category {
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 0.5rem;
        font-size: 1.2rem;
        transition: all 0.3s ease;
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    .delete-category:hover {
        color: #c82333;
        transform: scale(1.1);
    }

    .skill-items {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding: 0.5rem 0;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
    }

    .skill-item {
        background: #f8f9fa;
        color: #333;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        font-size: 0.95rem;
        cursor: text;
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
        display: inline-flex;
        align-items: center;
        min-width: 120px;
        justify-content: space-between;
        text-align: left;
        margin: 0.25rem;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        position: relative;
    }

    .skill-item .delete-skill {
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 0.25rem;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        margin-left: 0.75rem;
    }

    .skill-item .delete-skill:hover {
        color: #c82333;
        transform: scale(1.1);
    }

    .add-btn.project {
        background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(71, 118, 230, 0.2);
        margin: 2rem auto;
        position: static;
        transform: none;
    }

    .add-btn.project:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(71, 118, 230, 0.3);
    }

    /* Style for when grid is empty */
    .skills-grid:empty + .add-btn.project {
        margin-top: 4rem;
    }

    /* Style for when grid has content */
    .skills-grid:not(:empty) + .add-btn.project {
        margin-top: 2rem;
    }

    .add-btn.skill {
        background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 30px;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        margin-top: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(71, 118, 230, 0.2);
    }

    .add-btn.skill:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(71, 118, 230, 0.3);
    }

    .add-btn.skill i {
        font-size: 0.9em;
    }

    .delete-project {
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.3s ease;
    }

    .delete-project:hover {
        color: #c82333;
        transform: scale(1.1);
    }

    .section-title {
        color: #333;
        text-align: center;
        margin-bottom: 2rem;
        font-size: 2.5rem;
        font-weight: 700;
    }

    .section-title:after {
        content: '';
        display: block;
        width: 50px;
        height: 3px;
        background: #007bff;
        margin: 1rem auto;
    }

    .about-section {
        text-align: center;
        padding: 4rem 2rem;
        max-width: 800px;
        margin: 3rem auto;
        border: 2px solid #e9ecef;
        border-radius: 15px;
        background: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .about-text {
        color: #666;
        font-size: 1.1rem;
        line-height: 1.8;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    .about-text p {
        margin-bottom: 1.5rem;
    }

    .section-title {
        color: #333;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        position: relative;
        display: inline-block;
    }

    .section-title:after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background: #4776E6;
        margin: 0.5rem auto;
    }

    .contact-section {
        padding: 6rem 2rem;
        background: #fff;
        color: #333;
        text-align: center;
        margin-bottom: 0;
        position: relative;
    }

    .section-title.contact {
        color: #333;
        text-align: center;
        margin-bottom: 4rem;
        font-size: 2.5rem;
        font-weight: 600;
        width: 100%;
        display: block;
        padding-top: 2rem;
    }

    .section-title.contact:after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background: #4776E6;
        margin: 1.5rem auto;
    }

    .contact-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .contact-form {
        background: #fff;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .contact-form:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .contact-form input,
    .contact-form textarea {
        width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .contact-form input:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: #4776E6;
        box-shadow: 0 0 0 3px rgba(71, 118, 230, 0.1);
    }

    .contact-form textarea {
        min-height: 150px;
        resize: vertical;
        font-family: inherit;
    }

    .contact-info {
        background: #fff;
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .contact-info:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .contact-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        color: #333;
        text-decoration: none;
        transition: all 0.3s ease;
    }

    .contact-item i {
        font-size: 1.2rem;
        color: #4776E6;
        transition: transform 0.3s ease;
    }

    .contact-item:hover {
        transform: translateX(10px);
        color: #4776E6;
    }

    .contact-item:hover i {
        transform: scale(1.1);
    }

    .social-links {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 1.5rem;
    }

    .social-links a {
        color: #333;
        font-size: 1.5rem;
        transition: all 0.3s ease;
        opacity: 0.8;
    }

    .social-links a:hover {
        color: #4776E6;
        transform: translateY(-3px);
        opacity: 1;
    }

    .send-message-btn {
        background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        width: auto;
        display: inline-block;
    }

    .send-message-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(71, 118, 230, 0.3);
    }

    .footer {
        text-align: center;
        padding: 2rem;
        background: #fff;
        color: #666;
        border-top: 1px solid #e9ecef;
        position: relative;
        width: 100%;
    }
`;
document.head.appendChild(stickyStyles);

// Ensure header stays visible
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) header.style.transform = 'translateY(0)';
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let isPreviewMode = false;
    const formatControls = document.querySelector('.format-controls');
    const previewBtn = document.querySelector('.toolbar-btn[onclick="previewPortfolio()"]');
    const fontSelect = document.querySelector('.font-select');
    const sizeSelect = document.querySelector('.font-size-select');
    const toolbar = document.querySelector('.toolbar');
    const undoBtn = document.querySelector('.undo-btn');
    const redoBtn = document.querySelector('.redo-btn');
    const boldBtn = document.querySelector('.bold-btn');
    const italicBtn = document.querySelector('.italic-btn');
    const underlineBtn = document.querySelector('.underline-btn');
    const saveBtn = document.querySelector('.toolbar-btn.primary');
    
    // Load Google Fonts
    const fonts = [
        'Times New Roman',
        'Arial',
        'Helvetica',
        'Poppins',
        'Roboto',
        'Open Sans',
        'Montserrat',
        'Lato',
        'Ubuntu',
        'Playfair Display',
        'Source Sans Pro',
        'Raleway',
        'Nunito',
        'Quicksand',
        'Inter',
        'Work Sans',
        'Mulish',
        'DM Sans',
        'Fira Sans',
        'Space Grotesk'
    ];

    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}`;
    document.head.appendChild(link);

    // Remove the inline onclick handler and add proper event listener
    if (previewBtn) {
        previewBtn.removeAttribute('onclick');
        previewBtn.addEventListener('click', togglePreview);
    }

    // Preview toggle functionality
    function togglePreview() {
        isPreviewMode = !isPreviewMode;
        const editableElements = document.querySelectorAll('[contenteditable="true"], [contenteditable="false"]');
        const toolbarCenter = document.querySelector('.toolbar-center');
        const formatControls = document.querySelector('.format-controls');
        const allButtons = document.querySelectorAll('button:not(.toolbar-btn)');
        const allInputs = document.querySelectorAll('input, textarea');
        const allForms = document.querySelectorAll('form');
        const projectLinks = document.querySelectorAll('.project-link');
        const profilePhotoOverlays = document.querySelectorAll('.camera-overlay, .delete-overlay');
        
        // Store the original click handlers for project links
        const originalClickHandlers = new Map();
        
        if (isPreviewMode) {
            // Enter preview mode
            editableElements.forEach(el => {
                el.setAttribute('data-previous-editable', el.contentEditable);
                el.contentEditable = 'false';
            });
            
            // Hide toolbar and format controls
            if (toolbarCenter) toolbarCenter.style.display = 'none';
            if (formatControls) formatControls.style.display = 'none';
            
            // Disable all buttons except toolbar buttons
            allButtons.forEach(btn => {
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.6';
            });
            
            // Disable all inputs and textareas
            allInputs.forEach(input => {
                input.disabled = true;
                input.style.pointerEvents = 'none';
            });
            
            // Prevent form submissions
            allForms.forEach(form => {
                form.onsubmit = (e) => e.preventDefault();
            });
            
            // Store and disable project links
            projectLinks.forEach(link => {
                // Store the original click handler
                const originalClick = link.onclick;
                originalClickHandlers.set(link, originalClick);
                
                // Disable the link in preview mode
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.6';
                link.onclick = (e) => e.preventDefault();
            });
            
            // Disable profile photo overlays
            profilePhotoOverlays.forEach(overlay => {
                overlay.style.display = 'none';
                overlay.style.pointerEvents = 'none';
            });
            
            // Update preview button
            previewBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
            
            // Add preview mode styles without affecting layout
            const previewStyles = document.createElement('style');
            previewStyles.id = 'preview-mode-styles';
            previewStyles.textContent = `
                [contenteditable="false"] {
                    cursor: default !important;
                    user-select: none !important;
                }
                
                .add-btn, .delete-project, .delete-category, .delete-skill {
                    cursor: not-allowed !important;
                }
                
                input:disabled, textarea:disabled, button:disabled {
                    cursor: not-allowed !important;
                }
                
                #projectModal {
                    pointer-events: none !important;
                }
                
                .skill-category h3, .skill-item span {
                    position: relative !important;
                    display: inline-block !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                .skill-category {
                    position: relative !important;
                    margin-bottom: 1rem !important;
                }
                
                .project-link {
                    pointer-events: none !important;
                }
                
                .profile-photo:hover .camera-overlay,
                .profile-photo:hover .delete-overlay {
                    display: none !important;
                    pointer-events: none !important;
                }
                
                .profile-photo {
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(previewStyles);
            
            // Disable modal triggers
            const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
            modalTriggers.forEach(trigger => {
                trigger.style.pointerEvents = 'none';
            });
            
        } else {
            // Exit preview mode
            editableElements.forEach(el => {
                const wasEditable = el.getAttribute('data-previous-editable');
                if (wasEditable !== 'false') {
                    el.contentEditable = 'true';
                }
                el.removeAttribute('data-previous-editable');
            });
            
            // Show toolbar and format controls
            if (toolbarCenter) toolbarCenter.style.display = 'flex';
            if (formatControls) formatControls.style.display = 'flex';
            
            // Re-enable all buttons
            allButtons.forEach(btn => {
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            });
            
            // Re-enable all inputs and textareas
            allInputs.forEach(input => {
                input.disabled = false;
                input.style.pointerEvents = '';
            });
            
            // Re-enable project links
            projectLinks.forEach(link => {
                link.style.pointerEvents = '';
                link.style.opacity = '';
                // Restore the original click handler
                link.onclick = originalClickHandlers.get(link);
            });
            
            // Re-enable profile photo overlays
            profilePhotoOverlays.forEach(overlay => {
                overlay.style.display = '';
                overlay.style.pointerEvents = '';
            });
            
            // Restore form functionality
            allForms.forEach(form => {
                form.onsubmit = null;
            });
            
            // Update preview button
            previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview';
            
            // Remove preview mode styles
            const previewStyles = document.getElementById('preview-mode-styles');
            if (previewStyles) {
                previewStyles.remove();
            }
            
            // Re-enable modal triggers
            const modalTriggers = document.querySelectorAll('[data-toggle="modal"]');
            modalTriggers.forEach(trigger => {
                trigger.style.pointerEvents = '';
            });
            
            // Re-initialize editable areas
            makeContentEditable();
        }
    }

    // Enhanced font selector functionality
    if (fontSelect) {
        fontSelect.addEventListener('change', function() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                if (!range.collapsed) {
                    const selectedText = range.toString();
                    if (selectedText.trim() !== '') {
                        const span = document.createElement('span');
                        span.style.fontFamily = this.value;
                        
                        try {
                            // Try to preserve existing styles
                            const fragment = range.extractContents();
                            span.appendChild(fragment);
                            range.insertNode(span);
                            
                            // Clean up nested spans with the same style
                            cleanupRedundantSpans(span);
                            
                            // Restore selection
                            selection.removeAllRanges();
                            const newRange = document.createRange();
                            newRange.selectNodeContents(span);
                            selection.addRange(newRange);
                        } catch (error) {
                            console.error('Error applying font:', error);
                        }
                    }
                }
            }
        });
    }

    // Enhanced size selector functionality
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                
                if (!range.collapsed) {
                    const selectedText = range.toString();
                    if (selectedText.trim() !== '') {
                        const span = document.createElement('span');
                        span.style.fontSize = this.value;
                        
                        try {
                            // Try to preserve existing styles
                            const fragment = range.extractContents();
                            span.appendChild(fragment);
                            range.insertNode(span);
                            
                            // Clean up nested spans with the same style
                            cleanupRedundantSpans(span);
                            
                            // Restore selection
                            selection.removeAllRanges();
                            const newRange = document.createRange();
                            newRange.selectNodeContents(span);
                            selection.addRange(newRange);
                        } catch (error) {
                            console.error('Error applying size:', error);
                        }
                    }
                }
            }
        });
    }

    // Function to clean up redundant nested spans
    function cleanupRedundantSpans(element) {
        const spans = element.getElementsByTagName('span');
        for (let i = spans.length - 1; i >= 0; i--) {
            const span = spans[i];
            if (span.parentElement && span.parentElement.tagName === 'SPAN') {
                const parent = span.parentElement;
                // Merge styles if they don't conflict
                const parentStyles = window.getComputedStyle(parent);
                const spanStyles = window.getComputedStyle(span);
                
                if (parentStyles.fontFamily === spanStyles.fontFamily ||
                    parentStyles.fontSize === spanStyles.fontSize) {
                    // Move the content up and remove the redundant span
                    while (span.firstChild) {
                        parent.insertBefore(span.firstChild, span);
                    }
                    span.remove();
                }
            }
        }
    }

    // Update toolbar state based on current selection
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const commonAncestor = range.commonAncestorContainer;
            
            // Find the closest span element
            const span = commonAncestor.nodeType === 1 ? 
                        commonAncestor.closest('span') : 
                        commonAncestor.parentElement.closest('span');
            
            if (span) {
                const styles = window.getComputedStyle(span);
                // Update font selector
                if (fontSelect && styles.fontFamily) {
                    const fontFamily = styles.fontFamily.split(',')[0].replace(/['"]/g, '');
                    const option = Array.from(fontSelect.options).find(opt => 
                        opt.value.toLowerCase() === fontFamily.toLowerCase()
                    );
                    if (option) {
                        fontSelect.value = option.value;
                    }
                }
                
                // Update size selector
                if (sizeSelect && styles.fontSize) {
                    const fontSize = Math.round(parseFloat(styles.fontSize)) + 'px';
                    const option = Array.from(sizeSelect.options).find(opt => 
                        opt.value === fontSize
                    );
                    if (option) {
                        sizeSelect.value = option.value;
                    }
                }
            }
        }
    });

    // Add styles for editable elements and toolbar
    const editableStyles = document.createElement('style');
    editableStyles.textContent = `
        [contenteditable="true"] {
            outline: none;
            transition: background-color 0.3s ease;
        }
        
        [contenteditable="true"]:hover {
            background-color: rgba(71, 118, 230, 0.05);
        }
        
        [contenteditable="true"]:focus {
            background-color: rgba(71, 118, 230, 0.1);
        }
        
        .toolbar-center {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .style-select {
            padding: 4px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            min-width: 120px;
            background: #1a1a1a;
            color: #fff;
            max-height: 300px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 12px;
            padding-right: 24px;
        }
        
        .style-select:hover {
            border-color: #4776E6;
        }
        
        .style-select:focus {
            outline: none;
            border-color: #4776E6;
            box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.2);
        }

        .style-select option {
            background: #1a1a1a;
            color: #fff;
            padding: 8px;
        }
        
        .font-select {
            min-width: 150px;
        }
        
        .font-size-select {
            min-width: 80px;
        }

        /* Style for the select wrapper to enable scrolling */
        .select-wrapper {
            position: relative;
        }

        /* Custom scrollbar styles */
        .style-select::-webkit-scrollbar {
            width: 8px;
        }

        .style-select::-webkit-scrollbar-track {
            background: #2a2a2a;
            border-radius: 4px;
        }

        .style-select::-webkit-scrollbar-thumb {
            background: #4776E6;
            border-radius: 4px;
        }

        .style-select::-webkit-scrollbar-thumb:hover {
            background: #3461c7;
        }
    `;
    document.head.appendChild(editableStyles);

    // Initialize formatting history
    let undoStack = [];
    let redoStack = [];
    let isUndoRedoAction = false;
    let lastActionTime = Date.now();
    let actionTimeout = null;
    const ACTION_DEBOUNCE = 1000; // Time in ms to group actions together

    // Save initial state
    saveState();

    // Format button event listeners
    boldBtn.addEventListener('click', () => handleFormat('bold'));
    italicBtn.addEventListener('click', () => handleFormat('italic'));
    underlineBtn.addEventListener('click', () => handleFormat('underline'));
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);

    // Save button functionality
    if (saveBtn) {
        saveBtn.removeAttribute('onclick');
        saveBtn.addEventListener('click', handleSave);
    }

    // Function to handle save with debounce
    let saveTimeout = null;
    function handleSave() {
        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(() => {
            savePortfolio();
            saveTimeout = null;
        }, 300);
    }

    // Function to handle formatting
    function handleFormat(command) {
        document.execCommand(command, false, null);
        if (!isUndoRedoAction) {
            saveState();
        }
        updateToolbarState();
    }

    // Function to handle undo
    function handleUndo(e) {
        e.preventDefault();
        if (undoStack.length > 1) {
            isUndoRedoAction = true;
            const currentState = undoStack.pop();
            redoStack.push(currentState);
            const previousState = undoStack[undoStack.length - 1];
            
            // Batch DOM updates to prevent flickering
            requestAnimationFrame(() => {
                restoreState(previousState);
                updateToolbarState();
                isUndoRedoAction = false;
            });
        }
    }

    // Function to handle redo
    function handleRedo(e) {
        e.preventDefault();
        if (redoStack.length > 0) {
            isUndoRedoAction = true;
            const nextState = redoStack.pop();
            undoStack.push(nextState);
            
            // Batch DOM updates to prevent flickering
            requestAnimationFrame(() => {
                restoreState(nextState);
                updateToolbarState();
                isUndoRedoAction = false;
            });
        }
    }

    // Function to save current state
    function saveState() {
        if (isUndoRedoAction) return;
        
        // Clear any pending save
        if (actionTimeout) {
            clearTimeout(actionTimeout);
        }
        
        // Debounce the save operation
        actionTimeout = setTimeout(() => {
            const state = {
                content: document.querySelector('.portfolio-canvas').innerHTML,
                timestamp: Date.now()
            };
            undoStack.push(state);
            redoStack = []; // Clear redo stack when new changes are made
            updateToolbarState();
        }, ACTION_DEBOUNCE);
    }

    // Function to restore state
    function restoreState(state) {
        if (state && state.content) {
            const portfolioCanvas = document.querySelector('.portfolio-canvas');
            // Use requestAnimationFrame to batch DOM updates
            requestAnimationFrame(() => {
                portfolioCanvas.innerHTML = state.content;
                makeContentEditable();
                reattachEventListeners();
            });
        }
    }

    // Function to reattach event listeners after state restore
    function reattachEventListeners() {
        // Reattach project delete buttons
        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this project?')) {
                    this.closest('.project-card').remove();
                    saveState();
                }
            });
        });

        // Reattach skill delete buttons
        document.querySelectorAll('.delete-skill').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this skill?')) {
                    this.closest('.skill-item').remove();
                    saveState();
                }
            });
        });
    }

    // Function to update toolbar state
    function updateToolbarState() {
        const commands = {
            bold: boldBtn,
            italic: italicBtn,
            underline: underlineBtn
        };

        // Batch DOM updates
        requestAnimationFrame(() => {
            for (const [command, button] of Object.entries(commands)) {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }

            // Update undo/redo buttons
            undoBtn.disabled = undoStack.length <= 1;
            redoBtn.disabled = redoStack.length === 0;
        });
    }

    // Save portfolio function
    function savePortfolio() {
        try {
            const portfolioData = {
                timestamp: Date.now(),
                content: {
                    // Navigation section
                    navigation: {
                        brandName: document.querySelector('.nav-brand h1')?.textContent || '',
                        links: Array.from(document.querySelectorAll('.nav-links a')).map(link => ({
                            text: link.textContent,
                            href: link.getAttribute('href')
                        }))
                    },
                    
                    // Hero section
                    hero: {
                        title: document.querySelector('.hero-text h2')?.textContent || '',
                        subtitle: document.querySelector('.hero-subtitle')?.textContent || '',
                        description: document.querySelector('.hero-description')?.textContent || '',
                        profilePhoto: document.querySelector('.profile-photo img')?.src || ''
                    },
                    
                    // About section
                    about: {
                        title: document.querySelector('.about-section .section-title')?.textContent || '',
                        content: document.querySelector('.about-text')?.innerHTML || '',
                        details: Array.from(document.querySelectorAll('.about-details .detail-item')).map(item => ({
                            label: item.querySelector('.detail-label')?.textContent || '',
                            value: item.querySelector('.detail-value')?.textContent || ''
                        }))
                    },
                    
                    // Skills section
                    skills: Array.from(document.querySelectorAll('.skill-category')).map(category => ({
                        name: category.querySelector('h3')?.textContent || '',
                        skills: Array.from(category.querySelectorAll('.skill-item span')).map(skill => ({
                            name: skill.textContent
                        }))
                    })),
                    
                    // Projects section
                    projects: Array.from(document.querySelectorAll('.project-card')).map(card => ({
                        title: card.querySelector('.project-title')?.textContent || '',
                        description: card.querySelector('.project-description')?.textContent || '',
                        image: card.querySelector('.project-image')?.src || '',
                        demoUrl: card.querySelector('.project-link.demo')?.href || '',
                        githubUrl: card.querySelector('.project-link.github')?.href || ''
                    })),
                    
                    // Contact section
                    contact: {
                        title: document.querySelector('.contact-section .section-title')?.textContent || '',
                        email: document.querySelector('.contact-info .contact-item[data-type="email"] span')?.textContent || '',
                        phone: document.querySelector('.contact-info .contact-item[data-type="phone"] span')?.textContent || '',
                        location: document.querySelector('.contact-info .contact-item[data-type="location"] span')?.textContent || '',
                        socialLinks: Array.from(document.querySelectorAll('.social-links a')).map(link => ({
                            platform: link.getAttribute('data-platform') || '',
                            url: link.href
                        }))
                    },
                    
                    // Footer section
                    footer: {
                        text: document.querySelector('.portfolio-footer p')?.textContent || '',
                        links: Array.from(document.querySelectorAll('.portfolio-footer .footer-links a')).map(link => ({
                            text: link.textContent,
                            href: link.href
                        }))
                    },

                    // Custom styles and formatting
                    styles: {
                        colors: {
                            primary: getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '',
                            secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') || '',
                            accent: getComputedStyle(document.documentElement).getPropertyValue('--accent-color') || ''
                        },
                        fonts: {
                            primary: getComputedStyle(document.body).fontFamily || '',
                            headings: getComputedStyle(document.querySelector('h1')).fontFamily || ''
                        }
                    }
                }
            };

            // Save to localStorage
            localStorage.setItem('modernPortfolioData', JSON.stringify(portfolioData));
            
            // Show success notification
            showSaveNotification('success', 'All changes saved successfully!');
            
            // Update undo/redo stack
            if (!isUndoRedoAction) {
                saveState();
            }
            
            // Trigger custom event for save completion
            const saveEvent = new CustomEvent('portfolioSaved', { detail: portfolioData });
            document.dispatchEvent(saveEvent);
            
        } catch (error) {
            console.error('Error saving portfolio:', error);
            showSaveNotification('error', 'Error saving changes. Please try again.');
        }
    }

    // Add auto-save functionality
    let autoSaveTimeout;
    function setupAutoSave() {
        const autoSaveDelay = 30000; // 30 seconds

        function triggerAutoSave() {
            if (autoSaveTimeout) {
                clearTimeout(autoSaveTimeout);
            }
            autoSaveTimeout = setTimeout(() => {
                savePortfolio();
            }, autoSaveDelay);
        }

        // Listen for content changes
        document.querySelector('.portfolio-canvas').addEventListener('input', triggerAutoSave);
        document.querySelector('.portfolio-canvas').addEventListener('change', triggerAutoSave);
    }

    // Enhanced save notification
    function showSaveNotification(type, message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.save-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            ${type === 'success' ? '<div class="notification-progress"></div>' : ''}
        `;

        document.body.appendChild(notification);

        // Add styles if they don't exist
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .save-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem;
                    border-radius: 8px;
                    background: #fff;
                    color: #333;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    min-width: 300px;
                    animation: slideIn 0.3s ease-out;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .save-notification.success {
                    border-left: 4px solid #4CAF50;
                }

                .save-notification.error {
                    border-left: 4px solid #f44336;
                }

                .save-notification i {
                    font-size: 1.25rem;
                }

                .save-notification.success i {
                    color: #4CAF50;
                }

                .save-notification.error i {
                    color: #f44336;
                }

                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: #4CAF50;
                    animation: progress 3s linear;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }

                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove notification after delay
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Initialize auto-save when document is ready
    document.addEventListener('DOMContentLoaded', setupAutoSave);

    // Add event listeners for content changes
    // Add event listeners for content changes
    document.querySelector('.portfolio-canvas').addEventListener('input', () => {
        if (!isUndoRedoAction) {
            saveState();
        }
    });

    // Add event listeners for formatting changes
    document.addEventListener('selectionchange', () => {
        if (!isUndoRedoAction) {
            updateToolbarState();
        }
    });

    // Add event listeners for toolbar buttons
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!btn.classList.contains('disabled')) {
                saveState();
            }
        });
    });

    // Load saved content on page load
    loadSavedContent();
    makeContentEditable();

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Project Modal
    const projectModal = document.querySelector('#projectModal');
    const addProjectBtn = document.querySelector('.add-project-btn');
    const projectsGrid = document.querySelector('.projects-grid');
    const projectForm = document.getElementById('projectForm');

    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', () => {
            projectModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                projectModal.classList.add('show');
            }, 10);
        });
    }

    // Close project modal when clicking outside or on close button
    document.querySelectorAll('#projectModal .close-modal, #projectModal .btn-secondary').forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                projectModal.classList.remove('show');
                setTimeout(() => {
                    projectModal.style.display = 'none';
                    document.body.style.overflow = '';
                    if (projectForm) projectForm.reset();
                    // Clear the image preview
                    const imagePreview = document.querySelector('.project-image-preview');
                    if (imagePreview) {
                        imagePreview.style.backgroundImage = '';
                        imagePreview.classList.remove('has-image');
                    }
                }, 300);
            });
        }
    });

    // Handle project form submission
    if (projectForm) {
        projectForm.innerHTML = `
            <div class="form-group">
                <label for="projectTitle">Project Title</label>
                <input type="text" id="projectTitle" required>
                        </div>
            <div class="form-group">
                <label for="projectDescription">Project Description</label>
                <textarea id="projectDescription" required></textarea>
                    </div>
            <div class="form-group">
                <label for="projectImage">Project Image</label>
                <div class="file-input-container">
                    <div class="project-image-preview">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <span>Click or drag image here</span>
                </div>
                </div>
                    <input type="file" id="projectImage" accept="image/*" class="file-input" required>
                </div>
            </div>
            <div class="form-group">
                <label for="demoUrl">Demo URL</label>
                <input type="url" id="demoUrl" placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label for="githubUrl">Github URL</label>
                <input type="url" id="githubUrl" placeholder="https://github.com/username/repo">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeProjectModal()">Cancel</button>
                <button type="submit" class="btn-primary">Add Project</button>
            </div>
        `;

        // Add form styles
        const formStyles = document.createElement('style');
        formStyles.textContent = `
            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                color: #333;
                font-weight: 500;
            }

            .form-group input[type="text"],
            .form-group input[type="url"],
            .form-group textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .form-group input[type="text"]:focus,
            .form-group input[type="url"]:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #4776E6;
                box-shadow: 0 0 0 2px rgba(71, 118, 230, 0.1);
            }

            .form-group textarea {
                min-height: 100px;
                resize: vertical;
            }

            .file-input-container {
                position: relative;
                width: 100%;
                margin-bottom: 1rem;
            }

            .project-image-preview {
                width: 100%;
                height: 200px;
                border: 2px dashed #ccc;
                border-radius: 8px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .project-image-preview:hover {
                border-color: #4776E6;
                background-color: rgba(71, 118, 230, 0.05);
            }

            .project-image-preview.has-image .upload-icon {
                display: none;
            }

            .project-image-preview.has-image:hover .upload-icon {
                display: flex;
                background: rgba(0, 0, 0, 0.5);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 8px;
            }

            .upload-icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                color: #666;
            }

            .upload-icon i {
                font-size: 2rem;
            }

            .file-input {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }

            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
            }

            .btn-primary, .btn-secondary {
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-primary {
                background: #4776E6;
                color: white;
                border: none;
            }

            .btn-primary:hover {
                background: #3461c7;
                transform: translateY(-2px);
            }

            .btn-secondary {
                background: transparent;
                color: #666;
                border: 1px solid #ddd;
            }

            .btn-secondary:hover {
                background: #f8f9fa;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(formStyles);

        // Handle file input change
        const fileInput = projectForm.querySelector('.file-input');
        const preview = projectForm.querySelector('.project-image-preview');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.style.backgroundImage = `url('${e.target.result}')`;
                    preview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle drag and drop
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#4776E6';
            preview.style.backgroundColor = 'rgba(71, 118, 230, 0.05)';
        });

        preview.addEventListener('dragleave', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#ccc';
            preview.style.backgroundColor = '';
        });

        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#ccc';
            preview.style.backgroundColor = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.style.backgroundImage = `url('${e.target.result}')`;
                    preview.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });

        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    // Skills Management
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        // Create skills section wrapper if it doesn't exist
        let skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) {
            skillsSection = document.createElement('div');
            skillsSection.className = 'skills-section';
            skillsGrid.parentElement.insertBefore(skillsSection, skillsGrid);
            skillsSection.appendChild(skillsGrid);
        }

        // Create and add the Add Category button if it doesn't exist
        let addCategoryBtn = skillsSection.querySelector('.add-btn.project');
        if (!addCategoryBtn) {
            addCategoryBtn = document.createElement('button');
        addCategoryBtn.className = 'add-btn project';
        addCategoryBtn.innerHTML = '<i class="fas fa-plus"></i> Add Category';
        skillsSection.appendChild(addCategoryBtn);
        }

        // Add Category functionality
        addCategoryBtn.addEventListener('click', function() {
            const newCategory = document.createElement('div');
            newCategory.className = 'skill-category';
            newCategory.setAttribute('data-aos', 'fade-up');
            newCategory.innerHTML = `
                <button class="delete-category" title="Delete Category">
                    <i class="fas fa-times"></i>
                </button>
                <h3 contenteditable="true" spellcheck="false">New Category</h3>
                <div class="skill-items"></div>
                <button class="add-btn skill">
                    <i class="fas fa-plus"></i> Add Skill
                </button>
            `;

            // Add the new category to the grid
            skillsGrid.appendChild(newCategory);

            // Add event listeners for the new category
            const deleteBtn = newCategory.querySelector('.delete-category');
            const addSkillBtn = newCategory.querySelector('.add-btn.skill');
            const skillItems = newCategory.querySelector('.skill-items');
            const categoryTitle = newCategory.querySelector('h3');

            // Delete category functionality
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this category?')) {
                        newCategory.remove();
                }
            });

            // Make category name editable
            categoryTitle.addEventListener('focus', function() {
                const range = document.createRange();
                range.selectNodeContents(this);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            });

            categoryTitle.addEventListener('blur', function() {
                if (this.textContent.trim() === '') {
                    this.textContent = 'New Category';
                }
            });

            categoryTitle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });

            // Add Skill button functionality
            addSkillBtn.addEventListener('click', function() {
                const newSkill = document.createElement('div');
                newSkill.className = 'skill-item';
                newSkill.innerHTML = `
                    <span contenteditable="true" spellcheck="false">New Skill</span>
                    <button class="delete-skill" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                
                const skillText = newSkill.querySelector('span');
                const deleteSkillBtn = newSkill.querySelector('.delete-skill');

                // Make skill text editable
                skillText.addEventListener('focus', function() {
                    const range = document.createRange();
                    range.selectNodeContents(this);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                });

                skillText.addEventListener('blur', function() {
                    if (this.textContent.trim() === '') {
                        this.textContent = 'New Skill';
                    }
                });

                skillText.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                    }
                });

                // Delete skill functionality
                deleteSkillBtn.addEventListener('click', function() {
                    if (confirm('Delete this skill?')) {
                            newSkill.remove();
                    }
                });

                skillItems.appendChild(newSkill);
            });
        });

        // Add styles for better text editing
        const skillStyles = document.createElement('style');
        skillStyles.textContent = `
            .skill-category h3[contenteditable="true"],
            .skill-item span[contenteditable="true"] {
                outline: none;
                min-width: 50px;
                display: inline-block;
                white-space: pre-wrap;
                word-break: break-word;
                padding: 2px 4px;
                border-radius: 4px;
                transition: background-color 0.3s ease;
            }

            .skill-category h3[contenteditable="true"]:focus,
            .skill-item span[contenteditable="true"]:focus {
                background: rgba(71, 118, 230, 0.1);
            }

            .skill-category h3[contenteditable="true"]:empty:before,
            .skill-item span[contenteditable="true"]:empty:before {
                content: attr(data-placeholder);
                color: #999;
                cursor: text;
            }

            .skill-items {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin: 1rem 0;
            }

            .skill-item {
                background: #f8f9fa;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }

            .skill-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .delete-skill {
                background: none;
                border: none;
                color: #dc3545;
                cursor: pointer;
                padding: 0.25rem;
                opacity: 0.7;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .delete-skill:hover {
                opacity: 1;
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(skillStyles);
    }

    // Modal helpers
    function showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            if (modal.querySelector('form')) {
                modal.querySelector('form').reset();
            }
            document.body.style.overflow = '';
        }, 300);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Basic validation
            let isValid = true;
            for (const [key, value] of Object.entries(formValues)) {
                if (!value.trim()) {
                    isValid = false;
                    const input = contactForm.querySelector(`[name="${key}"]`);
                    input.classList.add('error');
                }
            }

            if (isValid) {
                // Here you would typically send the form data to a server
                alert('Message sent successfully!');
                contactForm.reset();
            }
        });

        // Remove error class on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
            });
        });
    }

    // Profile photo upload and delete functionality
    const photoInput = document.querySelector('.profile-photo input[type="file"]');
    if (photoInput) {
        const profileContainer = photoInput.closest('.profile-photo');
        const profileImg = profileContainer.querySelector('img');
        
        // Create camera overlay
        const cameraOverlay = document.createElement('div');
        cameraOverlay.className = 'camera-overlay';
        cameraOverlay.innerHTML = '<i class="fas fa-camera"></i>';
        cameraOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 50%;
            transition: opacity 0.3s ease;
            opacity: 0;
        `;

        // Create delete overlay
        const deleteOverlay = document.createElement('div');
        deleteOverlay.className = 'delete-overlay';
        deleteOverlay.innerHTML = '<i class="fas fa-trash"></i>';
        deleteOverlay.style.cssText = cameraOverlay.style.cssText;

        // Style icons
        const iconStyle = `
            color: white;
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        `;
        cameraOverlay.querySelector('i').style.cssText = iconStyle;
        deleteOverlay.querySelector('i').style.cssText = iconStyle;

        profileContainer.style.position = 'relative';
        profileContainer.appendChild(cameraOverlay);
        profileContainer.appendChild(deleteOverlay);

        // Function to update overlay visibility
        const updateOverlays = () => {
            const hasImage = profileImg.src && 
                           profileImg.src !== '' && 
                           !profileImg.src.endsWith('placeholder.jpg') && 
                           !profileImg.src.includes('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') &&
                           !profileImg.src.endsWith('photo') &&
                           profileImg.src !== window.location.href;
            
            // Set initial display style
            cameraOverlay.style.display = hasImage ? 'none' : 'flex';
            deleteOverlay.style.display = hasImage ? 'flex' : 'none';
            
            // Set initial opacity
            cameraOverlay.style.opacity = '0';
            deleteOverlay.style.opacity = '0';
        };

        // Show/hide overlays on hover
        profileContainer.addEventListener('mouseenter', () => {
            const hasImage = profileImg.src && 
                           profileImg.src !== '' && 
                           !profileImg.src.endsWith('placeholder.jpg') && 
                           !profileImg.src.includes('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7') &&
                           !profileImg.src.endsWith('photo') &&
                           profileImg.src !== window.location.href;
            
            if (hasImage) {
                deleteOverlay.style.opacity = '1';
            } else {
                cameraOverlay.style.opacity = '1';
            }
        });

        profileContainer.addEventListener('mouseleave', () => {
            cameraOverlay.style.opacity = '0';
            deleteOverlay.style.opacity = '0';
        });

        // Handle camera click (show file input)
        cameraOverlay.addEventListener('click', () => {
            photoInput.click();
        });

        // Handle delete click
        deleteOverlay.addEventListener('click', () => {
            profileImg.src = '';
            profileImg.removeAttribute('src');
            photoInput.value = '';
            updateOverlays();
        });

        // Handle new image upload
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                    updateOverlays();
                };
                reader.readAsDataURL(file);
            }
        });

        // Initial overlay state
        updateOverlays();

        // Hide the original file input but keep it functional
        photoInput.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            border: 0;
        `;
    }

    // Load saved content function
    function loadSavedContent() {
        try {
            const savedData = localStorage.getItem('modernPortfolioData');
            if (savedData) {
                const portfolioData = JSON.parse(savedData);
                const data = portfolioData.content;

                // Restore navigation
                if (data.navigation) {
                    const brandName = document.querySelector('.nav-brand h1');
                    if (brandName && data.navigation.brandName) {
                        brandName.textContent = data.navigation.brandName;
                    }
                }

                // Restore hero section
                if (data.hero) {
                    const heroElements = {
                        title: document.querySelector('.hero-text h2'),
                        subtitle: document.querySelector('.hero-subtitle'),
                        description: document.querySelector('.hero-description'),
                        profilePhoto: document.querySelector('.profile-photo img')
                    };

                    if (heroElements.title && data.hero.title) 
                        heroElements.title.textContent = data.hero.title;
                    if (heroElements.subtitle && data.hero.subtitle) 
                        heroElements.subtitle.textContent = data.hero.subtitle;
                    if (heroElements.description && data.hero.description) 
                        heroElements.description.textContent = data.hero.description;
                    if (heroElements.profilePhoto && data.hero.profilePhoto) 
                        heroElements.profilePhoto.src = data.hero.profilePhoto;
                }

                // Restore about section
                if (data.about) {
                    const aboutTitle = document.querySelector('.about-section .section-title');
                    const aboutContent = document.querySelector('.about-text');
                    if (aboutTitle && data.about.title) 
                        aboutTitle.textContent = data.about.title;
                    if (aboutContent && data.about.content) 
                        aboutContent.innerHTML = data.about.content;
                }

                // Restore skills section
                if (data.skills && data.skills.length > 0) {
                    const skillsGrid = document.querySelector('.skills-grid');
                    if (skillsGrid) {
                        skillsGrid.innerHTML = ''; // Clear existing skills
                        data.skills.forEach(categoryData => {
                            const category = createSkillCategory(categoryData.name);
                            if (categoryData.skills && categoryData.skills.length > 0) {
                                const skillItems = category.querySelector('.skill-items');
                                categoryData.skills.forEach(skillData => {
                                    const skillItem = createSkillItem(skillData.name);
                                    skillItems.appendChild(skillItem);
                                });
                            }
                            skillsGrid.appendChild(category);
                        });
                    }
                }

                // Restore projects section
                if (data.projects && data.projects.length > 0) {
                    const projectsGrid = document.querySelector('.projects-grid');
                    if (projectsGrid) {
                        projectsGrid.innerHTML = ''; // Clear existing projects
                        data.projects.forEach(projectData => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                    <button class="delete-project" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                                <img src="${projectData.image}" alt="${projectData.title}" class="project-image">
                                <div class="project-content">
                                    <h3 class="project-title">${projectData.title}</h3>
                                    <p class="project-description">${projectData.description}</p>
                                    <div class="project-links">
                                        ${projectData.demoUrl ? `<a href="${projectData.demoUrl}" class="project-link demo" target="_blank"><i class="fas fa-external-link-alt"></i> View Demo</a>` : ''}
                                        ${projectData.githubUrl ? `<a href="${projectData.githubUrl}" class="project-link github" target="_blank"><i class="fab fa-github"></i> View Github</a>` : ''}
                                    </div>
                </div>
            `;

                            // Add delete functionality to restored project
                            const deleteBtn = projectCard.querySelector('.delete-project');
                            deleteBtn.addEventListener('click', function() {
                                if (confirm('Are you sure you want to delete this project?')) {
                                    projectCard.remove();
                                    savePortfolio(); // Save after deletion
                                }
                            });

                            projectsGrid.appendChild(projectCard);
                        });
                    }
                }

                // Restore contact section
                if (data.contact) {
                    const contactElements = {
                        title: document.querySelector('.contact-section .section-title'),
                        email: document.querySelector('.contact-info .contact-item[data-type="email"] span'),
                        phone: document.querySelector('.contact-info .contact-item[data-type="phone"] span'),
                        location: document.querySelector('.contact-info .contact-item[data-type="location"] span')
                    };

                    if (contactElements.title && data.contact.title)
                        contactElements.title.textContent = data.contact.title;
                    if (contactElements.email && data.contact.email)
                        contactElements.email.textContent = data.contact.email;
                    if (contactElements.phone && data.contact.phone)
                        contactElements.phone.textContent = data.contact.phone;
                    if (contactElements.location && data.contact.location)
                        contactElements.location.textContent = data.contact.location;

                    // Restore social links
                    if (data.contact.socialLinks) {
                        const socialLinksContainer = document.querySelector('.social-links');
                        if (socialLinksContainer) {
                            socialLinksContainer.innerHTML = data.contact.socialLinks.map(link => `
                                <a href="${link.url}" data-platform="${link.platform}" target="_blank">
                                    <i class="fab fa-${link.platform}"></i>
                                </a>
                            `).join('');
                        }
                    }
                }

                // Save initial state after loading
                saveState();
                
                // Show success message
                showSaveNotification('success', 'Previous progress loaded successfully!');
            }
        } catch (error) {
            console.error('Error loading saved content:', error);
            showSaveNotification('error', 'Error loading saved content.');
        }
    }

    // Helper function to create a skill category
    function createSkillCategory(name = 'New Category') {
        const category = document.createElement('div');
        category.className = 'skill-category';
        category.style.opacity = '0';
        category.innerHTML = `
            <button class="delete-category" title="Delete Category">
                <i class="fas fa-times"></i>
            </button>
            <h3 contenteditable="true" spellcheck="false">${name}</h3>
            <div class="skill-items"></div>
            <button class="add-btn skill">
                <i class="fas fa-plus"></i> Add Skill
            </button>
        `;

        // Add event listeners
        const deleteBtn = category.querySelector('.delete-category');
        const addSkillBtn = category.querySelector('.add-btn.skill');
        const categoryTitle = category.querySelector('h3');

        // Delete category functionality
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this category?')) {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    category.remove();
                    savePortfolio();
                }, 300);
            }
        });

        categoryTitle.addEventListener('focus', function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });

        categoryTitle.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'New Category';
            }
            savePortfolio();
        });

        categoryTitle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });

        addSkillBtn.addEventListener('click', function() {
            const skillItems = category.querySelector('.skill-items');
            const newSkill = createSkillItem();
            skillItems.appendChild(newSkill);
            savePortfolio();
        });

        return category;
    }

    // Helper function to create a skill item
    function createSkillItem(name = 'New Skill') {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <span contenteditable="true" spellcheck="false">${name}</span>
            <button class="delete-skill" title="Delete Skill">
                <i class="fas fa-times"></i>
            </button>
        `;

        const skillText = skillItem.querySelector('span');
        const deleteBtn = skillItem.querySelector('.delete-skill');

        skillText.addEventListener('focus', function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });

        skillText.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'New Skill';
            }
            savePortfolio();
        });

        skillText.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
            e.preventDefault();
                this.blur();
            }
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Delete this skill?')) {
                skillItem.style.opacity = '0';
                skillItem.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    skillItem.remove();
                    savePortfolio();
                }, 300);
            }
        });

        return skillItem;
    }

    // Call loadSavedContent when the document is ready
    document.addEventListener('DOMContentLoaded', function() {
        loadSavedContent();
        setupAutoSave();
    });

    // Add save triggers for dynamic content changes
    function setupSaveTriggers() {
        // Save on project changes
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            const observer = new MutationObserver(() => savePortfolio());
            observer.observe(projectsGrid, { childList: true, subtree: true });
        }

        // Save on skills changes
        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) {
            const observer = new MutationObserver(() => savePortfolio());
            observer.observe(skillsGrid, { childList: true, subtree: true });
        }
    }

    // Initialize save triggers
    document.addEventListener('DOMContentLoaded', setupSaveTriggers);

    // Make all content areas editable
    function makeContentEditable() {
        const editableSelectors = [
            '.hero-text h2',
            '.hero-subtitle',
            '.hero-description',
            '.about-text p',
            '.section-title',
            '.project-card h3',
            '.project-card p',
            '.skill-category h3',
            '.skill-item span',
            '.contact-info .contact-item span',
            '.portfolio-footer p'
        ];
        
        editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!isPreviewMode) {
                    element.contentEditable = 'true';
                    element.style.cursor = 'text';
                    element.style.outline = 'none';
                }
        });
    });
    }

    // Add styles for smoother transitions
    const transitionStyles = document.createElement('style');
    transitionStyles.textContent = `
        .toolbar-btn {
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        
        .toolbar-btn:active {
            transform: scale(0.95);
        }
        
        .toolbar-btn.disabled {
            opacity: 0.5;
            pointer-events: none;
        }
        
        [contenteditable="true"] {
            transition: background-color 0.2s ease;
        }
        
        .project-card, .skill-category, .skill-item {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Add styles for undo/redo buttons */
        .undo-btn, .redo-btn {
            position: relative;
        }
        
        .undo-btn:after, .redo-btn:after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #4776E6;
            transform: scaleX(0);
            transition: transform 0.2s ease;
        }
        
        .undo-btn:not(.disabled):hover:after,
        .redo-btn:not(.disabled):hover:after {
            transform: scaleX(1);
        }
        
        .undo-btn.active, .redo-btn.active {
            color: #4776E6;
        }
        
        .undo-btn.active:after, .redo-btn.active:after {
            transform: scaleX(1);
        }
    `;
    document.head.appendChild(transitionStyles);

    // Update toolbar styles
    const toolbarStyles = document.createElement('style');
    toolbarStyles.textContent = `
        .editor-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 1rem;
            background: #1a1a1a;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            gap: 1rem;
        }

        .toolbar-left {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .toolbar-left .toolbar-btn {
            padding: 0.5rem 1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            border: none;
            background: transparent;
            color: #fff;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .toolbar-left .toolbar-btn.primary {
            background: #4776E6;
        }

        .toolbar-left .toolbar-btn:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .toolbar-left .toolbar-btn i {
            font-size: 1rem;
        }

        .toolbar-center {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            justify-content: center;
        }

        .tool-group {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
        }

        .tool-group button {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            color: #fff;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.3s ease;
        }

        .tool-group button:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .tool-group button.active {
            background: rgba(71, 118, 230, 0.2);
            color: #4776E6;
        }

        .toolbar select {
            padding: 0.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            min-width: 100px;
        }

        .toolbar select:focus {
                outline: none;
            border-color: #4776E6;
        }

        .toolbar-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }

        .template-name {
            color: #fff;
            font-size: 0.9rem;
            opacity: 0.7;
        }

        .portfolio-canvas {
            flex: 1;
            overflow-y: auto;
        }

        /* Project Card Styles */
        .project-card {
            background: #1a1a1a;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 300px;
            margin: 1rem 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .project-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .project-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1.5rem;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4), transparent);
            color: white;
            transform: translateY(0);
            transition: transform 0.3s ease;
        }

        .project-card:hover .project-image {
            transform: scale(1.05);
        }

        .project-title {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            color: white;
            font-weight: 600;
        }

        .project-description {
            font-size: 1rem;
            margin-bottom: 1.25rem;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.5;
        }

        .project-links {
            display: flex;
            gap: 1rem;
        }

        .project-link {
            padding: 0.75rem 1.25rem;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .project-link.demo {
            background: #4776E6;
            color: white;
        }

        .project-link.demo:hover {
            background: #3461c7;
            transform: translateY(-2px);
        }

        .project-link.github {
            background: #333;
            color: white;
        }

        .project-link.github:hover {
            background: #444;
            transform: translateY(-2px);
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(toolbarStyles);

    // Update project form submission handler
    function handleProjectSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const title = form.querySelector('#projectTitle').value;
        const description = form.querySelector('#projectDescription').value;
        const imageFile = form.querySelector('#projectImage').files[0];
        const githubUrl = form.querySelector('#githubUrl').value;
        const demoUrl = form.querySelector('#demoUrl').value;  // Make sure this input exists in your form

        // Create project card
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
        // Read the image file and create the card once it's loaded
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
            projectCard.innerHTML = `
                    <button class="delete-project" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                    <img src="${e.target.result}" alt="${title}" class="project-image">
                    <div class="project-content">
                        <h3 class="project-title">${title}</h3>
                        <p class="project-description">${description}</p>
                        <div class="project-links">
                            ${demoUrl ? `<a href="${demoUrl}" class="project-link demo" target="_blank"><i class="fas fa-external-link-alt"></i> View Demo</a>` : ''}
                            ${githubUrl ? `<a href="${githubUrl}" class="project-link github" target="_blank"><i class="fab fa-github"></i> View Github</a>` : ''}
                </div>
                </div>
            `;

                // Add delete functionality
                const deleteBtn = projectCard.querySelector('.delete-project');
                deleteBtn.addEventListener('click', function() {
                    if (confirm('Are you sure you want to delete this project?')) {
                        projectCard.remove();
                    }
                });

                // Add to projects container
                const projectsContainer = document.querySelector('.projects-grid');
                if (projectsContainer) {
            projectsContainer.appendChild(projectCard);
                }

                // Close modal and reset form
                const modal = document.querySelector('#projectModal');
                modal.classList.remove('show');
            setTimeout(() => {
                    modal.style.display = 'none';
                    form.reset();
                    // Clear the image preview
                    const imagePreview = document.querySelector('.project-image-preview');
                    if (imagePreview) {
                        imagePreview.style.backgroundImage = '';
                        imagePreview.classList.remove('has-image');
                    }
                }, 300);
            };
            reader.readAsDataURL(imageFile);
        }
    }

    // Add styles for delete project button
    const projectStyles = document.createElement('style');
    projectStyles.textContent = `
        .delete-project {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10;
            opacity: 0;
        }

        .project-card:hover .delete-project {
            opacity: 1;
        }

        .delete-project:hover {
            background: #dc3545;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(projectStyles);

    // Update font options
    const fontSizes = [
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '22px',
        '24px',
        '26px',
        '28px',
        '32px',
        '36px',
        '40px',
        '48px',
        '56px',
        '64px',
        '72px'
    ];

    // Update the font size select options
    if (sizeSelect) {
        sizeSelect.innerHTML = fontSizes.map(size => `<option value="${size}">${size}</option>`).join('');
    }

    // Initialize skills section
    function initializeSkillsSection() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) {
            // Create skills grid if it doesn't exist
            const skillsSection = document.querySelector('.skills-section');
            const newGrid = document.createElement('div');
            newGrid.className = 'skills-grid';
            skillsSection.appendChild(newGrid);
        }

        // Create and add the Add Category button
        const skillsSection = document.querySelector('.skills-section');
        let addCategoryBtn = skillsSection.querySelector('.add-btn.project');
        if (!addCategoryBtn) {
            addCategoryBtn = document.createElement('button');
            addCategoryBtn.className = 'add-btn project';
            addCategoryBtn.innerHTML = '<i class="fas fa-plus"></i> Add Category';
            skillsSection.appendChild(addCategoryBtn);
        }

        // Add Category button click handler
        addCategoryBtn.onclick = function() {
            const grid = document.querySelector('.skills-grid');
            const newCategory = createSkillCategory();
            grid.appendChild(newCategory);
        };
    }

    // Initialize skills section
    initializeSkillsSection();

    // Add styles for project links
    const projectLinkStyles = document.createElement('style');
    projectLinkStyles.textContent = `
        .project-link {
            padding: 0.75rem 1.25rem;
            border-radius: 6px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .project-link.demo {
            background: #4776E6;
            color: white;
        }

        .project-link.demo:hover {
            background: #3461c7;
            transform: translateY(-2px);
        }

        .project-link.github {
            background: rgba(255, 255, 255, 0.2);
            color: white;
        }

        .project-link.github:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }

        .project-links {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
    `;
    document.head.appendChild(projectLinkStyles);

    const skillStyles = document.createElement('style');
    skillStyles.textContent = `
        .skills-section {
            padding: 4rem 0;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
        }

        .section-title {
            color: #333;
            font-size: 2.5rem;
            font-weight: 600;
            text-align: center;
            margin-bottom: 0.5rem;
        }

        .section-title:after {
            content: '';
            display: block;
            width: 50px;
            height: 3px;
            background: #6C7CFF;
            margin: 1rem auto;
        }

        .skills-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 0 2rem;
        }

        .skills-card {
            background: #fff;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .add-category-card {
            background: #fff;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .add-category-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
        }

        .add-btn.project {
            background: #6C7CFF;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 30px;
            font-size: 0.95rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .add-btn.project:hover {
            background: #5B6AE5;
            transform: translateY(-2px);
        }

        .skill-category {
            background: #fff;
            border-radius: 15px;
            padding: 1.5rem;
            position: relative;
            transition: all 0.3s ease;
        }

        .skill-category h3 {
            color: #333;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            padding-right: 2rem;
        }

        .delete-category {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #FF5757;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s ease;
        }

        .delete-category:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .skill-items {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .skill-item {
            background: #f8f9fa;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: #333;
            transition: all 0.3s ease;
        }

        .skill-item:hover {
            background: #f1f3f5;
        }

        .delete-skill {
            background: none;
            border: none;
            color: #FF5757;
            cursor: pointer;
            opacity: 0.7;
            padding: 0.25rem;
            transition: all 0.3s ease;
        }

        .delete-skill:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .add-btn.skill {
            background: #6C7CFF;
            color: white;
            border: none;
            padding: 0.5rem 1.25rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: all 0.3s ease;
        }

        .add-btn.skill:hover {
            background: #5B6AE5;
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .skills-container {
                grid-template-columns: 1fr;
                padding: 0 1rem;
            }

            .skills-section {
                padding: 3rem 0;
            }
        }
    `;
    document.head.appendChild(skillStyles);

    // Update the initializeSkillsSection function
    function initializeSkillsSection() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;

        // Clear existing content
        skillsSection.innerHTML = '';

        // Create section title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = 'Skills & Expertise';
        skillsSection.appendChild(title);

        // Create skills container
        const skillsContainer = document.createElement('div');
        skillsContainer.className = 'skills-container';
        skillsSection.appendChild(skillsContainer);

        // Create add category card
        const addCategoryCard = document.createElement('div');
        addCategoryCard.className = 'add-category-card';
        addCategoryCard.innerHTML = `
            <button class="add-btn project">
                <i class="fas fa-plus"></i> Add Category
            </button>
        `;

        // Add click handler for add category
        addCategoryCard.querySelector('.add-btn.project').addEventListener('click', function() {
            const newCategory = createSkillCategory();
            skillsContainer.insertBefore(newCategory, addCategoryCard);
            
            // Focus on the new category title
            setTimeout(() => {
                const titleElement = newCategory.querySelector('h3');
                titleElement.focus();
                const range = document.createRange();
                range.selectNodeContents(titleElement);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }, 100);
        });

        skillsContainer.appendChild(addCategoryCard);
    }

    // Update createSkillCategory function
    function createSkillCategory(name = 'New Category') {
        const category = document.createElement('div');
        category.className = 'skill-category';
        category.innerHTML = `
            <button class="delete-category" title="Delete Category">
                <i class="fas fa-times"></i>
            </button>
            <h3 contenteditable="true" spellcheck="false">${name}</h3>
            <div class="skill-items"></div>
            <button class="add-btn skill">
                <i class="fas fa-plus"></i> Add Skill
            </button>
        `;

        // Add event listeners
        const deleteBtn = category.querySelector('.delete-category');
        const addSkillBtn = category.querySelector('.add-btn.skill');
        const categoryTitle = category.querySelector('h3');

        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this category?')) {
                category.style.opacity = '0';
                category.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    category.remove();
                    savePortfolio();
                }, 300);
            }
        });

        categoryTitle.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'New Category';
            }
            savePortfolio();
        });

        categoryTitle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });

        addSkillBtn.addEventListener('click', function() {
            const skillItems = category.querySelector('.skill-items');
            const newSkill = createSkillItem();
            skillItems.appendChild(newSkill);
            
            // Focus on the new skill
                setTimeout(() => {
                const skillText = newSkill.querySelector('span');
                skillText.focus();
                const range = document.createRange();
                range.selectNodeContents(skillText);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }, 100);
            
            savePortfolio();
        });

        return category;
    }

    // Update createSkillItem function
    function createSkillItem(name = 'New Skill') {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <span contenteditable="true" spellcheck="false">${name}</span>
            <button class="delete-skill" title="Delete Skill">
                <i class="fas fa-times"></i>
            </button>
        `;

        const skillText = skillItem.querySelector('span');
        const deleteBtn = skillItem.querySelector('.delete-skill');

        skillText.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'New Skill';
            }
            savePortfolio();
        });

        skillText.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur();
            }
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('Delete this skill?')) {
                skillItem.style.opacity = '0';
                skillItem.style.transform = 'translateY(5px)';
                setTimeout(() => {
                    skillItem.remove();
                    savePortfolio();
                }, 300);
            }
        });

        return skillItem;
    }

    // Initialize skills section when document is ready
    document.addEventListener('DOMContentLoaded', initializeSkillsSection);

    // ... existing code ...
});