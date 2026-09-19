# Contributing to VYBEON

Thank you for your interest in contributing to **VYBEON**! We welcome bug fixes, performance improvements, feature enhancements, and documentation updates.

## Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/vybeon.git
   cd vybeon
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start Dev Server**
   ```bash
   npm run dev
   ```

6. **Run Tests & Type Checking**
   ```bash
   npm test
   npm run type-check
   ```

## Pull Request Guidelines

- Create feature branches with descriptive names (`feat/vibe-filter`, `fix/audio-visualizer-safari`).
- Ensure all tests pass (`npm test`) and TypeScript compiles with zero errors (`npm run type-check`).
- Adhere to the Radium Neon design system (colors, typography, animations).
- Never commit real secrets, API keys, or copyrighted audio files.
