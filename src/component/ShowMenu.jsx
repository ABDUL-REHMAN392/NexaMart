import { RxCross1 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/useUIStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Form from "./Form";
import {
  FiUser,
  FiLogIn,
  FiHome,
  FiInfo,
  FiMail,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFavoriteStore } from "../store/useFavoriteStore";

const backdropV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.22, delay: 0.08 } },
};

const drawerV = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 32,
      when: "beforeChildren",
      staggerChildren: 0.055,
    },
  },
  exit: {
    x: "100%",
    transition: { type: "tween", duration: 0.26, ease: [0.4, 0, 1, 1] },
  },
};

const itemV = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: 12, transition: { duration: 0.14 } },
};

const navLinks = [
  { path: "/", label: "Home", icon: FiHome, end: true },
  { path: "/about", label: "About", icon: FiInfo, end: false },
  { path: "/contact", label: "Contact", icon: FiMail, end: false },
];

const accountLinks = [
  { path: "/profile", label: "My Profile", icon: FiUser },
  { path: "/orders", label: "My Orders", icon: FiShoppingBag },
  { path: "/favorite", label: "My Favorites", icon: FiHeart },
];

/* ── Section label ── */
function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: "#9ca3af",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "4px 6px 8px",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

/* ── Nav item ── */
function NavItem({
  path,
  label,
  icon: Icon,
  end,
  onClick,
  accent = "#6366f1",
  accentBg = "#eef2ff",
}) {
  return (
    <NavLink
      to={path}
      end={end}
      onClick={onClick}
      style={{ textDecoration: "none", display: "block" }}
    >
      {({ isActive }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 13px",
            borderRadius: 14,
            background: isActive
              ? `linear-gradient(135deg,${accentBg},#f5f3ff)`
              : "transparent",
            border: `1.5px solid ${isActive ? "#c7d2fe" : "transparent"}`,
            cursor: "pointer",
            transition: "all 0.16s ease",
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "#f8f8fd";
              e.currentTarget.style.borderColor = "#e8e8f5";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                flexShrink: 0,
                background: isActive ? accent : "#f1f0ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.16s",
                boxShadow: isActive ? `0 3px 10px ${accent}40` : "none",
              }}
            >
              <Icon size={15} color={isActive ? "#fff" : accent} />
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: isActive ? "#4f46e5" : "#374151",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </span>
          </div>
          <FiChevronRight size={14} color={isActive ? "#a5b4fc" : "#d1d5db"} />
        </div>
      )}
    </NavLink>
  );
}

function ShowMenu() {
  const { hideMenu } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { resetCart } = useCartStore();
  const { resetFavorites } = useFavoriteStore();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = () => hideMenu();

  const handleLogout = async () => {
    close();
    await logout();
    resetCart();
    resetFavorites();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        .sm-body::-webkit-scrollbar { display: none; }
        .sm-body { scrollbar-width: none; }
      `}</style>

      {/* Backdrop */}
      <motion.div
        variants={backdropV}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(10,8,30,0.52)",
          backdropFilter: "blur(7px)",
        }}
      />

      {/* Drawer */}
      <motion.div
        variants={drawerV}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(340px,88vw)",
          zIndex: 999,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans',sans-serif",
          boxShadow: "-8px 0 40px rgba(10,8,30,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Top gradient accent */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)",
            flexShrink: 0,
          }}
        />

        {/* ── Header ── */}
        <motion.div
          variants={itemV}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 22px 16px",
            borderBottom: "1px solid #f4f4fc",
            flexShrink: 0,
          }}
        >
          <NavLink
            to="/"
            onClick={close}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "baseline",
              gap: 1,
            }}
          >
            <span
              style={{
                fontSize: 21,
                fontWeight: 900,
                color: "#1e1b4b",
                letterSpacing: "-0.4px",
              }}
            >
              Nexa
            </span>
            <span
              style={{
                fontSize: 21,
                color: "#6366f1",
                fontFamily: "'Pacifico',cursive",
              }}
            >
              Mart
            </span>
          </NavLink>

          <button
            onClick={close}
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              border: "1.5px solid #e8e8f4",
              background: "#f8f8fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#64748b",
              transition: "all 0.16s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.borderColor = "#fecaca";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f8f8fd";
              e.currentTarget.style.borderColor = "#e8e8f4";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <RxCross1 size={14} />
          </button>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          variants={itemV}
          style={{ padding: "14px 18px 0", flexShrink: 0 }}
        >
          <Form onSearch={close} />
        </motion.div>

        {/* ── Body ── */}
        <div
          className="sm-body"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Navigation */}
          <motion.div variants={itemV}>
            <SectionLabel>Navigation</SectionLabel>
          </motion.div>

          {navLinks.map(({ path, label, icon, end }) => (
            <motion.div key={path} variants={itemV}>
              <NavItem
                path={path}
                label={label}
                icon={icon}
                end={end}
                onClick={close}
              />
            </motion.div>
          ))}

          {/* Account links */}
          {isAuthenticated && (
            <>
              <motion.div variants={itemV}>
                <div
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg,#ebebf5,transparent)",
                    margin: "10px 0 8px",
                  }}
                />
                <SectionLabel>Account</SectionLabel>
              </motion.div>

              {accountLinks.map(({ path, label, icon }) => (
                <motion.div key={path} variants={itemV}>
                  <NavItem
                    path={path}
                    label={label}
                    icon={icon}
                    onClick={close}
                  />
                </motion.div>
              ))}
            </>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />
        </div>

        {/* ── Footer ── */}
        <motion.div
          variants={itemV}
          style={{
            padding: "16px 18px 28px",
            borderTop: "1px solid #f4f4fc",
            flexShrink: 0,
          }}
        >
          {isAuthenticated ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* User card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: "14px 16px",
                  borderRadius: 18,
                  background: "linear-gradient(135deg,#f5f3ff,#eef2ff)",
                  border: "1.5px solid #e0e7ff",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                    fontWeight: 900,
                    color: "#fff",
                    border: "2px solid #c7d2fe",
                    overflow: "hidden",
                    boxShadow: "0 3px 10px rgba(99,102,241,0.3)",
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#1e1b4b",
                      margin: "0 0 2px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {user?.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  height: 42,
                  borderRadius: 13,
                  background: "#fef2f2",
                  border: "1.5px solid #fecaca",
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "all 0.16s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                  e.currentTarget.style.borderColor = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.borderColor = "#fecaca";
                }}
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Guest prompt */}
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg,#f5f3ff,#eef2ff)",
                  border: "1.5px solid #e0e7ff",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1e1b4b",
                    margin: "0 0 3px",
                  }}
                >
                  Welcome to NexaMart
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                  Sign in to access your account
                </p>
              </div>

              <NavLink
                to="/login"
                onClick={close}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  height: 46,
                  borderRadius: 50,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(99,102,241,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(99,102,241,0.35)";
                }}
              >
                <FiLogIn size={15} /> Sign In to your account
              </NavLink>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

export default ShowMenu;
