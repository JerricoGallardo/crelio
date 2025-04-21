// Function to fix font size detection
function fixFontSizeDetection() {
    // Get the font size selector
    const fontSizeSelector = document.getElementById('font-size-selector');
    if (!fontSizeSelector) return;
    
    // Add a new event listener to update the font size when the selector changes
    fontSizeSelector.addEventListener('change', function() {
        const fontSize = this.value;
        console.log('Font size changed to:', fontSize);
        
        // Get the current selection
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // If there's a selection, wrap it in a span with the font size
            if (!range.collapsed) {
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
                    
                    console.log('Applied font size to selection:', fontSize);
                } catch (e) {
                    console.error('Error applying font size to selection:', e);
                }
            } else {
                // If no selection but we're in an editable element, apply to the whole element
                const activeElement = document.activeElement;
                if (activeElement && activeElement.isContentEditable) {
                    try {
                        // If the element already has a font size, update it
                        if (activeElement.style.fontSize) {
                            activeElement.style.fontSize = fontSize;
                        } else {
                            // Otherwise, select all and wrap in a span
                            const range = document.createRange();
                            range.selectNodeContents(activeElement);
                            selection.removeAllRanges();
                            selection.addRange(range);
                            
                            const span = document.createElement('span');
                            span.className = 'custom-font-size';
                            span.style.fontSize = fontSize;
                            
                            const fragment = range.extractContents();
                            span.appendChild(fragment);
                            range.insertNode(span);
                            
                            // Select the span
                            selection.removeAllRanges();
                            const newRange = document.createRange();
                            newRange.selectNodeContents(span);
                            selection.addRange(newRange);
                        }
                        
                        console.log('Applied font size to element:', fontSize);
                    } catch (e) {
                        console.error('Error applying font size to element:', e);
                    }
                }
            }
        }
    });
    
    // Add event listener to update the font size selector when the selection changes
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            
            // If there's a selection, find the font size of the selected text
            if (!range.collapsed) {
                // Get the common ancestor of the selection
                const commonAncestor = range.commonAncestorContainer;
                
                // If it's a text node, get its parent
                const element = commonAncestor.nodeType === 3 ? commonAncestor.parentElement : commonAncestor;
                
                // Find the element with a font size
                let fontSizeElement = element;
                while (fontSizeElement && !fontSizeElement.style.fontSize) {
                    // Check if it has a custom font size class
                    if (fontSizeElement.classList && fontSizeElement.classList.contains('custom-font-size')) {
                        break;
                    }
                    
                    // Move up to the parent
                    fontSizeElement = fontSizeElement.parentElement;
                    
                    // Stop if we reach the body
                    if (fontSizeElement === document.body) {
                        fontSizeElement = null;
                        break;
                    }
                }
                
                // If we found an element with a font size, update the selector
                if (fontSizeElement) {
                    const computedStyle = window.getComputedStyle(fontSizeElement);
                    const fontSize = computedStyle.fontSize;
                    
                    // Find the closest match in the dropdown
                    const fontSizePx = parseInt(fontSize);
                    let bestMatch = 0;
                    let minDiff = Number.MAX_VALUE;
                    
                    for (let i = 0; i < fontSizeSelector.options.length; i++) {
                        const optionSize = parseInt(fontSizeSelector.options[i].value);
                        const diff = Math.abs(optionSize - fontSizePx);
                        
                        if (diff < minDiff) {
                            minDiff = diff;
                            bestMatch = i;
                        }
                    }
                    
                    // Update the selector
                    fontSizeSelector.selectedIndex = bestMatch;
                    console.log('Updated font size selector to:', fontSizeSelector.options[bestMatch].value);
                }
            }
        }
    });
    
    // Add event listener to update the font size selector when clicking on an editable element
    document.addEventListener('mousedown', function(e) {
        // Find if we clicked on or within an editable element
        const clickedElement = e.target.closest('[contenteditable="true"]');
        
        if (clickedElement) {
            // Get the computed style of the element
            const computedStyle = window.getComputedStyle(clickedElement);
            const fontSize = computedStyle.fontSize;
            
            // Find the closest match in the dropdown
            const fontSizePx = parseInt(fontSize);
            let bestMatch = 0;
            let minDiff = Number.MAX_VALUE;
            
            for (let i = 0; i < fontSizeSelector.options.length; i++) {
                const optionSize = parseInt(fontSizeSelector.options[i].value);
                const diff = Math.abs(optionSize - fontSizePx);
                
                if (diff < minDiff) {
                    minDiff = diff;
                    bestMatch = i;
                }
            }
            
            // Update the selector
            fontSizeSelector.selectedIndex = bestMatch;
            console.log('Updated font size selector to:', fontSizeSelector.options[bestMatch].value);
        }
    });
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to make sure all other scripts have loaded
    setTimeout(fixFontSizeDetection, 500);
});
