import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/api';
import { toast } from 'react-toastify';
import { FiCamera, FiUser, FiLock, FiTrash2, FiPhone, FiMail, FiSave, FiMapPin, FiSearch, FiX, FiNavigation } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { motion, AnimatePresence } from 'framer-motion';

function AddressAutocomplete({ value, onChange, onSelect, error, placeholder = "Search your address..." }) {
  const [query, setQuery]           = useState(value?.formatted || '');
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [open, setOpen]             = useState(false);
  const [focused, setFocused]       = useState(false);
  const [selected, setSelected]     = useState(!!value?.formatted);
  const debounceRef                 = useRef(null);
  const wrapRef                     = useRef(null);

  // Outside click → close dropdown
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync external value (e.g. on mount from saved address)
  useEffect(() => {
    if (value?.formatted && !query) {
      setQuery(value.formatted);
      setSelected(true);
    }
  }, [value?.formatted]);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 3) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'NexaMart/1.0' },
      });
      const data = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(false);
    onChange?.({ formatted: val });           // parent ko update karo (partial)
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  const handleSelect = (place) => {
    const a = place.address || {};

    // Road / house number / neighbourhood se street banao
    const street = [a.house_number, a.road || a.pedestrian || a.footway || a.neighbourhood]
      .filter(Boolean).join(' ');

    const city       = a.city || a.town || a.village || a.municipality || a.county || '';
    const state      = a.state || a.region || '';
    const country    = a.country || '';
    const postalCode = a.postcode || '';
    const lat        = parseFloat(place.lat) || null;
    const lng        = parseFloat(place.lon) || null;
    const formatted  = place.display_name || '';

    const filled = { formatted, street, city, state, country, postalCode, lat, lng, placeId: '' };

    setQuery(formatted);
    setSelected(true);
    setOpen(false);
    setResults([]);
    onSelect?.(filled);
  };

  const handleClear = () => {
    setQuery('');
    setSelected(false);
    setResults([]);
    setOpen(false);
    onSelect?.({ formatted: '', street: '', city: '', state: '', country: '', postalCode: '', lat: null, lng: null, placeId: '' });
  };

  const isError = !!error;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        {/* Search / Loading icon */}
        <div style={{
          position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', display: 'flex', alignItems: 'center',
        }}>
          {loading
            ? <svg style={{ animation: 'spin 0.9s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={focused ? '#a5b4fc' : '#d1d5db'} strokeWidth="3" />
                <path d="M12 2a10 10 0 0110 10" stroke={focused ? '#6366f1' : '#9ca3af'} strokeWidth="3" strokeLinecap="round" />
              </svg>
            : <FiSearch size={14} color={isError ? '#f87171' : focused ? '#6366f1' : '#9ca3af'} style={{ transition: 'color 0.18s' }} />
          }
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => { setFocused(true); if (results.length) setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '10px 36px 10px 36px',
            borderRadius: 12, fontSize: 13,
            border: `1.5px solid ${isError ? '#fca5a5' : focused ? '#a5b4fc' : '#e5e7eb'}`,
            background: isError ? '#fff8f8' : focused ? '#fafafe' : '#f8f8fc',
            color: '#1e1b4b', outline: 'none', fontFamily: 'inherit',
            boxShadow: focused && !isError ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            transition: 'all 0.18s ease',
          }}
        />

        {/* Clear button — selected ya query hai toh dikhao */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: 2,
              color: '#9ca3af',
            }}
          >
            <FiX size={13} />
          </button>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            style={{ fontSize: 12, color: '#f87171', margin: '4px 0 0 2px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: '#fff', borderRadius: 14,
              border: '1.5px solid #e5e7eb',
              boxShadow: '0 8px 32px rgba(99,102,241,0.13)',
              zIndex: 9999, overflow: 'hidden', maxHeight: 260, overflowY: 'auto',
            }}
          >
            {results.map((place, i) => {
              const a       = place.address || {};
              const city    = a.city || a.town || a.village || a.municipality || a.county || '';
              const country = a.country || '';
              const line1   = place.display_name.split(',')[0];
              const line2   = [city, country].filter(Boolean).join(', ');

              return (
                <button
                  key={place.place_id || i}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(place); }}
                  style={{
                    width: '100%', textAlign: 'left', border: 'none', background: 'transparent',
                    padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit',
                    borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <FiNavigation size={13} color="#6366f1" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: '#1e1b4b', margin: '0 0 2px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{line1}</p>
                    <p style={{
                      fontSize: 11, color: '#9ca3af', margin: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{line2}</p>
                  </div>
                </button>
              );
            })}

            {/* Footer credit — Nominatim ToS requirement */}
            <div style={{
              padding: '6px 14px', fontSize: 10, color: '#c4c4d4',
              borderTop: '1px solid #f3f4f6', textAlign: 'right',
            }}>
              © OpenStreetMap contributors
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Field ─────────────────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, value, onChange, type = 'text', placeholder, disabled, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
        color: focused ? '#6366f1' : '#9ca3af', transition: 'color 0.18s',
      }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={14} style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: disabled ? '#d1d5db' : focused ? '#6366f1' : '#9ca3af',
            transition: 'color 0.18s', pointerEvents: 'none',
          }} />
        )}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled} readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: `10px ${Icon ? '14px 10px 36px' : '14px'}`,
            paddingLeft: Icon ? 36 : 14,
            borderRadius: 12, fontSize: 13,
            border: `1.5px solid ${disabled || readOnly ? '#f3f4f6' : focused ? '#a5b4fc' : '#e5e7eb'}`,
            background: disabled || readOnly ? '#f9fafb' : focused ? '#fafafe' : '#f8f8fc',
            color: disabled || readOnly ? '#9ca3af' : '#1e1b4b',
            outline: 'none', fontFamily: 'inherit',
            boxShadow: focused && !disabled && !readOnly ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
            transition: 'all 0.18s ease',
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
          }}
        />
      </div>
    </div>
  );
}

/* ── Save Button ────────────────────────────────────────────────────────────── */
function SaveButton({ saving, label }) {
  return (
    <button type="submit" disabled={saving} style={{
      width: '100%', marginTop: 4, padding: '11px',
      borderRadius: 12, border: 'none',
      background: saving ? 'linear-gradient(135deg,#a5b4fc,#c4b5fd)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      color: '#fff', fontSize: 13, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: saving ? 'not-allowed' : 'pointer',
      boxShadow: saving ? 'none' : '0 4px 16px rgba(99,102,241,0.28)',
      fontFamily: 'inherit', transition: 'all 0.2s ease',
    }}
      onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
    >
      {saving ? (
        <>
          <svg style={{ animation: 'spin 0.9s linear infinite', width: 15, height: 15 }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Saving...
        </>
      ) : (
        <><FiSave size={13} /> {label}</>
      )}
    </button>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const { resetCart }      = useCartStore();
  const { resetFavorites } = useFavoriteStore();
  const navigate           = useNavigate();
  const fileInputRef       = useRef(null);

  const [activeTab, setActiveTab]       = useState('profile');
  const [profileForm, setProfileForm]   = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // ── Address state — Nominatim se filled fields ──────────────────────────
  const [addressForm, setAddressForm] = useState({
    formatted:  user?.savedAddress?.formatted  || '',
    street:     user?.savedAddress?.street     || '',
    city:       user?.savedAddress?.city       || '',
    state:      user?.savedAddress?.state      || '',
    country:    user?.savedAddress?.country    || '',
    postalCode: user?.savedAddress?.postalCode || '',
    lat:        user?.savedAddress?.lat        ?? null,
    lng:        user?.savedAddress?.lng        ?? null,
    placeId:    user?.savedAddress?.placeId    || '',
  });
  const [addressError, setAddressError] = useState('');

  const [saving, setSaving]               = useState(false);
  const [uploadingAvatar, setUploadAvatar] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePw]     = useState('');

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const res = await api.put('/users/profile', { name: profileForm.name, phone: profileForm.phone });
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) { toast.error('Current password required'); return; }
    if (passwordForm.newPassword.length < 8) { toast.error('At least 8 characters'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success('Password changed! Logging out...');
      await logout(); resetCart(); resetFavorites();
      navigate('/login');
    } catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    // Validation — city aur country minimum chahiye
    if (!addressForm.city.trim()) {
      setAddressError('Please select an address from suggestions');
      return;
    }
    setAddressError('');
    setSaving(true);
    try {
      const res = await api.put('/users/address', {
        formatted:  addressForm.formatted,
        street:     addressForm.street,
        city:       addressForm.city,
        state:      addressForm.state,
        country:    addressForm.country,
        postalCode: addressForm.postalCode,
        lat:        addressForm.lat,
        lng:        addressForm.lng,
        placeId:    addressForm.placeId,
      });
      updateUser({ ...user, savedAddress: res.data.savedAddress });
      toast.success('Address saved!');
    } catch (err) { toast.error(err.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setUploadAvatar(true);
    try {
      const res = await api.upload('/users/avatar', fd);
      updateUser({ ...user, avatar: res.data.avatar });
      toast.success('Avatar updated!');
    } catch (err) { toast.error(err.message || 'Upload failed'); }
    finally { setUploadAvatar(false); }
  };

  const handleRemoveAvatar = async () => {
    try {
      await api.delete('/users/avatar');
      updateUser({ ...user, avatar: null });
      toast.success('Avatar removed!');
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) { toast.error('Enter your password'); return; }
    try {
      await api.delete('/users/profile', { body: { password: deletePassword } });
      await logout(); resetCart(); resetFavorites();
      toast.success('Account deleted');
      navigate('/');
    } catch (err) { toast.error(err.message || 'Failed'); }
  };

  const tabs = [
    { key: 'profile',  label: 'Profile',  icon: FiUser   },
    { key: 'address',  label: 'Address',  icon: FiMapPin },
    { key: 'password', label: 'Password', icon: FiLock   },
    { key: 'danger',   label: 'Danger',   icon: FiTrash2 },
  ];

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .tab-btn { transition: all 0.18s ease; }
        .tab-btn:hover:not(.tab-active) { color: #374151 !important; background: #f9fafb; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '40px 16px 60px',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 4 }}
          >
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              My <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Profile</span>
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Manage your account settings</p>
          </motion.div>

          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            style={{
              background: '#fff', borderRadius: 20,
              border: '1.5px solid #ebebf5',
              boxShadow: '0 2px 16px rgba(99,102,241,0.07)',
              padding: '20px 22px',
              display: 'flex', alignItems: 'center', gap: 18,
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e0e7ff' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 24, fontWeight: 900,
                  }}>{initials}</div>
                )}
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
              >
                {uploadingAvatar
                  ? <svg style={{ animation: 'spin 0.9s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  : <FiCamera size={18} color="#fff" />
                }
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 17, fontWeight: 900, color: '#1e1b4b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar} style={{
                  fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none',
                  cursor: 'pointer', opacity: uploadingAvatar ? 0.6 : 1, fontFamily: 'inherit',
                }}>
                  {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                </button>
                {user?.avatar && (
                  <button onClick={handleRemoveAvatar} style={{
                    fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8,
                    background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', fontFamily: 'inherit',
                  }}>Remove</button>
                )}
              </div>
            </div>

            <span style={{
              flexShrink: 0, fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.07em',
              padding: '4px 10px', borderRadius: 20,
              background: user?.role === 'admin' ? '#f5f3ff' : '#eef2ff',
              color: user?.role === 'admin' ? '#7c3aed' : '#6366f1',
              border: `1px solid ${user?.role === 'admin' ? '#ddd6fe' : '#e0e7ff'}`,
            }}>{user?.role || 'user'}</span>
          </motion.div>

          {/* Main Tabs Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: '#fff', borderRadius: 20, overflow: 'hidden',
              border: '1.5px solid #ebebf5',
              boxShadow: '0 2px 16px rgba(99,102,241,0.07)',
            }}
          >
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1.5px solid #f4f4fc', padding: '0 8px' }}>
              {tabs.map(({ key, label, icon: Icon }) => {
                const active = activeTab === key;
                const danger = key === 'danger';
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`tab-btn${active ? ' tab-active' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '13px 14px', fontSize: 12, fontWeight: 600,
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', fontFamily: 'inherit',
                      borderBottom: `2px solid ${active ? (danger ? '#ef4444' : '#6366f1') : 'transparent'}`,
                      color: active ? (danger ? '#ef4444' : '#6366f1') : '#9ca3af',
                      marginBottom: -1, borderRadius: '8px 8px 0 0',
                    }}
                  >
                    <Icon size={12} /> {label}
                  </button>
                );
              })}
            </div>

            {/* Panels */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                style={{ padding: '24px' }}
              >

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Field label="Full Name" icon={FiUser} value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="John Doe" />
                    <Field label="Phone Number" icon={FiPhone} value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+92 300 0000000" />
                    <Field label="Email Address" icon={FiMail} value={user?.email || ''} disabled type="email" />
                    <SaveButton saving={saving} label="Save Changes" />
                  </form>
                )}

                {/* ── Address Tab — Nominatim Autocomplete ── */}
                {activeTab === 'address' && (
                  <form onSubmit={handleAddressSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Search box */}
                    <div>
                      <label style={{
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.07em', color: '#9ca3af', display: 'block', marginBottom: 6,
                      }}>Search Address</label>
                      <AddressAutocomplete
                        value={addressForm}
                        onChange={(partial) => setAddressForm(p => ({ ...p, ...partial }))}
                        onSelect={(filled) => {
                          setAddressForm(filled);
                          setAddressError('');
                        }}
                        error={addressError}
                        placeholder="Type your address..."
                      />
                      <p style={{ fontSize: 11, color: '#c4c4d4', margin: '6px 0 0 2px' }}>
                        Type to search — select a suggestion to auto-fill fields below
                      </p>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                      <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>AUTO-FILLED</span>
                      <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                    </div>

                    {/* Read-only filled fields */}
                    <Field label="Street" icon={FiMapPin} value={addressForm.street}
                      onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))}
                      placeholder="Will be filled automatically" />

                    <div className="grid-2">
                      <Field label="City" value={addressForm.city}
                        onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                        placeholder="City" />
                      <Field label="State" value={addressForm.state}
                        onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                        placeholder="State" />
                      <Field label="Postal Code" value={addressForm.postalCode}
                        onChange={e => setAddressForm(p => ({ ...p, postalCode: e.target.value }))}
                        placeholder="54000" />
                      <Field label="Country" value={addressForm.country}
                        onChange={e => setAddressForm(p => ({ ...p, country: e.target.value }))}
                        placeholder="Country" />
                    </div>

                    {/* Coordinates — readonly info */}
                    {(addressForm.lat || addressForm.lng) && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          background: '#f0fdf4', border: '1px solid #bbf7d0',
                          borderRadius: 10, padding: '8px 12px',
                        }}
                      >
                        <FiNavigation size={12} color="#16a34a" />
                        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                          GPS: {addressForm.lat?.toFixed(4)}, {addressForm.lng?.toFixed(4)}
                        </span>
                      </motion.div>
                    )}

                    <SaveButton saving={saving} label="Save Address" />
                  </form>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { key: 'currentPassword', label: 'Current Password' },
                      { key: 'newPassword',     label: 'New Password'     },
                      { key: 'confirmPassword', label: 'Confirm Password' },
                    ].map(({ key, label }) => (
                      <Field key={key} label={label} icon={FiLock} type="password"
                        value={passwordForm[key]}
                        onChange={e => setPasswordForm(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="••••••••" />
                    ))}
                    <div style={{
                      fontSize: 12, color: '#92400e',
                      background: '#fffbeb', border: '1px solid #fde68a',
                      borderRadius: 10, padding: '10px 14px',
                    }}>
                      ⚠ You will be logged out after changing your password.
                    </div>
                    <SaveButton saving={saving} label="Change Password" />
                  </form>
                )}

                {/* Danger Tab */}
                {activeTab === 'danger' && (
                  <div style={{ background: '#fef2f2', borderRadius: 16, padding: '20px', border: '1.5px solid #fecaca' }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <FiTrash2 size={15} color="#ef4444" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#dc2626', margin: '0 0 3px' }}>Delete Account</p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.55 }}>
                          Permanently deletes your account, orders, and all data. This <strong>cannot be undone</strong>.
                        </p>
                      </div>
                    </div>

                    {!deleteConfirm ? (
                      <button onClick={() => setDeleteConfirm(true)} style={{
                        fontSize: 12, fontWeight: 700, padding: '9px 18px', borderRadius: 10,
                        background: '#fff', color: '#ef4444',
                        border: '1.5px solid #fca5a5', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.16s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                      >
                        I want to delete my account
                      </button>
                    ) : (
                      <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Field label="Confirm your password" icon={FiLock} type="password"
                          value={deletePassword}
                          onChange={e => setDeletePw(e.target.value)}
                          placeholder="Enter password to confirm" />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="submit" style={{
                            flex: 1, padding: '10px', borderRadius: 12,
                            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
                            color: '#fff', fontSize: 13, fontWeight: 700,
                            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                            boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
                          }}>Delete Permanently</button>
                          <button type="button" onClick={() => { setDeleteConfirm(false); setDeletePw(''); }} style={{
                            padding: '10px 18px', borderRadius: 12,
                            background: '#fff', color: '#6b7280',
                            border: '1.5px solid #e5e7eb', cursor: 'pointer',
                            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                          }}>Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default Profile;