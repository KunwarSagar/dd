import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { DashboardStats, FeedPerformance, Alert } from '../types';
import { api } from '../services/api';
import { format } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [performanceData, setPerformanceData] = useState<FeedPerformance[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, performanceData, alertsData] = await Promise.all([
          api.getDashboardStats(),
          api.getFeedPerformance(),
          api.getAlerts()
        ]);
        
        setStats(statsData);
        setPerformanceData(performanceData);
        setRecentAlerts(alertsData.slice(0, 5)); // Get last 5 alerts
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Chart configurations
  const feedStatusData = {
    labels: ['Active', 'Delayed', 'Failed', 'Inactive'],
    datasets: [
      {
        data: [stats.activeFeeds, stats.delayedFeeds, stats.failedFeeds, stats.totalFeeds - stats.activeFeeds - stats.delayedFeeds - stats.failedFeeds],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'],
        borderWidth: 0,
      },
    ],
  };

  const performanceChartData = {
    labels: performanceData.map(d => d.date),
    datasets: [
      {
        label: 'Generated',
        data: performanceData.map(d => d.generated),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Transferred',
        data: performanceData.map(d => d.transferred),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Delayed',
        data: performanceData.map(d => d.delayed),
        borderColor: '#ffc107',
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: performanceData.map(d => d.date),
    datasets: [
      {
        label: 'Failed Feeds',
        data: performanceData.map(d => d.failed),
        backgroundColor: '#dc3545',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="py-4 px-4">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Total Feeds</h6>
                <h2 className="mb-0">{stats.totalFeeds}</h2>
              </div>
              <div className="ms-3">
                <i className="bi bi-rss text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Active Feeds</h6>
                <h2 className="mb-0 text-success">{stats.activeFeeds}</h2>
              </div>
              <div className="ms-3">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">Delayed Feeds</h6>
                <h2 className="mb-0 text-warning">{stats.delayedFeeds}</h2>
              </div>
              <div className="ms-3">
                <i className="bi bi-clock text-warning" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="text-muted mb-1">System Uptime</h6>
                <h2 className="mb-0 text-info">{stats.uptime}%</h2>
              </div>
              <div className="ms-3">
                <i className="bi bi-graph-up text-info" style={{ fontSize: '2rem' }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Feed Performance (Last 7 Days)</h5>
            </Card.Header>
            <Card.Body>
              <Line data={performanceChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Feed Status Distribution</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={feedStatusData} options={doughnutOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats and Alerts */}
      <Row>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Failed Feeds (Last 7 Days)</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={barChartData} options={chartOptions} />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Performance Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Avg Generation Time:</span>
                  <strong>{stats.averageGenerationTime} min</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Avg Transfer Time:</span>
                  <strong>{stats.averageTransferTime} min</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Data Transferred:</span>
                  <strong>{stats.totalDataTransferred} GB</strong>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Active Clients:</span>
                  <strong>{stats.activeClients}/{stats.totalClients}</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Recent Alerts</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {recentAlerts.length === 0 ? (
                <div className="p-3 text-center text-muted">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  No recent alerts
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="border-bottom p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-truncate">{alert.feedName}</h6>
                        <p className="mb-1 small text-muted">{alert.message}</p>
                        <small className="text-muted">
                          {format(alert.timestamp, 'MMM dd, HH:mm')}
                        </small>
                      </div>
                      <Badge bg={getSeverityColor(alert.severity)} className="ms-2">
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;