document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    initializeMenuToggle();
    
    // Initialize all forms
    initializeForms();
    
    // Initialize animations if they exist
    if (typeof initializeAnimations === 'function') {
        initializeAnimations();
    }
});

// Initialize menu toggle functionality
function initializeMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        // Ensure menu is hidden on load for mobile
        if (window.innerWidth <= 768) {
            navLinks.style.display = 'none';
        }

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
            } else {
                if (!navLinks.classList.contains('active')) {
                    navLinks.style.display = 'none';
                }
            }
        });
    }
}

// Initialize all forms in the page
function initializeForms() {
    // Get all forms on the page
    const projectForm = document.getElementById('projectForm');
    const orderForm = document.getElementById('projectOrderForm');
    
    // Initialize contact form if it exists
    if (projectForm) {
        handleFormSubmission(projectForm);
    }
    
    // Initialize order form if it exists
    if (orderForm) {
        handleFormSubmission(orderForm);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling
const form = document.getElementById('projectForm');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {
            ...Object.fromEntries(formData.entries()),
            timestamp: new Date().toISOString(),
            id: generateRequestId()
        };

        // Store in localStorage and export
        saveRequest(data);

        // Show submission feedback
        try {
            alert('Thank you for your submission! We will contact you soon.');
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again later.');
        }
    });
}

// Function to show success message
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);

    // Remove the message after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 3000);
}

// Function to show popup notification
function showPopupNotification(title, message, type = 'success') {
    // Remove any existing popup
    const existingPopup = document.querySelector('.popup-notification');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'popup-notification';
    
    // Set icon based on type
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    popup.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="popup-content">
            <div class="popup-title">${title}</div>
            <div class="popup-message">${message}</div>
        </div>
        <button class="close-popup" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to document
    document.body.appendChild(popup);

    // Trigger animation
    setTimeout(() => popup.classList.add('show'), 10);

    // Add close button handler
    const closeBtn = popup.querySelector('.close-popup');
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(popup)) {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }
    }, 5000);
}

// Form validation and helper functions
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;
    
    // Remove existing validation styles
    field.classList.remove('success', 'error');
    
    if (isRequired && !value) {
        field.classList.add('error');
        return false;
    }
    
    if (value) {
        switch (type) {
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    field.classList.add('error');
                    return false;
                }
                break;
            case 'number':
                if (isNaN(value)) {
                    field.classList.add('error');
                    return false;
                }
                break;
        }
    }
    
    field.classList.add('success');
    return true;
}

function showFormFeedback(form, message, type) {
    let feedback = form.querySelector('.form-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'form-feedback';
        form.insertBefore(feedback, form.firstChild);
    }
    
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            feedback.style.display = 'none';
            feedback.style.opacity = '1';
        }, 300);
    }, 3000);
}

// Save request/order to localStorage
function saveRequest(data) {
    if (!data.type) {
        data.type = data.plan ? 'order' : 'request';
    }
    if (!data.status) {
        data.status = 'pending';
    }
    const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
    requests.push(data);
    localStorage.setItem('projectRequests', JSON.stringify(requests));
}

// Generate unique ID for requests
function generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Enhanced form submission handler for all forms
function handleFormSubmission(form) {
    if (!form) return;

    // Add validation on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
        // Add validation on blur and input
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
            field.classList.toggle('has-content', field.value.trim() !== '');
        });
        
        // Initialize has-content class if field has value
        if (field.value.trim()) {
            field.classList.add('has-content');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const fields = form.querySelectorAll('input, select, textarea');
        const isValid = Array.from(fields).every(field => validateField(field));

        if (!isValid) {
            showFormFeedback(form, 'Please fill in all required fields correctly.', 'error');
            return;
        }

        const submitButton = form.querySelector('.submit-button');
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        try {
            const formData = new FormData(form);
            const data = {
                ...Object.fromEntries(formData.entries()),
                timestamp: new Date().toISOString(),
                id: generateRequestId(),
                type: form.id === 'projectOrderForm' ? 'order' : 'request'
            };

            // Simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store in localStorage
            saveRequest(data);

            // Show popup notification
            if (data.type === 'order') {
                showPopupNotification(
                    'Order Submitted Successfully!',
                    'Thank you for your order. We will contact you soon to get started.'
                );
            } else {
                showPopupNotification(
                    'Request Received!',
                    'Thank you for your request. We will review it and get back to you soon.'
                );
            }
            
            // Reset form and validation states
            form.reset();
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });
            form.querySelectorAll('input, select, textarea').forEach(field => {
                field.classList.remove('has-content');
            });

            // Scroll to top with smooth behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Update form progress if the function exists
            if (typeof updateFormProgress === 'function') {
                updateFormProgress();
            }

        } catch (error) {
            console.error('Error:', error);
            showPopupNotification(
                'Submission Error',
                'There was an error submitting your form. Please try again.',
                'error'
            );
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
}
