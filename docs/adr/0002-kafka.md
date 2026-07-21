# ADR-0002: Apache Kafka as the Event Backbone

- **Status:** Accepted
- **Date:** 2026-07-21
- **Deciders:** Platform engineering (portfolio)

## Context / Problem

Ingestion must accept high volumes of events and fan them out to multiple independent consumers (raw archival, stream processing, future analytics jobs) without tying producers to consumers.

Requirements:

- Decouple write path from processing path
- Support replay / reprocessing for correctness and debugging
- Allow horizontal scale of consumers by partition
- Match patterns used in real-time analytics platforms

Synchronous HTTP from ingestion → every downstream service would create tight coupling, cascading failures, and poor backpressure behavior.

## Decision

Use **Apache Kafka** as the central event log:

- Producers (ingestion) write validated events to topics
- Consumers (`raw-archiver`, `stream-processor`, others) subscribe independently
- Topics model stages of the pipeline (e.g. raw → processed); exact topic map to be defined when schemas land

Local development runs Kafka (with ZooKeeper or KRaft as compose evolves) via Docker Compose.

## Alternatives Considered

| Option | Why not (for now) |
|--------|-------------------|
| **RabbitMQ / NATS** | Excellent messaging; weaker as an **immutable, replayable log** for analytics-style reprocessing |
| **AWS SQS / SNS** | Simple managed queues; less ideal for ordered partitions, long retention, and consumer-group semantics we want to demonstrate |
| **Redis Streams** | Fine for lighter workloads; less standard as a company-wide event bus and weaker multi-consumer durability story at scale |
| **Direct DB write only** | Simple; no fan-out, no independent consumer scale, poor fit for stream processing demos |
| **Pulsar** | Strong multi-tenant messaging; steeper ops story and less ubiquitous in interview conversations than Kafka |

## Trade-offs

**Pros**

- Durable, ordered-per-partition log with consumer groups
- Natural fit for at-least-once processing + idempotent consumers
- Clear system-design talking points: partitioning, retention, lag, backpressure

**Cons**

- Operational complexity (brokers, partitions, consumer lag monitoring)
- Local setup heavier than a single Postgres
- Exactly-once end-to-end needs careful design (idempotency keys, transactional outbox patterns later)

## Consequences

- Event contracts live in `packages/event-schema`; producers/consumers share versions
- Consumers must be designed for **at-least-once** delivery (idempotent writes)
- Topic naming, retention, and partition keys become first-class design docs
- Kafka client wrappers belong in `packages/kafka`, not duplicated per service
