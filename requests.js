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
        allRequests = JSON.parse(localStorage.getItem('projectRequests') || '[]');
        filterAndDisplayRequests();
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
        const card = document.createElement('div');
        card.className = 'request-card';
        card.innerHTML = `
            <div class="request-header">
                <div class="request-id">${request.id}</div>
                <div class="request-date">${formatDate(request.timestamp)}</div>
            </div>
            <div class="request-type">${request.projectType}</div>
            <div class="request-details">
                <h3>${request.name}</h3>
                <p><i class="fas fa-envelope"></i> ${request.email}</p>
                <p><i class="fas fa-align-left"></i> ${request.description}</p>
                <div class="request-budget">
                    <i class="fas fa-dollar-sign"></i> Budget: $${request.budget}
                </div>
                <div class="request-actions">
                    <button class="action-button ${request.status === 'completed' ? 'completed' : ''}" 
                            onclick="toggleStatus('${request.id}')">
                        <i class="fas ${request.status === 'completed' ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${request.status === 'completed' ? 'Completed' : 'Mark as Complete'}
                    </button>
                    <button class="action-button delete" onclick="removeRequest('${request.id}')">
                        <i class="fas fa-trash"></i>
                        Remove
                    </button>
                </div>
            </div>
        `;
        return card;
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
        const statusValue = statusFilter.value.toLowerCase();

        const filteredRequests = allRequests.filter(request => {
            const matchesSearch = 
                request.name.toLowerCase().includes(searchTerm) ||
                request.email.toLowerCase().includes(searchTerm) ||
                request.description.toLowerCase().includes(searchTerm) ||
                request.projectType.toLowerCase().includes(searchTerm);

            const matchesType = !typeValue || request.projectType.toLowerCase() === typeValue;
            const matchesStatus = !statusValue || (request.status || 'pending') === statusValue;

            return matchesSearch && matchesType && matchesStatus;
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

    // Event listeners
    searchInput.addEventListener('input', filterAndDisplayRequests);
    typeFilter.addEventListener('change', filterAndDisplayRequests);
    statusFilter.addEventListener('change', filterAndDisplayRequests);
    clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        typeFilter.value = '';
        statusFilter.value = '';
        filterAndDisplayRequests();
    });

    // Initial load
    loadRequests();
});
