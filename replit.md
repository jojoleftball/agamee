# Merge Garden - Mobile-Friendly Garden Restoration Game

## Overview

Merge Garden is a mobile-optimized 3D merge game where players restore a wrecked garden. Players merge items (flowers, trees, garden tools, decorations) to create higher-tier items while expanding their garden. Built with React, React Three Fiber, and Express.

**Recent Changes (November 29, 2025)**
- Complete merge board redesign with custom sprite-based background
- New UI icons (store, inventory, back arrow, tasks) using provided garden-themed sprites
- Smart sticker-like icon system: icons can be dragged and resized with touch
- Edit Layout mode to reposition and resize UI icons, with positions saved to localStorage
- Grid snapping system: 8x8 grid overlay aligned with the merge board sprite for precise item placement
- Items snap to grid squares when dragged, providing clean visual alignment

**Previous Changes (November 28, 2025)**
- Complete emoji-to-icon replacement across all screens (MergeBoardScreen, ShopModal, InventoryModal, TasksModal)
- Implemented audio system with background music and sound effects for merging/clicking
- AudioInitializer component handles music on first user interaction with mute toggle button
- Added Replit Auth integration with LoginButton component and useReplitAuth hook
- Login button added to WorldMapScreen header for user authentication
- Sound effects play on merge success and item interactions

**Previous Changes (November 27, 2025)**
- New garden-themed merge board with proper layout and navigation
- Bottom navigation bar with Back, Shop, Inventory (10 slots), and Tasks buttons
- Custom garden-themed SVG icons (MergeBoardIcon, ShopBagIcon, InventoryChestIcon, TaskScrollIcon, etc.)
- Shop modal for buying items with coins
- Inventory modal with 10 slots for storing items from the merge board
- Tasks modal showing current tasks with progress and rewards
- Item Details panel showing name, rank, description, picture, and sell button
- Resource bar showing coins, energy, and gems with custom SVG icons
- All emojis replaced with custom SVG icons for consistent garden theme

**Previous Changes (November 21, 2025)**
- Complete rebuild with 3D garden environment using React Three Fiber
- Professional 3D scene with terrain, garden house, merge area, and decorative props
- Click-to-select/move/merge interaction system for mobile
- Clean state management with useGardenGame and useMergeStore
- Garden zones unlocking system with progression
- Shop system for buying items with coins
- HUD showing coins, gems, energy, and level/XP
- Proper merge logic using MERGE_ITEMS data
- Persistent storage using Zustand persist middleware

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
- Replit Auth (legacy Repl Auth 2.0) implemented for user login
- `useReplitAuth` hook provides user state, login/logout functions
- `LoginButton` component displays in WorldMapScreen header
- Fetches user info from `/__replauthuser` endpoint
- Session management prepared (connect-pg-simple available) but not configured

**Audio System**
- `SoundManager` class in `client/src/lib/sounds.ts` handles all audio
- Background music plays on first user interaction (auto-play policy)
- Sound effects: merge, click, success (stored in `client/public/sounds/`)
- `AudioInitializer` component wraps game flow with mute toggle button
- Mute/unmute control in bottom-right corner of screen

**Asset Management**
- Custom sprite images stored in `client/public/sprites/`
- Inter font loaded via @fontsource package
- Static assets served from public directory