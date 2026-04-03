# Playwright TypeScript UI Test Framework

A portfolio-grade end-to-end test automation framework built with [Playwright](https://playwright.dev) and TypeScript.

## Getting Started

### Prerequisites

- Node.js 20+

### Run locally

```bash
npm install
npx playwright install
npx playwright test
```

### Run in Docker

```bash
docker build -t skeleton-playwright . && docker run --rm skeleton-playwright
```

## Configuration

Environment variables are managed via `.env`.

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://example.com` | Target URL |
| `HEADLESS` | `true` | Run browsers headlessly |
