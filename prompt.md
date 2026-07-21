You are an experienced Staff Software Engineer.

I am building a production-grade portfolio project called **Real-Time Event Analytics Platform** using a microservices architecture.

Your task is ONLY to scaffold the repository and project structure. Do NOT implement any business logic yet.

## Tech Stack

- Node.js
- TypeScript
- pnpm workspaces
- Docker Compose
- Express.js
- Apache Kafka
- PostgreSQL
- TimescaleDB
- Redis
- React (dashboard later)

## Repository Structure

Create the following structure:

realtime-analytics-platform/
│
├── apps/
│   ├── api-gateway/
│   ├── ingestion-service/
│   ├── raw-archiver/
│   ├── stream-processor/
│   ├── query-api/
│   ├── push-service/
│   └── dashboard/
│
├── packages/
│   ├── config/
│   ├── event-schema/
│   ├── kafka/
│   ├── logger/
│   ├── types/
│   └── utils/
│
├── infrastructure/
│   ├── compose/
│   │   └── docker-compose.yml
│   │
│   ├── docker/
│   │   ├── kafka/
│   │   ├── postgres/
│   │   ├── redis/
│   │   └── grafana/
│   │
│   └── k8s/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── decisions.md
│   ├── sequence-diagrams/
│   └── screenshots/
│
├── load-tests/
│   ├── k6/
│   └── results/
│
├── scripts/
│
├── .gitignore
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── README.md
└── Makefile

------------------------------------------------------

## Root Setup

Configure pnpm workspaces.

The root package.json should only contain:

- workspace configuration
- common scripts
- formatting/linting scripts
- TypeScript version
- prettier
- eslint

No application code belongs in the root.

Create:

pnpm-workspace.yaml

tsconfig.base.json

shared compiler options.

------------------------------------------------------

## Every service inside apps/

Each service should contain:

src/

package.json

tsconfig.json

Dockerfile

README.md

Inside src create:

index.ts

Do not implement any APIs.

index.ts should only print:

"<service-name> started"

Example:

console.log("ingestion-service started");

------------------------------------------------------

## Every package inside packages/

Each package should contain

src/

package.json

tsconfig.json

README.md

Create empty placeholder exports.

Example

packages/logger/src/index.ts

export {};

No implementation.

------------------------------------------------------

## Docker

Create a placeholder docker-compose.yml.

Include service definitions only.

No detailed configuration yet.

Services:

- kafka
- zookeeper
- postgres
- timescaledb
- redis

Leave TODO comments where configuration will be added later.

------------------------------------------------------

## Documentation

Create README.md explaining:

- project overview
- architecture
- folder structure
- setup instructions
- development workflow

Create placeholder markdown files:

architecture.md

api.md

decisions.md

------------------------------------------------------

## Scripts

Create empty placeholder scripts:

create-topics.sh

seed-data.ts

cleanup.sh

------------------------------------------------------

## Important Constraints

- Do NOT implement Express routes.
- Do NOT configure Kafka.
- Do NOT configure databases.
- Do NOT add authentication.
- Do NOT implement Docker images.
- Do NOT write application logic.

This task is ONLY to lay a clean, scalable, production-grade foundation.

The generated structure should resemble a real-world monorepo used in production.

At the end, provide the complete directory tree and explain any architectural decisions you made.