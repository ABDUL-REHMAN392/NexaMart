import { FaMobileAlt, FaLaptop } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { GiDelicatePerfume } from "react-icons/gi";
import { IoCarSportOutline, IoBedOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const data = [
  { id:1, title:"Smartphones",     path:"category/smartphones",     icon:<FaMobileAlt />,       bg:"#eef2ff", color:"#6366f1" },
  { id:2, title:"Laptops",         path:"category/laptops",         icon:<FaLaptop />,          bg:"#f0f9ff", color:"#0ea5e9" },
  { id:3, title:"Fragrances",      path:"category/fragrances",      icon:<GiDelicatePerfume />, bg:"#fdf4ff", color:"#d946ef" },
  { id:4, title:"Groceries",       path:"category/groceries",       icon:<FaBasketShopping />,  bg:"#f0fdf4", color:"#16a34a" },
  { id:5, title:"Home Decoration", path:"category/home-decoration", icon:<IoBedOutline />,      bg:"#fff7ed", color:"#ea580c" },
  { id:6, title:"Vehicles",        path:"category/vehicle",         icon:<IoCarSportOutline />, bg:"#fefce8", color:"#ca8a04" },
];

function CategoryCard({ item, index }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="cat-card-wrap"
    >
      <NavLink to={item.path} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        <motion.div
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          animate={{
            y: hov ? -6 : 0,
            background: hov ? item.bg : '#fff',
            borderColor: hov ? `${item.color}40` : '#f0f0f8',
            boxShadow: hov
              ? `0 16px 36px ${item.color}28`
              : '0 2px 8px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '16px 8px',
            borderRadius: 20,
            border: '1.5px solid #f0f0f8',
            cursor: 'pointer',
            width: '100%',
            height: '100%',       /* fill parent so all cards equal height */
            minHeight: 100,
          }}
        >
          {/* Icon box */}
          <motion.div
            animate={{
              scale: hov ? 1.14 : 1,
              rotate: hov ? 6 : 0,
              background: hov ? item.color : item.bg,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            style={{
              width: 46, height: 46, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
              color: hov ? '#fff' : item.color,
            }}
          >
            {item.icon}
          </motion.div>

          {/* Label — fixed height, 2-line clamp so all cards stay same size */}
          <p style={{
            fontSize: 11.5,
            fontWeight: 700,
            color: hov ? item.color : '#374151',
            textAlign: 'center',
            lineHeight: 1.35,
            margin: 0,
            transition: 'color 0.2s ease',
            /* clamp to exactly 2 lines */
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: '2.7em',      /* 2 lines × 1.35 line-height */
            width: '100%',
          }}>
            {item.title}
          </p>
        </motion.div>
      </NavLink>
    </motion.div>
  );
}

function Category() {
  return (
    <>
      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          width: 100%;
          /* equal row heights */
          align-items: stretch;
        }

        .cat-card-wrap {
          width: 100%;
          min-width: 0;
          /* stretch so inner div can be height:100% */
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 640px) {
          .cat-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 14px;
          }
        }

        @media (min-width: 1024px) {
          .cat-grid { gap: 16px; }
        }

        @media (max-width: 360px) {
          .cat-grid { gap: 7px; }
        }

        .cat-section-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
        }

        @media (max-width: 640px) {
          .cat-section-inner { padding: 0 12px; }
        }
      `}</style>

      <section style={{ background: '#fff', padding: '52px 0' }}>
        <div className="cat-section-inner">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: 28 }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>
              Browse by{' '}
              <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Category</span>
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 13, margin: '8px 0 0' }}>
              Find exactly what you're looking for
            </p>
          </motion.div>

          {/* Grid */}
          <div className="cat-grid">
            {data.map((item, i) => (
              <CategoryCard key={item.id} item={item} index={i} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Category;