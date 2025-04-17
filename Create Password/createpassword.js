document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createPasswordForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const createPasswordBtn = document.getElementById('createPasswordBtn');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const passwordHint = document.querySelector('.password-hint');
    
    // Password requirements
    const requirements = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*(),.?":{}|<>]/
    };
    
    // Toggle password visibility
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Validate password requirements
    function validatePassword(password) {
        if (!password) return true; // Don't show error when empty
        
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        // Count how many conditions are met
        const conditionsMet = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
        
        return minLength && conditionsMet >= 2;
    }
    
    // Check if passwords match
    function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const mismatchError = document.getElementById('passwordMismatch');
        
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                confirmPasswordInput.classList.add('error');
                mismatchError.classList.add('show');
                return false;
            } else {
                confirmPasswordInput.classList.remove('error');
                mismatchError.classList.remove('show');
                return true;
            }
        } else {
            confirmPasswordInput.classList.remove('error');
            mismatchError.classList.remove('show');
            return true;
        }
    }
    
    // Update button state
    function updateButtonState() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password && confirmPassword && validatePassword(password) && checkPasswordsMatch()) {
            createPasswordBtn.disabled = false;
        } else {
            createPasswordBtn.disabled = true;
        }
    }
    
    // Event listeners
    passwordInput.addEventListener('input', function() {
        updatePasswordValidation();
        updateConfirmPasswordValidation();
        updateButtonState();
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        updateConfirmPasswordValidation();
        updateButtonState();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!validatePassword(password)) {
            return;
        }
        
        if (password !== confirmPassword) {
            return;
        }
        
        // Here you would typically send the password to your backend
        // For now, we'll just show a success message
        alert('Password created successfully!');
        // Redirect to dashboard or login page
        window.location.href = '../Dashboard/dashboard.html';
    });
    
    // Initialize button state
    updateButtonState();

    function updatePasswordValidation() {
        const password = passwordInput.value;
        const isValid = validatePassword(password);
        const passwordGroup = passwordInput.closest('.input-group');
        
        if (!password) {
            // If password is empty, reset everything
            passwordHint.style.display = 'none';
            passwordGroup.classList.remove('error', 'valid');
            return;
        }
        
        if (isValid) {
            passwordHint.style.display = 'none';
            passwordGroup.classList.remove('error');
            passwordGroup.classList.add('valid');
        } else {
            passwordHint.style.display = 'block';
            passwordHint.style.color = 'var(--error)';
            passwordGroup.classList.add('error');
            passwordGroup.classList.remove('valid');
        }
    }

    function updateConfirmPasswordValidation() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const confirmPasswordGroup = confirmPasswordInput.closest('.input-group');
        
        if (!confirmPassword) {
            confirmPasswordGroup.classList.remove('error', 'valid');
            return;
        }
        
        if (password === confirmPassword) {
            confirmPasswordGroup.classList.remove('error');
            confirmPasswordGroup.classList.add('valid');
        } else {
            confirmPasswordGroup.classList.add('error');
            confirmPasswordGroup.classList.remove('valid');
        }
    }
}); 