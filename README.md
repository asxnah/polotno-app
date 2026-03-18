# Polotno App

Next.js + Polotno project with Docker support (production and development)

## Setup

1. Create `.env` in the project root:

``` bash
NEXT_PUBLIC_POLOTNO_KEY=your_polotno_key_here

```

2. Install dependencies (optional, for local dev):

``` bash
npm install

```

---

## Running with Docker

### Production

Build and run:

``` bash
docker compose build --no-cache
docker compose up

```

App will be available at `http://localhost:4200`.

### Development

Use the dev compose file for hot reload:

``` bash
docker compose -f docker-compose.dev.yml up --build

```

- Hot reload enabled
- Code changes on host are reflected in the container

---

## Project Structure

- `app/` - Next.js pages
- `components/` - Polotno editor component
- `.dockerignore` - files excluded from Docker build
- `.env` - environment variables (API key)