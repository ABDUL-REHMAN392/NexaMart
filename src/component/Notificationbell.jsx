import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiX,
  FiTrash2,
  FiCheck,
  FiPackage,
  FiStar,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useNotificationStore } from "../store/useNotificationStore";
import { useSocketStore } from "../store/useSocketStore";

const TYPE_META = {
  new_order: { icon: FiPackage, color: "#6366f1", bg: "#eef2ff" },
  customer_cancelled: { icon: FiAlertCircle, color: "#ef4444", bg: "#fef2f2" },
  new_review: { icon: FiStar, color: "#f59e0b", bg: "#fefce8" },
  order_status_update: { icon: FiPackage, color: "#3b82f6", bg: "#eff6ff" },
  order_cancelled_by_admin: {
    icon: FiAlertCircle,
    color: "#ef4444",
    bg: "#fef2f2",
  },
  order_placed: { icon: FiCheckCircle, color: "#16a34a", bg: "#f0fdf4" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function NotificationList({
  notifications,
  loading,
  unreadCount,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  onItemClick,
  onClose,
  isMobile,
}) {
  return (
    <>
      <div
        style={{
          padding: "13px 16px 11px",
          borderBottom: "1.5px solid #f4f4fc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 7px",
                borderRadius: 99,
                background: "#eef2ff",
                color: "#6366f1",
                border: "1px solid #c7d2fe",
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: "4px 8px",
                borderRadius: 8,
                border: "1px solid #ebebf5",
                background: "#f8f8fc",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                color: "#6366f1",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
              }}
            >
              <FiCheck size={11} /> All read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid #fecaca",
                background: "#fef2f2",
                cursor: "pointer",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiTrash2 size={12} />
            </button>
          )}
          {isMobile && (
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid #ebebf5",
                background: "#f8f8fc",
                cursor: "pointer",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      <div
        style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" }}
      >
        {loading ? (
          <div
            style={{
              padding: "40px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "2.5px solid #ebebf5",
                borderTopColor: "#6366f1",
                animation: "nb-spin 0.9s linear infinite",
              }}
            />
            <style>{`@keyframes nb-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "52px 16px", textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#f4f4fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <FiBell size={26} color="#c4c4d4" />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1e1b4b",
                margin: "0 0 5px",
              }}
            >
              All caught up!
            </p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
              No notifications yet
            </p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const meta = TYPE_META[n.type] || TYPE_META.order_status_update;
            const Icon = meta.icon;
            return (
              <motion.div
                key={`${n._id}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => onItemClick(n)}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: isMobile ? "14px 18px" : "12px 16px",
                  cursor: "pointer",
                  background: n.read ? "#fff" : "#f5f8ff",
                  borderBottom: "1px solid #f4f4fc",
                  borderLeft: n.read
                    ? "3px solid transparent"
                    : "3px solid #6366f1",
                  transition: "background 0.14s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f4ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = n.read
                    ? "#fff"
                    : "#f5f8ff";
                }}
              >
                <div
                  style={{
                    width: isMobile ? 40 : 36,
                    height: isMobile ? 40 : 36,
                    borderRadius: 11,
                    flexShrink: 0,
                    background: meta.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={isMobile ? 18 : 16} color={meta.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: isMobile ? 13 : 12,
                      fontWeight: n.read ? 600 : 800,
                      color: n.read ? "#374151" : "#1e1b4b",
                      margin: "0 0 3px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {n.title}
                  </p>
                  <p
                    style={{
                      fontSize: isMobile ? 12 : 11,
                      color: "#6b7280",
                      margin: "0 0 5px",
                      lineHeight: 1.45,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {n.message}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "#c4c4d4",
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexShrink: 0,
                  }}
                >
                  {!n.read && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#6366f1",
                        marginBottom: 4,
                        marginTop: 2,
                        boxShadow: "0 0 0 2px rgba(99,102,241,0.2)",
                      }}
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n._id);
                    }}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#c4c4d4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.14s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#c4c4d4";
                    }}
                  >
                    <FiX size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null); // sirf bell button ka ref
  const dropRef = useRef(null); // desktop dropdown ka ref
  const isMobile = useIsMobile();

  // Desktop dropdown position
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotificationStore();

  const { socket } = useSocketStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNew = (n) => addNotification(n);
    socket.on("new_notification", onNew);
    return () => socket.off("new_notification", onNew);
  }, [socket]);

  // Desktop: dropdown position calculate karo bell button ke relative
  useEffect(() => {
    if (!isMobile && open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + window.scrollY + 10,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open, isMobile]);

  // Desktop: click outside close
  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        dropRef.current &&
        !dropRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile]);

  // Mobile: scroll lock
  useEffect(() => {
    document.body.style.overflow = isMobile && open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, open]);

  const handleItemClick = (n) => {
    setOpen(false);
    if (!n.read) markAsRead(n._id);
    if (n.orderId) {
      const isAdmin = ["new_order", "customer_cancelled"].includes(n.type);
      navigate(isAdmin ? "/admin/orders" : `/orders/${n.orderId}`);
    } else if (n.reviewId) {
      navigate("/admin/reviews");
    }
  };

  const listProps = {
    notifications,
    loading,
    unreadCount,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    onItemClick: handleItemClick,
    onClose: () => setOpen(false),
    isMobile,
  };

  return (
    <>
      {/* ── Bell button — simple div, koi position nahi ── */}
      <div ref={btnRef} style={{ display: "inline-flex" }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            position: "relative",
            width: 38,
            height: 38,
            borderRadius: 12,
            border: open ? "1.5px solid #a5b4fc" : "1.5px solid #ebebf5",
            background: open ? "#eef2ff" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.16s ease",
            boxShadow: open
              ? "0 0 0 3px rgba(99,102,241,0.1)"
              : "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <FiBell size={17} color={open ? "#6366f1" : "#6b7280"} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="nb-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 99,
                  background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  border: "2px solid #fff",
                  boxShadow: "0 2px 6px rgba(239,68,68,0.4)",
                  pointerEvents: "none",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Desktop dropdown — portal se body mein render ──
          Header ke stacking context se bilkul bahar.
          Position: fixed, scroll ke saath nahi hilta.
      */}
      {!isMobile &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dropRef}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "fixed",
                  top: dropPos.top,
                  right: dropPos.right,
                  width: 340,
                  maxHeight: 480,
                  background: "#fff",
                  borderRadius: 18,
                  border: "1.5px solid #ebebf5",
                  boxShadow:
                    "0 16px 48px rgba(99,102,241,0.14), 0 4px 16px rgba(0,0,0,0.08)",
                  zIndex: 99999,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <NotificationList {...listProps} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {isMobile &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(15,14,26,0.45)",
                    backdropFilter: "blur(4px)",
                    zIndex: 99998,
                  }}
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                  style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "75vh",
                    background: "#fff",
                    borderRadius: "20px 20px 0 0",
                    zIndex: 99999,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 -8px 40px rgba(99,102,241,0.16)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: 10,
                      paddingBottom: 4,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 4,
                        borderRadius: 99,
                        background: "#e2e2f0",
                      }}
                    />
                  </div>
                  <NotificationList {...listProps} />
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

export default NotificationBell;
