export interface Feed {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastGenerated: Date;
  lastTransferred: Date;
  scheduledTime: string;
  client: string;
  size: number;
  format: string;
  generationTime: number; // in minutes
  transferTime: number; // in minutes
  isDelayed: boolean;
  delayedBy: number; // in minutes
}

export interface Alert {
  id: string;
  feedId: string;
  feedName: string;
  type: 'generation_delay' | 'transfer_delay' | 'failure' | 'warning';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  isAcknowledged: boolean;
  client: string;
}

export interface Client {
  id: string;
  name: string;
  feedsCount: number;
  activeFeeds: number;
  totalTransferSize: number;
  lastActivity: Date;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalFeeds: number;
  activeFeeds: number;
  delayedFeeds: number;
  failedFeeds: number;
  totalClients: number;
  activeClients: number;
  totalDataTransferred: number; // in GB
  averageGenerationTime: number; // in minutes
  averageTransferTime: number; // in minutes
  uptime: number; // percentage
}

export interface FeedPerformance {
  date: string;
  generated: number;
  transferred: number;
  delayed: number;
  failed: number;
}