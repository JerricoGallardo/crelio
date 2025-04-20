

document.addEventListener('DOMContentLoaded', function() {
    // Get all edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    
    // Add click event listener to each edit button
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.profile-section');
            const details = section.querySelector('.profile-details');
            
            // Toggle edit mode
            if (details.classList.contains('editing')) {
                // Save changes and exit edit mode
                saveChanges(details);
                details.classList.remove('editing');
                this.innerHTML = '<i class="fas fa-edit"></i> Edit';
            } else {
                // Enter edit mode
                enterEditMode(details);
                details.classList.add('editing');
                this.innerHTML = '<i class="fas fa-save"></i> Save';
            }
        });
    });
    
    // Function to enter edit mode
    function enterEditMode(details) {
        // Make all text content editable
        details.querySelectorAll('p').forEach(p => {
            p.contentEditable = true;
            p.classList.add('editable');
            if (p.textContent.trim() === "Not set") {
                p.textContent = "";
            }
        });
        
        // Make skill tags editable
        const skillsContainer = details.querySelector('.skills-container');
        if (skillsContainer) {
            // Make existing skill tags editable
            const skillTags = skillsContainer.querySelectorAll('.skill-tag');
            skillTags.forEach(tag => {
                tag.contentEditable = true;
                tag.classList.add('editable');
                
                // Create wrapper for the skill tag content
                const contentWrapper = document.createElement('div');
                contentWrapper.style.display = 'inline-flex';
                contentWrapper.style.alignItems = 'center';
                contentWrapper.style.position = 'relative';
                
                // Move the text content to the wrapper
                const text = tag.textContent.replace('×', '').trim();
                contentWrapper.textContent = text;
                tag.textContent = '';
                
                tag.appendChild(contentWrapper);
                
                // Make the content wrapper editable instead of the entire tag
                contentWrapper.contentEditable = true;
                tag.contentEditable = false;
                
                // Add delete button (red circle)
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.style.position = 'absolute';
                deleteBtn.style.top = '-8px';
                deleteBtn.style.right = '-8px';
                deleteBtn.style.width = '16px';
                deleteBtn.style.height = '16px';
                deleteBtn.style.backgroundColor = '#dc3545';
                deleteBtn.style.color = 'white';
                deleteBtn.style.borderRadius = '50%';
                deleteBtn.style.display = 'flex';
                deleteBtn.style.alignItems = 'center';
                deleteBtn.style.justifyContent = 'center';
                deleteBtn.style.fontSize = '12px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.style.border = 'none';
                deleteBtn.style.padding = '0';
                deleteBtn.style.lineHeight = '1';
                deleteBtn.style.opacity = '0';
                deleteBtn.style.transition = 'opacity 0.3s ease';
                
                // Add hover effect to show delete button
                tag.addEventListener('mouseenter', () => {
                    deleteBtn.style.opacity = '1';
                });
                
                tag.addEventListener('mouseleave', () => {
                    deleteBtn.style.opacity = '0';
                });
                
                // Add click handler for delete button
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    tag.remove();
                });
                
                tag.appendChild(deleteBtn);
                
                // Handle key events for editing
                contentWrapper.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addNewSkill(skillsContainer, tag);
                    } else if ((e.key === 'Backspace' || e.key === 'Delete') && this.textContent.trim() === '') {
                        e.preventDefault();
                        tag.remove();
                        return;
                    }
                });

                // Handle paste events
                contentWrapper.addEventListener('paste', function(e) {
                            e.preventDefault();
                    const text = e.clipboardData.getData('text/plain');
                    document.execCommand('insertText', false, text);
                });

                // Handle input
                contentWrapper.addEventListener('input', function(e) {
                    if (this.textContent.trim() === '') {
                        this.textContent = '';
                    }
                });
            });
            
            // Add a button to add new skills
            const addSkillBtn = document.createElement('button');
            addSkillBtn.className = 'add-skill-btn';
            addSkillBtn.innerHTML = '<i class="fas fa-plus"></i> Add Skill';
            addSkillBtn.onclick = function() {
                addNewSkill(skillsContainer);
            };
            skillsContainer.appendChild(addSkillBtn);
        }
    }
    
    // Function to add a new skill
    function addNewSkill(container, insertAfter = null) {
                const newSkill = document.createElement('span');
                newSkill.className = 'skill-tag editable';
        
        // Create wrapper for the skill tag content
        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'inline-flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.position = 'relative';
        contentWrapper.textContent = 'New Skill';
        
        newSkill.appendChild(contentWrapper);
        
        // Make the content wrapper editable instead of the entire tag
        contentWrapper.contentEditable = true;
        newSkill.contentEditable = false;
        
        // Add delete button (red circle)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '×';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '-8px';
        deleteBtn.style.right = '-8px';
        deleteBtn.style.width = '16px';
        deleteBtn.style.height = '16px';
        deleteBtn.style.backgroundColor = '#dc3545';
        deleteBtn.style.color = 'white';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.display = 'flex';
        deleteBtn.style.alignItems = 'center';
        deleteBtn.style.justifyContent = 'center';
        deleteBtn.style.fontSize = '12px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '0';
        deleteBtn.style.lineHeight = '1';
        deleteBtn.style.opacity = '0';
        deleteBtn.style.transition = 'opacity 0.3s ease';
        
        // Add hover effect to show delete button
        newSkill.addEventListener('mouseenter', () => {
            deleteBtn.style.opacity = '1';
        });
        
        newSkill.addEventListener('mouseleave', () => {
            deleteBtn.style.opacity = '0';
        });
        
        // Add click handler for delete button
        deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    newSkill.remove();
        });
        
                newSkill.appendChild(deleteBtn);
                
        // Handle key events for editing
        contentWrapper.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                if (this.textContent.trim()) {
                    addNewSkill(container, newSkill);
                }
            } else if ((e.key === 'Backspace' || e.key === 'Delete') && this.textContent.trim() === '') {
                            e.preventDefault();
                            newSkill.remove();
                return;
            }
        });

        // Handle paste events to remove formatting
        contentWrapper.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });

        // Handle input to maintain minimum content
        contentWrapper.addEventListener('input', function(e) {
            if (this.textContent.trim() === '') {
                this.textContent = '';
            }
        });

        // Handle focus to select all text
        contentWrapper.addEventListener('focus', function(e) {
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });
        
        // Insert the new skill
        if (insertAfter) {
            container.insertBefore(newSkill, insertAfter.nextSibling);
        } else {
            // Insert before the add skill button
            const addSkillBtn = container.querySelector('.add-skill-btn');
            container.insertBefore(newSkill, addSkillBtn);
        }
        
        contentWrapper.focus();
    }
    
    // Add keyboard event listener for Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('editable')) {
            e.preventDefault();
            e.target.blur();
        }
    });

    loadUserProfile();

    const user = JSON.parse(localStorage.getItem("userAuth"));
    if (user?.name) {
        document.querySelectorAll('.user-name-placeholder').forEach(el => el.textContent = user.name);
    }
});

function saveChanges(details) {
    // Exit edit mode
    details.querySelectorAll('.skill-tag').forEach(tag => {
        const contentWrapper = tag.querySelector('div');
        const text = contentWrapper.textContent.trim();
        if (!text) {
            tag.remove();
            return;
        }
        const deleteBtn = tag.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.remove();
        contentWrapper.textContent = text;
    });

    details.querySelectorAll('.editable').forEach(element => {
        element.contentEditable = false;
        element.classList.remove('editable');
    });

    const addSkillBtn = details.querySelector('.add-skill-btn');
    if (addSkillBtn) addSkillBtn.remove();

    // ✅ Get values after changes
    const name = document.querySelector('[data-field="name"]')?.textContent.trim();
    const email = JSON.parse(localStorage.getItem("userAuth"))?.email;
    const phone = document.querySelector('[data-field="phone"]')?.textContent.trim() || "";
    const location = document.querySelector('[data-field="location"]')?.textContent.trim() || "";
    const website = document.querySelector('[data-field="website"]')?.textContent.trim() || "";
    const summary = document.querySelector('.summary-text')?.textContent.trim() || "";
    const skills = Array.from(document.querySelectorAll('.skill-tag div')).map(el => el.textContent.trim());

    console.log({ phone, location, website, summary, skills }); // ✅ Debug

    // ✅ Frontend validation
    if (phone && phone !== "Not set" && !/^\d+$/.test(phone)) return alert("Phone must be numbers only");
    if (location.split(" ").length > 100) return alert("Location must be less than 100 words");
    if (!/^https?:\/\/\S+$/.test(website)) return alert("Invalid website URL");
    if (summary.split(" ").length > 3000) return alert("Summary too long");
    if (skills.some(skill => skill.split(" ").length > 10)) return alert("Each skill must be less than 10 words");

    // ✅ Send to backend
    const body = { name, email, phone, location, website, summary, skills };

    fetch("https://localhost:7258/api/auth/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Profile updated successfully!");
        } else {
            alert("Error saving profile.");
        }
    });
}

function loadUserProfile() {
    const email = JSON.parse(localStorage.getItem("userAuth"))?.email;
    if (!email) return;

    fetch(`https://localhost:7258/api/auth/profile/${email}`)
        .then(res => {
            if (!res.ok) throw new Error("Profile not found");
            return res.json();
        })
        .then(data => {
            if (!data) return;

            // Update fields
            document.querySelector('[data-field="phone"]').textContent = data.phone || "Not set";
            document.querySelector('[data-field="location"]').textContent = data.location || "Not set";
            document.querySelector('[data-field="website"]').textContent = data.website || "Not set";
            document.querySelector('.summary-text').textContent = data.summary || "Not set";

            // Update skills
            const skillsContainer = document.querySelector('.skills-container');
            skillsContainer.innerHTML = ''; // Clear old
            (data.skills || []).forEach(skill => {
                const span = document.createElement('span');
                span.className = 'skill-tag';
                span.textContent = skill;
                skillsContainer.appendChild(span);
            });

            // Set user name and email in header too
            document.querySelectorAll('.user-name-placeholder').forEach(el => el.textContent = data.name || "Not set");
            document.querySelectorAll('.user-email-placeholder').forEach(el => el.textContent = data.email || "Not set");
        })
        .catch(err => {
            console.error("Failed to load profile:", err);
        });
}

