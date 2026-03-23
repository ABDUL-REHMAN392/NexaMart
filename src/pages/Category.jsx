import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowItem from "../component/ShowItem";
import { motion } from "framer-motion";
import { FiGrid } from "react-icons/fi";

function CategoryPage() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { category } = useParams();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setData([]);
      try {
        const res = await fetch(`https://dummyjson.com/products/category/${category}`);
        const result = await res.json();
        await new Promise(r => setTimeout(r, 600));
        
        setData(result.products.map(item => ({
          ...item,
          finalPrice: item.price - (item.price * item.discountPercentage) / 100,
          image: item.images?.[0] || item.thumbnail || "https://placehold.co/216x176?text=?",
        })));
      } catch (err) { 
        console.error("Fetch error:", err); 
      } finally { 
        setLoading(false); 
      }
    })();
  }, [category]);

  const label = category?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }
        
        .category-page-wrapper {
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }

        .product-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
          max-width: 100%;
        }

        /* Grid items — minWidth:0 prevents overflow */
        .product-grid-container > * {
          min-width: 0;
          width: 100%;
        }

        @media (min-width: 640px) {
          .product-grid-container {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
            gap: 24px !important;
          }
        }

        @media (max-width: 360px) {
          .product-grid-container {
            gap: 6px;
          }
        }
      `}</style>

      <div
        className="category-page-wrapper"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
          fontFamily: "'DM Sans', sans-serif",
          padding: '0 8px 60px',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '32px 0 24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <FiGrid size={20} color="#6366f1" />
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.01em' }}>
                Best Products of{' '}
                <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>{label}</span>
              </h1>
            </div>
            {!isLoading && data.length > 0 && (
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                {data.length} product{data.length !== 1 ? 's' : ''} found
              </p>
            )}
            <div style={{ width: 40, height: 3, background: '#6366f1', margin: '12px auto', borderRadius: 10, opacity: 0.6 }}></div>
          </motion.div>

          {/* Product Grid */}
          <div className="product-grid-container">
            {isLoading
              ? Array(8).fill(0).map((_, i) => (
                  <div key={i}>
                    <ShowItem isLoading />
                  </div>
                ))
              : data.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                  >
                    <ShowItem {...product} />
                  </motion.div>
                ))
            }
          </div>

          {/* Empty State */}
          {!isLoading && data.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center', padding: '64px 20px',
                background: '#fff', borderRadius: 24,
                border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
                marginTop: 40
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 24,
              }}>📦</div>
              <p style={{ color: '#1e1b4b', fontSize: 16, fontWeight: 700 }}>No products found</p>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}

export default CategoryPage;