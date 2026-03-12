# API Endpoints

## Overview

This document defines the initial REST API endpoints exposed by MemoryOS.

All endpoints are versioned under:

`/api/v1`

Responses are returned in JSON format.

All protected endpoints require authentication.

---

# Authentication Endpoints

## Register

`POST /api/v1/auth/register`

Creates a new user account.

Request body:

{
"email": "user@example.com",
"password": "securePassword"
}

Response:

{
"user_id": "uuid",
"email": "user@example.com"
}

---

## Login

`POST /api/v1/auth/login`

Authenticates a user and returns an access token.

Request:

{
"email": "user@example.com",
"password": "securePassword"
}

Response:

{
"access_token": "jwt_token",
"expires_in": 3600
}

---

## Logout

`POST /api/v1/auth/logout`

Invalidates the current session.

Requires authentication.

---

# Document Endpoints

## Upload Document

`POST /api/v1/documents/upload`

Uploads a document for indexing.

Request:

multipart/form-data

Fields:

file: document file

Response:

{
"document_id": "uuid",
"status": "processing"
}

---

## Create Bookmark

`POST /api/v1/documents/bookmark`

Adds a bookmark to the memory index.

Request:

{
"url": "https://example.com/article",
"title": "Article title"
}

---

## List Documents

`GET /api/v1/documents`

Returns documents owned by the user.

Response:

[
{
"id": "uuid",
"title": "Document Title",
"source_type": "pdf",
"created_at": "timestamp"
}
]

---

## Get Document

`GET /api/v1/documents/{id}`

Returns metadata about a document.

---

## Delete Document

`DELETE /api/v1/documents/{id}`

Removes the document and its indexed chunks.

---

# Search Endpoints

## Execute Search

`POST /api/v1/search`

Performs semantic search across user knowledge.

Request:

{
"query": "event sourcing architecture"
}

Response:

{
"results": [
{
"chunk_id": "uuid",
"document_id": "uuid",
"content": "retrieved text fragment",
"score": 0.87
}
]
}

---

## Search History

`GET /api/v1/search/history`

Returns previous user queries.

---

# System Endpoints

## Health Check

`GET /api/v1/health`

Returns system health status.

Response:

{
"status": "ok"
}

---

## Readiness

`GET /api/v1/ready`

Used by infrastructure to verify service readiness.
