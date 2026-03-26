import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/api';
import { FiSearch, FiChevronDown, FiX, FiFilter } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocketStore } from '../../store/useSocketStore';

const STATUS_OPTIONS = ['pending','processing','shipped','delivered','cancelled'];

const STATUS_META = {
  pending:    { bg:'#fefce8', color:'#ca8a04', border:'#fde68a' },
  processing: { bg:'#eff6ff', color:'#3b82f6', border:'#bfdbfe' },
  shipped:    { bg:'#f5f3ff', color:'#8b5cf6', border:'#ddd6fe' },
  delivered:  { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
  cancelled:  { bg:'#fef2f2', color:'#ef4444', border:'#fecaca' },
};

const PAY_META = {
  pending:  { bg:'#fefce8', color:'#ca8a04', border:'#fde68a' },
  paid:     { bg:'#f0fdf4', color:'#16a34a', border:'#bbf7d0' },
  failed:   { bg:'#fef2f2', color:'#ef4444', border:'#fecaca' },
  refunded: { bg:'#eff6ff', color:'#3b82f6', border:'#bfdbfe' },
};

function StatusPill({ status, meta }) {
  const m = meta[status] || { bg:'#f8f8fc', color:'#9ca3af', border:'#ebebf5' };
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: m.bg, color: m.color, border: `1px solid ${m.border}`, whiteSpace: 'nowrap' }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function OrderCard({ order, onStatusChange, updatingId }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #ebebf5', padding: '14px 16px', boxShadow: '0 2px 10px rgba(99,102,241,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#1e1b4b', margin: '0 0 2px' }}>{order.user?.name}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>#{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span style={{ fontSize: 15, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ${Number(order.totalAmount).toFixed(0)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        {order.items.slice(0, 4).map((item, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #ebebf5', flexShrink: 0 }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        {order.items.length > 4 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{order.items.length - 4}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatusPill status={order.orderStatus} meta={STATUS_META} />
          <StatusPill status={order.paymentStatus} meta={PAY_META} />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={order.orderStatus}
            onChange={e => onStatusChange(order, e.target.value)}
            disabled={updatingId === order._id || order.orderStatus === 'cancelled'}
            style={{
              fontSize: 12, fontWeight: 600, padding: '6px 24px 6px 10px', borderRadius: 9,
              border: '1.5px solid #ebebf5', background: '#f8f8fc', color: '#374151',
              cursor: order.orderStatus === 'cancelled' ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', appearance: 'none',
              opacity: updatingId === order._id ? 0.5 : 1,
            }}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <FiChevronDown style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} size={11} />
        </div>
      </div>
    </div>
  );
}

function CancelModal({ order, onConfirm, onClose, loading }) {
  const [reason, setReason] = useState('');
  const isStripePaid = order.paymentMethod === 'stripe' && order.paymentStatus === 'paid';
  const isCodPaid    = order.paymentMethod === 'cod'    && order.paymentStatus === 'paid';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,14,26,0.4)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ background: '#fff', borderRadius: 22, padding: '24px', width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.18)', border: '1.5px solid #ebebf5' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#1e1b4b', margin: 0 }}>Cancel Order</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 4 }}><FiX size={17} /></button>
        </div>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 14px' }}>Order <strong style={{ color: '#1e1b4b' }}>#{order.orderNumber}</strong></p>
        {isStripePaid && <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '11px 14px', marginBottom: 12, fontSize: 12, color: '#3b82f6', lineHeight: 1.6 }}>💳 <strong>Stripe payment paid.</strong> Refund will be initiated automatically (5–10 days).</div>}
        {isCodPaid    && <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '11px 14px', marginBottom: 12, fontSize: 12, color: '#ea580c', lineHeight: 1.6 }}>💵 <strong>COD collected.</strong> Manual refund required.</div>}
        {!isStripePaid && !isCodPaid && <div style={{ background: '#f8f8fc', border: '1px solid #ebebf5', borderRadius: 12, padding: '11px 14px', marginBottom: 12, fontSize: 12, color: '#6b7280' }}>ℹ️ No payment collected.</div>}
        <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Reason <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Out of stock..." rows={3}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #ebebf5', background: '#f8f8fc', fontSize: 13, color: '#1e1b4b', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6 }}
          onFocus={e => { e.target.style.borderColor = '#a5b4fc'; }} onBlur={e => { e.target.style.borderColor = '#ebebf5'; }}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1.5px solid #ebebf5', background: '#f8f8fc', color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Keep</button>
          <button onClick={() => onConfirm(reason)} disabled={loading} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}>
            {loading ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setFilter]   = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const { socket }                  = useSocketStore();

  useEffect(() => {
    if (!socket) return;
    const onNew = () => fetchOrders(true);
    const onStatusUpdate = d => {
      setOrders(prev => prev.map(o =>
        o._id === d.orderId
          ? { ...o, orderStatus: d.orderStatus, paymentStatus: d.paymentStatus }
          : o
      ));
    };
    socket.on('new_order', onNew);
    socket.on('order_status_update', onStatusUpdate);
    return () => {
      socket.off('new_order', onNew);
      socket.off('order_status_update', onStatusUpdate);
    };
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search)       params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/orders/admin/all?${params}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {}
    finally { if (!silent) setLoading(false); }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchOrders(); }, 400); return () => clearTimeout(t); }, [search]);

  const handleStatusChange = (order, newStatus) => {
    if (newStatus === 'cancelled') { setCancelTarget({ order }); return; }
    applyUpdate(order._id, newStatus);
  };

  const applyUpdate = async (orderId, status, reason = '') => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/admin/${orderId}/status`, { status, reason });
      const updated = res.data.order;
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: updated.orderStatus, paymentStatus: updated.paymentStatus } : o));
    } catch (err) {}
    finally { setUpdatingId(null); }
  };

  const handleCancelConfirm = async (reason) => {
    if (!cancelTarget) return;
    setCancelling(true);
    await applyUpdate(cancelTarget.order._id, 'cancelled', reason);
    setCancelling(false);
    setCancelTarget(null);
  };

  const thStyle = { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap', textAlign: 'left' };
  const tdStyle = { padding: '10px 14px', fontSize: 13, borderTop: '1px solid #f4f4fc', verticalAlign: 'middle' };

  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .adm-sel{appearance:none;transition:border-color 0.16s,box-shadow 0.16s;}
        .adm-sel:focus{outline:none;border-color:#a5b4fc !important;box-shadow:0 0 0 3px rgba(99,102,241,0.1);}
        .adm-pg-btn{transition:all 0.15s ease;}
        .adm-pg-btn:hover:not(.adm-pg-active){border-color:#a5b4fc !important;color:#6366f1 !important;}
        .adm-orders-table{display:block;}
        .adm-orders-cards{display:none;}
        @media(max-width:768px){
          .adm-orders-table{display:none !important;}
          .adm-orders-cards{display:flex !important; flex-direction:column; gap:12px;}
        }
      `}</style>

      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: '0 0 3px', letterSpacing: '-0.02em' }}>Orders</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Manage and update customer orders</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
            <input type="text" placeholder="Search order # or customer..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fff', fontSize: 13, color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => { e.target.style.borderColor = '#a5b4fc'; }} onBlur={e => { e.target.style.borderColor = '#ebebf5'; }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <FiFilter style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} size={13} />
            <select value={statusFilter} onChange={e => { setFilter(e.target.value); setPage(1); }} className="adm-sel"
              style={{ paddingLeft: 30, paddingRight: 28, paddingTop: 9, paddingBottom: 9, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fff', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <FiChevronDown style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} size={12} />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #ebebf5', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
          </div>
        ) : orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ebebf5', padding: '52px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No orders found</div>
        ) : (
          <>
            <div className="adm-orders-table" style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ebebf5', boxShadow: '0 2px 14px rgba(99,102,241,0.06)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fafafe' }}>
                      {['Order #','Customer','Items','Total','Payment','Status','Date','Update'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id} style={{ transition: 'background 0.14s' }}
                        onMouseEnter={e => { [...e.currentTarget.cells].forEach(td => td.style.background = '#fafafe'); }}
                        onMouseLeave={e => { [...e.currentTarget.cells].forEach(td => td.style.background = ''); }}
                      >
                        <td style={tdStyle}><span style={{ fontWeight: 700, color: '#1e1b4b' }}>#{order.orderNumber}</span></td>
                        <td style={tdStyle}>
                          <p style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 1px', fontSize: 13 }}>{order.user?.name}</p>
                          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.user?.email}</p>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} style={{ width: 28, height: 28, borderRadius: 7, overflow: 'hidden', border: '1.5px solid #ebebf5', flexShrink: 0 }}>
                                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                            {order.items.length > 3 && <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>+{order.items.length - 3}</span>}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 13, fontWeight: 800, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
                            ${Number(order.totalAmount).toFixed(0)}
                          </span>
                        </td>
                        <td style={tdStyle}><StatusPill status={order.paymentStatus} meta={PAY_META} /></td>
                        <td style={tdStyle}><StatusPill status={order.orderStatus} meta={STATUS_META} /></td>
                        <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 11 }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <select value={order.orderStatus} onChange={e => handleStatusChange(order, e.target.value)}
                              disabled={updatingId === order._id || order.orderStatus === 'cancelled'}
                              className="adm-sel"
                              style={{ fontSize: 12, fontWeight: 600, padding: '6px 22px 6px 9px', borderRadius: 9, border: '1.5px solid #ebebf5', background: '#f8f8fc', color: '#374151', cursor: order.orderStatus === 'cancelled' ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: updatingId === order._id ? 0.5 : 1 }}
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                            <FiChevronDown style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} size={10} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="adm-orders-cards">
              {orders.map(order => (
                <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} updatingId={updatingId} />
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`adm-pg-btn${page === p ? ' adm-pg-active' : ''}`}
                style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${page === p ? '#6366f1' : '#ebebf5'}`, background: page === p ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff', color: page === p ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: page === p ? '0 3px 10px rgba(99,102,241,0.25)' : 'none' }}
              >{p}</button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {cancelTarget && <CancelModal order={cancelTarget.order} onConfirm={handleCancelConfirm} onClose={() => setCancelTarget(null)} loading={cancelling} />}
      </AnimatePresence>
    </>
  );
}

export default AdminOrders;