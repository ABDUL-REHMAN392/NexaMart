import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const links = {
  Company: [
    { label: "About Us",   path: "/about"   },
    { label: "Careers",    path: "#"        },
    { label: "Blog",       path: "#"        },
    { label: "Press",      path: "#"        },
  ],
  Support: [
    { label: "Help Center",       path: "#"        },
    { label: "Terms of Service",  path: "#"        },
    { label: "Privacy Policy",    path: "#"        },
    { label: "Contact",           path: "/contact" },
  ],
};

const socials = [
  { Icon: FaFacebookF,  href: "#", label: "Facebook"  },
  { Icon: FaTwitter,    href: "#", label: "Twitter"   },
  { Icon: FaInstagram,  href: "#", label: "Instagram" },
  { Icon: FaLinkedinIn, href: "#", label: "LinkedIn"  },
];

/* ── Social button ──────────────────────────────────────────────────────────── */
function SocialBtn({ Icon, href, label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 38, height: 38, borderRadius: 11,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hov ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
        color: hov ? '#fff' : 'rgba(255,255,255,0.5)',
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 8px 20px rgba(99,102,241,0.4)' : 'none',
      }}
    >
      <Icon size={13} />
    </a>
  );
}

/* ── Nav link ───────────────────────────────────────────────────────────────── */
function FLink({ label, path }) {
  const [hov, setHov] = useState(false);
  return (
    <NavLink
      to={path}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 13, fontWeight: 500,
        color: hov ? '#818cf8' : 'rgba(255,255,255,0.45)',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      {label}
    </NavLink>
  );
}

/* ── Main Footer ────────────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail]      = useState('');
  const [subscribed, setSubed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubed(true);
    setEmail('');
    setTimeout(() => setSubed(false), 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-18px,18px)} }
        .ft-sub-btn:hover { filter:brightness(1.12); transform:scale(1.04); }
        .ft-sub-btn { transition:all 0.18s ease; }
        .ft-input::placeholder { color:rgba(255,255,255,0.25); }
        footer p { margin-block-start: 0; margin-block-end: 0; } /* ✅ browser default p margin reset */

        /* Mobile: single column */
        @media(max-width:640px) {
          .ft-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .ft-inner { padding: 36px 16px 20px !important; }
        }
        /* Tablet: 2 columns */
        @media(min-width:641px) and (max-width:900px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; }
          .ft-inner { padding: 48px 24px 24px !important; }
        }
      `}</style>

      <footer style={{
        background: 'linear-gradient(145deg,#060414 0%,#0d0b24 40%,#070d20 100%)',
        color: '#fff',
        marginTop: 0,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'DM Sans',sans-serif",
      }}>

        {/* ── Ambient orbs ── */}
        <div style={{ position:'absolute', top:-80, left:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%)', animation:'orb-a 12s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 65%)', animation:'orb-b 15s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', right:'30%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 65%)', pointerEvents:'none' }} />

        {/* ── Dot grid texture ── */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize:'28px 28px',
        }} />

        {/* ── Top accent line ── */}
        <div style={{ height:2, background:'linear-gradient(90deg,transparent,#6366f1,#8b5cf6,#a78bfa,transparent)', position:'relative', zIndex:1 }} />

        <div className="ft-inner" style={{ maxWidth:1280, margin:'0 auto', padding:'60px 40px 32px', position:'relative', zIndex:1 }}>

          {/* ── Main grid ── */}
          <div className="ft-grid" style={{
            display:'grid',
            gridTemplateColumns:'1.6fr 1fr 1fr 1.4fr',
            gap:48,
            paddingBottom:48,
            alignItems: 'start', /* ✅ FIX: columns apni actual height tak rahenge */
            borderBottom:'1px solid rgba(255,255,255,0.07)',
          }}>

            {/* Brand col */}
            <div>
              <div style={{ marginBottom:18 }}>
                <span style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'-0.02em' }}>Nexa</span>
                <span style={{ fontSize:26, color:'#818cf8', fontFamily:"'Pacifico',cursive" }}>Mart</span>
              </div>

              <div style={{ fontSize:13, color:'rgba(255,255,255,0.38)', lineHeight:1.75, margin:'0 0 24px', maxWidth:260 }}>
                Your one-stop destination for quality products and seamless shopping. Discover more, spend less.
              </div>

              {/* Social buttons */}
              <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
                {socials.map(s => <SocialBtn key={s.label} {...s} />)}
              </div>

              {/* Trust badges */}
              <div style={{ display:'flex', alignItems:'center', gap:14, opacity:0.28, flexWrap:'wrap' }}>
                {['paypal','visa','mastercard'].map(b => (
                  <img key={b}
                    src={`https://cdn.simpleicons.org/${b}/ffffff`}
                    alt={b} style={{ height:14, objectFit:'contain' }}
                    onError={e => { e.currentTarget.style.display='none'; }}
                  />
                ))}
              </div>
            </div>

            {/* Link cols */}
            {Object.entries(links).map(([title, items]) => (
              <div key={title} style={{ alignSelf: 'start' }}>
                <div style={{
                  fontSize:10, fontWeight:800, letterSpacing:'0.12em',
                  textTransform:'uppercase', color:'rgba(255,255,255,0.25)',
                  marginBottom: 20,
                }}>{title}</div>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12 }}>
                  {items.map(({ label, path }) => (
                    <li key={label}><FLink label={label} path={path} /></li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter col */}
            <div style={{ alignSelf: 'start' }}>
              <div style={{
                fontSize:10, fontWeight:800, letterSpacing:'0.12em',
                textTransform:'uppercase', color:'rgba(255,255,255,0.25)',
                marginBottom: 20,
              }}>Newsletter</div>

              <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:6, lineHeight:1.4 }}>
                Exclusive deals, first.
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:18, lineHeight:1.6 }}>
                Join 10,000+ shoppers getting weekly deals straight to their inbox.
              </div>

              {subscribed ? (
                <div style={{
                  padding:'13px 16px', borderRadius:13,
                  background:'rgba(34,197,94,0.12)',
                  border:'1px solid rgba(34,197,94,0.3)',
                  fontSize:13, fontWeight:600, color:'#4ade80',
                  display:'flex', alignItems:'center', gap:8,
                }}>
                  ✓ Subscribed! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div style={{ marginBottom:10, position:'relative' }}>
                    <FiMail style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.3)' }} size={14} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="ft-input"
                      style={{
                        width:'100%', boxSizing:'border-box',
                        paddingLeft:36, paddingRight:14,
                        paddingTop:11, paddingBottom:11,
                        borderRadius:12,
                        background:'rgba(255,255,255,0.06)',
                        border:'1px solid rgba(255,255,255,0.12)',
                        color:'#fff', fontSize:13,
                        outline:'none', fontFamily:'inherit',
                        transition:'border-color 0.18s',
                      }}
                      onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.5)'; }}
                      onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.12)'; }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="ft-sub-btn"
                    style={{
                      width:'100%', padding:'11px',
                      borderRadius:12, border:'none',
                      background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      color:'#fff', fontSize:13, fontWeight:700,
                      cursor:'pointer', fontFamily:'inherit',
                      boxShadow:'0 6px 20px rgba(99,102,241,0.35)',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                    }}
                  >
                    Subscribe <FiArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            paddingTop:24, flexWrap:'wrap', gap:12,
          }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.18)', margin:0 }}>
              © {new Date().getFullYear()} NexaMart. All rights reserved.
            </div>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {['Privacy','Terms','Cookies'].map(t => (
                <a key={t} href="#" style={{ fontSize:11, color:'rgba(255,255,255,0.22)', textDecoration:'none', transition:'color 0.15s' }}
                  onMouseEnter={e => { e.target.style.color='rgba(255,255,255,0.6)'; }}
                  onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.22)'; }}
                >{t}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}