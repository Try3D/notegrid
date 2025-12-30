# Eisenhower - Full-Stack Productivity App

## IMPORTANT: Agent Rules
**DO NOT run any commands (npm, expo, dev servers, etc.) until the user explicitly tells you to.** Only provide instructions and let the user execute commands themselves.

## Project Overview
A full-stack productivity app with:
- **Eisenhower Matrix** task manager (4-quadrant: Do, Schedule, Delegate, Eliminate)
- **Todo Manager** (tasks grouped by color)
- **Links/Bookmarks** manager
- **Settings** page (UUID display, export data, delete account)

## Tech Stack
- **Monorepo**: Turborepo
- **Frontend**: React + React Router + Vite (`apps/web`)
- **Backend**: Hono on Cloudflare Workers (`apps/api`)
- **Storage**: Cloudflare KV (namespace ID: `bbc7614ed6124dca84cca2c3e3d01a8d`)
- **Shared Types**: `packages/shared`
- **Auth**: Loginless UUID system (user generates/enters a UUID as their identity)

## Directory Structure
```
/eisenhower
├── apps/
│   ├── web/                    # React Vite frontend
│   │   ├── src/
│   │   │   ├── main.tsx        # App entry point
│   │   │   ├── App.tsx         # Routes configuration
│   │   │   ├── styles.css      # All styles
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx   # UUID-based auth state
│   │   │   │   ├── DataContext.tsx   # Tasks/Links data + API sync
│   │   │   │   └── ThemeContext.tsx  # Dark/light mode
│   │   │   ├── components/
│   │   │   │   ├── Layout.tsx        # Sidebar + main content wrapper
│   │   │   │   └── TaskDrawer.tsx    # Slide-out drawer for editing tasks
│   │   │   └── pages/
│   │   │       ├── Login.tsx         # Generate/enter UUID
│   │   │       ├── Todos.tsx         # Tasks grouped by color
│   │   │       ├── Matrix.tsx        # Eisenhower 4-quadrant matrix
│   │   │       ├── Links.tsx         # Bookmarks manager
│   │   │       └── Settings.tsx      # UUID, export, delete account
│   │   ├── index.html
│   │   ├── vite.config.ts      # Vite config with API proxy
│   │   └── package.json
│   └── api/                    # Hono Cloudflare Workers backend
│       ├── src/
│       │   └── index.ts        # API routes
│       ├── wrangler.json       # Cloudflare Workers config
│       └── package.json
├── packages/
│   └── shared/                 # Shared TypeScript types
│       └── src/
│           └── index.ts        # Task, Link, UserData types + utilities
├── package.json                # Root monorepo package.json
├── turbo.json                  # Turborepo config
└── tsconfig.json               # Root TypeScript config
```

## API Endpoints (apps/api/src/index.ts)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data` | Fetch user data (requires `Authorization: Bearer <uuid>`) |
| PUT | `/api/data` | Save user data (requires `Authorization: Bearer <uuid>`) |
| GET | `/api/exists/:uuid` | Check if UUID exists in system |
| POST | `/api/register` | Register new UUID (creates empty data) |
| GET | `/api/health` | Health check |

## Data Models (packages/shared/src/index.ts)

### Task
```typescript
interface Task {
  id: string;
  title: string;
  note: string;
  tags: string[];
  color: string;
  q: 'do' | 'decide' | 'delegate' | 'delete' | null;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}
```

### Link
```typescript
interface Link {
  id: string;
  url: string;
  title: string;
  favicon: string;
  createdAt: number;
}
```

### UserData
```typescript
interface UserData {
  tasks: Task[];
  links: Link[];
  createdAt: number;
  updatedAt: number;
}
```

## Commands
```bash
npm install          # Install all dependencies
npm run dev          # Start both web (port 5173) and api (port 8787) dev servers
npm run build        # Build all packages
```

## Current Status

### Completed
- [x] Turborepo monorepo setup
- [x] Vite + React frontend with React Router
- [x] Hono API with Cloudflare KV integration
- [x] Shared types package
- [x] Auth context (UUID-based loginless auth)
- [x] Data context (localStorage cache + API sync with debounce)
- [x] Theme context (dark/light mode)
- [x] Login page (generate new UUID / enter existing)
- [x] Todos page (tasks grouped by color, with quadrant badges)
- [x] Matrix page (Eisenhower 4-quadrant + unassigned column)
- [x] Links page (add/delete bookmarks)
- [x] Settings page (view UUID hidden/shown, export JSON, delete account)
- [x] Sidebar navigation with all routes
- [x] TaskDrawer component for editing tasks

### Known Issues
- API server must be running on port 8787 for frontend to work (Vite proxies `/api` requests)
- If port 8787 is occupied by another process, kill it first: `pkill -f workerd`

### TODO
- [x] Test full app flow end-to-end
- [x] Clean up old legacy files from root directory (index.html, matrix.html, links.html, *.js, old styles.css, *.svg)
- [x] Move SVG assets to apps/web/public/
- [ ] Deploy to Cloudflare (Pages for frontend, Workers for API)

## Design Notes
- Uses 'Short Stack' Google Font for a handwritten/playful look
- CSS variables for theming (light/dark mode)
- Sidebar navigation on the left
- Task drawer slides in from right for editing
- Colors: red, green, orange, blue, purple, pink, teal, yellow, gray, dark
