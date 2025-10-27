import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Form, InputGroup, Button, Alert as BootstrapAlert, Modal } from 'react-bootstrap';
import { Alert } from '../types';
import { api } from '../services/api';
import { format } from 'date-fns';

const AlertsMonitor: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAcknowledged, setShowAcknowledged] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const alertsData = await api.getAlerts();
        setAlerts(alertsData);
        setFilteredAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Refresh every 15 seconds for alerts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.feedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by severity
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }

    // Filter by acknowledgment status
    if (!showAcknowledged) {
      filtered = filtered.filter(alert => !alert.isAcknowledged);
    }

    setFilteredAlerts(filtered);
  }, [searchTerm, severityFilter, typeFilter, showAcknowledged, alerts]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'generation_delay': return 'bi-clock';
      case 'transfer_delay': return 'bi-arrow-up-circle';
      case 'failure': return 'bi-x-circle';
      case 'warning': return 'bi-exclamation-triangle';
      default: return 'bi-info-circle';
    }
  };

  const getTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'generation_delay': return 'warning';
      case 'transfer_delay': return 'info';
      case 'failure': return 'danger';
      case 'warning': return 'warning';
      default: return 'secondary';
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, isAcknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleShowDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.isAcknowledged).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length;
  const highCount = alerts.filter(alert => alert.severity === 'high').length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 px-4">
      {/* Alert Summary */}
      {unacknowledgedCount > 0 && (
        <BootstrapAlert variant="warning" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>{unacknowledgedCount}</strong> unacknowledged alert(s) require attention.
          {criticalCount > 0 && (
            <span> <strong>{criticalCount}</strong> critical alert(s) need immediate action.</span>
          )}
        </BootstrapAlert>
      )}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-danger">{criticalCount}</h3>
              <small className="text-muted">Critical Alerts</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{highCount}</h3>
              <small className="text-muted">High Priority</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-primary">{unacknowledgedCount}</h3>
              <small className="text-muted">Unacknowledged</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">{alerts.length}</h3>
              <small className="text-muted">Total Alerts</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="generation_delay">Generation Delay</option>
                <option value="transfer_delay">Transfer Delay</option>
                <option value="failure">Failure</option>
                <option value="warning">Warning</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Check
                type="switch"
                id="show-acknowledged"
                label="Show Acknowledged"
                checked={showAcknowledged}
                onChange={(e) => setShowAcknowledged(e.target.checked)}
              />
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" className="w-100">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alerts Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Alert</th>
                <th>Feed</th>
                <th>Client</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className={alert.isAcknowledged ? 'table-secondary' : ''}>
                  <td>
                    <div className="d-flex align-items-start">
                      <i className={`bi ${getTypeIcon(alert.type)} me-2 text-${getTypeColor(alert.type)} mt-1`}></i>
                      <div>
                        <div className="fw-medium">{alert.message}</div>
                        <small className="text-muted">ID: {alert.id}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{alert.feedName}</strong>
                    </div>
                    <small className="text-muted">{alert.feedId}</small>
                  </td>
                  <td>{alert.client}</td>
                  <td>
                    <Badge bg={getTypeColor(alert.type)}>
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <div>{format(alert.timestamp, 'MMM dd, HH:mm')}</div>
                    <small className="text-muted">{format(alert.timestamp, 'yyyy')}</small>
                  </td>
                  <td>
                    {alert.isAcknowledged ? (
                      <Badge bg="success">
                        <i className="bi bi-check-lg me-1"></i>
                        Acknowledged
                      </Badge>
                    ) : (
                      <Badge bg="warning">
                        <i className="bi bi-clock me-1"></i>
                        Pending
                      </Badge>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleShowDetails(alert)}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      {!alert.isAcknowledged && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          <i className="bi bi-check-lg"></i>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 text-muted">No alerts found</h5>
              <p className="text-muted">All systems are running smoothly</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Alert Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2"></i>
            Alert Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlert && (
            <Row>
              <Col md={6}>
                <h6>Alert Information</h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Alert ID:</strong></td>
                      <td><code>{selectedAlert.id}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Type:</strong></td>
                      <td>
                        <Badge bg={getTypeColor(selectedAlert.type)}>
                          {selectedAlert.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Severity:</strong></td>
                      <td>
                        <Badge bg={getSeverityColor(selectedAlert.severity)}>
                          {selectedAlert.severity.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>
                        {selectedAlert.isAcknowledged ? (
                          <Badge bg="success">Acknowledged</Badge>
                        ) : (
                          <Badge bg="warning">Pending</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Timestamp:</strong></td>
                      <td>{format(selectedAlert.timestamp, 'MMM dd, yyyy HH:mm:ss')}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col md={6}>
                <h6>Related Feed</h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Feed ID:</strong></td>
                      <td><code>{selectedAlert.feedId}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Feed Name:</strong></td>
                      <td>{selectedAlert.feedName}</td>
                    </tr>
                    <tr>
                      <td><strong>Client:</strong></td>
                      <td>{selectedAlert.client}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col xs={12}>
                <h6>Message</h6>
                <BootstrapAlert variant={getSeverityColor(selectedAlert.severity)}>
                  <i className={`bi ${getTypeIcon(selectedAlert.type)} me-2`}></i>
                  {selectedAlert.message}
                </BootstrapAlert>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedAlert && !selectedAlert.isAcknowledged && (
            <Button
              variant="success"
              onClick={() => {
                handleAcknowledgeAlert(selectedAlert.id);
                setShowModal(false);
              }}
            >
              <i className="bi bi-check-lg me-1"></i>
              Acknowledge Alert
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlertsMonitor;