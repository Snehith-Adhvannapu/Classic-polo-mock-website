# replit.md

## Overview

This is a full-stack e-commerce application for "Classic Polo" - a clothing store specializing in timeless polo shirts and curated outfits. The application is built with a modern tech stack using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for cart state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Session-based cart management using session IDs
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` with tables for products, cart items, and users
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Product Management
- Products are stored with comprehensive metadata including SKU, name, description, category, pricing, fabric, fit, colors, sizes, and images
- Support for inventory tracking with stock counts and availability flags
- Product categorization system (Men, Women, Kids, Accessories)

### Shopping Cart System
- Session-based cart management without requiring user authentication
- Cart items include product references, quantity, selected color/size, and session tracking
- Real-time cart updates with optimistic UI updates

### User Interface Components
- Responsive design with mobile-first approach
- Product grid with filtering and sorting capabilities
- Shopping cart sidebar with real-time updates
- Product detail pages with image galleries and option selection
- Category-based navigation and search functionality

### API Endpoints
- `GET /api/products` - Retrieve all products with optional filtering
- `GET /api/products/:id` - Get specific product details
- `GET /api/cart` - Retrieve cart items for session
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

## Data Flow

### Product Browsing
1. User navigates to product pages
2. Frontend fetches products from API using TanStack Query
3. Products are cached and displayed in responsive grid
4. Filtering and sorting applied client-side

### Shopping Cart Operations
1. User adds items to cart with selected options
2. Frontend sends POST request to cart API
3. Session ID tracks cart across requests
4. Cart state updates immediately with optimistic updates
5. TanStack Query cache invalidation ensures data consistency

### Session Management
- Cart persistence using session IDs stored in headers
- No user authentication required for basic shopping
- Session-based cart management allows for guest checkout flow

## External Dependencies

### UI Components
- Radix UI primitives for accessible components
- Lucide React for icons
- Tailwind CSS for styling
- shadcn/ui component library

### Data Management
- TanStack Query for server state management
- Drizzle ORM for database operations
- Neon Database for PostgreSQL hosting
- Zod for schema validation

### Development Tools
- Vite for fast development and building
- TypeScript for type safety
- ESBuild for server bundling
- Replit-specific plugins for development environment

## Deployment Strategy

### Development
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Concurrent frontend and backend development with proxy setup

### Production Build
- Vite builds optimized React application
- ESBuild bundles Express server for production
- Static files served from Express server
- Environment variables for database configuration

### Database Management
- Drizzle migrations for schema changes
- PostgreSQL database with connection pooling
- Environment-based configuration for different deployment stages

The application uses a monorepo structure with shared TypeScript definitions between frontend and backend, ensuring type safety across the entire stack. The architecture supports both development and production environments with appropriate tooling and build processes for each.