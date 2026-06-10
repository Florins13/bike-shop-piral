# Piral Bike Shop — Overview & Setup Guide

## Table of Contents

1. [What is Piral?](#what-is-piral)
2. [Project Architecture](#project-architecture)
3. [Project Structure](#project-structure)
4. [How Piral Works](#how-piral-works)
5. [Running in Development (without Docker)](#running-in-development-without-docker)
6. [Running with Docker Compose](#running-with-docker-compose)
7. [API Dependencies](#api-dependencies)
8. [References](#references)

---

## What is Piral?

[Piral](https://piral.io/) is a React-based framework for building **microfrontend** applications. It provides a structured way to split a web application into independently developed, deployed, and maintained modules called **pilets**.

Key concepts:
- **Piral Instance (Shell)**: The host application that provides the layout, navigation, shared dependencies, and a runtime for loading pilets.
- **Pilets**: Self-contained microfrontend modules that are loaded at runtime into the shell. Each pilet can register pages, tiles, menu items, and other extensions.
- **Feed Service**: A mechanism (URL endpoint) that tells the shell which pilets to load and where to find them.

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (localhost:1233)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Piral Shell (App Shell)                  │  │
│  │  - Header (logo, title, nav icons)                        │  │
│  │  - Router                                                  │  │
│  │  - Footer                                                  │  │
│  │  - Loads pilets from feed URLs                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│          │                    │                    │              │
│          ▼                    ▼                    ▼              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Bikes Pilet  │   │  Cart Pilet  │   │ Orders Pilet │        │
│  │ (port 1234)  │   │ (port 1235)  │   │ (port 1236)  │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│          │                    │                    │              │
└──────────┼────────────────────┼────────────────────┼─────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ Bike Service │   │ Cart Service │   │Order Service │
    │  (port 8081) │   │  (port 8082) │   │ (port 8083)  │
    └──────────────┘   └──────────────┘   └──────────────┘
```

### Communication Between Pilets

Pilets communicate via **browser custom events**:
- The Bikes pilet dispatches an `add-to-cart` event when a user clicks "Add to cart"
- The Cart pilet listens for `add-to-cart` events and updates its state
- Navigation between pilets uses standard React Router links

---

## Project Structure

```
bike-shop-piral/
├── src/                        # Piral Shell (app shell)
│   ├── index.html              # HTML entry point
│   ├── index.tsx               # Piral instance setup + feed URLs
│   ├── layout.tsx              # Shell layout (header, footer, dashboard)
│   ├── style.scss              # Global styles
│   └── assets/icons/           # Navigation icons
├── bikes/                      # Bikes Pilet
│   ├── src/
│   │   ├── index.tsx           # Pilet setup (registers tile)
│   │   ├── Bikes.tsx           # Bike list component
│   │   └── BikeService.ts     # API service (port 8081)
│   ├── package.json
│   └── pilet.json
├── cart/                       # Cart Pilet
│   ├── src/
│   │   ├── index.tsx           # Pilet setup (registers tile)
│   │   ├── Cart.tsx            # Cart component
│   │   └── CartService.tsx     # API service (port 8082)
│   ├── package.json
│   └── pilet.json
├── orders/                     # Orders Pilet
│   ├── src/
│   │   ├── index.tsx           # Pilet setup (registers /checkout page)
│   │   ├── Checkout.tsx        # Checkout form + order summary
│   │   ├── OrderHistory.tsx    # Order history table
│   │   ├── OrderService.ts     # API service (ports 8082, 8083)
│   │   └── OrderModels.ts      # TypeScript interfaces
│   ├── package.json
│   └── pilet.json
├── docker-compose.yml          # Docker orchestration
├── Dockerfile.shell            # Shell container (nginx)
├── Dockerfile.pilet            # Pilet containers (node + pilet debug)
├── nginx.conf                  # Nginx config for SPA
├── package.json                # Shell dependencies
└── piral.json                  # Piral configuration
```

---

## How Piral Works

### 1. Shell Initialization

The shell (`src/index.tsx`) creates a Piral instance and fetches pilet metadata from configured feed URLs:

```typescript
const feeds = [
  'http://localhost:1234/$pilet-api/',
  'http://localhost:1235/$pilet-api/',
  'http://localhost:1236/$pilet-api/',
];

const instance = createInstance({
  state: { components: layout, errorComponents: errors },
  plugins: [...createStandardApi()],
  requestPilets() {
    return Promise.all(feeds.map(url => fetch(url).then(r => r.json())))
      .then(results => results.flat());
  },
});
```

### 2. Pilet Loading

Each feed URL returns JSON metadata like:
```json
[{
  "name": "bikes",
  "version": "1.0.0",
  "link": "http://localhost:1234/$pilet-api/0/index.js",
  "spec": "v2"
}]
```

The shell downloads and executes each pilet's JavaScript bundle.

### 3. Pilet Registration

Each pilet exports a `setup` function that receives the Piral API:

```typescript
export function setup(app: PiletApi) {
  app.registerTile(() => <BikeList />);       // Dashboard tile
  app.registerPage('/checkout', Checkout);    // Route
  app.registerMenu(() => <Link to="/x">X</Link>); // Menu item
}
```

### 4. Layout & Rendering

The shell's layout defines where pilet content appears:
- `DashboardContainer` / `DashboardTile`: Where tiles render (the shopping view)
- `Layout`: Overall page structure (header + content + footer)
- `MenuContainer`: The navigation bar

---

## Running in Development (without Docker)

### Prerequisites
- Node.js 18+
- npm

### Step 1: Build the Shell (generates emulator for pilets)

```bash
cd bike-shop-piral
npm install
npm run build
```

This creates:
- `dist/release/` — Production build of the shell
- `dist/emulator/piral-shell-1.0.0.tgz` — Emulator package for pilet development

### Step 2: Install & Start Each Pilet

In separate terminal windows:

```bash
# Terminal 1 — Bikes pilet
cd bikes
npm install
npm run start    # Starts on port 1234

# Terminal 2 — Cart pilet
cd cart
npm install
npm run start    # Starts on port 1235

# Terminal 3 — Orders pilet
cd orders
npm install
npm run start    # Starts on port 1236
```

Each pilet's `pilet debug` command:
- Bundles the pilet source
- Starts a dev server with the shell emulator
- Serves a feed API at `/$pilet-api/`

### Step 3: Access the Application

Open `http://localhost:1234` (or whichever pilet you started first — the emulator shell loads all configured pilets).

> **Note:** In dev mode, each pilet runs an embedded shell emulator. For a production-like setup with a standalone shell, use Docker.

---

## Running with Docker Compose

### Prerequisites
- Docker & Docker Compose
- Backend services running (from the `software-engineering` repo)

### Step 1: Start the Backend Services

```bash
cd /path/to/software-engineering
docker compose up -d
```

This starts: Kafka, Redis, PostgreSQL, bike-service (8081), cart-service (8082), order-service (8083).

### Step 2: Build the Piral Shell

```bash
cd bike-shop-piral
npm install
npm run build
```

### Step 3: Start the Frontend Services

```bash
docker compose up -d --build
```

This starts:
| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| piral-shell | piral-shell | 1233 | Nginx serving the shell (production build) |
| bikes-pilet | bikes-pilet | 1234 | Bikes pilet dev server + feed API |
| cart-pilet | cart-pilet | 1235 | Cart pilet dev server + feed API |
| orders-pilet | orders-pilet | 1236 | Orders pilet dev server + feed API |

### Step 4: Access the Application

Open **http://localhost:1233** in your browser.

The shell loads pilet bundles from ports 1234, 1235, and 1236 automatically.

### Stopping

```bash
docker compose down
```

---

## API Dependencies

The frontend expects these backend services to be running:

| Service | Port | Endpoints |
|---------|------|-----------|
| bike-service | 8081 | `GET /bikes` |
| cart-service | 8082 | `GET /cart`, `POST /cart/add/{bikeId}`, `POST /cart/delete/{itemId}`, `POST /cart/updateQuantity/{itemId}/{type}` |
| order-service | 8083 | `POST /order/finalise`, `GET /order/history` |

The cart-service also serves static bike images at the root (e.g., `http://localhost:8082/bike_one.jpg`).

---

## References

- [Piral Official Documentation](https://docs.piral.io/)
- [Getting Started with Piral](https://docs.piral.io/guidelines/tutorials/02-getting-started)
- [Pilet API Reference](https://docs.piral.io/reference/documentation/C31-pilet-api)
- [Piral CLI Commands](https://docs.piral.io/tooling/piral-cli)
- [Piral GitHub Repository](https://github.com/smapiot/piral)
