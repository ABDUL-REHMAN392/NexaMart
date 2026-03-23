import { useEffect, useRef, useState } from "react";
import ShowItem from "./ShowItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

function ScrollBtn({ dir, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: hov ? '1.5px solid #6366f1' : '1.5px solid #e5e7eb',
        background: hov ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
        color: hov ? '#fff' : '#9ca3af', cursor: 'pointer',
        boxShadow: hov ? '0 6px 18px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
      }}
    >
      {dir === 'left' ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
    </button>
  );
}

function BestSellingProducts() {
  const [data, setData]         = useState([]);
  const [isLoading, setLoading] = useState(false);
  const scrollRef               = useRef();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res    = await fetch("https://dummyjson.com/products/category/womens-dresses");
        const result = await res.json();
        await new Promise(r => setTimeout(r, 500));
        setData(result.products.map(item => ({
          ...item,
          finalPrice: parseFloat((item.price - (item.price * item.discountPercentage) / 100).toFixed(2)),
          image: item.images[0] || item.thumbnail,
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const scroll = dir =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });

  return (
    <>
      <style>{`
        .bsp-scroll {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding-bottom: 10px;
          padding-top: 8px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .bsp-scroll::-webkit-scrollbar { display: none; }

        .bsp-card-wrap {
          flex-shrink: 0;
          width: 160px;
        }
        @media (min-width: 480px)  { .bsp-card-wrap { width: 190px; } }
        @media (min-width: 640px)  { .bsp-card-wrap { width: 220px; } }
        @media (min-width: 1024px) { .bsp-card-wrap { width: 240px; } }

        @media (max-width: 640px)  { .bsp-section { padding: 32px 0 !important; } .bsp-wrap { padding: 0 12px !important; } .bsp-h2 { font-size: 18px !important; } }
        @media (min-width: 641px) and (max-width: 900px) { .bsp-wrap { padding: 0 24px !important; } }
      `}</style>

      <section className="bsp-section" style={{ background: '#fff', padding: '52px 0' }}>
        <div className="bsp-wrap" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 className="bsp-h2" style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>
                Best <span style={{ color: '#6366f1', fontFamily: "'Pacifico',cursive" }}>Selling</span>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['left', 'right'].map(d => <ScrollBtn key={d} dir={d} onClick={() => scroll(d)} />)}
            </div>
          </motion.div>

          {/* Scroll */}
          <div ref={scrollRef} className="bsp-scroll">
            {isLoading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className="bsp-card-wrap">
                    <ShowItem isLoading />
                  </div>
                ))
              : data.map((p, i) => (
                  <motion.div key={p.id} className="bsp-card-wrap"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ShowItem {...p} />
                  </motion.div>
                ))
            }
          </div>

        </div>
      </section>
    </>
  );
}

export default BestSellingProducts;