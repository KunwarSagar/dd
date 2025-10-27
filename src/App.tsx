import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import FeedsOverview from './components/FeedsOverview';
import AlertsMonitor from './components/AlertsMonitor';
import Settings from './components/Settings';

const AppContent: React.FC = () => {
  const location = useLocation();
  
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Dashboard Overview', subtitle: 'Real-time monitoring of feed generation and transfer' };
      case '/feeds':
        return { title: 'Feeds Overview', subtitle: 'Monitor and manage all data feeds' };
      case '/alerts':
        return { title: 'Alerts Monitor', subtitle: 'Monitor and manage system alerts and notifications' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Configure dashboard and monitoring settings' };
      default:
        return { title: 'Monitor Dashboard', subtitle: 'Feed monitoring system' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="App d-flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="main-content flex-grow-1">
        <TopHeader title={title} subtitle={subtitle} />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/feeds" element={<FeedsOverview />} />
            <Route path="/alerts" element={<AlertsMonitor />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
