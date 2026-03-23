import { NavLink } from "react-router-dom";
import Carousel from "./Carousel";
import { motion } from "framer-motion";
import {
  FaTshirt, FaFemale, FaSpa, FaHome,
  FaMobileAlt, FaFootballBall, FaChevronRight,
} from "react-icons/fa";

const sidebarLinks = [
  { id: 1, title: "Men's Clothing",   path: "category/mens-shirts",         icon: <FaTshirt />,       bg: "#f5f3ff", color: "#7c3aed" },
  { id: 2, title: "Women's Clothing", path: "category/womens-dresses",      icon: <FaFemale />,       bg: "#fdf2f8", color: "#db2777" },
  { id: 3, title: "Skin Care",         path: "category/skin-care",           icon: <FaSpa />,           bg: "#fff1f2", color: "#e11d48" },
  { id: 4, title: "Home & Kitchen",    path: "category/kitchen-accessories", icon: <FaHome />,          bg: "#f0fdf4", color: "#16a34a" },
  { id: 5, title: "Electronics",       path: "category/mobile-accessories",  icon: <FaMobileAlt />,     bg: "#fff7ed", color: "#ea580c" },
  { id: 6, title: "Sports",            path: "category/sports-accessories",  icon: <FaFootballBall />,  bg: "#fefce8", color: "#ca8a04" },
];

function HeroSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        @keyframes shimmer {
          0%   { background-position: -700px 0; }
          100% { background-position:  700px 0; }
        }
        .skel {
          background: linear-gradient(90deg, #f0f0f8 25%, #e8e8f5 50%, #f0f0f8 75%);
          background-size: 700px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 10px;
          display: block;
        }

        .cat-link { transition: background 0.16s ease, box-shadow 0.16s ease; }
        .cat-link:hover { background: #f8f8fd !important; box-shadow: 0 2px 10px rgba(99,102,241,0.08); }
        .cat-link:hover .cat-arrow { transform: translateX(3px); opacity: 0.8; }
        .cat-arrow { transition: transform 0.16s ease, opacity 0.16s ease; opacity: 0.3; }

        /* Desktop: sidebar + carousel side by side */
        .hero-inner {
          display: flex;
          align-items: stretch;
          gap: 16px;
          padding: 0 40px;
          max-width: 1400px;
          margin: 3rem auto;
        }

        .hero-sidebar { display: flex; flex-direction: column; width: 256px; flex-shrink: 0; }

        /* Mobile categories scroll strip */
        .hero-cats-strip {
          display: none;
          gap: 8px;
          overflow-x: auto;
          padding: 0 16px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .hero-cats-strip::-webkit-scrollbar { display: none; }
        .hero-cat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 20px;
          background: #fff;
          border: 1.5px solid #ebebf5;
          white-space: nowrap;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          flex-shrink: 0;
          transition: all 0.16s ease;
        }
        .hero-cat-pill:hover { border-color: #c7d2fe; background: #f5f3ff; color: #6366f1; }

        @media (max-width: 1024px) {
          .hero-sidebar   { display: none !important; }
          .hero-cats-strip { display: flex !important; }
          .hero-inner     { padding: 0 16px !important; flex-direction: column; gap: 0; }
        }

        @media (max-width: 640px) {
          .hero-inner { padding: 0 12px !important; }
        }
      `}</style>

      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        padding: '20px 0 24px',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Mobile category pills (shown only on tablet/mobile) ── */}
        <div className="hero-cats-strip" style={{ marginBottom: 14 }}>
          {sidebarLinks.map(link => (
            <NavLink key={link.id} to={link.path} className="hero-cat-pill">
              <span style={{ width: 22, height: 22, borderRadius: 6, background: link.bg, color: link.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                {link.icon}
              </span>
              {link.title}
            </NavLink>
          ))}
        </div>

        <div className="hero-inner">

          {/* ── Desktop Sidebar ── */}
          <motion.aside
            className="hero-sidebar"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#fff', borderRadius: 24,
              padding: '18px 14px',
              border: '1.5px solid #ebebf5',
              boxShadow: '0 2px 16px rgba(99,102,241,0.07)',
            }}
          >
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#9ca3af',
              padding: '0 8px', marginBottom: 10,
            }}>Categories</p>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sidebarLinks.map((link, i) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35 }}
                >
                  <NavLink to={link.path} className="cat-link" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', borderRadius: 13, textDecoration: 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, background: link.bg, color: link.color }}>
                        {link.icon}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{link.title}</span>
                    </div>
                    <FaChevronRight className="cat-arrow" style={{ fontSize: 9, color: '#6366f1' }} />
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.aside>

          {/* ── Carousel ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              flex: 1, minWidth: 0,
              borderRadius: 28, overflow: 'hidden',
              border: '1.5px solid #ebebf5',
              boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <Carousel />
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default HeroSection;