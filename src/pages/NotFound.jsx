import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function NotFound() {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Sora:wght@400;500;600;700;800;900&display=swap');

        .nf-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f7ff;
          font-family: 'Sora', sans-serif;
          padding: 32px 20px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Soft gradient orbs */
        .nf-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
        }

        /* Grid dots pattern */
        .nf-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #d4d0ff 1px, transparent 1px);
          background-size: 36px 36px;
          opacity: 0.35;
          pointer-events: none;
        }

        .nf-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Big astronaut / lost package illustration ── */
        .nf-scene {
          position: relative;
          width: 220px;
          height: 220px;
          margin-bottom: 8px;
        }

        /* Orbit ring */
        .nf-orbit {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px dashed #c4b5fd;
          animation: nf-spin 14s linear infinite;
        }
        @keyframes nf-spin { to { transform: rotate(360deg); } }

        /* Planet in center */
        .nf-planet {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 90px; height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%);
          box-shadow: 0 12px 40px rgba(99,102,241,0.38), inset -14px -8px 0 rgba(0,0,0,0.12);
        }

        /* Planet ring */
        .nf-planet-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotateX(70deg);
          width: 130px; height: 130px;
          border-radius: 50%;
          border: 8px solid rgba(167,139,250,0.4);
        }

        /* Question mark on planet */
        .nf-qmark {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -52%);
          font-size: 36px;
          font-weight: 900;
          color: rgba(255,255,255,0.92);
          line-height: 1;
          user-select: none;
        }

        /* Small satellite orbiting */
        .nf-satellite {
          position: absolute;
          top: 12px; left: 50%;
          transform: translateX(-50%);
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #f43f5e, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(244,63,94,0.4);
        }

        /* 404 */
        .nf-num-wrap {
          display: flex;
          align-items: center;
          gap: 0;
          line-height: 1;
          margin-bottom: 4px;
        }

        .nf-num {
          font-size: clamp(100px, 20vw, 160px);
          font-weight: 900;
          letter-spacing: -6px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          user-select: none;
          line-height: 1;
        }

        .nf-zero {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* The 0 is replaced by a glowing circle */
        .nf-zero-circle {
          width: clamp(72px, 14vw, 114px);
          height: clamp(72px, 14vw, 114px);
          border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
          box-shadow: 0 8px 28px rgba(244,63,94,0.4);
          display: flex; align-items: center; justify-content: center;
          margin: 0 clamp(4px, 1vw, 10px);
          flex-shrink: 0;
          position: relative;
          top: clamp(-4px, -1vw, -8px);
        }

        /* Inner white ring on zero */
        .nf-zero-inner {
          width: 55%;
          height: 55%;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
        }

        .nf-title {
          font-size: clamp(20px, 4vw, 30px);
          font-weight: 800;
          color: #1e1b4b;
          margin: 14px 0 10px;
          letter-spacing: -0.3px;
        }

        .nf-sub {
          font-size: clamp(13px, 2vw, 15px);
          color: #7c7a9a;
          max-width: 360px;
          line-height: 1.75;
          margin: 0 auto 40px;
          font-weight: 400;
        }

        .nf-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nf-btn-p {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 30px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          transition: all 0.22s ease;
          letter-spacing: 0.01em;
        }
        .nf-btn-p:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(99,102,241,0.48);
        }
        .nf-btn-p:active { transform: translateY(-1px); }

        .nf-btn-s {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 30px;
          background: #fff;
          color: #6366f1;
          font-size: 14px;
          font-weight: 700;
          border: 1.5px solid #c7d2fe;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Sora', sans-serif;
          transition: all 0.22s ease;
          letter-spacing: 0.01em;
        }
        .nf-btn-s:hover {
          background: #eef2ff;
          border-color: #a5b4fc;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.12);
        }
        .nf-btn-s:active { transform: translateY(-1px); }

        /* Quick links */
        .nf-links {
          margin-top: 40px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .nf-link {
          font-size: 13px;
          font-weight: 600;
          color: #8b5cf6;
          cursor: pointer;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 20px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
          transition: all 0.16s;
        }
        .nf-link:hover {
          background: #ede9fe;
          color: #6366f1;
        }

        .nf-brand {
          margin-top: 48px;
          font-size: 14px;
          font-weight: 700;
          color: #c4b5fd;
          letter-spacing: 0.02em;
        }

        @media (max-width: 480px) {
          .nf-actions { flex-direction: column; align-items: center; }
          .nf-btn-p, .nf-btn-s { width: 260px; justify-content: center; }
          .nf-scene { width: 170px; height: 170px; }
          .nf-planet { width: 70px; height: 70px; }
          .nf-planet-ring { width: 100px; height: 100px; }
        }
      `}</style>

      <div className="nf-root">
        {/* Dot grid */}
        <div className="nf-grid" />

        {/* Orbs */}
        <motion.div
          className="nf-orb"
          style={{
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)',
            top: -180, left: -160,
          }}
          animate={{ x: mouse.x * 0.6, y: mouse.y * 0.6 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
        <motion.div
          className="nf-orb"
          style={{
            width: 420, height: 420,
            background: 'radial-gradient(circle, rgba(244,63,94,0.16) 0%, transparent 70%)',
            bottom: -140, right: -100,
          }}
          animate={{ x: -mouse.x * 0.4, y: -mouse.y * 0.4 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
        <motion.div
          className="nf-orb"
          style={{
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
            top: '40%', right: '8%',
          }}
          animate={{ x: mouse.x * 0.3, y: -mouse.y * 0.3 }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />

        <div className="nf-content">

          {/* ── Scene ── */}
          <motion.div
            className="nf-scene"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Orbit ring */}
            <div className="nf-orbit" />

            {/* Planet */}
            <div className="nf-planet">
              <div className="nf-planet-ring" />
              <span className="nf-qmark">?</span>
            </div>

            {/* Satellite on orbit */}
            <motion.div
              className="nf-satellite"
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '0 110px', position: 'absolute', top: 0, left: '50%' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </motion.div>

            {/* Small floating dots */}
            {[
              { size: 6, color: '#a78bfa', x: 16, y: 60 },
              { size: 4, color: '#f43f5e', x: 190, y: 80 },
              { size: 8, color: '#6366f1', x: 30, y: 170 },
              { size: 5, color: '#ec4899', x: 185, y: 155 },
            ].map((d, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute', width: d.size, height: d.size,
                  borderRadius: '50%', background: d.color,
                  left: d.x, top: d.y, opacity: 0.7,
                }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </motion.div>

          {/* ── 404 ── */}
          <motion.div
            className="nf-num-wrap"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="nf-num">4</span>
            <div className="nf-zero-circle">
              <div className="nf-zero-inner" />
            </div>
            <span className="nf-num">4</span>
          </motion.div>

          {/* ── Title ── */}
          <motion.h1
            className="nf-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            Oops! Page not found
          </motion.h1>

          {/* ── Subtitle ── */}
          <motion.p
            className="nf-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            The page you're looking for seems to have wandered off into space.
            Let's get you back to shopping!
          </motion.p>

          {/* ── Buttons ── */}
          <motion.div
            className="nf-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="nf-btn-p" onClick={() => navigate('/')}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Back to Home
            </button>
            <button className="nf-btn-s" onClick={() => navigate(-1)}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Go Back
            </button>
          </motion.div>

          {/* ── Quick Links ── */}
          <motion.div
            className="nf-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.42 }}
          >
            {[
              { label: '🛍 Shop', path: '/' },
              { label: '❤ Favorites', path: '/favorite' },
              { label: '🛒 Cart', path: '/cart' },
              { label: '📦 Orders', path: '/orders' },
            ].map(({ label, path }) => (
              <span key={path} className="nf-link" onClick={() => navigate(path)}>
                {label}
              </span>
            ))}
          </motion.div>

          {/* Brand */}
          <motion.p
            className="nf-brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Nexa<span style={{ fontFamily: "'Pacifico', cursive", color: '#a78bfa' }}>Mart</span>
          </motion.p>

        </div>
      </div>
    </>
  );
}

export default NotFound;