# AGENTS.md — lumera-frontend

## Repository Responsibility
`lumera-frontend` is the customer-facing Storefront for the Lumera e-commerce platform. It provides customer authentication, catalog browsing, product display, shopping cart interactions, and account management.

## Allowed Technologies
* Next.js 15 (App Router)
* React 19
* TypeScript (strict mode)
* Tailwind CSS 3
* Native Fetch API (via `src/lib/api/client.ts`)

## Directory Conventions
* `src/app/`: Next.js App Router routes, layouts, error/loading states.
* `src/components/ui/`: Reusable, atomic design system primitives (Button, Card, Badge, Alert).
* `src/components/features/<domain>/`: Domain-specific components (e.g. `catalog/`, `cart/`, `account/`).
* `src/lib/api/`: Centralized API client and error handling logic.
* `src/lib/tracking/`: Unified analytics and tracking abstraction.

## Coding Conventions
* Strict TypeScript: no unannotated `any`.
* Server Components by default; add `"use client"` only when user interactivity/state requires it.
* Follow design tokens defined in `tailwind.config.ts` and `lumera-spec/design/design-system.md`.
* Co-locate tests with components (`*.test.tsx`).
* Always provide loading, empty, and error states for data-driven views.

## Testing Requirements
* `npm run typecheck` must pass with 0 errors.
* `npm run build` must complete cleanly.
* UI component tests for form validation and user interactions.

## Git Rules
* Branch naming: `feature/<feature-name>`, `fix/<bug-name>`, `chore/<chore-name>`.
* Commit messages: Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`).
* Target branch: `main` (protected; changes merged via PR).

## Security Rules
* **No business authority in frontend**: Never compute prices, order totals, discount calculations, or stock deductions on the client.
* **Token security**: Access tokens must remain in memory only; never store sensitive authentication tokens in `localStorage` or `sessionStorage`.
* **Zero secrets**: Never place backend secrets or private keys in frontend source code or environment variables. Only `NEXT_PUBLIC_*` variables are permitted.
* Avoid `dangerouslySetInnerHTML` on unverified external content.

## What the Agent Must NOT Modify
* Do not introduce backend Python or Django code.
* Do not introduce CMS admin UI or call `/api/v1/admin/` endpoints.
* Do not alter root project architecture without an approved ADR in `lumera-spec`.

## Where Shared Project Specification Lives
All shared architectural specifications, API schemas, and business rules live in:
`lumera-spec/` (e.g., `contracts/api-contract.yaml`, `architecture/`).

## How to Handle Architecture Changes
If an API response or endpoint is missing:
1. Do not invent an unapproved contract shape or mock unauthorized endpoints.
2. Request a contract update in `lumera-spec/contracts/api-contract.yaml`.
3. Update `lumera-backend` before consuming the new endpoint in `lumera-frontend`.

## Definition of Done
* `npm run typecheck` passes with 0 errors.
* `npm run build` compiles with 0 errors.
* Accessible, responsive UI adhering to Lumera design system tokens.
* Normalized API error handling via `src/lib/api/client.ts`.
