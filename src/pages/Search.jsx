import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ShowItem from '../component/ShowItem';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Search() {
  const [data, setData]         = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchParams]          = useSearchParams();
  const query                   = searchParams.get('q');
  const [currentPage, setPage]  = useState(1);
  const itemsPerPage            = 10;

  useEffect(() => {
    if (!query) return;
    (async () => {
      setLoading(true);
      setPage(1);
      try {
        const res    = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=0`);
        const result = await res.json();
        await new Promise(r => setTimeout(r, 400));
        setData(result.products.map(item => ({
          ...item,
          finalPrice: item.price - (item.price * item.discountPercentage) / 100,
          image: item.images[0] || item.thumbnail,
        })));
      } catch { setData([]); }
      finally { setLoading(false); }
    })();
  }, [searchParams, query]);

  const totalPages = Math.max(Math.ceil(data.length / itemsPerPage), 1);
  const maxPage    = Math.min(3, totalPages);
  const current    = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html, body {
          overflow-x: hidden !important;
          max-width: 100vw !important;
        }

        .search-page-wrapper {
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }

        .search-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
          max-width: 100%;
        }

        .search-grid > * {
          min-width: 0;
          width: 100%;
        }

        @media (min-width: 640px) {
          .search-grid {
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)) !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 360px) {
          .search-grid {
            gap: 6px;
          }
        }

        .pg-btn { transition: all 0.16s ease; }
        .pg-btn:hover:not(:disabled) { border-color: #6366f1 !important; color: #6366f1 !important; background: #f5f3ff !important; }
      `}</style>

      <div
        className="search-page-wrapper"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
          fontFamily: "'DM Sans', sans-serif",
          padding: '0 8px 60px',
          overflowX: 'hidden',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '40px 0 32px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <FiSearch size={20} color="#6366f1" />
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.01em' }}>
                Results for{' '}
                <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>{query}</span>
              </h1>
            </div>
            {!isLoading && data.length > 0 && (
              <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>
                {data.length} product{data.length !== 1 ? 's' : ''} found
              </p>
            )}
          </motion.div>

          {/* Loading grid */}
          {isLoading && (
            <div className="search-grid">
              {Array(10).fill(0).map((_, i) => (
                <div key={i}><ShowItem isLoading /></div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && data.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center', padding: '64px 40px',
                background: '#fff', borderRadius: 24,
                border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg,#ede9fe,#e0e7ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 30,
              }}>🔍</div>
              <p style={{ color: '#1e1b4b', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                No results for "{query}"
              </p>
              <p style={{ color: '#9ca3af', fontSize: 13 }}>Try a different search term</p>
            </motion.div>
          )}

          {/* Results grid */}
          {!isLoading && data.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="search-grid"
              >
                {current.map((item, i) => (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ShowItem {...item} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Pagination */}
          {!isLoading && data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 36 }}
            >
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={currentPage <= 1}
                className="pg-btn"
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: '1.5px solid #ebebf5', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  color: currentPage <= 1 ? '#d1d5db' : '#6b7280',
                  opacity: currentPage <= 1 ? 0.5 : 1,
                }}
              >
                <FiChevronLeft size={16} />
              </button>

              {[1, 2, 3].map(page => {
                const disabled = page > totalPages;
                const active   = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => !disabled && setPage(page)}
                    disabled={disabled}
                    style={{
                      width: 38, height: 38, borderRadius: 10,
                      border: active ? 'none' : '1.5px solid #ebebf5',
                      background: active
                        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                        : disabled ? '#f8f8fc' : '#fff',
                      color: active ? '#fff' : disabled ? '#d1d5db' : '#374151',
                      fontWeight: 700, fontSize: 14,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.4 : 1,
                      boxShadow: active ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
                      transition: 'all 0.16s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(p + 1, maxPage))}
                disabled={currentPage >= maxPage}
                className="pg-btn"
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  border: '1.5px solid #ebebf5', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: currentPage >= maxPage ? 'not-allowed' : 'pointer',
                  color: currentPage >= maxPage ? '#d1d5db' : '#6b7280',
                  opacity: currentPage >= maxPage ? 0.5 : 1,
                }}
              >
                <FiChevronRight size={16} />
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}

export default Search;