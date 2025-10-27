import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand>
          <i className="bi bi-graph-up me-2"></i>
          Monitor Dashboard
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={isActive('/') ? 'active' : ''}>
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/feeds" className={isActive('/feeds') ? 'active' : ''}>
              <i className="bi bi-rss me-1"></i>
              Feeds Overview
            </Nav.Link>
            <Nav.Link as={Link} to="/alerts" className={isActive('/alerts') ? 'active' : ''}>
              <i className="bi bi-exclamation-triangle me-1"></i>
              Alerts Monitor
            </Nav.Link>
            <Nav.Link as={Link} to="/settings" className={isActive('/settings') ? 'active' : ''}>
              <i className="bi bi-gear me-1"></i>
              Settings
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item className="d-flex align-items-center text-light me-3">
              <small>
                <i className="bi bi-circle-fill text-success me-1" style={{ fontSize: '0.5rem' }}></i>
                System Online
              </small>
            </Nav.Item>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;