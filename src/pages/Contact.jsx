import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FiSend, FiCheck } from "react-icons/fi";

function InputField({ label, name, type = "text", value, onChange, required, textarea }) {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: 12, fontSize: 14,
    border: `1.5px solid ${focused ? '#a5b4fc' : '#ebebf5'}`,
    background: focused ? '#fafafe' : '#f8f8fc',
    color: '#1e1b4b', outline: 'none', fontFamily: 'inherit',
    boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
    transition: 'all 0.18s ease',
    resize: textarea ? 'none' : undefined,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: focused ? '#6366f1' : '#9ca3af',
        transition: 'color 0.18s',
      }}>{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={5}
          required={required} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange}
          required={required} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={inputStyle} />
      )}
    </div>
  );
}

const contactInfo = [
  { icon: MdEmail,      text: 'support@nexamart.com',             label: 'Email'    },
  { icon: MdPhone,      text: '+92-123-4567890',                  label: 'Phone'    },
  { icon: MdLocationOn, text: 'Plot #12, Tech Street, Islamabad', label: 'Location' },
];

export default function ContactPage() {
  const [form, setForm]           = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }

        .contact-info-item { transition: all 0.18s ease; }
        .contact-info-item:hover { background: #f5f3ff !important; border-color: #e0e7ff !important; }
        .ct-send-btn { transition: filter 0.18s, transform 0.18s; }
        .ct-send-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }

        /* Layout: 2 columns on desktop */
        .ct-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 24px;
          align-items: start;
        }
        .ct-h1 { font-size: 32px; }
        .ct-wrap { padding: 40px 20px 60px; }

        /* Tablet */
        @media (max-width: 860px) {
          .ct-grid {
            grid-template-columns: 1fr !important;
          }
          .ct-deco-card { display: none !important; }
        }

        /* Mobile */
        @media (max-width: 540px) {
          .ct-h1  { font-size: 26px !important; }
          .ct-sub { font-size: 13px !important; }
          .ct-wrap { padding: 28px 14px 48px !important; }
          .ct-card { padding: 20px 16px !important; }
          .ct-info-item-text { font-size: 12px !important; }
        }
      `}</style>

      <div className="ct-wrap" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 36 }}
          >
            <h1 className="ct-h1" style={{ fontWeight: 900, color: '#1e1b4b', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Let's{' '}
              <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Talk!</span>
            </h1>
            <p className="ct-sub" style={{ fontSize: 15, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
              We're here to help. Fill out the form and we'll get back to you shortly.
            </p>
          </motion.div>

          {/* Grid */}
          <div className="ct-grid">

            {/* Left — info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              {/* Contact info card */}
              <div className="ct-card" style={{
                background: '#fff', borderRadius: 20, padding: '28px 24px',
                border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  Contact Information
                </h2>
                <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px', lineHeight: 1.6 }}>
                  Reach out through any of these channels
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {contactInfo.map(({ icon: Icon, text, label }) => (
                    <div key={label} className="contact-info-item" style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 14,
                      background: '#f8f8fc', border: '1.5px solid #ebebf5',
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 11,
                        background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon size={18} color="#6366f1" />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                        <p className="ct-info-item-text" style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response time card — hidden on tablet/mobile */}
              <div className="ct-deco-card" style={{
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                borderRadius: 20, padding: '24px',
                color: '#fff', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: 20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <p style={{ fontSize: 20, margin: '0 0 8px' }}>💬</p>
                <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  We typically respond within
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>2–4 hours</p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <div className="ct-card" style={{
                background: '#fff', borderRadius: 20, padding: '28px 24px',
                border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
              }}>
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                    >
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                          Send a Message
                        </h2>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>We'll reply to your email</p>
                      </div>

                      <InputField label="Full Name"     name="name"    value={form.name}    onChange={handleChange} required />
                      <InputField label="Email Address" name="email"   type="email" value={form.email}   onChange={handleChange} required />
                      <InputField label="Your Message"  name="message" value={form.message} onChange={handleChange} required textarea />

                      <button type="submit" disabled={sending} className="ct-send-btn" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                        padding: '13px', borderRadius: 14, border: 'none',
                        background: sending
                          ? 'linear-gradient(135deg,#a5b4fc,#c4b5fd)'
                          : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        color: '#fff', fontSize: 14, fontWeight: 700,
                        cursor: sending ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        boxShadow: sending ? 'none' : '0 6px 20px rgba(99,102,241,0.3)',
                      }}>
                        {sending ? (
                          <>
                            <svg style={{ animation: 'spin 0.9s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                              <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <><FiSend size={15} /> Send Message</>
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ textAlign: 'center', padding: '40px 20px' }}
                    >
                      <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        style={{
                          width: 64, height: 64, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                        }}
                      >
                        <FiCheck size={28} color="#fff" strokeWidth={2.5} />
                      </motion.div>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                        Message Sent!
                      </h2>
                      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px', lineHeight: 1.6 }}>
                        Thank you for reaching out. We'll get back to you within 2–4 hours.
                      </p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                        style={{
                          padding: '10px 24px', borderRadius: 12,
                          border: '1.5px solid #ebebf5', background: '#f8f8fc',
                          color: '#6366f1', fontSize: 13, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >Send Another</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Response time — shown only on mobile/tablet (below form) */}
              <div style={{
                marginTop: 14,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                borderRadius: 20, padding: '20px 24px',
                color: '#fff', position: 'relative', overflow: 'hidden',
                display: 'none',
              }} className="ct-deco-mobile">
                <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', opacity: 0.85 }}>We typically respond within</p>
                <p style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>2–4 hours 💬</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Extra style for mobile deco card */}
      <style>{`
        @media (max-width: 860px) {
          .ct-deco-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}