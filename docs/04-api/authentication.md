# Authentication

## Overview

MemoryOS uses token-based authentication to secure API access.

All authenticated requests must include a valid access token.

## Authentication Method

The system uses JSON Web Tokens (JWT).

Tokens are issued during login and must be included in API requests.

Authorization header format:

Authorization: Bearer <token>

## Login Flow

1. User submits credentials
2. Server validates email and password
3. Password is verified using a secure hash comparison
4. JWT token is generated
5. Token returned to client

## Token Payload

The token contains minimal information:

{
"user_id": "uuid",
"exp": timestamp
}

## Token Expiration

Access tokens expire after a defined period (example: 1 hour).

Clients must refresh authentication when expired.

## Password Storage

Passwords are never stored in plain text.

They are hashed using a secure algorithm.

Recommended algorithms:

- bcrypt
- argon2

## Authentication Middleware

All protected endpoints must verify:

- token signature
- expiration time
- user identity

Requests failing verification must return:

HTTP 401 Unauthorized
