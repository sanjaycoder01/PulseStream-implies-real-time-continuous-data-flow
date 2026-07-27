export interface AnalyticsEvent {
  eventId: string;
  eventType: string;
  timestamp: string; // ISO 8601 string representation of Date/time
  source: string; // Ingesting system or authenticated source name

  userId?: string;
  sessionId?: string;

  metadata: Record<string, unknown>;
}
