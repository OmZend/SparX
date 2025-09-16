import React from 'react';
import './Schedule.css';
import { scheduleData } from '../data/events';

const Schedule = () => {
  return (
    <div className="schedule-page">
      <section className="schedule-hero">
        <div className="container">
          <h1 className="section-title">Event Schedule</h1>
          <p className="events-subtitle">Join us for two exciting days of technical and non-technical events</p>
        </div>
      </section>

      <main className="schedule-main">
        <div className="container">
          {Object.values(scheduleData).map((day, index) => (
            <div key={index} className="day-schedule">
              <h2 className="day-title">{day.title}</h2>
              <div className="schedule-container">
                {day.events.map((event, eventIndex) => (
                  <div key={eventIndex} className="timeline-item">
                    <div className="time-slot">{event.time}</div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Schedule;