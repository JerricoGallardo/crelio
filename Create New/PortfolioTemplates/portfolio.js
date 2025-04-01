$(document).ready(function() {
    // Initialize variables
    let undoStack = [];
    let redoStack = [];
    let currentState = '';

    // Save initial state
    saveState();

    // Toolbar button handlers
    $('.toolbar-btn').click(function() {
        const command = $(this).data('command');
        if (command) {
            executeCommand(command);
        }
    });

    // Font and font size handlers
    $('#fontSelector').change(function() {
        const font = $(this).val();
        document.execCommand('fontName', false, font);
    });

    $('#fontSizeSelector').change(function() {
        const size = $(this).val();
        document.execCommand('fontSize', false, size);
    });

    // Project modal handlers
    $('.add-project-btn').click(function() {
        $('#projectModal').show();
    });

    $('.close-modal').click(function() {
        $('#projectModal').hide();
    });

    $(window).click(function(event) {
        if ($(event.target).is('#projectModal')) {
            $('#projectModal').hide();
        }
    });

    // Add new project handler
    $('.project-form button').click(function() {
        const form = $(this).closest('.project-form');
        const title = form.find('input[type="text"]').val();
        const description = form.find('textarea').val();
        const technologies = form.find('input[placeholder="Enter technologies (comma-separated)"]').val();
        const liveDemo = form.find('input[placeholder="Enter live demo URL"]').val();
        const github = form.find('input[placeholder="Enter GitHub URL"]').val();
        const imageFile = form.find('input[type="file"]')[0].files[0];

        if (title && description) {
            const projectCard = createProjectCard(title, description, technologies, liveDemo, github, imageFile);
            $('#projectsContainer').append(projectCard);
            form[0].reset();
            $('#projectModal').hide();
            saveState();
        }
    });

    // Add new skill category handler
    $('.add-skill-category-btn').click(function() {
        const categoryName = prompt('Enter category name:');
        if (categoryName) {
            const category = createSkillCategory(categoryName);
            $('.skills-grid').append(category);
            saveState();
        }
    });

    // Profile photo upload handler
    $('#photoUpload').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#profileImage').attr('src', e.target.result);
                saveState();
            };
            reader.readAsDataURL(file);
        }
    });

    // Save button handler
    $('#saveBtn').click(function() {
        savePortfolio();
    });

    // Preview button handler
    $('#previewBtn').click(function() {
        previewPortfolio();
    });

    // Back button handler
    $('#backButton').click(function() {
        window.history.back();
    });

    // Command execution function
    function executeCommand(command) {
        switch (command) {
            case 'undo':
                undo();
                break;
            case 'redo':
                redo();
                break;
            case 'bold':
            case 'italic':
            case 'underline':
                document.execCommand(command, false, null);
                saveState();
                break;
        }
    }

    // State management functions
    function saveState() {
        const state = $('#portfolioTemplate').html();
        undoStack.push(currentState);
        currentState = state;
        redoStack = [];
    }

    function undo() {
        if (undoStack.length > 0) {
            redoStack.push(currentState);
            currentState = undoStack.pop();
            $('#portfolioTemplate').html(currentState);
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(currentState);
            currentState = redoStack.pop();
            $('#portfolioTemplate').html(currentState);
        }
    }

    // Project card creation function
    function createProjectCard(title, description, technologies, liveDemo, github, imageFile) {
        const techArray = technologies.split(',').map(tech => tech.trim());
        const techSpans = techArray.map(tech => `<span>${tech}</span>`).join('');

        return `
            <div class="project-card">
                <div class="project-image">
                    <img src="${imageFile ? URL.createObjectURL(imageFile) : '../../img/project1.jpg'}" alt="${title}">
                </div>
                <div class="project-info">
                    <h3 contenteditable="true">${title}</h3>
                    <p contenteditable="true">${description}</p>
                    <div class="project-tech">
                        ${techSpans}
                    </div>
                    <div class="project-links">
                        <a href="${liveDemo}" contenteditable="true">Live Demo</a>
                        <a href="${github}" contenteditable="true">GitHub</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Skill category creation function
    function createSkillCategory(name) {
        return `
            <div class="skill-category">
                <h3 contenteditable="true">${name}</h3>
                <div class="skill-items">
                    <div class="skill-item" contenteditable="true">Add Skill</div>
                </div>
            </div>
        `;
    }

    // Save portfolio function
    function savePortfolio() {
        const portfolioData = {
            html: $('#portfolioTemplate').html(),
            css: $('style').html(),
            js: $('script').html()
        };

        // Here you would typically send this data to your backend
        console.log('Saving portfolio:', portfolioData);
        alert('Portfolio saved successfully!');
    }

    // Preview portfolio function
    function previewPortfolio() {
        const previewWindow = window.open('', '_blank');
        const portfolioContent = $('#portfolioTemplate').html();
        const cssContent = $('style').html();
        const jsContent = $('script').html();

        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Portfolio Preview</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>${cssContent}</style>
            </head>
            <body>
                ${portfolioContent}
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script>${jsContent}</script>
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    // Initialize contenteditable elements
    $('[contenteditable="true"]').each(function() {
        const placeholder = $(this).data('placeholder');
        if (placeholder) {
            if (!$(this).text().trim()) {
                $(this).text(placeholder);
                $(this).addClass('placeholder');
            }
        }
    });

    // Placeholder handling
    $('[contenteditable="true"]').focus(function() {
        if ($(this).hasClass('placeholder')) {
            $(this).text('');
            $(this).removeClass('placeholder');
        }
    }).blur(function() {
        const placeholder = $(this).data('placeholder');
        if (placeholder && !$(this).text().trim()) {
            $(this).text(placeholder);
            $(this).addClass('placeholder');
        }
    });
}); 