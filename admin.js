// Admin Panel Functionality

// Check if we're on the admin login page
const isLoginPage = window.location.pathname.includes('admin-login.html');

// Check if we're on the admin dashboard page
const isDashboardPage = window.location.pathname.includes('admin.html');

// Firebase Authentication State Observer
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Current page:', window.location.pathname);
    console.log('isLoginPage:', isLoginPage);
    console.log('isDashboardPage:', isDashboardPage);
    
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not defined. Make sure firebase-config.js is loaded correctly.');
        return;
    }
    
    // Set up authentication state observer
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('Auth state changed. User:', user ? 'Logged in' : 'Not logged in');
        
        if (user) {
            // User is signed in
            if (isLoginPage) {
                // Redirect to admin dashboard if already logged in
                window.location.href = 'admin.html';
            } else if (isDashboardPage) {
                // Initialize dashboard functionality
                console.log('Initializing dashboard');
                initDashboard();
            }
        } else {
            // No user is signed in
            if (isDashboardPage) {
                // Redirect to login page if not logged in
                console.log('Not logged in, redirecting to login page');
                window.location.href = 'admin-login.html';
            } else if (isLoginPage) {
                // Initialize login form
                console.log('Initializing login form');
                initLoginForm();
            }
        }
    });
});

// Initialize Login Form
function initLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Clear previous error messages
            loginError.textContent = '';
            
            // Sign in with email and password
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in successfully
                    window.location.href = 'admin.html';
                })
                .catch((error) => {
                    // Handle errors
                    const errorMessage = error.message;
                    loginError.textContent = errorMessage;
                });
        });
    }
}

// Initialize Dashboard
function initDashboard() {
    // Set up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            firebase.auth().signOut().then(() => {
                // Sign-out successful, redirect to login page
                window.location.href = 'admin-login.html';
            }).catch((error) => {
                // An error happened
                console.error('Logout Error:', error);
            });
        });
    }
    
    // Fetch and display registrations
    fetchRegistrations();
    
    // Set up search functionality
    setupSearch();
    
    // Set up export to CSV functionality
    setupExportToCsv();
    
    // Extract unique events and create filter buttons
    setupEventFilters();
    
    // Set up edit modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeEditModal);
    }
    
    // Set up edit form submission
    const editForm = document.getElementById('editRegistrationForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const registrationId = editForm.getAttribute('data-id');
            if (registrationId) {
                updateRegistration(registrationId);
            }
        });
    }
}

// Set up event filters
function setupEventFilters() {
    // Wait for registrations to be loaded
    if (!window.allRegistrations) return;
    
    const filterContainer = document.getElementById('eventFilters');
    if (!filterContainer) return;
    
    // Create heading and buttons container
    filterContainer.innerHTML = `
        <h3>Filter by Event:</h3>
        <div class="event-filter-buttons"></div>
    `;
    
    const buttonsContainer = filterContainer.querySelector('.event-filter-buttons');
    
    // Extract all unique events
    const allEvents = new Set();
    window.allRegistrations.forEach(registration => {
        if (Array.isArray(registration.events)) {
            registration.events.forEach(event => allEvents.add(event));
        }
    });
    
    // Create 'All Events' filter button
    const allButton = document.createElement('button');
    allButton.textContent = 'All Events';
    allButton.className = 'filter-btn active';
    allButton.setAttribute('data-event', 'all');
    allButton.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        // Add active class to this button
        this.classList.add('active');
        // Filter registrations
        filterRegistrations(undefined, 'all');
    });
    buttonsContainer.appendChild(allButton);
    
    // Get events from events-data.js if available
    let predefinedEvents = [];
    if (typeof eventsData !== 'undefined') {
        // Extract events from eventsData
        if (eventsData.technical) {
            predefinedEvents = predefinedEvents.concat(eventsData.technical.map(event => event.name));
        }
        if (eventsData.nonTechnical) {
            predefinedEvents = predefinedEvents.concat(eventsData.nonTechnical.map(event => event.name));
        }
    }
    
    // Combine predefined events with events from registrations
    predefinedEvents.forEach(event => allEvents.add(event));
    
    // Ensure "Dumble Hold" is included
    allEvents.add('Dumble Hold');
    
    // Create filter button for each event
    allEvents.forEach(event => {
        const button = document.createElement('button');
        button.textContent = event;
        button.className = 'filter-btn';
        button.setAttribute('data-event', event);
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to this button
            this.classList.add('active');
            // Filter registrations
            filterRegistrations(undefined, event);
        });
        buttonsContainer.appendChild(button);
    });
}

// Fetch Registrations from Firestore
function fetchRegistrations() {
    const tableBody = document.getElementById('registrationsTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (tableBody && loadingIndicator && noDataMessage) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        noDataMessage.style.display = 'none';
        tableBody.innerHTML = '';
        
        // Get Firestore database reference
        const db = firebase.firestore();
        
        // Fetch registrations, ordered by timestamp (newest first)
        db.collection('registrations')
            .orderBy('timestamp', 'desc')
            .get()
            .then((querySnapshot) => {
                // Hide loading indicator
                loadingIndicator.style.display = 'none';
                
                if (querySnapshot.empty) {
                    // Show no data message if no registrations found
                    noDataMessage.style.display = 'block';
                    return;
                }
                
                // Store all registrations in a global variable for search and export
                window.allRegistrations = [];
                
                // Process each registration document
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Add the document ID to the data object for update/delete operations
                    data.id = doc.id;
                    window.allRegistrations.push(data);
                    
                    // Create table row for this registration
                    const row = createRegistrationRow(data);
                    tableBody.appendChild(row);
                });
                
                // Log for debugging
                console.log('Registrations loaded:', window.allRegistrations);
                
                // Set up event filters after registrations are loaded
                setupEventFilters();
            })
            .catch((error) => {
                console.error('Error fetching registrations:', error);
                loadingIndicator.style.display = 'none';
                noDataMessage.textContent = 'Error loading registrations. Please try again.';
                noDataMessage.style.display = 'block';
            });
    }
}

// Approve a registration
function approveRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for approval');
        return;
    }
    
    console.log('Approving registration:', registrationId);
    
    const db = firebase.firestore();
    
    // Update the registration status to 'approved'
    db.collection('registrations').doc(registrationId).update({
        status: 'approved'
    })
    .then(() => {
        console.log('Registration approved successfully');
        // Refresh the registrations list
        fetchRegistrations();
    })
    .catch((error) => {
        console.error('Error approving registration:', error);
        alert('Error approving registration. Please try again.');
    });
}

// Delete a registration
function deleteRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for deletion');
        return;
    }
    
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
        return;
    }
    
    console.log('Deleting registration:', registrationId);
    
    const db = firebase.firestore();
    
    // Delete the registration document
    db.collection('registrations').doc(registrationId).delete()
    .then(() => {
        console.log('Registration deleted successfully');
        // Refresh the registrations list
        fetchRegistrations();
    })
    .catch((error) => {
        console.error('Error deleting registration:', error);
        alert('Error deleting registration. Please try again.');
    });
}

// Edit a registration
function editRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for editing');
        return;
    }
    
    console.log('Editing registration:', registrationId);
    
    // Find the registration in the allRegistrations array
    const registration = window.allRegistrations.find(reg => reg.id === registrationId);
    
    if (!registration) {
        console.error('Registration not found:', registrationId);
        return;
    }
    
    // Get the edit modal and form
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editRegistrationForm');
    
    if (!editModal || !editForm) {
        console.error('Edit modal or form not found');
        return;
    }
    
    // Set the form data-id attribute
    editForm.setAttribute('data-id', registrationId);
    
    // Populate the form fields
    document.getElementById('editFullName').value = registration.fullName || '';
    document.getElementById('editEmail').value = registration.email || '';
    document.getElementById('editPhone').value = registration.phone || '';
    document.getElementById('editCollege').value = registration.college || '';
    
    // Set the status
    const statusSelect = document.getElementById('editStatus');
    if (statusSelect) {
        statusSelect.value = registration.status || 'pending';
    }
    
    // Show the modal
    editModal.style.display = 'block';
}

// Close the edit modal
function closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

// Update a registration
function updateRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for update');
        return;
    }
    
    console.log('Updating registration:', registrationId);
    
    const editForm = document.getElementById('editRegistrationForm');
    
    if (!editForm) {
        console.error('Edit form not found');
        return;
    }
    
    // Get the updated values
    const updatedData = {
        fullName: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        college: document.getElementById('editCollege').value,
        status: document.getElementById('editStatus').value
    };
    
    const db = firebase.firestore();
    
    // Update the registration document
    db.collection('registrations').doc(registrationId).update(updatedData)
    .then(() => {
        console.log('Registration updated successfully');
        // Close the modal
        closeEditModal();
        // Refresh the registrations list
        fetchRegistrations();
    })
    .catch((error) => {
        console.error('Error updating registration:', error);
        alert('Error updating registration. Please try again.');
    });
}

// Create a table row for a registration
function createRegistrationRow(registration) {
    console.log('Creating row for registration:', registration);
    console.log('Registration ID:', registration.id);
    
    // Create a new row
    const row = document.createElement('tr');
    
    // Store the document ID as a data attribute for update/delete operations
    if (registration.id) {
        row.setAttribute('data-id', registration.id);
    } else {
        console.warn('No ID found for registration:', registration);
    }
    
    // Format date from ISO string
    const registrationDate = registration.timestamp ? new Date(registration.timestamp).toLocaleString() : 'N/A';
    
    // Format events as a comma-separated list
    const events = Array.isArray(registration.events) ? registration.events.join(', ') : 'N/A';
    
    // Set the HTML content directly for the basic cells
    row.innerHTML = `
        <td>${registration.fullName || 'N/A'}</td>
        <td>${registration.email || 'N/A'}</td>
        <td>${registration.phone || 'N/A'}</td>
        <td>${registration.college || 'N/A'}</td>
        <td>${events}</td>
        <td>₹${registration.totalFee || '0'}</td>
        <td>${registration.paymentMethod || 'N/A'}</td>
        <td>${registration.paymentScreenshotUrl ? '<a href="' + registration.paymentScreenshotUrl + '" target="_blank" class="screenshot-link">View Screenshot</a>' : 'N/A'}</td>
        <td>${registrationDate}</td>
    `;
    
    // Add status cell
    const statusCell = document.createElement('td');
    const status = registration.status || 'pending';
    statusCell.textContent = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter
    statusCell.className = `status-${status}`;
    row.appendChild(statusCell);
    
    // Add actions cell with buttons
    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell';
    
    // Create the actions HTML
    let actionsHtml = '';
    
    // Approve button (only show if status is pending)
    if (status === 'pending') {
        actionsHtml += `<button class="action-btn approve-btn" onclick="approveRegistration('${registration.id}')">Approve</button>`;
    }
    
    // Edit and Delete buttons
    actionsHtml += `
        <button class="action-btn edit-btn" onclick="editRegistration('${registration.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteRegistration('${registration.id}')">Delete</button>
    `;
    
    actionsCell.innerHTML = actionsHtml;
    row.appendChild(actionsCell);
    
    console.log('Row created with actions cell:', actionsCell);
    
    return row;
}

// Set up search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRegistrations(searchTerm, undefined);
        });
    }
}

// Global variables for filtering
window.currentSearchTerm = '';
window.currentEventFilter = 'all';

// Filter registrations based on search term and event filter
function filterRegistrations(searchTerm, eventFilter) {
    const tableBody = document.getElementById('registrationsTableBody');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (!window.allRegistrations || !tableBody || !noDataMessage) return;
    
    // Update global filter state
    if (searchTerm !== undefined) window.currentSearchTerm = searchTerm;
    if (eventFilter !== undefined) window.currentEventFilter = eventFilter;
    
    // Use current filter values
    searchTerm = window.currentSearchTerm;
    eventFilter = window.currentEventFilter;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    // Filter registrations
    const filteredRegistrations = window.allRegistrations.filter(registration => {
        // Text search filter
        const matchesSearch = 
            (registration.fullName && registration.fullName.toLowerCase().includes(searchTerm)) ||
            (registration.email && registration.email.toLowerCase().includes(searchTerm)) ||
            (registration.college && registration.college.toLowerCase().includes(searchTerm)) ||
            (registration.status && registration.status.toLowerCase().includes(searchTerm));
        
        // Event filter
        const matchesEvent = eventFilter === 'all' || 
            (Array.isArray(registration.events) && registration.events.includes(eventFilter));
        
        return matchesSearch && matchesEvent;
    });
    
    // Show or hide no data message
    if (filteredRegistrations.length === 0) {
        noDataMessage.style.display = 'block';
        noDataMessage.textContent = 'No matching registrations found';
    } else {
        noDataMessage.style.display = 'none';
        
        // Add filtered registrations to table
        filteredRegistrations.forEach(registration => {
            const row = createRegistrationRow(registration);
            tableBody.appendChild(row);
        });
    }
}

// Set up Export to CSV functionality
function setupExportToCsv() {
    const exportBtn = document.getElementById('exportCsvBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportRegistrationsToCsv();
        });
    }
}

// Approve a registration
function approveRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for approval');
        return;
    }
    
    if (confirm('Are you sure you want to approve this registration?')) {
        const db = firebase.firestore();
        
        db.collection('registrations').doc(registrationId).update({
            status: 'approved'
        })
        .then(() => {
            alert('Registration approved successfully!');
            // Refresh the registrations list
            fetchRegistrations();
        })
        .catch((error) => {
            console.error('Error approving registration:', error);
            alert('Error approving registration. Please try again.');
        });
    }
}

// Delete a registration
function deleteRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for deletion');
        return;
    }
    
    if (confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
        const db = firebase.firestore();
        
        db.collection('registrations').doc(registrationId).delete()
        .then(() => {
            alert('Registration deleted successfully!');
            // Refresh the registrations list
            fetchRegistrations();
        })
        .catch((error) => {
            console.error('Error deleting registration:', error);
            alert('Error deleting registration. Please try again.');
        });
    }
}

// Edit a registration
function editRegistration(registrationId) {
    if (!registrationId) {
        console.error('No registration ID provided for editing');
        return;
    }
    
    // Find the registration in the allRegistrations array
    const registration = window.allRegistrations.find(reg => reg.id === registrationId);
    
    if (!registration) {
        console.error('Registration not found');
        return;
    }
    
    // Create a modal for editing
    const modalHtml = `
    <div id="editModal" class="edit-modal">
        <div class="edit-modal-content">
            <span class="close-modal" onclick="closeEditModal()">&times;</span>
            <h2>Edit Registration</h2>
            <form id="editRegistrationForm">
                <div class="form-group">
                    <label for="editFullName">Full Name</label>
                    <input type="text" id="editFullName" name="fullName" value="${registration.fullName || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email</label>
                    <input type="email" id="editEmail" name="email" value="${registration.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editPhone">Phone</label>
                    <input type="tel" id="editPhone" name="phone" value="${registration.phone || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editCollege">College</label>
                    <input type="text" id="editCollege" name="college" value="${registration.college || ''}">
                </div>
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" name="status">
                        <option value="pending" ${(registration.status === 'pending' || !registration.status) ? 'selected' : ''}>Pending</option>
                        <option value="approved" ${registration.status === 'approved' ? 'selected' : ''}>Approved</option>
                        <option value="rejected" ${registration.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="submit" class="save-btn">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
    `;
    
    // Add the modal to the page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Add event listener for form submission
    const editForm = document.getElementById('editRegistrationForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const updatedData = {
            fullName: document.getElementById('editFullName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            college: document.getElementById('editCollege').value,
            status: document.getElementById('editStatus').value
        };
        
        // Update the registration in Firestore
        const db = firebase.firestore();
        db.collection('registrations').doc(registrationId).update(updatedData)
        .then(() => {
            alert('Registration updated successfully!');
            closeEditModal();
            // Refresh the registrations list
            fetchRegistrations();
        })
        .catch((error) => {
            console.error('Error updating registration:', error);
            alert('Error updating registration. Please try again.');
        });
    });
    
    // Show the modal
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';
}

// Close the edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// Export registrations to CSV file
function exportRegistrationsToCsv() {
    if (!window.allRegistrations || window.allRegistrations.length === 0) {
        alert('No registrations to export');
        return;
    }
    
    // Get currently visible registrations (filtered or all)
    const tableBody = document.getElementById('registrationsTableBody');
    const visibleRows = tableBody.querySelectorAll('tr');
    const visibleRegistrations = [];
    
    visibleRows.forEach((row, index) => {
        visibleRegistrations.push(window.allRegistrations[index]);
    });
    
    // Define CSV headers
    const headers = [
        'Full Name',
        'Email',
        'Phone',
        'College',
        'Events',
        'Total Fee',
        'Payment Method',
        'Screenshot URL',
        'Registration Date',
        'Status'
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    visibleRegistrations.forEach(registration => {
        // Format events as a comma-separated list in quotes
        const events = Array.isArray(registration.events) 
            ? '"' + registration.events.join('; ') + '"' 
            : 'N/A';
        
        // Format date
        const registrationDate = registration.timestamp 
            ? new Date(registration.timestamp).toLocaleString() 
            : 'N/A';
        
        // Create row data
        const row = [
            registration.fullName || 'N/A',
            registration.email || 'N/A',
            registration.phone || 'N/A',
            registration.college || 'N/A',
            events,
            registration.totalFee || '0',
            registration.paymentMethod || 'N/A',
            registration.paymentScreenshotUrl || 'N/A',
            registrationDate,
            registration.status || 'pending'
        ];
        
        // Escape any commas in the data
        const escapedRow = row.map(field => {
            // If field contains commas, quotes, or newlines, wrap in quotes
            if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                // Replace any quotes with double quotes for CSV escaping
                return '"' + field.replace(/"/g, '""') + '"';
            }
            return field;
        });
        
        // Add row to CSV content
        csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create download link
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'sparx_registrations.csv');
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
}