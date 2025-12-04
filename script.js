// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function sanitizeInput(input) {
    if (!input) return '';
    return input.trim().replace(/[<>]/g, '');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function formatDate() {
    return new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality once DOM is ready
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling with improved validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Real-time validation feedback
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Remove error styling on input
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                    const errorMsg = this.parentNode.querySelector('.field-error');
                    if (errorMsg) errorMsg.remove();
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                showMessage('Email service is not available. Please refresh the page and try again.', 'error');
                return;
            }
            
            // Get and sanitize form data
            const formData = new FormData(this);
            const name = sanitizeInput(formData.get('name'));
            const email = sanitizeInput(formData.get('email'));
            const phone = sanitizeInput(formData.get('phone'));
            const message = sanitizeInput(formData.get('message'));
            
            // Validate all fields
            let isValid = true;
            
            // Name validation
            if (!name || name.length < 2) {
                showFieldError('name', 'Please enter your full name (at least 2 characters).');
                isValid = false;
            }
            
            // Email validation
            if (!email) {
                showFieldError('email', 'Please enter your email address.');
                isValid = false;
            } else if (!validateEmail(email)) {
                showFieldError('email', 'Please enter a valid email address.');
                isValid = false;
            }
            
            // Phone validation (optional but validate if provided)
            if (phone && !validatePhone(phone)) {
                showFieldError('phone', 'Please enter a valid phone number.');
                isValid = false;
            }
            
            // Message validation
            if (!message || message.length < 10) {
                showFieldError('message', 'Please enter a message (at least 10 characters).');
                isValid = false;
            }
            
            if (!isValid) {
                showMessage('Please correct the errors in the form.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            if (!submitBtn) {
                showMessage('Form submission error. Please try again.', 'error');
                return;
            }
            
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS with improved deliverability
            emailjs.send('service_ft1k7mu', 'template_b3ti17b', {
                to_name: 'DEVSPARK Team',
                to_email: 'teamdevsparks@devsparks.store',
                from_name: name,
                from_email: email,
                reply_to: email,
                phone: phone || 'Not provided',
                message: message,
                subject: `New Contact Form Inquiry from ${name}`,
                website_name: 'DEVSPARK',
                date: formatDate()
            })
            .then(function(response) {
                console.log('Email sent successfully:', response.status, response.text);
                showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                // Remove any field errors
                contactForm.querySelectorAll('.field-error').forEach(err => err.remove());
                contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            }, function(error) {
                console.error('EmailJS Error:', error);
                let errorMessage = 'Sorry, there was an error sending your message. ';
                if (error.status === 0) {
                    errorMessage += 'Please check your internet connection and try again.';
                } else if (error.status === 400) {
                    errorMessage += 'Please check that all fields are filled correctly.';
                } else {
                    errorMessage += 'Please try again later or contact us directly.';
                }
                showMessage(errorMessage, 'error');
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

    // Add scroll effect to header with throttling for performance
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = throttle(function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(102, 126, 234, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                header.style.backdropFilter = 'none';
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item');
    if (animatedElements.length > 0) {
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
});

// Show message function (defined outside DOMContentLoaded so it's accessible)
function showMessage(text, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.setAttribute('role', 'alert');
    messageDiv.setAttribute('aria-live', 'polite');
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
        ${type === 'success' ? 
            'background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0;' : 
            'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'
        }
    `;
    
    // Insert message after form
    const form = document.getElementById('contactForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Scroll to message if it's not visible
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto remove after 5 seconds (longer for errors)
        const removeDelay = type === 'error' ? 8000 : 5000;
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, removeDelay);
    }
}

// Show field-specific error
function showFieldError(fieldName, errorText) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = errorText;
    errorDiv.style.cssText = `
        color: #991b1b;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    
    // Validate based on field type
    if (fieldName === 'name') {
        if (value && value.length < 2) {
            showFieldError(fieldName, 'Name must be at least 2 characters.');
            return false;
        }
    } else if (fieldName === 'email') {
        if (value && !validateEmail(value)) {
            showFieldError(fieldName, 'Please enter a valid email address.');
            return false;
        }
    } else if (fieldName === 'phone') {
        if (value && !validatePhone(value)) {
            showFieldError(fieldName, 'Please enter a valid phone number.');
            return false;
        }
    } else if (fieldName === 'message') {
        if (value && value.length < 10) {
            showFieldError(fieldName, 'Message must be at least 10 characters.');
            return false;
        }
    }
    
    return true;
}

