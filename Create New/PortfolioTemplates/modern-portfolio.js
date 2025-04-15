// Modern Portfolio JS
// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

document.addEventListener('DOMContentLoaded', function() {
    // Text Formatting Controls
    const formatControls = document.createElement('div');
    formatControls.className = 'format-controls';
    formatControls.innerHTML = `
        <button onclick="document.execCommand('undo')" title="Undo"><i class="fas fa-undo"></i></button>
        <select onchange="document.execCommand('fontName', false, this.value)">
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Verdana">Verdana</option>
        </select>
        <select onchange="document.execCommand('fontSize', false, this.value)">
            <option value="2">12px</option>
            <option value="3">14px</option>
            <option value="4">16px</option>
            <option value="5">18px</option>
            <option value="6">24px</option>
            <option value="7">32px</option>
        </select>
        <button onclick="document.execCommand('bold')" title="Bold"><i class="fas fa-bold"></i></button>
        <button onclick="document.execCommand('italic')" title="Italic"><i class="fas fa-italic"></i></button>
        <button onclick="document.execCommand('underline')" title="Underline"><i class="fas fa-underline"></i></button>
    `;

    // Add format controls to the page
    document.body.insertBefore(formatControls, document.body.firstChild);

    // Make content areas editable
    const editableAreas = [
        '.about-text p',
        '.project-card h3',
        '.project-card p',
        '.section-title',
        '.skill-item span'
    ];

    editableAreas.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.contentEditable = true;
            element.addEventListener('focus', () => {
                formatControls.style.display = 'flex';
            });
        });
    });

    // Hide format controls when clicking outside editable areas
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[contenteditable="true"]') && !e.target.closest('.format-controls')) {
            formatControls.style.display = 'none';
        }
    });

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
                }, 300);
            });
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('show');
            setTimeout(() => {
                projectModal.style.display = 'none';
                document.body.style.overflow = '';
                if (projectForm) projectForm.reset();
            }, 300);
        }
    });

    // Handle project form submission
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('projectTitle').value;
            const description = document.getElementById('projectDescription').value;
            const imageUrl = document.getElementById('projectImage').value || 'https://via.placeholder.com/300';
            const demoUrl = document.getElementById('demoUrl').value;
            const githubUrl = document.getElementById('githubUrl').value;

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            projectCard.innerHTML = `
                <div class="project-image-container">
                    <img src="${imageUrl}" alt="${title}" class="project-image">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${demoUrl ? `<a href="${demoUrl}" target="_blank" class="btn primary">Live Demo</a>` : ''}
                            ${githubUrl ? `<a href="${githubUrl}" target="_blank" class="btn secondary">GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <h3 contenteditable="true">${title}</h3>
                    <p contenteditable="true">${description}</p>
                </div>
                <div class="project-actions">
                    <button class="delete-project" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            projectsGrid.appendChild(projectCard);
            
            // Close modal and reset form
            projectModal.classList.remove('show');
            setTimeout(() => {
                projectModal.style.display = 'none';
                document.body.style.overflow = '';
            projectForm.reset();
            }, 300);
            
            AOS.refresh();
        });
    }

    // Skills Management
    const skillsGrid = document.querySelector('.skills-grid');
    
    // Initialize empty skill categories
    function initializeSkillCategories() {
        if (!skillsGrid) return;

        // Clear existing skills
        skillsGrid.innerHTML = '';

        const categories = ['Frontend', 'Backend'];
        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            categoryDiv.setAttribute('data-aos', 'fade-up');
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <h3>${category}</h3>
                    <button class="add-skill-btn btn primary" data-category="${category.toLowerCase()}">
                        <i class="fas fa-plus"></i> Add ${category} Skill
                    </button>
                </div>
                <div class="skill-items" data-category="${category.toLowerCase()}"></div>
            `;
            skillsGrid.appendChild(categoryDiv);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.add-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const skillModal = createSkillModal();
                const category = btn.dataset.category;
                
                // Store the category in the modal for reference
                skillModal.dataset.category = category;
                
                // Remove any existing submit event listeners
                const form = skillModal.querySelector('form');
                const newForm = form.cloneNode(true);
                form.parentNode.replaceChild(newForm, form);
                
                // Add new submit event listener
                newForm.addEventListener('submit', handleSkillSubmit);
                
                // Update range input listener
                const range = newForm.querySelector('input[type="range"]');
                const rangeValue = newForm.querySelector('.range-value');
                range.addEventListener('input', () => {
                    rangeValue.textContent = `${range.value}%`;
                });
                
                showModal(skillModal);
            });
        });
    }

    // Handle skill form submission
    function handleSkillSubmit(e) {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        const category = modal.dataset.category;
        const name = modal.querySelector('#skill-name').value;
        const level = modal.querySelector('#skill-level').value;
        
        const skillContainer = document.querySelector(`.skill-items[data-category="${category}"]`);
        const skillItem = createSkillItem(name, level, category);
        skillContainer.appendChild(skillItem);
        
        hideModal(modal);
        AOS.refresh();
    }

    // Create skill modal
    function createSkillModal() {
        let modal = document.querySelector('.skill-modal');
        if (modal) {
            // Reset the form if modal exists
            const form = modal.querySelector('form');
            form.reset();
            return modal;
        }

        const modalHTML = `
            <div class="modal skill-modal">
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    <h2>Add New Skill</h2>
                    <form>
                        <div class="form-group">
                            <label for="skill-name">Skill Name</label>
                            <input type="text" id="skill-name" required>
                        </div>
                        <div class="form-group">
                            <label for="skill-level">Skill Level</label>
                            <div class="range-slider">
                                <input type="range" id="skill-level" min="0" max="100" value="50">
                                <span class="range-value">50%</span>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn secondary cancel-btn">Cancel</button>
                            <button type="submit" class="btn primary">Add Skill</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.querySelector('.skill-modal');
        
        // Add close button listeners
        modal.querySelector('.close-modal').addEventListener('click', () => hideModal(modal));
        modal.querySelector('.cancel-btn').addEventListener('click', () => hideModal(modal));

        return modal;
    }

    // Create skill item
    function createSkillItem(name, level, category) {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.setAttribute('data-aos', 'fade-right');
        skillItem.setAttribute('data-aos-duration', '600');
        skillItem.setAttribute('data-name', name);
        skillItem.setAttribute('data-level', level);
        skillItem.innerHTML = `
            <div class="skill-header">
                <span class="skill-name" contenteditable="true">${name}</span>
                <div class="skill-actions">
                    <button class="edit-skill" title="Edit Skill">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-skill" title="Delete Skill">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: 0%"></div>
            </div>
        `;

        // Animate skill progress
        setTimeout(() => {
            skillItem.querySelector('.skill-progress').style.width = `${level}%`;
        }, 100);

        // Add delete functionality
        const deleteSkillBtn = skillItem.querySelector('.delete-skill');
        deleteSkillBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this skill?')) {
                skillItem.style.opacity = '0';
                skillItem.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    skillItem.remove();
                    AOS.refresh();
                }, 300);
            }
        });

        // Add edit functionality
        skillItem.querySelector('.edit-skill').addEventListener('click', () => {
            const modal = createSkillModal();
            const form = modal.querySelector('form');
            const nameInput = modal.querySelector('#skill-name');
            const levelInput = modal.querySelector('#skill-level');
            const rangeValue = modal.querySelector('.range-value');
            
            // Pre-fill current values
            nameInput.value = skillItem.querySelector('.skill-name').textContent;
            const currentLevel = parseInt(skillItem.querySelector('.skill-progress').style.width);
            levelInput.value = currentLevel;
            rangeValue.textContent = `${currentLevel}%`;
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                skillItem.querySelector('.skill-name').textContent = nameInput.value;
                const progressBar = skillItem.querySelector('.skill-progress');
                progressBar.style.width = `${levelInput.value}%`;
                hideModal(modal);
            }, { once: true });
            
            showModal(modal);
        });

        return skillItem;
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

    // Initialize skills
    initializeSkillCategories();

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

    // Profile photo upload
    const photoInput = document.querySelector('.profile-photo input[type="file"]');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.querySelector('.profile-photo img');
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save portfolio
    window.savePortfolio = function() {
        const portfolioData = {
            name: document.querySelector('.nav-brand h1').textContent,
            about: document.querySelector('.about-text p').textContent,
            projects: Array.from(document.querySelectorAll('.project-card')).map(card => ({
                title: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                image: card.querySelector('img').src,
                technologies: Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent),
                demo: card.querySelector('.project-links a[href*="demo"]')?.href,
                github: card.querySelector('.project-links a[href*="github"]')?.href
            })),
            skills: Array.from(document.querySelectorAll('.skill-item')).map(item => ({
                name: item.querySelector('span').textContent,
                level: item.querySelector('.skill-progress').style.width
            })),
            contact: {
                email: document.querySelector('.contact-info .contact-item:first-child span').textContent,
                location: document.querySelector('.contact-info .contact-item:nth-child(2) span').textContent
            }
        };

        // Here you would typically send the data to a server
        console.log('Portfolio saved:', portfolioData);
        alert('Portfolio saved successfully!');
    };

    // Preview portfolio
    window.previewPortfolio = function() {
        // Here you would typically open the portfolio in a new window
        alert('Preview functionality will be implemented soon!');
    };

    // Modal Management
    const modals = {
        project: document.getElementById('projectModal'),
        skill: document.getElementById('skillModal'),
        confirmDelete: document.getElementById('confirmDeleteModal')
    };

    let currentItemToDelete = null;

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
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Close modal when clicking outside
    Object.values(modals).forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(Object.keys(modals).find(key => modals[key] === modal));
            }
        });
    });

    // Close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            const modalId = Object.keys(modals).find(key => modals[key] === modal);
            hideModal(modalId);
        });
    });

    // Project Management
    const projectsContainer = document.querySelector('.projects-grid');

    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('projectTitle').value.trim();
            const description = document.getElementById('projectDescription').value.trim();
            const image = document.getElementById('projectImage').value;

            if (!title || !description) {
                alert('Please fill in all required fields');
                return;
            }

            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-aos', 'fade-up');
            projectCard.setAttribute('data-aos-duration', '800');
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${image || 'placeholder-image.jpg'}" alt="${title}">
                    <div class="project-overlay">
                        <h3>${title}</h3>
                        <p>${description}</p>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="delete-project" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            projectsContainer.appendChild(projectCard);
            projectCard.style.opacity = '0';
            setTimeout(() => {
                projectCard.style.opacity = '1';
                projectCard.style.transform = 'translateY(0)';
            }, 100);
            
            AOS.refresh();
            hideModal('project');
            projectForm.reset();
        });
    }

    // Enhanced Skill Management
    const skillForm = document.getElementById('skillForm');
    const skillLevelInput = document.getElementById('skillLevel');
    const skillLevelDisplay = skillLevelInput.nextElementSibling;
    let editingSkillElement = null;

    skillLevelInput.addEventListener('input', (e) => {
        const value = e.target.value;
        skillLevelDisplay.textContent = `${value}%`;
        skillLevelDisplay.style.left = `${value}%`;
    });

    skillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('skillName').value.trim();
        const level = document.getElementById('skillLevel').value;
        
        if (!name) {
            alert('Please enter a skill name');
            return;
        }

        const category = editingSkillElement ? 
            editingSkillElement.getAttribute('data-category') : 
            document.querySelector('.skills-container.active').id;

        if (editingSkillElement) {
            // Update existing skill with animation
            const progress = editingSkillElement.querySelector('.progress');
            const percentage = editingSkillElement.querySelector('.skill-percentage');
            
            editingSkillElement.querySelector('h4').textContent = name;
            progress.style.transition = 'width 0.5s ease-in-out';
            progress.style.width = `${level}%`;
            percentage.textContent = `${level}%`;
            
            editingSkillElement.setAttribute('data-name', name);
            editingSkillElement.setAttribute('data-level', level);
            editingSkillElement = null;
        } else {
            // Add new skill
            const container = document.querySelector(`#${category} .skills-list`);
            const skillItem = createSkillItem(name, level, category);
            container.appendChild(skillItem);
            AOS.refresh();
        }

        hideModal('skill');
        skillForm.reset();
        skillLevelDisplay.textContent = '50%';
        skillLevelDisplay.style.left = '50%';
    });

    // Improved Edit and Delete Skills with animations
    document.addEventListener('click', (e) => {
        if (e.target.closest('.edit-skill')) {
            const skillItem = e.target.closest('.skill-item');
            editingSkillElement = skillItem;
            
            document.getElementById('skillName').value = skillItem.getAttribute('data-name');
            const level = skillItem.getAttribute('data-level');
            document.getElementById('skillLevel').value = level;
            skillLevelDisplay.textContent = `${level}%`;
            skillLevelDisplay.style.left = `${level}%`;
            
            showModal('skill');
        } else if (e.target.closest('.delete-skill') || e.target.closest('.delete-project')) {
            currentItemToDelete = e.target.closest('.skill-item, .project-card');
            showModal('confirmDelete');
        }
    });

    // Enhanced Delete Confirmation
    document.getElementById('confirmDelete').addEventListener('click', () => {
        if (currentItemToDelete) {
            currentItemToDelete.style.opacity = '0';
            currentItemToDelete.style.transform = 'scale(0.8)';
            setTimeout(() => {
                currentItemToDelete.remove();
                currentItemToDelete = null;
                AOS.refresh();
            }, 300);
            hideModal('confirmDelete');
        }
    });

    // Smooth tab switching for skills
    document.querySelectorAll('.skills-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const activeTab = document.querySelector('.skills-tab.active');
            const activeContainer = document.querySelector('.skills-container.active');
            
            if (activeTab !== tab) {
                activeTab.classList.remove('active');
                tab.classList.add('active');
                
                activeContainer.style.opacity = '0';
                setTimeout(() => {
                    activeContainer.classList.remove('active');
                    const newContainer = document.querySelector(tab.getAttribute('data-target'));
                    newContainer.classList.add('active');
                    newContainer.style.opacity = '0';
                    setTimeout(() => {
                        newContainer.style.opacity = '1';
                    }, 50);
                }, 300);
            }
        });
    });

    // Add Project button
    document.querySelector('.add-project-btn').addEventListener('click', () => {
        showModal(projectModal);
    });

    // Add Skill buttons
    document.querySelectorAll('.add-skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            editingSkillElement = null;
            skillForm.reset();
            skillLevelDisplay.textContent = '50%';
            showModal('skill');
        });
    });

    // Add global event listener for project deletion
    document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-project');
        if (deleteBtn) {
            const projectCard = deleteBtn.closest('.project-card');
            if (projectCard && confirm('Are you sure you want to delete this project?')) {
                projectCard.style.opacity = '0';
                projectCard.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    projectCard.remove();
                    AOS.refresh();
                }, 300);
            }
        }
    });
});

