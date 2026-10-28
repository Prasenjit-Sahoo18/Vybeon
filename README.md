# 🎧 VYBEON — Where Every Vibe Comes Alive

<p align="center">
  <strong>A next-generation music discovery and streaming experience.</strong>
  <br />
  Discover music by mood, create personalized listening sessions, explore artists, and visualize every beat through an immersive neon interface.
</p>

<p align="center">
  <a href="https://vybeon.onrender.com/">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_VYBEON-B8FF00?style=for-the-badge&labelColor=050505" alt="Live Demo" />
  </a>
  <a href="https://github.com/Prasenjit-Sahoo18/Vybeon">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Enabled-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Demo Experience](#-demo-experience)
- [Testing and Quality Checks](#-testing-and-quality-checks)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Connect](#-connect)

---

## 🌌 Overview

**VYBEON** is a futuristic music-streaming platform designed to make music discovery more personal, interactive, and immersive.

Instead of relying solely on traditional browsing, VYBEON introduces mood-driven discovery, algorithmically generated listening queues, a conversational music assistant, personalized music analytics, and real-time audio visualization.

Its signature **Radium Neon** design combines glowing accents, dark surfaces, animated visual elements, and glass-inspired components to create a distinctive listening experience.

### 🎯 The Vision

> Music is more than what you hear. It's what you feel.

VYBEON brings music discovery, listening, and personalization together in one cohesive platform.

**[🚀 Explore the live application](https://vybeon.onrender.com/)**

## ✨ Features

### 🎵 Music Discovery and Playback

- **Discover:** Explore tracks, artists, albums, genres, and curated music collections.
- **Smart Search:** Find music through a searchable interface with category filters.
- **Music Player:** Listen through an integrated player with queue management and playback controls.
- **Personal Library:** Organize playlists, liked tracks, and listening history.
- **Artist and Album Pages:** Explore artist profiles, discographies, and album tracklists.
- **Recently Played:** Revisit previously played music.

### 🔮 Vibe Engine

Discover music based on how you feel.

- Generate listening queues based on mood and energy.
- Incorporate session duration into playlist selection.
- Create personalized listening experiences through algorithmic matching.

### 🤖 NeonMix AI

Meet your conversational music assistant.

- Interpret natural-language music requests.
- Translate listening preferences into curated music selections.
- Make music discovery more intuitive through a conversational interface.

NeonMix is designed around local query processing and the project's music catalog, without requiring an external AI API for its documented demo experience.

### 📡 Neon Radio

- Explore continuous radio-style listening queues.
- Discover tracks organized around genres, artists, and moods.
- Enjoy a more hands-off listening experience.

### 📊 Music DNA Analytics

Understand your listening habits through visual analytics.

- Listening activity and weekly trends.
- Genre-resonance breakdowns.
- Listening statistics and progress charts.
- Gamified achievements and milestones.

### 🔊 Real-Time Audio Visualization

Experience music visually with browser-based audio visualization.

- Frequency-spectrum analysis.
- Oscilloscope-style visual effects.
- Dynamic visuals synchronized with audio playback.

### 🎨 Radium Neon Design System

VYBEON features a custom dark interface with vibrant accents, ambient gradients, and glowing interactive elements.

| Design Token | Color | Purpose |
|---|---|---|
| Radium Green | `#B8FF00` | Primary accent and active states |
| Deep Purple | `#7C3AED` | Ambient gradients |
| Neon Cyan | `#00F5FF` | Highlights and visual indicators |
| Void Black | `#050505` | Main background |
| Card Surface | `#11111A` | Elevated content panels |
| Primary Text | `#F5F5F5` | Main content |

### ⌨️ Keyboard Shortcuts

The project documents the following playback shortcuts:

| Key | Action |
|---|---|
| `Space` | Play or pause |
| `←` / `→` | Seek backward or forward by 5 seconds |
| `↑` / `↓` | Adjust volume |
| `N` / `P` | Next or previous track |

---

## 🛠️ Tech Stack

VYBEON uses a modern full-stack TypeScript architecture.

| Layer | Technologies |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, custom CSS, Radix UI |
| UI Components | Lucide React, Framer Motion |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Backend | Next.js server-side logic and REST API routes |
| Authentication | Auth.js / NextAuth v5 |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Validation | Zod |
| Charts | Recharts |
| Testing | Vitest, Testing Library |
| Deployment | Render |
| Audio | HTML5 Audio, Web Audio API |

---

## 🏗️ System Architecture

VYBEON separates the user interface, application logic, audio experience, and persistent data into distinct layers.

```mermaid
flowchart TD
    A[User / Browser] --> B[Next.js Application]
    B --> C[React UI Components]
    B --> D[REST API Routes]
    C --> E[Zustand State]
    C --> F[HTML5 Audio Player]
    F --> G[Web Audio Visualizer]
    D --> H[Auth.js Authentication]
    D --> I[Vibe Engine]
    D --> J[NeonMix Assistant]
    D --> K[Music Provider]
    K --> L[Prisma ORM]
    L --> M[(PostgreSQL)]
```

### How It Works

1. Users interact with the Next.js interface to discover and play music.
2. Zustand manages client-side playback and interface state.
3. Application API routes handle supported music, library, analytics, and authentication operations.
4. The Vibe Engine and NeonMix process music-discovery requests.
5. Prisma provides the database access layer for PostgreSQL.
6. The Web Audio API analyzes playback data to power visual effects.

---

## 🚀 Getting Started

Follow these steps to run VYBEON locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) — use a version compatible with the project's dependencies.
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) — local or hosted.
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Prasenjit-Sahoo18/Vybeon.git
cd Vybeon
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create a local environment file from the example:

**macOS / Linux**

```bash
cp .env.example .env.local
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

Open `.env.local` and configure the required variables as described below.

### 4. Configure PostgreSQL

Create a PostgreSQL database for VYBEON and update `DATABASE_URL` with your database credentials.

Example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vybeon?schema=public"
```

Replace the example credentials with your actual local database configuration.

### 5. Generate Prisma Client and Initialize the Database

```bash
npx prisma generate
npx prisma db push
```

To populate the development database with the project's demo music catalog, run:

```bash
npm run db:seed
```

### 6. Start the Development Server

```bash
npm run dev
```

Open the application at:

**http://localhost:3000**

---

## 🔐 Environment Configuration

VYBEON uses environment variables to keep database credentials and authentication secrets outside the source code.

Configure the following variables in `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Secret used by Auth.js / NextAuth |
| `NEXTAUTH_URL` | Yes | Base URL of the application |
| `NODE_ENV` | Environment-dependent | Runtime environment |
| `DEMO_MODE` | Recommended for demo | Enables the seeded demo catalog |
| `MUSIC_API_URL` | Optional | External music-provider URL |
| `MUSIC_API_KEY` | Optional | External music-provider key |
| `GITHUB_CLIENT_ID` | Optional | GitHub OAuth application ID |
| `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth application secret |

Example configuration for local development:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vybeon?schema=public"
NEXTAUTH_SECRET="replace-with-a-secure-random-secret"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
DEMO_MODE="true"

MUSIC_API_URL=""
MUSIC_API_KEY=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secure authentication secret using:

```bash
openssl rand -base64 32
```

**Important:** Never commit `.env.local`, database passwords, OAuth secrets, or production credentials to GitHub.

---

## 🗄️ Database Setup

VYBEON uses PostgreSQL for persistent application data and Prisma as its ORM.

The documented data model includes entities for:

- Users and authentication.
- Artists, albums, tracks, and genres.
- Playlists and playlist-track associations.
- Liked tracks and followed artists.
- Recently played tracks and listening history.
- Lyrics and user achievements.

### Useful Prisma Commands

| Command | Purpose |
|---|---|
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma db push` | Synchronize the schema with the database |
| `npx prisma migrate deploy` | Apply existing production migrations |
| `npm run db:seed` | Populate the demo catalog |
| `npm run db:studio` | Open Prisma Studio |

Use `db push` for local development when appropriate. For production deployments, prefer a reviewed migration workflow.

---

## 🎧 Demo Experience

VYBEON includes a demo-mode configuration intended to support music discovery without requiring an external music API.

To try the demo:

1. Configure PostgreSQL and the environment variables.
2. Initialize the database.
3. Run the seed script.
4. Start the application.
5. Explore discovery, playback, the Vibe Engine, NeonMix, radio, and analytics.

The repository documents a seeded catalog containing more than 100 tracks, 30 artists, 22 albums, and 15 genres.

Demo authentication credentials may be available in the repository's setup documentation or seed configuration. Verify the current seed script before relying on any sample account credentials.

---

## 🧪 Testing and Quality Checks

Run the available project checks from the repository root.

### TypeScript

```bash
npm run type-check
```

### Automated Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Formatting Check

```bash
npm run format:check
```

To format supported files:

```bash
npm run format
```

Run the relevant checks before submitting changes or deploying updates.

---

## 📁 Project Structure

```text
Vybeon/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (main)/              # Main application pages
│   │   ├── discover/        # Music discovery
│   │   ├── search/          # Search and filtering
│   │   ├── radio/           # Radio experience
│   │   ├── vibe-engine/     # Mood-based music discovery
│   │   ├── ai/              # NeonMix assistant
│   │   ├── library/         # User music library
│   │   ├── analytics/       # Music DNA analytics
│   │   ├── artists/         # Artist profiles
│   │   ├── albums/          # Album details
│   │   ├── playlists/       # Playlist pages
│   │   └── tracks/          # Track pages
│   ├── api/                 # Application API routes
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root application layout
│   └── not-found.tsx        # Custom 404 page
├── components/
│   ├── layout/              # Navigation and layouts
│   ├── player/              # Player and visualization
│   ├── music/               # Music-related components
│   ├── home/                # Homepage components
│   └── providers.tsx        # Application providers
├── lib/
│   ├── auth/                # Authentication configuration
│   ├── db/                  # Prisma client
│   ├── music/               # Music provider abstraction
│   ├── utils/               # Shared utilities
│   └── validation/          # Validation schemas
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Demo data seeding
├── store/                   # Zustand stores
├── tests/                   # Automated tests
├── types/                   # TypeScript types
├── public/                  # Static assets
├── scripts/                 # Utility scripts
├── .env.example             # Environment template
├── render.yaml              # Render deployment blueprint
├── package.json
└── README.md
```

---

## 🌐 Deployment

VYBEON includes a Render Blueprint configuration in `render.yaml`.

### Deployment Steps

1. Push your code to GitHub.
2. Sign in to [Render](https://render.com/).
3. Select **New → Blueprint**.
4. Connect the repository containing `render.yaml`.
5. Review the proposed web-service and database resources.
6. Configure any required environment variables.
7. Apply the Blueprint and wait for the build to finish.
8. Run database initialization and seeding if required by the deployment configuration.

The configured live application is:

**[https://vybeon.onrender.com/](https://vybeon.onrender.com/)**

### Health Check

The project documents a health-check endpoint:

```http
GET /api/health
```

Use it to inspect the application's health response when the deployed service is available.

**Deployment note:** Review the current Render Blueprint, database plan, build logs, and migration requirements before deploying. Resource availability and platform configuration may change.

---

## 🛡️ Security

Security matters for any application that handles user accounts and persistent data.

VYBEON's architecture includes authentication, environment-based configuration, schema validation, and Prisma-based database access.

Recommended practices:

- Keep secrets in environment variables.
- Never commit real credentials or tokens.
- Use strong, unique authentication secrets.
- Validate and authorize protected API requests on the server.
- Apply database migrations deliberately.
- Avoid exposing private user data in logs.
- Review third-party music assets and their licenses before distribution.

Report potential security vulnerabilities privately using the instructions in [`SECURITY.md`](SECURITY.md).

---

## 🗺️ Roadmap

Potential areas for future development include:

- [ ] Enhanced mood-personalization algorithms.
- [ ] More music-provider integrations.
- [ ] Improved playlist sharing and collaboration.
- [ ] Expanded music analytics and listening insights.
- [ ] More accessible playback and visualization controls.
- [ ] Additional automated integration tests.
- [ ] Improved mobile and responsive experiences.

This roadmap represents potential enhancements, not a claim that these features are already implemented.

---

## 🤝 Contributing

Contributions, bug reports, and thoughtful feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Run the relevant quality checks.
5. Submit a pull request describing your changes.

For more details, review [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## 📄 License

VYBEON is distributed under the **MIT License**. See the [`LICENSE`](LICENSE) file for the full license text.

### 🎼 Music and Third-Party Assets

VYBEON is an independent project and is not affiliated with Spotify, Apple Music, or any other proprietary streaming service.

Audio assets, artwork, and third-party services remain subject to their respective licenses and terms. Check the applicable permissions before redistributing assets or using them commercially.

---

## 👨‍💻 Connect

**Created by Prasenjit Sahoo**

<p align="left">
  <a href="https://github.com/Prasenjit-Sahoo18">
    <img src="https://img.shields.io/badge/GitHub-Prasenjit--Sahoo18-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/prasenjit-sahoo18/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
  </a>
</p>

If you find VYBEON interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  <strong>VYBEON</strong>
  <br />
  <em>Discover your sound. Find your vibe.</em>
</p>
