
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Sparx 2025</h1>
          <p className="hero-subtitle">Join us for an exciting week of technical and non-technical events organized by the EMAS Committee.</p>
          <Link to="/registration" className="cta-button">Register Now</Link>
        </div>
      </section>

      <section className="about">
        <div className="container">
          <h2 className="section-title">About Sparx</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Sparx is the annual technical and non-technical festival of PCCOE, organized by the EMAS Committee. It provides a platform for students to showcase their skills, learn new things, and compete with their peers.</p>
              <p>This year, we have a wide range of events in two categories: technical and non-technical. Whether you're a coding enthusiast, a design wizard, or a creative thinker, there's something for everyone at Sparx 2025.</p>
            </div>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">7</div>
                <div className="stat-label">Events</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2</div>
                <div className="stat-label">Days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      <section id="contact" className="contact">
        <div className="container">
            <h2 className="section-title">Contact Us</h2>
            <p style={{fontSize: '1.1rem', marginBottom: '2rem'}}>Have questions? Get in touch with the EMAS Committee</p>
            <div className="contact-info">
                <div className="contact-item">
                    <h4>Event Coordinator</h4>
                    <p>Arya Pednekar/ Kaustubh Aware</p>
                    <p><a href="tel:+91 93569 00135">+91 93569 00135</a>/ <a href="tel:+91 72498 99185">+91 72498 99185</a></p>
                </div>
                <div className="contact-item">
                    <h4>Developer</h4>
                    <p>Om Zend</p>
                    <p><a href="tel:++91 77968 37712">+91 77968 37712</a></p>
                </div>
                <div className="contact-item">
                    <h4>General Inquiries</h4>
                    <p>Janvi Shinde/ Neha Mutha</p>
                    <p><a href="tel:+91 93253 15166">+91 93253 15166</a>/ <a href="tel:+91 76668 35442">+91 76668 35442</a></p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
