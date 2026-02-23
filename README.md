# KHEDMA

A job aggregator built with Angular 21 that lets you search listings from the [Arbeitnow](https://www.arbeitnow.com/) API, save favorites, and track your applications — all in a dark-themed, minimal UI.

## Features

- **Job Search** — Browse and filter jobs by keyword, location, and remote status with infinite scrolling
- **Favorites** — Save interesting listings to revisit later (NgRx-managed state)
- **Application Tracking** — Track where you applied, update statuses (pending / accepted / rejected), and add personal notes
- **Auth** — Register, login, manage your profile, delete your account
- **Lazy Loading** — Every feature module is lazy-loaded for fast initial page loads

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components, signals) |
| State Management | NgRx (Store + Effects) |
| Styling | Tailwind CSS 4 |
| Icons | ng-icons (Lucide icon set) |
| Backend | JSON Server (local REST API for users, favorites, applications) |
| External API | [Arbeitnow Job Board API](https://www.arbeitnow.com/api/job-board-api) |

## Project Structure

```
src/app/
├── core/
│   ├── guards/          # Route guards (auth)
│   ├── interceptors/    # HTTP error interceptor
│   ├── models/          # TypeScript interfaces (Job, Application, Favorite, User)
│   └── services/        # API services (jobs, auth, favorites, applications)
├── features/
│   ├── applications/    # Application tracking (list, card, status/notes management)
│   ├── auth/            # Login & registration
│   ├── favorites/       # Saved jobs (list, card)
│   ├── home/            # Landing page
│   ├── jobs/            # Job search, filters, card with infinite scroll
│   └── profile/         # User profile management
├── shared/
│   ├── components/      # Loading spinner, navbar, pagination
│   └── pipes/           # Relative time, truncate
└── store/
    └── favorites/       # NgRx actions, effects, reducer, selectors
```

## Prerequisites

- **Node.js** 18+
- **npm** 9+

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd KHEDMA

# Install dependencies
npm install

# Start both the Angular dev server and JSON Server
npm start
```

This runs:
- Angular dev server at **http://localhost:4200**
- JSON Server at **http://localhost:3000** (proxied via `/api`)

### Other Scripts

```bash
npm run start:app   # Angular dev server only
npm run start:api   # JSON Server only
npm run build       # Production build
npm run test        # Run tests (Vitest)
```

## API

### External — Arbeitnow

The app fetches job listings from `https://www.arbeitnow.com/api/job-board-api` and applies client-side filtering by keyword and location.

### Local — JSON Server

User data, favorites, and applications are stored in `db.json` and served by JSON Server on port 3000. The Angular dev server proxies `/api` requests to it via `proxy.conf.json`.

| Endpoint | Description |
|---|---|
| `GET /api/users` | User accounts |
| `GET/POST/DELETE /api/favoritesOffers` | Saved job listings |
| `GET/POST/PATCH/DELETE /api/applications` | Tracked applications |

## Architecture Notes

- **Signals + OnPush** — All stateful components use Angular signals with `ChangeDetectionStrategy.OnPush` for efficient, granular re-rendering
- **Immutable state updates** — Arrays and collections are replaced (not mutated) so change detection picks up every update instantly
- **Infinite scrolling** — Jobs load in batches of 20. The scroll listener runs outside Angular's zone to avoid unnecessary change detection cycles
- **HTML stripping in service layer** — Job descriptions arrive as raw HTML from the API and are stripped once in `JobService` rather than per-card in the view
- **Lazy-loaded routes** — Each feature area is a separate chunk loaded on demand
