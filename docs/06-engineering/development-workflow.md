# Development Workflow

## Overview

This document defines the development workflow for MemoryOS.

The goal is to establish a consistent engineering process before implementation begins.

## Branching Strategy

The repository will follow a simple branch strategy.

### Main Branches

- main
- develop

### Purpose

#### main

Production-ready code only.

#### develop

Integration branch for completed features before release.

## Feature Branches

All new work must be developed in dedicated feature branches.

Naming convention:

```text
feature/<short-description>
```

Examples:

```text
feature/auth-module
feature/document-upload
feature/semantic-search
```

## Bugfix Branches

Bugfix branches follow this naming:

```text
fix/<short-description>
```

Examples:

```text
fix/login-validation
fix/document-delete-flow
```

## Commit Convention

Commits should be clear and consistent.

Recommended style:

```text
type(scope): short description
```

Examples:

```text
feat(auth): add login endpoint
feat(documents): implement upload validation
fix(search): correct vector query filtering
docs(architecture): update ingestion flow
chore(config): add eslint configuration
```

## Allowed Commit Types

- feat
- fix
- docs
- refactor
- test
- chore
- perf

## Pull Request Process

Every change must go through a pull request.

### Pull Request Requirements

A pull request should include:

- objective of the change
- summary of implementation
- testing notes
- impacted areas

### Rules

- no direct commits to main
- no direct commits to develop without review
- every PR should be reviewed before merge
- documentation should be updated when architecture or behavior changes

## Code Review Principles

Code review must focus on:

- correctness
- readability
- maintainability
- security implications
- consistency with architecture

## Definition of Done

A task is only considered complete when:

1. implementation is finished
2. code is reviewed
3. tests are added or updated when applicable
4. documentation is updated if necessary
5. code is merged into the correct branch

## Environment Management

The project should maintain at least the following environments:

- local
- development
- production

Future environments may include staging.

## Release Strategy

Initial releases may be manual.

As the project evolves, releases should become automated through CI/CD workflows.

## Documentation Rule

Whenever a change affects one of the following, documentation must be updated in the same pull request:

- architecture
- API behavior
- data model
- security rules
- repository structure

## Initial Workflow Summary

The expected workflow is:

1. create issue or define task
2. create feature branch
3. implement change
4. open pull request
5. perform review
6. merge into develop
7. release to main when stable
