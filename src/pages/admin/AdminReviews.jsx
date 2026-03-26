import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/api';
import { FiSearch, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => <FaStar key={s} size={11} color={s <= rating ? '#f59e0b' : '#e5e7eb'} />)}
    </div>
  );
}

function AdminReviews() {
  const [reviews, setReviews]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionId, setActionId]     = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set('search', search);
      const res = await api.get(`/reviews/admin/all?${params}`);
      setReviews(res.data.reviews);
      setTotalPages(res.data.pagination?.pages || 1);
    } catch (err) {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchReviews(); }, 400); return () => clearTimeout(t); }, [search]);

  const handleToggleHide = async (reviewId) => {
    setActionId(reviewId);
    try {
      const res = await api.put(`/reviews/admin/${reviewId}/hide`);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, isHidden: res.data.isHidden } : r));
    } catch (err) {}
    finally { setActionId(null); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    setActionId(reviewId);
    try {
      await api.delete(`/reviews/admin/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    } catch (err) {}
    finally { setActionId(null); }
  };

  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .adm-pg-btn{transition:all 0.15s ease;}
        .adm-pg-btn:hover:not(.adm-pg-active){border-color:#a5b4fc !important;color:#6366f1 !important;}
      `}</style>

      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: '0 0 3px', letterSpacing: '-0.02em' }}>Reviews</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Moderate customer reviews</p>
        </div>

        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
          <input type="text" placeholder="Search by product or user..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fff', fontSize: 13, color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => { e.target.style.borderColor = '#a5b4fc'; }} onBlur={e => { e.target.style.borderColor = '#ebebf5'; }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #ebebf5', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ebebf5', boxShadow: '0 2px 14px rgba(99,102,241,0.06)', padding: '52px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No reviews found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence>
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: review.isHidden ? 0.5 : 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.22 } }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${review.isHidden ? '#f0f0f8' : '#ebebf5'}`, boxShadow: '0 2px 12px rgba(99,102,241,0.06)', padding: '16px 18px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 11, overflow: 'hidden', border: '1.5px solid #ebebf5', background: '#f8f8fc', flexShrink: 0 }}>
                      <img src={review.productImage} alt={review.productTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{review.productTitle}</p>
                      <div style={{ marginBottom: 5 }}><StarRow rating={review.rating} /></div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{review.title}</p>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{review.body}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', margin: '0 0 1px' }}>{review.user?.name}</p>
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 5px' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                          {review.verifiedPurchase && (
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '2px 8px' }}>✓ Verified</span>
                          )}
                          {review.isHidden && (
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 20, padding: '2px 8px' }}>Hidden</span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleToggleHide(review._id)} disabled={actionId === review._id} title={review.isHidden ? 'Show' : 'Hide'}
                          style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${review.isHidden ? '#bbf7d0' : '#ebebf5'}`, background: review.isHidden ? '#f0fdf4' : '#f8f8fc', color: review.isHidden ? '#16a34a' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', opacity: actionId === review._id ? 0.5 : 1 }}
                        >
                          {review.isHidden ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                        </button>
                        <button onClick={() => handleDelete(review._id)} disabled={actionId === review._id} title="Delete"
                          style={{ width: 34, height: 34, borderRadius: 9, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', opacity: actionId === review._id ? 0.5 : 1 }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`adm-pg-btn${page === p ? ' adm-pg-active' : ''}`}
                style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${page === p ? '#6366f1' : '#ebebf5'}`, background: page === p ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff', color: page === p ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: page === p ? '0 3px 10px rgba(99,102,241,0.25)' : 'none' }}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminReviews;