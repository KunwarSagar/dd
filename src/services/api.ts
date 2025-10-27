import { Feed, Alert, Client, DashboardStats, FeedPerformance } from '../types';
import { subDays, subHours, format } from 'date-fns';

// Dummy data for demonstration
export const generateDummyFeeds = (): Feed[] => {
  const feeds: Feed[] = [];
  const clients = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'];
  const formats = ['CSV', 'JSON', 'XML', 'XLSX'];
  const statuses: Feed['status'][] = ['active', 'inactive', 'error', 'pending'];

  for (let i = 1; i <= 25; i++) {
    const lastGenerated = subHours(new Date(), Math.random() * 24);
    const lastTransferred = new Date(lastGenerated.getTime() + Math.random() * 3600000);
    const generationTime = Math.floor(Math.random() * 30) + 5;
    const transferTime = Math.floor(Math.random() * 15) + 2;
    const isDelayed = Math.random() > 0.8;

    feeds.push({
      id: `feed-${i.toString().padStart(3, '0')}`,
      name: `Daily Report ${i}`,
      description: `Automated daily report for ${clients[Math.floor(Math.random() * clients.length)]}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastGenerated,
      lastTransferred,
      scheduledTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      client: clients[Math.floor(Math.random() * clients.length)],
      size: Math.floor(Math.random() * 500) + 10, // MB
      format: formats[Math.floor(Math.random() * formats.length)],
      generationTime,
      transferTime,
      isDelayed,
      delayedBy: isDelayed ? Math.floor(Math.random() * 120) + 10 : 0
    });
  }

  return feeds;
};

export const generateDummyAlerts = (): Alert[] => {
  const alerts: Alert[] = [];
  const feeds = generateDummyFeeds();
  const types: Alert['type'][] = ['generation_delay', 'transfer_delay', 'failure', 'warning'];
  const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
  const messages = [
    'Feed generation exceeded expected time',
    'Transfer to client failed',
    'Data quality check failed',
    'Connection timeout during transfer',
    'Scheduled generation missed',
    'Client endpoint unavailable'
  ];

  for (let i = 1; i <= 15; i++) {
    const feed = feeds[Math.floor(Math.random() * feeds.length)];
    alerts.push({
      id: `alert-${i.toString().padStart(3, '0')}`,
      feedId: feed.id,
      feedName: feed.name,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: subHours(new Date(), Math.random() * 72),
      isAcknowledged: Math.random() > 0.6,
      client: feed.client
    });
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateDummyClients = (): Client[] => {
  const clientNames = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'];
  return clientNames.map((name, index) => ({
    id: `client-${index + 1}`,
    name,
    feedsCount: Math.floor(Math.random() * 10) + 3,
    activeFeeds: Math.floor(Math.random() * 8) + 1,
    totalTransferSize: Math.floor(Math.random() * 5000) + 500, // MB
    lastActivity: subHours(new Date(), Math.random() * 48),
    status: Math.random() > 0.2 ? 'active' : 'inactive'
  }));
};

export const generateDashboardStats = (): DashboardStats => {
  return {
    totalFeeds: 25,
    activeFeeds: 20,
    delayedFeeds: 3,
    failedFeeds: 2,
    totalClients: 5,
    activeClients: 4,
    totalDataTransferred: 12.5, // GB
    averageGenerationTime: 15.2, // minutes
    averageTransferTime: 8.7, // minutes
    uptime: 99.2 // percentage
  };
};

export const generateFeedPerformanceData = (): FeedPerformance[] => {
  const data: FeedPerformance[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      generated: Math.floor(Math.random() * 50) + 20,
      transferred: Math.floor(Math.random() * 45) + 18,
      delayed: Math.floor(Math.random() * 8) + 1,
      failed: Math.floor(Math.random() * 5)
    });
  }
  return data;
};

// Simulated API calls with axios-like interface
export const api = {
  getFeeds: async (): Promise<Feed[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return generateDummyFeeds();
  },

  getAlerts: async (): Promise<Alert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateDummyAlerts();
  },

  getClients: async (): Promise<Client[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return generateDummyClients();
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateDashboardStats();
  },

  getFeedPerformance: async (): Promise<FeedPerformance[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateFeedPerformanceData();
  },

  acknowledgeAlert: async (alertId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Alert ${alertId} acknowledged`);
  }
};