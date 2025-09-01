// Events and Schedule Renderer
class EventsRenderer {
    constructor() {
        this.init();
    }

    init() {
        this.renderEvents();
        this.renderSchedule();
    }

    renderEvents() {
        const eventsGrid = document.querySelector('.events-grid');
        if (!eventsGrid) return;

        eventsGrid.innerHTML = `
            <!-- Technical Events -->
            <div class="event-category">
                <div class="category-header">
                    <h3 class="category-title">Technical Events</h3>
                    <p>Showcase your technical prowess</p>
                </div>
                <div class="event-list">
                    ${this.renderEventList(eventsData.technical)}
                </div>
            </div>

            <!-- Non-Technical Events -->
            <div class="event-category">
                <div class="category-header">
                    <h3 class="category-title">Non-Technical Events</h3>
                    <p>Express your creativity and skills</p>
                </div>
                <div class="event-list">
                    ${this.renderEventList(eventsData.nonTechnical)}
                </div>
            </div>
        `;
    }

    renderEventList(events) {
        return events.map(event => `
            <div class="event-item">
                <div class="event-info">
                    <h4>${event.name}</h4>
                    <p class="event-time">${event.time}</p>
                </div>
                <button class="register-btn" onclick="registerForEvent('${event.name}')">Register</button>
            </div>
        `).join('');
    }

    renderSchedule() {
        const scheduleContainer = document.querySelector('.schedule-container');
        if (!scheduleContainer) return;

        scheduleContainer.innerHTML = Object.values(scheduleData).map(day => `
            <div class="day-schedule">
                <h3 class="day-title">${day.title}</h3>
                ${day.events.map(event => `
                    <div class="timeline-item">
                        <div class="time-slot">${event.time}</div>
                        <div class="event-details">
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    // Add new event dynamically
    addEvent(category, event) {
        if (category === 'technical') {
            eventsData.technical.push(event);
        } else if (category === 'nonTechnical') {
            eventsData.nonTechnical.push(event);
        }
        this.renderEvents();
    }

    // Remove event dynamically
    removeEvent(category, eventName) {
        if (category === 'technical') {
            eventsData.technical = eventsData.technical.filter(e => e.name !== eventName);
        } else if (category === 'nonTechnical') {
            eventsData.nonTechnical = eventsData.nonTechnical.filter(e => e.name !== eventName);
        }
        this.renderEvents();
    }

    // Update event details
    updateEvent(category, eventName, updates) {
        let eventList = category === 'technical' ? eventsData.technical : eventsData.nonTechnical;
        const eventIndex = eventList.findIndex(e => e.name === eventName);
        
        if (eventIndex !== -1) {
            eventList[eventIndex] = { ...eventList[eventIndex], ...updates };
            this.renderEvents();
        }
    }

    // Get event statistics
    getEventStats() {
        const totalTechnical = eventsData.technical.length;
        const totalNonTechnical = eventsData.nonTechnical.length;
        const totalEvents = totalTechnical + totalNonTechnical;
        
        return {
            totalEvents,
            technicalEvents: totalTechnical,
            nonTechnicalEvents: totalNonTechnical,
            technicalPercentage: ((totalTechnical / totalEvents) * 100).toFixed(1),
            nonTechnicalPercentage: ((totalNonTechnical / totalEvents) * 100).toFixed(1)
        };
    }

    // Search events
    searchEvents(query) {
        const allEvents = [...eventsData.technical, ...eventsData.nonTechnical];
        return allEvents.filter(event => 
            event.name.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter events by day
    filterEventsByDay(dayNumber) {
        const dayKey = `day${dayNumber}`;
        return scheduleData[dayKey] ? scheduleData[dayKey].events : [];
    }

    // Get events by time
    getEventsByTime(time) {
        const allEvents = [...eventsData.technical, ...eventsData.nonTechnical];
        return allEvents.filter(event => event.time.includes(time));
    }
}

// Initialize events renderer
let eventsRenderer;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    eventsRenderer = new EventsRenderer();
});

// Utility functions for external use
function addNewEvent(category, event) {
    if (eventsRenderer) {
        eventsRenderer.addEvent(category, event);
    }
}

function removeEvent(category, eventName) {
    if (eventsRenderer) {
        eventsRenderer.removeEvent(category, eventName);
    }
}

function updateEvent(category, eventName, updates) {
    if (eventsRenderer) {
        eventsRenderer.updateEvent(category, eventName, updates);
    }
}

function searchEvents(query) {
    if (eventsRenderer) {
        return eventsRenderer.searchEvents(query);
    }
    return [];
}

function getEventStats() {
    if (eventsRenderer) {
        return eventsRenderer.getEventStats();
    }
    return null;
}
