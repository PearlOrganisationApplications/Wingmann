import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Layout/Sidebar';
import TopNav from './components/Layout/TopNav';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Interviews from './pages/Interviews';
import PlannedDates from './pages/PlannedDates';
import Restaurants from './pages/Restaurants';
import Demographics from './pages/Demographics';
import Interviewers from './pages/Interviewers';
import Feedback from './pages/Feedback';
import Availability from './pages/Availability';
import InterviewerOverview from './pages/InterviewerOverview';
import Users from './pages/UsersPage';
import FacialAttractiveness from './pages/FacialAttractiveness';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={userRole === 'interviewer' ? "/interviewer-overview" : "/overview"} replace />;
  }
  return children;
};

const AppContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'login') return 'Welcome';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        <TopNav title={getTitle()} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-6 md:p-10 flex-1">
          <Routes>
            {/* Admin Only Routes */}
            <Route path="/overview" element={<ProtectedRoute allowedRoles={['admin']}><Overview /></ProtectedRoute>} />
            <Route path="/demographics" element={<ProtectedRoute allowedRoles={['admin']}><Demographics /></ProtectedRoute>} />
            <Route path="/interviewer-list" element={<ProtectedRoute allowedRoles={['admin']}><Interviewers /></ProtectedRoute>} />
            <Route path="/dates" element={<ProtectedRoute allowedRoles={['admin']}><PlannedDates /></ProtectedRoute>} />
            <Route path="/restaurants" element={<ProtectedRoute allowedRoles={['admin']}><Restaurants /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['admin']}><Feedback /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />

            {/* Interviewer Only Routes */}
            <Route path="/interviewer-overview" element={<ProtectedRoute allowedRoles={['interviewer']}><InterviewerOverview /> </ProtectedRoute>} />
            <Route path="/availability" element={<ProtectedRoute allowedRoles={['interviewer']}><Availability /></ProtectedRoute>} />

            {/* Shared Routes */}
            <Route path="/interviews" element={<ProtectedRoute allowedRoles={['admin', 'interviewer']}><Interviews /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to={userRole === 'interviewer' ? "/interviewer-overview" : "/overview"} />} />
            <Route path="/facial-attractiveness" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FacialAttractiveness />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <AppContent />
    </Router>
  );
}

export default App;