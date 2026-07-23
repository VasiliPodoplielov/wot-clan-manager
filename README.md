# WoT Clan Manager

A web application for managing a World of Tanks clan: member roster with live Wargaming stats, WG OpenID / email login, role-based access (member / officer / moderator), and event sign-up forms (e.g. Maneuvers).

Nx monorepo with two apps:

- **`apps/client`** — Angular 21 (standalone components, signals, NgRx, PrimeNG)
- **`apps/server`** — NestJS 11 (TypeORM + PostgreSQL, JWT auth, Wargaming API integration)

## Prerequisites

- Node.js and npm
- A PostgreSQL database

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file at the repo root (read by `apps/server`) with:

```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
WG_APPLICATION_ID=
WG_REDIRECT_URI=
```

`WG_APPLICATION_ID` is a Wargaming API application ID (https://developers.wargaming.net/). `WG_REDIRECT_URI` must match the callback route registered there and point at the client's `/auth/callback` route.

## Development

Run both apps together:

```bash
npm run dev
```

Or individually:

```bash
npm run client:dev   # Angular dev server, http://localhost:4200
npm run server:dev   # NestJS server, http://localhost:3000
```

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## Linting & formatting

```bash
npm run lint
npm run format:check
npm run code:check   # lint + format:check
```

See [CLAUDE.md](CLAUDE.md) for architecture notes and guidance on working in this codebase.
