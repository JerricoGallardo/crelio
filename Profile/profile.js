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
        });
        
        // Make skill tags editable
        const skillsContainer = details.querySelector('.skills-container');
        if (skillsContainer) {
            // Make existing skill tags editable
            const skillTags = skillsContainer.querySelectorAll('.skill-tag');
            skillTags.forEach(tag => {
                tag.contentEditable = true;
                tag.classList.add('editable');
                
                // Add delete button
                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'delete-skill';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    tag.remove();
                };
                tag.appendChild(deleteBtn);
                
                // Add click handler to add new skills
                tag.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkill = document.createElement('span');
                        newSkill.className = 'skill-tag editable';
                        newSkill.contentEditable = true;
                        newSkill.textContent = 'New Skill';
                        
                        // Add delete button to new skill
                        const newDeleteBtn = document.createElement('span');
                        newDeleteBtn.className = 'delete-skill';
                        newDeleteBtn.innerHTML = '×';
                        newDeleteBtn.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            newSkill.remove();
                        };
                        newSkill.appendChild(newDeleteBtn);
                        
                        skillsContainer.insertBefore(newSkill, tag.nextSibling);
                        newSkill.focus();
                        
                        // Add the same event listener to the new skill
                        newSkill.addEventListener('keydown', arguments.callee);
                    }
                });
            });
            
            // Add a button to add new skills
            const addSkillBtn = document.createElement('button');
            addSkillBtn.className = 'add-skill-btn';
            addSkillBtn.innerHTML = '<i class="fas fa-plus"></i> Add Skill';
            addSkillBtn.onclick = function() {
                const newSkill = document.createElement('span');
                newSkill.className = 'skill-tag editable';
                newSkill.contentEditable = true;
                newSkill.textContent = 'New Skill';
                
                // Add delete button to new skill
                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'delete-skill';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    newSkill.remove();
                };
                newSkill.appendChild(deleteBtn);
                
                skillsContainer.appendChild(newSkill);
                newSkill.focus();
                
                // Add event listener to the new skill
                newSkill.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const newSkill = document.createElement('span');
                        newSkill.className = 'skill-tag editable';
                        newSkill.contentEditable = true;
                        newSkill.textContent = 'New Skill';
                        
                        // Add delete button to new skill
                        const newDeleteBtn = document.createElement('span');
                        newDeleteBtn.className = 'delete-skill';
                        newDeleteBtn.innerHTML = '×';
                        newDeleteBtn.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            newSkill.remove();
                        };
                        newSkill.appendChild(newDeleteBtn);
                        
                        skillsContainer.insertBefore(newSkill, this.nextSibling);
                        newSkill.focus();
                        
                        // Add the same event listener to the new skill
                        newSkill.addEventListener('keydown', arguments.callee);
                    }
                });
            };
            skillsContainer.appendChild(addSkillBtn);
        }
    }
    
    // Function to save changes
    function saveChanges(details) {
        // Remove editable attribute from all elements
        details.querySelectorAll('.editable').forEach(element => {
            element.contentEditable = false;
            element.classList.remove('editable');
            
            // Remove delete buttons
            const deleteBtn = element.querySelector('.delete-skill');
            if (deleteBtn) {
                deleteBtn.remove();
            }
        });
        
        // Remove the add skill button if it exists
        const addSkillBtn = details.querySelector('.add-skill-btn');
        if (addSkillBtn) {
            addSkillBtn.remove();
        }
        
        // Here you would typically save the changes to a backend
        // For now, we'll just log the changes
        console.log('Changes saved:', details.textContent);
    }
    
    // Add keyboard event listener for Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.classList.contains('editable')) {
            e.preventDefault();
            e.target.blur();
        }
    });
}); 