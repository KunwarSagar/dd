import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      path: '/',
      icon: 'bi-speedometer2',
      label: 'Dashboard',
      description: 'Overview & Analytics',
      color: '#4F46E5'
    },
    {
      path: '/feeds',
      icon: 'bi-rss',
      label: 'Feeds',
      description: 'Data Management',
      color: '#059669'
    },
    {
      path: '/alerts',
      icon: 'bi-exclamation-triangle',
      label: 'Alerts',
      description: 'System Monitoring',
      color: '#DC2626'
    },
    {
      path: '/settings',
      icon: 'bi-gear',
      label: 'Settings',
      description: 'Configuration',
      color: '#7C3AED'
    }
  ];

  return (
    <div className="modern-sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <i className="bi bi-graph-up"></i>
        </div>
        <div className="brand-content">
          <h1 className="brand-title">Monitor</h1>
          <span className="brand-subtitle">Dashboard v2.1</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-label">MAIN MENU</span>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              style={isActive(item.path) ? { '--accent-color': item.color } as React.CSSProperties : {}}
            >
              <div className="nav-item-content">
                <div className="nav-icon-wrapper">
                  <i className={`bi ${item.icon} nav-icon`}></i>
                </div>
                <div className="nav-text">
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                </div>
              </div>
              <div className="nav-indicator"></div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="sidebar-stats">
        <div className="stats-header">
          <span className="stats-title">SYSTEM STATUS</span>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon online">
              <i className="bi bi-circle-fill"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Online</span>
              <span className="stat-value">99.2%</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon active">
              <i className="bi bi-lightning-fill"></i>
            </div>
            <div className="stat-content">
              <span className="stat-label">Active</span>
              <span className="stat-value">25 feeds</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-profile">
        <div className="profile-content">
          <div className="profile-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          <div className="profile-info">
            <span className="profile-name">System Admin</span>
            <span className="profile-role">Administrator</span>
          </div>
        </div>
        <button className="profile-more">
          <i className="bi bi-three-dots"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;