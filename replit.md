# Merge Story - Beach House Game

## Overview

Merge Story is a mobile-optimized merge puzzle game centered around a personal story about Soly, Maria, and their baby building their dream beach house. The application is a full-stack web game built with React, Express, and PostgreSQL, featuring a merge-3 mechanics gameplay loop with energy systems, currency management, and narrative progression through chapters.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- `useMergeGame` - Central game state including energy, coins, chapters, and save/load functionality
- `useGame` - Generic game phase management (appears unused, likely legacy)
- `useAudio` - Sound effects and music management with mute controls

Game state persists to browser localStorage using `getLocalStorage` and `setLocalStorage` utilities.

**Component Structure**
- Phase-based rendering: `LoadingScreen` → `MenuScreen` → `GameScreen`
- Loading screen preloads sprite images before transitioning to menu
- Extensive shadcn/ui component library available (40+ components) but minimally utilized
- Mobile-first design with touch optimization

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
- Client-side: Browser localStorage for game saves
- Server-side: No persistence implemented yet (would use PostgreSQL when added)

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