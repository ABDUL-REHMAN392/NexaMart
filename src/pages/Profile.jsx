import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/api';
import {
  FiCamera, FiUser, FiLock, FiTrash2, FiPhone, FiMail, FiSave,
  FiMapPin, FiSearch, FiX, FiNavigation, FiCheckCircle, FiAlertCircle, FiAlertTriangle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────
   useFeedback — auto-dismiss helper hook
───────────────────────────────────────────────────────────────── */
function useFeedback(delay = 4000) {
  const [feedback, setFeedback] = useState(null);
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), delay);
    return () => clearTimeout(t);
  }, [feedback, delay]);
  return [feedback, setFeedback];
}

/* ─────────────────────────────────────────────────────────────────
   compressImage — canvas se image compress karo before upload
   Max 800px width/height, quality 0.82, output: File object
───────────────────────────────────────────────────────────────── */
async function compressImage(file, maxDim = 800, quality = 0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim) { resolve(file); return; }
      if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
      else { width = Math.round((width * maxDim) / height); height = maxDim; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => { resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() })); },
        'image/jpeg', quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/* ─────────────────────────────────────────────────────────────────
   FormFeedback — inline animated banner
───────────────────────────────────────────────────────────────── */
function FormFeedback({ feedback }) {
  if (!feedback) return null;
  const config = {
    success: { Icon: FiCheckCircle,   bg: '#f0fdf4', border: '#bbf7d0', iconColor: '#16a34a', titleColor: '#15803d', msgColor: '#4b7a57' },
    error:   { Icon: FiAlertCircle,   bg: '#fff5f5', border: '#fecaca', iconColor: '#ef4444', titleColor: '#dc2626', msgColor: '#7a4f4f' },
    warning: { Icon: FiAlertTriangle, bg: '#fffbeb', border: '#fde68a', iconColor: '#d97706', titleColor: '#b45309', msgColor: '#7a6830' },
  };
  const c = config[feedback.type] || config.error;
  const { Icon } = c;
  return (
    <AnimatePresence>
      <motion.div
        key={feedback.title + feedback.message}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', borderRadius: 12, background: c.bg, border: `1.5px solid ${c.border}` }}
      >
        <Icon size={16} color={c.iconColor} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: c.titleColor, margin: 0 }}>{feedback.title}</p>
          {feedback.message && <p style={{ fontSize: 12, color: c.msgColor, margin: '2px 0 0', lineHeight: 1.5 }}>{feedback.message}</p>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DeleteModal — proper modal with backdrop blur
───────────────────────────────────────────────────────────────── */
function DeleteModal({ isOpen, onClose, onConfirm, isSocial, socialProvider, feedback }) {
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState(false);
  const [loading, setLoading]   = useState(false);

  // Reset on close
  useEffect(() => { if (!isOpen) { setPassword(''); setLoading(false); } }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(isSocial ? null : password);
    } catch {
      // error is shown via deleteFeedback in parent
    } finally {
      setLoading(false);
    }
  };

  const providerLabel = socialProvider === 'google' ? 'Google' : socialProvider === 'facebook' ? 'Facebook' : socialProvider || '';

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,10,40,0.55)', backdropFilter: 'blur(6px)', zIndex: 1000 }}
          />
          {/* Modal — centered with margin auto trick, more reliable than transform */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', pointerEvents: 'none' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '100%', maxWidth: 440,
                background: '#fff', borderRadius: 22, boxShadow: '0 24px 64px rgba(15,10,40,0.22)',
                overflow: 'hidden', pointerEvents: 'auto',
              }}
            >
            {/* Red top bar */}
            <div style={{ height: 5, background: 'linear-gradient(90deg, #ef4444, #dc2626)' }} />

            <div style={{ padding: '24px 24px 20px' }}>
              {/* Icon + heading */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiTrash2 size={20} color="#ef4444" />
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: '0 0 3px' }}>Delete Account</p>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>This action is permanent and cannot be undone</p>
                </div>
              </div>

              {/* Warning banner */}
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <FiAlertTriangle size={14} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.55 }}>
                  Permanently deletes your account, orders, saved addresses, and all associated data. <strong>This cannot be recovered.</strong>
                </p>
              </div>

              {/* Feedback */}
              {feedback && <div style={{ marginBottom: 14 }}><FormFeedback feedback={feedback} /></div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {isSocial ? (
                  /* Social account — no password needed */
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#f0f9ff', border: '1.5px solid #bae6fd' }}>
                    <FiCheckCircle size={15} color="#0284c7" style={{ flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0369a1', margin: '0 0 2px' }}>{providerLabel} account verified</p>
                      <p style={{ fontSize: 12, color: '#4b8aaa', margin: 0, lineHeight: 1.5 }}>
                        No password required — your identity is confirmed via {providerLabel}.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Normal account — password required */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: focused ? '#6366f1' : '#9ca3af', transition: 'color 0.18s' }}>
                      Confirm your password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FiLock size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: focused ? '#6366f1' : '#9ca3af', pointerEvents: 'none', transition: 'color 0.18s' }} />
                      <input
                        type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password to confirm"
                        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                        autoFocus
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 36px', borderRadius: 12, fontSize: 13, border: `1.5px solid ${focused ? '#a5b4fc' : '#e5e7eb'}`, background: focused ? '#fafafe' : '#f8f8fc', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit', boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', transition: 'all 0.18s ease' }}
                      />
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button type="submit" disabled={loading || (!isSocial && !password)}
                    style={{ flex: 1, padding: '11px', borderRadius: 12, background: loading ? '#fca5a5' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: loading || (!isSocial && !password) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: !isSocial && !password ? 0.6 : 1, transition: 'all 0.18s' }}>
                    {loading
                      ? <><svg style={{ animation: 'spin 0.9s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg> Deleting...</>
                      : <><FiTrash2 size={13} /> Delete Permanently</>
                    }
                  </button>
                  <button type="button" onClick={onClose} disabled={loading}
                    style={{ padding: '11px 18px', borderRadius: 12, background: '#f9fafb', color: '#6b7280', border: '1.5px solid #e5e7eb', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────
   AddressAutocomplete
───────────────────────────────────────────────────────────────── */
function AddressAutocomplete({ value, onChange, onSelect, error, placeholder = 'Search your address...' }) {
  const [query, setQuery]     = useState(value?.formatted || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]       = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef           = useRef(null);
  const wrapRef               = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { if (value?.formatted && !query) setQuery(value.formatted); }, [value?.formatted]);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 3) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=${encodeURIComponent(q)}`, { headers: { 'Accept-Language': 'en', 'User-Agent': 'NexaMart/1.0' } });
      const data = await res.json();
      setResults(data); setOpen(data.length > 0);
    } catch { setResults([]); } finally { setLoading(false); }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value; setQuery(val); onChange?.({ formatted: val });
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 500);
  };

  const handleSelect = (place) => {
    const a = place.address || {};
    const street = [a.house_number, a.road || a.pedestrian || a.footway || a.neighbourhood].filter(Boolean).join(' ');
    const filled = { formatted: place.display_name || '', street, city: a.city || a.town || a.village || a.municipality || a.county || '', state: a.state || a.region || '', country: a.country || '', postalCode: a.postcode || '', lat: parseFloat(place.lat) || null, lng: parseFloat(place.lon) || null, placeId: '' };
    setQuery(filled.formatted); setOpen(false); setResults([]); onSelect?.(filled);
  };

  const handleClear = () => {
    setQuery(''); setResults([]); setOpen(false);
    onSelect?.({ formatted: '', street: '', city: '', state: '', country: '', postalCode: '', lat: null, lng: null, placeId: '' });
  };

  const isError = !!error;
  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
          {loading
            ? <svg style={{ animation: 'spin 0.9s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={focused ? '#a5b4fc' : '#d1d5db'} strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke={focused ? '#6366f1' : '#9ca3af'} strokeWidth="3" strokeLinecap="round" /></svg>
            : <FiSearch size={14} color={isError ? '#f87171' : focused ? '#6366f1' : '#9ca3af'} />
          }
        </div>
        <input type="text" value={query} onChange={handleInput} onFocus={() => { setFocused(true); if (results.length) setOpen(true); }} onBlur={() => setFocused(false)} placeholder={placeholder} autoComplete="off"
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 36px', borderRadius: 12, fontSize: 13, border: `1.5px solid ${isError ? '#fca5a5' : focused ? '#a5b4fc' : '#e5e7eb'}`, background: isError ? '#fff8f8' : focused ? '#fafafe' : '#f8f8fc', color: '#1e1b4b', outline: 'none', fontFamily: 'inherit', boxShadow: focused && !isError ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', transition: 'all 0.18s ease' }} />
        {query && <button type="button" onClick={handleClear} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af', padding: 2 }}><FiX size={13} /></button>}
      </div>
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: '#f87171', margin: '4px 0 0 2px', display: 'flex', alignItems: 'center', gap: 4 }}><FiAlertCircle size={10} /> {error}</motion.p>}
      </AnimatePresence>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', borderRadius: 14, border: '1.5px solid #e5e7eb', boxShadow: '0 8px 32px rgba(99,102,241,0.13)', zIndex: 9999, overflow: 'hidden', maxHeight: 260, overflowY: 'auto' }}>
            {results.map((place, i) => {
              const a = place.address || {};
              return (
                <button key={place.place_id || i} type="button" onMouseDown={(e) => { e.preventDefault(); handleSelect(place); }}
                  style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '10px 14px', cursor: 'pointer', fontFamily: 'inherit', borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <FiNavigation size={13} color="#6366f1" style={{ marginTop: 2, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.display_name.split(',')[0]}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{[a.city || a.town || a.village || '', a.country || ''].filter(Boolean).join(', ')}</p>
                  </div>
                </button>
              );
            })}
            <div style={{ padding: '6px 14px', fontSize: 10, color: '#c4c4d4', borderTop: '1px solid #f3f4f6', textAlign: 'right' }}>© OpenStreetMap contributors</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Field
───────────────────────────────────────────────────────────────── */
function Field({ label, icon: Icon, value, onChange, type = 'text', placeholder, disabled, readOnly, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: error ? '#f87171' : focused ? '#6366f1' : '#9ca3af', transition: 'color 0.18s' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {Icon && <Icon size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: error ? '#f87171' : disabled ? '#d1d5db' : focused ? '#6366f1' : '#9ca3af', transition: 'color 0.18s', pointerEvents: 'none' }} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', boxSizing: 'border-box', padding: `10px 14px 10px ${Icon ? 36 : 14}px`, borderRadius: 12, fontSize: 13, border: `1.5px solid ${error ? '#fca5a5' : disabled || readOnly ? '#f3f4f6' : focused ? '#a5b4fc' : '#e5e7eb'}`, background: error ? '#fff8f8' : disabled || readOnly ? '#f9fafb' : focused ? '#fafafe' : '#f8f8fc', color: disabled || readOnly ? '#9ca3af' : '#1e1b4b', outline: 'none', fontFamily: 'inherit', boxShadow: focused && !disabled && !readOnly && !error ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none', transition: 'all 0.18s ease', cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text' }} />
      </div>
      <AnimatePresence>
        {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 11, color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}><FiAlertCircle size={10} /> {error}</motion.p>}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SaveButton
───────────────────────────────────────────────────────────────── */
function SaveButton({ saving, label }) {
  return (
    <button type="submit" disabled={saving} style={{ width: '100%', marginTop: 4, padding: '11px', borderRadius: 12, border: 'none', background: saving ? 'linear-gradient(135deg,#a5b4fc,#c4b5fd)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : '0 4px 16px rgba(99,102,241,0.28)', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
      onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
      {saving
        ? <><svg style={{ animation: 'spin 0.9s linear infinite', width: 15, height: 15 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg> Saving...</>
        : <><FiSave size={13} /> {label}</>}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main Profile Component
───────────────────────────────────────────────────────────────── */
function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const { resetCart }      = useCartStore();
  const { resetFavorites } = useFavoriteStore();
  const navigate           = useNavigate();
  const fileInputRef       = useRef(null);

  const isSocial       = !!(user?.googleId || user?.facebookId);
  const socialProvider = user?.googleId ? 'google' : user?.facebookId ? 'facebook' : null;

  const tabs = [
    { key: 'profile',  label: 'Profile',  icon: FiUser   },
    { key: 'address',  label: 'Address',  icon: FiMapPin },
    ...(!isSocial ? [{ key: 'password', label: 'Password', icon: FiLock }] : []),
    { key: 'danger',   label: 'Danger',   icon: FiTrash2 },
  ];

  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profileForm, setProfileForm]         = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileErrors, setProfileErrors]     = useState({});
  const [profileFeedback, setProfileFeedback] = useFeedback();
  const [savingProfile, setSavingProfile]     = useState(false);

  // Password state
  const [passwordForm, setPasswordForm]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors]     = useState({});
  const [passwordFeedback, setPasswordFeedback] = useFeedback();
  const [savingPassword, setSavingPassword]     = useState(false);

  // Address state
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
  const [addressError, setAddressError]       = useState('');
  const [addressFeedback, setAddressFeedback] = useFeedback();
  const [savingAddress, setSavingAddress]     = useState(false);

  // Avatar
  const [uploadingAvatar, setUploadAvatar]  = useState(false);
  const [avatarFeedback, setAvatarFeedback] = useFeedback(3500);

  // ── Delete modal state ────────────────────────────────────────────────────
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFeedback, setDeleteFeedback]   = useFeedback(5000);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!profileForm.name.trim()) errors.name = 'Name is required';
    if (Object.keys(errors).length) { setProfileErrors(errors); return; }
    setProfileErrors({});
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', { name: profileForm.name, phone: profileForm.phone });
      updateUser(res.data.user);
      setProfileFeedback({ type: 'success', title: 'Profile updated', message: 'Your changes have been saved.' });
    } catch (err) {
      setProfileFeedback({ type: 'error', title: 'Could not save', message: err.message || 'Something went wrong.' });
    } finally { setSavingProfile(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!passwordForm.currentPassword)                             errors.currentPassword = 'Current password is required';
    if (passwordForm.newPassword.length < 8)                      errors.newPassword = 'At least 8 characters required';
    if (!/[A-Z]/.test(passwordForm.newPassword))                  errors.newPassword = 'One uppercase letter required';
    if (!/[0-9]/.test(passwordForm.newPassword))                  errors.newPassword = 'One number required';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length) { setPasswordErrors(errors); return; }
    setPasswordErrors({});
    setSavingPassword(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordFeedback({ type: 'success', title: 'Password changed', message: 'Logging you out now...' });
      setTimeout(async () => { await logout(); resetCart(); resetFavorites(); navigate('/login'); }, 1500);
    } catch (err) {
      setPasswordFeedback({ type: 'error', title: 'Could not change password', message: err.message || 'Current password may be incorrect.' });
    } finally { setSavingPassword(false); }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    if (!addressForm.city.trim()) { setAddressError('Please select an address from the suggestions'); return; }
    setAddressError('');
    setSavingAddress(true);
    try {
      const res = await api.put('/users/address', { ...addressForm });
      updateUser({ ...user, savedAddress: res.data.savedAddress });
      setAddressFeedback({ type: 'success', title: 'Address saved', message: 'Your delivery address has been updated.' });
    } catch (err) {
      setAddressFeedback({ type: 'error', title: 'Could not save address', message: err.message || 'Something went wrong.' });
    } finally { setSavingAddress(false); }
  };

  // ── FIXED: compress image before upload ──────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset file input so same file can be reselected
    e.target.value = '';
    setUploadAvatar(true);
    setAvatarFeedback(null);
    try {
      const compressed = await compressImage(file, 800, 0.82);
      const fd = new FormData();
      fd.append('avatar', compressed);
      const res = await api.upload('/users/avatar', fd);
      updateUser({ ...user, avatar: res.data.avatar });
      setAvatarFeedback({ type: 'success', title: 'Photo updated', message: 'Your profile photo has been changed.' });
    } catch (err) {
      setAvatarFeedback({ type: 'error', title: 'Upload failed', message: err.message || 'Please try again.' });
    } finally { setUploadAvatar(false); }
  };

  const handleRemoveAvatar = async () => {
    setAvatarFeedback(null);
    try {
      await api.delete('/users/avatar');
      updateUser({ ...user, avatar: null });
      setAvatarFeedback({ type: 'success', title: 'Photo removed' });
    } catch (err) {
      setAvatarFeedback({ type: 'error', title: 'Could not remove photo', message: err.message });
    }
  };

  // ── FIXED: api.delete wrapper mein body spread nahi hota
  // request() `body` field expect karta hai — isliye { body: {...} } pass karo
  const handleDeleteConfirm = async (password) => {
    try {
      if (isSocial) {
        await api.delete('/users/profile');
      } else {
        // body key explicitly pass karo — request() isko JSON.stringify karega
        await api.delete('/users/profile', { body: { password } });
      }
      await logout();
      resetCart();
      resetFavorites();
      navigate('/');
    } catch (err) {
      setDeleteFeedback({
        type: 'error',
        title: 'Deletion failed',
        message: err.message || 'Incorrect password. Please try again.',
      });
      throw err;
    }
  };

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

      {/* ── Delete Modal ── */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteFeedback(null); }}
        onConfirm={handleDeleteConfirm}
        isSocial={isSocial}
        socialProvider={socialProvider}
        feedback={deleteFeedback}
      />

      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)', fontFamily: "'DM Sans', sans-serif", padding: '40px 16px 60px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              My <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Profile</span>
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Manage your account settings</p>
          </motion.div>

          {/* Avatar Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
            style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #ebebf5', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid #e0e7ff' }}>
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 900 }}>{initials}</div>
                  }
                </div>
                <div onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(99,102,241,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: uploadingAvatar ? 'wait' : 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = 1; }} onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}>
                  {uploadingAvatar
                    ? <svg style={{ animation: 'spin 0.9s linear infinite', width: 18, height: 18 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" /><path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
                    : <FiCamera size={18} color="#fff" />
                  }
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 17, fontWeight: 900, color: '#1e1b4b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button onClick={() => !uploadingAvatar && fileInputRef.current?.click()} disabled={uploadingAvatar}
                    style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', cursor: 'pointer', opacity: uploadingAvatar ? 0.6 : 1, fontFamily: 'inherit' }}>
                    {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </button>
                  {user?.avatar && (
                    <button onClick={handleRemoveAvatar} disabled={uploadingAvatar}
                      style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', fontFamily: 'inherit', opacity: uploadingAvatar ? 0.5 : 1 }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 10px', borderRadius: 20, background: user?.role === 'admin' ? '#f5f3ff' : '#eef2ff', color: user?.role === 'admin' ? '#7c3aed' : '#6366f1', border: `1px solid ${user?.role === 'admin' ? '#ddd6fe' : '#e0e7ff'}` }}>
                {user?.role || 'customer'}
              </span>
            </div>

            {avatarFeedback && <FormFeedback feedback={avatarFeedback} />}
          </motion.div>

          {/* Tabs Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #ebebf5', boxShadow: '0 2px 16px rgba(99,102,241,0.07)' }}>

            <div style={{ display: 'flex', borderBottom: '1.5px solid #f4f4fc', padding: '0 8px' }}>
              {tabs.map(({ key, label, icon: Icon }) => {
                const active = activeTab === key;
                const danger = key === 'danger';
                return (
                  <button key={key} onClick={() => setActiveTab(key)} className={`tab-btn${active ? ' tab-active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '13px 14px', fontSize: 12, fontWeight: 600, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', borderBottom: `2px solid ${active ? (danger ? '#ef4444' : '#6366f1') : 'transparent'}`, color: active ? (danger ? '#ef4444' : '#6366f1') : '#9ca3af', marginBottom: -1, borderRadius: '8px 8px 0 0' }}>
                    <Icon size={12} /> {label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} style={{ padding: '24px' }}>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <FormFeedback feedback={profileFeedback} />
                    <Field label="Full Name" icon={FiUser} value={profileForm.name}
                      onChange={e => { setProfileForm(p => ({ ...p, name: e.target.value })); setProfileErrors(p => ({ ...p, name: '' })); }}
                      placeholder="John Doe" error={profileErrors.name} />
                    <Field label="Phone Number" icon={FiPhone} value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+92 300 0000000" />
                    <Field label="Email Address" icon={FiMail} value={user?.email || ''} disabled type="email" />
                    <SaveButton saving={savingProfile} label="Save Changes" />
                  </form>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                  <form onSubmit={handleAddressSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FormFeedback feedback={addressFeedback} />
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Search Address</label>
                      <AddressAutocomplete value={addressForm} onChange={(partial) => setAddressForm(p => ({ ...p, ...partial }))} onSelect={(filled) => { setAddressForm(filled); setAddressError(''); }} error={addressError} placeholder="Type your address..." />
                      <p style={{ fontSize: 11, color: '#c4c4d4', margin: '6px 0 0 2px' }}>Type to search — select a suggestion to auto-fill fields below</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                      <span style={{ fontSize: 11, color: '#d1d5db', fontWeight: 600 }}>AUTO-FILLED</span>
                      <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                    </div>
                    <Field label="Street" icon={FiMapPin} value={addressForm.street} onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} placeholder="Will be filled automatically" />
                    <div className="grid-2">
                      <Field label="City"        value={addressForm.city}       onChange={e => setAddressForm(p => ({ ...p, city:       e.target.value }))} placeholder="City"    />
                      <Field label="State"       value={addressForm.state}      onChange={e => setAddressForm(p => ({ ...p, state:      e.target.value }))} placeholder="State"   />
                      <Field label="Postal Code" value={addressForm.postalCode} onChange={e => setAddressForm(p => ({ ...p, postalCode: e.target.value }))} placeholder="54000"   />
                      <Field label="Country"     value={addressForm.country}    onChange={e => setAddressForm(p => ({ ...p, country:    e.target.value }))} placeholder="Country" />
                    </div>
                    {(addressForm.lat || addressForm.lng) && (
                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 12px' }}>
                        <FiNavigation size={12} color="#16a34a" />
                        <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>GPS: {addressForm.lat?.toFixed(4)}, {addressForm.lng?.toFixed(4)}</span>
                      </motion.div>
                    )}
                    <SaveButton saving={savingAddress} label="Save Address" />
                  </form>
                )}

                {/* Password Tab */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <FormFeedback feedback={passwordFeedback} />
                    <div style={{ fontSize: 12, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FiAlertTriangle size={13} color="#d97706" style={{ flexShrink: 0 }} />
                      You will be logged out after changing your password.
                    </div>
                    {[
                      { key: 'currentPassword', label: 'Current Password' },
                      { key: 'newPassword',     label: 'New Password'     },
                      { key: 'confirmPassword', label: 'Confirm Password' },
                    ].map(({ key, label }) => (
                      <Field key={key} label={label} icon={FiLock} type="password"
                        value={passwordForm[key]}
                        onChange={e => { setPasswordForm(p => ({ ...p, [key]: e.target.value })); setPasswordErrors(p => ({ ...p, [key]: '' })); }}
                        placeholder="••••••••" error={passwordErrors[key]} />
                    ))}
                    <SaveButton saving={savingPassword} label="Change Password" />
                  </form>
                )}

                {/* Danger Tab — only shows a button, modal handles the rest */}
                {activeTab === 'danger' && (
                  <div style={{ background: '#fef2f2', borderRadius: 16, padding: '20px', border: '1.5px solid #fecaca' }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiTrash2 size={15} color="#ef4444" />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#dc2626', margin: '0 0 3px' }}>Delete Account</p>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.55 }}>
                          Permanently deletes your account, orders, and all data. This <strong>cannot be undone</strong>.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => { setDeleteFeedback(null); setDeleteModalOpen(true); }}
                      style={{ fontSize: 12, fontWeight: 700, padding: '9px 18px', borderRadius: 10, background: '#fff', color: '#ef4444', border: '1.5px solid #fca5a5', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.16s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}>
                      I want to delete my account
                    </button>
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