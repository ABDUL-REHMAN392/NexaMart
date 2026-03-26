import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiPackage, FiCreditCard, FiX } from 'react-icons/fi';
import { useSocketStore } from '../store/useSocketStore';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_META = {
  pending:    { color: '#f59e0b', bg: '#fefce8', border: '#fde68a', label: 'Pending'    },
  processing: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'Processing' },
  shipped:    { color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: 'Shipped'    },
  delivered:  { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Delivered'  },
  cancelled:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Cancelled'  },
};

function Skel({ w = '100%', h = 14, r = 8, mb = 0 }) {
  return <div className="skel-od" style={{ width: w, height: h, borderRadius: r, marginBottom: mb, display: 'block' }} />;
}

function OrderDetail() {
  const { orderId }                 = useParams();
  const navigate                    = useNavigate();
  const { socket }                  = useSocketStore();
  const [order, setOrder]           = useState(null);
  const [isLoading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = d => {
      if (d.orderId !== orderId) return;
      setOrder(p => p ? { ...p, orderStatus: d.orderStatus, paymentStatus: d.paymentStatus } : p);
    };
    const onCancel = d => {
      if (d.orderId !== orderId) return;
      setOrder(p => p ? { ...p, orderStatus: 'cancelled', paymentStatus: d.paymentStatus } : p);
    };
    socket.on('order_status_update', onUpdate);
    socket.on('order_cancelled_by_admin', onCancel);
    return () => { socket.off('order_status_update', onUpdate); socket.off('order_cancelled_by_admin', onCancel); };
  }, [socket, orderId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        navigate('/orders');
      } finally { setLoading(false); }
    })();
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
      setOrder(res.data.order);
    } catch (err) {}
    finally { setCancelling(false); }
  };

  const meta        = order ? (STATUS_META[order.orderStatus] || STATUS_META.pending) : null;
  const currentStep = order ? STEPS.indexOf(order.orderStatus) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer-od { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .skel-od {
          background: linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);
          background-size: 600px 100%;
          animation: shimmer-od 1.4s infinite;
        }
        .cancel-btn { transition: all 0.18s ease; }
        .cancel-btn:hover:not(:disabled) { background: #fef2f2 !important; border-color: #fca5a5 !important; color: #ef4444 !important; }
        .back-btn { transition: all 0.16s ease; }
        .back-btn:hover { color: #6366f1 !important; background: #f5f3ff !important; }
        @media(max-width:600px){ .od-inner{ padding:0 14px 48px !important } }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '0 20px 60px',
      }}>
        <div className="od-inner" style={{ maxWidth: 680, margin: '0 auto', paddingTop: 36 }}>

          {/* Back btn */}
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/orders')}
            className="back-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 13, fontWeight: 600, color: '#6b7280',
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '7px 12px', borderRadius: 10, marginBottom: 24,
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            <FiArrowLeft size={15} /> Back to Orders
          </motion.button>

          {/* Loading skeleton */}
          {isLoading && (
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1.5px solid #ebebf5', boxShadow: '0 4px 24px rgba(99,102,241,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <div><Skel w={110} h={10} mb={8} /><Skel w={170} h={18} mb={6} /><Skel w={120} h={10} /></div>
                <Skel w={80} h={28} r={20} />
              </div>
              <Skel h={4} r={99} mb={32} />
              {[1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <Skel w={52} h={52} r={10} />
                  <div style={{ flex: 1 }}><Skel h={12} mb={6} /><Skel w="30%" h={10} /></div>
                  <Skel w={60} h={14} />
                </div>
              ))}
            </div>
          )}

          {/* Main card */}
          {!isLoading && order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#fff', borderRadius: 20, overflow: 'hidden',
                border: '1.5px solid #ebebf5',
                boxShadow: '0 4px 24px rgba(99,102,241,0.09)',
              }}
            >
              {/* Top accent */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}88)` }} />

              <div style={{ padding: '24px' }}>

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Order Number</p>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{order.orderNumber}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20,
                    background: meta.bg, color: meta.color, border: `1.5px solid ${meta.border}`,
                    letterSpacing: '0.03em', flexShrink: 0,
                  }}>{meta.label}</span>
                </div>

                {/* ── Progress tracker — bar BEHIND circles ── */}
                {order.orderStatus !== 'cancelled' && (
                  <div style={{ marginBottom: 28, position: 'relative' }}>

                    {/* Track bar — centered vertically behind circles */}
                    <div style={{
                      position: 'absolute', top: 16, left: '12.5%', right: '12.5%',
                      height: 4, background: '#f0f0f8', borderRadius: 99, zIndex: 0,
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
                        style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                      />
                    </div>

                    {/* Circles + labels — ON TOP of bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                      {STEPS.map((s, i) => {
                        const done = i <= currentStep;
                        return (
                          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: '50%',
                              background: done ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                              border: `2px solid ${done ? '#6366f1' : '#e5e7eb'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 800,
                              color: done ? '#fff' : '#9ca3af',
                              boxShadow: done ? '0 3px 10px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
                              transition: 'all 0.3s ease',
                              flexShrink: 0,
                            }}>
                              {i < currentStep ? '✓' : i + 1}
                            </div>
                            <span style={{
                              fontSize: 10, fontWeight: 700,
                              color: done ? '#6366f1' : '#9ca3af',
                              textTransform: 'capitalize', textAlign: 'center',
                            }}>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div style={{ borderTop: '1.5px solid #f4f4fc', paddingTop: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <FiPackage size={15} color="#6366f1" />
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b' }}>Items</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #ebebf5', background: '#f8f8fc', flexShrink: 0 }}>
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.src = 'https://placehold.co/52x52?text=?'; }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>x{item.quantity}</p>
                        </div>
                        <span style={{
                          fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap',
                          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1.5px solid #f4f4fc', paddingTop: 16, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Items Total',  val: `$${Number(order.itemsTotal).toFixed(2)}`  },
                    { label: 'Delivery Fee', val: order.deliveryFee === 0 ? '🎉 FREE' : `$${Number(order.deliveryFee).toFixed(2)}` },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6b7280' }}>
                      <span>{label}</span><span style={{ fontWeight: 600 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid #f4f4fc', paddingTop: 10, marginTop: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#1e1b4b' }}>Total</span>
                    <span style={{
                      fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>${Number(order.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Address */}
                <div style={{ borderTop: '1.5px solid #f4f4fc', paddingTop: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FiMapPin size={14} color="#6366f1" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b' }}>Delivery Address</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{order.deliveryAddress.formatted}</p>
                </div>

                {/* Payment */}
                <div style={{ borderTop: '1.5px solid #f4f4fc', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <FiCreditCard size={14} color="#6366f1" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b' }}>Payment</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ fontSize: 13, color: '#6b7280', textTransform: 'capitalize' }}>{order.paymentMethod}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                        background: order.paymentStatus === 'paid' ? '#f0fdf4' : order.paymentStatus === 'refunded' ? '#eff6ff' : '#fef2f2',
                        color: order.paymentStatus === 'paid' ? '#16a34a' : order.paymentStatus === 'refunded' ? '#3b82f6' : '#ef4444',
                        border: `1px solid ${order.paymentStatus === 'paid' ? '#bbf7d0' : order.paymentStatus === 'refunded' ? '#bfdbfe' : '#fecaca'}`,
                        textTransform: 'capitalize',
                      }}>{order.paymentStatus}</span>
                      {order.paymentStatus === 'refunded' && (
                        <span style={{ fontSize: 11, color: '#3b82f6', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 8px', borderRadius: 20 }}>
                          5–10 business days
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancel btn */}
                {['pending', 'processing'].includes(order.orderStatus) && (
                  <motion.button
                    onClick={handleCancel}
                    disabled={cancelling}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="cancel-btn"
                    style={{
                      marginTop: 20, width: '100%', padding: '12px',
                      borderRadius: 13, border: '1.5px solid #ebebf5',
                      background: '#f8f8fc', color: '#9ca3af',
                      fontSize: 13, fontWeight: 700,
                      cursor: cancelling ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      fontFamily: "'DM Sans',sans-serif",
                      opacity: cancelling ? 0.6 : 1,
                    }}
                  >
                    {cancelling ? (
                      <><svg style={{ animation:'spin 0.9s linear infinite', width:14, height:14 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> Cancelling...</>
                    ) : (
                      <><FiX size={14} /> Cancel Order</>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderDetail;