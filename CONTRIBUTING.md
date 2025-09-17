# Contributing Workflow

We use pull requests for all changes. Do not push directly to `main`.

## Branching

- Create a feature branch: `git checkout -b feature/<short-desc>`
- Commit changes locally.

## Pull Requests

- Push your branch: `git push -u origin feature/<short-desc>`
- Open a PR against `main` with a clear title and description.
- Ensure checks pass. Request a review.

## Local Guard

A local pre-push hook blocks pushing to `main`/`master`:
- Installed at `.git/hooks/pre-push`
- To bypass (not recommended): `PROTECTED_BRANCHES='' git push`

## Deploys

- Render Static Site auto-deploys from `main` after PR merges.

