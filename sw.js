// Service Worker for Sparx Engineers Week 2025
const CACHE_NAME = 'sparx-2025-v1';
const STATIC_CACHE = 'sparx-static-v1';
const DYNAMIC_CACHE = 'sparx-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/registration.html',
    '/schedule.html',
    '/styles.css',
    '/script.js',
    '/registration.js',
    '/events-data.js',
    '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                // If not in cache, fetch from network
                return fetch(request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Add to dynamic cache
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                console.log('Service Worker: Caching new resource:', request.url);
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('Service Worker: Fetch failed, serving offline page if available');
                        
                        // For HTML requests, try to serve a cached page or offline fallback
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html')
                                .then(fallback => {
                                    return fallback || new Response(
                                        '<h1>Offline</h1><p>You are currently offline. Please check your internet connection.</p>',
                                        { headers: { 'Content-Type': 'text/html' } }
                                    );
                                });
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered');
    
    if (event.tag === 'registration-sync') {
        event.waitUntil(syncRegistrations());
    }
});

// Push notification handler
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from Sparx 2025!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Events',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Sparx 2025', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/index.html#events')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Sync offline registrations when back online
async function syncRegistrations() {
    try {
        // Get pending registrations from IndexedDB
        const pendingRegistrations = await getPendingRegistrations();
        
        for (const registration of pendingRegistrations) {
            try {
                // Simulate sending to server
                console.log('Syncing registration:', registration);
                
                // In a real app, you'd send this to your server
                // await fetch('/api/registrations', {
                //     method: 'POST',
                //     body: JSON.stringify(registration),
                //     headers: { 'Content-Type': 'application/json' }
                // });
                
                // Remove from pending after successful sync
                await removePendingRegistration(registration.id);
                
            } catch (error) {
                console.error('Failed to sync registration:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Helper functions for IndexedDB operations (simplified)
function getPendingRegistrations() {
    return new Promise((resolve) => {
        // Simplified - in real app, use IndexedDB
        const pending = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
        resolve(pending);
    });
}

function removePendingRegistration(id) {
    return new Promise((resolve) => {
        // Simplified - in real app, use IndexedDB
        const pending = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
        const filtered = pending.filter(reg => reg.id !== id);
        localStorage.setItem('pendingRegistrations', JSON.stringify(filtered));
        resolve();
    });
}

// Handle installation prompt
self.addEventListener('beforeinstallprompt', event => {
    console.log('Service Worker: Install prompt available');
    event.preventDefault();
    
    // Store the event for later use
    self.deferredPrompt = event;
    
    // Send message to main thread to show install button
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'INSTALL_PROMPT_AVAILABLE'
            });
        });
    });
});

// Handle successful installation
self.addEventListener('appinstalled', event => {
    console.log('Service Worker: App installed successfully');
    
    // Send analytics or show welcome message
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'APP_INSTALLED'
            });
        });
    });
});

console.log('Service Worker: Registered successfully');
