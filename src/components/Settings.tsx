import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    refreshInterval: 30,
    showNotifications: true,
    alertThreshold: 'medium',
    autoRefresh: true,
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    slackIntegration: false,
    maxRetries: 3,
    timeoutDuration: 300,
    logLevel: 'info'
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings({
      refreshInterval: 30,
      showNotifications: true,
      alertThreshold: 'medium',
      autoRefresh: true,
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      slackIntegration: false,
      maxRetries: 3,
      timeoutDuration: 300,
      logLevel: 'info'
    });
  };

  return (
    <div className="py-4 px-4">
      {showSaveAlert && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          Settings saved successfully!
        </Alert>
      )}

      <Row>
        <Col lg={3} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h6 className="mb-0">Configuration Sections</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('general')}
                >
                  <i className="bi bi-gear me-2"></i>
                  General Settings
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'alerts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('alerts')}
                >
                  <i className="bi bi-bell me-2"></i>
                  Alert Configuration
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Notifications
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'performance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('performance')}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Performance
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'system' ? 'active' : ''}`}
                  onClick={() => setActiveTab('system')}
                >
                  <i className="bi bi-server me-2"></i>
                  System
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {activeTab === 'general' && (
                <div>
                  <h5 className="mb-4">General Settings</h5>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Auto Refresh Data</Form.Label>
                        <Form.Check
                          type="switch"
                          id="auto-refresh"
                          checked={settings.autoRefresh}
                          onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                          label="Enable automatic data refresh"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Refresh Interval (seconds)</Form.Label>
                        <Form.Select
                          value={settings.refreshInterval}
                          onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                          disabled={!settings.autoRefresh}
                        >
                          <option value={15}>15 seconds</option>
                          <option value={30}>30 seconds</option>
                          <option value={60}>1 minute</option>
                          <option value={300}>5 minutes</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Theme</Form.Label>
                        <Form.Select
                          value={settings.theme}
                          onChange={(e) => handleSettingChange('theme', e.target.value)}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto (System)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Show Desktop Notifications</Form.Label>
                        <Form.Check
                          type="switch"
                          id="notifications"
                          checked={settings.showNotifications}
                          onChange={(e) => handleSettingChange('showNotifications', e.target.checked)}
                          label="Enable browser notifications"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}

              {activeTab === 'alerts' && (
                <div>
                  <h5 className="mb-4">Alert Configuration</h5>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Alert Threshold</Form.Label>
                        <Form.Select
                          value={settings.alertThreshold}
                          onChange={(e) => handleSettingChange('alertThreshold', e.target.value)}
                        >
                          <option value="low">Low - Show all alerts</option>
                          <option value="medium">Medium - Show medium+ alerts</option>
                          <option value="high">High - Show high+ alerts only</option>
                          <option value="critical">Critical - Show critical alerts only</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Minimum severity level for displaying alerts
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Maximum Retries</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="10"
                          value={settings.maxRetries}
                          onChange={(e) => handleSettingChange('maxRetries', parseInt(e.target.value))}
                        />
                        <Form.Text className="text-muted">
                          Number of retries before marking feed as failed
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Current Alert Rules:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Generation delay &gt; 30 minutes: High priority</li>
                      <li>Transfer delay &gt; 15 minutes: Medium priority</li>
                      <li>Feed failure: Critical priority</li>
                      <li>Connection timeout: Medium priority</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h5 className="mb-4">Notification Settings</h5>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Card className="border-light">
                        <Card.Body>
                          <h6 className="d-flex align-items-center">
                            <i className="bi bi-envelope-fill me-2 text-primary"></i>
                            Email Notifications
                            {settings.emailNotifications && <Badge bg="success" className="ms-2">Enabled</Badge>}
                          </h6>
                          <Form.Check
                            type="switch"
                            id="email-notifications"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                            label="Send email alerts"
                          />
                          {settings.emailNotifications && (
                            <div className="mt-2">
                              <Form.Control
                                type="email"
                                placeholder="admin@company.com"
                                size="sm"
                              />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="border-light">
                        <Card.Body>
                          <h6 className="d-flex align-items-center">
                            <i className="bi bi-phone-fill me-2 text-success"></i>
                            SMS Notifications
                            {settings.smsNotifications && <Badge bg="success" className="ms-2">Enabled</Badge>}
                          </h6>
                          <Form.Check
                            type="switch"
                            id="sms-notifications"
                            checked={settings.smsNotifications}
                            onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                            label="Send SMS alerts"
                          />
                          {settings.smsNotifications && (
                            <div className="mt-2">
                              <Form.Control
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                size="sm"
                              />
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Card className="border-light">
                        <Card.Body>
                          <h6 className="d-flex align-items-center">
                            <i className="bi bi-slack me-2 text-info"></i>
                            Slack Integration
                            {settings.slackIntegration && <Badge bg="success" className="ms-2">Connected</Badge>}
                          </h6>
                          <Form.Check
                            type="switch"
                            id="slack-integration"
                            checked={settings.slackIntegration}
                            onChange={(e) => handleSettingChange('slackIntegration', e.target.checked)}
                            label="Send alerts to Slack"
                          />
                          {settings.slackIntegration && (
                            <div className="mt-2">
                              <Button variant="outline-primary" size="sm">
                                <i className="bi bi-slack me-1"></i>
                                Configure Webhook
                              </Button>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}

              {activeTab === 'performance' && (
                <div>
                  <h5 className="mb-4">Performance Settings</h5>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Request Timeout (seconds)</Form.Label>
                        <Form.Control
                          type="number"
                          min="30"
                          max="600"
                          value={settings.timeoutDuration}
                          onChange={(e) => handleSettingChange('timeoutDuration', parseInt(e.target.value))}
                        />
                        <Form.Text className="text-muted">
                          Maximum time to wait for API responses
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Log Level</Form.Label>
                        <Form.Select
                          value={settings.logLevel}
                          onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                        >
                          <option value="error">Error</option>
                          <option value="warn">Warning</option>
                          <option value="info">Info</option>
                          <option value="debug">Debug</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Minimum log level to capture
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Performance Tips:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Lower refresh intervals may impact system performance</li>
                      <li>Debug logging can significantly increase log file sizes</li>
                      <li>Higher timeout values may delay error detection</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div>
                  <h5 className="mb-4">System Information</h5>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <h6>Application Info</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Version:</strong></td>
                            <td>v2.1.0</td>
                          </tr>
                          <tr>
                            <td><strong>Build:</strong></td>
                            <td>20241016.1</td>
                          </tr>
                          <tr>
                            <td><strong>Environment:</strong></td>
                            <td><Badge bg="success">Production</Badge></td>
                          </tr>
                          <tr>
                            <td><strong>Last Updated:</strong></td>
                            <td>October 16, 2024</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col md={6}>
                      <h6>System Status</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Uptime:</strong></td>
                            <td>99.2%</td>
                          </tr>
                          <tr>
                            <td><strong>API Status:</strong></td>
                            <td><Badge bg="success">Online</Badge></td>
                          </tr>
                          <tr>
                            <td><strong>Database:</strong></td>
                            <td><Badge bg="success">Connected</Badge></td>
                          </tr>
                          <tr>
                            <td><strong>Cache:</strong></td>
                            <td><Badge bg="success">Active</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2">
                    <Button variant="outline-info">
                      <i className="bi bi-download me-1"></i>
                      Export Logs
                    </Button>
                    <Button variant="outline-warning">
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Clear Cache
                    </Button>
                    <Button variant="outline-secondary">
                      <i className="bi bi-info-circle me-1"></i>
                      System Report
                    </Button>
                  </div>
                </div>
              )}

              <hr className="my-4" />
              
              <div className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={handleResetSettings}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Reset to Defaults
                </Button>
                <Button variant="primary" onClick={handleSaveSettings}>
                  <i className="bi bi-check-lg me-1"></i>
                  Save Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;