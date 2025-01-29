# Codebase Summary

## Project Structure

### Core Directories

- `/src` - Main application source code
  - `/app.css` - Global styles
  - `/app.d.ts` - TypeScript declarations
  - `/app.html` - HTML template
  - `/hooks.server.ts` - Server-side hooks

### Library Components

- `/src/lib` - Shared library code
  - `/components/ui` - UI component library
    - Extensive collection of shadcn-svelte components
    - Organized by component type (button, form, etc.)
  - `/models` - Data models and types
    - `data-model.ts` - Core data structures
  - `/server` - Server-side functionality
    - `appwrite.ts` - Appwrite service configuration
    - `auth.ts` - Authentication logic
    - `/services` - Business logic services
      - `questionnaire.ts` - Questionnaire management

### Routes

- `/src/routes` - SvelteKit routing structure
  - `/(auth)` - Authentication related routes
  - `/(protected)` - Protected routes requiring authentication
  - `/api` - API endpoints
    - `/choices/edit` - Choice editing endpoints
    - `/questions/edit` - Question editing endpoints

### Static Assets

- `/static` - Static files
  - `favicon.png` - Site favicon

## Data Flow

1. Client requests handled through SvelteKit routing
2. Protected routes managed by authentication middleware
3. API endpoints process data operations
4. Appwrite services handle data persistence
5. Server-side services manage business logic
6. UI components render data and handle user interactions

## External Dependencies

- Appwrite services for backend functionality
- shadcn-svelte for UI components
- Tailwind CSS for styling

## Recent Changes

- UI component library integration
- Authentication service setup
- Initial work in Questionnaire edit page

## Component Architecture

- Modular UI components using shadcn-svelte
- Server-side services for data management
- API routes for data operations
- Protected routes for authenticated access

## Development Guidelines

- TypeScript for type safety
- ESLint and Prettier for code quality
- Component-based architecture
- Server-side rendering
- API-first approach for data operations
