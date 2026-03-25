import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'information',
    icon: '🗂',
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you create an account or place an order, we collect your name, email address, phone number, and delivery address. This information is essential to process your orders and provide customer support.',
      },
      {
        subtitle: 'Payment Information',
        text: 'We do not store your payment card details on our servers. All payment transactions are processed securely through our payment partners (Stripe). We only retain transaction IDs and order amounts for record-keeping.',
      },
      {
        subtitle: 'Usage Data',
        text: 'We automatically collect information about how you interact with NexaMart — pages visited, products viewed, search queries, and time spent. This helps us improve your shopping experience.',
      },
      {
        subtitle: 'Device Information',
        text: 'We collect device type, operating system, browser type, and IP address to ensure our platform works correctly across all devices and to detect fraudulent activity.',
      },
    ],
  },
  {
    id: 'usage',
    icon: '⚙️',
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Order Processing',
        text: 'Your personal and delivery information is used solely to process your orders, arrange delivery, and send you order updates and confirmations.',
      },
      {
        subtitle: 'Account Management',
        text: 'We use your information to maintain your account, authenticate your identity, and provide access to order history, saved addresses, and wishlists.',
      },
      {
        subtitle: 'Communication',
        text: 'We may send you transactional emails (order confirmations, shipping updates) and, with your consent, promotional emails about offers and new products. You can unsubscribe at any time.',
      },
      {
        subtitle: 'Platform Improvement',
        text: 'Aggregated, anonymised usage data helps us improve our product catalog, fix bugs, and enhance the overall shopping experience.',
      },
    ],
  },
  {
    id: 'sharing',
    icon: '🤝',
    title: 'Information Sharing',
    content: [
      {
        subtitle: 'We Never Sell Your Data',
        text: 'NexaMart does not sell, rent, or trade your personal information to third parties for their marketing purposes. Your data is yours.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We share necessary information with trusted service providers — delivery partners, payment processors, and cloud infrastructure providers — who are contractually obligated to protect your data.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required by law, court order, or government authority, or to protect the rights, property, or safety of NexaMart, our customers, or others.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: '🍪',
    title: 'Cookies & Tracking',
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'These are required for the platform to function — keeping you logged in, maintaining your cart, and enabling secure checkout. You cannot opt out of essential cookies.',
      },
      {
        subtitle: 'Analytics Cookies',
        text: 'We use analytics tools to understand how visitors use NexaMart. This data is anonymised and used only to improve the platform. You can opt out in your browser settings.',
      },
      {
        subtitle: 'Managing Cookies',
        text: 'You can control cookies through your browser settings. Disabling certain cookies may affect platform functionality such as staying logged in or cart persistence.',
      },
    ],
  },
  {
    id: 'security',
    icon: '🔒',
    title: 'Data Security',
    content: [
      {
        subtitle: 'Encryption',
        text: 'All data transmitted between your browser and our servers is encrypted using TLS (Transport Layer Security). Sensitive data at rest is encrypted using AES-256.',
      },
      {
        subtitle: 'Access Controls',
        text: 'Access to personal data is restricted to employees who need it to perform their job functions. All staff with data access undergo regular security training.',
      },
      {
        subtitle: 'Breach Response',
        text: 'In the unlikely event of a data breach affecting your personal information, we will notify you within 72 hours via email and provide guidance on protective measures.',
      },
    ],
  },
  {
    id: 'rights',
    icon: '⚖️',
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Portability',
        text: 'You have the right to request a copy of all personal data we hold about you in a portable format. Submit a request through your account settings or contact us at privacy@nexamart.com.',
      },
      {
        subtitle: 'Correction',
        text: 'You can update your personal information at any time through your account profile. If you find inaccurate data we cannot edit directly, contact our support team.',
      },
      {
        subtitle: 'Deletion',
        text: 'You may request deletion of your account and associated personal data. Note that we may retain certain information as required by law (e.g., transaction records for tax purposes).',
      },
      {
        subtitle: 'Objection & Restriction',
        text: 'You may object to or request restriction of certain processing activities, including direct marketing communications. We will honour your preferences within 30 days.',
      },
    ],
  },
  {
    id: 'retention',
    icon: '📅',
    title: 'Data Retention',
    content: [
      {
        subtitle: 'Account Data',
        text: 'We retain your account information for as long as your account is active. Upon account deletion, personal data is removed within 30 days, except where legal obligations require longer retention.',
      },
      {
        subtitle: 'Transaction Records',
        text: 'Order history and transaction records are retained for 7 years as required by financial regulations and tax law.',
      },
      {
        subtitle: 'Analytics Data',
        text: 'Anonymised analytics data may be retained indefinitely as it cannot be linked to any individual.',
      },
    ],
  },
  {
    id: 'contact',
    icon: '✉️',
    title: 'Contact Us',
    content: [
      {
        subtitle: 'Privacy Enquiries',
        text: 'For any questions about this Privacy Policy or your personal data, contact our Privacy Team at privacy@nexamart.com. We aim to respond within 5 business days.',
      },
      {
        subtitle: 'Updates to This Policy',
        text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform. Continued use of NexaMart after changes constitutes acceptance.',
      },
    ],
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('information');
  const [scrolled, setScrolled] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Update active section based on scroll
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = s.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');

        .pp-root {
          min-height: 100vh;
          background: #fafafa;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e;
        }

        /* ── Hero ── */
        .pp-hero {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
          padding: 72px 24px 64px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .pp-hero::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle at 20% 50%, rgba(167,139,250,0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2) 0%, transparent 40%);
          pointer-events: none;
        }
        .pp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #c7d2fe;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 20px;
          margin-bottom: 20px;
        }
        .pp-hero-title {
          font-size: clamp(32px, 6vw, 54px);
          font-weight: 800;
          color: #fff;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .pp-hero-title span {
          font-family: 'Pacifico', cursive;
          color: #a5b4fc;
        }
        .pp-hero-sub {
          font-size: 15px;
          color: #c7d2fe;
          margin: 0 auto;
          max-width: 480px;
          line-height: 1.7;
          font-weight: 400;
        }
        .pp-hero-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-top: 28px;
          flex-wrap: wrap;
        }
        .pp-hero-meta-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 500;
        }
        .pp-hero-meta-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6366f1;
        }

        /* ── Layout ── */
        .pp-body {
          max-width: 1080px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          align-items: start;
        }

        /* ── Sticky TOC ── */
        .pp-toc {
          position: sticky;
          top: 88px;
        }
        .pp-toc-title {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9ca3af;
          margin-bottom: 12px;
        }
        .pp-toc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.18s ease;
          border: 1px solid transparent;
          margin-bottom: 3px;
          white-space: nowrap;
        }
        .pp-toc-item:hover {
          background: #f3f4f6;
          color: #374151;
        }
        .pp-toc-item.active {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #e0e7ff;
          font-weight: 700;
        }
        .pp-toc-icon {
          font-size: 14px;
          flex-shrink: 0;
        }
        .pp-toc-bar {
          width: 3px;
          height: 14px;
          border-radius: 2px;
          background: #4f46e5;
          opacity: 0;
          transition: opacity 0.18s;
          flex-shrink: 0;
        }
        .pp-toc-item.active .pp-toc-bar { opacity: 1; }

        /* ── Sections ── */
        .pp-section {
          margin-bottom: 56px;
          scroll-margin-top: 100px;
        }
        .pp-section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1.5px solid #f3f4f6;
        }
        .pp-section-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #eef2ff, #ede9fe);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          border: 1px solid #e0e7ff;
        }
        .pp-section-title {
          font-size: 20px;
          font-weight: 800;
          color: #1e1b4b;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .pp-section-num {
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }

        /* ── Cards ── */
        .pp-card {
          background: #fff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 20px 22px;
          margin-bottom: 12px;
          transition: border-color 0.18s, box-shadow 0.18s;
          position: relative;
          overflow: hidden;
        }
        .pp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 3px 0 0 3px;
          opacity: 0;
          transition: opacity 0.18s;
        }
        .pp-card:hover { border-color: #e0e7ff; box-shadow: 0 4px 16px rgba(99,102,241,0.08); }
        .pp-card:hover::before { opacity: 1; }
        .pp-card-subtitle {
          font-size: 13px;
          font-weight: 700;
          color: #4f46e5;
          margin: 0 0 7px;
          letter-spacing: 0.01em;
        }
        .pp-card-text {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.75;
          margin: 0;
          font-weight: 400;
        }

        /* ── Back button ── */
        .pp-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #6366f1;
          background: #eef2ff;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.16s;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 32px;
        }
        .pp-back:hover { background: #e0e7ff; }

        /* ── Contact box ── */
        .pp-contact-box {
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          border-radius: 20px;
          padding: 32px;
          text-align: center;
          margin-top: 8px;
        }
        .pp-contact-box h3 {
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
        }
        .pp-contact-box p {
          font-size: 14px;
          color: #c7d2fe;
          margin: 0 0 20px;
          line-height: 1.6;
        }
        .pp-contact-email {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 50px;
          text-decoration: none;
          transition: all 0.18s;
        }
        .pp-contact-email:hover { background: rgba(255,255,255,0.2); }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .pp-body { grid-template-columns: 1fr; gap: 24px; padding: 24px 16px 60px; }
          .pp-toc { position: static; display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
          .pp-toc-title { display: none; }
          .pp-toc-item { font-size: 12px; padding: 5px 10px; margin-bottom: 0; }
          .pp-toc-bar { display: none; }
          .pp-hero { padding: 48px 20px 40px; }
        }
      `}</style>

      <div className="pp-root">

        {/* Hero */}
        <div className="pp-hero">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="pp-hero-badge">
              🔒 Privacy &amp; Data Protection
            </div>
            <h1 className="pp-hero-title">
              Privacy Policy
            </h1>
            <p className="pp-hero-sub">
              We believe privacy is a right, not a privilege. Here's exactly how <span style={{ fontFamily: "'Pacifico', cursive", color: '#a5b4fc' }}>NexaMart</span> collects, uses, and protects your data.
            </p>
            <div className="pp-hero-meta">
              <div className="pp-hero-meta-item">
                <div className="pp-hero-meta-dot" />
                Effective: 1 January 2025
              </div>
              <div className="pp-hero-meta-item">
                <div className="pp-hero-meta-dot" />
                Last updated: 19 March 2026
              </div>
              <div className="pp-hero-meta-item">
                <div className="pp-hero-meta-dot" />
                Version 2.1
              </div>
            </div>
          </motion.div>
        </div>

        <div className="pp-body">

          {/* TOC */}
          <nav className="pp-toc">
            <p className="pp-toc-title">Contents</p>
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                className={`pp-toc-item${activeSection === s.id ? ' active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                <div className="pp-toc-bar" />
                <span className="pp-toc-icon">{s.icon}</span>
                <span>{s.title}</span>
              </div>
            ))}
          </nav>

          {/* Content */}
          <main>
            <button className="pp-back" onClick={() => navigate(-1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>

            {SECTIONS.map((section, si) => (
              <motion.div
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className="pp-section"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="pp-section-header">
                  <div className="pp-section-icon">{section.icon}</div>
                  <div>
                    <span className="pp-section-num">0{si + 1}</span>
                    <h2 className="pp-section-title">{section.title}</h2>
                  </div>
                </div>

                {section.id === 'contact' ? (
                  <div className="pp-contact-box">
                    <h3>Get in touch</h3>
                    <p>
                      For any privacy concerns, data requests, or questions about this policy, our Privacy Team is here to help.
                    </p>
                    <a href="mailto:privacy@nexamart.com" className="pp-contact-email">
                      ✉️ privacy@nexamart.com
                    </a>
                    <p style={{ marginTop: 16, marginBottom: 0, fontSize: 12, color: '#818cf8' }}>
                      We aim to respond within 5 business days. For urgent matters, please mark your email as "URGENT".
                    </p>
                  </div>
                ) : (
                  section.content.map((item, ci) => (
                    <motion.div
                      key={ci}
                      className="pp-card"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: ci * 0.06 }}
                    >
                      <p className="pp-card-subtitle">{item.subtitle}</p>
                      <p className="pp-card-text">{item.text}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            ))}

            {/* Footer note */}
            <div style={{ marginTop: 40, padding: '20px 24px', background: '#f9fafb', borderRadius: 14, border: '1px solid #f3f4f6', fontSize: 13, color: '#9ca3af', lineHeight: 1.7 }}>
              <strong style={{ color: '#374151' }}>NexaMart</strong> is committed to complying with applicable data protection laws. This policy is reviewed regularly and updated when our practices change. For previous versions of this policy, contact our Privacy Team.
            </div>
          </main>
        </div>
      </div>
    </>
  );
}