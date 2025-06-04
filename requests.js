document.addEventListener('DOMContentLoaded', () => {
    // Admin password - change this to your desired password
    const ADMIN_PASSWORD = 'HDAnass4326277';
    
    const loginOverlay = document.getElementById('loginOverlay');
    const requestsPage = document.querySelector('.requests-page');
    const adminPassword = document.getElementById('adminPassword');
    const loginButton = document.getElementById('loginButton');
    const loginError = document.getElementById('loginError');
    const requestsContainer = document.getElementById('requestsContainer');

    // Check if already authenticated
    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
        if (isAuthenticated === 'true') {
            showRequestsPage();
        }
    }

    // Handle login
    loginButton.addEventListener('click', () => {
        if (adminPassword.value === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            showRequestsPage();
            adminPassword.value = '';
        } else {
            loginError.textContent = 'Incorrect password';
            setTimeout(() => {
                loginError.textContent = '';
            }, 3000);
        }
    });

    // Handle Enter key in password field
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });

    function showRequestsPage() {
        loginOverlay.style.display = 'none';
        requestsPage.style.display = 'block';
        loadRequests();
    }

    // Check authentication on load
    checkAuth();
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const noRequestsElement = document.getElementById('noRequests');

    let allRequests = [];

    // Load requests from localStorage
    function loadRequests() {
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        const requestsContainer = document.getElementById('requestsContainer');
        const noRequests = document.getElementById('noRequests');

        if (requests.length === 0) {
            requestsContainer.innerHTML = '';
            noRequests.style.display = 'flex';
            return;
        }

        noRequests.style.display = 'none';
        requestsContainer.innerHTML = requests
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(request => createRequestCard(request))
            .join('');
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Create request card
    function createRequestCard(request) {
        const date = new Date(request.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const isOrder = request.type === 'order';
        const statusClass = request.status === 'completed' ? 'completed' : '';
        
        // Get project name from projectType
        const projectName = getProjectName(request.projectType);
        
        return `
            <div class="request-card ${isOrder ? 'order' : 'request'}">
                <div class="request-header">
                    <div class="request-type">
                        <i class="fas ${isOrder ? 'fa-shopping-cart' : 'fa-question-circle'}"></i>
                        ${isOrder ? 'Order' : 'Request'}
                    </div>
                    <div class="request-date">
                        <i class="fas fa-clock"></i>
                        ${date}
                    </div>
                </div>
                <div class="request-content">
                    <h3>${request.name}</h3>
                    <p class="request-email">
                        <i class="fas fa-envelope"></i>
                        ${request.email}
                    </p>
                    <p class="request-project">
                        <i class="fas fa-project-diagram"></i>
                        Project: ${projectName}
                    </p>
                    ${isOrder ? `
                        <p class="request-plan">
                            <i class="fas fa-tag"></i>
                            Plan: ${request.plan}
                        </p>
                    ` : ''}
                    <p class="request-description">
                        <i class="fas fa-align-left"></i>
                        ${isOrder ? request.requirements || 'No special requirements' : request.description}
                    </p>
                    ${request.budget ? `
                        <p class="request-budget">
                            <i class="fas fa-dollar-sign"></i>
                            Budget: $${request.budget}
                        </p>
                    ` : ''}
                    <div class="request-actions">
                        <button onclick="toggleStatus('${request.id}')" class="status-button ${statusClass}">
                            <i class="fas ${request.status === 'completed' ? 'fa-check-circle' : 'fa-circle'}"></i>
                            ${request.status === 'completed' ? 'Completed' : 'Mark as Done'}
                        </button>
                        <button onclick="removeRequest('${request.id}')" class="delete-button">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Helper function to get pretty project name
    function getProjectName(projectType) {
        const projectNames = {
            'adobe-stock-automation': 'Adobe Stock Automation',
            'linkedin-job-finder': 'LinkedIn Job Finder',
            'instagram-unsend': 'Instagram Unsend',
            'medium-auto-publisher': 'Medium Auto-Publisher',
            'browser-extension': 'Browser Extension',
            'web-scraping': 'Web Scraping Bot',
            'social-media': 'Social Media Bot',
            'data-automation': 'Data Automation Bot',
            'custom-bot': 'Custom Bot Solution'
        };
        return projectNames[projectType] || projectType;
    }

    // Toggle request status
    window.toggleStatus = function(requestId) {
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        const index = requests.findIndex(r => r.id === requestId);
        
        if (index !== -1) {
            requests[index].status = requests[index].status === 'completed' ? 'pending' : 'completed';
            localStorage.setItem('projectRequests', JSON.stringify(requests));
            loadRequests();
        }
    };

    // Remove request
    window.removeRequest = function(requestId) {
        if (confirm('Are you sure you want to remove this request?')) {
            const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
            const filteredRequests = requests.filter(r => r.id !== requestId);
            localStorage.setItem('projectRequests', JSON.stringify(filteredRequests));
            loadRequests();
        }
    };

    // Add status filter
    const statusFilter = document.createElement('select');
    statusFilter.id = 'statusFilter';
    statusFilter.innerHTML = `
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
    `;
    document.querySelector('.requests-filters').insertBefore(
        statusFilter, 
        document.getElementById('clearFilters')
    );

    // Update filter function to include status
    function filterAndDisplayRequests() {
        const searchTerm = searchInput.value.toLowerCase();
        const typeValue = typeFilter.value.toLowerCase();
        const requestTypeValue = document.getElementById('requestTypeFilter').value;
        const statusValue = statusFilter.value.toLowerCase();

        const filteredRequests = allRequests.filter(request => {
            const matchesSearch = 
                request.name.toLowerCase().includes(searchTerm) ||
                request.email.toLowerCase().includes(searchTerm) ||
                (request.description || request.requirements || '').toLowerCase().includes(searchTerm) ||
                request.projectType.toLowerCase().includes(searchTerm);

            const matchesType = !typeValue || request.projectType.toLowerCase() === typeValue;
            const matchesRequestType = !requestTypeValue || request.type === requestTypeValue;
            const matchesStatus = !statusValue || (request.status || 'pending') === statusValue;

            return matchesSearch && matchesType && matchesRequestType && matchesStatus;
        });

        requestsContainer.innerHTML = '';

        if (filteredRequests.length === 0) {
            noRequestsElement.style.display = 'block';
            requestsContainer.style.display = 'none';
        } else {
            noRequestsElement.style.display = 'none';
            requestsContainer.style.display = 'grid';
            filteredRequests
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .forEach(request => {
                    requestsContainer.appendChild(createRequestCard(request));
                });
        }
    }

    // Filter requests
    function filterRequests() {
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const requestTypeFilter = document.getElementById('requestTypeFilter');
        
        const requests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        const filteredRequests = requests.filter(request => {
            const matchesSearch = !searchInput.value || 
                request.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                request.email.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                (request.description && request.description.toLowerCase().includes(searchInput.value.toLowerCase()));
                
            const matchesType = !typeFilter.value || request.projectType === typeFilter.value;
            const matchesRequestType = !requestTypeFilter.value || request.type === requestTypeFilter.value;
            
            return matchesSearch && matchesType && matchesRequestType;
        });
        
        const requestsContainer = document.getElementById('requestsContainer');
        const noRequests = document.getElementById('noRequests');
        
        if (filteredRequests.length === 0) {
            requestsContainer.innerHTML = '';
            noRequests.style.display = 'flex';
        } else {
            noRequests.style.display = 'none';
            requestsContainer.innerHTML = filteredRequests
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map(request => createRequestCard(request))
                .join('');
        }
    }

    // Initialize filters
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const requestTypeFilter = document.getElementById('requestTypeFilter');
        const clearFilters = document.getElementById('clearFilters');
        
        [searchInput, typeFilter, requestTypeFilter].forEach(filter => {
            filter.addEventListener('input', filterRequests);
        });
        
        clearFilters.addEventListener('click', () => {
            searchInput.value = '';
            typeFilter.value = '';
            requestTypeFilter.value = '';
            filterRequests();
        });
        
        // Initial load
        loadRequests();
    });
});
