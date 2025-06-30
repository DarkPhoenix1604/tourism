# Sierra

Sierra is a Next.js-based web application designed to simplify the process of booking travel packages. It features a modern UI, user authentication, and integration with a backend API for managing bookings, wishlists, and travel packages.

## Features

- **Explore Packages**: Browse through a variety of travel packages with detailed descriptions and images.
- **Wishlist**: Save your favorite destinations and plan your trips.
- **Bookings**: View and manage your upcoming trips and invoices.
- **Payment Integration**: Book packages with multiple payment options.
- **Authentication**: Secure user login and session management using Clerk.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, MongoDB
- **Authentication**: Clerk
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Render (Backend)

## Folder Structure

### Frontend (`sierra/`)
- `app/`: Contains Next.js pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions.
- `types/`: TypeScript type definitions.
- `next.config.ts`: Next.js configuration file.
- `tsconfig.json`: TypeScript configuration file.

### Backend (`backend/`)
- `src/models/`: MongoDB schemas for bookings, explore, and wishlist.
- `src/routes/`: API routes for bookings, explore, and wishlist.
- `src/lib/`: Database connection logic.
- `src/index.js`: Entry point for the Express.js server.

## Installation

### Prerequisites
- Node.js
- MongoDB
- Environment variables for Clerk, Firebase, and Razorpay.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/DarkPhoenix1604/tourism.git
   cd tourism
   ```

2. Install dependencies:
   ```bash
   npm install --prefix backend
   npm install --prefix sierra
   ```

3. Set up environment variables:
   - Create `.env` files in `backend/` and `sierra/` directories.
   - Add necessary keys for MongoDB, Clerk, Firebase, and Razorpay.

4. Seed the database:
   ```bash
   npm run seed --prefix backend
   ```

5. Start the development server:
   ```bash
   npm run dev --prefix sierra
   npm run dev --prefix backend
   ```

6. Open the application:
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

### Frontend (`sierra/`)
- `npm run dev`: Start the Next.js development server.
- `npm run build`: Build the Next.js application for production.
- `npm run start`: Start the Next.js production server.
- `npm run lint`: Run ESLint checks.

### Backend (`backend/`)
- `npm run dev`: Start the Express.js development server.
- `npm run seed`: Seed the database with sample data.
- `npm run start`: Start the Express.js production server.