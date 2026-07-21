# Real-Time Event Analytics Platform

Production-oriented portfolio project: a microservices platform for ingesting,
processing, and querying real-time event streams.

> **Current phase:** repository scaffold only. No business logic, Express routes,
> Kafka wiring, or database setup yet.

## Overview

PulseStream-style analytics pipeline built as a TypeScript monorepo:

- **Ingest** events through a gateway and ingestion service
- **Stream** via Apache Kafka
- **Archive** raw payloads and process aggregations
- **Store** relational data in PostgreSQL and time-series in TimescaleDB
- **Cache / fan-out** with Redis and a push service
- **Observe** via a React dashboard (later)

## Architecture

```
Clients → api-gateway → ingestion-service → Kafka
                              ↓
                      raw-archiver / stream-processor
                              ↓
                   PostgreSQL · TimescaleDB · Redis
                              ↓
                    query-api · push-service → dashboard
```

Shared libraries live under `packages/` (config, schemas, Kafka helpers, logger, types, utils).

See [docs/architecture.md](docs/architecture.md) for the evolving design doc.

## Folder structure

```
apps/                  # Deployable services
  api-gateway/
  ingestion-service/
  raw-archiver/
  stream-processor/
  query-api/
  push-service/
  dashboard/
packages/              # Shared libraries
  config/
  event-schema/
  kafka/
  logger/
  types/
  utils/
infrastructure/
  compose/             # Docker Compose
  docker/              # Image/config placeholders
  k8s/                 # Future Kubernetes manifests
docs/                  # Architecture, API, ADRs
load-tests/            # k6 scripts and results
scripts/               # Ops helpers (topics, seed, cleanup)
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js + TypeScript |
| Monorepo | pnpm workspaces |
| HTTP | Express.js (later) |
| Messaging | Apache Kafka |
| Data | PostgreSQL, TimescaleDB, Redis |
| UI | React (dashboard, later) |
| Local infra | Docker Compose |

## Setup

### Prerequisites

- Node.js ≥ 20
- [pnpm](https://pnpm.io/) ≥ 9
- Docker & Docker Compose (for infrastructure)

### Install

```bash
pnpm install
```

Copy environment defaults:

```bash
cp .env.example .env
```

### Infrastructure (placeholder)

```bash
make infra-up
# or: docker compose -f infrastructure/compose/docker-compose.yml up -d
```

Compose currently defines service stubs only — detailed config comes later.

### Run a service (scaffold)

```bash
pnpm --filter @realtime-analytics/ingestion-service dev
# prints: ingestion-service started
```

## Development workflow

| Command | Purpose |
|---------|---------|
| `make install` | Install all workspace deps |
| `make build` | Build every package and app |
| `make dev` | Parallel `dev` across workspaces |
| `make lint` / `make format` | ESLint / Prettier |
| `make typecheck` | `tsc --noEmit` across workspaces |
| `make infra-up` / `make infra-down` | Local Docker infra |
| `make clean` | Remove build artifacts |

Root scripts are thin wrappers over `pnpm -r`. Application code stays in `apps/` and `packages/` only.

## Documentation

- [Architecture](docs/architecture.md)
- [API](docs/api.md)
- [Decisions (ADRs)](docs/decisions.md)

## License

Private / portfolio — update as needed.
