# Database Schema

## Overview

This document defines the initial relational database schema for MemoryOS.

The database is responsible for storing:

- users
- source documents
- extracted chunks
- search history
- audit events

Vector embeddings may be stored with pgvector in PostgreSQL or managed through a dedicated vector strategy in the future.

## Database Choice

Primary relational database:

- PostgreSQL

## Schema Design Principles

The schema must follow these principles:

1. every user-owned resource must contain user_id
2. foreign keys must preserve integrity
3. timestamps must exist for traceability
4. deletions must be controlled and predictable
5. the schema must support secure multi-tenant isolation at application level

## Tables

### users

Stores user accounts.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### documents

Stores metadata for imported documents.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  original_path_or_url TEXT,
  mime_type VARCHAR(100),
  file_size_bytes BIGINT,
  processing_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### document_chunks

Stores text fragments extracted from documents.

```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### embeddings

Stores vector references for chunks.

If pgvector is used, the vector column can be defined directly in PostgreSQL.

Example schema:

```sql
CREATE TABLE embeddings (
  id UUID PRIMARY KEY,
  chunk_id UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  embedding_model VARCHAR(100) NOT NULL,
  vector VECTOR(1536) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### query_logs

Stores user search history.

```sql
CREATE TABLE query_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  result_count INTEGER NOT NULL DEFAULT 0,
  executed_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### audit_events

Stores important audit and security-related events.

```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Recommended Indexes

### documents

```sql
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_processing_status ON documents(processing_status);
```

### document_chunks

```sql
CREATE INDEX idx_document_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_document_chunks_user_id ON document_chunks(user_id);
```

### embeddings

```sql
CREATE INDEX idx_embeddings_user_id ON embeddings(user_id);
CREATE INDEX idx_embeddings_chunk_id ON embeddings(chunk_id);
```

If pgvector is used, similarity indexes should be added later based on the chosen distance strategy.

### query_logs

```sql
CREATE INDEX idx_query_logs_user_id ON query_logs(user_id);
CREATE INDEX idx_query_logs_executed_at ON query_logs(executed_at);
```

### audit_events

```sql
CREATE INDEX idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX idx_audit_events_event_type ON audit_events(event_type);
```

## Relationship Summary

Main relationships:

- one user has many documents
- one document has many chunks
- one chunk has one embedding record
- one user has many query logs
- one user may have many audit events

## Notes on Multi-Tenancy

MemoryOS will initially use logical multi-tenancy.

This means:

- all user-owned records include user_id
- application-level authorization must enforce data isolation
- no query should return resources from another user

## Future Schema Extensions

The schema is expected to evolve to support:

- bookmarks as first-class entities
- document tags
- source synchronization metadata
- soft deletes
- team workspaces
- memory relationships between chunks

## Migration Strategy

All schema changes must be managed through versioned migrations.

Direct manual changes to production databases are not allowed.
