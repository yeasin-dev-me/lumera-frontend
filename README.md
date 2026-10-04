# Lumera Customer Storefront (`lumera-frontend`)

## Purpose
`lumera-frontend` is the customer-facing web application for the Lumera e-commerce platform. It provides the customer shopping experience, product discovery, shopping cart, checkout interaction, customer authentication, and account profile management.

---

## Architecture Role
In the Lumera ecosystem:
* Acts purely as a consumer of the Headless Backend API (`lumera-backend`).
* Communicates strictly via defined REST endpoints (`/api/v1/auth/`, `/api/v1/storefront/`, `/api/v1/customer/`).
* Never computes business authority (e.g. pricing, totals, discounts, inventory levels). All authoritative calculations reside exclusively in the backend.
* Completely isolated from administrative operations; operational management is handled by `lumera-cms`.

```text
Customer Browser
      │
      ▼
lumera-frontend (Next.js 15 App Router)
      │
      ▼ (REST: /api/v1/storefront/, /api/v1/auth/, /api/v1/customer/)
lumera-backend (Django REST API)
```

---

## Technology Stack
* **Framework:** Next.js 15 (App Router, Server Components by default)
* **Library:** React 19
* **Language:** TypeScript 5 (Strict Mode)
* **Styling:** Tailwind CSS 3 with Lumera design tokens
* **HTTP Client:** Native Fetch with typed wrapper and error normalization

---

## Repository Structure
```text
lumera-frontend/
├── src/
│   ├── app/                 # Next.js App Router (pages, layout, error boundaries)
│   │   ├── layout.tsx       # Root HTML layout with fonts and metadata
│   │   ├── page.tsx         # Storefront landing page & diagnostics
│   │   ├── loading.tsx      # Default loading skeleton
│   │   ├── error.tsx        # Standard error boundary
│   │   └── not-found.tsx    # Branded 404 page
│   ├── components/
│   │   └── ui/              # Reusable design primitives (Button, Card, Badge, Alert)
│   └── lib/
│       └── api/             # Typed API client with error normalization
├── public/                  # Static assets (favicons, brand assets)
├── Dockerfile               # Multi-stage production container build
├── tailwind.config.ts       # Design system tokens and color palette
├── tsconfig.json            # Strict TypeScript configuration
├── package.json             # Dependencies and scripts
└── AGENTS.md                # AI agent operating instructions
```

---

## Local Development
### Prerequisites
* Node.js 20+ and npm

### Installation & Run
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## Environment Variables
Defined in `.env.example`:
```env
# Storefront Public API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```
* Note: Only `NEXT_PUBLIC_*` environment variables are exposed to the browser.
* Never place backend secrets or private keys in this file.

---

## Running Tests
```bash
# Typecheck
npm run typecheck

# Linting
npm run lint
```

---

## Build
```bash
# Production Next.js build
npm run build

# Start production server
npm start
```

---

## Related Repositories
* [lumera-spec](https://github.com/yeasin-dev-me/lumera-spec) — Single Source of Truth for architecture & contracts
* [lumera-backend](https://github.com/yeasin-dev-me/lumera-backend) — Headless Django REST API
* [lumera-cms](https://github.com/yeasin-dev-me/lumera-cms) — Back-office operations and admin UI
* [lumera-integration](https://github.com/yeasin-dev-me/lumera-integration) — Cross-system contract and E2E tests
* [lumera-devops](https://github.com/yeasin-dev-me/lumera-devops) — Deployment, Docker, and Nginx configurations

---

## Documentation
* System Architecture: [lumera-spec/architecture/architecture.md](https://github.com/yeasin-dev-me/lumera-spec/blob/main/architecture/architecture.md)
* API Contract: [lumera-spec/contracts/api-contract.yaml](https://github.com/yeasin-dev-me/lumera-spec/blob/main/contracts/api-contract.yaml)
* Design System: [lumera-spec/design/design-system.md](https://github.com/yeasin-dev-me/lumera-spec/blob/main/design/design-system.md)

---

## Contribution / Git Workflow
1. Branch from `main`: `feature/<feature-name>` or `fix/<bug-name>`.
2. Follow Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`).
3. Ensure `npm run typecheck` and `npm run build` pass before opening a Pull Request.
4. Merge into `main` via squash-and-merge.
