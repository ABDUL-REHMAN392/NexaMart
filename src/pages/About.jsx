import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTwitter, FiLinkedin, FiChevronDown, FiChevronUp } from "react-icons/fi";
import ceo from "../assets/about/ceo.jpg";
import cto from "../assets/about/cto.jpg";
import hom from "../assets/about/hom.jpg";
/* ── Data ───────────────────────────────────────────────────────────────────── */
const teamMembers = [
  { id: 1, name: "Husnain Amjad",  role: "Founder & CEO",      img: ceo },
  { id: 2, name: "Hamza Razzaq",    role: "CTO",                img: cto },
  { id: 3, name: "Abrar Khalid",   role: "Head of Marketing",  img: hom },
];

const faqs = [
  { question: "What is NexaMart?",            answer: "NexaMart is a leading e-commerce platform offering a wide range of quality products with fast delivery and excellent customer service." },
  { question: "How can I contact support?",   answer: "You can reach out via the Contact page or email us at support@nexamart.com." },
  { question: "Do you offer international shipping?", answer: "Yes, we ship to many countries worldwide. Shipping charges and delivery times may vary." },
];

const testimonials = [
  { id: 1, name: "John Doe",     position: "Verified Buyer",     feedback: "NexaMart transformed the way I shop online! Fast, reliable, and great products." },
  { id: 2, name: "Emma Watson",  position: "Happy Customer",     feedback: "Amazing customer support and a huge variety of products. Highly recommend!" },
  { id: 3, name: "Liam Smith",   position: "Frequent Shopper",   feedback: "Quality products and timely delivery every time. I'm a loyal customer now." },
];

/* ── Stat Counter ───────────────────────────────────────────────────────────── */
function StatCounter({ number, label, emoji }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 40;
    const inc   = number / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= number) { setCount(number); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 50);
    return () => clearInterval(t);
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: '#fff', borderRadius: 20, padding: '28px 24px',
        border: '1.5px solid #ebebf5',
        boxShadow: '0 2px 16px rgba(99,102,241,0.07)',
        textAlign: 'center', flex: 1,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
      <p style={{
        fontSize: 32, fontWeight: 900, margin: '0 0 4px',
        background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.03em',
      }}>{count.toLocaleString()}+</p>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ── Team Card ─────────────────────────────────────────────────────────────── */
function TeamCard({ member, index }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.1 }}
      onClick={() => setFlipped(f => !f)}
      style={{
        width: 220, height: 280, cursor: 'pointer',
        perspective: '1000px', flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 20, overflow: 'hidden',
          border: '1.5px solid #ebebf5',
          boxShadow: '0 4px 20px rgba(99,102,241,0.1)',
        }}>
          <img src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(30,27,75,0.85), transparent)',
            padding: '20px 16px 16px',
          }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>{member.name}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0', fontWeight: 500 }}>Click to flip</p>
          </div>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24, textAlign: 'center',
          transform: 'rotateY(180deg)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, border: '2px solid rgba(255,255,255,0.25)',
          }}>
            <img src={member.img} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>{member.name}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 16px', fontWeight: 600 }}>{member.role}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 18px', lineHeight: 1.5 }}>
            Dedicated to delivering top-tier experiences.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[FiTwitter, FiLinkedin].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── FAQ Item ─────────────────────────────────────────────────────────────── */
function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      onClick={() => setOpen(o => !o)}
      style={{
        background: open ? '#fff' : '#fff',
        border: `1.5px solid ${open ? '#c7d2fe' : '#ebebf5'}`,
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        boxShadow: open ? '0 4px 16px rgba(99,102,241,0.1)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: open ? '#6366f1' : '#1e1b4b', margin: 0, flex: 1 }}>
          {faq.question}
        </p>
        <div style={{ color: '#6366f1', marginLeft: 12, flexShrink: 0 }}>
          {open ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, padding: '0 20px 16px', lineHeight: 1.7 }}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Testimonial Card ──────────────────────────────────────────────────────── */
function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      style={{
        background: '#fff', borderRadius: 20, padding: '24px',
        border: '1.5px solid #ebebf5',
        boxShadow: '0 4px 20px rgba(99,102,241,0.07)',
      }}
    >
      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: '0 0 16px', fontStyle: 'italic' }}>
        "{t.feedback}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
        }}>{t.name.charAt(0)}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{t.name}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{t.position}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)',
        fontFamily: "'DM Sans', sans-serif",
        padding: '0 20px 60px',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '56px 0 48px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#eef2ff', border: '1px solid #e0e7ff',
              borderRadius: 20, padding: '5px 14px', marginBottom: 18,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                Our Story
              </span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 900, color: '#1e1b4b', margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              About{' '}
              <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>NexaMart</span>
            </h1>
            <p style={{ fontSize: 16, color: '#6b7280', margin: '0 auto', maxWidth: 580, lineHeight: 1.7 }}>
              Your trusted online shopping destination delivering quality, variety, and excellent service to customers worldwide.
            </p>
          </motion.div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 48, flexWrap: 'wrap' }}>
            <StatCounter number={10000} label="Happy Customers" emoji="😊" />
            <StatCounter number={500}   label="Products Available" emoji="📦" />
            <StatCounter number={24}    label="7/24 Support" emoji="🎧" />
          </div>

          {/* Mission & Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
            {[
              { emoji: '🎯', title: 'Mission', text: 'To provide the best online shopping experience through innovation, quality products, and exceptional customer service.' },
              { emoji: '👁️', title: 'Vision',  text: 'To be the world\'s most customer-centric marketplace, where people find anything they want online.' },
            ].map(({ emoji, title, text }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, x: i === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4 }}
                style={{
                  background: '#fff', borderRadius: 20, padding: '28px 24px',
                  border: '1.5px solid #ebebf5',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.07)',
                }}
              >
                <p style={{ fontSize: 28, margin: '0 0 12px' }}>{emoji}</p>
                <h2 style={{
                  fontSize: 20, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{title}</h2>
                <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 }}>{text}</p>
              </motion.div>
            ))}
          </div>

          {/* Team */}
          <div style={{ marginBottom: 48 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 28 }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>
                Meet Our{' '}
                <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Team</span>
              </h2>
              <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 8 }}>Click a card to learn more</p>
            </motion.div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              {teamMembers.map((m, i) => <TeamCard key={m.id} member={m} index={i} />)}
            </div>
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: 48 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 28 }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>
                What Customers{' '}
                <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Say</span>
              </h2>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
              {testimonials.map((t, i) => <TestimonialCard key={t.id} t={t} index={i} />)}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 48 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 28 }}
            >
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1e1b4b', margin: 0, letterSpacing: '-0.02em' }}>
                Frequently Asked{' '}
                <span style={{ color: '#6366f1', fontFamily: "'Pacifico', cursive" }}>Questions</span>
              </h2>
            </motion.div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 680, margin: '0 auto' }}>
              {faqs.map((f, i) => <FAQItem key={i} faq={f} index={i} />)}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg,#1e1b4b,#312e81)',
              borderRadius: 24, padding: '52px 40px', textAlign: 'center',
              boxShadow: '0 20px 60px rgba(30,27,75,0.25)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(99,102,241,0.2)' }} />
            <h3 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em', position: 'relative' }}>
              Ready to experience{' '}
              <span style={{ color: '#a78bfa', fontFamily: "'Pacifico', cursive" }}>NexaMart</span>?
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', margin: '0 auto 28px', maxWidth: 480, lineHeight: 1.7, position: 'relative' }}>
              Join thousands of satisfied customers shopping smarter and faster today.
            </p>
            <button
              onClick={() => navigate('/contact')}
              style={{
                padding: '13px 36px', borderRadius: 50,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
                transition: 'all 0.2s ease', position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'; }}
            >
              Contact Us Now →
            </button>
          </motion.div>

        </div>
      </div>
    </>
  );
}