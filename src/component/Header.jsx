import { NavLink, useNavigate } from "react-router-dom";
import Form from "./Form";
import { IoMdMenu } from "react-icons/io";
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiPackage,
} from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { useUIStore } from "../store/useUIStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useFavoriteStore } from "../store/useFavoriteStore";
import ShowMenu from "./ShowMenu";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import NotificationBell from "../component/Notificationbell";

function Header() {
  const { menuOpen, showMenu } = useUIStore();
  const { user, isAuthenticated, isInitializing, logout } = useAuthStore();
  const totalItems = useCartStore((s) => s.totalItems());
  const { resetCart } = useCartStore();
  const { resetFavorites } = useFavoriteStore();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false); // ← logout loading
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setLoggingOut(true);
    try {
      await logout();
      resetCart();
      resetFavorites();
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  // ── Auth check chal raha hai — kuch mat dikhao (flicker prevention)
  const renderAuthSection = () => {
    if (isInitializing) {
      return (
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#f1f0ff",
            flexShrink: 0,
          }}
        />
      );
    }

    if (isAuthenticated) {
      return (
        <div ref={dropdownRef} style={{ position: "relative", flexShrink: 0 }}>
          <motion.button
            className="nx-avatar"
            onClick={() => setDropdownOpen((d) => !d)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{ border: "none", padding: 0 }}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="nx-dropdown"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="nx-dd-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 14, fontWeight: 800, overflow: "hidden",
                      }}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <p className="nx-dd-name">{user?.name}</p>
                      <p className="nx-dd-email">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "6px 0" }}>
                  <NavLink to="/profile" onClick={() => setDropdownOpen(false)} className="nx-dd-item">
                    <span className="dd-ico"><FiUser size={14} /></span> My Profile
                  </NavLink>
                  <NavLink to="/orders" onClick={() => setDropdownOpen(false)} className="nx-dd-item">
                    <span className="dd-ico"><FiPackage size={14} /></span> My Orders
                  </NavLink>
                  <NavLink to="/favorite" onClick={() => setDropdownOpen(false)} className="nx-dd-item">
                    <span className="dd-ico"><CiHeart size={16} /></span> My Favorites
                  </NavLink>
                </div>

                <div style={{ borderTop: "1px solid #f4f4fc", padding: "6px 0" }}>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="nx-dd-item danger"
                    style={{ opacity: loggingOut ? 0.7 : 1, cursor: loggingOut ? "not-allowed" : "pointer" }}
                  >
                    {loggingOut ? (
                      <>
                        <span className="dd-ico">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            style={{ display: "inline-flex" }}
                          >
                            <FiLogOut size={14} />
                          </motion.span>
                        </span>
                        Logging out…
                      </>
                    ) : (
                      <>
                        <span className="dd-ico"><FiLogOut size={14} /></span> Logout
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <NavLink to="/login" className="nx-signin-btn">
        <FiLogIn size={13} /> Sign In
      </NavLink>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Sora:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }
        .nx-header { font-family: 'Sora', sans-serif; }

        .nx-link {
          position: relative; font-size: 13.5px; font-weight: 600;
          color: #64748b; text-decoration: none;
          padding-bottom: 3px; transition: color 0.2s; white-space: nowrap;
        }
        .nx-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px; transition: width 0.25s ease;
        }
        .nx-link:hover { color: #4f46e5; }
        .nx-link:hover::after, .nx-link-active::after { width: 100%; }
        .nx-link-active { color: #4f46e5 !important; }

        .nx-icon-btn {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 11px;
          border: 1.5px solid transparent; background: transparent;
          color: #64748b; cursor: pointer; transition: all 0.2s ease;
          text-decoration: none; flex-shrink: 0;
        }
        .nx-icon-btn:hover { background: #f1f0ff; border-color: #e0e0f8; color: #4f46e5; }

        .nx-badge {
          position: absolute; top: -5px; right: -5px;
          min-width: 17px; height: 17px; padding: 0 3px; border-radius: 9px;
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: #fff; font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
        }

        .nx-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800; border: 2px solid #e0e7ff;
          cursor: pointer; transition: all 0.2s; overflow: hidden; flex-shrink: 0;
        }
        .nx-avatar:hover { border-color: #a5b4fc; box-shadow: 0 0 0 4px rgba(99,102,241,0.12); }

        .nx-dropdown {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 216px; background: #fff;
          border: 1.5px solid #ebebf8; border-radius: 18px;
          box-shadow: 0 20px 48px rgba(99,102,241,0.13), 0 4px 16px rgba(0,0,0,0.06);
          overflow: hidden; z-index: 9999;
        }
        .nx-dd-head { padding: 14px 16px; border-bottom: 1px solid #f4f4fc; background: linear-gradient(135deg, #f5f3ff, #faf5ff); }
        .nx-dd-name  { font-size: 13px; font-weight: 800; color: #1e1b4b; margin: 0 0 2px; }
        .nx-dd-email { font-size: 11px; color: #9ca3af; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
        .nx-dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 13px; font-weight: 600; color: #374151;
          cursor: pointer; text-decoration: none; transition: all 0.15s;
          width: 100%; background: transparent; border: none; text-align: left;
          font-family: 'Sora', sans-serif;
        }
        .nx-dd-item:hover { background: #f5f3ff; color: #4f46e5; }
        .nx-dd-item .dd-ico { color: #a5b4fc; transition: color 0.15s; flex-shrink: 0; }
        .nx-dd-item:hover .dd-ico { color: #6366f1; }
        .nx-dd-item.danger { color: #ef4444; }
        .nx-dd-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .nx-dd-item.danger .dd-ico { color: #fca5a5; }
        .nx-dd-item.danger:hover .dd-ico { color: #ef4444; }

        .nx-signin-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 0 18px; height: 36px; border-radius: 50px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; font-size: 13px; font-weight: 700;
          border: none; cursor: pointer; transition: all 0.2s;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 4px 14px rgba(99,102,241,0.32);
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
        }
        .nx-signin-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.42); }

        .nx-divider { width: 1px; height: 20px; background: #e8e8f4; flex-shrink: 0; }

        .nx-desktop { display: flex; align-items: center; gap: 8px; }
        .nx-desktop-block { display: block; }
        .nx-mobile  { display: none; align-items: center; gap: 4px; }

        @media (max-width: 1023px) {
          .nx-desktop       { display: none !important; }
          .nx-desktop-block { display: none !important; }
          .nx-mobile        { display: flex !important; }
        }
        @media (max-width: 767px) {
          .nx-header-inner { padding: 0 16px !important; }
        }

        /* ── Auth skeleton pulse (isInitializing) ── */
        @keyframes nx-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        .nx-skeleton {
          animation: nx-pulse 1.4s ease-in-out infinite;
          background: #e8e8f8; border-radius: 50%;
          width: 34px; height: 34px; flex-shrink: 0;
        }
      `}</style>

      <motion.header
        className="nx-header"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.94)" : "#fff",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1.5px solid ${scrolled ? "#e8e8f4" : "#f4f4fc"}`,
          boxShadow: scrolled ? "0 4px 28px rgba(99,102,241,0.08)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="nx-header-inner"
          style={{
            maxWidth: 1300, margin: "0 auto", padding: "0 32px",
            height: 64, display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0, marginRight: 8 }}
          >
            <NavLink
              to="/"
              style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 1 }}
            >
              <span style={{ fontSize: 21, fontWeight: 900, color: "#1e1b4b", letterSpacing: "-0.5px", fontFamily: "Sora, sans-serif" }}>
                Nexa
              </span>
              <span style={{ fontSize: 21, color: "#6366f1", fontFamily: "'Pacifico', cursive" }}>
                Mart
              </span>
            </NavLink>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="nx-desktop" style={{ gap: 26, flexShrink: 0 }}>
            {["/", "/about", "/contact"].map((path) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) => `nx-link${isActive ? " nx-link-active" : ""}`}
              >
                {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </NavLink>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* ── DESKTOP GROUP ── */}
          <div className="nx-desktop" style={{ gap: 6 }}>
            <div className="nx-desktop-block" style={{ marginRight: 4, width: 220 }}>
              <Form />
            </div>

            <div className="nx-divider" />

            <NavLink to="/favorite" className="nx-icon-btn" title="Favorites">
              <CiHeart size={21} />
            </NavLink>

            <NavLink to="/cart" className="nx-icon-btn" title="Cart">
              <FiShoppingCart size={18} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    className="nx-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>

            {/* Bell — sirf authenticated ho aur initializing khatam ho ── */}
            {!isInitializing && isAuthenticated && <NotificationBell />}

            <div className="nx-divider" style={{ margin: "0 2px" }} />

            {/* Avatar / Sign In / Skeleton */}
            {renderAuthSection()}
          </div>

          {/* ── MOBILE GROUP ── */}
          <div className="nx-mobile">
            <NavLink to="/favorite" className="nx-icon-btn" title="Favorites">
              <CiHeart size={21} />
            </NavLink>

            <NavLink to="/cart" className="nx-icon-btn" title="Cart">
              <FiShoppingCart size={18} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    className="nx-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>

            {!isInitializing && isAuthenticated && <NotificationBell />}

            <motion.button
              onClick={showMenu}
              className="nx-icon-btn"
              whileTap={{ scale: 0.9 }}
              style={{ border: "none" }}
            >
              <IoMdMenu size={22} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && <ShowMenu key="mobile-menu" />}
      </AnimatePresence>
    </>
  );
}

export default Header;