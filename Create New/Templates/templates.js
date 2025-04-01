// Document Ready Function
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupEventListeners();
});

// Initialize the Editor
function initializeEditor() {
    // Set up contenteditable elements
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.addEventListener('focus', function() {
            // Store the original content when focusing
            this.dataset.originalContent = this.innerHTML;
        });
        
        element.addEventListener('blur', function() {
            // If empty, restore placeholder
            if (this.innerHTML.trim() === '' && this.dataset.placeholder) {
                this.innerHTML = '';
            }
        });
    });
    
    // Enable profile photo upload
    const photoUpload = document.getElementById('photoUpload');
    const profileImage = document.getElementById('profileImage');
    
    if (photoUpload && profileImage) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    // Initialize formatting toolbar buttons
    document.querySelectorAll('.toolbar-btn[data-command]').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            
            if (command === 'undo' || command === 'redo') {
                document.execCommand(command, false, null);
            } else {
                document.execCommand(command, false, null);
            }
        });
    });
    
    // Initialize font selector
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        fontSelector.addEventListener('change', function() {
            document.execCommand('fontName', false, this.value);
        });
    }
    
    // Initialize font size selector
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    if (fontSizeSelector) {
        fontSizeSelector.addEventListener('change', function() {
            document.execCommand('fontSize', false, this.value);
        });
    }
    
    // Load saved data if exists
    loadResumeData();
}

// Set up all event listeners
function setupEventListeners() {
    // Back button
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Ask for confirmation if changes were made
            if (checkForChanges()) {
                if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                    window.location.href = '../Resume/createnewresume.html';
                }
            } else {
                window.location.href = '../Resume/createnewresume.html';
            }
        });
    }
    
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveResumeData();
            alert('Resume saved successfully!');
        });
    }
    
    // Download PDF button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            preparePDFDownload();
        });
    }
    
    // Add experience button
    const addExperienceBtn = document.querySelector('.add-experience-btn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', function() {
            addExperienceItem();
        });
    }
    
    // Add education button
    const addEducationBtn = document.querySelector('.add-education-btn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', function() {
            addEducationItem();
        });
    }
    
    // Add skill button
    const addSkillBtn = document.querySelector('.add-skill-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            addSkillItem();
        });
    }
    
    // Add section button
    const addSectionBtn = document.querySelector('.add-section-btn');
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', function() {
            showSectionModal();
        });
    }
    
    // Add list item buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-list-item-btn')) {
            const button = e.target.closest('.add-list-item-btn');
            const targetListClass = button.getAttribute('data-target');
            const parentItem = button.closest('.experience-item');
            if (parentItem && targetListClass) {
                const list = parentItem.querySelector('.' + targetListClass);
                if (list) {
                    addListItem(list);
                }
            }
        }
    });
    
    // Close modal
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            hideSectionModal();
        });
    }
    
    // Section options
    document.querySelectorAll('.section-option').forEach(option => {
        option.addEventListener('click', function() {
            const sectionType = this.getAttribute('data-section');
            addNewSection(sectionType);
            hideSectionModal();
        });
    });
    
    // Window click to close modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('sectionModal');
        if (modal && event.target === modal) {
            hideSectionModal();
        }
    });
    
    // Auto-save changes periodically
    setInterval(saveResumeData, 30000); // Auto-save every 30 seconds
}

// Check for unsaved changes
function checkForChanges() {
    // Implementation would compare current state with last saved state
    // For simplicity, we're returning true (indicating changes exist)
    return true;
}

// Save resume data to localStorage
function saveResumeData() {
    const resumeTemplate = document.getElementById('resumeTemplate');
    if (!resumeTemplate) return;
    
    const resumeData = {
        content: resumeTemplate.innerHTML,
        templateType: resumeTemplate.className,
        lastSaved: new Date().toISOString()
    };
    
    // Get profile image if exists
    const profileImage = document.getElementById('profileImage');
    if (profileImage && profileImage.src) {
        resumeData.profileImage = profileImage.src;
    }
    
    // Save to localStorage
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Load resume data from localStorage
function loadResumeData() {
    const savedData = localStorage.getItem('resumeData');
    if (!savedData) return;
    
    try {
        const resumeData = JSON.parse(savedData);
        const resumeTemplate = document.getElementById('resumeTemplate');
        
        if (resumeTemplate && resumeData.content) {
            resumeTemplate.innerHTML = resumeData.content;
        }
        
        // Load profile image if exists
        if (resumeData.profileImage) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = resumeData.profileImage;
            }
        }
        
        // Re-initialize event listeners for dynamically added content
        reattachEventListeners();
    } catch (error) {
        console.error('Error loading resume data:', error);
    }
}

// Reattach event listeners to dynamically added content
function reattachEventListeners() {
    // Add event listeners to all contenteditable elements
    document.querySelectorAll('[contenteditable="true"]').forEach(element => {
        element.addEventListener('focus', function() {
            this.dataset.originalContent = this.innerHTML;
        });
        
        element.addEventListener('blur', function() {
            // If empty, restore placeholder
            if (this.innerHTML.trim() === '' && this.dataset.placeholder) {
                this.innerHTML = '';
            }
        });
    });
    
    // Re-attach profile photo upload event listener
    const photoUpload = document.getElementById('photoUpload');
    const profileImage = document.getElementById('profileImage');
    
    if (photoUpload && profileImage) {
        // Remove any existing event listeners to prevent duplicates
        photoUpload.removeEventListener('change', handlePhotoUpload);
        
        // Add the event listener again
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    // Re-attach event listeners for add buttons
    document.querySelectorAll('.add-experience-btn').forEach(btn => {
        btn.addEventListener('click', addExperienceItem);
    });
    
    document.querySelectorAll('.add-education-btn').forEach(btn => {
        btn.addEventListener('click', addEducationItem);
    });
    
    document.querySelectorAll('.add-skill-btn').forEach(btn => {
        btn.addEventListener('click', addSkillItem);
    });
    
    document.querySelectorAll('.add-list-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const list = this.closest('.list-container').querySelector('ul');
            addListItem(list);
        });
    });
}

// Handle photo upload - extracted to a separate function so it can be reused
function handlePhotoUpload(event) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        const profileImage = document.getElementById('profileImage');
        
        reader.onload = function(e) {
            profileImage.src = e.target.result;
            // Auto save after image change
            saveResumeData();
        };
        
        reader.readAsDataURL(event.target.files[0]);
    }
}

// Prepare PDF download
function preparePDFDownload() {
    // Hide buttons and other non-printable elements
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.style.display = 'none';
    });
    
    // Remove contenteditable and other editing attributes
    document.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });
    
    setTimeout(() => {
        window.print();
        
        // Restore buttons and editing attributes
        allButtons.forEach(button => {
            button.style.display = '';
        });
        
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
    }, 500);
}

// Add new experience item
function addExperienceItem() {
    const experienceContainer = document.getElementById('experienceContainer');
    if (!experienceContainer) return;
    
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item';
    newExperience.innerHTML = `
        <div class="experience-header">
            <h4 contenteditable="true" data-placeholder="Job Title">New Position</h4>
            <div class="experience-company-date">
                <span contenteditable="true" data-placeholder="Company Name">Company Name</span>
                <span class="date-range">
                    <span contenteditable="true" data-placeholder="Start Date">Start Date</span> - 
                    <span contenteditable="true" data-placeholder="End Date">End Date</span>
                </span>
            </div>
        </div>
        <ul class="responsibilities-list">
            <li contenteditable="true">Responsibility description</li>
        </ul>
        <button class="add-list-item-btn" data-target="responsibilities-list"><i class="fas fa-plus"></i> Add point</button>
    `;
    
    experienceContainer.appendChild(newExperience);
    reattachEventListeners();
}

// Add new education item
function addEducationItem() {
    const educationContainer = document.getElementById('educationContainer');
    if (!educationContainer) return;
    
    const newEducation = document.createElement('div');
    newEducation.className = 'education-item';
    newEducation.innerHTML = `
        <div class="education-header">
            <h4 contenteditable="true" data-placeholder="Degree">Degree / Certification</h4>
            <div class="education-institution-date">
                <span contenteditable="true" data-placeholder="Institution">Institution Name</span>
                <span class="date-range">
                    <span contenteditable="true" data-placeholder="Start Date">Start Year</span> - 
                    <span contenteditable="true" data-placeholder="End Date">End Year</span>
                </span>
            </div>
        </div>
        <p contenteditable="true" data-placeholder="Additional details">Additional details about your education</p>
    `;
    
    educationContainer.appendChild(newEducation);
    reattachEventListeners();
}

// Add new skill item
function addSkillItem() {
    const skillsContainer = document.querySelector('.skills-container');
    if (!skillsContainer) return;
    
    const newSkill = document.createElement('div');
    newSkill.className = 'skill-tag';
    newSkill.setAttribute('contenteditable', 'true');
    newSkill.textContent = 'New Skill';
    
    skillsContainer.appendChild(newSkill);
    
    // Focus on the new skill for immediate editing
    setTimeout(() => {
        newSkill.focus();
        document.execCommand('selectAll', false, null);
    }, 0);
}

// Add new list item
function addListItem(list) {
    if (!list) return;
    
    const newItem = document.createElement('li');
    newItem.setAttribute('contenteditable', 'true');
    newItem.textContent = 'New list item';
    
    list.appendChild(newItem);
    
    // Focus on the new item for immediate editing
    setTimeout(() => {
        newItem.focus();
        document.execCommand('selectAll', false, null);
    }, 0);
}

// Show section modal
function showSectionModal() {
    const modal = document.getElementById('sectionModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Hide section modal
function hideSectionModal() {
    const modal = document.getElementById('sectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add new section based on type
function addNewSection(sectionType) {
    const resumeTemplate = document.getElementById('resumeTemplate');
    if (!resumeTemplate) return;
    
    // Find the last section to insert after
    const sections = document.querySelectorAll('.resume-section');
    const lastSection = sections[sections.length - 1];
    
    if (!lastSection) return;
    
    // Create new section
    const newSection = document.createElement('div');
    newSection.className = 'resume-section editable';
    newSection.setAttribute('data-field', sectionType);
    
    let sectionTitle = '';
    let sectionContent = '';
    
    // Configure section based on type
    switch(sectionType) {
        case 'projects':
            sectionTitle = 'Projects';
            sectionContent = `
                <div class="project-item">
                    <div class="project-header">
                        <h4 contenteditable="true" data-placeholder="Project Name">Project Name</h4>
                        <span contenteditable="true" data-placeholder="Project Date">Date / Duration</span>
                    </div>
                    <p contenteditable="true" data-placeholder="Project Description">Description of the project and your role in it.</p>
                </div>
                <button class="add-project-btn"><i class="fas fa-plus"></i> Add Project</button>
            `;
            break;
        
        case 'certifications':
            sectionTitle = 'Certifications';
            sectionContent = `
                <div class="certification-item">
                    <h4 contenteditable="true" data-placeholder="Certification Name">Certification Name</h4>
                    <div class="certification-details">
                        <span contenteditable="true" data-placeholder="Issuing Organization">Issuing Organization</span>
                        <span contenteditable="true" data-placeholder="Date">Issue Date</span>
                    </div>
                </div>
                <button class="add-certification-btn"><i class="fas fa-plus"></i> Add Certification</button>
            `;
            break;
        
        case 'languages':
            sectionTitle = 'Languages';
            sectionContent = `
                <div class="language-item">
                    <span contenteditable="true" data-placeholder="Language">English</span>
                    <span contenteditable="true" data-placeholder="Proficiency">Native</span>
                </div>
                <div class="language-item">
                    <span contenteditable="true" data-placeholder="Language">Spanish</span>
                    <span contenteditable="true" data-placeholder="Proficiency">Intermediate</span>
                </div>
                <button class="add-language-btn"><i class="fas fa-plus"></i> Add Language</button>
            `;
            break;
        
        case 'references':
            sectionTitle = 'References';
            sectionContent = `
                <div class="reference-item">
                    <h4 contenteditable="true" data-placeholder="Reference Name">Reference Name</h4>
                    <div contenteditable="true" data-placeholder="Position & Company">Position, Company</div>
                    <div contenteditable="true" data-placeholder="Contact Info">contact@example.com | (123) 456-7890</div>
                </div>
                <button class="add-reference-btn"><i class="fas fa-plus"></i> Add Reference</button>
            `;
            break;
        
        case 'interests':
            sectionTitle = 'Interests';
            sectionContent = `
                <div class="interests-container">
                    <div class="interest-tag" contenteditable="true">Reading</div>
                    <div class="interest-tag" contenteditable="true">Photography</div>
                    <div class="interest-tag" contenteditable="true">Travel</div>
                    <div class="interest-tag" contenteditable="true">Cooking</div>
                </div>
                <button class="add-interest-btn"><i class="fas fa-plus"></i> Add Interest</button>
            `;
            break;
        
        case 'custom':
            sectionTitle = 'Custom Section';
            sectionContent = `
                <p contenteditable="true" data-placeholder="Add your content here">Add your content here</p>
            `;
            break;
    }
    
    // Set section HTML
    newSection.innerHTML = `
        <h3 contenteditable="true">${sectionTitle}</h3>
        <div class="section-content">
            ${sectionContent}
        </div>
    `;
    
    // Insert after the last section but before add-section-container
    const addSectionContainer = document.querySelector('.add-section-container');
    resumeTemplate.insertBefore(newSection, addSectionContainer);
    
    // Reattach event listeners
    reattachEventListeners();
    
    // Set up additional event listeners for specific section types
    setupSectionSpecificHandlers(sectionType);
}

// Set up section-specific event handlers
function setupSectionSpecificHandlers(sectionType) {
    switch(sectionType) {
        case 'projects':
            const addProjectBtn = document.querySelector('.add-project-btn');
            if (addProjectBtn) {
                addProjectBtn.addEventListener('click', function() {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    projectItem.innerHTML = `
                        <div class="project-header">
                            <h4 contenteditable="true" data-placeholder="Project Name">Project Name</h4>
                            <span contenteditable="true" data-placeholder="Project Date">Date / Duration</span>
                        </div>
                        <p contenteditable="true" data-placeholder="Project Description">Description of the project and your role in it.</p>
                    `;
                    
                    this.parentNode.insertBefore(projectItem, this);
                });
            }
            break;
            
        case 'certifications':
            const addCertBtn = document.querySelector('.add-certification-btn');
            if (addCertBtn) {
                addCertBtn.addEventListener('click', function() {
                    const certItem = document.createElement('div');
                    certItem.className = 'certification-item';
                    certItem.innerHTML = `
                        <h4 contenteditable="true" data-placeholder="Certification Name">Certification Name</h4>
                        <div class="certification-details">
                            <span contenteditable="true" data-placeholder="Issuing Organization">Issuing Organization</span>
                            <span contenteditable="true" data-placeholder="Date">Issue Date</span>
                        </div>
                    `;
                    
                    this.parentNode.insertBefore(certItem, this);
                });
            }
            break;
            
        case 'languages':
            const addLangBtn = document.querySelector('.add-language-btn');
            if (addLangBtn) {
                addLangBtn.addEventListener('click', function() {
                    const langItem = document.createElement('div');
                    langItem.className = 'language-item';
                    langItem.innerHTML = `
                        <span contenteditable="true" data-placeholder="Language">Language</span>
                        <span contenteditable="true" data-placeholder="Proficiency">Proficiency</span>
                    `;
                    
                    this.parentNode.insertBefore(langItem, this);
                });
            }
            break;
            
        case 'references':
            const addRefBtn = document.querySelector('.add-reference-btn');
            if (addRefBtn) {
                addRefBtn.addEventListener('click', function() {
                    const refItem = document.createElement('div');
                    refItem.className = 'reference-item';
                    refItem.innerHTML = `
                        <h4 contenteditable="true" data-placeholder="Reference Name">Reference Name</h4>
                        <div contenteditable="true" data-placeholder="Position & Company">Position, Company</div>
                        <div contenteditable="true" data-placeholder="Contact Info">contact@example.com | (123) 456-7890</div>
                    `;
                    
                    this.parentNode.insertBefore(refItem, this);
                });
            }
            break;
            
        case 'interests':
            const addInterestBtn = document.querySelector('.add-interest-btn');
            if (addInterestBtn) {
                addInterestBtn.addEventListener('click', function() {
                    const interestTag = document.createElement('div');
                    interestTag.className = 'interest-tag';
                    interestTag.setAttribute('contenteditable', 'true');
                    interestTag.textContent = 'New Interest';
                    
                    const container = this.parentNode.querySelector('.interests-container');
                    if (container) {
                        container.appendChild(interestTag);
                        
                        // Focus on the new interest for immediate editing
                        setTimeout(() => {
                            interestTag.focus();
                            document.execCommand('selectAll', false, null);
                        }, 0);
                    }
                });
            }
            break;
    }
}
