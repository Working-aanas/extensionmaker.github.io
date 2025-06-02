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
