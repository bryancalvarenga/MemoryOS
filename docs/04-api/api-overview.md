# API Overview

## Architecture Style

MemoryOS exposes a RESTful API used by the frontend.

All responses are JSON formatted.

## Base URL

/api/v1

## Authentication

Authentication is required for all protected endpoints.

Token-based authentication will be used.

## Core API Areas

Authentication

- register
- login
- logout

Documents

- upload document
- list documents
- delete document

Search

- execute semantic search
- retrieve search history

## Example Endpoints

POST /auth/register

POST /auth/login

POST /documents/upload

GET /documents

DELETE /documents/{id}

POST /search
