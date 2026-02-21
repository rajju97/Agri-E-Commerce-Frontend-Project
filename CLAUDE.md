# CLAUDE.md — Agri E-Commerce Frontend Project

## Project Overview

Agricultural e-commerce single-page application built with React. Supports three user roles: **customer** (browse/buy), **seller** (list products, manage orders), and **admin** (manage users and all orders). Uses Firebase for authentication, database, and storage, with optional Gemini AI integration for product descriptions.

## Tech Stack

- **Framework:** React 18.3 (JSX, no TypeScript)
- **Build Tool:** Vite 5.4 with `@vitejs/plugin-react` (Babel)
- **Routing:** React Router DOM 6 (BrowserRouter, declarative routes)
- **State Management:** Redux 5 (legacy `createStore`) + React Context (auth)
- **Styling:** Tailwind CSS 3.4 + DaisyUI 4.12 component library
- **Backend:** Firebase (Auth, Firestore, Storage) — no separate backend server
- **AI:** Google Generative AI SDK (`gemini-2.5-flash`) for product descriptions
- **Forms:** React Hook Form 7
- **Linting:** ESLint 9 (flat config) with React, React Hooks, and React Refresh plugins
- **Package Manager:** npm

## Quick Reference Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build (output: dist/)
npm run lint      # Run ESLint across the project
npm run preview   # Preview the production build locally
```

There is no test framework configured. No `npm test` command exists.

## Project Structure

```
src/
├── main.jsx                 # Entry point — renders App inside Redux Provider + AuthProvider
├── App.jsx                  # Root component — all route definitions and ProtectedRoute HOC
├── Layout.jsx               # Landing/home page (hero, categories, featured products, footer)
├── firebase.js              # Firebase app initialization; exports auth, db, storage
├── store.js                 # Redux store (legacy_createStore)
├── actions.js               # Redux action type constants
├── reducers.js              # Redux reducer (cart + loader state)
├── dispatchers.js           # Redux action creators
├── index.css                # Tailwind directives (@tailwind base/components/utilities)
├── App.css                  # Empty — styles are in Tailwind classes
│
├── components/
│   ├── NavBar.jsx           # Top nav — responsive, role-based menu items, cart badge
│   ├── Register.jsx         # Registration form with role selection (buyer/seller)
│   ├── Loader.jsx           # Full-screen loading spinner overlay
│   └── NotFound.jsx         # 404 page
│
├── context/
│   └── AuthContext.jsx      # React Context for auth state (currentUser, userRole, signup/login/logout)
│
├── pages/
│   ├── Login.jsx            # Login form with role-based redirect
│   ├── ProductsPage.jsx     # Product listing with category filtering
│   ├── ProductDetail.jsx    # Single product view with reviews
│   ├── Cart.jsx             # Shopping cart (Redux-backed)
│   ├── Checkout.jsx         # Checkout form and order creation
│   ├── OrderHistory.jsx     # Customer order history
│   ├── Profile.jsx          # User profile management
│   ├── SellerDashboard.jsx  # Seller product CRUD + AI description generation
│   ├── SellerOrders.jsx     # Seller order management
│   ├── AdminDashboard.jsx   # Admin panel — user and order management
│   ├── AboutUs.jsx          # Static about page
│   └── Contact.jsx          # Contact form
│
├── services/
│   ├── db.js                # Firestore CRUD: products, users, orders, reviews
│   └── ai.js                # Gemini AI: generateProductDescription, generateProductImage
│
└── assets/                  # Static image assets
```

## Architecture & Patterns

### Routing

All routes are defined in `src/App.jsx` using React Router v6 `<Routes>` / `<Route>`. Protected routes use the `ProtectedRoute` component which checks `useAuth()` for authentication and role-based access via the `allowedRoles` prop.

**Route groups:**
- Public: `/`, `/products`, `/product/:id`, `/register`, `/login`, `/about-us`, `/contact`
- Authenticated (any role): `/cart`, `/checkout`, `/orders`, `/profile`
- Seller + Admin: `/seller-dashboard`, `/seller-orders`
- Admin only: `/admin-dashboard`
- Catch-all: `*` renders `NotFound`

### State Management

Two separate systems — do not mix them:

1. **Redux** (`store.js`, `reducers.js`, `actions.js`, `dispatchers.js`): Manages shopping cart (items, itemCount) and app-level loader visibility. Access with `useSelector`/`useDispatch`.
2. **AuthContext** (`context/AuthContext.jsx`): Manages Firebase auth state (currentUser, userRole). Access with the `useAuth()` hook. Provides `signup`, `login`, `logout` functions.

Redux uses `legacy_createStore` (not Redux Toolkit). Action types are string constants in `actions.js`, action creators in `dispatchers.js`.

### Data Layer

All Firestore operations are in `src/services/db.js` as standalone async functions. Firestore collections: `products`, `users`, `orders`, `reviews`. Documents use `serverTimestamp()` for `createdAt`/`updatedAt` fields.

### Styling Conventions

- **Tailwind CSS utility classes** applied directly in JSX — no CSS modules, no styled-components
- **DaisyUI** component classes for buttons, forms, dropdowns, modals, loaders (e.g., `btn btn-primary`, `input input-bordered`, `loading loading-spinner`)
- Custom colors defined in `tailwind.config.js`:
  - `primary` (#4CAF50 — green), `accent`/`secondary` (#1e3778 — navy)
  - `soil` (#795548), `sand` (#A1887F), `cream` (#FAF9F6), `darkGreen` (#2E7D32)
- Responsive design uses Tailwind breakpoints (`sm:`, `md:`, `lg:`)

### Forms

Forms use **react-hook-form** (`useForm`, `register`, `handleSubmit`). Validation is declared inline via the `register` options.

### AI Integration

`src/services/ai.js` wraps the Google Generative AI SDK. If `VITE_GEMINI_API_KEY` is missing, functions return placeholder text gracefully. Image generation is a stub returning placeholder URLs.

## Environment Variables

Copy `.env.example` to `.env` and fill in real values. All variables must be prefixed with `VITE_` to be exposed to the client via `import.meta.env`.

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GEMINI_API_KEY
```

## Coding Conventions

- **Language:** JavaScript (JSX) — no TypeScript
- **Module system:** ES modules (`import`/`export`), `"type": "module"` in package.json
- **Component style:** Functional components with hooks (no class components)
- **File naming:** PascalCase for components/pages (`NavBar.jsx`, `ProductDetail.jsx`); camelCase for services/utilities (`db.js`, `ai.js`)
- **Exports:** Default exports for components; named exports for service functions and action creators
- **Prop validation:** Disabled via `/* eslint-disable react/prop-types */` — no PropTypes or TypeScript interfaces
- **Async patterns:** `async`/`await` with `try`/`catch` for Firebase and AI calls
- **Error handling:** `console.error` for logging; user-facing errors shown via `alert()` or inline state
- **Quotes:** Single quotes for JS strings; double quotes in JSX attributes
- **Semicolons:** Mixed — services use semicolons, components generally omit them

## ESLint Configuration

Flat config in `eslint.config.js` targeting ES2020 + JSX:
- Extends: `eslint:recommended`, `react/recommended`, `react/jsx-runtime`, `react-hooks/recommended`
- Notable rule: `react/jsx-no-target-blank` is off
- `react-refresh/only-export-components` set to warn
- Ignores: `dist/`

Run with `npm run lint`.

## Firestore Collections Schema

**products**: `{ name, description, price, category, imageUrl, sellerId, sellerName, createdAt }`
**users**: `{ email, name, role, phone?, address?, createdAt }`
**orders**: `{ buyerId, buyerName, sellerId, items[], totalAmount, shippingAddress, status, createdAt, updatedAt }`
**reviews**: `{ productId, userId, userName, rating, comment, createdAt }`

## User Roles

| Role | Access |
|------|--------|
| `customer` | Browse products, add to cart, place orders, leave reviews, view order history |
| `seller` | All customer abilities + manage own products (CRUD), view/manage orders for their products, AI-generated descriptions |
| `admin` | Full access including admin dashboard, manage all users and orders |

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `firebase` | Auth, Firestore DB, Cloud Storage |
| `react-router-dom` | Client-side SPA routing |
| `redux` + `react-redux` | Shopping cart and loader state |
| `react-hook-form` | Form state management and validation |
| `@google/generative-ai` | Gemini AI for product description generation |
| `daisyui` | Pre-built Tailwind component classes |
| `tailwindcss` | Utility-first CSS framework |

## Common Tasks for AI Assistants

### Adding a new page
1. Create the component in `src/pages/`
2. Add the route in `src/App.jsx` inside `<Routes>` (wrap with `<ProtectedRoute>` if auth required)
3. Add a navigation link in `src/components/NavBar.jsx` if needed

### Adding a new Firestore operation
1. Add the function in `src/services/db.js` following the existing pattern (import Firestore functions, use collection/doc references, return mapped results)

### Adding a new Redux action
1. Add the action type constant in `src/actions.js`
2. Add the action creator in `src/dispatchers.js`
3. Add the case in `src/reducers.js`

### Modifying the theme
1. Edit colors in `tailwind.config.js` under `theme.extend.colors` and `daisyui.themes`
