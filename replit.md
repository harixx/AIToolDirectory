# AI Tool Directory - Replit Project Guide

## Overview

This is a full-stack web application for discovering, comparing, and reviewing AI tools. The project is built with React on the frontend and Express.js on the backend, featuring a modern tech stack with TypeScript, Tailwind CSS, and PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Status (Updated: 2025-01-10)

✅ **Migration Complete**: Successfully migrated from Replit Agent to Replit environment
- PostgreSQL database provisioned and configured
- All database tables created via Drizzle migrations
- Application running successfully on port 5000
- Stripe API keys configured for payment processing

✅ **Authentication System**: Switched from OpenID Connect to email/password authentication
- Email/password registration and login system implemented
- Session management with PostgreSQL store
- User profile management ready

✅ **Core Infrastructure**: 
- Database schema complete with all necessary tables
- API endpoints for tools, categories, reviews, favorites
- Stripe payment integration ready and configured

⚠️ **Next Steps Needed**:
- Add sample data for testing
- Create authentication UI components
- Test payment flow with Stripe integration

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **Payment Processing**: Stripe integration for premium features

## Key Components

### Database Schema
The application uses the following main entities:
- **Users**: User profiles with authentication and premium status
- **Categories**: AI tool categories (Video, Image, Code tools)
- **Tools**: Main entity for AI tools with detailed information
- **Reviews**: User reviews and ratings for tools
- **UserFavorites**: User bookmark system
- **Sessions**: Session storage for authentication

### Authentication System
- Uses Replit's OpenID Connect authentication
- Session-based authentication with PostgreSQL session store
- User profile management with Stripe integration for premium users
- Role-based access control (free vs premium users)

### Payment System
- Stripe integration for premium subscriptions
- Two-tier system: free and premium tool submissions
- Premium users get enhanced features like verified badges and featured placement

### Tool Management
- Multi-category tool classification
- Advanced filtering and search capabilities
- User-generated content with moderation
- Featured tools and verification system
- Comparison functionality between tools

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth
2. **Tool Discovery**: Users browse tools by category, search, or filters
3. **Tool Submission**: Authenticated users can submit tools (free or premium)
4. **Review System**: Users can review and rate tools
5. **Favorites**: Users can bookmark tools for later reference
6. **Premium Features**: Premium users get enhanced submission capabilities

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for serverless database hosting
- **Authentication**: Replit Auth for user authentication
- **Payments**: Stripe for subscription management
- **UI**: Radix UI for accessible component primitives
- **Validation**: Zod for schema validation
- **Forms**: React Hook Form for form management

### Development Tools
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database migrations and schema management
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## Deployment Strategy

### Development Environment
- Uses Vite dev server for frontend development
- Express server with hot reloading via tsx
- Database migrations handled by Drizzle Kit
- Environment variables for configuration

### Production Build
- Frontend built with Vite and served as static files
- Backend compiled with esbuild for Node.js
- Database migrations applied via Drizzle Kit
- Session storage and authentication configured for production

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `STRIPE_SECRET_KEY`: Stripe API key for payments
- `REPLIT_DOMAINS`: Allowed domains for Replit Auth
- `ISSUER_URL`: OpenID Connect issuer URL

### File Structure
- `client/`: React frontend application
- `server/`: Express backend application
- `shared/`: Shared types and schemas
- `migrations/`: Database migration files
- Configuration files in root directory

The application follows a monorepo structure with clear separation between frontend, backend, and shared code, making it easy to maintain and scale.