# Travel Log

A private travel diary for the web. Keep photos and short notes from each day of a trip, log what you ate, and share a whole trip with one link when you want to.

**Live:** [travel-log-lake-omega.vercel.app](https://travel-log-lake-omega.vercel.app) · **API health:** [travel-log-api-iy1i.onrender.com/api/v1/health](https://travel-log-api-iy1i.onrender.com/api/v1/health)

> **Note:** the API runs on Render's free plan, which sleeps after 15 minutes without traffic. The first request after that can take about a minute while it wakes up.

## Status

Built milestone by milestone. Each milestone ends with something working and deployed.

- [x] **M0 · Setup:** monorepo, PostgreSQL, health endpoint and test, CI, deployment
- [ ] **M1 · Auth:** register, email verification, log in/out, password reset
- [ ] **M2 · Trips & entries:** timeline with day numbers, travel date and log date
- [ ] **M3 · Photos** and **M3b · Food log**
- [ ] **M4 · Offline drafts**
- [ ] **M5 · Share links + story mode**
- [ ] **M6 · Map + countries visited**
- [ ] **M7 · Memories + travel companions**
- [ ] **M8 · Book (A5 PDF) + data export**
- [ ] **M9 · Polish**

## Architecture

```
Browser ──> Next.js on Vercel ──(/api/* rewrite)──> Laravel API on Render ──> PostgreSQL on Neon
                                                          │
                                                          └──> Cloudflare R2 (photos, from M3)
```

The browser only talks to the Vercel domain. Next.js forwards `/api/*` and `/sanctum/*` to Laravel, so Sanctum's cookie-based login works without cross-site cookies.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router, TypeScript), Tailwind CSS 4, pnpm 10 |
| Backend | Laravel 13 on PHP 8.5, Sanctum |
| Database | PostgreSQL 17 |
| Tests | Pest (API), ESLint + TypeScript (web) |
| CI | GitHub Actions |
| Hosting | Vercel (web), Render with Docker (API), Neon (database) |

## Repository structure

```
travel-log/
├── apps/
│   ├── api/                Laravel API (Dockerfile for Render)
│   └── web/                Next.js app
├── .github/workflows/      api.yml, web.yml
└── README.md
```

## Running locally (macOS)

### Prerequisites

```bash
brew install php composer postgresql@17
brew services start postgresql@17
npm install -g pnpm@10
```

Node.js 20 or newer is also required.

### First-time setup

**API**

```bash
cd apps/api
composer install
cp .env.example .env
php artisan key:generate
createdb travel_log
createdb travel_log_test
```

In `apps/api/.env`, set `DB_USERNAME` to your macOS username, then:

```bash
php artisan migrate
```

**Web**

```bash
cd apps/web
pnpm install
cp .env.example .env.local
```

### Start developing

Two terminal tabs:

```bash
cd apps/api
php artisan serve
```

```bash
cd apps/web
pnpm dev
```

Open [localhost:3000](http://localhost:3000). The page should show **API: ok · database: ok**.

## Checks

```bash
cd apps/api
php artisan test
./vendor/bin/pint --test
```

```bash
cd apps/web
pnpm lint
pnpm typecheck
pnpm build
```

The same checks run in GitHub Actions on every push. Tests use a separate `travel_log_test` database, so they never touch development data.

## Deployment

Every push to `main` deploys automatically:

- **Web:** Vercel builds `apps/web`. Environment variable: `API_URL`.
- **API:** Render builds `apps/api/Dockerfile`, runs migrations on start, and checks `/api/v1/health` before switching traffic. Environment variables: `APP_KEY`, `APP_ENV`, `APP_DEBUG`, `LOG_CHANNEL`, `DB_CONNECTION`, `DB_URL`.
