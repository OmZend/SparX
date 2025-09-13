// Registration Form Management
class RegistrationManager {
    constructor() {
        this.registrations = [];
        this.selectedEvent = '';
        // TODO: Add your Cloudinary cloud name and unsigned upload preset.
        this.cloudinaryCloudName = 'dep7h2nxe';
        this.cloudinaryUploadPreset = 'screenshots';
        // Initialize Firestore
        this.db = firebase.firestore();
        this.init();
    }

    init() {
        this.bindEvents();
        this.populateEventsList();
        this.initializeMobileFormFeatures();
    }

    bindEvents() {
        // Form submission
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                this.submitRegistration(e);
            });
        }

        // Modal close events (if modal exists)
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeRegistration());
        }

        // Close modal when clicking outside (if modal exists)
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('registrationModal');
            if (modal && event.target === modal) {
                this.closeRegistration();
            }
        });
    }

    openRegistration() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.populateEventsList();
        }
    }

    closeRegistration() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }
    }

    registerForEvent(eventName) {
        this.selectedEvent = eventName;
        this.openRegistration();

        // Pre-select the event
        setTimeout(() => {
            const checkbox = document.querySelector(`input[value="${eventName}"]`);
            if (checkbox) {
                checkbox.checked = true;
                // Update fee after selecting
                this.updateTotalFee();
            }
        }, 100);
    }

    populateEventsList() {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;

        eventsList.innerHTML = '';

        // Get all events with their data from eventsData
        if (!eventsData) return;

        // Combine technical and non-technical events
        const allEvents = [
            ...eventsData.technical.map(event => ({ ...event, category: 'technical' })),
            ...eventsData.nonTechnical.map(event => ({ ...event, category: 'nonTechnical' }))
        ];

        allEvents.forEach((event) => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            const cleanId = event.name.replace(/\s+/g, '');
            checkboxItem.innerHTML = `
                <input type="checkbox" id="${cleanId}" name="events" value="${event.name}" data-fee="${event.fee}">
                <label for="${cleanId}">${event.name} - ₹${event.fee}</label>
            `;
            eventsList.appendChild(checkboxItem);

            // Add event listener for fee calculation
            const checkbox = checkboxItem.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.updateTotalFee());
        });

        // Initialize total fee
        this.updateTotalFee();
    }

    // Toggle payment details based on payment method
    togglePaymentDetails() {
        const paymentMethod = document.getElementById('paymentMethod');
        const paymentSection = document.getElementById('paymentSection');
        const screenshotInput = document.getElementById('paymentScreenshot');
        const totalFee = this.calculateTotalFee();

        if (paymentMethod && paymentMethod.value === 'upi' && totalFee > 0) {
            paymentSection.style.display = 'block';
            screenshotInput.required = true;
        } else {
            paymentSection.style.display = 'none';
            screenshotInput.required = false;
            // Reset file upload when hiding payment section
            const fileNameElement = document.getElementById('fileName');

            if (screenshotInput) screenshotInput.value = '';
            if (fileNameElement) {
                fileNameElement.textContent = 'No file selected';
                fileNameElement.style.color = '#666';
            }
        }
    }

    // Calculate total fee (helper method)
    calculateTotalFee() {
        const checkedBoxes = document.querySelectorAll('input[name="events"]:checked');
        let totalFee = 0;
        checkedBoxes.forEach(checkbox => {
            const fee = parseInt(checkbox.getAttribute('data-fee')) || 0;
            totalFee += fee;
        });
        return totalFee;
    }


    updateTotalFee() {
        const checkedBoxes = document.querySelectorAll('input[name="events"]:checked');
        let totalFee = 0;

        checkedBoxes.forEach(checkbox => {
            const fee = parseInt(checkbox.getAttribute('data-fee')) || 0;
            totalFee += fee;
        });

        // Update total fee display
        const totalFeeElement = document.getElementById('totalFee');
        if (totalFeeElement) {
            totalFeeElement.textContent = `₹${totalFee}`;
        }

        // Show/hide payment section based on total fee and payment method
        this.togglePaymentDetails();

    }

    async submitRegistration(e) {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const selectedEvents = [];
    
        const allEventCheckboxes = document.querySelectorAll('input[name="events"]');
        const checkedBoxes = document.querySelectorAll('input[name="events"]:checked');
    
        checkedBoxes.forEach((checkbox) => {
            selectedEvents.push(checkbox.value);
        });
    
        if (allEventCheckboxes.length === 0) {
            alert('Events are still loading. Please wait a moment and try again.');
            return;
        }
    
        if (selectedEvents.length === 0) {
            alert('Please select at least one event to register for.');
            return;
        }
    
        // Validate payment method selection
        const paymentMethod = formData.get('paymentMethod');
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }
    
        // Calculate total fee
        let totalFee = 0;
        checkedBoxes.forEach(checkbox => {
            const fee = parseInt(checkbox.getAttribute('data-fee')) || 0;
            totalFee += fee;
        });
    
        let screenshotUrl = '';
        // Validate and upload payment screenshot for UPI payments with fees
        if (totalFee > 0 && paymentMethod === 'upi') {
            const screenshotInput = document.getElementById('paymentScreenshot');
            if (!screenshotInput || !screenshotInput.files || screenshotInput.files.length === 0) {
                alert('Please upload a screenshot of your payment for verification.');
                return;
            }
    
            const file = screenshotInput.files[0];
            try {
                const uploadData = new FormData();
                uploadData.append('file', file);
                uploadData.append('upload_preset', this.cloudinaryUploadPreset);
    
                const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/image/upload`, {
                    method: 'POST',
                    body: uploadData
                });
    
                const data = await response.json();
                screenshotUrl = data.secure_url;
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                alert('There was an error uploading your screenshot. Please try again.');
                return;
            }
        }
    
        const registration = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            college: formData.get('college'),
            year: formData.get('year'),
            branch: formData.get('branch'),
            events: selectedEvents,
            totalFee: totalFee,
            paymentMethod: paymentMethod,
            paymentScreenshotUrl: screenshotUrl,
            teamMembers: formData.get('teamMembers'),
            timestamp: new Date().toISOString()
        };
    
        // Store registration in Firestore
        try {
            if (!this.db) {
                throw new Error("Firestore is not initialized.");
            }
            await this.db.collection('registrations').add(registration);
            // Show success alert
            alert('Registration successful! We\'ll contact you with further details.');
    
            // Reset form
            e.target.reset();
    
            // Reset total fee display
            this.updateTotalFee();
    
            // Reset file upload
            const screenshotInput = document.getElementById('paymentScreenshot');
            const fileNameElement = document.getElementById('fileName');
    
            if (screenshotInput) screenshotInput.value = '';
            if (fileNameElement) {
                fileNameElement.textContent = 'No file selected';
                fileNameElement.style.color = '#666';
            }
    
            // Update register buttons for selected events
            this.updateRegisterButtons(selectedEvents);
    
            // Auto close modal after 3 seconds (if modal exists)
            const modal = document.getElementById('registrationModal');
            if (modal) {
                setTimeout(() => {
                    this.closeRegistration();
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding document to Firestore: ', error);
            alert('There was an error with your registration. Please try again. Check the console for more details.');
        }
    }

    updateRegisterButtons(selectedEvents) {
        selectedEvents.forEach(eventName => {
            const buttons = document.querySelectorAll('.register-btn');
            buttons.forEach(btn => {
                if (btn.textContent === 'Register' && btn.onclick.toString().includes(eventName)) {
                    btn.textContent = 'Registered';
                    btn.disabled = true;
                }
            });
        });
    }

    // Get registration statistics
    getRegistrationStats() {
        const totalRegistrations = this.registrations.length;
        const totalEvents = this.registrations.reduce((total, reg) => total + reg.events.length, 0);
        
        return {
            totalRegistrations,
            totalEvents,
            averageEventsPerPerson: totalRegistrations > 0 ? (totalEvents / totalRegistrations).toFixed(1) : 0
        };
    }

    // Export registrations (for future backend integration)
    exportRegistrations() {
        return JSON.stringify(this.registrations, null, 2);
    }

    // Initialize mobile-specific form features
    initializeMobileFormFeatures() {
        if (window.innerWidth <= 768) {
            this.addMobileKeyboardOptimization();
            this.addFormValidationFeedback();
            this.addAutoFocus();
            this.addMobileFormAnimations();
        }
    }

    // Optimize form inputs for mobile keyboards
    addMobileKeyboardOptimization() {
        // Set appropriate input modes for mobile keyboards
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.setAttribute('inputmode', 'email');
            emailInput.setAttribute('autocomplete', 'email');
        }

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.setAttribute('inputmode', 'tel');
            phoneInput.setAttribute('autocomplete', 'tel');
            phoneInput.setAttribute('pattern', '[0-9+\-\s()]*');
        }

        const nameInput = document.getElementById('fullName');
        if (nameInput) {
            nameInput.setAttribute('autocomplete', 'name');
            nameInput.setAttribute('autocapitalize', 'words');
        }

        const collegeInput = document.getElementById('college');
        if (collegeInput) {
            collegeInput.setAttribute('autocomplete', 'organization');
            collegeInput.setAttribute('autocapitalize', 'words');
        }

        const branchInput = document.getElementById('branch');
        if (branchInput) {
            branchInput.setAttribute('autocapitalize', 'words');
        }
    }

    // Add enhanced validation feedback for mobile
    addFormValidationFeedback() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', () => {
                this.validateField(input);
            });

            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Add touch feedback
            input.addEventListener('touchstart', () => {
                input.style.transform = 'scale(1.02)';
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });

            input.addEventListener('touchend', () => {
                setTimeout(() => {
                    input.style.transform = '';
                }, 100);
            });
        });
    }

    // Validate individual form field
    validateField(field) {
        const isValid = field.checkValidity();
        const errorDiv = field.parentNode.querySelector('.field-error');
        
        // Remove existing error
        if (errorDiv) {
            errorDiv.remove();
        }

        if (!isValid && field.value.length > 0) {
            // Add error message
            const error = document.createElement('div');
            error.className = 'field-error';
            error.style.color = '#dc3545';
            error.style.fontSize = '0.8rem';
            error.style.marginTop = '0.25rem';
            error.textContent = this.getErrorMessage(field);
            field.parentNode.appendChild(error);
            
            // Add error styling
            field.style.borderColor = '#dc3545';
            field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
        } else {
            // Remove error styling
            field.style.borderColor = '';
            field.style.boxShadow = '';
            
            if (field.value.length > 0) {
                // Add success styling
                field.style.borderColor = '#28a745';
                field.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
            }
        }
    }

    // Get appropriate error message for field
    getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required';
        }
        if (field.validity.typeMismatch) {
            if (field.type === 'email') {
                return 'Please enter a valid email address';
            }
            if (field.type === 'tel') {
                return 'Please enter a valid phone number';
            }
        }
        if (field.validity.patternMismatch) {
            return 'Please enter a valid format';
        }
        if (field.validity.tooShort) {
            return `Minimum ${field.minLength} characters required`;
        }
        if (field.validity.tooLong) {
            return `Maximum ${field.maxLength} characters allowed`;
        }
        return 'Please check this field';
    }

    // Add auto-focus for mobile
    addAutoFocus() {
        // Focus first input when form becomes visible
        const firstInput = document.querySelector('#registrationForm input:not([type="checkbox"])');
        if (firstInput && window.innerWidth <= 768) {
            setTimeout(() => {
                firstInput.focus();
            }, 300);
        }

        // Auto-advance through form fields
        const inputs = document.querySelectorAll('#registrationForm input:not([type="checkbox"]), #registrationForm select');
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    const nextInput = inputs[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        // Focus submit button
                        const submitBtn = document.getElementById('submitBtn');
                        if (submitBtn) {
                            submitBtn.focus();
                        }
                    }
                }
            });
        });
    }

    // Add mobile-specific form animations
    addMobileFormAnimations() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Add floating label effect
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                this.addFloatingLabel(input);
            }
        });
    }

    // Add floating label effect
    addFloatingLabel(input) {
        const label = input.parentNode.querySelector('label');
        if (!label) return;

        // Create floating label container
        const container = document.createElement('div');
        container.className = 'floating-label-container';
        container.style.position = 'relative';

        // Wrap input and label
        input.parentNode.insertBefore(container, input);
        container.appendChild(label);
        container.appendChild(input);

        // Style the floating label
        label.style.position = 'absolute';
        label.style.left = '1rem';
        label.style.transition = 'all 0.3s ease';
        label.style.pointerEvents = 'none';
        label.style.backgroundColor = 'white';
        label.style.padding = '0 0.25rem';

        const updateLabelPosition = () => {
            if (input.value || input === document.activeElement) {
                label.style.top = '-0.5rem';
                label.style.fontSize = '0.8rem';
                label.style.color = '#0A2540';
            } else {
                label.style.top = '1rem';
                label.style.fontSize = '1rem';
                label.style.color = '#666';
            }
        };

        input.addEventListener('focus', updateLabelPosition);
        input.addEventListener('blur', updateLabelPosition);
        input.addEventListener('input', updateLabelPosition);

        // Initial position
        updateLabelPosition();
    }


}

// Initialize registration manager
let registrationManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    registrationManager = new RegistrationManager();
});

// Global functions for HTML onclick attributes
function openRegistration() {
    if (registrationManager) {
        registrationManager.openRegistration();
    }
}

function closeRegistration() {
    if (registrationManager) {
        registrationManager.closeRegistration();
    }
}

function registerForEvent(eventName) {
    if (registrationManager) {
        registrationManager.registerForEvent(eventName);
    }
}

function submitRegistration(e) {
    if (registrationManager) {
        registrationManager.submitRegistration(e);
    } else {
        e.preventDefault();
        alert('Form is not ready yet. Please wait for the page to fully load.');
        return false;
    }
}

// Global function for payment method toggle
function togglePaymentDetails() {
    if (registrationManager) {
        registrationManager.togglePaymentDetails();
    }
}

// Global function for file upload handling
function handleFileUpload(input) {
    console.log('[DEBUG] handleFileUpload called');
    console.log('[DEBUG] Input files:', input.files);

    const fileNameElement = document.getElementById('fileName');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        console.log('[DEBUG] Selected file:', file.name, 'Type:', file.type, 'Size:', file.size);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.log('[DEBUG] Invalid file type');
            alert('Please select a valid image file (PNG, JPG, JPEG, etc.)');
            input.value = '';
            fileNameElement.textContent = 'No file selected';
            fileNameElement.style.color = '#dc3545'; // Red color for error
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            console.log('[DEBUG] File too large');
            alert('File size must be less than 5MB');
            input.value = '';
            fileNameElement.textContent = 'No file selected';
            fileNameElement.style.color = '#dc3545'; // Red color for error
            return;
        }

        console.log('[DEBUG] File validation passed');
        fileNameElement.textContent = file.name;
        fileNameElement.style.color = '#28a745'; // Green color for success

        // Add visual feedback for mobile
        if (window.innerWidth <= 768) {
            fileNameElement.style.fontWeight = 'bold';
        }
    } else {
        console.log('[DEBUG] No file selected');
        fileNameElement.textContent = 'No file selected';
        fileNameElement.style.color = '#666'; // Default color
        fileNameElement.style.fontWeight = 'normal';
    }
}