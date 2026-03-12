# Data Model

## Overview

MemoryOS uses a relational data model combined with vector embeddings.

The relational database stores structured metadata while the vector index stores semantic representations.

## Entities

### User

Represents a system user.

Fields:

- id
- email
- password_hash
- created_at
- updated_at

### Document

Represents a user uploaded document.

Fields:

- id
- user_id
- title
- source_type
- file_path
- created_at

### Chunk

Represents a piece of text extracted from a document.

Fields:

- id
- document_id
- user_id
- chunk_index
- content
- created_at

### Embedding

Stores vector representation of a chunk.

Fields:

- id
- chunk_id
- vector
- embedding_model
- created_at

### QueryLog

Stores user search queries.

Fields:

- id
- user_id
- query_text
- executed_at
