# Component Design

## Frontend

Responsibilities:

- user authentication interface
- document upload interface
- document management
- search interface
- displaying search results

The frontend communicates with the backend through REST APIs.

## Backend API

Responsibilities:

- request validation
- authentication and authorization
- document management
- search orchestration
- pipeline coordination

Modules:

- auth
- users
- documents
- search
- ingestion

## Ingestion Pipeline

Responsible for transforming raw documents into indexed memory units.

Steps:

1. file upload
2. text extraction
3. chunk generation
4. embedding generation
5. vector indexing

## Search Service

Responsible for retrieving relevant chunks from vector storage based on semantic similarity.

The search service receives a query, generates embeddings, and executes similarity search.

## Storage Components

The system uses three storage types:

Relational database  
Stores metadata and user data.

Vector database  
Stores embeddings for semantic search.

Object storage  
Stores original documents.
