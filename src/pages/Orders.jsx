import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { api } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const STATUS_META = {
  pending:    { bg:'#fefce8', color:'#ca8a04', border:'#fde68a', label:'Pending'    },
  processing: { bg:'#eff6ff', color:'#3b82f6', border:'#bfdbfe', label:'Processing' },
  shipped:    { bg:'#f5f3ff', color:'#8b5cf6', border:'#ddd6fe', label:'Shipped'    },
  delivered:  { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0', label:'Delivered'  },
  cancelled:  { bg:'#fef2f2', color:'#ef4444', border:'#fecaca', label:'Cancelled'  },
};

/* ── Skeleton ── */
function OrderSkeleton() {
  return (
    <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid #ebebf5', padding:'18px 20px', boxShadow:'0 2px 12px rgba(99,102,241,0.06)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          <div className="ord-sk" style={{ height:10, width:100, borderRadius:6 }} />
          <div className="ord-sk" style={{ height:13, width:70, borderRadius:6 }} />
        </div>
        <div className="ord-sk" style={{ height:24, width:80, borderRadius:20 }} />
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[1,2,3].map(i => <div key={i} className="ord-sk" style={{ width:44, height:44, borderRadius:10, flexShrink:0 }} />)}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <div className="ord-sk" style={{ height:10, width:80, borderRadius:6 }} />
        <div className="ord-sk" style={{ height:14, width:60, borderRadius:6 }} />
      </div>
    </div>
  );
}

function Orders() {
  const [orders, setOrders]     = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);
  const navigate                = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders?page=${page}&limit=10`);
        setOrders(res.data.orders);
        setTotal(res.data.pagination.pages);
      } catch (err) { throw new Error(err.message || 'Failed to load orders'); }
      finally { setLoading(false); }
    })();
  }, [page]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer-ord{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .ord-sk{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:600px 100%;animation:shimmer-ord 1.4s infinite;display:block;}
        .ord-card{transition:box-shadow 0.2s ease,border-color 0.2s ease,transform 0.2s ease;cursor:pointer;}
        .ord-card:hover{box-shadow:0 12px 36px rgba(99,102,241,0.14) !important;border-color:#c7d2fe !important;transform:translateY(-2px);}
        .ord-pg-btn{transition:all 0.15s ease;}
        .ord-pg-btn:hover:not(.ord-pg-active){border-color:#a5b4fc !important;color:#6366f1 !important;}
        @media(max-width:600px){.ord-inner{padding:0 14px 48px !important}}
      `}</style>

      <div style={{
        minHeight:'100vh',
        background:'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily:"'DM Sans',sans-serif",
        padding:'0 20px',
      }}>
        <div className="ord-inner" style={{ maxWidth:680, margin:'0 auto', paddingBottom:60 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}
            style={{ textAlign:'center', padding:'40px 0 28px' }}
          >
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:4 }}>
              <FiPackage size={22} color="#6366f1" />
              <h1 style={{ fontSize:26, fontWeight:900, color:'#1e1b4b', margin:0, letterSpacing:'-0.01em' }}>
                My <span style={{ color:'#6366f1', fontFamily:"'Pacifico',cursive" }}>Orders</span>
              </h1>
            </div>
            {!isLoading && orders.length > 0 && (
              <p style={{ color:'#9ca3af', fontSize:13, margin:0 }}>
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Skeletons */}
          {isLoading && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[1,2,3].map(i => <OrderSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!isLoading && orders.length === 0 && (
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              style={{
                textAlign:'center', padding:'60px 40px',
                background:'#fff', borderRadius:24,
                border:'1.5px solid #ebebf5',
                boxShadow:'0 4px 24px rgba(99,102,241,0.07)',
              }}
            >
              <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#ede9fe,#e0e7ff)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:34 }}>
                🛍️
              </div>
              <p style={{ color:'#1e1b4b', fontSize:17, fontWeight:700, marginBottom:6 }}>No orders yet</p>
              <p style={{ color:'#9ca3af', fontSize:13, marginBottom:28 }}>Start shopping and your orders will appear here</p>
              <NavLink to="/" style={{
                background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color:'#fff', padding:'11px 32px', borderRadius:12,
                textDecoration:'none', fontSize:14, fontWeight:700,
                boxShadow:'0 4px 18px rgba(99,102,241,0.3)',
              }}>Start Shopping</NavLink>
            </motion.div>
          )}

          {/* Orders list */}
          <AnimatePresence>
            {!isLoading && orders.map((order, i) => {
              const meta = STATUS_META[order.orderStatus] || STATUS_META.pending;
              return (
                <motion.div
                  key={order._id}
                  className="ord-card"
                  initial={{ opacity:0, y:16 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.06, duration:0.35, ease:[0.22,1,0.36,1] }}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  style={{
                    background:'#fff', borderRadius:18,
                    border:'1.5px solid #ebebf5',
                    boxShadow:'0 2px 12px rgba(99,102,241,0.07)',
                    padding:'18px 20px', marginBottom:12,
                  }}
                >
                  {/* Top row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14, gap:10 }}>
                    <div>
                      <p style={{ fontSize:11, color:'#9ca3af', margin:'0 0 3px', fontWeight:500 }}>
                        Order #{order.orderNumber}
                      </p>
                      <p style={{ fontSize:13, fontWeight:700, color:'#1e1b4b', margin:0 }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{
                        fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20,
                        background:meta.bg, color:meta.color, border:`1px solid ${meta.border}`,
                        whiteSpace:'nowrap',
                      }}>{meta.label}</span>
                      <FiChevronRight size={16} color="#c4c4d4" />
                    </div>
                  </div>

                  {/* Item thumbnails */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, overflowX:'auto' }}>
                    {order.items.slice(0, 5).map((item, idx) => (
                      <div key={idx} style={{ width:44, height:44, borderRadius:10, overflow:'hidden', border:'1.5px solid #ebebf5', background:'#f8f8fc', flexShrink:0 }}>
                        <img src={item.image} alt={item.title}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}
                          onError={e => { e.target.src='https://placehold.co/44x44?text=?'; }}
                        />
                      </div>
                    ))}
                    {order.items.length > 5 && (
                      <div style={{ width:44, height:44, borderRadius:10, background:'#f5f3ff', border:'1.5px solid #e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:'#6366f1' }}>+{order.items.length - 5}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <p style={{ fontSize:11, color:'#9ca3af', margin:0 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                    </p>
                    <span style={{
                      fontSize:16, fontWeight:900, letterSpacing:'-0.02em',
                      background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                    }}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }}
              transition={{ delay:0.2 }}
              style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20, flexWrap:'wrap' }}
            >
              {Array.from({ length:totalPages }, (_,i) => i+1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`ord-pg-btn${page===p ? ' ord-pg-active' : ''}`}
                  style={{
                    width:36, height:36, borderRadius:10,
                    border:`1.5px solid ${page===p ? '#6366f1' : '#ebebf5'}`,
                    background: page===p ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                    color: page===p ? '#fff' : '#6b7280',
                    fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit',
                    boxShadow: page===p ? '0 3px 10px rgba(99,102,241,0.28)' : 'none',
                  }}
                >{p}</button>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </>
  );
}

export default Orders;