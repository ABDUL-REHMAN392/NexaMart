<div align="center">

# 🛒 NexaMart — Frontend

<p align="center">
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-7.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  </a>
  <a href="https://zustand-demo.pmnd.rs/">
    <img src="https://img.shields.io/badge/Zustand-5.x-FF6B35?style=for-the-badge" alt="Zustand"/>
  </a>
  <a href="https://socket.io/">
    <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io"/>
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge" alt="MIT"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/ABDUL-REHMAN392/NexaMart?style=flat-square&color=blue" alt="Last Commit"/>
  <img src="https://img.shields.io/github/issues/ABDUL-REHMAN392/NexaMart?style=flat-square&color=red" alt="Issues"/>
  <img src="https://img.shields.io/github/stars/ABDUL-REHMAN392/NexaMart?style=flat-square&color=yellow" alt="Stars"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome"/>
</p>

<br/>

 **A modern, full-featured e-commerce frontend built with React 19 and Vite.**
 Real-time notifications, guest cart with merge-on-login, Google & Facebook OAuth,
 weight-based delivery pricing, and a complete admin dashboard — all in one app.

<br/>

<p align="center">
  <a href="https://nexamart-shop.netlify.app">
    <img src="https://img.shields.io/badge/🚀 Live Demo-Visit Now-success?style=for-the-badge" alt="Live"/>
  </a>
  &nbsp;
  <a href="https://github.com/ABDUL-REHMAN392/NexaMart/issues/new?labels=bug">
    <img src="https://img.shields.io/badge/🐛 Report Bug-Open Issue-red?style=for-the-badge" alt="Bug"/>
  </a>
  &nbsp;
  <a href="https://github.com/ABDUL-REHMAN392/NexaMart/issues/new?labels=enhancement">
    <img src="https://img.shields.io/badge/✨ Request Feature-Open Issue-blue?style=for-the-badge" alt="Feature"/>
  </a>
</p>

</div>


## 📌 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Pages & Routes](#-pages--routes)
- [State Management](#-state-management)
- [Real-time Notifications](#-real-time-notifications)
- [Guest Cart & Merge](#-guest-cart--merge)
- [Delivery Fee System](#-delivery-fee-system)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Related Repository](#-related-repository)
- [Author](#-author)


## ✨ Overview

NexaMart is a complete shopping platform frontend. It connects to the [NexaMart Backend API](https://github.com/ABDUL-REHMAN392/nexamartbackend) and covers the full customer journey — browsing, cart, checkout, orders, reviews — plus a role-based admin panel.

| Feature | Detail |
|:--|:--|
| **Auth** | Email/Password + Google + Facebook OAuth |
| **Cart** | Guest cart (localStorage) with merge-on-login |
| **Favorites** | Optimistic toggle with instant UI feedback |
| **Orders** | Place, track, cancel with full order detail |
| **Reviews** | Create, edit, delete with helpful votes |
| **Notifications** | Real-time via Socket.io with unread badge |
| **Admin Panel** | Dashboard, Orders, Users, Reviews management |
| **Offline Support** | Dedicated offline page when network drops |


## 🏗️ Project Structure

```
NexaMart/
│
├── public/
│   ├── favicon.svg
│   └── _redirects              ← Netlify SPA redirect fix
│
├── src/
│   ├── api/
│   │   └── api.js              ← Custom fetch client (auto token refresh)
│   │
│   ├── assets/
│   │   └── about/              ← Team images (CEO, CTO, etc.)
│   │
│   ├── component/
│   │   ├── admin/
│   │   │   └── AdminLayout.jsx
│   │   ├── BestSellingProducts.jsx
│   │   ├── Carousel.jsx
│   │   ├── Category.jsx
│   │   ├── FlashSales.jsx
│   │   ├── Footer.jsx
│   │   ├── Form.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── NewArvival.jsx
│   │   ├── Notificationbell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ShowItem.jsx
│   │   ├── ShowMenu.jsx
│   │   ├── ShowStarRating.jsx
│   │   └── TrustedPartners.jsx
│   │
│   ├── config/
│   │   └── deliveryConfig.js   ← Weight-based delivery fee tiers
│   │
│   ├── hooks/
│   │   └── useOnlineStatus.js  ← Network status hook
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OAuthSuccess.jsx
│   │   │   └── OAuthFailure.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminReviews.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Category.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Favorite.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── OfflinePage.jsx
│   │   ├── OrderDetail.jsx
│   │   ├── Orders.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Profile.jsx
│   │   ├── Search.jsx
│   │   └── SingleProduct.jsx
│   │
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useCartStore.js
│   │   ├── useFavoriteStore.js
│   │   ├── useNotificationStore.js
│   │   ├── useSocketStore.js
│   │   └── useUIStore.js
│   │
│   ├── UI/
│   │   └── Layout.jsx          ← Main app shell (Header + Footer)
│   │
│   ├── App.jsx                 ← Router setup
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```


## 🚀 Key Features

### 🔐 Authentication

- Email/Password register & login with full validation
- **Google OAuth** and **Facebook OAuth** via backend Passport.js
- Auto token refresh — `api.js` silently retries on `401` before logging out
- Auth state persists across page reloads via `getMe()` on app init
- Guest cart automatically merges into user cart after login/register

### 🛒 Cart

- Works for both **guests** (localStorage) and **logged-in users** (backend)
- Guest cart stored under key `nx_guest_cart`
- On login/register → `mergeGuestCart()` syncs guest items to backend
- Optimistic UI updates with rollback on API failure
- Max 20 items, max qty 10 per item (matches backend limits)

### ❤️ Favorites

- Optimistic toggle — heart icon updates instantly, syncs with backend
- Rollback on failure — no stale UI state
- Limit: 100 items (enforced by backend)

### 🔔 Real-time Notifications

- Socket.io connection established on login, disconnected on logout
- Single persistent socket instance — no duplicate connections
- Strict Mode safe — delayed disconnect with timer to avoid remount issues
- Unread badge count updates live without page refresh

### 📦 Orders

- Full order placement through checkout flow
- Order tracking with status: `pending → processing → shipped → delivered`
- Cancel order option before shipment
- Order detail page with itemized breakdown

### ⭐ Reviews

- Create, edit, delete product reviews
- Verified purchase badge (auto-assigned by backend)
- Helpful votes system
- Rating summary with 1★–5★ breakdown per product

### 👑 Admin Panel

- Protected behind `adminOnly` role check
- **Dashboard** — revenue charts (Recharts), top products, recent orders, growth %
- **Orders** — view all, update status
- **Users** — search, paginate, ban/unban
- **Reviews** — hide/unhide or delete any review

### 📡 Offline Support

- `useOnlineStatus` hook monitors `navigator.onLine`
- Entire app replaced with `<OfflinePage />` when network drops
- Automatically restores when connection returns


## 🛠️ Tech Stack

| Technology | Version | Purpose |
|:--|:--|:--|
| React | 19 | UI library |
| Vite | 7.0 | Build tool & dev server |
| React Router DOM | 7.x | Client-side routing |
| Tailwind CSS | 4.x | Utility-first styling |
| Zustand | 5.x | Global state management |
| Socket.io Client | 4.x | Real-time notifications |
| Recharts | 3.x | Admin dashboard charts |
| Framer Motion | 12.x | Animations & transitions |
| React Icons | 5.x | Icon library |
| React Loading Skeleton | 3.x | Loading placeholder UI |
| React Phone Number Input | 3.x | Phone field with country flag |


## 🗺️ Pages & Routes

### Public Routes

| Route | Page | Description |
|:--|:--|:--|
| `/` | Home | Hero, flash sales, categories, new arrivals |
| `/about` | About | Team & company info |
| `/contact` | Contact | Contact form |
| `/search` | Search | Product search results |
| `/category/:category` | Category | Filtered products by category |
| `/product/:id` | SingleProduct | Product detail + reviews |
| `/cart` | Cart | Shopping cart (guest + logged-in) |
| `/favorite` | Favorite | Saved favorites |
| `/login` | Login | Email/Password + OAuth buttons |
| `/register` | Register | New account form |
| `/privacy-policy` | PrivacyPolicy | Legal page |
| `/oauth-success` | OAuthSuccess | OAuth redirect handler |
| `/oauth-failure` | OAuthFailure | OAuth error handler |

### Protected Routes (Login Required)

| Route | Page | Description |
|:--|:--|:--|
| `/checkout` | Checkout | Order placement + address |
| `/orders` | Orders | My orders list |
| `/orders/:orderId` | OrderDetail | Single order detail |
| `/profile` | Profile | Edit profile, avatar, password |

### Admin Routes (Admin Role Required)

| Route | Page | Description |
|:--|:--|:--|
| `/admin` | AdminDashboard | Stats, charts, recent activity |
| `/admin/orders` | AdminOrders | All orders + status update |
| `/admin/users` | AdminUsers | User list + ban/unban |
| `/admin/reviews` | AdminReviews | Review moderation |


## 🧠 State Management

All global state is managed with **Zustand** — no Context API, no Redux.

| Store | Manages |
|:--|:--|
| `useAuthStore` | User object, isAuthenticated, login/logout/register |
| `useCartStore` | Cart items, guest cart (localStorage), merge logic |
| `useFavoriteStore` | Favorites list, optimistic toggle, clear |
| `useNotificationStore` | Notifications list, unread count, mark read/delete |
| `useSocketStore` | Socket.io instance, connect/disconnect lifecycle |
| `useUIStore` | UI state (modals, sidebar open, etc.) |

### App Initialization Flow

```
App mounts
    │
    ▼
getMe() → checks JWT cookie → sets isAuthenticated
    │
    ▼ (if authenticated)
fetchCart() + fetchFavorites() + fetchNotifications() + connect()
    │
    ▼ (if not authenticated)
clearNotifications() + disconnect()
```


## ⚡ Real-time Notifications

Socket.io client connects to the backend when user logs in and joins a private room.

```js
// useSocketStore.js — single persistent instance
socketInstance = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});
```

**Flow:**
```
User logs in
    │
    ▼
connect() → socket joins "user:{userId}" room
    │
    ▼
Backend emits "new_notification" on order update / review action
    │
    ▼
addNotification() → updates bell badge instantly
    │
    ▼
User logs out → disconnect() (200ms delay for Strict Mode safety)
```


## 🛒 Guest Cart & Merge

NexaMart supports shopping **without an account**. The cart is stored in `localStorage` under `nx_guest_cart`.

```
Guest adds items → localStorage (nx_guest_cart)
        │
        ▼
User logs in / registers
        │
        ▼
mergeGuestCart() → POST /api/cart/merge
        │
        ▼
Backend merges items (respects qty limits)
        │
        ▼
localStorage cleared → state synced from backend
```

If merge fails, the backend cart is loaded and localStorage is cleared to avoid stale data.


## 📦 Delivery Fee System

Delivery fees are calculated client-side based on **total cart weight** before checkout.

```js
// src/config/deliveryConfig.js
export const DELIVERY_TIERS = [
  { maxKg: 0.5,      fee: 2.99,  label: "Light (up to 0.5 kg)" },
  { maxKg: 2,        fee: 5.99,  label: "Standard (0.5 – 2 kg)" },
  { maxKg: 5,        fee: 9.99,  label: "Heavy (2 – 5 kg)" },
  { maxKg: Infinity, fee: 14.99, label: "Bulky (5+ kg)" },
];
```

Use `calcDeliveryFee(totalWeightKg)` and `calcCartWeight(items)` from `deliveryConfig.js` anywhere in the app.


## ⚙️ Local Setup

### Prerequisites

| Requirement | Version |
|:--|:--|
| Node.js | v18+ |
| NexaMart Backend | Running on port 5000 |

### Installation

```bash
# 1. Clone
git clone https://github.com/ABDUL-REHMAN392/NexaMart.git
cd NexaMart

# 2. Install dependencies
npm install

# 3. Configure .env (see below)

# 4. Start dev server
npm run dev
```

Other commands:
```bash
npm run build      # Production build
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```


## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

 For production, change this to your deployed backend URL:
 ```env
 VITE_API_URL=https://your-backend.onrender.com/api
 ```


## 🌐 Deployment

### Netlify (Recommended)

| Field | Value |
|:--|:--|
| Build Command | `npm run build` |
| Publish Directory | `dist` |

**Important:** The `public/_redirects` file is already included for SPA routing:
```
/*    /index.html    200
```
Without this, direct URL access (e.g. `/product/123`) returns a 404 on Netlify.

 Set `VITE_API_URL` in Netlify's **Environment Variables** section before deploying.

### Vercel

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```


## 🔗 Related Repository

This frontend is powered by the NexaMart Backend API.

[![Backend Repo](https://img.shields.io/badge/Backend-nexamartbackend-181717?style=for-the-badge&logo=github)](https://github.com/ABDUL-REHMAN392/nexamartbackend)

| | Frontend | Backend |
|:--|:--|:--|
| **Repo** | NexaMart | nexamartbackend |
| **Tech** | React + Vite | Node.js + Express |
| **Deploy** | Netlify | Render |
| **Live** | [nexamart-shop.netlify.app](https://nexamart-shop.netlify.app) | Your backend URL |


## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
# Open a Pull Request
```

**Commit convention:**
```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    CSS / formatting
refactor: Code restructuring
chore:    Config / build changes
```


## 👨‍💻 Author

<div align="center">

### Abdulrehman
*Full Stack Developer*

[![GitHub](https://img.shields.io/badge/GitHub-ABDUL--REHMAN392-181717?style=for-the-badge&logo=github)](https://github.com/ABDUL-REHMAN392)
[![Gmail](https://img.shields.io/badge/Gmail-abdulrehmanrafique01@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abdulrehmanrafique01@gmail.com)


*Agar ye project helpful laga, please ⭐ zaroor do!*

**© 2024 Abdulrehman**

</div>
