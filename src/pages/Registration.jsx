import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Registration.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventsData } from '../data/events';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    year: '',
    branch: '',
    paymentMethod: '',
    teamMembers: ''
  });
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [paymentSection, setPaymentSection] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file selected');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const allEvents = [...eventsData.technical, ...eventsData.nonTechnical];

  useEffect(() => {
    const newTotalFee = selectedEvents.reduce((sum, eventName) => {
      const event = allEvents.find(e => e.name === eventName);
      return sum + (event ? event.fee : 0);
    }, 0);
    setTotalFee(newTotalFee);
  }, [selectedEvents]);

  // Preselect an event when navigated from Events page
  useEffect(() => {
    const preselected = location.state && location.state.preselectEvent;
    if (preselected) {
      setSelectedEvents(prev => (prev.includes(preselected) ? prev : [...prev, preselected]));
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.paymentMethod === 'upi' && totalFee > 0) {
      setPaymentSection(true);
    } else {
      setPaymentSection(false);
    }
  }, [formData.paymentMethod, totalFee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEventToggle = (eventName) => {
    setSelectedEvents(prev => 
      prev.includes(eventName) 
        ? prev.filter(name => name !== eventName)
        : [...prev, eventName]
    );
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = '';
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName('No file selected');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9][0-9]{9}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits starting with 6-9';
    if (!formData.college.trim()) newErrors.college = 'College is required';
    if (!formData.year) newErrors.year = 'Year of study is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (selectedEvents.length === 0) newErrors.events = 'Select at least one event';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (formData.paymentMethod === 'upi' && totalFee > 0 && !file) newErrors.paymentScreenshot = 'Payment screenshot is required for UPI';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('upload_preset', 'screenshots'); // Use your upload preset

    const response = await fetch(`https://api.cloudinary.com/v1_1/dep7h2nxe/image/upload`, {
      method: 'POST',
      body: formDataUpload
    });

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    let screenshotUrl = '';

    try {
      if (formData.paymentMethod === 'upi' && totalFee > 0) {
        screenshotUrl = await uploadToCloudinary(file);
      }

      const registrationData = {
        ...formData,
        events: selectedEvents,
        totalFee,
        paymentScreenshotUrl: screenshotUrl,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'registrations'), registrationData);
      setSuccess(true);
      alert('Registration submitted successfully! We\'ll contact you with further details.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error submitting registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <section className="registration-hero">
        <div className="container">
          <h1>Event Registration</h1>
          <p>Join us for an exciting week of technical and non-technical events</p>
          <Link to="/" className="back-to-home">Back to Home</Link>
        </div>
      </section>

      <main className="registration-page">
        <div className="container">
          <div className="registration-container">
            <div className="registration-form">
              <div className="form-header">
                <h2>Registration Form</h2>
                <p>Fill in your details to register for events</p>
              </div>

              <div className="form-note">
                <p><strong>Note:</strong> Fields marked with * are required. You can select multiple events.</p>
              </div>

              {success && (
                <div className="success-message">
                  Registration successful! We'll contact you with further details.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName" className="required-field">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.fullName && <div className="field-error">{errors.fullName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="required-field">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.email && <div className="field-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="required-field">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      required
                    />
                    {errors.phone && <div className="field-error">{errors.phone}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="college" className="required-field">College/University</label>
                    <input
                      type="text"
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.college && <div className="field-error">{errors.college}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="year" className="required-field">Year of Study</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="5th">NA</option>
                      <option value="postgrad">Post Graduate</option>
                    </select>
                    {errors.year && <div className="field-error">{errors.year}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="branch" className="required-field">Branch/Department</label>
                    <input
                      type="text"
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.branch && <div className="field-error">{errors.branch}</div>}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="required-field">Select Events to Register</label>
                  {errors.events && <div className="field-error">{errors.events}</div>}
                  <div className="checkbox-group">
                    {allEvents.map((event) => (
                      <div key={event.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={event.id}
                          name="events"
                          value={event.name}
                          checked={selectedEvents.includes(event.name)}
                          onChange={() => handleEventToggle(event.name)}
                        />
                        <label htmlFor={event.id}>{event.name} - ₹{event.fee}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="paymentMethod" className="required-field">Payment Method</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                  </select>
                  {errors.paymentMethod && <div className="field-error">{errors.paymentMethod}</div>}
                </div>

                <div className="fee-display">
                  <h3>Registration Fee</h3>
                  <div className="total-fee">₹{totalFee}</div>
                </div>

                {paymentSection && (
                  <div id="paymentSection" className="payment-section">
                    <h3>Payment Details</h3>
                    <div className="upi-details">
                      <p><strong>UPI ID:</strong> omzend8@oksbi</p>
                      <p><strong>QR Code:</strong></p>
                      <div className="qr-code">
                        <img src="qr-code.png" alt="QR Code" style={{width: '150px', height: '150px'}} />
                      </div>
                      <div className="upload-container">
                        <p className="upload-title">📷 Payment Screenshot Upload</p>
                        <p className="upload-description">After completing the UPI payment, upload a screenshot of the transaction for verification.</p>
                        <input
                          type="file"
                          id="paymentScreenshot"
                          accept="image/*"
                          onChange={handleFileChange}
                          required={paymentSection}
                          style={{ display: 'none' }} // Hide the default input
                        />
                        <label htmlFor="paymentScreenshot" className="custom-file-upload">
                          Choose File
                        </label>
                        <span id="fileName" className="file-name">{fileName}</span>
                      </div>
                      {errors.paymentScreenshot && <div className="field-error">{errors.paymentScreenshot}</div>}
                    </div>
                  </div>
                )}

                <div className="form-group full-width">
                  <label htmlFor="teamMembers">Team Members (if applicable)</label>
                  <textarea
                    id="teamMembers"
                    name="teamMembers"
                    rows="4"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    placeholder="Enter team member names and contact details"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registration;