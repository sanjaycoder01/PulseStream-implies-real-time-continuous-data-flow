.PHONY: install build dev lint format typecheck clean infra-up infra-down help

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

install: ## Install workspace dependencies
	pnpm install

build: ## Build all packages and apps
	pnpm run build

dev: ## Run all services in parallel (dev)
	pnpm run dev

lint: ## Lint the monorepo
	pnpm run lint

format: ## Format sources with Prettier
	pnpm run format

typecheck: ## Type-check all workspaces
	pnpm run typecheck

clean: ## Remove build artifacts and node_modules
	pnpm run clean

infra-up: ## Start infrastructure via Docker Compose
	docker compose -f infrastructure/compose/docker-compose.yml up -d

infra-down: ## Stop infrastructure
	docker compose -f infrastructure/compose/docker-compose.yml down

create-topics: ## Create Kafka topics (placeholder)
	./scripts/create-topics.sh

cleanup: ## Run cleanup script
	./scripts/cleanup.sh
