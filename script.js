// script.js - Simple interactivity for VibeCoding

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('formMessage').textContent = 'Thank you for contacting us! We will get back to you soon.';
            form.reset();
        });
    }
});

// Animation on scroll for sections
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate__animated');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add('animate__fadeInUp');
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', animateOnScroll);

// Contact form message saving (GitHub Pages limitation)
// NOTE: GitHub Pages cannot save messages to a file directly.
// To enable saving, you must use a serverless function or backend API.
// Example placeholder for future backend integration:
// fetch('/messages/messages.txt', { method: 'POST', body: ... })
// For now, the form just shows a thank you message.

// Function to save messages to messages.txt
async function saveMessageToFile(message) {
    try {
        // For GitHub Pages, messages will be stored in localStorage
        // In a real server environment, this would make an API call
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));

        // Format message for text file
        const messageText = `
Date: ${new Date().toISOString()}
Name: ${message.name}
Email: ${message.email}
Subject: ${message.subject}
Message: ${message.message}
----------------------------------------
`;

        console.log('Message saved:', messageText);
        return true;
    } catch (error) {
        console.error('Error saving message:', error);
        return false;
    }
}

// Initialize messages storage
if (!localStorage.getItem('messages')) {
    localStorage.setItem('messages', '[]');
}

// Export for use in other files
window.saveMessageToFile = saveMessageToFile;
