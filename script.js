// Core Application Features
let isDarkTheme = false;
let isMobileMenuOpen = false;
let currentEventCategory = 'technical';
let touchStartX = 0;
let touchStartY = 0;
let isRefreshing = false;

// Apply theme function
function applyTheme() {
    const body = document.body;
    const themeButton = document.querySelector('.theme-toggle');
    const header = document.querySelector('header');
    
    console.log('Applying theme:', isDarkTheme ? 'dark' : 'light');
    
    if (isDarkTheme) {
        body.classList.add('dark-theme');
        if (themeButton) themeButton.innerHTML = '☀️ Light';
        if (header) header.style.background = 'rgba(26, 26, 46, 0.95)';
        
        // Apply dark theme to specific elements
        applyDarkThemeElements();
    } else {
        body.classList.remove('dark-theme');
        if (themeButton) themeButton.innerHTML = '🌙 Dark';
        if (header) header.style.background = 'rgba(255, 255, 255, 0.95)';
        
        // Remove dark theme from specific elements
        removeDarkThemeElements();
    }
    
    // Force a repaint to ensure styles are applied
    body.style.display = 'none';
    body.offsetHeight; // Trigger reflow
    body.style.display = '';
}

// Apply dark theme to specific elements
function applyDarkThemeElements() {
    console.log('Applying dark theme elements');
    
    // Handle form elements
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.type !== 'radio') {
            input.style.background = '#0f3460';
            input.style.color = '#ffffff';
            input.style.borderColor = '#2a4a6b';
        }
    });
    
    // Handle buttons
    const buttons = document.querySelectorAll('button:not(.theme-toggle)');
    buttons.forEach(button => {
        if (!button.classList.contains('cta-button') && !button.classList.contains('register-btn')) {
            button.style.background = '#0f3460';
            button.style.color = '#e0e0e0';
            button.style.borderColor = '#2a4a6b';
        }
    });
}

// Remove dark theme from specific elements
function removeDarkThemeElements() {
    console.log('Removing dark theme elements');
    
    // Reset form elements
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'checkbox' && input.type !== 'radio') {
            input.style.background = '';
            input.style.color = '';
            input.style.borderColor = '';
        }
    });
    
    // Reset buttons
    const buttons = document.querySelectorAll('button:not(.theme-toggle)');
    buttons.forEach(button => {
        if (!button.classList.contains('cta-button') && !button.classList.contains('register-btn')) {
            button.style.background = '';
            button.style.color = '';
            button.style.borderColor = '';
        }
    });
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('sparx-theme');
    console.log('Saved theme found:', savedTheme);
    
    if (savedTheme === 'dark') {
        isDarkTheme = true;
    } else {
        isDarkTheme = false;
    }
    
    // Apply theme after a small delay to ensure DOM is ready
    setTimeout(() => {
        applyTheme();
    }, 100);
}

// Force theme application (for debugging)
function forceTheme(theme) {
    if (theme === 'dark') {
        isDarkTheme = true;
    } else {
        isDarkTheme = false;
    }
    applyTheme();
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing theme system and mobile features');
    
    // Load saved theme
    loadSavedTheme();
    
    // Initialize mobile features
    initializeMobileFeatures();
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add theme change listener for dynamic content
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            // Small delay to ensure theme is applied
            setTimeout(() => {
                applyTheme();
            }, 10);
        });
    }
    
    // Close mobile menu when clicking on nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    // Debug: Log current theme state
    console.log('Current theme state:', isDarkTheme ? 'dark' : 'light');
    console.log('Body classes:', document.body.className);
});

// Utility functions
function debounce(func, wait) {
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments if needed
    // Reinitialize mobile features if switching to/from mobile view
    if (window.innerWidth <= 768) {
        initializeMobileFeatures();
    }
}, 250));

// Toggle mobile menu
function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (mobileMenu && overlay && hamburger) {
        if (isMobileMenuOpen) {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Switch event category for mobile
function switchEventCategory(category) {
    currentEventCategory = category;
    const tabs = document.querySelectorAll('.mobile-event-tab');
    const eventsGrid = document.getElementById('eventsGrid');
    
    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`[onclick="switchEventCategory('${category}')"]`);
    if (activeTab) activeTab.classList.add('active');
    
    // Animate to show correct category
    if (eventsGrid) {
        const translateX = category === 'technical' ? '0%' : '-100%';
        eventsGrid.style.transform = `translateX(${translateX})`;
    }
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Touch and Swipe Handlers
function initializeTouchGestures() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    eventsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    eventsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    eventsContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleTouchStart(e) {
    if (window.innerWidth > 768) return;
    
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    if (window.innerWidth > 768) return;
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        e.preventDefault();
    }
}

function handleTouchEnd(e) {
    if (window.innerWidth > 768) return;
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;
    
    // Swipe threshold
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
            // Swipe left - show non-technical
            switchEventCategory('non-technical');
        } else {
            // Swipe right - show technical
            switchEventCategory('technical');
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}

// Pull to Refresh
function initializePullToRefresh() {
    let pullDistance = 0;
    let isPulling = false;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (window.scrollY === 0 && startY) {
            const currentY = e.touches[0].clientY;
            pullDistance = currentY - startY;
            
            if (pullDistance > 0 && !isRefreshing) {
                isPulling = true;
                const indicator = document.getElementById('pullRefreshIndicator');
                
                if (pullDistance > 80) {
                    if (indicator) {
                        indicator.classList.add('active');
                        indicator.querySelector('span').textContent = 'Release to refresh';
                    }
                } else if (pullDistance > 30) {
                    if (indicator) {
                        indicator.classList.add('active');
                        indicator.querySelector('span').textContent = 'Pull to refresh';
                    }
                }
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (isPulling && pullDistance > 80 && !isRefreshing) {
            triggerRefresh();
        }
        
        const indicator = document.getElementById('pullRefreshIndicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
        
        isPulling = false;
        pullDistance = 0;
        startY = 0;
    }, { passive: true });
}

function triggerRefresh() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    const indicator = document.getElementById('pullRefreshIndicator');
    
    if (indicator) {
        indicator.classList.add('active');
        indicator.querySelector('span').textContent = 'Refreshing...';
    }
    
    // Simulate refresh (in real app, this would fetch new data)
    setTimeout(() => {
        // Add some visual feedback
        const elements = document.querySelectorAll('.event-item, .stat-item');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = 'none';
                el.offsetHeight; // Trigger reflow
                el.style.animation = 'fadeInUp 0.6s ease';
            }, index * 100);
        });
        
        if (indicator) {
            indicator.classList.remove('active');
        }
        
        isRefreshing = false;
    }, 1500);
}

// Add touch feedback to interactive elements
function addTouchFeedback() {
    const interactiveElements = document.querySelectorAll(
        '.register-btn, .cta-button, .action-btn, .mobile-event-tab, .event-item'
    );
    
    interactiveElements.forEach(element => {
        element.classList.add('touch-feedback');
        
        element.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }, { passive: true });
    });
}

// Enhanced scroll behavior for mobile
function initializeMobileScrollBehavior() {
    let lastScrollTop = 0;
    const actionBar = document.getElementById('mobileActionBar');
    
    if (!actionBar) return;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                actionBar.style.transform = 'translateY(100%)';
            } else {
                // Scrolling up
                actionBar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// Haptic feedback for mobile devices
function addHapticFeedback(element) {
    element.addEventListener('touchstart', () => {
        if (navigator.vibrate) {
            navigator.vibrate(10); // Very light vibration
        }
    }, { passive: true });
}

// Utility function to detect mobile device
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize mobile features
function initializeMobileFeatures() {
    console.log('Initializing mobile features, screen width:', window.innerWidth);
    
    if (isMobileDevice()) {
        console.log('Mobile device detected, setting up mobile features');
        initializeTouchGestures();
        initializePullToRefresh();
        addTouchFeedback();
        initializeMobileScrollBehavior();
        
        // Ensure hamburger menu is properly set up
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        if (hamburgerMenu) {
            console.log('Hamburger menu found, ensuring click handler');
            hamburgerMenu.onclick = toggleMobileMenu;
        } else {
            console.warn('Hamburger menu not found!');
        }
        
        // Add haptic feedback to important buttons
        const importantButtons = document.querySelectorAll('.cta-button, .register-btn, .action-btn.primary');
        importantButtons.forEach(btn => addHapticFeedback(btn));
        
        // Auto-hide mobile action bar after inactivity
        let inactivityTimer;
        
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            const actionBar = document.getElementById('mobileActionBar');
            if (actionBar) {
                actionBar.style.opacity = '1';
                
                inactivityTimer = setTimeout(() => {
                    actionBar.style.opacity = '0.7';
                }, 5000);
            }
        }
        
        document.addEventListener('touchstart', resetInactivityTimer, { passive: true });
        document.addEventListener('scroll', resetInactivityTimer, { passive: true });
        resetInactivityTimer();
    } else {
        console.log('Desktop device detected');
    }
}

// Enhanced theme toggle with mobile support
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    applyTheme();
    
    // Save theme preference to localStorage
    localStorage.setItem('sparx-theme', isDarkTheme ? 'dark' : 'light');
    
    // Add visual feedback for mobile
    if (window.innerWidth <= 768) {
        const themeButtons = document.querySelectorAll('.theme-toggle');
        themeButtons.forEach(btn => {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    }
    
    console.log('Theme toggled to:', isDarkTheme ? 'dark' : 'light');
}

// Export functions for debugging
window.debugTheme = {
    getCurrentTheme: () => isDarkTheme ? 'dark' : 'light',
    forceTheme: forceTheme,
    applyTheme: applyTheme,
    loadSavedTheme: loadSavedTheme
};

// Export mobile functions
window.mobileFeatures = {
    toggleMobileMenu,
    switchEventCategory,
    scrollToSection,
    triggerRefresh
};

