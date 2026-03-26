import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/api';
import { FiSearch } from 'react-icons/fi';
import { MdBlock, MdCheckCircle } from 'react-icons/md';
import { motion } from 'framer-motion';

function UserCard({ user, onToggle, togglingId }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid #ebebf5', padding: '14px 16px', boxShadow: '0 2px 10px rgba(99,102,241,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid #e0e7ff', flexShrink: 0, background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 16, fontWeight: 800, color: '#6366f1' }}>{user.name?.charAt(0).toUpperCase()}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#1e1b4b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 9px', borderRadius: 20, background: user.role === 'admin' ? '#f5f3ff' : '#f8f8fc', color: user.role === 'admin' ? '#7c3aed' : '#6b7280', border: `1px solid ${user.role === 'admin' ? '#ddd6fe' : '#ebebf5'}`, flexShrink: 0 }}>
          {user.role}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#9ca3af' }}>
          {user.phone && <span>📞 {user.phone}</span>}
          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: user.isActive ? '#16a34a' : '#ef4444' }}>
            {user.isActive ? <MdCheckCircle size={14} /> : <MdBlock size={14} />}
            {user.isActive ? 'Active' : 'Banned'}
          </div>
          {user.role !== 'admin' && (
            <button onClick={() => onToggle(user._id)} disabled={togglingId === user._id}
              style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 9, border: `1.5px solid ${user.isActive ? '#fecaca' : '#bbf7d0'}`, background: user.isActive ? '#fef2f2' : '#f0fdf4', color: user.isActive ? '#ef4444' : '#16a34a', cursor: 'pointer', fontFamily: 'inherit', opacity: togglingId === user._id ? 0.5 : 1 }}
            >
              {togglingId === user._id ? '...' : user.isActive ? 'Ban' : 'Unban'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingId, setToggling] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {}
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400); return () => clearTimeout(t); }, [search]);

  const handleToggle = async (userId) => {
    setToggling(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-active`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.isActive } : u));
    } catch (err) {}
    finally { setToggling(null); }
  };

  const thStyle = { padding: '11px 14px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'left', whiteSpace: 'nowrap' };
  const tdStyle = { padding: '11px 14px', fontSize: 13, borderTop: '1px solid #f4f4fc', verticalAlign: 'middle' };

  return (
    <>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .adm-pg-btn{transition:all 0.15s ease;}
        .adm-pg-btn:hover:not(.adm-pg-active){border-color:#a5b4fc !important;color:#6366f1 !important;}
        .adm-users-table{display:block;}
        .adm-users-cards{display:none;}
        @media(max-width:768px){
          .adm-users-table{display:none !important;}
          .adm-users-cards{display:flex !important;flex-direction:column;gap:12px;}
        }
      `}</style>

      <div>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e1b4b', margin: '0 0 3px', letterSpacing: '-0.02em' }}>Users</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Manage registered customers</p>
        </div>

        <div style={{ position: 'relative', maxWidth: 320, marginBottom: 16 }}>
          <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, borderRadius: 12, border: '1.5px solid #ebebf5', background: '#fff', fontSize: 13, color: '#1e1b4b', outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => { e.target.style.borderColor = '#a5b4fc'; }} onBlur={e => { e.target.style.borderColor = '#ebebf5'; }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #ebebf5', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ebebf5', padding: '52px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No users found</div>
        ) : (
          <>
            <div className="adm-users-table" style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #ebebf5', boxShadow: '0 2px 14px rgba(99,102,241,0.06)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fafafe' }}>
                      {['User','Phone','Role','Joined','Status','Action'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <motion.tr key={user._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        style={{ transition: 'background 0.14s' }}
                        onMouseEnter={e => { [...e.currentTarget.cells].forEach(td => td.style.background = '#fafafe'); }}
                        onMouseLeave={e => { [...e.currentTarget.cells].forEach(td => td.style.background = ''); }}
                      >
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '2px solid #e0e7ff', flexShrink: 0, background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {user.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 13, fontWeight: 800, color: '#6366f1' }}>{user.name?.charAt(0).toUpperCase()}</span>}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 1px', fontSize: 13 }}>{user.name}</p>
                              <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 11 }}>{user.phone || '—'}</td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: user.role === 'admin' ? '#f5f3ff' : '#f8f8fc', color: user.role === 'admin' ? '#7c3aed' : '#6b7280', border: `1px solid ${user.role === 'admin' ? '#ddd6fe' : '#ebebf5'}` }}>{user.role}</span>
                        </td>
                        <td style={{ ...tdStyle, color: '#9ca3af', fontSize: 11 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: user.isActive ? '#16a34a' : '#ef4444' }}>
                            {user.isActive ? <MdCheckCircle size={14} /> : <MdBlock size={14} />}
                            {user.isActive ? 'Active' : 'Banned'}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          {user.role !== 'admin' ? (
                            <button onClick={() => handleToggle(user._id)} disabled={togglingId === user._id}
                              style={{ fontSize: 11, fontWeight: 700, padding: '5px 13px', borderRadius: 9, border: `1.5px solid ${user.isActive ? '#fecaca' : '#bbf7d0'}`, background: user.isActive ? '#fef2f2' : '#f0fdf4', color: user.isActive ? '#ef4444' : '#16a34a', cursor: 'pointer', fontFamily: 'inherit', opacity: togglingId === user._id ? 0.5 : 1, transition: 'all 0.15s' }}
                            >
                              {togglingId === user._id ? '...' : user.isActive ? 'Ban' : 'Unban'}
                            </button>
                          ) : <span style={{ fontSize: 12, color: '#c4c4d4' }}>—</span>}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="adm-users-cards">
              {users.map(user => <UserCard key={user._id} user={user} onToggle={handleToggle} togglingId={togglingId} />)}
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
    </>
  );
}

export default AdminUsers;