# ADR-0005: Cache Strategy (Redis)

- **Status:** Accepted
- **Date:** 2026-07-21
- **Deciders:** Platform engineering (portfolio)

## Context / Problem

The read path (`query-api`, `push-service`, dashboard) will repeatedly request hot aggregates, session-ish state, and fan-out metadata. Hitting Timescale/Postgres on every request:

- Increases latency under concurrent dashboard/poll load
- Amplifies load during traffic spikes
- Complicates rate limiting and short-lived coordination (e.g. presence, idempotency windows)

We need an explicit caching and ephemeral-state strategy—not ad-hoc `Map`s inside processes.

## Decision

Use **Redis** as a shared cache and ephemeral store with clear ownership rules:

| Use | Pattern (planned) |
|-----|-------------------|
| Hot query results | Cache-aside with TTL keyed by query fingerprint |
| Rate limiting / quotas | Sliding window or token bucket counters at the gateway |
| Push fan-out metadata | Short-lived subscription/connection indexes as needed |
| Idempotency / dedupe windows | Keyed entries with TTL for recent event IDs (where appropriate) |

**Source of truth** remains Kafka (events), Postgres (metadata), and TimescaleDB (series). Redis is not the system of record for analytics history.

Invalidation: prefer **TTL + versioned keys** early; add explicit invalidation when write paths can reliably signal staleness.

## Alternatives Considered

| Option | Why not (for now) |
|--------|-------------------|
| **No cache** | Simplest correctness; poor latency/load story for a “real-time” portfolio |
| **In-process LRU only** | Fast but not shared across replicas; inconsistent under horizontal scale |
| **Memcached** | Capable cache; Redis preferred for richer data structures and multi-purpose use |
| **CDN / HTTP cache only** | Helps static/dashboard assets; not enough for personalized/query API semantics |
| **Redis as primary event store** | Blurs durability; rejected in favor of Kafka + databases |

## Trade-offs

**Pros**

- Low-latency reads for hot paths; protects Timescale under bursty UI traffic
- Multi-purpose: cache, limits, short-lived coordination
- Standard production pattern interviewers recognize

**Cons**

- Cache invalidation complexity; risk of serving stale aggregates
- Another failure mode (Redis down → degrade gracefully to DB)
- Need clear key namespaces to avoid collisions across services

## Consequences

- Document key naming conventions (e.g. `query:v1:<hash>`, `rl:gateway:<ip>`) when implemented
- Define **degraded mode**: query-api should still work if Redis is unavailable (with higher latency)
- Never treat Redis eviction as acceptable loss for data that must be durable
- Measure hit rate and staleness once metrics exist; tune TTLs per query class
