import ShowStarRating from "./ShowStarRating";
import { FaHeart } from "react-icons/fa";
import { FiShoppingCart, FiCheck, FiX, FiHeart } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useFavoriteStore } from "../store/useFavoriteStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Skeleton ───────────────────────────────────────────────────────────── */
function ShowItemSkeleton() {
  return (
    <>
      <style>{`
        @keyframes si-sh{0%{background-position:-500px 0}100%{background-position:500px 0}}
        .si-sk{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:500px 100%;animation:si-sh 1.4s infinite;border-radius:8px;display:block;}
      `}</style>
      <div
        style={{
          width: "100%",
          minWidth: 0,
          borderRadius: 22,
          overflow: "hidden",
          background: "#fff",
          border: "1.5px solid #ebebf5",
          boxShadow: "0 2px 16px rgba(99,102,241,0.07)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", width: "100%", paddingTop: "75%" }}>
          <div
            className="si-sk"
            style={{ position: "absolute", inset: 0, borderRadius: 0 }}
          />
        </div>
        <div
          style={{
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            className="si-sk"
            style={{ height: 10, width: "35%", borderRadius: 6 }}
          />
          <div className="si-sk" style={{ height: 12, width: "85%" }} />
          <div className="si-sk" style={{ height: 12, width: "60%" }} />
          <div className="si-sk" style={{ height: 10, width: "40%" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <div
              className="si-sk"
              style={{ height: 18, width: 60, borderRadius: 20 }}
            />
          </div>
          <div
            className="si-sk"
            style={{
              height: 38,
              width: "100%",
              borderRadius: 14,
              marginTop: 4,
            }}
          />
        </div>
      </div>
    </>
  );
}

/* ── Main ShowItem ──────────────────────────────────────────────────────── */
function ShowItem({
  id,
  image,
  title,
  rating,
  price,
  finalPrice,
  brand,
  category,
  weight,
  isLoading,
}) {
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { toggleFavorite, isFavorited } = useFavoriteStore();
  const navigate = useNavigate();

  const [cartState, setCartState] = useState("idle");
  const [cartError, setCartError] = useState("");
  const [favLoading, setFavLoad] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (isLoading) return <ShowItemSkeleton />;

  const favorited = isFavorited(id);
  const discount =
    price && finalPrice
      ? Math.round(((price - finalPrice) / price) * 100)
      : null;

  const handleCart = async () => {
    if (cartState !== "idle") return;
    setCartState("loading");

    const product = {
      productId: id,
      title,
      price: finalPrice,
      image,
      brand: brand || "",
      category: category || "",
      rating: rating || 0,
      weight: weight || 0, // kg — delivery fee ke liye
      quantity: 1,
    };

    try {
      // isAuthenticated pass karo:
      // true  → backend API
      // false → localStorage (guest mode)
      await addToCart(product, isAuthenticated);
      setCartState("success");
      setTimeout(() => setCartState("idle"), 2200);
    } catch (err) {
      setCartError(err?.response?.data?.message || err.message || "Failed");
      setCartState("error");
      setTimeout(() => setCartState("idle"), 2800);
    }
  };

  const handleFav = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (favLoading) return;
    setFavLoad(true);
    try {
      await toggleFavorite({
        productId: id,
        title,
        price: finalPrice,
        image,
        brand: brand || "",
        category: category || "",
        rating: rating || 0,
      });
    } catch {
    } finally {
      setFavLoad(false);
    }
  };

  const BTNS = {
    idle: {
      label: "Add to Cart",
      Icon: <FiShoppingCart size={14} />,
      bg: "#6366f1",
      shine: true,
    },
    loading: {
      label: "Adding…",
      Icon: <Spinner />,
      bg: "#818cf8",
      shine: false,
    },
    success: {
      label: "Added!",
      Icon: <FiCheck size={14} strokeWidth={2.5} />,
      bg: "#22c55e",
      shine: true,
    },
    error: {
      label: cartError || "!",
      Icon: <FiX size={14} />,
      bg: "#ef4444",
      shine: false,
    },
  };
  const B = BTNS[cartState];

  return (
    <>
      <style>{`
        @keyframes si-spin { to { transform: rotate(360deg) } }
        .si-card { transition: transform 0.3s ease, box-shadow 0.3s ease; width:100%; min-width:0; box-sizing:border-box; }
        .si-card:hover { transform: translateY(-6px); }
        .si-img-wrap img { transition: transform 0.55s ease; }
        .si-card:hover .si-img-wrap img { transform: scale(1.09); }
        .si-cta { transition: filter 0.18s, transform 0.18s; }
        .si-cta:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
        .si-cta:active:not(:disabled) { transform: translateY(0); }
        .si-fav { transition: transform 0.18s, box-shadow 0.18s; }
        .si-fav:hover { transform: scale(1.14); }
        .fs-scroll, .bsp-scroll, .na-scroll { padding-top: 8px; padding-bottom: 12px; }
      `}</style>

      <motion.div
        className="si-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          minWidth: 0,
          borderRadius: 22,
          overflow: "hidden",
          background: "#fff",
          border: `1.5px solid ${hovered ? "#c7d2fe" : "#ebebf5"}`,
          boxShadow: hovered
            ? "0 24px 56px rgba(99,102,241,0.18)"
            : "0 4px 20px rgba(99,102,241,0.08)",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          boxSizing: "border-box",
        }}
      >
        {/* Image */}
        <NavLink
          to={`/product/${id}`}
          className="si-img-wrap"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            paddingTop: "75%",
            background: "linear-gradient(145deg,#f5f5fc,#eeeef8)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.target.src = "https://placehold.co/220x165?text=?";
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to top,rgba(15,10,50,0.28) 0%,transparent 55%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
          {discount > 0 && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "linear-gradient(135deg,#ef4444,#f97316)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 20,
                boxShadow: "0 3px 10px rgba(239,68,68,0.4)",
                letterSpacing: "0.2px",
              }}
            >
              -{discount}%
            </div>
          )}
          <motion.button
            onClick={handleFav}
            disabled={favLoading}
            className="si-fav"
            animate={{
              scale: hovered || favorited ? 1 : 0.78,
              opacity: hovered || favorited ? 1 : 0.55,
            }}
            whileTap={{ scale: 0.86 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: favorited
                ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                : "rgba(255,255,255,0.94)",
              border: favorited ? "none" : "1.5px solid rgba(210,210,230,0.8)",
              backdropFilter: "blur(10px)",
              boxShadow: favorited
                ? "0 4px 14px rgba(99,102,241,0.45)"
                : "0 2px 8px rgba(0,0,0,0.12)",
              cursor: favLoading ? "wait" : "pointer",
            }}
          >
            <AnimatePresence mode="wait">
              {favorited ? (
                <motion.span
                  key="f"
                  initial={{ scale: 0.3, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 16 }}
                >
                  <FaHeart size={12} color="#fff" />
                </motion.span>
              ) : (
                <motion.span
                  key="o"
                  initial={{ scale: 0.3 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.3 }}
                  transition={{ duration: 0.16 }}
                >
                  <FiHeart size={13} color={hovered ? "#6366f1" : "#94a3b8"} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </NavLink>

        {/* Info */}
        <div
          style={{
            padding: "10px 12px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 5,
            flex: 1,
          }}
        >
          {brand && (
            <span
              style={{
                display: "inline-block",
                fontSize: 9,
                fontWeight: 700,
                color: "#8b5cf6",
                background: "#f5f3ff",
                border: "1px solid #ede9fe",
                padding: "2px 7px",
                borderRadius: 20,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                width: "fit-content",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {brand}
            </span>
          )}
          <NavLink to={`/product/${id}`} style={{ textDecoration: "none" }}>
            <p
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                lineHeight: 1.4,
                color: hovered ? "#4f46e5" : "#1e1b4b",
                transition: "color 0.18s",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: 35,
                margin: 0,
                wordBreak: "break-word",
              }}
            >
              {title}
            </p>
          </NavLink>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <ShowStarRating rating={rating} />
            <span
              className="hidden md:inline"
              style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}
            >
              ({rating})
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              marginTop: 2,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 17,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ${finalPrice?.toFixed(2)}
            </span>
            {price && price !== finalPrice && (
              <span
                style={{
                  fontSize: 11,
                  color: "#cbd5e1",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                ${typeof price === "number" ? price.toFixed(2) : price}
              </span>
            )}
          </div>

          {/* Cart button */}
          <motion.button
            onClick={handleCart}
            disabled={cartState === "loading"}
            className="si-cta"
            whileTap={cartState === "idle" ? { scale: 0.97 } : {}}
            style={{
              marginTop: "auto",
              height: 38,
              width: "100%",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.01em",
              background: B.bg,
              color: "#fff",
              border: "none",
              cursor: cartState === "loading" ? "not-allowed" : "pointer",
              boxShadow: B.shine ? `0 6px 18px ${B.bg}55` : "none",
              fontFamily: "inherit",
              transition: "background 0.2s, box-shadow 0.2s",
              minWidth: 0,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={cartState}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.13 }}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {B.Icon}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 120,
                  }}
                >
                  {B.label}
                </span>
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

function Spinner() {
  return (
    <svg
      style={{ animation: "si-spin 0.8s linear infinite" }}
      width="14"
      height="14"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ShowItem;
