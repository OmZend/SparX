import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";
import { eventsData } from "../data/events";

const Events = () => {
  const [filter, setFilter] = useState("all");
  const [expandedEventId, setExpandedEventId] = useState(null);
  const navigate = useNavigate();

  // Add category explicitly to each event
  const technicalEvents = eventsData.technical.map(evt => ({
    ...evt,
    category: "technical",
  }));
  const nonTechnicalEvents = eventsData.nonTechnical.map(evt => ({
    ...evt,
    category: "nonTechnical",
  }));

  const allEvents = [...technicalEvents, ...nonTechnicalEvents];

  // Filtered events
  const filteredEvents =
    filter === "all"
      ? allEvents
      : filter === "technical"
      ? technicalEvents
      : nonTechnicalEvents;

  const toggleDetails = (evtId) => {
    setExpandedEventId(prev => (prev === evtId ? null : evtId));
  };

  // Dynamic stats
  const totalEvents = allEvents.length;
  const categoriesCount = 2; // since you have technical + nonTechnical
  const totalDays = 2; // hardcoded unless you calculate from scheduleData

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="container">
          <div className="events-hero-content">
            <h1>Sparx 2025 Events</h1>
            <p className="events-subtitle">
              Discover exciting competitions, workshops, and activities across
              multiple categories. Join us for an unforgettable experience!
            </p>
            <div className="events-stats">
              <div className="stat-card">
                <div className="stat-number">{totalEvents}</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{categoriesCount}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{totalDays}</div>
                <div className="stat-label">Days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="events-filter">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Events
            </button>
            <button
              className={`filter-btn ${filter === "technical" ? "active" : ""}`}
              onClick={() => setFilter("technical")}
            >
              Technical
            </button>
            <button
              className={`filter-btn ${
                filter === "nonTechnical" ? "active" : ""
              }`}
              onClick={() => setFilter("nonTechnical")}
            >
              Non-Technical
            </button>
          </div>
        </div>
      </section>

      {/* Events Showcase */}
      <section className="events-showcase">
        <div className="container">
          <div className="events-detailed-grid">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="event-category-detailed"
                data-category={evt.category}
              >
                <div className="category-header-detailed">
                  <div className="category-icon">
                    {evt.category === "technical" ? "💻" : "🎉"}
                  </div>
                  <h3 className="category-title">{evt.name}</h3>
                  <p className="category-description">{evt.description}</p>
                </div>
                <div className="event-list-detailed">
                  <div className="event-item-detailed">
                    <div className="event-main-info">
                      <h4>{evt.name}</h4>
                      <p className="event-description">{evt.description}</p>
                      <div className="event-meta">
                        <span className="event-time">🗓️ {evt.time}</span>
                        <span className="event-fee">💰 ₹{evt.fee}</span>
                      </div>
                    </div>
                    <div className="event-actions">
                      <button
                        className="register-btn"
                        onClick={() =>
                          navigate("/registration", {
                            state: { preselectEvent: evt.name },
                          })
                        }
                      >
                        Register
                      </button>
                      <button
                        type="button"
                        className="info-btn"
                        onClick={() => toggleDetails(evt.id)}
                        aria-expanded={expandedEventId === evt.id}
                        aria-controls={`details-${evt.id}`}
                      >
                        {expandedEventId === evt.id ? "Hide Details" : "Details"}
                      </button>
                    </div>
                  </div>
                  {expandedEventId === evt.id && (
                    <div id={`details-${evt.id}`} className="event-details-inline">
                      <h4>Rules & Guidelines</h4>
                      <ul>
                        {evt.rules?.map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                      <p><strong>Time:</strong> {evt.time}</p>
                      <p><strong>Fee:</strong> ₹{evt.fee}</p>
                      <p><strong>Coordinator:</strong> {evt.coordinator}</p>
                      <button
                        className="register-btn"
                        onClick={() =>
                          navigate("/registration", { state: { preselectEvent: evt.name } })
                        }
                      >
                        Register for this Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Inline details used instead of modal */}
        </div>
      </section>
    </div>
  );
};

export default Events;
