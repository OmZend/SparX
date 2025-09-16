
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [editingRegistration, setEditingRegistration] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin');
      }
    });
    return unsubscribe;
  }, [auth, navigate]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'registrations'));
      const regs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by timestamp desc (latest first). If missing, push to end
      const sorted = regs.sort((a, b) => {
        const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        return tb - ta;
      });
      setRegistrations(sorted);
      setFilteredRegistrations(sorted);
      setLoading(false);
    };

    fetchRegistrations();
  }, [db]);

  useEffect(() => {
    let filtered = registrations;

    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.college.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter(reg => reg.events.includes(eventFilter));
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(reg => (reg.paymentMethod || '').toLowerCase() === paymentFilter);
    }

    setFilteredRegistrations(filtered);
  }, [searchTerm, eventFilter, paymentFilter, registrations]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  const handleApprove = async (id) => {
    const regRef = doc(db, 'registrations', id);
    await updateDoc(regRef, { status: 'approved' });
    // Refresh local state
    setRegistrations(registrations.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      await deleteDoc(doc(db, 'registrations', id));
      setRegistrations(registrations.filter(r => r.id !== id));
    }
  };

  const handleEdit = (registration) => {
    setEditingRegistration(registration);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const regRef = doc(db, 'registrations', editingRegistration.id);
    await updateDoc(regRef, editingRegistration);
    setRegistrations(registrations.map(r => r.id === editingRegistration.id ? editingRegistration : r));
    setEditingRegistration(null);
  };

  const exportToCsv = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'College', 'Year', 'Branch', 'Events', 'Team Members', 'Total Fee', 'Payment Method', 'Screenshot URL', 'Registration Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.fullName,
        reg.email,
        reg.phone,
        reg.college,
        reg.year || '',
        reg.branch || '',
        reg.events.join('; '),
        (reg.teamMembers || '').replace(/\n/g, ' '),
        reg.totalFee,
        reg.paymentMethod,
        reg.paymentScreenshotUrl,
        reg.timestamp,
        reg.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sparx_registrations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allEvents = [...new Set(registrations.flatMap(r => r.events))];

 return (
    <div className="admin-dashboard-page">
      <header className="admin-header">
        <div className="container">
          <nav className="admin-nav">
            <div className="logo">SparX Admin</div>
            <div className="admin-controls">
              <button onClick={exportToCsv} className="export-btn">Export to CSV</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="container">
          <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p>Manage registrations for Sparx Engineers Week 2025</p>

            <div className="search-container">
              <input
                type="text"
                className="admin-search-input" // <-- This ID was added
                placeholder="Search by name, email, or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-container">
              <h3>Filter by Event:</h3>
              <div className="event-filter-buttons">
                <button
                  className={`filter-btn ${eventFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setEventFilter('all')}
                >
                  All Events
                </button>
                {allEvents.map(event => (
                  <button
                    key={event}
                    className={`filter-btn ${eventFilter === event ? 'active' : ''}`}
                    onClick={() => setEventFilter(event)}
                  >
                    {event}
                  </button>
                ))}
              </div>
              <h3>Filter by Payment Method:</h3>
              <div className="event-filter-buttons">
                <button
                  className={`filter-btn ${paymentFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setPaymentFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${paymentFilter === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentFilter('cash')}
                >
                  Cash
                </button>
                <button
                  className={`filter-btn ${paymentFilter === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentFilter('upi')}
                >
                  UPI
                </button>
              </div>
            </div>

            <div className="registrations-table-container">
              <div className="fee-summary" style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1rem'}}>
                <div style={{background:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                  <strong>Total Fee (All): </strong>
                  ₹{filteredRegistrations.reduce((sum, r) => sum + (Number(r.totalFee) || 0), 0)}
                </div>
                <div style={{background:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                  <strong>Total Fee (Cash): </strong>
                  ₹{filteredRegistrations.filter(r => (r.paymentMethod||'').toLowerCase()==='cash').reduce((sum, r) => sum + (Number(r.totalFee) || 0), 0)}
                </div>
                <div style={{background:'#fff', borderRadius:'8px', padding:'0.75rem 1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                  <strong>Total Fee (UPI): </strong>
                  ₹{filteredRegistrations.filter(r => (r.paymentMethod||'').toLowerCase()==='upi').reduce((sum, r) => sum + (Number(r.totalFee) || 0), 0)}
                </div>
              </div>
              {loading ? (
                <div className="loading-indicator">Loading registrations...</div>
              ) : (
                <table className="registrations-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>College</th>
                      <th>Year</th>
                      <th>Branch</th>
                      <th>Events</th>
                      <th>Team Members</th>
                      <th>Total Fee</th>
                      <th>Payment Method</th>
                      <th>Screenshot</th>
                      <th>Registration Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.length > 0 ? (
                      filteredRegistrations.map((reg, idx) => (
                        <tr key={reg.id}>
                          <td>{idx + 1}</td>
                          <td>{reg.fullName}</td>
                          <td>{reg.email}</td>
                          <td>{reg.phone}</td>
                          <td>{reg.college}</td>
                          <td>{reg.year || '—'}</td>
                          <td>{reg.branch || '—'}</td>
                          <td>{reg.events.join(', ')}</td>
                          <td style={{maxWidth: '240px', whiteSpace: 'pre-wrap'}}>{reg.teamMembers || '—'}</td>
                          <td>₹{reg.totalFee}</td>
                          <td>{reg.paymentMethod}</td>
                          <td>
                            {reg.paymentScreenshotUrl ? (
                              <a href={reg.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer" className="screenshot-link">View</a>
                            ) : 'N/A'}
                          </td>
                          <td>{new Date(reg.timestamp).toLocaleString()}</td>
                          <td>
                            <span className={`status-${reg.status || 'pending'}`}>{reg.status || 'pending'}</span>
                          </td>
                          <td className="actions-cell">
                            {reg.status !== 'approved' && (
                              <button onClick={() => handleApprove(reg.id)} className="action-btn approve-btn">Approve</button>
                            )}
                            <button onClick={() => handleEdit(reg)} className="action-btn edit-btn">Edit</button>
                            <button onClick={() => handleDelete(reg.id)} className="action-btn delete-btn">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="no-data-message">No registrations found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {editingRegistration && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <div className="edit-modal-header">
              <h2>Edit Registration</h2>
              <span className="close-modal" onClick={() => setEditingRegistration(null)}>&times;</span>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editingRegistration.fullName}
                  onChange={(e) => setEditingRegistration({ ...editingRegistration, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingRegistration.email}
                  onChange={(e) => setEditingRegistration({ ...editingRegistration, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={editingRegistration.phone}
                  onChange={(e) => setEditingRegistration({ ...editingRegistration, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>College</label>
                <input
                  type="text"
                  value={editingRegistration.college}
                  onChange={(e) => setEditingRegistration({ ...editingRegistration, college: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingRegistration.status || 'pending'}
                  onChange={(e) => setEditingRegistration({ ...editingRegistration, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button type="submit" className="save-btn">Update Registration</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
