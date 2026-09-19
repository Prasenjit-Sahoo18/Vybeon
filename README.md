# VYBEON

<div align="center">

### **Where Every Vibe Comes Alive.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Render-Deploy_Ready-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-B8FF00?style=for-the-badge)](LICENSE)

*An original, production-ready, futuristic music streaming platform engineered for lossless playback, algorithmic frequency tuning, and mood-driven discovery.*

> **Notice:** VYBEON is an independent music-tech platform and is not affiliated with Spotify, Apple Music, or any other proprietary streaming service. All seeded audio uses legal, royalty-free Creative Commons assets.

</div>

---

## ⚡ Key Highlights

- 🎨 **Radium Neon Aesthetic:** Custom design system built with Radium Green (`#B8FF00`), Deep Purple (`#7C3AED`), and Cyan (`#00F5FF`) with aurora backgrounds, glassmorphism, and neon glow effects.
- 🔮 **Vibe Engine:** Algorithmic mood-to-playlist generator matching mood, kinetic energy, and session duration into immediate tailored queues.
- 🤖 **NeonMix AI:** Natural-language conversational music assistant parsing prompts into curated acoustic sets without external API costs.
- 📊 **Music DNA:** Listening analytics, weekly velocity charts, genre resonance breakdowns (Recharts), and gamified achievement unlocks.
- 📡 **Neon Radio:** Real-time endless stream radio stations across genres, artists, and moods.
- 🔊 **Web Audio Visualizer:** Real-time frequency spectrum analyzer and oscilloscope reacting dynamically to streaming playback.
- 🚀 **Render Blueprint Ready:** Native `render.yaml` with automated PostgreSQL database provisioning and single-click cloud deployment.

---

## 📐 Architecture

```mermaid
graph TB
    subgraph Client ["Client Layer (Browser)"]
        UI["Next.js App Router (React 18)"]
        Audio["HTML5 Audio + Web Audio Analyser"]
        Visualizer["Real-Time Canvas Visualizer"]
        Store["Zustand State Engine"]
    end

    subgraph Server ["Server Layer (Render Web Service)"]
        API["RESTful API Endpoints (/api/*)"]
        Auth["Auth.js v5 (NextAuth JWT)"]
        VibeEngine["Algorithmic Vibe Engine"]
        NeonMix["NeonMix AI Query Synthesizer"]
        Provider["MusicProvider Abstraction"]
    end

    subgraph Storage ["Database Layer (Render PostgreSQL)"]
        Prisma["Prisma ORM 5.22"]
        Postgres[(PostgreSQL 16 Engine)]
    end

    UI --> Store
    UI --> Audio
    Audio --> Visualizer
    UI --> API
    API --> Auth
    API --> VibeEngine
    API --> NeonMix
    API --> Provider
    Provider --> Prisma
    Prisma --> Postgres
```

---

## 🗄️ Database Entity-Relationship (ER) Model

```mermaid
erDiagram
    User ||--o{ Playlist : owns
    User ||--o{ LikedTrack : likes
    User ||--o{ FollowedArtist : follows
    User ||--o{ RecentlyPlayed : listens
    User ||--o{ ListeningHistory : records
    User ||--o{ UserAchievement : earns

    Artist ||--o{ Album : releases
    Artist ||--o{ Track : performs
    Album ||--o{ Track : contains

    Track ||--o{ TrackGenre : categorizes
    Genre ||--o{ TrackGenre : applies_to
    Track ||--o{ PlaylistTrack : included_in
    Playlist ||--o{ PlaylistTrack : contains
    Track ||--o| Lyrics : has
```

---

## 🎨 Radium Neon Design Tokens

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `#B8FF00` | High-voltage neon green accent, active states, glowing badges |
| **Secondary** | `#7C3AED` | Cyber deep purple, ambient aurora gradient backdrops |
| **Accent** | `#00F5FF` | Neon cyan, verified artist badges, waveform indicators |
| **Background** | `#050505` | Deep void black, canvas foundation |
| **Surface Secondary** | `#090912` | Elevated navigation panels, sidebars, headers |
| **Card Surface** | `#11111A` | Glass-morphed interactive audio cards |
| **Primary Text** | `#F5F5F5` | High-contrast readability typography |
| **Muted Text** | `#8B8B9A` | Secondary metadata, durations, BPM values |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18.x or 20.x+
- PostgreSQL database (local or remote)

### 2. Clone & Install
```bash
git clone https://github.com/your-username/vybeon.git
cd vybeon
npm install --legacy-peer-deps
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your database URL:
```env
DATABASE_URL="postgresql://vybeon_user:password@localhost:5432/vybeon?schema=public"
NEXTAUTH_SECRET="your-32-char-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
DEMO_MODE="true"
```

### 4. Migrate & Seed Database
```bash
npx prisma db push
npm run db:seed
```
*Seeds 100+ tracks, 30+ artists, 22 albums, 15 genres, achievements, and a demo user.*

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo Credentials:**
- Email: `demo@vybeon.app`
- Password: `demo1234`

---

## 🌐 One-Click Render Deployment

VYBEON includes a complete **Render Blueprint** (`render.yaml`) that configures:
1. A **Web Service** running the Next.js application.
2. A managed **Render PostgreSQL Database**.

### Deployment Steps:
1. Push this repository to your GitHub account.
2. Log into [Render.com](https://render.com/).
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository containing `render.yaml`.
5. Render will automatically provision:
   - `vybeon-db` (PostgreSQL 16)
   - `vybeon-web` (Node Web Service)
   - Injects `DATABASE_URL` directly from the database into the service.
   - Generates a secure `NEXTAUTH_SECRET`.
6. Click **Apply**.
7. In the Render Web Service shell, run the seed command once:
   ```bash
   npm run db:seed
   ```
8. Access your live platform at your custom `onrender.com` URL!

### Health Check Endpoint
Render automatically monitors instance health via:
```http
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "service": "VYBEON",
  "timestamp": "2024-09-19T10:00:00.000Z"
}
```

---

## 🧪 Testing

Run the automated Vitest test suite:
```bash
npm test
```
Type check TypeScript with zero errors:
```bash
npm run type-check
```

---

## 📁 Project Directory Structure

```
vybeon/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Authentication login
│   │   └── register/page.tsx        # New user registration
│   ├── (main)/
│   │   ├── layout.tsx               # Main app layout (Sidebar + Bottom player)
│   │   ├── page.tsx                 # Home page (Hero, trending rows, mood mixes)
│   │   ├── discover/page.tsx        # Discover (Genre explorer, hidden gems)
│   │   ├── search/page.tsx          # Search (Debounced, category filter tabs)
│   │   ├── radio/page.tsx           # Neon Radio endless broadcast queues
│   │   ├── vibe-engine/page.tsx     # Signature Vibe Engine mood composer
│   │   ├── ai/page.tsx              # NeonMix AI music assistant
│   │   ├── library/page.tsx         # User playlists, likes, history
│   │   ├── analytics/page.tsx       # Music DNA listening charts & badges
│   │   ├── settings/page.tsx        # Audio fidelity, bitrate, crossfade
│   │   ├── artists/[id]/page.tsx    # Artist profile with discography
│   │   ├── albums/[id]/page.tsx     # Album details and tracklist
│   │   ├── playlists/[id]/page.tsx  # Playlist details and management
│   │   ├── tracks/[id]/page.tsx     # Shareable track with OpenGraph metadata
│   │   └── profile/[username]/page.tsx # Public listener profile
│   ├── api/
│   │   ├── auth/[...nextauth]/      # Auth.js authentication handler
│   │   ├── tracks/                  # Tracks listing and detail
│   │   ├── artists/                 # Artists listing and detail
│   │   ├── albums/                  # Albums listing and detail
│   │   ├── search/                  # Global search engine
│   │   ├── playlists/               # Playlist CRUD & track associations
│   │   ├── likes/                   # Liked tracks
│   │   ├── history/                 # Listening history
│   │   ├── radio/                   # Radio stream generator
│   │   ├── vibe-engine/             # Vibe Engine algorithmic matcher
│   │   ├── neonmix/                 # NeonMix AI query synthesizer
│   │   ├── analytics/               # Music DNA analytics aggregations
│   │   ├── achievements/            # Gamification badge unlocks
│   │   └── health/                  # Render health check probe
│   ├── globals.css                  # Radium Neon design tokens & aurora styling
│   ├── layout.tsx                   # Root HTML & Providers wrapper
│   └── not-found.tsx                # Custom 404 frequency lost page
├── components/
│   ├── layout/                      # Sidebar, Header, BottomNav
│   ├── player/                      # MusicPlayer, FullScreenPlayer, Visualizer
│   ├── music/                       # TrackCard, TrackRow, ArtistCard, AlbumCard
│   ├── home/                        # Hero banner & floating neon cards
│   └── providers.tsx                # NextAuth & TanStack Query client providers
├── lib/
│   ├── auth/config.ts               # Auth.js credentials + JWT configuration
│   ├── db/prisma.ts                 # Prisma Client singleton
│   ├── music/                       # MusicProvider & DemoProvider abstraction
│   ├── utils/                       # Duration formatting, slugify, cn()
│   └── validation/schemas.ts        # Zod validation schemas
├── prisma/
│   ├── schema.prisma                # Relational PostgreSQL schema (15+ models)
│   └── seed.ts                      # Substantial 100+ track legal demo catalog
├── store/
│   ├── player.ts                    # Zustand audio player & queue management
│   └── ui.ts                        # Zustand UI store
├── tests/                           # Vitest test suite
├── render.yaml                      # Render Blueprint deployment definition
└── .env.example                     # Documented environment variables template
```

---

## 🛡️ Security & Performance

- **Zero Secrets Committed:** Environment variables strictly isolated via `.env.example`.
- **Injection Proof:** 100% parameterized queries via Prisma ORM.
- **Client-Side Optimization:** Dynamic image sizing via Next.js Image optimization.
- **Graceful Fallbacks:** Guaranteed zero-crash architecture if optional external providers are unreachable.
- **Keyboard Navigation:** Full accessibility shortcuts:
  - `Space`: Play / Pause
  - `ArrowLeft` / `ArrowRight`: Seek backward / forward 5s
  - `ArrowUp` / `ArrowDown`: Volume up / down
  - `N` / `P`: Next / Previous track

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
