# Architecture

> Placeholder — detailed system design will be documented here.

## Overview

The Real-Time Event Analytics Platform is a microservices system for ingesting,
processing, storing, and querying high-volume event streams.

## Planned components

| Service | Responsibility |
|---------|----------------|
| api-gateway | Edge entry, routing, rate limiting |
| ingestion-service | Accept events, validate, publish to Kafka |
| raw-archiver | Persist raw events for replay / audit |
| stream-processor | Real-time aggregation and enrichment |
| query-api | Serve analytics queries |
| push-service | WebSocket / SSE push to clients |
| dashboard | Operator / analytics UI (React) |

## Data stores

- **Kafka** — event backbone
- **PostgreSQL** — relational / metadata
- **TimescaleDB** — time-series metrics
- **Redis** — caching and ephemeral state

## Diagrams

See `sequence-diagrams/` for flow diagrams (to be added).
