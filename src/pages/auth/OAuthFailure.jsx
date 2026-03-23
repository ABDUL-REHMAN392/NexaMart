import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const ERROR_MESSAGES = {
  google_failed:   { title: 'Google Sign-In Failed',   msg: "We couldn't sign you in with Google. Please try again or use email & password." },
  facebook_failed: { title: 'Facebook Sign-In Failed', msg: "We couldn't sign you in with Facebook. Please try again or use email & password." },
  oauth_failed:    { title: 'Authentication Failed',   msg: 'Something went wrong during sign-in. Please try again.' },
};

function OAuthFailure() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const errorKey       = searchParams.get('error') || 'oauth_failed';
  const { title, msg } = ERROR_MESSAGES[errorKey] || ERROR_MESSAGES.oauth_failed;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }

        .nx-shake { animation: shake 0.55s ease-in-out 0.35s both; }

        .nx-btn-primary {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nx-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(99,102,241,0.38) !important;
        }
        .nx-btn-secondary {
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .nx-btn-secondary:hover {
          border-color: #c7d2fe !important;
          color: #4338ca !important;
        }
        .nx-support-link {
          transition: color 0.15s ease;
        }
        .nx-support-link:hover {
          color: #4338ca !important;
        }
      `}</style>

      {/* ── Page background — mirrors OAuthSuccess gradient ── */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px',
        background: 'linear-gradient(135deg, #f0f0ff 0%, #fafaff 50%, #f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: '48px 40px',
            width: '100%', maxWidth: 380,
            boxShadow: '0 8px 48px rgba(99,102,241,0.1)',
            textAlign: 'center',
          }}
        >

          {/* ── Logo — identical to OAuthSuccess ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ marginBottom: 32 }}
          >
            <h1 style={{
              fontWeight: 900, color: '#1e1b4b',
              margin: '0 0 4px 0', fontSize: 26, letterSpacing: '-0.01em',
            }}>
              Nexa<span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Mart</span>
            </h1>
          </motion.div>

          {/* ── Error icon — same size / structure as OAuthSuccess spinner ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 28px' }}
          >
            {/* Static ring — mirrors the grey ring behind the spinner */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '3px solid #ebebf5',
            }} />

            {/* Coloured ring — indigo/violet like the spinner arc, but solid for "error state" */}
            <div className="nx-shake" style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#ef4444',
              borderRightColor: '#f87171',
            }} />

            {/* Centre icon */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ef4444',
            }}>
              <FiAlertCircle size={24} />
            </div>
          </motion.div>

          {/* ── Status text — same weight / size as OAuthSuccess status p ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.3 }}
            style={{ marginBottom: 8 }}
          >
            <p style={{
              fontSize: 15, fontWeight: 600, color: '#1e1b4b',
              margin: '0 0 6px 0',
            }}>
              {title}
            </p>
          </motion.div>

          {/* ── Subtitle message ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.3 }}
            style={{ marginBottom: 28 }}
          >
            <p style={{
              fontSize: 13, color: '#6b7280',
              margin: 0, lineHeight: 1.65,
            }}>
              {msg}
            </p>
          </motion.div>

          {/* ── Three dots — same as OAuthSuccess, red palette ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
              marginBottom: 28,
            }}
          >
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                }}
              />
            ))}
          </motion.div>

          {/* ── Progress bar — mirrors OAuthSuccess, but red & stays at ~30% ── */}
          <motion.div style={{
            marginBottom: 28,
            height: 3, borderRadius: 99,
            background: '#ebebf5', overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '30%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
            />
          </motion.div>

          {/* ── Action buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.35 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {/* Try Again — primary, indigo (brand colour, not red) */}
            <button
              className="nx-btn-primary"
              onClick={() => navigate('/login')}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                width: '100%', height: 46, borderRadius: 50,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 6px 20px rgba(99,102,241,0.32)',
              }}
            >
              <FiRefreshCw size={15} /> Try Again
            </button>

            {/* Back to Home — ghost */}
            <button
              className="nx-btn-secondary"
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                width: '100%', height: 42, borderRadius: 50,
                background: 'transparent', color: '#6b7280',
                fontSize: 14, fontWeight: 600,
                border: '1.5px solid #e5e7eb', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <FiArrowLeft size={14} /> Back to Home
            </button>
          </motion.div>

          {/* ── Help text ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ marginTop: 24, fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}
          >
            Still having trouble?{' '}
            <span
              className="nx-support-link"
              onClick={() => navigate('/contact')}
              style={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Contact support
            </span>
          </motion.p>

        </motion.div>
      </div>
    </>
  );
}

export default OAuthFailure;