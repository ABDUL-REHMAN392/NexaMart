import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useFavoriteStore } from "../../store/useFavoriteStore";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── InputField defined OUTSIDE to prevent focus loss ─────────────────────
function InputField({
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
  focused,
  onFocus,
  onBlur,
}) {
  const isFocused = focused === name;
  return (
    <div>
      <div style={{ position: "relative" }}>
        <Icon
          size={15}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: error ? "#f87171" : isFocused ? "#6366f1" : "#c4c4d4",
            transition: "color 0.18s ease",
            zIndex: 1,
          }}
        />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="off"
          style={{
            outline: "none",
            width: "100%",
            padding: "10px 14px 10px 40px",
            fontSize: 14,
            borderRadius: 12,
            background: error ? "#fff8f8" : isFocused ? "#fafafe" : "#f8f8fc",
            border: `1.5px solid ${error ? "#fca5a5" : isFocused ? "#a5b4fc" : "#ebebf5"}`,
            color: "#1e1b4b",
            transition: "all 0.18s ease",
            boxSizing: "border-box",
          }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              fontSize: 12,
              color: "#f87171",
              margin: "4px 0 0 2px",
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

function Register() {
  const navigate = useNavigate();
  const { register, logout, isLoading } = useAuthStore();
  const { resetCart } = useCartStore();
  const { resetFavorites } = useFavoriteStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  // ─── Phone ka dedicated handler ───────────────────────────────────────────
  const handlePhoneChange = (value) => {
    setForm((prev) => ({ ...prev, phone: value || "" }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    else if (form.name.trim().length < 2) errs.name = "Min 2 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "At least 8 characters";
    else if (!/[A-Z]/.test(form.password))
      errs.password = "Add an uppercase letter";
    else if (!/[0-9]/.test(form.password)) errs.password = "Add a number";
    // Phone optional hai — agar diya toh valid hona chahiye
    if (form.phone && !isValidPhoneNumber(form.phone))
      errs.phone = "Enter a valid phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setServerError("");

    const result = await register(form);

    if (result.success) {
      await logout();
      resetCart();
      resetFavorites();
      toast.success("Account created! Please sign in 🎉");
      navigate("/login");
    } else {
      setServerError(
        result.message || "Something went wrong. Please try again."
      );
    }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const pwFocused = focused === "password";
  const phoneFocused = focused === "phone";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700&display=swap');
        input::placeholder { color: #c4c4d4; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #f8f8fc inset !important;
          -webkit-text-fill-color: #1e1b4b !important;
        }
        .oauth-reg-btn { transition: all 0.18s ease; }
        .oauth-reg-btn:hover { background: #f0f0ff !important; border-color: #a5b4fc !important; transform: translateY(-1px); }
        .submit-reg-btn { transition: all 0.2s ease; }
        .submit-reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(99,102,241,0.35) !important; }
        .submit-reg-btn:active:not(:disabled) { transform: translateY(0); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Phone Input Custom Styles ── */
        .phone-wrapper {
          display: flex;
          align-items: center;
          border-radius: 12px;
          border: 1.5px solid #ebebf5;
          background: #f8f8fc;
          padding: 0 12px;
          height: 42px;
          transition: all 0.18s ease;
          gap: 6px;
        }
        .phone-wrapper.phone-focused {
          background: #fafafe;
          border-color: #a5b4fc;
        }
        .phone-wrapper.phone-error {
          background: #fff8f8;
          border-color: #fca5a5;
        }
        .phone-wrapper .PhoneInputCountrySelect {
          display: none;
        }
        .phone-wrapper .PhoneInputCountryIcon {
          width: 20px;
          height: 14px;
          border-radius: 3px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .phone-wrapper .PhoneInputCountryIconImg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .phone-wrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          margin-right: 4px;
        }
        .phone-wrapper input[type="tel"] {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          font-size: 14px;
          color: #1e1b4b;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
          padding: 0;
          min-width: 0;
        }
        .phone-wrapper input[type="tel"]::placeholder {
          color: #c4c4d4;
        }
        .phone-dial-code {
          font-size: 13px;
          color: #6b7280;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          background:
            "linear-gradient(135deg, #f0f0ff 0%, #fafaff 50%, #f5f0ff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "36px 32px",
            width: "100%",
            maxWidth: 420,
            boxShadow: "0 8px 48px rgba(99,102,241,0.1)",
          }}
        >
          <motion.div variants={stagger} initial="hidden" animate="show">
            {/* Logo */}
            <motion.div
              variants={item}
              style={{ textAlign: "center", marginBottom: 28 }}
            >
              <h1
                style={{
                  fontWeight: 900,
                  color: "#1e1b4b",
                  margin: "0 0 4px 0",
                  fontSize: 26,
                  letterSpacing: "-0.01em",
                }}
              >
                Nexa
                <span
                  style={{
                    color: "#6366f1",
                    fontFamily: "'Pacifico', cursive",
                  }}
                >
                  Mart
                </span>
              </h1>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>
                Create your account — it's free!
              </p>
            </motion.div>

            {/* Server Error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginBottom: 16,
                    color: "#f87171",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FiAlertCircle /> {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <form
              onSubmit={handleSubmit}
              noValidate
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              <motion.div variants={item}>
                <InputField
                  name="name"
                  label="Full Name"
                  icon={FiUser}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  focused={focused}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                />
              </motion.div>

              <motion.div variants={item}>
                <InputField
                  name="email"
                  type="email"
                  label="Email"
                  icon={FiMail}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  focused={focused}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
              </motion.div>

              {/* Password */}
              <motion.div variants={item}>
                <div style={{ position: "relative" }}>
                  <FiLock
                    size={15}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: errors.password
                        ? "#f87171"
                        : pwFocused
                          ? "#6366f1"
                          : "#c4c4d4",
                      transition: "color 0.18s ease",
                      zIndex: 1,
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    autoComplete="new-password"
                    style={{
                      outline: "none",
                      width: "100%",
                      padding: "10px 40px 10px 40px",
                      fontSize: 14,
                      borderRadius: 12,
                      background: errors.password
                        ? "#fff8f8"
                        : pwFocused
                          ? "#fafafe"
                          : "#f8f8fc",
                      border: `1.5px solid ${errors.password ? "#fca5a5" : pwFocused ? "#a5b4fc" : "#ebebf5"}`,
                      color: "#1e1b4b",
                      transition: "all 0.18s ease",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        fontSize: 12,
                        color: "#f87171",
                        margin: "4px 0 0 2px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FiAlertCircle size={11} /> {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Phone Field (react-phone-number-input) ── */}
              <motion.div variants={item}>
                <div
                  className={`phone-wrapper ${phoneFocused ? "phone-focused" : ""} ${errors.phone ? "phone-error" : ""}`}
                >
                  <PhoneInput
                    international
                    defaultCountry="PK"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused("")}
                    placeholder="300 1234567"
                  />
                </div>
                <AnimatePresence>
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{
                        fontSize: 12,
                        color: "#f87171",
                        margin: "4px 0 0 2px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FiAlertCircle size={11} /> {errors.phone}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={item}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="submit-reg-btn"
                  style={{
                    width: "100%",
                    height: 44,
                    borderRadius: 12,
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 18px rgba(99,102,241,0.25)",
                    opacity: isLoading ? 0.75 : 1,
                    marginTop: 2,
                  }}
                >
                  {isLoading ? (
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
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              variants={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "20px 0",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span
                style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}
              >
                or sign up with
              </span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </motion.div>

            {/* OAuth */}
            <motion.div variants={item} style={{ display: "flex", gap: 12 }}>
              <a
                href={`${API_URL}/auth/google`}
                className="oauth-reg-btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 42,
                  borderRadius: 12,
                  border: "1.5px solid #ebebf5",
                  background: "#fafafe",
                  color: "#4b5563",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <FcGoogle size={17} /> Google
              </a>
              <a
                href={`${API_URL}/auth/facebook`}
                className="oauth-reg-btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  height: 42,
                  borderRadius: 12,
                  border: "1.5px solid #ebebf5",
                  background: "#fafafe",
                  color: "#4b5563",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                <FaFacebook size={17} color="#1877f2" /> Facebook
              </a>
            </motion.div>

            <motion.p
              variants={item}
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "#9ca3af",
                margin: "20px 0 0 0",
              }}
            >
              Already have an account?{" "}
              <NavLink
                to="/login"
                style={{
                  color: "#6366f1",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in
              </NavLink>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default Register;