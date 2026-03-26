import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./UI/Layout";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminLayout from "./component/admin/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import Category from "./pages/Category";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Favorite from "./pages/Favorite";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Profile from "./pages/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OAuthSuccess from "./pages/auth/OAuthSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import NotFound from "./pages/NotFound";
import OfflinePage from "./pages/OfflinePage";

import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import { useFavoriteStore } from "./store/useFavoriteStore";
import { useSocketStore } from "./store/useSocketStore";
import { useNotificationStore } from "./store/useNotificationStore";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import OAuthFailure from "./pages/auth/OAuthFailure";

// ─── Online Status Hook ───────────────────────────────────────────────────────
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return isOnline;
}

// ─── AppInit — auth, cart, socket, notifications ──────────────────────────────
function AppInit() {
  const { getMe, isAuthenticated, isLoading } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchFavorites } = useFavoriteStore();
  const { connect, disconnect } = useSocketStore();
  const { fetchNotifications, clearNotifications } = useNotificationStore();

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      fetchCart();
      fetchFavorites();
      fetchNotifications();
      connect();
    } else {
      clearNotifications();
      disconnect();
    }
  }, [isAuthenticated, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

function RootWrapper() {
  const isOnline = useOnlineStatus();

  // Offline hone pe poora app replace ho jaata hai — header/footer nahi
  if (!isOnline) return <OfflinePage />;

  // Online hone pe normal flow
  return (
    <>
      <AppInit />
      <Outlet />
    </>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter(
  createRoutesFromElements(
    // RootWrapper sab routes ka parent — offline check globally hota hai
    <Route element={<RootWrapper />}>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="search" element={<Search />} />
        <Route path="category/:category" element={<Category />} />
        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="cart" element={<Cart />} />
        <Route path="favorite" element={<Favorite />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="oauth-success" element={<OAuthSuccess />} />
        <Route path="oauth-failure" element={<OAuthFailure />} />

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="privacy-policy" element={<PrivacyPolicy />} />
    </Route>,
  ),
);

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <RouterProvider router={router} />
      
    </>
  );
}

export default App;
