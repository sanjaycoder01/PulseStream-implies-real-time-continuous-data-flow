import { randomUUID } from 'crypto';
import { AnalyticsEvent, ClientEventPayload } from '@realtime-analytics/event-schema';
import { CONFIG } from '../config/config';

export class IngestionService {
  /**
   * Enriches client payload with eventId, timestamp, and source, and logs it.
   */
  public async ingestEvent(payload: ClientEventPayload, sourceHeader?: string): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      ...payload,
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      source: sourceHeader || CONFIG.DEFAULT_SOURCE,
    };

    // Log the created event for now as per Module 2 requirements
    console.log('[IngestionService] Event Ingested Successfully:', JSON.stringify(event, null, 2));

    return event;
  }
}
