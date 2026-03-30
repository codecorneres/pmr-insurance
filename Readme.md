# Laravel React Starter Kit

A modern full-stack starter kit built with **Laravel 12**, **React 19**, **Inertia.js**, **Tailwind CSS v4**, and **TypeScript** — wired up with real-time support via **Laravel Reverb**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 19 + TypeScript |
| Bridge | Inertia.js v2 |
| Styling | Tailwind CSS v4 |
| Real-time | Laravel Reverb + Laravel Echo |
| UI Components | Radix UI + shadcn/ui primitives |
| Build Tool | Vite 6 |
| Testing | Pest 3 |
| Routing | Ziggy (Laravel → JS routes) |

---

## Requirements

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 20.x
- **npm** >= 10.x

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd your-project

composer install
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Database Setup

```bash
touch database/database.sqlite   # default SQLite DB
php artisan migrate
```

### 4. Start Development Server

```bash
composer run dev
```

This runs all services concurrently:

| Service | Description |
|---------|-------------|
| `php artisan serve` | Laravel HTTP server |
| `php artisan queue:listen` | Queue worker |
| `php artisan pail` | Log viewer |
| `npm run dev` | Vite HMR dev server |

---

## Available Scripts

### Composer

| Command | Description |
|---------|-------------|
| `composer run dev` | Start all dev services concurrently |
| `composer run dev:ssr` | Start dev with Server-Side Rendering |

### npm

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run build:ssr` | SSR production build |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check Prettier formatting |
| `npm run types` | TypeScript type check (no emit) |

---

## Project Structure

```
├── app/                    # Laravel application code
├── database/
│   ├── factories/          # Model factories
│   ├── migrations/         # Database migrations
│   └── seeders/            # Database seeders
├── resources/
│   ├── js/                 # React + TypeScript frontend
│   └── views/              # Blade views (Inertia root)
├── routes/                 # Laravel route definitions
├── tests/                  # Pest test suites
├── composer.json
├── package.json
└── vite.config.ts
```

---

## Real-time (Laravel Reverb)

This kit includes **Laravel Reverb** for WebSocket-based real-time features, paired with **Laravel Echo** and **Pusher JS** on the frontend.

Configure in your `.env`:

```env
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

---

## UI Components

Built on **Radix UI** primitives with **shadcn/ui** conventions:

- Alert Dialog, Avatar, Checkbox, Collapsible
- Dialog, Dropdown Menu, Label, Navigation Menu
- Select, Separator, Slot, Toggle, Toggle Group, Tooltip

Icons via **Lucide React**. Notifications via **Sonner**.

---

## Testing

Tests are written with [Pest](https://pestphp.com/):

```bash
php artisan test
# or
./vendor/bin/pest
```

---

## Production Build

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### SSR Build

```bash
composer run dev:ssr
```

---

## License

This project is open-sourced under the [MIT license](LICENSE).
