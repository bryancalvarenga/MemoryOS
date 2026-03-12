# Repository Structure

## Overview

This document defines the initial repository structure for MemoryOS.

The goal is to maintain a clean, scalable, and professional organization that supports modular development and future expansion.

## Top-Level Structure

```text
memoryos/
├─ apps/
├─ packages/
├─ docs/
├─ infrastructure/
├─ scripts/
├─ .github/
├─ .gitignore
├─ README.md
├─ package.json
└─ pnpm-workspace.yaml
```

## Directory Responsibilities

### apps/

Contains runnable applications.

```text
apps/
├─ web/
└─ api/
```

apps/web
Frontend application.

Responsibilities:

- authentication UI
- document upload UI
- search UI
- document management
- result visualization

app/api
Backend API application.

Responsibilities:

- authentication
- authorization
- document management
- search endpoints
- orchestration of ingestion pipeline

### packages/

Contains shared internal packages used across applications.

```text
packages/
├─ shared/
├─ config/
├─ types/
└─ ui/
```

packages/shared
Reusable utilities and helpers.

Examples:

- error handing
- common constants
- shared business helpers

packages/config
Centralized configuration packages.

Examples:

- eslint config
- typescript config
- environment config helpers

packages/types
Shared TypeScript types and contracts.

Examples:

- API DTOs
- domain interfaces
- shared schemas

packages/ui
Optional shared UI components for frontend.

Examples:

- buttons
- form components
- layout primitives

### docs/

Contains all project documentation.

```text
docs/
├─ 01-product/
├─ 02-architecture/
├─ 03-data/
├─ 04-api/
├─ 05-security/
├─ 06-engineering/
└─ 08-roadmap/
```

Responsibilities:

- product definition
- architecture decisions
- schema documentation
- engineering standards
- roadmap planning

### infrastructure/

Contains infrastructure-related configuration.

```text
infrastructure/
├─ docker/
├─ database/
├─ monitoring/
└─ environments/
```

infrastructure/docker
Dockerfiles and local container setup.

infrastructure/database
Database initialization, migrations support, and seed scripts if needed.

infrastructure/monitoring
Monitoring and observability configuration.

infrastructure/environments
Environment-specific deployment configuration.

### scripts/

Automation and utility scripts.

Examples:

- local bootstrap
- database reset
- seed execution
- maintenance tasks

### .github/

GitHub-specific project automation.

Examples:

- CI workflows
- pull request templates
- issue templates
- contribution guidelines

## Recommended Internal Structure

### apps/api

```text
apps/api/
├─ src/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ users/
│  │  ├─ documents/
│  │  ├─ search/
│  │  ├─ ingestion/
│  │  └─ health/
│  ├─ common/
│  ├─ config/
│  ├─ database/
│  ├─ middleware/
│  └─ main.ts
├─ test/
├─ package.json
└─ tsconfig.json
```

### apps/web

```text
apps/web/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  ├─ services/
│  ├─ hooks/
│  ├─ lib/
│  └─ styles/
├─ public/
├─ package.json
└─ tsconfig.json
```

## Repository Principles

The repository structure must follow these principles:

1. clear separation of responsibilities
2. modularity
3. minimal coupling between apps
4. shared code only when justified
5. documentation stored alongside codebase evolution

## Initial Recommendation

The project should start as a monorepo.

This allows:

- shared types
- shared configuration
- consistent tooling
- easier coordination between frontend and backend
