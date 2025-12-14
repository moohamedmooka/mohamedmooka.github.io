// contact.js - Contact Form Functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateSendEmail(formData);
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log to console (for demo)
            console.log('Contact form submitted:', formData);
            
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Form field animations
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Add focus effects
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Add character counter for textarea
        if (field.tagName === 'TEXTAREA') {
            const charCounter = document.createElement('div');
            charCounter.className = 'char-counter';
            charCounter.style.cssText = `
                font-size: 0.8rem;
                color: var(--text-muted);
                text-align: right;
                margin-top: 0.5rem;
            `;
            
            field.parentElement.appendChild(charCounter);
            
            field.addEventListener('input', function() {
                const maxLength = 1000;
                const currentLength = this.value.length;
                charCounter.textContent = `${currentLength}/${maxLength} characters`;
                
                if (currentLength > maxLength * 0.9) {
                    charCounter.style.color = 'var(--warning)';
                } else {
                    charCounter.style.color = 'var(--text-muted)';
                }
            });
        }
    });
}

function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    // Reset previous errors
    clearErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, '
