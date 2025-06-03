document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
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
    }

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
    function saveRequest(data) {
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        requests.push(data);
        localStorage.setItem('projectRequests', JSON.stringify(requests));
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

    // Lazy loading for project images
    function lazyLoadImages() {
        const projectImages = document.querySelectorAll('.project-image[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.backgroundImage = `url('${img.dataset.src}')`;
                    img.classList.remove('loading');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        projectImages.forEach(img => {
            img.classList.add('loading');
            imageObserver.observe(img);
        });
    }

    // Handle touch gestures for project cards
    function initTouchGestures() {
        const projectsGrids = document.querySelectorAll('.projects-grid');
        
        projectsGrids.forEach(grid => {
            let startX, scrollLeft, isDragging = false;

            const startDragging = (e) => {
                isDragging = true;
                grid.classList.add('grabbing');
                startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
                scrollLeft = grid.scrollLeft;
            };

            const stopDragging = () => {
                isDragging = false;
                grid.classList.remove('grabbing');
            };

            const drag = (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
                const dist = x - startX;
                grid.scrollLeft = scrollLeft - dist;
            };

            // Touch events
            grid.addEventListener('touchstart', startDragging);
            grid.addEventListener('touchend', stopDragging);
            grid.addEventListener('touchmove', drag);

            // Mouse events
            grid.addEventListener('mousedown', startDragging);
            grid.addEventListener('mouseup', stopDragging);
            grid.addEventListener('mouseleave', stopDragging);
            grid.addEventListener('mousemove', drag);
        });
    }

    // Enhanced mobile menu handling
    function initMobileMenu() {
        const navLinks = document.querySelectorAll('nav ul li a');
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('nav ul');

        navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.style.backgroundColor = 'rgba(var(--primary-color), 0.1)';
            });

            link.addEventListener('touchend', function() {
                this.style.backgroundColor = '';
            });
        });

        // Double-tap prevention
        let lastTap = 0;
        menuToggle.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                return;
            }
            lastTap = currentTime;
        });

        // Close menu when tapping outside
        document.addEventListener('touchstart', (e) => {
            if (navMenu.classList.contains('active') && !e.target.closest('nav')) {
                e.preventDefault();
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Remove swipe hint after first interaction
    function handleSwipeHint() {
        const projectsGrids = document.querySelectorAll('.projects-grid');
        projectsGrids.forEach(grid => {
            const removeHint = () => {
                grid.style.setProperty('--show-swipe-hint', 'none');
                grid.removeEventListener('scroll', removeHint);
            };
            grid.addEventListener('scroll', removeHint);
        });
    }

    // Active section highlighting for mobile
    function initActiveSectionHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav ul li a');

        const highlightActiveSection = () => {
            const scrollY = window.scrollY;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };

        window.addEventListener('scroll', highlightActiveSection);
    }

    // Add ripple effect to interactive elements
    function addRippleEffect() {
        const interactiveElements = document.querySelectorAll('.project-card, .service-card, .submit-button, .cta-button');
        
        interactiveElements.forEach(element => {
            element.classList.add('ripple');
        });
    }

    // Optimize image loading
    function optimizeImages() {
        const images = document.querySelectorAll('.project-image');
        
        // Create tiny thumbnails for initial load
        images.forEach(img => {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                const tinyThumb = new Image();
                tinyThumb.src = dataSrc + '&w=20'; // Request a tiny version
                tinyThumb.onload = () => {
                    img.style.backgroundImage = `url('${tinyThumb.src}')`;
                    img.classList.add('loading');
                };
            }
        });

        // Load full images when in viewport
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.getAttribute('data-src');
                    if (dataSrc) {
                        const fullImg = new Image();
                        fullImg.src = dataSrc;
                        fullImg.onload = () => {
                            img.style.backgroundImage = `url('${dataSrc}')`;
                            img.classList.remove('loading');
                        };
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        images.forEach(img => {
            if (img.getAttribute('data-src')) {
                imageObserver.observe(img);
            }
        });
    }

    // Add smooth momentum scrolling for iOS
    function addMomentumScrolling() {
        const scrollableElements = document.querySelectorAll('.projects-grid');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }

    // Handle mobile network conditions
    function handleNetworkConditions() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            if (connection.saveData) {
                // Data saver is enabled
                const images = document.querySelectorAll('.project-image');
                images.forEach(img => {
                    const dataSrc = img.getAttribute('data-src');
                    if (dataSrc) {
                        // Load lower quality images
                        img.setAttribute('data-src', dataSrc + '&q=60&w=400');
                    }
                });
            }

            connection.addEventListener('change', () => {
                // Adjust loading strategy based on network changes
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    document.body.classList.add('slow-network');
                } else {
                    document.body.classList.remove('slow-network');
                }
            });
        }
    }

    // Initialize all mobile enhancements
    lazyLoadImages();
    initTouchGestures();
    initMobileMenu();
    handleSwipeHint();
    initActiveSectionHighlight();
    addRippleEffect();
    optimizeImages();
    addMomentumScrolling();
    handleNetworkConditions();
});
