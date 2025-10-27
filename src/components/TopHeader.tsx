import React, { useState } from 'react';
import { Navbar, Container, Dropdown, Badge, Button } from 'react-bootstrap';

interface TopHeaderProps {
  title?: string;
  subtitle?: string;
}

const TopHeader: React.FC<TopHeaderProps> = ({ title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Add logic to toggle sidebar visibility on mobile
    const sidebar = document.querySelector('.modern-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('show');
    }
  };

  return (
    <Navbar className="modern-top-header shadow-sm py-3">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile Menu Toggle */}
            <Button
              variant="outline-secondary"
              size="sm"
              className="d-lg-none me-3 mobile-toggle"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list"></i>
            </Button>
            
            <div>
              {title && <h4 className="mb-0 page-title">{title}</h4>}
              {subtitle && <p className="text-muted mb-0 small page-subtitle">{subtitle}</p>}
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <div className="search-container d-none d-md-block">
              <div className="search-input-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search feeds, alerts..."
                />
              </div>
            </div>

            {/* Notifications */}
            <Dropdown>
              <Dropdown.Toggle variant="" className="notification-toggle position-relative" id="notifications-dropdown">
                <i className="bi bi-bell"></i>
                <Badge bg="danger" className="notification-badge">
                  3
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="notification-dropdown shadow-lg">
                <Dropdown.Header className="notification-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Notifications</span>
                    <Badge bg="primary" className="notification-count">3</Badge>
                  </div>
                </Dropdown.Header>
                <div className="notification-list">
                  <Dropdown.Item className="notification-item">
                    <div className="d-flex">
                      <div className="notification-icon warning">
                        <i className="bi bi-exclamation-triangle"></i>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">Feed Delay Alert</div>
                        <div className="notification-message">Daily Report 5 is delayed by 15 minutes</div>
                        <div className="notification-time">2 minutes ago</div>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="notification-item">
                    <div className="d-flex">
                      <div className="notification-icon error">
                        <i className="bi bi-x-circle"></i>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">Transfer Failed</div>
                        <div className="notification-message">Client A feed transfer failed</div>
                        <div className="notification-time">5 minutes ago</div>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item className="notification-item">
                    <div className="d-flex">
                      <div className="notification-icon success">
                        <i className="bi bi-check-circle"></i>
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">System Updated</div>
                        <div className="notification-message">Dashboard updated to v2.1.0</div>
                        <div className="notification-time">1 hour ago</div>
                      </div>
                    </div>
                  </Dropdown.Item>
                </div>
                <Dropdown.Divider />
                <Dropdown.Item className="text-center notification-footer">
                  View All Notifications
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile */}
            <Dropdown>
              <Dropdown.Toggle variant="" className="profile-toggle" id="user-dropdown">
                <div className="profile-avatar-small">
                  <i className="bi bi-person-circle"></i>
                </div>
                <span className="profile-name d-none d-sm-inline">Admin</span>
                <i className="bi bi-chevron-down profile-chevron"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end" className="profile-dropdown shadow-lg">
                <div className="profile-header">
                  <div className="profile-avatar-large">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="profile-details">
                    <div className="profile-name">System Admin</div>
                    <div className="profile-email">admin@company.com</div>
                  </div>
                </div>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <i className="bi bi-person me-2"></i>
                  Profile Settings
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="bi bi-gear me-2"></i>
                  Preferences
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="bi bi-question-circle me-2"></i>
                  Help & Support
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default TopHeader;