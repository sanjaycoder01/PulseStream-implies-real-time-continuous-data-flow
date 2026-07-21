# ADR-0003: Microservices Decomposition

- **Status:** Accepted
- **Date:** 2026-07-21
- **Deciders:** Platform engineering (portfolio)

## Context / Problem

A real-time analytics platform has distinct workloads with different scaling, failure, and latency profiles:

- Edge routing and auth (gateway)
- High-throughput write ingestion
- Bulk/raw persistence
- Stateful stream aggregation
- Low-latency query serving
- Real-time push to clients
- Operator UI

Bundling all of this into one process makes it harder to scale the hot path independently, reason about failure domains, or showcase production backend design.

## Decision

Decompose into **focused services** under `apps/`:

| Service | Responsibility |
|---------|----------------|
| `api-gateway` | Edge entry, routing, cross-cutting HTTP concerns |
| `ingestion-service` | Accept/validate events; publish to Kafka |
| `raw-archiver` | Persist raw events for audit/replay |
| `stream-processor` | Consume streams; aggregate/enrich |
| `query-api` | Serve analytics / read models |
| `push-service` | WebSocket/SSE fan-out |
| `dashboard` | React UI (later) |

Services communicate primarily via **Kafka** for async pipelines and via **HTTP** for request/response (gateway → ingestion/query, etc.). Shared code lives in packages, not in a shared runtime.

## Alternatives Considered

| Option | Why not (for now) |
|--------|-------------------|
| **Modular monolith** | Faster to ship a demo; weaker failure isolation and a thinner “systems design” portfolio signal |
| **Fewer coarse services** (e.g. ingest + worker + API only) | Pragmatic for startups; we intentionally split archival vs processing vs query to show clear domains |
| **Serverless functions per endpoint** | Great for bursty HTTP; awkward for long-running Kafka consumers and local compose storytelling |
| **Actor model / DDD-heavy service mesh** | Overkill for portfolio scope; complexity without proportional demo value |

## Trade-offs

**Pros**

- Independent scale (e.g. more ingestion replicas under load)
- Clear ownership of data paths (write vs read vs push)
- Interview-friendly architecture diagrams and sequence flows

**Cons**

- Distributed systems tax: network failures, partial outages, observability needs
- More repos-as-packages to build, containerize, and operate locally
- Risk of premature split — mitigated by keeping services thin until logic exists

## Consequences

- No shared database as a secret integration layer between write and read paths without an explicit contract
- Cross-service APIs and events must be versioned and documented (`docs/api.md`, event schemas)
- Local `docker compose` and Makefiles must stay ergonomic or the architecture becomes un-demoable
- Prefer sync calls only where request/response is required; prefer Kafka for fan-out work
