document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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

    // Helper function for generating unique IDs
    function generateRequestId() {
        return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Function to export requests
    function exportRequests() {
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        const exportData = JSON.stringify(requests, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project-requests.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Save request
    async function saveRequest(data) {
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        requests.push(data);
        localStorage.setItem('projectRequests', JSON.stringify(requests));

        // Create JSON file content
        const exportData = JSON.stringify(requests, null, 2);
        const blob = new Blob([exportData], { type: 'application/json' });
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', blob, 'project-requests.json');
        
        try {
            // Upload to gofile.io
            const response = await fetch('https://api.gofile.io/uploadFile', {
                method: 'POST',
                headers: {
                    'Authorization': 'UqznlQMZJSePULlfp8KwFCC7mLYjsOAU'
                },
                body: formData
            });

            const result = await response.json();
            if (result.status === 'ok') {
                console.log('File uploaded successfully:', result.data.downloadPage);
            } else {
                console.error('Upload failed:', result.status);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    // Add animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.service-card, .project-card').forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });
});
