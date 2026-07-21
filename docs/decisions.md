# Architecture Decision Records

Significant technical decisions live as numbered ADRs under [`adr/`](./adr/).

## Index

| ADR | Title |
|-----|-------|
| [0001](./adr/0001-monorepo.md) | pnpm workspaces monorepo |
| [0002](./adr/0002-kafka.md) | Apache Kafka as the event backbone |
| [0003](./adr/0003-microservices.md) | Microservices decomposition |
| [0004](./adr/0004-timescaledb.md) | TimescaleDB for time-series analytics |
| [0005](./adr/0005-cache-strategy.md) | Redis cache strategy |

## How to add an ADR

1. Copy the structure of an existing file in `adr/`.
2. Use the next number: `0006-<slug>.md`.
3. Include: **Context/Problem**, **Decision**, **Alternatives considered**, **Trade-offs**, **Consequences**.
4. Link it in the index above.
5. Set status to `Proposed` until accepted.

Do not rewrite history of accepted ADRs — supersede them with a new ADR instead.
