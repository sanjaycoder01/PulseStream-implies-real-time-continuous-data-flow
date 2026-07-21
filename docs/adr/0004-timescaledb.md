# ADR-0004: TimescaleDB for Time-Series Analytics

- **Status:** Accepted
- **Date:** 2026-07-21
- **Deciders:** Platform engineering (portfolio)

## Context / Problem

Event analytics are inherently temporal: counts, rates, and rollups over sliding or fixed windows. We need storage that:

- Ingests high volumes of timestamped measurements
- Supports efficient range queries and continuous aggregates
- Integrates with familiar SQL tooling
- Separates **transactional/metadata** needs from **time-series** workloads where useful

A single OLTP Postgres table of raw events can work early, but tends to degrade for long-range analytics without partitioning, compression, and rollup strategies.

## Decision

Use **TimescaleDB** (PostgreSQL extension) as the primary store for time-series metrics and aggregates:

- Hypertables keyed by time (and optionally space dimensions)
- Continuous aggregates / rollups for common dashboard queries (to be designed with schemas)
- Keep a separate **PostgreSQL** instance (or logical database) for relational/metadata concerns where Timescale-specific features are not needed

`query-api` reads from Timescale (and Redis caches); `stream-processor` writes derived series.

## Alternatives Considered

| Option | Why not (for now) |
|--------|-------------------|
| **Plain PostgreSQL only** | Sufficient for small demos; weaker story for hypertables, compression, and continuous aggregates |
| **ClickHouse** | Excellent OLAP; heavier local ops and a less “Postgres-familiar” skill narrative for many interviews |
| **InfluxDB / Prometheus** | Strong for metrics telemetry; less natural for richer event dimensions and general SQL joins |
| **MongoDB time-series collections** | Flexible documents; weaker relational analytics + SQL ecosystem fit for this stack |
| **Elasticsearch** | Great search/log analytics; not the primary choice for structured metric rollups here |

## Trade-offs

**Pros**

- SQL + Postgres ecosystem (ORMs, migrations, tooling) with time-series features
- Clear production pattern: raw events elsewhere, aggregates in Timescale
- Strong portfolio talking point: hypertables, retention, continuous aggregates

**Cons**

- Another datastore to operate beside Postgres and Redis
- Need discipline so OLTP and TS data models do not blur carelessly
- Some Timescale features differ across versions/images — pin versions in compose

## Consequences

- Define what is **raw** (archive/Kafka replay) vs **derived** (Timescale series)
- Schema migrations and retention policies belong in infrastructure docs as they land
- Query patterns should prefer pre-aggregates for dashboards; fall back to raw scans carefully
- Document connection separation in `.env` (`POSTGRES_*` vs `TIMESCALEDB_*`)
