# MarketHive Client

Frontend for MarketHive, a multi-vendor e-commerce platform. This is the React app that serves three separate portals — customer storefront, seller dashboard, and admin panel — from a single codebase.

## What this project does

MarketHive is set up as a marketplace: customers browse and buy products, sellers manage their own catalog and orders, and admins oversee sellers, products, categories, and orders across the platform. Each portal has its own login, its own layout, and its own set of routes, but they share the same UI components, API client, and styling.

Customer-facing features include browsing products by category, search, cart, wishlist, checkout, order history, and address management. The seller portal covers product CRUD, order handling, and a revenue view. The admin portal covers seller approval/management, product and category oversight, and order tracking.

Authentication is cookie-based — the backend sets an httpOnly `access_token` cookie on login, and the client doesn't handle tokens directly. Because the cookie isn't namespaced per role, only one portal (customer, seller, or admin) can be logged in at a time in the same browser.

## Features

### Customer

- Browse products, filter by category, search
- Product detail pages with reviews and star ratings
- Submit and view product reviews
- Cart with quantity management
- Wishlist for saved products
- Checkout flow with saved addresses
- Multiple saved delivery addresses
- Order history and individual order details
- Cancel an order
- Profile management
- AI shopping assistant chat widget
- Email verification, login, register, forgot password

### Seller

- Seller registration with OTP verification
- Login, forgot/reset password, change password
- Dashboard with product statistics and category breakdown
- Add, edit, and manage own products
- Toggle product active/inactive status
- View and update order status
- Revenue summary view
- Profile management

### Admin

- Admin login with OTP-based password reset
- Platform dashboard with seller/product stats
- Manage sellers, view seller detail, approve/suspend accounts
- Manage products across all sellers, toggle status
- Manage categories, toggle active/inactive status
- View and manage all orders, update order status
- Profile management and change password

### Shared

- Role-based protected and guest-only routing
- Separate auth context per portal (customer/seller/admin)
- Centralized API client with normalized error messages
- Toast notifications for actions and errors
- Reusable UI components (Button, Input, Modal, Loader, StatusBadge, etc.)

## Tech Stack

- React 19 + Vite
- React Router v7 for routing
- Tailwind CSS for styling
- Axios for API calls
- React Hook Form for forms
- React Hot Toast for notifications
- Lucide React for icons

## Project Structure

```
src/
├── api/               # Axios instance + centralized endpoint definitions
├── components/
│   ├── common/         # Shared UI: Button, Input, Modal, Loader, StatusBadge, etc.
│   ├── customer/        # Customer-specific components (ProductCard, ChatWidget, ReviewForm...)
│   ├── seller/          # Seller-specific components
│   ├── admin/            # Admin-specific components
│   └── layout/         # Portal layouts and navbars (CustomerLayout, SellerLayout, AdminLayout)
├── context/            # Auth contexts — one per portal, built off a shared createAuthContext factory
├── hooks/              # Custom hooks (useCategories, useWishlist, useDocumentTitle)
├── pages/
│   ├── customer/        # Home, Shop, ProductDetail, Cart, Checkout, Orders, Profile...
│   ├── seller/           # Dashboard, Products, AddProduct/EditProduct, Orders, Revenue...
│   └── admin/            # Dashboard, Sellers, Products, Categories, Orders...
├── routes/              # ProtectedRoute / GuestRoute wrappers, driven by each portal's auth context
├── utils/               # Constants (order/product/seller statuses, roles) and formatting helpers
└── App.jsx              # All route definitions for the three portals
```

Routing is centralized in `App.jsx`: customer routes sit under `/`, seller routes under `/seller/*`, and admin routes under `/admin/*`, each wrapped in their own layout and auth guards.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and point it at your backend:

```
VITE_API_BASE_URL=http://localhost:5000
```

If this isn't set, the client falls back to `http://localhost:5000`.

Run the dev server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint       # run ESLint
```
