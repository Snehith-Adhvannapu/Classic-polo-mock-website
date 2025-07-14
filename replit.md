# replit.md

## Overview

This is a full-stack e-commerce application for "Classic Polo" - a clothing store specializing in timeless polo shirts and curated outfits. The application is built with a modern tech stack using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data management.

**Recent Updates (July 14, 2025):**
- Successfully migrated from Replit Agent to standard Replit environment
- Updated chat widget to connect to custom webhook API at `https://havocsnehith.app.n8n.cloud/webhook/chatbot`
- Enhanced error handling and debugging for chat functionality

**Key Features:**
- **Scrape-Friendly Design**: Complete SEO optimization with structured data, meta tags, and schema markup
- **CSV Export**: Direct download of all product data including name, price, links, and specifications
- **60+ Products**: Comprehensive catalog across Men, Women, Kids, and Accessories categories
- **Advanced Filtering**: Price, size, color, category, and stock filters
- **Complete Shopping Cart**: Add/remove/update functionality with session management

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
- `GET /api/products/export/csv` - Download complete product catalog as CSV
- `GET /api/cart` - Retrieve cart items for session
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `GET /sitemap.xml` - SEO sitemap for search engines and crawlers
- `GET /robots.txt` - Robots file for web crawlers

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

## Scraping and Data Export Features

### SEO and Structured Data
- **Complete Meta Tags**: Title, description, keywords, and Open Graph tags on all pages
- **Schema.org Markup**: Product schema, organization schema, and review schema
- **Microdata**: Additional semantic markup for enhanced scraping
- **Sitemap Generation**: Dynamic XML sitemap with all products and categories
- **Robots.txt**: Proper crawler directives and sitemap reference

### Data Export Capabilities
- **CSV Export**: Complete product catalog with all fields available via `/api/products/export/csv`
- **Structured JSON**: All product data accessible via REST API endpoints
- **Individual Product Pages**: Each product has dedicated URL with full metadata
- **Category Pages**: Organized product listings by category with structured data

### Scraping-Friendly URLs
- `/` - Homepage with featured products
- `/products` - All products with filtering
- `/products/{category}` - Category-specific products (Men, Women, Kids, Accessories)
- `/all-products` - Complete product catalog page
- `/product/{id}` - Individual product detail pages
- `/sitemap.xml` - Complete site structure
- `/robots.txt` - Crawler guidelines

### CSV Export Fields
The CSV export includes comprehensive product data:
- ID, SKU, Name, Description
- Category, Subcategory, Price, Original Price
- Fabric, Fit, Available Colors, Available Sizes
- Product Images, Tags, Stock Status
- Direct product links for easy access

This makes the site perfect for tools like Firecrawl, Scrapy, or any web scraping solution that needs structured e-commerce data.