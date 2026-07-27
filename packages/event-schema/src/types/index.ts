import { AnalyticsEvent } from '../interfaces/analytics-event';

// Payload submitted by client which does not contain ingestion-injected fields
export type ClientEventPayload = Omit<AnalyticsEvent, 'eventId' | 'timestamp' | 'source'>;
