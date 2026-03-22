# 🚀 Getting Started — sms-service-ui (Dashboard)

> This is the **frontend repo** for the SMS Service Platform. The backend services live in a separate repo: [`sms-platform`](https://github.com/your-org/sms-platform).
>
> Read [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for the full architecture.

---

## Prerequisites

| Tool           | Version | Install                                                            |
| -------------- | ------- | ------------------------------------------------------------------ |
| Node.js        | 20 LTS+ | [nodejs.org](https://nodejs.org)                                   |
| pnpm           | 9+      | `npm i -g pnpm`                                                    |
| Git            | Latest  | [git-scm.com](https://git-scm.com)                                 |
| VS Code        | Latest  | Recommended editor                                                 |
| Docker Desktop | Latest  | [docker.com](https://docker.com) (only if running backend locally) |

### Recommended VS Code Extensions

```
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Thunder Client (API testing)
- GitLens
```

---

## Repository Structure

```
This repo (sms-service-ui):          # Next.js 14+ customer dashboard
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── sms/
│   │   │   ├── send/page.tsx
│   │   │   └── logs/page.tsx
│   │   ├── campaigns/page.tsx
│   │   ├── templates/page.tsx
│   │   ├── sender-ids/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/
│   │       ├── api-keys/page.tsx
│   │       ├── webhooks/page.tsx
│   │       └── profile/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── charts/
│   ├── tables/
│   └── forms/
├── lib/
│   ├── api-client.ts                # Typed API client (from OpenAPI spec)
│   ├── auth.ts
│   └── utils.ts
├── hooks/
├── store/                           # Zustand state management
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── Dockerfile
├── SYSTEM_DESIGN.md
├── GETTING_STARTED.md               # ← You are here
└── README.md

Sibling repo (sms-platform):         # Go backend monorepo
├── services/                        # All Go microservices
├── pkg/                             # Shared Go packages
├── infrastructure/
│   └── docker-compose.yml           # Runs all backend deps locally
├── docs/api/                        # OpenAPI spec (source of truth)
└── ...
```

---

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-org/sms-service-ui.git
cd sms-service-ui

pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

Key `.env.local` variables:

```env
# API backend URL (sms-platform API gateway)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Auth
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXTAUTH_SECRET=local-dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3001
```

### 3. Start the Backend (from sms-platform repo)

The dashboard needs the backend API running. You have two options:

**Option A: Run backend locally (recommended for full-stack dev)**

```bash
# In a separate terminal, from the sms-platform repo:
cd ../sms-platform
docker compose up -d          # Start PostgreSQL, Redis, Kafka, SMPP simulator
make dev                      # Start all Go services → API at http://localhost:3000
```

**Option B: Point to staging API**

```env
# In .env.local, point to a deployed staging environment:
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com
```

### 4. Start the Dashboard

```bash
pnpm dev
# Dashboard available at http://localhost:3001
```

### 5. Verify Setup

```
1. Open http://localhost:3001
2. You should see the login page
3. Use seeded test credentials (from sms-platform's `make db-seed`):
   Email:    admin@test.com
   Password: password123
4. You should see the dashboard home with charts and stats
```

---

## Development Workflow

### Available Scripts

```bash
pnpm dev          # Start dev server with hot reload (http://localhost:3001)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Auto-fix ESLint issues
pnpm type-check   # Run TypeScript compiler check
pnpm format       # Format with Prettier
```

### Adding a New Dashboard Page

```bash
# 1. Create the page
#    app/(dashboard)/my-page/page.tsx

# 2. Add API client function
#    lib/api-client.ts

# 3. Create components if needed
#    components/my-feature/

# 4. Add to sidebar navigation
#    components/sidebar.tsx
```

### API Client & OpenAPI Contract

```
The API contract is defined by the OpenAPI spec in sms-platform/docs/api/openapi.yaml.

To regenerate the typed API client after backend API changes:
  pnpm generate:api-client

This reads the OpenAPI spec and generates typed functions in lib/api-client.ts.
```

### Branch Naming

```
feature/SMS-123-add-bulk-send-page
bugfix/SMS-456-fix-chart-rendering
hotfix/SMS-789-login-redirect
chore/SMS-000-update-dependencies
```

### Commit Messages (Conventional Commits)

```
feat(dashboard): add SMS logs filtering
fix(auth): handle expired token redirect
docs(readme): update setup instructions
style(ui): improve mobile responsiveness
refactor(api-client): extract error handling
```

### PR Checklist

```
Before opening a PR, ensure:
☐ pnpm build succeeds without errors
☐ pnpm lint passes
☐ pnpm type-check passes (no TypeScript errors)
☐ No `any` types without justification
☐ New pages/components have responsive design
☐ Loading and error states are handled
☐ Environment variable changes added to .env.example
☐ No secrets or API keys committed
```

---

## Key Resources

| Resource           | Link                                                     |
| ------------------ | -------------------------------------------------------- |
| System Design Doc  | [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md)                   |
| Backend Repo       | [sms-platform](https://github.com/your-org/sms-platform) |
| API Spec (Swagger) | `http://localhost:3000/docs` (when backend is running)   |
| Next.js Docs       | [nextjs.org/docs](https://nextjs.org/docs)               |
| shadcn/ui          | [ui.shadcn.com](https://ui.shadcn.com)                   |
| Tailwind CSS       | [tailwindcss.com/docs](https://tailwindcss.com/docs)     |
| TanStack Query     | [tanstack.com/query](https://tanstack.com/query)         |
| Zustand            | [zustand-demo.pmnd.rs](https://zustand-demo.pmnd.rs)     |

---

## First Week Checklist (Frontend Developer)

```
Day 1:
  ☐ Read SYSTEM_DESIGN.md (sections 1, 4, 7, 8, 12)
  ☐ Set up local environment (this guide)
  ☐ Get the dashboard running locally
  ☐ Browse the codebase, understand folder structure
  ☐ Ensure pnpm build and pnpm lint pass

Day 2-3:
  ☐ Understand the API contract (OpenAPI spec)
  ☐ Read through the API client (lib/api-client.ts)
  ☐ Understand auth flow (login → JWT → protected routes)
  ☐ Pick up your first ticket (labeled "good-first-issue")
  ☐ Set up your PR review with a teammate

Day 4-5:
  ☐ Complete your first PR
  ☐ Explore existing pages and component patterns
  ☐ Understand the state management approach (Zustand)
  ☐ Test your changes against the backend API
  ☐ Discuss UI/UX questions with the team
```

---

_Happy building! 🚀_
