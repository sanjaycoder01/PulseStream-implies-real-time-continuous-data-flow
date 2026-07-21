# ADR-0001: pnpm Workspaces Monorepo

- **Status:** Accepted
- **Date:** 2026-07-21
- **Deciders:** Platform engineering (portfolio)

## Context / Problem

The platform spans multiple deployable services (gateway, ingestion, processors, query API, push) plus shared concerns (schemas, logging, Kafka clients, types). We need a repository layout that:

- Keeps service boundaries clear for independent deployability
- Avoids copy-pasted TypeScript config, types, and clients
- Supports a single CI install/lint/typecheck surface
- Looks and behaves like a production backend monorepo in interviews

A single flat repo of unrelated folders, or many disconnected repos, both make shared contracts hard to evolve safely.

## Decision

Use a **pnpm workspaces monorepo**:

- `apps/*` — deployable services
- `packages/*` — shared libraries (`config`, `event-schema`, `kafka`, `logger`, `types`, `utils`)
- Root owns only toolchain (TypeScript, ESLint, Prettier, scripts) — no application logic

Packages are scoped as `@realtime-analytics/<name>` and consumed via workspace protocol.

## Alternatives Considered

| Option | Why not (for now) |
|--------|-------------------|
| **Polyrepo** (one Git repo per service) | Strong isolation, but painful for a portfolio: duplicated tooling, harder cross-cutting PRs, weak story for shared schemas |
| **npm / Yarn workspaces** | Viable; pnpm chosen for stricter dependency isolation, faster installs, and industry prevalence in modern TS monorepos |
| **Nx / Turborepo from day one** | Excellent caching/orchestration later; adds conceptual weight before services exist. Can adopt when build graph justifies it |
| **Single deployable (“modular monolith”)** | Simpler ops early, but undercuts the microservices + Kafka learning/demo goals of this project |

## Trade-offs

**Pros**

- One clone, one `pnpm install`, consistent TypeScript strictness
- Shared event schemas and Kafka helpers change in lockstep with producers/consumers
- Clear interview narrative: “services are apps; cross-cutting code is packages”

**Cons**

- Larger repo; CI must be scoped carefully as the tree grows
- Risk of accidental coupling if packages become a dumping ground
- Independent versioning/release of services is less natural than polyrepo (acceptable for this portfolio)

## Consequences

- Enforce package boundaries: apps depend on packages; packages must not depend on apps
- Prefer thin shared packages with stable contracts over a large “common” blob
- Revisit Turborepo/Nx when build times or task graphs become painful
