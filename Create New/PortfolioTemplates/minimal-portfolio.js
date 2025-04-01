// Initialize variables
let undoStack = [];
let redoStack = [];
let currentFont = 'Arial';
let currentFontSize = '16px';

// DOM Elements
const toolbar = document.querySelector('.toolbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const portfolioCanvas = document.querySelector('.portfolio-canvas');
const addProjectBtn = document.querySelector('.add-project-btn');
const projectModal = document.querySelector('.project-modal');
const closeModalBtn = document.querySelector('.close-modal');
const projectForm = document.querySelector('.project-form');
const projectsGrid = document.querySelector('.projects-grid');
const addSkillCategoryBtn = document.querySelector('.add-skill-category-btn');
const skillsGrid = document.querySelector('.skills-grid');

// Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Toolbar Functions
function saveState() {
    undoStack.push(portfolioCanvas.innerHTML);
    redoStack = [];
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(portfolioCanvas.innerHTML);
        portfolioCanvas.innerHTML = undoStack.pop();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(portfolioCanvas.innerHTML);
        portfolioCanvas.innerHTML = redoStack.pop();
    }
}

function formatText(command) {
    document.execCommand(command, false, null);
}

function changeFont(font) {
    currentFont = font;
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.style.fontFamily = font;
    });
}

function changeFontSize(size) {
    currentFontSize = size;
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.style.fontSize = size;
    });
}

// Project Modal Functions
function openProjectModal() {
    projectModal.style.display = 'block';
}

function closeProjectModal() {
    projectModal.style.display = 'none';
}

function addProject(e) {
    e.preventDefault();
    const formData = new FormData(projectForm);
    const project = {
        title: formData.get('project-title'),
        description: formData.get('project-description'),
        technologies: formData.get('project-technologies').split(',').map(tech => tech.trim()),
        image: formData.get('project-image'),
        demoUrl: formData.get('project-demo'),
        githubUrl: formData.get('project-github')
    };

    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
    closeProjectModal();
    projectForm.reset();
    saveState();
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="project-info">
            <h3 contenteditable="true">${project.title}</h3>
            <p contenteditable="true">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" class="btn primary">Live Demo</a>` : ''}
                ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="btn secondary">GitHub</a>` : ''}
            </div>
        </div>
    `;
    return card;
}

// Skill Category Functions
function addSkillCategory() {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
        const category = createSkillCategory(categoryName);
        skillsGrid.appendChild(category);
        saveState();
    }
}

function createSkillCategory(name) {
    const category = document.createElement('div');
    category.className = 'skill-category';
    category.innerHTML = `
        <h3 contenteditable="true">${name}</h3>
        <div class="skill-items">
            <span class="skill-item" contenteditable="true">Add Skill</span>
        </div>
    `;
    return category;
}

// Image Upload Function
function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            const container = input.closest('.profile-photo-container');
            const existingImg = container.querySelector('img');
            if (existingImg) {
                existingImg.remove();
            }
            container.insertBefore(img, container.firstChild);
            
            saveState();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contenteditable elements
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.addEventListener('input', saveState);
    });

    // Toolbar event listeners
    document.querySelector('.undo-btn').addEventListener('click', undo);
    document.querySelector('.redo-btn').addEventListener('click', redo);
    document.querySelector('.bold-btn').addEventListener('click', () => formatText('bold'));
    document.querySelector('.italic-btn').addEventListener('click', () => formatText('italic'));
    document.querySelector('.underline-btn').addEventListener('click', () => formatText('underline'));
    
    // Font and size selectors
    document.querySelector('.font-select').addEventListener('change', (e) => changeFont(e.target.value));
    document.querySelector('.font-size-select').addEventListener('change', (e) => changeFontSize(e.target.value));

    // Project modal event listeners
    addProjectBtn.addEventListener('click', openProjectModal);
    closeModalBtn.addEventListener('click', closeProjectModal);
    projectForm.addEventListener('submit', addProject);

    // Skill category event listener
    addSkillCategoryBtn.addEventListener('click', addSkillCategory);

    // Image upload event listener
    const imageUpload = document.querySelector('input[type="file"]');
    if (imageUpload) {
        imageUpload.addEventListener('change', (e) => handleImageUpload(e.target));
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
});

// Save and Preview Functions
function savePortfolio() {
    const portfolioData = {
        content: portfolioCanvas.innerHTML,
        font: currentFont,
        fontSize: currentFontSize
    };
    
    // Save to localStorage for now
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    alert('Portfolio saved successfully!');
}

function previewPortfolio() {
    // Create a new window for preview
    const previewWindow = window.open('', '_blank');
    const portfolioContent = portfolioCanvas.innerHTML;
    
    // Create a clean preview without the editor toolbar
    const previewContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Portfolio Preview</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <link rel="stylesheet" href="minimal-portfolio.css">
        </head>
        <body>
            ${portfolioContent}
        </body>
        </html>
    `;
    
    previewWindow.document.write(previewContent);
    previewWindow.document.close();
} 