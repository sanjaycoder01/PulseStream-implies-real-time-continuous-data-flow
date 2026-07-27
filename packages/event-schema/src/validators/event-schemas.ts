import { z } from 'zod';
import { EVENT_LIMITS } from '../constants/event-limits';

// Helper validator for metadata keys and values to protect against malicious input size
const metadataValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string().max(EVENT_LIMITS.MAX_METADATA_VALUE_LENGTH, 'Metadata value string is too long'),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(metadataValueSchema),
    z.record(z.string().max(EVENT_LIMITS.MAX_METADATA_KEY_LENGTH, 'Metadata nested key is too long'), metadataValueSchema),
  ])
);

export const metadataSchema = z
  .record(
    z.string().max(EVENT_LIMITS.MAX_METADATA_KEY_LENGTH, 'Metadata key is too long'),
    metadataValueSchema
  )
  .refine(
    (val) => Object.keys(val).length <= EVENT_LIMITS.MAX_METADATA_KEYS,
    {
      message: `Metadata cannot contain more than ${EVENT_LIMITS.MAX_METADATA_KEYS} keys`,
    }
  );

// Schema for events submitted by clients
export const clientEventSchema = z.object({
  eventType: z
    .string()
    .min(1, 'eventType is required')
    .max(EVENT_LIMITS.MAX_EVENT_TYPE_LENGTH, 'eventType is too long'),
  userId: z
    .string()
    .max(EVENT_LIMITS.MAX_USER_ID_LENGTH, 'userId is too long')
    .optional(),
  sessionId: z
    .string()
    .max(EVENT_LIMITS.MAX_SESSION_ID_LENGTH, 'sessionId is too long')
    .optional(),
  metadata: metadataSchema.default({}),
});

// Schema for fully formed events processed by the ingestion service
export const analyticsEventSchema = clientEventSchema.extend({
  eventId: z.string().uuid('eventId must be a valid UUID v4'),
  timestamp: z.string().datetime({ message: 'timestamp must be a valid ISO 8601 string' }),
  source: z.string().min(1, 'source is required'),
});

export type ClientEventInput = z.infer<typeof clientEventSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
