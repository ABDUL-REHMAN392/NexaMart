import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";
import { api } from "../api/api";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FiMapPin, FiAlertCircle, FiPackage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  calcDeliveryFee,
  calcCartWeight,
  DELIVERY_TIERS,
} from "../config/deliveryConfig";

const FREE_DELIVERY_ABOVE_KG = null; 

function SkeletonField() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        className="skel"
        style={{ height: 11, width: "35%", borderRadius: 6 }}
      />
      <div className="skel" style={{ height: 42, borderRadius: 12 }} />
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  required,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: focused ? "#6366f1" : "#9ca3af",
          transition: "color 0.18s",
        }}
      >
        {label}
        {required && <span style={{ color: "#f87171", marginLeft: 2 }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          outline: "none",
          padding: "11px 14px",
          borderRadius: 12,
          border: `1.5px solid ${error ? "#fca5a5" : focused ? "#a5b4fc" : "#ebebf5"}`,
          background: error ? "#fff8f8" : focused ? "#fafafe" : "#f8f8fc",
          color: "#1e1b4b",
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.18s ease",
          boxSizing: "border-box",
          width: "100%",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "text",
        }}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: 12,
              color: "#f87171",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <FiAlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddressForm({ address, setAddress, errors, addressLoading }) {
  const fields = [
    {
      key: "formatted",
      label: "Full Address",
      placeholder: "House 123, Street 4, Block A",
      required: true,
    },
    { key: "street", label: "Street", placeholder: "Street name" },
    { key: "city", label: "City", placeholder: "Karachi", required: true },
    { key: "state", label: "State / Province", placeholder: "Sindh" },
    {
      key: "country",
      label: "Country",
      placeholder: "Pakistan",
      required: true,
    },
    { key: "postalCode", label: "Postal Code", placeholder: "75500" },
  ];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px",
        border: "1.5px solid #ebebf5",
        boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg,#ede9fe,#e0e7ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiMapPin size={15} color="#6366f1" />
        </div>
        <h2
          style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b", margin: 0 }}
        >
          Delivery Address
        </h2>
      </div>
      <div className="addr-grid">
        {addressLoading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className={i === 0 ? "addr-full" : ""}>
                <SkeletonField />
              </div>
            ))
          : fields.map(({ key, label, placeholder, required }) => (
              <div key={key} className={key === "formatted" ? "addr-full" : ""}>
                <InputField
                  label={label}
                  value={address[key]}
                  onChange={(e) =>
                    setAddress({ ...address, [key]: e.target.value })
                  }
                  placeholder={placeholder}
                  error={errors[key]}
                  disabled={addressLoading}
                  required={required}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

// ── Weight badge component ──────────────────────────────────
function DeliveryBadge({ totalWeightKg, deliveryFee }) {
  const tier =
    DELIVERY_TIERS.find((t) => totalWeightKg <= t.maxKg) ||
    DELIVERY_TIERS[DELIVERY_TIERS.length - 1];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#f5f3ff",
        border: "1.5px solid #e0e7ff",
        borderRadius: 12,
        padding: "10px 14px",
        marginBottom: 4,
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FiPackage size={13} color="#6366f1" />
        <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>
          {tier.label}
        </span>
      </div>
      <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
        Total weight:{" "}
        <strong style={{ color: "#1e1b4b" }}>
          {totalWeightKg.toFixed(2)} kg
        </strong>
      </span>
    </div>
  );
}

function OrderSummary({
  items,
  itemsTotal,
  deliveryFee,
  totalAmount,
  totalWeightKg,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "20px",
        border: "1.5px solid #ebebf5",
        boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#1e1b4b",
          margin: "0 0 18px",
        }}
      >
        Order Summary
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxHeight: 200,
          overflowY: "auto",
          marginBottom: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.productId}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                overflow: "hidden",
                border: "1.5px solid #ebebf5",
                background: "#f8f8fc",
                flexShrink: 0,
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/44x44?text=?";
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1e1b4b",
                  margin: "0 0 2px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.title}
              </p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                x{item.quantity}
                {item.weight ? (
                  <span style={{ marginLeft: 8 }}>{item.weight} kg each</span>
                ) : null}
              </p>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                whiteSpace: "nowrap",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Weight delivery badge */}
      <DeliveryBadge totalWeightKg={totalWeightKg} deliveryFee={deliveryFee} />

      <div
        style={{
          borderTop: "1.5px solid #ebebf5",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          <span>Items Total</span>
          <span style={{ fontWeight: 600 }}>${itemsTotal.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          <span>Delivery Fee</span>
          <span style={{ fontWeight: 700 }}>
            {deliveryFee === 0 ? "🎉 FREE" : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1.5px solid #ebebf5",
            paddingTop: 12,
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>
            Total
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            ${totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Checkout() {
  const navigate = useNavigate();
  const {
    items,
    isLoading: cartLoading,
    fetchCart,
    resetCart,
  } = useCartStore();

  const [address, setAddress] = useState({
    formatted: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [addressLoading, setAddressLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);

  // ── Weight-based delivery ──────────────────────
  const totalWeightKg = calcCartWeight(items);
  const deliveryFee = calcDeliveryFee(totalWeightKg);
  const itemsTotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalAmount = itemsTotal + deliveryFee;

  useEffect(() => {
    fetchCart();
  }, []); // eslint-disable-line

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/address");
        if (res.data?.savedAddress?.city) setAddress(res.data.savedAddress);
      } catch {
      } finally {
        setAddressLoading(false);
      }
    })();
  }, []);

  const validateAddress = () => {
    const errs = {};
    if (!address.formatted.trim()) errs.formatted = "Full address is required";
    if (!address.city.trim()) errs.city = "City is required";
    if (!address.country.trim()) errs.country = "Country is required";
    return errs;
  };

  const handlePlaceOrder = async () => {
    const errs = validateAddress();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsPlacing(true);
    try {
      await api.put("/users/address", address);
      const res = await api.post("/orders");
      resetCart();
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      throw new Error(err.message || "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  if (cartLoading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes shimmer { 0%{background-position:-700px 0} 100%{background-position:700px 0} }
          .skel { background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%); background-size:700px 100%; animation:shimmer 1.4s infinite; border-radius:10px; display:block; }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "3px solid #ebebf5",
                borderTopColor: "#6366f1",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <p style={{ color: "#9ca3af", fontSize: 14 }}>
              Loading your cart...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background:
            "linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)",
          fontFamily: "'DM Sans', sans-serif",
          padding: "0 16px",
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
            fontSize: 36,
          }}
        >
          🛒
        </div>
        <p style={{ color: "#1e1b4b", fontWeight: 700, fontSize: 17 }}>
          Your cart is empty
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            padding: "11px 32px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 18px rgba(99,102,241,0.3)",
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes shimmer { 0%{background-position:-700px 0} 100%{background-position:700px 0} }
        .skel { background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%); background-size:700px 100%; animation:shimmer 1.4s infinite; border-radius:10px; display:block; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .place-btn { transition: all 0.2s ease; }
        .place-btn:hover:not(:disabled) { box-shadow: 0 12px 32px rgba(99,102,241,0.4) !important; transform: translateY(-1px); }
        .addr-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .addr-full { grid-column: span 2; }
        .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; align-items: start; }
        @media (max-width: 768px) { .checkout-layout { grid-template-columns: 1fr; } .addr-grid { grid-template-columns: 1fr; } .addr-full { grid-column: span 1; } }
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
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "40px 0 28px" }}
          >
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#1e1b4b",
                margin: 0,
              }}
            >
              <span
                style={{ color: "#6366f1", fontFamily: "'Pacifico', cursive" }}
              >
                Checkout
              </span>
            </h1>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: "6px 0 0" }}>
              Review your order and complete your purchase
            </p>
          </motion.div>

          <div className="checkout-layout">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AddressForm
                address={address}
                setAddress={setAddress}
                errors={errors}
                addressLoading={addressLoading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <OrderSummary
                items={items}
                itemsTotal={itemsTotal}
                deliveryFee={deliveryFee}
                totalAmount={totalAmount}
                totalWeightKg={totalWeightKg}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  borderRadius: 16,
                  padding: "14px 18px",
                  border: "1.5px solid #bbf7d0",
                  boxShadow: "0 2px 10px rgba(22,163,74,0.08)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FaMoneyBillAlt size={17} color="#16a34a" />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1e1b4b",
                      margin: "0 0 2px",
                    }}
                  >
                    Cash on Delivery
                  </p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                    Pay when your order arrives
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="place-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  width: "100%",
                  padding: "14px",
                  background: isPlacing
                    ? "linear-gradient(135deg,#a5b4fc,#c4b5fd)"
                    : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  cursor: isPlacing ? "not-allowed" : "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 6px 22px rgba(99,102,241,0.3)",
                }}
              >
                {isPlacing ? (
                  <>
                    <svg
                      style={{
                        animation: "spin 1s linear infinite",
                        width: 16,
                        height: 16,
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 2a10 10 0 0110 10"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>{" "}
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CiDeliveryTruck size={20} /> Place Order
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
