import { Request, Response } from 'express';
import { clientEventSchema } from '@realtime-analytics/event-schema';
import { IngestionService } from '../services/ingestion.service';

const ingestionService = new IngestionService();

export class IngestionController {
  public async handleEvent(req: Request, res: Response): Promise<void> {
    try {
      // Validate incoming client payload
      const parsed = clientEventSchema.safeParse(req.body);
      
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation Failed',
          details: parsed.error.format(),
        });
        return;
      }

      // Determine source from custom header or user-agent
      const sourceHeader = req.headers['x-source-name'] as string | undefined;

      // Ingest and enrich
      const enrichedEvent = await ingestionService.ingestEvent(parsed.data, sourceHeader);

      // Return 202 Accepted with eventId
      res.status(202).json({
        status: 'Accepted',
        eventId: enrichedEvent.eventId,
      });
    } catch (error) {
      console.error('[IngestionController] Error processing event:', error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
}
