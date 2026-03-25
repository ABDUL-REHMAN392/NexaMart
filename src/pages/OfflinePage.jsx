import { motion } from 'framer-motion';

function OfflinePage() {
  const handleRetry = () => window.location.reload();
  const handleHome  = () => { window.location.href = '/'; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Sora:wght@400;500;600;700;800;900&display=swap');

        .ol-root {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          background: #f8f7ff;
          font-family: 'Sora', sans-serif;
          padding: 32px 20px 48px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .ol-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #d4d0ff 1px, transparent 1px);
          background-size: 36px 36px;
          opacity: 0.35; pointer-events: none;
        }
        .ol-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .ol-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center;
        }
        .ol-scene {
          position: relative; width: 200px; height: 200px; margin-bottom: 12px;
        }
        .ol-wave {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%; border: 2px solid #c4b5fd;
          opacity: 0; animation: ol-pulse 2.4s ease-out infinite;
        }
        .ol-wave:nth-child(2) { animation-delay: 0.8s; }
        .ol-wave:nth-child(3) { animation-delay: 1.6s; }
        @keyframes ol-pulse {
          0%   { width: 60px; height: 60px; opacity: 0.7; }
          100% { width: 180px; height: 180px; opacity: 0; }
        }
        .ol-icon-wrap {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 12px 36px rgba(99,102,241,0.4); z-index: 2;
        }
        .ol-badge {
          position: absolute; top: 50%; left: 50%;
          transform: translate(14px, -34px);
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #f43f5e, #ec4899);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(244,63,94,0.45);
          z-index: 3; border: 2px solid #f8f7ff;
        }
        .ol-status {
          display: inline-flex; align-items: center; gap: 7px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #ef4444; font-size: 12px; font-weight: 700;
          padding: 5px 14px; border-radius: 20px;
          margin-bottom: 20px; letter-spacing: 0.02em;
        }
        .ol-status-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #ef4444;
          animation: ol-blink 1.2s ease-in-out infinite;
        }
        @keyframes ol-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .ol-title {
          font-size: clamp(24px, 5vw, 34px); font-weight: 800;
          color: #1e1b4b; margin: 4px 0 10px; letter-spacing: -0.4px;
        }
        .ol-sub {
          font-size: clamp(13px, 2vw, 15px); color: #7c7a9a;
          max-width: 340px; line-height: 1.75; margin: 0 auto 32px; font-weight: 400;
        }
        .ol-actions {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
        }
        .ol-btn-p {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 30px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff; font-size: 14px; font-weight: 700;
          border: none; border-radius: 50px; cursor: pointer;
          font-family: 'Sora', sans-serif;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          transition: all 0.22s ease;
        }
        .ol-btn-p:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(99,102,241,0.48); }
        .ol-btn-p:active { transform: translateY(-1px); }
        .ol-btn-s {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 30px; background: #fff; color: #6366f1;
          font-size: 14px; font-weight: 700; border: 1.5px solid #c7d2fe;
          border-radius: 50px; cursor: pointer;
          font-family: 'Sora', sans-serif; transition: all 0.22s ease;
        }
        .ol-btn-s:hover { background: #eef2ff; border-color: #a5b4fc; transform: translateY(-3px); }
        .ol-btn-s:active { transform: translateY(-1px); }
        .ol-tips {
          margin-top: 32px; display: flex; flex-direction: column;
          gap: 8px; max-width: 320px;
        }
        .ol-tip {
          display: flex; align-items: center; gap: 10px;
          background: #f5f3ff; border: 1px solid #ede9fe;
          border-radius: 12px; padding: 9px 14px;
          font-size: 12px; color: #6b7280; font-weight: 500; text-align: left;
        }
        .ol-tip-icon {
          width: 28px; height: 28px; border-radius: 8px; background: #ede9fe;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; font-size: 14px;
        }
        .ol-brand { margin-top: 40px; font-size: 14px; font-weight: 700; color: #c4b5fd; }
        @media (max-width: 480px) {
          .ol-actions { flex-direction: column; align-items: center; }
          .ol-btn-p, .ol-btn-s { width: 260px; justify-content: center; }
        }
      `}</style>

      <div className="ol-root">
        <div className="ol-grid" />
        <div className="ol-orb" style={{ width:460, height:460, background:'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)', top:-160, left:-140 }} />
        <div className="ol-orb" style={{ width:380, height:380, background:'radial-gradient(circle, rgba(244,63,94,0.14) 0%, transparent 70%)', bottom:-120, right:-80 }} />

        <div className="ol-content">

          {/* Animated scene */}
          <motion.div className="ol-scene"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="ol-wave" />
            <div className="ol-wave" />
            <div className="ol-wave" />

            <div className="ol-icon-wrap">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
                <path d="M10.71 5.05A16 16 0 0 1 22.56 9"/>
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                <circle cx="12" cy="20" r="1" fill="#fff"/>
              </svg>
            </div>

            <div className="ol-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>

            {[
              { size:6, color:'#a78bfa', left:18,  top:64,  delay:0   },
              { size:4, color:'#f43f5e', left:172, top:80,  delay:0.6 },
              { size:7, color:'#6366f1', left:24,  top:148, delay:1.1 },
              { size:5, color:'#ec4899', left:168, top:150, delay:0.3 },
            ].map((d, i) => (
              <motion.div key={i}
                style={{ position:'absolute', width:d.size, height:d.size, borderRadius:'50%', background:d.color, left:d.left, top:d.top }}
                animate={{ scale:[1,1.5,1], opacity:[0.5,1,0.5] }}
                transition={{ duration:2.5, repeat:Infinity, delay:d.delay }}
              />
            ))}
          </motion.div>

          {/* Status */}
          <motion.div className="ol-status"
            initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.4 }}
          >
            <div className="ol-status-dot" />
            No Internet Connection
          </motion.div>

          <motion.h1 className="ol-title"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.48, delay:0.1 }}
          >
            You're Offline
          </motion.h1>

          <motion.p className="ol-sub"
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.44, delay:0.18 }}
          >
            It seems your internet connection is unavailable.
            Check your connection and try again.
          </motion.p>

          <motion.div className="ol-actions"
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.42, delay:0.26 }}
          >
            <button className="ol-btn-p" onClick={handleRetry}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Try Again
            </button>
            <button className="ol-btn-s" onClick={handleHome}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </button>
          </motion.div>

          {/* Tips */}
          <motion.div className="ol-tips"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          >
            {[
              { icon:'📶', text:'Check your WiFi or mobile data connection' },
              { icon:'🔄', text:'Try turning your router off and on again' },
              { icon:'✈️', text:'Make sure Airplane mode is turned off' },
            ].map((tip, i) => (
              <div key={i} className="ol-tip">
                <div className="ol-tip-icon">{tip.icon}</div>
                {tip.text}
              </div>
            ))}
          </motion.div>

          <motion.p className="ol-brand"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
          >
            Nexa<span style={{ fontFamily:"'Pacifico', cursive", color:'#a78bfa' }}>Mart</span>
          </motion.p>

        </div>
      </div>
    </>
  );
}

export default OfflinePage;