# 🎬 Movie Explorer

> **Loons Lab Developer Selection Test**
> Complete Implementation from Zero to Production
> **Production Frontend**: React 19 + TypeScript + Vite + Material UI (MUI v9)
> **Backend & Services**: Supabase (Auth + PostgreSQL + Row Level Security + Edge Functions Proxy)
> **External Movie Data**: The Movie Database (TMDb) API via secure Edge Function

---

## 🌟 Overview

**Movie Explorer** is a cinematic, accessible movie discovery and watchlist management platform built with modern React 19, TypeScript, Material UI, and Supabase. Users can explore trending films, search titles with debounce and query persistence, filter catalogues by genre, release year, minimum rating, and popularity, watch official YouTube trailers in an accessible modal dialog, toggle between dark and light themes, and manage persistent personal favorites with automatic guest-to-cloud synchronization.

Designed with a rich cinematic aesthetic—featuring deep charcoal backgrounds, warm gold/amber accents, refined typography, and smooth Anime.js micro-animations that respect reduced-motion preferences.

---

## 🚀 Key Features

- **Trending & Featured Showcase**:
  - Hero banner showcasing top featured presentation with backdrop gradient overlay and instant trailer playback.
  - Trending films grid with time-window selector (Weekly vs. Daily trends).
- **Search & Discovery**:
  - Live search with query debouncing and URL search parameter synchronization (`/search?q=...`).
  - Search query persistence in `localStorage` under `movie-explorer:last-search`.
  - Comprehensive filter panel: genre filtering, release year selection, minimum rating threshold, and sorting (popularity, rating, release date, vote count).
- **Infinite Scroll & Load More**:
  - Smooth infinite scrolling using `react-intersection-observer` combined with TanStack Query's `useInfiniteQuery`.
  - Explicit **"Load More"** button syncing seamlessly with the infinite query state without duplicate requests.
- **Movie Details & Trailer Integration**:
  - Complete film information (`/movie/:movieId`): backdrop banner, high-resolution poster with fallback, synopsis, rating, runtime, release date, and top billed cast.
  - Video retrieval filtering official trailers hosted on YouTube.
  - Accessible, responsive modal player (`TrailerModal`) validating video keys and trapping focus.
- **Supabase Authentication**:
  - Secure email & password registration with unique username profiles.
  - Session restoration on page refresh.
  - Responsive user account menu and protected user actions.
  - Form validation with React Hook Form and Zod schemas.
- **Watchlist & Dual Persistence**:
  - Authenticated favorites stored in Supabase PostgreSQL protected by Row Level Security (RLS).
  - Guest/local fallback stored in `movie-explorer:guest-favorites`.
  - Automatic seamless synchronization and deduplication of guest favorites to Supabase upon login.
- **Dark & Light Theming**:
  - Global theme switch with persistent state (`movie-explorer:theme`).
  - Curated palettes: Deep charcoal & warm cinematic amber for dark mode; crisp warm off-white for light mode.
- **Performance & Micro-Animations**:
  - Subtle Anime.js entrance animations and favorite button feedback.
  - Full support for `prefers-reduced-motion: reduce`.
  - Optimized chunk splitting (`vendor-react`, `vendor-mui`, `vendor-query`, `vendor-supabase`).

---

## 🏗️ Architecture & Directory Structure

```
movie-explorer/
├── public/
│   ├── favicon.svg              # Cinematic film clapper/reel SVG favicon
│   └── ...
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root application component
│   │   ├── providers.tsx        # React Query, Theme, Auth & Favorites providers
│   │   └── router.tsx           # React Router route definitions
│   ├── components/
│   │   ├── feedback/
│   │   │   ├── EmptyState.tsx   # Reusable empty results feedback
│   │   │   ├── ErrorBoundary.tsx# Application crash containment
│   │   │   ├── ErrorState.tsx   # Reusable API & network error feedback
│   │   │   └── LoadingSkeleton.tsx # Skeleton placeholders
│   │   ├── layout/
│   │   │   ├── Footer.tsx       # TMDb attribution & platform footer
│   │   │   ├── Layout.tsx       # Shell layout wrapper
│   │   │   └── Navbar.tsx       # Header with branding, navigation & theme toggle
│   │   ├── movie/
│   │   │   ├── CastList.tsx     # Cast member carousel with profile avatars
│   │   │   ├── HeroSection.tsx  # Featured presentation banner
│   │   │   ├── MovieCard.tsx    # 2:3 aspect poster card with rating & favorite toggle
│   │   │   ├── MovieGrid.tsx    # Responsive grid with Anime.js entrance
│   │   │   └── TrailerModal.tsx # YouTube dialog player with security controls
│   │   └── search/
│   │       ├── FilterBar.tsx    # Genre, year, rating, and sorting controls
│   │       └── SearchBar.tsx    # Debounced search input with clear & history
│   ├── features/
│   │   ├── auth/                # Supabase auth context and hook
│   │   ├── favorites/           # Favorites context & cloud/guest sync
│   │   ├── movies/              # TanStack Query hooks (trending, search, details, etc.)
│   │   └── theme/               # Theme context, mode persistence, & theme utils
│   ├── pages/
│   │   ├── FavoritesPage.tsx    # User's saved movie library with sorting
│   │   ├── HomePage.tsx         # Hero banner & trending movie showcases
│   │   ├── LoginPage.tsx        # Zod validated sign in
│   │   ├── MovieDetailsPage.tsx # Complete movie overview, cast, & trailer
│   │   ├── NotFoundPage.tsx     # 404 error page
│   │   ├── SearchPage.tsx       # Discover & live search with infinite scroll
│   │   └── SignupPage.tsx       # Registration with username profile creation
│   ├── services/
│   │   ├── supabase/            # Supabase client initialization
│   │   └── tmdb/                # Axios client calling Edge Function proxy
│   ├── test/
│   │   ├── setup.ts             # Vitest test setup with DOM & matchMedia mocks
│   │   ├── components/          # MovieCard, SearchBar, TrailerModal, Feedback tests
│   │   ├── integration/         # Auth forms & Favorites flow integration tests
│   │   └── unit/                # Formatters, validation, error normalization, & theme tests
│   ├── theme/                   # MUI dark & light palette tokens & typography
│   ├── types/                   # TypeScript interfaces (Movie, Auth, Favorite)
│   ├── utils/                   # Formatter, animation, error, & validation utilities
│   ├── main.tsx                 # Entry mount
│   └── vite-env.d.ts            # Vite & Vitest environment types
├── supabase/
│   ├── functions/
│   │   └── tmdb/
│   │       └── index.ts         # Secure Edge Function proxying TMDb with access token secret
│   └── migrations/
│       └── 001_initial_schema.sql # Profiles, Favorites, RLS policies, & Triggers
├── .env.example                 # Safe environment configuration template
├── .gitignore                   # Git ignores (tokens, local envs, build artifacts)
├── vercel.json                  # Vercel SPA routing configuration
├── vite.config.ts               # Vite configuration with Vitest & code splitting
└── package.json                 # Dependencies & test scripts
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript (Strict), Vite 8 |
| **UI Components & Styling** | Material UI (MUI v9), Emotion, Vanilla CSS tokens |
| **Navigation** | React Router v7 |
| **Server State & Caching** | TanStack Query v5, Axios |
| **Client State** | React Context (Auth, Theme, Favorites) |
| **Form Management** | React Hook Form, Zod v4 |
| **Animations** | Anime.js v4 (with `prefers-reduced-motion` compliance) |
| **Testing** | Vitest v5, React Testing Library, Jest DOM |
| **Backend & DB** | Supabase Auth, PostgreSQL, Row Level Security (RLS) |
| **API Proxy** | Supabase Edge Functions (Deno runtime) |
| **Data Provider** | The Movie Database (TMDb) API v3 |

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Populate the required variables:

```env
# Supabase Project Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# TMDb Proxy Endpoint (Supabase Edge Function)
# Point to your deployed Supabase Edge Function:
VITE_TMDB_PROXY_URL=https://your-project-id.supabase.co/functions/v1/tmdb
```

> ⚠️ **SECURITY MANDATE**:
> The TMDb Bearer Token (`TMDB_ACCESS_TOKEN`) must **NEVER** be stored in any frontend environment variable or committed to Git. It is configured exclusively as a secure secret in Supabase Edge Functions (`supabase secrets set TMDB_ACCESS_TOKEN="..."`).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm 9+
- TMDb Developer Account (Free API Read Access Token)
- Supabase Account (Free project tier)

### 2. Installation
```bash
git clone <your-repository-url> movie-explorer
cd movie-explorer
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing and Quality Assurance

The project includes unit, component, and integration tests using Vitest and React Testing Library.

```bash
# Run automated tests
npm run test

# Run tests in watch mode
npm run test:watch

# TypeScript type checking
npm run typecheck

# Code quality and style linting
npm run lint

# Production build bundle
npm run build
```

---

## 🗄️ Supabase Backend & Database Setup

### 1. Database Migrations & Schema
Run the migration in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) in your Supabase SQL Editor:

- **`profiles` Table**:
  - `id`: UUID primary key referencing `auth.users(id) ON DELETE CASCADE`.
  - `username`: Unique username (3–30 characters).
  - `avatar_url`: Nullable profile photo.
  - `created_at`: Timestamptz.
- **`favorites` Table**:
  - `id`: Generated UUID primary key.
  - `user_id`: UUID referencing `auth.users(id) ON DELETE CASCADE`.
  - `tmdb_movie_id`: Integer TMDb film ID.
  - `title`, `poster_path`, `release_date`, `vote_average`.
  - `created_at`: Timestamptz.
  - **Constraint**: `UNIQUE (user_id, tmdb_movie_id)` preventing duplicate saves.

### 2. Row Level Security (RLS) Policies
Both tables have Row Level Security strictly enforced:
- **Profiles**:
  - Users can read their own profile (`auth.uid() = id`).
  - Users can insert and update only their own profile.
- **Favorites**:
  - Users can read only their own favorites (`auth.uid() = user_id`).
  - Users can insert favorites only matching their authenticated `auth.uid()`.
  - Users can delete only their own favorites (`auth.uid() = user_id`).

### 3. Deploying the Supabase Edge Function Proxy
The Edge Function in [`supabase/functions/tmdb/index.ts`](supabase/functions/tmdb/index.ts) securely handles all movie requests:

```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your Supabase project
npx supabase link --project-ref your-project-id

# 3. Set the TMDb API Token secret on Supabase
npx supabase secrets set TMDB_ACCESS_TOKEN="your_tmdb_read_access_token_here"

# 4. Deploy the Edge Function
npx supabase functions deploy tmdb --no-verify-jwt
```

---

## 🌐 Vercel Deployment Guide

1. Push your repository to **GitLab** or **GitHub**.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `movie-explorer` repository.
4. Set the Framework Preset to **Vite**.
5. Add the Environment Variables:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
   - `VITE_TMDB_PROXY_URL` = `https://your-project.supabase.co/functions/v1/tmdb`
6. Click **Deploy**.
7. In your Supabase Dashboard under **Authentication > URL Configuration**:
   - Set **Site URL** to your Vercel production domain (`https://movie-explorer.vercel.app`).
   - Add your preview and production domains to **Redirect URLs**.

The provided [`vercel.json`](vercel.json) handles client-side single-page application routing rewrites so direct navigation and refreshes on `/movie/:id`, `/search`, and `/favorites` work seamlessly.

---

## 🔒 Security Best Practices

- **Zero Secret Leakage**: No private TMDb tokens or Supabase service-role keys are stored on the client or embedded in Vite build outputs.
- **Strict Parameter Bounds**: The Edge Function enforces integer movie IDs, trims queries up to 100 characters max, limits pagination to 1–500, and validates sorting keys against an allowlist.
- **Database Isolation**: Supabase RLS enforces data isolation so users cannot read or modify another user's watchlist even if crafting raw requests.
- **HTML Sanitization & Safe Embeds**: Video URLs are constructed only from validated 11-character YouTube video keys with secure sandbox attributes (`youtube-nocookie.com`).

---

## 📜 TMDb Attribution & Disclaimer

> This product uses the TMDB API but is not endorsed or certified by TMDB.
> All movie titles, descriptions, artwork, and video media are copyright of their respective rights holders and The Movie Database.

---

