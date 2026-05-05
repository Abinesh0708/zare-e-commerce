# ZARE — Premium Fashion E-Commerce

> **Style That Defines You.**

ZARE is a modern, full-featured fashion e-commerce web application built with React, TypeScript, and Vite. It delivers a premium shopping experience with a clean, high-impact design system, smooth animations, and a complete end-to-end shopping flow — from browsing curated collections to checkout.

---

## Live Preview

> Run locally with `npm run dev` and open [http://localhost:3000](http://localhost:3000)

---

##  Features

### Shopping Experience
- **Homepage** — Stunning hero section with animated tagline, marquee banner, trending products carousel, curated collections grid, new arrivals, testimonials, and a newsletter signup
- **Product Listing** — Browse all products with category filtering, search, and sort functionality
- **Product Detail** — Full product view with image gallery, size/color selectors, specs, reviews, and stock status
- **Quick View Modal** — Preview products without leaving the current page
- **Shopping Cart** — Add, remove, and update item quantities with a real-time cart summary
- **Checkout** — Multi-step checkout form with order summary and form validation
- **Contact Page** — Contact form with business information

### Design & UI
- **Premium Aesthetic** — Dark/light sections, lime-green accents (`#A3E635`), and bold typography
- **Framer Motion Animations** — Scroll-triggered reveals, entrance animations, hover effects, and micro-interactions
- **Responsive Layout** — Fully mobile-first design, optimized for all screen sizes
- **Skeleton Loaders** — Smooth loading placeholders for improved perceived performance
- **Rotating Badge** — Animated SVG badge component on the hero section
- **Scroll to Top** — Automatic scroll restoration on route navigation

### Technical Highlights
- **React 19 + TypeScript** — Type-safe component architecture
- **React Router v7** — Client-side routing with 6 distinct pages
- **Context API (CartContext)** — Global cart state management without external libraries
- **Vite** — Lightning-fast development server and optimized production builds
- **Tailwind CSS v4** — Utility-first styling with custom configuration
- **Lucide React** — Consistent, modern icon set throughout the UI

---

## Project Structure

```
zare-e-commerce/
├── index.html                  # HTML entry point
├── vite.config.ts              # Vite + Tailwind config
├── tsconfig.json               # TypeScript config
├── package.json
└── src/
    ├── main.tsx                # React app entry point
    ├── App.tsx                 # Root component — routing & layout
    ├── index.css               # Global styles
    ├── types.ts                # TypeScript interfaces (Product, CartItem)
    ├── data/
    │   └── products.ts         # Static product catalog data
    ├── context/
    │   └── CartContext.tsx     # Global cart state (add, remove, update, clear)
    ├── components/
    │   ├── Navbar.tsx          # Responsive navigation with cart badge
    │   ├── Footer.tsx          # Site footer with links & contact info
    │   ├── ProductCard.tsx     # Reusable product card with hover effects
    │   ├── QuickViewModal.tsx  # Product quick-view overlay
    │   ├── RotatingBadge.tsx   # Animated SVG badge (hero section)
    │   ├── Skeleton.tsx        # Loading skeleton placeholders
    │   └── ScrollToTop.tsx     # Auto scroll-to-top on route change
    └── pages/
        ├── Home.tsx            # Landing page with all sections
        ├── Products.tsx        # Product listing with filters
        ├── Details.tsx         # Single product detail page
        ├── Cart.tsx            # Shopping cart page
        ├── Checkout.tsx        # Checkout form & order summary
        └── Contact.tsx         # Contact form & business info
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abinesh0708/zare-e-commerce.git

# 2. Navigate into the project directory
cd zare-e-commerce

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server on port 3000 |
| `npm run build` | Build the app for production into `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove the `/dist` build folder |

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety |
| [Vite](https://vitejs.dev/) | 6.2 | Build tool & dev server |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Motion (Framer)](https://motion.dev/) | 12 | Animations |
| [Lucide React](https://lucide.dev/) | 0.5 | Icon library |

---

## Pages Overview

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, trending, categories, new arrivals, testimonials |
| `/products` | Products | Full catalog with filter, search, and sort |
| `/product/:id` | Details | Individual product detail with gallery |
| `/cart` | Cart | Shopping cart with quantity management |
| `/checkout` | Checkout | Order form with summary |
| `/contact` | Contact | Contact form & business details |

---

## Cart System

The cart is powered by React's **Context API** (`CartContext`). It supports:
- Adding products to the cart
- Removing individual items
- Updating item quantities
- Clearing the entire cart
- Persisting cart state across route changes (in-memory)

---

## 📱 Responsive Design

ZARE is designed **mobile-first** and is fully responsive across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Wide screen (1280px+)

---

## 👤 Author

**Abinesh** — [@Abinesh0708](https://github.com/Abinesh0708)
 abineshk2m@gmail.com

---

## License

This project is licensed under the **Apache-2.0 License**.

---

<div align="center">
  <strong>© 2026 ZARE Fashion. All rights reserved.</strong><br/>
  Designed by Abin.
</div>
