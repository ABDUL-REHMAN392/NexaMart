import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from 'react';
import { MdDashboard, MdShoppingBag, MdPeople, MdRateReview, MdLogout } from 'react-icons/md';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import { BsLayoutSidebar } from "react-icons/bs";
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../Notificationbell';

const navItems = [
  { to: '/admin',         label: 'Dashboard', icon: MdDashboard,   end: true },
  { to: '/admin/orders',  label: 'Orders',    icon: MdShoppingBag            },
  { to: '/admin/users',   label: 'Users',     icon: MdPeople                 },
  { to: '/admin/reviews', label: 'Reviews',   icon: MdRateReview             },
];

const EXPANDED_W  = 220;
const COLLAPSED_W = 64;

function SidebarContent({ collapsed, onClose, isMobile, user, onToggle, onLogout }) {
  const isCollapsed = collapsed && !isMobile;

  return (
    <>
      <div style={{ height: 3, background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)', flexShrink: 0 }} />

      <div style={{
        padding: isCollapsed ? '14px 0' : '18px 18px 14px',
        borderBottom: '1.5px solid #f4f4fc', flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        position: 'relative', minHeight: 64,
      }}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div key="logo-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <h1 style={{ fontSize: 19, fontWeight: 900, color: '#1e1b4b', margin: '0 0 2px', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                Nexa<span style={{ color: '#6366f1', fontFamily: "'Pacifico',cursive" }}>Mart</span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, fontWeight: 500 }}>Admin Panel</p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="logo-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              onClick={onToggle}
              title="Expand sidebar"
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)', flexShrink: 0,
              }}
            >
              <MdShoppingBag size={19} color="#fff" />
            </motion.button>
          )}
        </AnimatePresence>

        {isMobile ? (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 4, flexShrink: 0 }}>
            <FiX size={18} />
          </button>
        ) : (
          !isCollapsed && (
            <button onClick={onToggle} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
              <BsLayoutSidebar size={18} />
            </button>
          )
        )}
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: isCollapsed ? '14px 8px' : '14px 10px', flex: 1 }}>
        {!isCollapsed && (
          <p style={{ fontSize: 10, fontWeight: 700, color: '#c4c4d4', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 6px', marginBottom: 4 }}>
            Menu
          </p>
        )}
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to} to={to} end={end}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) => `adm-nav-link${isActive ? ' adm-nav-active' : ''}`}
            style={{ justifyContent: isCollapsed ? 'center' : 'flex-start', padding: isCollapsed ? '11px' : '10px 12px' }}
            title={isCollapsed ? label : ''}
          >
            <span className="adm-nav-icon"><Icon size={18} /></span>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span key="lbl"
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >{label}</motion.span>
              )}
            </AnimatePresence>
            {isCollapsed && <span className="adm-tooltip">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: isCollapsed ? '12px 8px 16px' : '12px 10px 16px', borderTop: '1.5px solid #f4f4fc', flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div key="user-full"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 12, background: 'linear-gradient(135deg,#f5f3ff,#eef2ff)', border: '1.5px solid #e0e7ff', marginBottom: 10 }}
            >
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800, overflow: 'hidden', border: '2px solid #c7d2fe' }}>
                {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#1e1b4b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: 10, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="user-icon"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 800, overflow: 'hidden', border: '2px solid #c7d2fe' }}>
                {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0).toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={onLogout} className="adm-logout-btn" style={{ padding: isCollapsed ? '9px' : '8px 12px' }} title={isCollapsed ? 'Logout' : ''}>
          <MdLogout size={15} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span key="logout-lbl"
                initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >Logout</motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );
}

function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sideW = collapsed ? COLLAPSED_W : EXPANDED_W;

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin'))
      navigate('/', { replace: true });
  }, [isLoading, isAuthenticated, user]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8fc' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #ebebf5', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }

        .adm-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          text-decoration: none; font-size: 13px; font-weight: 600;
          color: #64748b; transition: all 0.18s ease;
          border: 1.5px solid transparent; white-space: nowrap;
          overflow: hidden; position: relative;
        }
        .adm-nav-link:hover { background: #f8f8fc; color: #1e1b4b; }
        .adm-nav-active { background: linear-gradient(135deg,#eef2ff,#f5f3ff) !important; color: #6366f1 !important; border-color: #e0e7ff !important; }
        .adm-nav-active .adm-nav-icon { color: #6366f1 !important; }
        .adm-nav-icon { color: #94a3b8; transition: color 0.18s; flex-shrink: 0; }
        .adm-nav-link:hover .adm-nav-icon { color: #6366f1; }

        .adm-tooltip {
          position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
          background: #1e1b4b; color: #fff; font-size: 11px; font-weight: 700;
          padding: 5px 10px; border-radius: 8px; white-space: nowrap;
          pointer-events: none; opacity: 0; transition: opacity 0.15s; z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .adm-tooltip::before { content:''; position:absolute; right:100%; top:50%; transform:translateY(-50%); border:5px solid transparent; border-right-color:#1e1b4b; }
        .adm-nav-link:hover .adm-tooltip { opacity: 1; }

        .adm-logout-btn {
          display: flex; align-items: center; justify-content: center; gap: 7px;
          width: 100%; border-radius: 10px; border: 1.5px solid #fecaca;
          background: #fef2f2; color: #ef4444; font-size: 12px; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans',sans-serif; transition: all 0.16s;
        }
        .adm-logout-btn:hover { background: #fee2e2; border-color: #fca5a5; }

        .adm-topbar { display: none !important; }

        @media (max-width: 768px) {
          .adm-desktop-sidebar { display: none !important; }
          .adm-topbar { display: flex !important; }
          .adm-main { margin-left: 0 !important; padding: 16px !important; padding-top: 72px !important; }
        }
      `}</style>

      <div style={{
        display: 'flex', minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans',sans-serif",
      }}>

        {/* Desktop Sidebar */}
        <motion.aside
          className="adm-desktop-sidebar"
          animate={{ width: sideW }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff', borderRight: '1.5px solid #ebebf5',
            display: 'flex', flexDirection: 'column',
            position: 'fixed', top: 0, left: 0, height: '100%',
            zIndex: 20, overflow: 'hidden',
            boxShadow: '2px 0 16px rgba(99,102,241,0.06)',
          }}
        >
          <SidebarContent collapsed={collapsed} isMobile={false} user={user} onToggle={() => setCollapsed(c => !c)} onLogout={handleLogout} />
        </motion.aside>

        {/* Mobile Topbar — bell + hamburger */}
        <div className="adm-topbar" style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 60, zIndex: 30,
          background: '#fff', borderBottom: '1.5px solid #ebebf5',
          boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
          alignItems: 'center', justifyContent: 'space-between', padding: '0 18px',
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 900, color: '#1e1b4b', margin: 0 }}>
            Nexa<span style={{ color: '#6366f1', fontFamily: "'Pacifico',cursive" }}>Mart</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Bell sirf mobile topbar mein */}
            <NotificationBell />
            <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', display: 'flex', padding: 6 }}>
              <FiMenu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(15,14,26,0.45)', backdropFilter: 'blur(4px)', zIndex: 40 }}
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{ position: 'fixed', top: 0, left: 0, height: '100%', width: 260, background: '#fff', zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '4px 0 24px rgba(99,102,241,0.12)' }}
              >
                <SidebarContent collapsed={false} isMobile={true} user={user} onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content — desktop pe bell header mein */}
        <motion.main
          className="adm-main"
          animate={{ marginLeft: sideW }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, overflowX: 'auto', minWidth: 0 }}
        >
          {/* Desktop header bar — bell yahan */}
          <div className="adm-desktop-sidebar" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '16px 28px 0',
            // Note: adm-desktop-sidebar class se mobile pe hide ho jata hai
          }}>
            <NotificationBell />
          </div>

          <div style={{ padding: '16px 28px 48px' }}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </>
  );
}

export default AdminLayout;