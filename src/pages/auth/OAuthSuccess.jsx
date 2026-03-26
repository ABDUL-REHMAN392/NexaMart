import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useFavoriteStore } from '../../store/useFavoriteStore';
import { FiShoppingBag } from 'react-icons/fi';

function OAuthSuccess() {
  const navigate           = useNavigate();
  const { getMe }          = useAuthStore();
  const { mergeGuestCart } = useCartStore();
  const { fetchFavorites } = useFavoriteStore();
  const [status, setStatus] = useState('Verifying your account...');

  useEffect(() => {
    (async () => {
      try {
        // Cookie already set honi chahiye OAuth callback ke baad
        // Agar cookie nahi hai (direct URL visit) getMe() throw karega — catch mein redirect
        const user = await getMe();        
        // Extra guard — agar user nahi mila (null/undefined return hua)
        if (!user) throw new Error('No user');
        
        setStatus('Loading your data...');
        await Promise.all([mergeGuestCart(), fetchFavorites()]);

        setStatus('All set! Redirecting...');
        setTimeout(() => navigate('/', { replace: true }), 800);

      } catch {
        // Direct URL visit ya failed OAuth — login pe bhejo
        navigate('/login', { replace: true });
      }
    })();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
        .dot1 { animation: pulse-dot 1.2s ease-in-out infinite 0s;   }
        .dot2 { animation: pulse-dot 1.2s ease-in-out infinite 0.2s; }
        .dot3 { animation: pulse-dot 1.2s ease-in-out infinite 0.4s; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 16px',
        background: 'linear-gradient(135deg, #f0f0ff 0%, #fafaff 50%, #f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: '#fff', borderRadius: 24, padding: '48px 40px', width: '100%', maxWidth: 380, boxShadow: '0 8px 48px rgba(99,102,241,0.1)', textAlign: 'center' }}
        >
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ marginBottom: 32 }}>
            <h1 style={{ fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px 0', fontSize: 26, letterSpacing: '-0.01em' }}>
              Nexa<span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Mart</span>
            </h1>
          </motion.div>

          {/* Spinner */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }}
            style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 28px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid #ebebf5' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#6366f1', borderRightColor: '#8b5cf6', animation: 'spin 0.9s linear infinite' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <FiShoppingBag size={24} />
            </div>
          </motion.div>

          {/* Status */}
          <motion.div key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1e1b4b', margin: '0 0 6px 0' }}>{status}</p>
          </motion.div>

          {/* Dots */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {['dot1', 'dot2', 'dot3'].map((cls) => (
              <div key={cls} className={cls} style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div style={{ marginTop: 28, height: 3, borderRadius: 99, background: '#ebebf5', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: '0%' }} animate={{ width: '100%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default OAuthSuccess;