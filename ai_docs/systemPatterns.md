# System Architecture Patterns

## Core Architecture

- SvelteKit frontend framework with SSR
- Appwrite backend integration for database/file store/auth services

## Key Technical Decisions

1. **API Layer**: Appwrite SDK integration through abstracted service modules
2. **Component Library**: Atomic design pattern implementation with Shadcn-svelte UI primitives
3. **Testing**: Unit and Integration testing is done with Vitest and end-to-end tests are done with Playwright

## Component Structure

```
e2e                     # End-to-end tests using Playwright
src                     # Main source code directory
├── lib
│   ├── components
│   │   ├── app         # App-specific components (nav, layouts, etc)
│   │   └── ui          # Reusable UI primitives from shadcn
│   ├── hooks           # Custom Svelte hooks and reactive utilities
│   ├── models          # Type definitions and data models
│   └── server          # Server-side code
│       └── services    # External API integrations and services
└── routes
    ├── (auth)          # Authentication related routes (login, register)
    ├── (protected)     # Routes requiring authentication
    └── api             # Backend API endpoints
```

## Data Flow

Browser ↔ SvelteKit server ↔ Appwrite Server

1. Client requests handled through SvelteKit routing
2. Protected routes managed by authentication middleware
3. API endpoints process frontend to backend operations
4. Appwrite services handle auth, database, and file storage
5. Server-side services manage business logic
6. UI components render data and handle user interactions

## Database

- Database model types are generated from appwrite.json using the generate:types script
- appwrite.json is generated with the command `appwrite pull all`
