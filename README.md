# MemoryOS

MemoryOS is a personal knowledge memory system designed to transform fragmented digital information into a searchable memory layer.

## Monorepo Structure

- `apps/web`: frontend application
- `apps/api`: backend API
- `docs`: product and technical documentation
- `infrastructure`: local infrastructure and database setup

## Prerequisites

- Node.js 18.12+ or newer
- pnpm
- Docker

## Getting Started

### 1. Copy environment variables

```bash
cp .env.example .env
```

### 2. Start the database

```bash
docker compose up -d
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Run the applications

```bash
pnpm dev
```

## Documentation

Project documentation is located in the `docs/` directory.

O pnpm exige Node.js 18.12+ se você não estiver usando o executável standalone.
