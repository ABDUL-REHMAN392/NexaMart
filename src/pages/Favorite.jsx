import { useState } from 'react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { FaTrash } from 'react-icons/fa';
import { FiShoppingCart, FiHeart, FiTrash2, FiCheck, FiAlertCircle,FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

// ── Skeleton Card ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden',
      background: '#fff',
      border: '1.5px solid #ebebf5',
      boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
      width: '100%', minWidth: 0, boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', paddingTop: '70%', position: 'relative' }}>
        <div className="skel" style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div className="skel" style={{ height: 12, borderRadius: 6, marginBottom: 8, width: '80%' }} />
        <div className="skel" style={{ height: 10, borderRadius: 6, marginBottom: 12, width: '45%' }} />
        <div className="skel" style={{ height: 14, borderRadius: 6, width: '35%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <div className="skel" style={{ flex: 1, height: 36, borderRadius: 10 }} />
          <div className="skel" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ── Clear Confirm Modal ────────────────────────────────────────────────────────
function ClearConfirmModal({ onConfirm, onCancel, isClearing, itemCount }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(30,27,75,0.35)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 22,
          padding: '36px 32px',
          maxWidth: 368,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(99,102,241,0.18), 0 4px 16px rgba(0,0,0,0.08)',
          border: '1.5px solid #ebebf5',
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 18 }}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg,#fff1f2,#ffe4e4)',
            border: '1.5px solid #fecaca',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <FiTrash2 size={26} color="#ef4444" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{
            fontSize: 18, fontWeight: 800, color: '#1e1b4b',
            margin: '0 0 8px', letterSpacing: '-0.02em',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Clear All Favorites?
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            fontSize: 13.5, color: '#6b7280',
            margin: '0 0 28px', lineHeight: 1.65,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          You're about to remove{' '}
          <span style={{ fontWeight: 700, color: '#1e1b4b' }}>
            {itemCount} saved item{itemCount !== 1 ? 's' : ''}
          </span>
          . This action cannot be undone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          style={{ display: 'flex', gap: 10 }}
        >
          <button
            onClick={onCancel}
            disabled={isClearing}
            className="modal-cancel-btn"
            style={{
              flex: 1, height: 44, borderRadius: 12,
              border: '1.5px solid #ebebf5', background: '#f8f8fc',
              color: '#6b7280', fontSize: 13.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.18s ease',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isClearing}
            className="modal-confirm-btn"
            style={{
              flex: 1, height: 44, borderRadius: 12,
              background: isClearing
                ? '#f87171'
                : 'linear-gradient(135deg,#ef4444,#dc2626)',
              color: '#fff', fontSize: 13.5, fontWeight: 700,
              border: 'none',
              cursor: isClearing ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: isClearing ? 'none' : '0 4px 18px rgba(239,68,68,0.32)',
              opacity: isClearing ? 0.75 : 1,
              transition: 'all 0.18s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 7,
            }}
          >
            {isClearing ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: 14 }}
                >
                  ⟳
                </motion.span>
                Clearing...
              </>
            ) : (
              <>
                <FiTrash2 size={14} />
                Yes, Clear All
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Inline Feedback Banner ─────────────────────────────────────────────────────
function InlineFeedback({ type, message }) {
  const isSuccess = type === 'success';
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 10px', borderRadius: 9, marginBottom: 8,
        background: isSuccess ? '#f0fdf4' : '#fff1f2',
        border: `1.5px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`,
      }}
    >
      {isSuccess
        ? <FiCheck size={13} color="#22c55e" strokeWidth={2.5} />
        : <FiAlertCircle size={13} color="#ef4444" />
      }
      <span style={{
        fontSize: 11.5, fontWeight: 600,
        color: isSuccess ? '#15803d' : '#dc2626',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {message}
      </span>
    </motion.div>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────────
function FavCard({ item, onAddToCart, onRemove, index }) {

  // feedback: null | { type: 'success'|'error', message: string, action: 'cart'|'remove' }
  const [cartState, setCartState] = useState("idle");
const [cartError, setCartError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

const Spinner = (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    style={{
      width: 14,
      height: 14,
      border: "2px solid rgba(255,255,255,0.5)",
      borderTop: "2px solid white",
      borderRadius: "50%",
    }}
  />
);
  const BTNS = {
  idle: {
    label: "Add to Cart",
    Icon: <FiShoppingCart size={13} />,
    bg: "#6366f1",
  },
  loading: {
  label: "Adding...",
  Icon: Spinner,
  bg: "#818cf8",
},
  success: {
    label: "Added!",
    Icon: <FiCheck size={13} strokeWidth={2.5} />,
    bg: "#22c55e",
  },
  error: {
    label: cartError || "Maximum quantity reached",
    Icon: <FiX size={13} />,
    bg: "#ef4444",
  },
};

const B = BTNS[cartState];
  const showFeedback = (type, message, action) => {
    setFeedback({ type, message, action });
    // Auto-clear after 2.2s (for non-remove actions)
    if (action !== 'remove') {
      setTimeout(() => setFeedback(null), 2200);
    }
  };

const handleCart = async () => {
  if (cartState !== "idle") return;

  setCartState("loading");

  try {
    await onAddToCart(item);
    setCartState("success");
    setTimeout(() => setCartState("idle"), 2200);
  } catch (err) {
    setCartError(err?.message || "Failed");
    setCartState("error");
    setTimeout(() => setCartState("idle"), 2800);
  }
};
  const handleRemove = async () => {
    setRemoveLoading(true);
    setFeedback(null);
    try {
      await onRemove(item);
      // No feedback needed — card animates out
    } catch (err) {
      showFeedback('error', err?.message || 'Failed to remove', 'remove');
      setRemoveLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.22 } }}
      transition={{ delay: index * 0.06, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="fav-card"
      style={{
        borderRadius: 18, overflow: 'hidden',
        background: '#fff',
        border: '1.5px solid #ebebf5',
        boxShadow: '0 2px 12px rgba(99,102,241,0.07)',
        display: 'flex', flexDirection: 'column',
        width: '100%', minWidth: 0, boxSizing: 'border-box',
      }}
    >
      {/* Image */}
      <NavLink
        to={`/product/${item.productId}`}
        style={{ display: 'block', position: 'relative', overflow: 'hidden', paddingTop: '72%', background: '#f8f8fc' }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.35s ease',
          }}
          className="card-img"
          onError={e => { e.target.src = 'https://placehold.co/300x220?text=?'; }}
        />
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 30, height: 30, borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <FiHeart size={13} color="#6366f1" fill="#6366f1" />
        </div>
      </NavLink>

      {/* Info */}
      <div style={{ padding: '12px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {item.brand && (
          <p style={{
            fontSize: 10, color: '#9ca3af', margin: '0 0 4px',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{item.brand}</p>
        )}
        <NavLink to={`/product/${item.productId}`} style={{ textDecoration: 'none', flex: 1 }}>
          <h2 style={{
            fontSize: 12.5, fontWeight: 700, color: '#1e1b4b',
            margin: '0 0 8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            wordBreak: 'break-word',
          }}>{item.title}</h2>
        </NavLink>
        <span style={{
          fontSize: 15, fontWeight: 800,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          display: 'block', marginBottom: 10,
        }}>${item.price?.toFixed(2)}</span>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
       <motion.button
  onClick={handleCart}
  disabled={cartState === "loading" || removeLoading}
  whileTap={cartState === "idle" ? { scale: 0.96 } : {}}
  style={{
    flex: 1,
    height: 34,
    borderRadius: 10,
    border: "none",
    background: B.bg,
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    cursor: cartState === "loading" ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.2s ease",
    boxShadow: `0 4px 14px ${B.bg}55`,
    overflow: "hidden",
    minWidth: 0,
  }}
>
  <AnimatePresence mode="wait">
    <motion.span
      key={cartState}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      style={{ display: "flex", alignItems: "center", gap: 5 }}
    >
      {B.Icon}
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 120,
        }}
      >
        {B.label}
      </span>
    </motion.span>
  </AnimatePresence>
</motion.button>

          <button
            onClick={handleRemove}
            disabled={removeLoading}
            className="remove-btn"
            style={{
              width: 34, height: 34, flexShrink: 0, borderRadius: 10,
              border: '1.5px solid #ebebf5', background: '#f8f8fc',
              color: removeLoading ? '#fca5a5' : '#6b7280',
              cursor: removeLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s ease',
            }}
          >
            {removeLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', fontSize: 13 }}
              >⟳</motion.span>
            ) : (
              <FaTrash size={12} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
function Favorite() {
  const { isAuthenticated } = useAuthStore();
  const { items, toggleFavorite, clearFavorites, isLoading, isClearing } = useFavoriteStore();
  const { addToCart } = useCartStore();
  const [showClearModal, setShowClearModal] = useState(false);

  const handleRemove = async (item) => {
    await toggleFavorite({ productId: item.productId });
  };

  const handleClearAll = async () => {
    try {
      await clearFavorites();
    } finally {
      setShowClearModal(false);
    }
  };

  const handleAddToCart = async (item) => {
    await addToCart({
      productId: item.productId, title: item.title,
      price: item.price, image: item.image,
      brand: item.brand || '', category: item.category || '',
      rating: item.rating || 0,
    });
  };

  /* ── Not Authenticated ── */
  if (!isAuthenticated) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{
          minHeight: '80vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 50%,#f5f0ff 100%)',
          padding: '0 16px',
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg,#ede9fe,#e0e7ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 32,
            }}><FaRegHeart /></div>
            <p style={{ color: '#6b7280', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Sign in to see your favorites</p>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 24 }}>Save products you love and find them anytime</p>
            <NavLink to="/login" style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', padding: '11px 32px', borderRadius: 12,
              textDecoration: 'none', fontSize: 14, fontWeight: 700,
              boxShadow: '0 4px 18px rgba(99,102,241,0.3)',
            }}>Sign In</NavLink>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden !important; max-width: 100vw !important; }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skel {
          background: linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%) !important;
          background-size: 800px 100% !important;
          animation: shimmer 1.4s infinite;
        }
        .fav-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .fav-card:hover {
          box-shadow: 0 12px 36px rgba(99,102,241,0.14) !important;
          transform: translateY(-3px);
        }
        .fav-card:hover .card-img { transform: scale(1.05); }
        .cart-btn:hover:not(:disabled) {
          background: linear-gradient(135deg,#6366f1,#8b5cf6) !important;
          color: #fff !important;
          border-color: transparent !important;
        }
        .remove-btn:hover:not(:disabled) {
          background: #fff0f0 !important;
          color: #f87171 !important;
          border-color: #fca5a5 !important;
        }
        .clear-all-btn { transition: all 0.18s ease; }
        .clear-all-btn:hover {
          background: #fff0f0 !important;
          color: #f87171 !important;
          border-color: #fca5a5 !important;
        }
        .modal-cancel-btn:hover:not(:disabled) {
          background: #f1f1f9 !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
        }
        .modal-confirm-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(239,68,68,0.4) !important;
        }

        .fav-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }
        .fav-grid > * { min-width: 0; }

        @media (min-width: 640px) {
          .fav-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }
        }
        @media (max-width: 360px) {
          .fav-grid { gap: 8px; }
        }

        .fav-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 36px 0 28px;
        }
        @media (max-width: 400px) {
          .fav-header { flex-direction: column; align-items: flex-start; gap: 12px; padding: 24px 0 20px; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '0 8px 60px',
        overflowX: 'hidden',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            className="fav-header"
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                <FiHeart size={20} color="#6366f1" />
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.01em' }}>
                  Your <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Favorites</span>
                </h1>
              </div>
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                {isLoading ? 'Loading...' : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {!isLoading && items.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => setShowClearModal(true)}
                disabled={isClearing}
                className="clear-all-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10,
                  border: '1.5px solid #ebebf5', background: '#fff',
                  color: '#9ca3af', fontSize: 12, fontWeight: 600,
                  cursor: isClearing ? 'not-allowed' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: isClearing ? 0.6 : 1,
                  flexShrink: 0,
                }}
              >
                <FiTrash2 size={13} />
                {isClearing ? 'Clearing...' : 'Clear All'}
              </motion.button>
            )}
          </motion.div>

          {/* Skeleton */}
          {isLoading && (
            <div className="fav-grid">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!isLoading && items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center', padding: '64px 24px', borderRadius: 24,
                background: '#fff', border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg,#ede9fe,#e0e7ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 36,
              }}><FaRegHeart /></div>
              <p style={{ color: '#1e1b4b', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Nothing saved yet</p>
              <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 28 }}>Heart products you love and they'll appear here</p>
              <NavLink to="/" style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', padding: '11px 32px', borderRadius: 12,
                textDecoration: 'none', fontSize: 14, fontWeight: 700,
                boxShadow: '0 4px 18px rgba(99,102,241,0.3)',
              }}>Browse Products</NavLink>
            </motion.div>
          )}

          {/* Cards Grid */}
          <AnimatePresence>
            {!isLoading && items.length > 0 && (
              <div className="fav-grid">
                {items.map((item, i) => (
                  <FavCard
                    key={item.productId}
                    item={item}
                    index={i}
                    onAddToCart={handleAddToCart}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Clear Confirm Modal */}
      <AnimatePresence>
        {showClearModal && (
          <ClearConfirmModal
            onConfirm={handleClearAll}
            onCancel={() => setShowClearModal(false)}
            isClearing={isClearing}
            itemCount={items.length}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Favorite;