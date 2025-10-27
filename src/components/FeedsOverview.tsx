import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Form, InputGroup, Button, Pagination, Modal } from 'react-bootstrap';
import { Feed } from '../types';
import { api } from '../services/api';
import { format } from 'date-fns';

const FeedsOverview: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [filteredFeeds, setFilteredFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [showModal, setShowModal] = useState(false);
  const feedsPerPage = 10;

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const feedsData = await api.getFeeds();
        setFeeds(feedsData);
        setFilteredFeeds(feedsData);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
    const interval = setInterval(fetchFeeds, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = feeds;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(feed =>
        feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(feed => feed.status === statusFilter);
    }

    setFilteredFeeds(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, feeds]);

  const getStatusColor = (status: Feed['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'error': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1024) {
      return `${sizeInMB} MB`;
    }
    return `${(sizeInMB / 1024).toFixed(2)} GB`;
  };

  // Pagination
  const indexOfLastFeed = currentPage * feedsPerPage;
  const indexOfFirstFeed = indexOfLastFeed - feedsPerPage;
  const currentFeeds = filteredFeeds.slice(indexOfFirstFeed, indexOfLastFeed);
  const totalPages = Math.ceil(filteredFeeds.length / feedsPerPage);

  const handleShowDetails = (feed: Feed) => {
    setSelectedFeed(feed);
    setShowModal(true);
  };

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
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-success">{feeds.filter(f => f.status === 'active').length}</h3>
              <small className="text-muted">Active Feeds</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-warning">{feeds.filter(f => f.isDelayed).length}</h3>
              <small className="text-muted">Delayed Feeds</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-danger">{feeds.filter(f => f.status === 'error').length}</h3>
              <small className="text-muted">Failed Feeds</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <h3 className="text-info">{formatFileSize(feeds.reduce((sum, f) => sum + f.size, 0))}</h3>
              <small className="text-muted">Total Data Size</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search feeds by name, client, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-primary" className="w-100">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Feeds Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Feed ID</th>
                <th>Name</th>
                <th>Client</th>
                <th>Status</th>
                <th>Last Generated</th>
                <th>Last Transferred</th>
                <th>Size</th>
                <th>Format</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFeeds.map((feed) => (
                <tr key={feed.id}>
                  <td>
                    <code className="text-muted">{feed.id}</code>
                  </td>
                  <td>
                    <div>
                      <strong>{feed.name}</strong>
                      {feed.isDelayed && (
                        <Badge bg="warning" className="ms-2 small">
                          Delayed {feed.delayedBy}m
                        </Badge>
                      )}
                    </div>
                    <small className="text-muted">{feed.description}</small>
                  </td>
                  <td>{feed.client}</td>
                  <td>
                    <Badge bg={getStatusColor(feed.status)}>
                      {feed.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <div>{format(feed.lastGenerated, 'MMM dd, HH:mm')}</div>
                    <small className="text-muted">{feed.generationTime}m duration</small>
                  </td>
                  <td>
                    <div>{format(feed.lastTransferred, 'MMM dd, HH:mm')}</div>
                    <small className="text-muted">{feed.transferTime}m duration</small>
                  </td>
                  <td>{formatFileSize(feed.size)}</td>
                  <td>
                    <Badge bg="info" className="font-monospace">
                      {feed.format}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowDetails(feed)}
                    >
                      <i className="bi bi-eye"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Card.Footer className="bg-white border-0">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {indexOfFirstFeed + 1} to {Math.min(indexOfLastFeed, filteredFeeds.length)} of {filteredFeeds.length} feeds
              </small>
              <Pagination className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>

      {/* Feed Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-rss me-2"></i>
            Feed Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeed && (
            <Row>
              <Col md={6}>
                <h6>Basic Information</h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Feed ID:</strong></td>
                      <td><code>{selectedFeed.id}</code></td>
                    </tr>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{selectedFeed.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Client:</strong></td>
                      <td>{selectedFeed.client}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>
                        <Badge bg={getStatusColor(selectedFeed.status)}>
                          {selectedFeed.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Format:</strong></td>
                      <td><Badge bg="info">{selectedFeed.format}</Badge></td>
                    </tr>
                    <tr>
                      <td><strong>Size:</strong></td>
                      <td>{formatFileSize(selectedFeed.size)}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col md={6}>
                <h6>Timing Information</h6>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Scheduled Time:</strong></td>
                      <td>{selectedFeed.scheduledTime}</td>
                    </tr>
                    <tr>
                      <td><strong>Last Generated:</strong></td>
                      <td>{format(selectedFeed.lastGenerated, 'MMM dd, yyyy HH:mm:ss')}</td>
                    </tr>
                    <tr>
                      <td><strong>Last Transferred:</strong></td>
                      <td>{format(selectedFeed.lastTransferred, 'MMM dd, yyyy HH:mm:ss')}</td>
                    </tr>
                    <tr>
                      <td><strong>Generation Time:</strong></td>
                      <td>{selectedFeed.generationTime} minutes</td>
                    </tr>
                    <tr>
                      <td><strong>Transfer Time:</strong></td>
                      <td>{selectedFeed.transferTime} minutes</td>
                    </tr>
                    {selectedFeed.isDelayed && (
                      <tr>
                        <td><strong>Delayed By:</strong></td>
                        <td className="text-warning">{selectedFeed.delayedBy} minutes</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Col>
              <Col xs={12}>
                <h6>Description</h6>
                <p className="text-muted">{selectedFeed.description}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FeedsOverview;