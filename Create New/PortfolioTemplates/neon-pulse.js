document.addEventListener('DOMContentLoaded', function() {
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
    const addProjectBtn = document.querySelector('.add-btn.project');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            const projectsContainer = document.querySelector('.projects-grid');
            const newProject = document.createElement('div');
            newProject.className = 'project-card';
            newProject.innerHTML = `
                <div class="project-image">
                    <img src="placeholder.jpg" alt="Project Image">
                    <div class="project-overlay">
                        <button class="btn primary">View Project</button>
                    </div>
                </div>
                <div class="project-info">
                    <h3 contenteditable="true">Project Title</h3>
                    <p contenteditable="true">Project description goes here. Click to edit.</p>
                    <div class="project-tags">
                        <span contenteditable="true">Tag 1</span>
                        <span contenteditable="true">Tag 2</span>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(newProject);
        });
    }

    // Add Category Button
    const addCategoryBtn = document.querySelector('.add-btn.category');
    const skillsGrid = document.querySelector('.skills-grid');

    if (addCategoryBtn && skillsGrid) {
        addCategoryBtn.addEventListener('click', function() {
            const newCategory = document.createElement('div');
            newCategory.className = 'skill-category';
            newCategory.innerHTML = `
                <h3 contenteditable="true">New Category</h3>
                <div class="skill-items">
                    <span class="skill-item" contenteditable="true">New Skill</span>
                </div>
                <button class="add-btn skill">
                    <i class="fas fa-plus"></i> Add Skill
                </button>
            `;
            skillsGrid.appendChild(newCategory);

            // Add event listener for the new "Add Skill" button
            const addSkillBtn = newCategory.querySelector('.add-btn.skill');
            if (addSkillBtn) {
                addSkillBtn.addEventListener('click', function() {
                    const skillItems = this.previousElementSibling;
                    const newSkill = document.createElement('span');
                    newSkill.className = 'skill-item';
                    newSkill.contentEditable = true;
                    newSkill.textContent = 'New Skill';
                    skillItems.appendChild(newSkill);
                });
            }
        });
    }

    // Add Skill Buttons (including existing ones)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-btn.skill')) {
            const skillItems = e.target.closest('.skill-category').querySelector('.skill-items');
            const newSkill = document.createElement('span');
            newSkill.className = 'skill-item';
            newSkill.contentEditable = true;
            newSkill.textContent = 'New Skill';
            skillItems.appendChild(newSkill);
        }
    });

    // Text Formatting
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');

    if (boldBtn) {
        boldBtn.addEventListener('click', function() {
            document.execCommand('bold', false, null);
        });
    }

    if (italicBtn) {
        italicBtn.addEventListener('click', function() {
            document.execCommand('italic', false, null);
        });
    }

    if (underlineBtn) {
        underlineBtn.addEventListener('click', function() {
            document.execCommand('underline', false, null);
        });
    }

    // Font Family Selection
    const fontSelect = document.getElementById('fontSelect');
    if (fontSelect) {
        fontSelect.addEventListener('change', function() {
            const selectedFont = this.value;
            if (activeElement && activeElement.hasAttribute('contenteditable')) {
                activeElement.style.fontFamily = selectedFont;
            }
        });
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
                savedContent[`editable_${index}`] = {
                    content: element.innerHTML,
                    id: element.id || null,
                    className: element.className
                };
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
            const content = JSON.parse(savedContent);
            const editableElements = document.querySelectorAll('[contenteditable="true"]');
            
            editableElements.forEach((element, index) => {
                const savedItem = content[`editable_${index}`];
                if (savedItem) {
                    element.innerHTML = savedItem.content;
                }
            });
        }
    }
});