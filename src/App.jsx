import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Events from './pages/Events';
import Registration from './pages/Registration';
import Schedule from './pages/Schedule';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const location = useLocation();
  const showHeader = !['/admin', '/admin-dashboard'].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;