// Academic Portfolio JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

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
                // Close mobile menu after clicking
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Publication Modal and Form Handling
    const publicationModal = document.querySelector('.publication-modal');
    const addPublicationBtn = document.querySelector('.add-publication-btn');
    const publicationForm = document.querySelector('.publication-form');
    const publicationsList = document.querySelector('.publications-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Show publication modal
    if (addPublicationBtn) {
        addPublicationBtn.addEventListener('click', () => {
            showModal(publicationModal);
        });
    }

    // Close buttons for all modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            hideModal(modal);
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Handle publication form submission
    if (publicationForm) {
        publicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const type = document.getElementById('publication-type').value;
            const title = document.getElementById('publication-title').value;
            const authors = document.getElementById('publication-authors').value;
            const venue = document.getElementById('publication-venue').value;
            const year = document.getElementById('publication-year').value;
            const doi = document.getElementById('publication-doi').value;

            const publicationItem = document.createElement('div');
            publicationItem.className = 'publication-item fade-in';
            publicationItem.setAttribute('data-type', type);
            publicationItem.innerHTML = `
                <h3 contenteditable="true">${title}</h3>
                <div class="publication-meta" contenteditable="true">
                    ${authors}, ${venue}, ${year}
                </div>
                ${doi ? `<div class="publication-doi" contenteditable="true">DOI: ${doi}</div>` : ''}
                <button class="delete-btn" title="Delete Publication">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Add delete functionality
            const deleteBtn = publicationItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this publication?')) {
                    publicationItem.style.opacity = '0';
                    publicationItem.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        publicationItem.remove();
                    }, 300);
                }
            });

            publicationsList.appendChild(publicationItem);
            hideModal(publicationModal);
        });
    }

    // Publication Filtering
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                const publications = document.querySelectorAll('.publication-item');
                
                publications.forEach(pub => {
                    if (filter === 'all' || pub.dataset.type === filter) {
                        pub.style.display = 'block';
                        pub.classList.add('fade-in');
                        setTimeout(() => {
                            pub.classList.remove('fade-in');
                        }, 500);
                    } else {
                        pub.style.display = 'none';
                    }
                });
            });
        });
    }

    // Course Modal and Form Handling
    const courseModal = document.querySelector('.course-modal');
    const addCourseBtn = document.querySelector('.add-course-btn');
    const courseForm = document.querySelector('.course-form');
    const courseList = document.querySelector('.course-list');

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            showModal(courseModal);
        });
    }

    // Handle course form submission
    if (courseForm) {
        courseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const code = document.getElementById('course-code').value;
            const title = document.getElementById('course-title').value;
            const description = document.getElementById('course-description').value;

            const courseItem = document.createElement('div');
            courseItem.className = 'course-item fade-in';
            courseItem.innerHTML = `
                <h3 class="course-code" contenteditable="true">${code}</h3>
                <h4 contenteditable="true">${title}</h4>
                <p contenteditable="true">${description}</p>
                <button class="delete-btn" title="Delete Course">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // Add delete functionality
            const deleteBtn = courseItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this course?')) {
                    courseItem.style.opacity = '0';
                    courseItem.style.transform = 'translateX(20px)';
                    setTimeout(() => {
                        courseItem.remove();
                    }, 300);
                }
            });

            courseList.appendChild(courseItem);
            hideModal(courseModal);
        });
    }

    // Profile Photo Upload
    const profilePhoto = document.querySelector('.profile-photo');
    const photoInput = profilePhoto.querySelector('input[type="file"]');
    const profileImg = profilePhoto.querySelector('img');
    
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
                // Add animation class
                profileImg.classList.add('scale-in');
                setTimeout(() => profileImg.classList.remove('scale-in'), 500);
            };
            reader.readAsDataURL(file);
        }
    });

    // Enhanced Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Add stagger effect for multiple items
                if (entry.target.parentElement.classList.contains('publications-list') ||
                    entry.target.parentElement.classList.contains('course-list')) {
                    const items = entry.target.parentElement.children;
                    Array.from(items).forEach((item, index) => {
                        item.style.animationDelay = `${index * 0.1}s`;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.research-area, .publication-item, .timeline-item, .course-item').forEach(el => {
        observer.observe(el);
    });

    // Enhanced Modal Animations
    function showModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            modal.classList.add('show');
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }

    function hideModal(modal) {
        modal.classList.remove('show');
        modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            const form = modal.querySelector('form');
            if (form) form.reset();
        }, 300);
    }

    // Apply enhanced modal animations to existing modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => hideModal(modal));
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });

    // Enhanced Form Submissions with Loading Effects
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Add loading effect
            submitBtn.disabled = true;
            submitBtn.classList.add('shimmer');
            submitBtn.textContent = 'Saving...';

            // Simulate form processing
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('shimmer');
                submitBtn.textContent = originalText;
                
                // Handle the form submission based on form type
                if (this.classList.contains('publication-form')) {
                    handlePublicationSubmit(this);
                } else if (this.classList.contains('course-form')) {
                    handleCourseSubmit(this);
                }
            }, 800);
        });
    });

    // Smooth scroll with enhanced animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Highlight the section being scrolled to
                target.classList.add('highlight-section');
                setTimeout(() => target.classList.remove('highlight-section'), 1500);

                // Smooth scroll with easing
                const targetPosition = target.offsetTop;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                function ease(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                }

                requestAnimationFrame(animation);
            }
        });
    });

    // Add hover effect for research areas
    document.querySelectorAll('.research-area').forEach(area => {
        area.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });

        area.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // Save Portfolio
    window.savePortfolio = function() {
        const portfolioData = {
            name: document.querySelector('.nav-brand h1').textContent,
            title: document.querySelector('.hero-subtitle').textContent,
            description: document.querySelector('.hero-description').textContent,
            research: Array.from(document.querySelectorAll('.research-area')).map(area => ({
                title: area.querySelector('h3').textContent,
                description: area.querySelector('p').textContent
            })),
            publications: Array.from(document.querySelectorAll('.publication-item')).map(pub => ({
                title: pub.querySelector('h3').textContent,
                meta: pub.querySelector('.publication-meta').textContent,
                doi: pub.querySelector('.publication-doi')?.textContent
            })),
            education: Array.from(document.querySelectorAll('.timeline-item')).map(item => ({
                date: item.querySelector('.timeline-date').textContent,
                title: item.querySelector('h3').textContent,
                description: item.querySelector('p').textContent
            })),
            courses: Array.from(document.querySelectorAll('.course-item')).map(course => ({
                code: course.querySelector('.course-code').textContent,
                title: course.querySelector('h4').textContent,
                description: course.querySelector('p').textContent
            })),
            contact: Array.from(document.querySelectorAll('.contact-item')).map(item => ({
                icon: item.querySelector('i').className,
                text: item.querySelector('span').textContent
            }))
        };

        console.log('Portfolio Data:', portfolioData);
        alert('Portfolio saved successfully!');
    };

    // Preview Portfolio (placeholder)
    window.previewPortfolio = function() {
        alert('Preview functionality coming soon!');
    };

    // Initialize editable elements
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(element => {
        // Set initial placeholder based on data attribute or element type
        const placeholder = element.getAttribute('data-placeholder') || getDefaultPlaceholder(element);
        if (!element.textContent.trim()) {
            element.textContent = placeholder;
            element.classList.add('placeholder');
        }

        // Focus event
        element.addEventListener('focus', function() {
            if (this.classList.contains('placeholder')) {
                this.textContent = '';
                this.classList.remove('placeholder');
            }
            this.classList.add('editing');
        });

        // Blur event
        element.addEventListener('blur', function() {
            this.classList.remove('editing');
            if (!this.textContent.trim()) {
                this.textContent = placeholder;
                this.classList.add('placeholder');
            }
        });

        // Paste event - strip formatting
        element.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.originalEvent || e).clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });

        // Prevent default enter behavior unless shift is held
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.blur();
            }
        });
    });

    // Get default placeholder based on element context
    function getDefaultPlaceholder(element) {
        const role = element.getAttribute('data-role') || '';
        const placeholders = {
            'name': 'Your Name',
            'title': 'Your Academic Title',
            'department': 'Your Department',
            'university': 'Your University',
            'email': 'your.email@university.edu',
            'phone': '+1 (123) 456-7890',
            'address': 'University Address',
            'research-interest': 'Research Interest',
            'publication-title': 'Publication Title',
            'publication-authors': 'Authors',
            'publication-venue': 'Conference/Journal',
            'publication-year': 'Year',
            'course-title': 'Course Title',
            'course-description': 'Course Description',
            'bio': 'Write a brief biography...',
            'default': 'Click to edit'
        };
        return placeholders[role] || placeholders.default;
    }

    // Text formatting functions
    function formatText(command, value = null) {
        document.execCommand(command, false, value);
        const activeElement = document.activeElement;
        if (activeElement && activeElement.hasAttribute('contenteditable')) {
            activeElement.focus();
        }
    }

    // Toolbar button click handlers
    document.querySelectorAll('.toolbar-btn').forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            const value = this.getAttribute('data-value');
            
            if (command === 'fontName' || command === 'fontSize') {
                formatText(command, value);
            } else {
                formatText(command);
                this.classList.toggle('active');
            }
        });
    });

    // Function to initialize editable content
    function initializeEditableContent() {
        const editableElements = document.querySelectorAll('[contenteditable="true"]');
        
        editableElements.forEach(element => {
            // Set initial placeholder based on data attribute or element type
            const placeholder = element.getAttribute('data-placeholder') || getDefaultPlaceholder(element);
            if (!element.textContent.trim()) {
                element.textContent = placeholder;
                element.classList.add('placeholder');
            }

            // Remove existing event listeners
            element.removeEventListener('focus', handleFocus);
            element.removeEventListener('blur', handleBlur);
            element.removeEventListener('paste', handlePaste);
            element.removeEventListener('keydown', handleKeydown);

            // Add event listeners
            element.addEventListener('focus', handleFocus);
            element.addEventListener('blur', handleBlur);
            element.addEventListener('paste', handlePaste);
            element.addEventListener('keydown', handleKeydown);
        });
    }

    // Event handler functions
    function handleFocus() {
        if (this.classList.contains('placeholder')) {
            this.textContent = '';
            this.classList.remove('placeholder');
        }
        this.classList.add('editing');
    }

    function handleBlur() {
        this.classList.remove('editing');
        if (!this.textContent.trim()) {
            this.textContent = getDefaultPlaceholder(this);
            this.classList.add('placeholder');
        }
    }

    function handlePaste(e) {
        e.preventDefault();
        const text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }

    function handleKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.blur();
        }
    }

    // Education Modal and Form Handling
    const educationModal = document.querySelector('.education-modal');
    const addEducationBtn = document.querySelector('.add-education-btn');
    const educationForm = document.querySelector('.education-form');
    const educationTimeline = document.querySelector('.education-timeline');

    // Show education modal
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            showModal(educationModal);
        });
    }

    // Handle education form submission
    if (educationForm) {
        educationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const dates = document.getElementById('education-dates').value;
            const degree = document.getElementById('education-degree').value;
            const details = document.getElementById('education-details').value;

            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item fade-in';
            timelineItem.innerHTML = `
                <div class="timeline-date" contenteditable="true">${dates}</div>
                <div class="timeline-content">
                    <h3 contenteditable="true">${degree}</h3>
                    <p contenteditable="true">${details}</p>
                    <button class="delete-btn" title="Delete Education">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add delete functionality
            const deleteBtn = timelineItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this education entry?')) {
                    timelineItem.style.opacity = '0';
                    timelineItem.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        timelineItem.remove();
                    }, 300);
                }
            });

            // Add to the beginning of the timeline
            if (educationTimeline.firstChild) {
                educationTimeline.insertBefore(timelineItem, educationTimeline.firstChild);
            } else {
                educationTimeline.appendChild(timelineItem);
            }

            hideModal(educationModal);
        });
    }
});

// Add this CSS to handle placeholders
const style = document.createElement('style');
style.textContent = `
    [contenteditable].placeholder {
        color: #aaa;
        font-style: italic;
    }
    [contenteditable].editing {
        min-width: 1em;
        outline: none;
        border-radius: 4px;
    }
    [contenteditable].placeholder:focus {
        color: inherit;
        font-style: normal;
    }
`;
document.head.appendChild(style); 