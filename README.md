# Polotno App

Next.js + Polotno project with Docker support (production and development)

## Setup

1. Create `.env` in the project root:

```bash
NEXT_PUBLIC_POLOTNO_KEY=your_polotno_key_here

```

2. Install dependencies (optional, for local dev):

```bash
npm install

```

---

## Running with Docker

### Production

Build and run:

```bash
docker compose build --no-cache
docker compose up

```

App will be available at `http://localhost:4200`.

### Development

Use the dev compose file for hot reload:

```bash
docker compose -f docker-compose.dev.yml up --build

```

- Hot reload enabled
- Code changes on host are reflected in the container

---

## Project Structure

- `app/` - Next.js pages and global settings

- `src/entities/step/model/types.ts` - data types for steps and media

- `src/features/init-editor/lib/loadProject.ts` - function to load a project

- `src/features/init-editor/model/useInitEditor.ts` - React hook for editor initialization

- `src/shared/api/getStep.ts` - API connector to fetch step data

- `src/shared/config/polotno-store.ts.ts` - Polotno configuration and store

- `src/shared/lib/query.ts` - read and validate query parameters from URL

- `src/widgets/editor/lib/i18n.ts` - translation/localization for editor

- `src/widgets/editor/ui/EditorPage.tsx` - editor page with loading/error states

- `src/widgets/editor/ui/EditorUI.tsx` - Polotno editor UI, receives store as a prop

- `.dockerignore` - files excluded from Docker build

- `.env` - environment variables

- `docker-compose.yml` / `docker-compose.dev.yml` - Docker Compose configuration

- `Dockerfile` - container build instructions

- `eslint.config.mjs` - ESLint configuration

- `next.config.ts` - Next.js configuration

- `tsconfig.json` - TypeScript configuration

- `postcss.config.mjs` - PostCSS configuration

- `package.json` / `package-lock.json` - project dependencies and scripts

- `README.md` - project documentation
