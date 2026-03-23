import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { GoArrowLeft } from "react-icons/go";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { IoBagCheckOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    items,
    updateQuantity,
    removeFromCart,
    updateGuestQuantity,
    removeFromGuestCart,
  } = useCartStore();

  const totalPrice = items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0,
  );

  const handleIncrease = async (item) => {
    if (item.quantity >= 10) {
      toast.warning("Maximum quantity reached");
      return;
    }
    try {
      if (!isAuthenticated) {
        updateGuestQuantity(item.productId, item.quantity + 1);
      } else {
        await updateQuantity(item.productId, item.quantity + 1);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;
    try {
      if (!isAuthenticated) {
        updateGuestQuantity(item.productId, item.quantity - 1);
      } else {
        await updateQuantity(item.productId, item.quantity - 1);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update");
    }
  };

  const handleDelete = async (productId) => {
    try {
      if (!isAuthenticated) {
        removeFromGuestCart(productId);
      } else {
        await removeFromCart(productId);
      }
      toast.success("Removed from cart");
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    }
  };

  const handleBuyNow = () => {
    if (items.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html, body { overflow-x: hidden !important; max-width: 100vw !important; }

        .cart-card { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .cart-card:hover { box-shadow: 0 8px 28px rgba(99,102,241,0.13) !important; transform: translateY(-1px); }
        .qty-btn { transition: all 0.15s ease; }
        .qty-btn:hover { background: linear-gradient(135deg,#6366f1,#8b5cf6) !important; color: #fff !important; border-color: transparent !important; }
        .del-btn { transition: all 0.15s ease; }
        .del-btn:hover { background: #fff0f0 !important; color: #f87171 !important; border-color: #fca5a5 !important; }
        .checkout-btn { transition: all 0.2s ease; }
        .checkout-btn:hover:not(:disabled) { box-shadow: 0 10px 30px rgba(99,102,241,0.35) !important; transform: translateY(-1px); }
        .continue-btn { transition: all 0.15s ease; }
        .continue-btn:hover { border-color: #6366f1 !important; color: #6366f1 !important; background: #f5f3ff !important; }

        .cart-bottom-bar {
          display: flex; align-items: center; justify-content: space-between;
          background: #fff; border-radius: 18px; padding: 16px 20px;
          margin-top: 8px; border: 1.5px solid #ebebf5;
          box-shadow: 0 4px 20px rgba(99,102,241,0.09); gap: 12px;
        }
        .cart-bottom-right { display: flex; align-items: center; gap: 20px; }

        @media (max-width: 480px) {
          .cart-bottom-bar { flex-direction: column; align-items: stretch; padding: 14px 16px; gap: 14px; }
          .cart-bottom-right { flex-direction: row; justify-content: space-between; width: 100%; }
          .continue-btn-wrap { width: 100%; }
          .continue-btn { width: 100%; justify-content: center !important; }
          .checkout-btn { flex: 1; }
          .cart-item-title { font-size: 13px !important; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)",
          fontFamily: "'DM Sans', sans-serif",
          padding: "0 12px 60px",
          overflowX: "hidden",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", width: "100%" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "40px 0 28px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <FiShoppingBag size={22} color="#6366f1" />
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color: "#1e1b4b",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Items in{" "}
                <span
                  style={{
                    color: "#6366f1",
                    fontFamily: "'Pacifico', cursive",
                  }}
                >
                  Your Cart
                </span>
              </h1>
            </div>
            {items.length > 0 && (
              <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            )}
          </motion.div>

          {/* Empty */}
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "#fff",
                borderRadius: 24,
                border: "1.5px solid #ebebf5",
                boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#ede9fe,#e0e7ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 36,
                }}
              >
                <HiOutlineShoppingCart />
              </div>
              <p
                style={{
                  color: "#1e1b4b",
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Your cart is empty
              </p>
              <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 28 }}>
                Add some products to get started
              </p>
              <NavLink
                to="/"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  padding: "11px 32px",
                  borderRadius: 12,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: "0 4px 18px rgba(99,102,241,0.3)",
                }}
              >
                Continue Shopping
              </NavLink>
            </motion.div>
          )}

          {/* Items */}
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  x: -40,
                  height: 0,
                  marginBottom: 0,
                  transition: { duration: 0.24 },
                }}
                transition={{
                  delay: i * 0.05,
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="cart-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  borderRadius: 18,
                  padding: "12px 14px",
                  marginBottom: 12,
                  border: "1.5px solid #ebebf5",
                  boxShadow: "0 2px 12px rgba(99,102,241,0.07)",
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                {/* Image */}
                <NavLink
                  to={`/product/${item.productId}`}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1.5px solid #ebebf5",
                    background: "#f8f8fc",
                    flexShrink: 0,
                    display: "block",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/64x64?text=?";
                    }}
                  />
                </NavLink>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    className="cart-item-title"
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#1e1b4b",
                      margin: "0 0 4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h2>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                    {item.quantity > 1 && (
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#9ca3af",
                          WebkitTextFillColor: "#9ca3af",
                          marginLeft: 6,
                        }}
                      >
                        ${item.price.toFixed(2)} each
                      </span>
                    )}
                  </span>

                  {/* Qty controls */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      onClick={() => handleDecrease(item)}
                      className="qty-btn"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: "1.5px solid #ebebf5",
                        background: "#f8f8fc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                        color: item.quantity <= 1 ? "#d1d5db" : "#6b7280",
                      }}
                    >
                      <FiMinus size={12} />
                    </button>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1e1b4b",
                        minWidth: 22,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item)}
                      className="qty-btn"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: "1.5px solid #ebebf5",
                        background: "#f8f8fc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#6b7280",
                      }}
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.productId)}
                  className="del-btn"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "1.5px solid #ebebf5",
                    background: "#f8f8fc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#9ca3af",
                    flexShrink: 0,
                  }}
                >
                  <FiTrash2 size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Bottom bar */}
          {items.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="cart-bottom-bar"
            >
              <div className="continue-btn-wrap">
                <NavLink
                  to="/"
                  className="continue-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    border: "1.5px solid #ebebf5",
                    background: "#f8f8fc",
                    padding: "9px 16px",
                    borderRadius: 11,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6b7280",
                  }}
                >
                  <GoArrowLeft size={15} /> Continue Shopping
                </NavLink>
              </div>
              <div className="cart-bottom-right">
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      margin: "0 0 2px",
                      fontWeight: 500,
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      margin: 0,
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ${totalPrice.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleBuyNow}
                  className="checkout-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    color: "#fff",
                    padding: "11px 22px",
                    borderRadius: 13,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 6px 22px rgba(99,102,241,0.28)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <IoBagCheckOutline size={17} /> Checkout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
