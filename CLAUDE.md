# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Agricultural e-commerce platform built with React 18 + Vite. Supports three user roles: customer, seller, and admin. Uses Firebase for auth/database and Google Gemini AI for product description generation.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to dist/
npm run lint      # ESLint across the project
npm run preview   # Preview production build locally
```

No test framework is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in Firebase and Gemini API keys. All env vars use the `VITE_` prefix for Vite client-side exposure.

## Architecture

### State Management (Dual Pattern)
- **Redux** (`store.js`, `reducers.js`, `actions.js`, `dispatchers.js`): Used only for shopping cart state and global loader. Uses `legacy_createStore` from Redux 5.
- **React Context** (`src/context/AuthContext.jsx`): Manages authentication state, current user, and user role. Access via `useAuth()` hook.

### Service Layer
- `src/services/db.js`: All Firestore CRUD operations (products, users). Products are scoped by `sellerId` for seller queries.
- `src/services/ai.js`: Google Generative AI (Gemini 1.5 Flash) integration for generating product descriptions.

### Firebase
- `src/firebase.js`: Initializes Firebase app, Auth, Firestore, and Storage.
- Firestore collections: `users` (with `role` field), `products` (with `sellerId` field).

### Routing & Access Control
- React Router v6 in `src/App.jsx`.
- `ProtectedRoute` component wraps role-gated routes, checking `currentUser` and `userRole` from AuthContext.
- Seller dashboard requires `seller` or `admin` role; admin dashboard requires `admin` role.

### Styling
- Tailwind CSS with DaisyUI component library.
- Custom theme colors defined in `tailwind.config.js`: `primary` (#4CAF50 green), `accent`/`secondary` (#1e3778 dark blue), `soil` (#795548 brown), `sand` (#A1887F), `darkGreen` (#2E7D32), `cream` (#FAF9F6).
- Font Awesome 6.6.0 loaded via CDN in `index.html`.
- DaisyUI light theme is customized to match the app color palette.

### Key Patterns
- Form handling uses `react-hook-form`.
- Firestore documents mapped with `{ ...doc.data(), id: doc.id }` pattern.
- Product schema: `{ id, name, description, price, image, quantity (stock), sellerId, sellerEmail }`.
- All components are functional with hooks; no class components.
