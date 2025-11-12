# Beach House Story - Dialogue-Driven Decoration Game

## Overview

Beach House Story is a mobile-optimized narrative game centered around Soly, Maria, and their baby building their dream beach house. The application is a full-stack web game built with React, Express, and PostgreSQL, featuring a dialogue-driven story system with an admin panel for content management.

**Recent Changes (November 2025)**
- Removed merge board and energy/coin mechanics in favor of dialogue-driven gameplay
- Implemented admin panel for dialogue management (accessible via settings button triple-tap)
- Transitioned to icon-based UI using Lucide React instead of emojis
- Simplified game flow: Loading → Dialogue → Game Screen

## User Preferences

Preferred communication style: Simple, everyday language.
Never use emojis in code, use icons from Lucide React instead.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **React 18** with TypeScript for UI components
- **Vite** as the build tool and development server
- **TailwindCSS** with custom theme configuration for styling
- **Radix UI** components for accessible UI primitives
- **React Three Fiber** and related libraries for 3D graphics capabilities (unused in current implementation but available)
- **Zustand** for state management with local storage persistence

**State Management Pattern**
The application uses Zustand stores with middleware:
- `useDialogueStore` - Manages all dialogues with CRUD operations and localStorage persistence
- `useMergeGame` - Legacy game state (energy, coins) - retained for potential future use
- `useAudio` - Sound effects and music management with mute controls

Game state persists to browser localStorage.

**Component Structure**
- Phase-based rendering: `LoadingScreen` → `NewDialogueScreen` → `NewGameScreen`
- Loading screen preloads sprite images before transitioning to dialogue
- Admin panel (`AdminPanel`) accessible via triple-tap on settings icon
- Extensive shadcn/ui component library (40+ components) used for admin panel
- Mobile-first design with touch optimization
- All UI uses Lucide React icons instead of emojis

**Build Configuration**
- Client code served from `client/` directory
- Path aliases: `@/` maps to `client/src/`, `@shared/` to shared code
- Production builds output to `dist/public/`
- GLSL shader support configured but unused
- Support for 3D model formats (GLTF, GLB) and audio files

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with ESM modules
- Custom Vite integration for development with HMR
- Request/response logging middleware for API endpoints
- Error handling middleware with status code normalization

**API Structure**
- Routes registered via `registerRoutes()` function in `server/routes.ts`
- All API routes should use `/api` prefix convention
- Currently no routes implemented - starter template only

**Development vs Production**
- Development: Vite middleware handles client serving with HMR
- Production: Static files served from `dist/public/`
- Build process bundles server with esbuild to `dist/index.js`

### Data Storage Solutions

**Database**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for schema management and queries
- Schema defined in `shared/schema.ts` for code sharing between client/server
- Migration files output to `./migrations/`
- Schema push via `npm run db:push` command

**Current Schema**
Single `users` table with:
- `id` (serial primary key)
- `username` (unique text)
- `password` (text)

Zod validation schemas generated from Drizzle tables.

**Storage Interface Pattern**
- `IStorage` interface defines CRUD contracts
- `MemStorage` class provides in-memory implementation for development
- Database implementation would follow same interface
- Currently using in-memory storage only - database connection configured but not utilized

**Game Persistence**
- Client-side: Browser localStorage for dialogues and game state
- Dialogue data includes: talker, content, icon URL, next action, display order
- Server-side: No persistence implemented yet (would use PostgreSQL when added)

**Admin Panel Features**
- Add/Edit/Delete dialogues with full CRUD operations
- Upload character icons or use image URLs
- Define talker (Soly, Maria, Baby, Both)
- Set dialogue content and next action (continue, end, custom)
- Reorder dialogues with arrow buttons
- Secret access via triple-tap on settings icon
- Real-time updates to dialogue playback

### External Dependencies

**Database**
- Neon PostgreSQL serverless database
- Connection via `DATABASE_URL` environment variable
- Drizzle Kit for migrations and schema management

**UI Component Libraries**
- Radix UI primitives (accordion, dialog, dropdown, select, etc.)
- React Query for server state management (configured but unused)
- date-fns for date formatting
- Lucide React for icons

**3D Graphics Stack** (Available but unused)
- Three.js via React Three Fiber
- drei (helpers for R3F)
- postprocessing effects

**Development Tools**
- TypeScript for type safety
- tsx for running TypeScript in development
- esbuild for production server bundling
- Replit-specific runtime error modal plugin

**Authentication**
- No authentication system currently implemented
- User schema exists but not connected to any auth flow
- Session management prepared (connect-pg-simple available) but not configured

**Asset Management**
- Custom sprite images stored in `client/public/sprites/`
- Inter font loaded via @fontsource package
- Static assets served from public directory