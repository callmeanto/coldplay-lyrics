# Replit.md

## Overview

This is a full-stack web application called "Letras de Coldplay" - a lyrics study app designed to help Spanish speakers learn Coldplay song lyrics before attending concerts. The app provides real-time synchronized lyrics with Spanish translations, YouTube audio playback, and advanced timing calibration for perfect concert preparation. It features a mobile-first design with precision audio sync optimized for learning and memorization.

**Status**: MVP Complete - Ready for deployment with advanced real-time audio synchronization

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with:

**Frontend**: React with TypeScript, built using Vite
- Component-based architecture using React functional components with hooks
- State management via React Query for server state and React's built-in state for UI
- Routing handled by Wouter (lightweight React router)
- Styling with Tailwind CSS and shadcn/ui components
- Mobile-first responsive design

**Backend**: Express.js server with TypeScript
- RESTful API endpoints for songs and translations
- In-memory storage implementation with plans for database integration
- Translation service integration (Google Translate API)
- Middleware for logging and error handling

**Database**: Configured for PostgreSQL with Drizzle ORM
- Schema defined for songs and translations tables
- Migration system set up with drizzle-kit
- Currently using in-memory storage but database-ready

## Key Components

### Frontend Components
- **LyricsDisplay**: Main component showing synchronized lyrics with translation toggle
- **SongSelector**: Interface for browsing and selecting songs
- **MediaControls**: Playback simulation controls for lyrics synchronization
- **TextSizeControl**: Accessibility feature for adjusting text size
- **ConnectionStatus**: Shows online/offline status with offline functionality
- **ConcertTips**: Helpful tips for concert attendees

### Backend Services
- **Storage Service**: Abstracted interface for data persistence (currently in-memory)
- **Translation Service**: Google Translate API integration for lyrics translation
- **Route Handlers**: API endpoints for songs, search, and translation

### Data Models
- **Song**: Contains metadata (title, artist, album, year, duration) and timestamped lyrics
- **Translation**: Stores translated lyrics for different languages
- **LyricLine**: Individual lyric lines with timestamps and duration

## Data Flow

1. **Song Loading**: Frontend fetches available songs from `/api/songs`
2. **Song Selection**: User selects a song, triggering fetch of detailed lyrics
3. **Translation Request**: When Spanish is selected, frontend requests translation via `/api/songs/:id/translate`
4. **Lyrics Synchronization**: Time-based highlighting of current lyrics using custom hooks
5. **Offline Support**: Translations cached in localStorage for offline access

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query for state management
- **UI Library**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom concert-themed colors
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: date-fns, clsx, class-variance-authority

### Backend Dependencies
- **Server Framework**: Express.js with middleware for JSON parsing and CORS
- **Database ORM**: Drizzle ORM with PostgreSQL adapter
- **Translation**: Google Translate API integration
- **Validation**: Zod schemas for request/response validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Database
- **PostgreSQL**: Primary database (Neon serverless)
- **Connection**: @neondatabase/serverless for database connectivity
- **Migrations**: Drizzle Kit for schema migrations

## Deployment Strategy

**Development Environment**:
- Vite dev server for frontend with HMR
- tsx for running TypeScript server with hot reload
- Environment variables for database and API keys

**Production Build**:
- Vite builds frontend to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Static file serving integrated into Express server

**Environment Configuration**:
- `DATABASE_URL` for PostgreSQL connection
- `GOOGLE_TRANSLATE_API_KEY` for translation services
- Development vs production mode handling

**Key Architectural Decisions**:

1. **Mobile-First Design**: Optimized for concert use with large text, dark theme, and touch-friendly controls
2. **Real-Time Audio Sync**: 60fps precision timing with song start offset detection for perfect lyric synchronization
3. **Advanced Calibration System**: User-adjustable sync offsets with preset options and fine-tuning controls
4. **Audio Visualization**: Live audio level meters and beat detection with reactive UI elements
5. **Smart Timing Logic**: Automatic detection of song intro periods with visual status indicators
6. **Offline-First Approach**: Translations cached locally for use without internet connection
7. **Component Composition**: Modular React components with clear separation of concerns
8. **Type Safety**: Full TypeScript implementation with shared schemas between frontend and backend

**Recent Achievements (January 2025)**:
- Implemented real-time audio synchronization with millisecond precision
- Added song start offset detection to handle YouTube video intros
- Created advanced calibration system for personalized timing preferences
- Integrated audio visualization with beat detection and reactive animations
- Achieved MVP status with production-ready synchronization accuracy