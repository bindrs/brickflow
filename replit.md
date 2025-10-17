# BrickFlow Management System

## Overview

BrickFlow is a comprehensive brick manufacturing and delivery management system designed for businesses in the construction materials industry. The application provides end-to-end management capabilities for inventory tracking, fleet management, workforce coordination, order processing, and invoice generation. Built as a full-stack web application, it offers a modern React frontend with shadcn/ui components and a robust Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client application uses a modern React setup with TypeScript and follows a component-based architecture:

- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API combined with TanStack Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Management**: React Hook Form with Zod validation for type-safe form handling

The application follows a single-page application (SPA) pattern with component-based navigation, organizing functionality into distinct management modules (Dashboard, Inventory, Tractors, Labor, Orders, Invoices).

### Backend Architecture
The server follows a RESTful API design pattern with Express.js:

- **Framework**: Express.js with TypeScript for type-safe server development
- **API Design**: RESTful endpoints following conventional HTTP methods and status codes
- **Database Layer**: Drizzle ORM for type-safe database interactions with PostgreSQL
- **Validation**: Zod schemas shared between client and server for data validation
- **Error Handling**: Centralized error handling middleware with consistent error responses
- **Development Server**: Hot module replacement via Vite integration in development mode

The backend implements a storage abstraction layer that could support multiple database implementations, currently targeting PostgreSQL through Drizzle ORM.

### Database Design
The system uses PostgreSQL with a normalized schema supporting five core entities:

- **Users**: Authentication and user management
- **Bricks**: Inventory tracking with stock levels, pricing, and type categorization
- **Tractors**: Fleet management with driver assignment and maintenance scheduling
- **Laborers**: Workforce management with hourly rates and status tracking
- **Orders**: Order processing linking customers, products, and delivery logistics
- **Invoices**: Financial document generation tied to completed orders

Each entity includes audit fields (timestamps, IDs) and status tracking for business workflow management.

### Authentication & Authorization
The application includes user authentication infrastructure through a users table, though the current implementation focuses on the core business functionality rather than complex auth flows.

### Data Flow Pattern
The application implements a unidirectional data flow:
1. React components dispatch actions through context providers
2. TanStack Query manages API calls and caching
3. Server endpoints validate requests and interact with database
4. Responses update client state and trigger UI re-renders
5. Optimistic updates provide immediate user feedback

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM with drizzle-kit for migrations and schema management
- **UI Framework**: Radix UI primitives for accessible component foundations
- **Validation**: Zod for runtime type validation and schema definition
- **Date Handling**: date-fns for date manipulation and formatting

### Development & Build Tools
- **Build System**: Vite for development server and production builds
- **TypeScript**: Full type safety across client and server
- **PostCSS & Autoprefixer**: CSS processing and vendor prefixing
- **ESBuild**: Fast JavaScript bundling for server-side code

### Client-Side Libraries
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Wouter**: Lightweight routing solution
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Class Variance Authority**: Component variant management
- **Embla Carousel**: Touch-friendly carousel components

### Server-Side Dependencies
- **Express.js**: Web application framework
- **CORS & Security**: Cross-origin resource sharing and security middleware
- **Session Management**: PostgreSQL session storage via connect-pg-simple

The architecture prioritizes type safety, developer experience, and maintainability while providing a scalable foundation for brick manufacturing business operations.