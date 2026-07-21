# Architecture Decision Records (ADRs)

> Placeholder — record significant technical decisions here as the project evolves.

## Template

```markdown
## ADR-XXX: Title

- **Status:** Proposed | Accepted | Superseded
- **Date:** YYYY-MM-DD
- **Context:** Why this decision was needed
- **Decision:** What we chose
- **Consequences:** Trade-offs and follow-ups
```

## Initial decisions (scaffold phase)

### ADR-001: pnpm workspaces monorepo

- **Status:** Accepted
- **Context:** Multiple Node/TypeScript services and shared libraries need consistent tooling.
- **Decision:** Use pnpm workspaces with `apps/*` and `packages/*`.
- **Consequences:** Single install/lint/build surface; clear service boundaries.

### ADR-002: Shared packages before shared implementation

- **Status:** Accepted
- **Context:** Cross-cutting concerns (logger, Kafka client, schemas, types) will be reused.
- **Decision:** Scaffold empty packages first; implement after service contracts stabilize.
- **Consequences:** Avoids premature coupling; packages are ready for incremental fill-in.
