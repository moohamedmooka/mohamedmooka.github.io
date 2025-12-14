// contact.js - Complete Contact Form with Validation

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormAnimations();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateContactForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtn = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual backend)
            await simulateSendEmail(formData);
            
            // Success
            showFormNotification(
                'Message sent successfully! I\'ll get back to you within 24 hours.',
                'success'
            );
            
            // Reset form
            contactForm.reset();
            resetFormValidation();
            
            // Log to console (for demo purposes)
            console.log('📧 Contact form submitted:', {
                ...formData,
                message: formData.message.substring(0, 50) + '...'
            });
            
            // Send to Google Forms or other backend (example)
            // await sendToGoogleForms(formData);
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            showFormNotification(
                'Failed to send message. Please try again or email me directly.',
                'error'
            );
            
        } finally {
            // Reset button
            submitBtn.innerHTML = originalBtn;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    setupRealTimeValidation();
}

function validateContactForm() {
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate subject
    const subject = document.getElementById('subject');
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    } else if (message.value.trim().length > 1000) {
        showError(message, 'Message must be less than 1000 characters');
        isValid = false;
    }
    
    return isValid;
}

function setupRealTimeValidation() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            clearError(this);
            
            // Special validation for email
            if (this.id === 'email' && this.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    showError(this, 'Please enter a valid email');
                }
            }
            
            // Character counter for message
            if (this.id === 'message') {
                updateCharacterCounter(this);
            }
        });
        
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                clearError(this);
            }
        });
    });
}

function updateCharacterCounter(textarea) {
    let counter = textarea.parentElement.querySelector('.char-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: right;
            margin-top: 0.5rem;
        `;
        textarea.parentElement.appendChild(counter);
    }
    
    const maxLength = 1000;
    const currentLength = textarea.value.length;
    counter.textContent = `${currentLength}/${maxLength} characters`;
    
    if (currentLength > maxLength * 0.9) {
        counter.style.color = 'var(--warning)';
    } else if (currentLength > maxLength) {
        counter.style.color = 'var(--danger)';
    } else {
        counter.style.color = 'var(--text-muted)';
    }
}

function showError(field, message) {
    clearError(field);
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = `
        color: var(--danger);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    // Add error icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    error.prepend(icon);
    
    field.parentElement.appendChild(error);
    field.classList.add('error');
}

function clearError(field) {
    const error = field.parentElement.querySelector('.field-error');
    if (error) error.remove();
    field.classList.remove('error');
}

function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

function resetFormValidation() {
    clearFormErrors();
    const charCounter = document.querySelector('.char-counter');
    if (charCounter) charCounter.remove();
}

async function simulateSendEmail(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success (in real app, this would be a fetch() to your backend)
    return new Promise((resolve, reject) => {
        // 95% success rate for simulation
        Math.random() > 0.05 ? resolve() : reject(new Error('Network error'));
    });
}

// Example: Send to Google Forms
async function sendToGoogleForms(formData) {
    const formURL = 'YOUR_GOOGLE_FORM_URL_HERE'; // Replace with your form URL
    
    const data = new FormData();
    data.append('entry.1234567890', formData.name); // Replace with your field IDs
    data.append('entry.0987654321', formData.email);
    data.append('entry.1122334455', formData.subject);
    data.append('entry.5566778899', formData.message);
    
    try {
        const response = await fetch(formURL, {
            method: 'POST',
            body: data,
            mode: 'no-cors'
        });
        
        return true;
    } catch (error) {
        console.error('Google Forms error:', error);
        throw error;
    }
}

function showFormNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${icons[type] || icons.info}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not present
    if (!document.querySelector('#form-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'form-notification-styles';
        styles.textContent = `
            .form-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--card-bg);
                border: 1px solid var(--card-border);
                border-left: 4px solid;
                border-radius: var(--border-radius);
                padding: var(--spacing-md);
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                min-width: 300px;
                max-width: 400px;
                z-index: 3000;
                animation: slideInUp 0.3s ease-out;
                box-shadow: var(--shadow-lg);
                backdrop-filter: blur(10px);
            }
            
            .form-notification.success {
                border-left-color: var(--success);
            }
            
            .form-notification.error {
                border-left-color: var(--danger);
            }
            
            .form-notification.info {
                border-left-color: var(--secondary);
            }
            
            .notification-icon {
                font-size: 1.5rem;
            }
            
            .form-notification.success .notification-icon {
                color: var(--success);
            }
            
            .form-notification.error .notification-icon {
                color: var(--danger);
            }
            
            .form-notification.info .notification-icon {
                color: var(--secondary);
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-content p {
                margin: 0;
                color: var(--text-primary);
                font-size: 0.9rem;
                line-height: 1.4;
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 0.9rem;
                padding: 0.25rem;
                border-radius: var(--border-radius-sm);
                transition: all var(--transition-base);
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-primary);
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });
}

function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Focus effects
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
}

// Add some extra validation CSS
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .form-group.focused label {
            color: var(--primary);
        }
        
        .form-group.focused input,
        .form-group.focused select,
        .form-group.focused textarea {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        
        .error {
            border-color: var(--danger) !important;
        }
        
        .error:focus {
            box-shadow: 0 0 0 3px rgba(var(--danger-rgb), 0.1) !important;
        }
    </style>
`);
