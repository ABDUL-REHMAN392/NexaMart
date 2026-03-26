import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowStarRating from '../component/ShowStarRating';
import { FaHeart, FaStar } from 'react-icons/fa';
import { FiHeart, FiShoppingCart, FiCheck, FiX, FiShoppingBag, FiZoomIn } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { api } from '../api/api';

function Skel({ w='100%', h=14, r=8, style={} }) {
  return <div className="skel-sp" style={{ width:w, height:h, borderRadius:r, display:'block', ...style }} />;
}

function ZoomModal({ src, alt, onClose }) {
  useEffect(() => {
    const esc = e => { if (e.key==='Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow=''; };
  }, []);
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
        style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(10,8,30,0.88)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, cursor:'zoom-out' }}
      >
        <motion.div initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.85, opacity:0 }}
          transition={{ type:'spring', stiffness:260, damping:22 }} onClick={e=>e.stopPropagation()}
          style={{ position:'relative', maxWidth:'90vw', maxHeight:'90vh' }}
        >
          <img src={src} alt={alt} style={{ maxWidth:'88vw', maxHeight:'88vh', objectFit:'contain', borderRadius:16, display:'block', boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }} />
          <button onClick={onClose} style={{ position:'absolute', top:-14, right:-14, width:36, height:36, borderRadius:'50%', background:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(0,0,0,0.3)' }}>
            <FiX size={16} color="#374151" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SingleProduct() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const productId = parseInt(id);

  const { isAuthenticated }             = useAuthStore();
  const { addToCart }                   = useCartStore();
  const { toggleFavorite, isFavorited } = useFavoriteStore();

  const [product, setProduct]         = useState(null);
  const [isLoading, setLoading]       = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [zoomSrc, setZoomSrc]         = useState(null);
  const [cartState, setCartState]     = useState('idle');
  const [favLoading, setFavLoading]   = useState(false);
  const [dummyRevs, setDummyRevs]     = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [summary, setSummary]         = useState(null);
  const [revLoading, setRevLoading]   = useState(true);
  const [myReview, setMyReview]       = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [reviewForm, setReviewForm]   = useState({ rating:5, title:'', body:'' });
  const [submitting, setSubmitting]   = useState(false);
  const [hoverStar, setHoverStar]     = useState(0);

  const favorited = isFavorited(productId);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        if (!res.ok) throw new Error();
        const p = await res.json();
        setProduct({ ...p, finalPrice:parseFloat((p.price-(p.price*p.discountPercentage)/100).toFixed(2)), image:p.images?.[0]||p.thumbnail });
      } catch {}
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        if (data.reviews?.length) setDummyRevs(data.reviews);
      } catch {}
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      setRevLoading(true);
      try {
        const res = await api.get(`/reviews/product/${productId}`);
        setReviews(res.data.reviews);
        setSummary(res.data.summary);
      } catch {}
      finally { setRevLoading(false); }
    })();
  }, [productId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const res = await api.get(`/reviews/check/${productId}`);
        if (res.data.hasReviewed) setMyReview(res.data.review);
      } catch {}
    })();
  }, [productId, isAuthenticated]);

  const handleCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (cartState!=='idle'||!product) return;
    setCartState('loading');
    try {
      await addToCart({ productId, title:product.title, price:product.finalPrice, image:product.image, brand:product.brand||'', category:product.category||'', rating:product.rating||0 });
      setCartState('success'); setTimeout(()=>setCartState('idle'),2200);
    } catch (err) { setCartState('error'); setTimeout(()=>setCartState('idle'),2500); }
  };

  const handleBuyNow  = async () => { await handleCart(); navigate('/checkout'); };
  const handleFavorite = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (favLoading) return;
    setFavLoading(true);
    try {
      await toggleFavorite({ productId, title:product.title, price:product.finalPrice, image:product.image, brand:product.brand||'', category:product.category||'', rating:product.rating||0 });
    } catch {}
    finally { setFavLoading(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.title.trim()) return;
    if (reviewForm.body.trim().length<10) return;
    setSubmitting(true);
    try {
      const res = await api.post('/reviews', { productId, productTitle:product.title, productImage:product.image, ...reviewForm });
      setReviews(p=>[res.data.review,...p]); setMyReview(res.data.review); setShowForm(false);
    } catch {}
    finally { setSubmitting(false); }
  };

  const cbtn = {
    idle:    { icon:<FiShoppingCart size={15}/>, text:'Add to Cart', bg:'linear-gradient(135deg,#6366f1,#8b5cf6)', shadow:'0 6px 20px rgba(99,102,241,0.3)' },
    loading: { icon:<svg style={{animation:'spin 0.8s linear infinite'}} width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/><path d="M22 12a10 10 0 0 0-10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/></svg>, text:'Adding…', bg:'linear-gradient(135deg,#818cf8,#a78bfa)', shadow:'none' },
    success: { icon:<FiCheck size={15} strokeWidth={2.5}/>, text:'Added! ✓', bg:'linear-gradient(135deg,#22c55e,#16a34a)', shadow:'0 6px 20px rgba(34,197,94,0.3)' },
    error:   { icon:<FiX size={15}/>, text:'Failed', bg:'linear-gradient(135deg,#ef4444,#dc2626)', shadow:'none' },
  }[cartState];

  const discount = product ? Math.round(((product.price-product.finalPrice)/product.price)*100) : 0;

  const allReviews = [
    ...reviews,
    ...dummyRevs.map((r,i) => ({
      _id:`dummy-${i}`,
      user:{ name:r.reviewerName },
      rating:r.rating,
      title:r.comment?.split(' ').slice(0,5).join(' ')+'…',
      body:r.comment,
      createdAt:r.date,
    })),
  ];

  const displaySummary = summary&&summary.totalReviews>0 ? summary : (() => {
    if (!allReviews.length) return null;
    const total=allReviews.length, avg=(allReviews.reduce((s,r)=>s+r.rating,0)/total).toFixed(1);
    const bd={5:0,4:0,3:0,2:0,1:0};
    allReviews.forEach(r=>{ if(bd[r.rating]!==undefined) bd[r.rating]++; });
    return { totalReviews:total, averageRating:avg, breakdown:bd };
  })();

  if (!isLoading&&!product) return <div style={{ textAlign:'center', marginTop:80, color:'#ef4444' }}>Product not found.</div>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer-sp{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .skel-sp{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:600px 100%;animation:shimmer-sp 1.4s infinite;}
        .thumb-btn{transition:all 0.18s ease;}
        .thumb-btn:hover{border-color:#a5b4fc !important;transform:scale(1.06);}
        .sp-action{transition:all 0.2s ease;}
        .sp-action:hover{transform:translateY(-1px);filter:brightness(1.08);}
        .sp-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;}
        .sp-rev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
        .rev-card{transition:box-shadow 0.22s,border-color 0.22s,transform 0.22s;}
        .rev-card:hover{box-shadow:0 14px 40px rgba(99,102,241,0.14)!important;border-color:#c7d2fe!important;transform:translateY(-3px);}
        @media(max-width:740px){.sp-grid{grid-template-columns:1fr!important;gap:24px!important;}.sp-title-row{padding:28px 0 20px!important;}}
        @media(max-width:480px){.sp-rev-grid{grid-template-columns:1fr!important;}.sp-action-row{flex-direction:column!important;}.sp-action-row button{width:100%!important;justify-content:center!important;}.sp-fav-btn{width:100%!important;height:44px!important;}}
      `}</style>

      {zoomSrc && <ZoomModal src={zoomSrc} alt={product?.title} onClose={()=>setZoomSrc(null)} />}

      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#f0f0ff 0%,#fafaff 60%,#f5f0ff 100%)', fontFamily:"'DM Sans',sans-serif", padding:'0 20px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {/* Header */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="sp-title-row"
            style={{ textAlign:'center', padding:'36px 0 28px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap' }}
          >
            {isLoading ? <><Skel w={80} h={22}/><Skel w={160} h={22}/><Skel w={110} h={22}/></> : (
              <>
                <span style={{ fontSize:18, fontWeight:500, color:'#9ca3af' }}>Discover</span>
                <span style={{ fontSize:18, color:'#6366f1', fontFamily:"'Pacifico',cursive" }}>{product?.title}</span>
                <span style={{ fontSize:18, fontWeight:500, color:'#9ca3af' }}>— A Must-Have!</span>
              </>
            )}
          </motion.div>

          {/* Product grid */}
          <div className="sp-grid">
            {/* Images */}
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}>
              {isLoading ? <Skel h={380} r={20}/> : (
                <>
                  <div onClick={()=>setZoomSrc(product?.images?.[selectedImg]||product?.thumbnail)}
                    style={{ background:'#fff', borderRadius:20, border:'1.5px solid #ebebf5', boxShadow:'0 4px 24px rgba(99,102,241,0.09)', display:'flex', alignItems:'center', justifyContent:'center', height:380, overflow:'hidden', position:'relative', cursor:'zoom-in' }}
                  >
                    {discount>0 && <span style={{ position:'absolute', top:14, left:14, background:'linear-gradient(135deg,#ef4444,#f97316)', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:20, boxShadow:'0 3px 8px rgba(239,68,68,0.35)' }}>-{discount}%</span>}
                    <div style={{ position:'absolute', top:14, right:14, background:'rgba(255,255,255,0.9)', borderRadius:8, padding:'5px 8px', display:'flex', alignItems:'center', gap:4, fontSize:10, fontWeight:600, color:'#6b7280', backdropFilter:'blur(4px)', border:'1px solid #ebebf5' }}>
                      <FiZoomIn size={11}/> Click to zoom
                    </div>
                    <motion.img key={selectedImg} initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.28 }}
                      src={product?.images?.[selectedImg]||product?.thumbnail} alt={product?.title}
                      style={{ maxHeight:310, maxWidth:'90%', objectFit:'contain' }}
                    />
                  </div>
                  {product?.images?.length>1 && (
                    <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
                      {product.images.slice(0,6).map((img,i) => (
                        <button key={i} onClick={()=>setSelectedImg(i)} className="thumb-btn"
                          style={{ width:60, height:60, borderRadius:10, overflow:'hidden', border:`2px solid ${selectedImg===i?'#6366f1':'#ebebf5'}`, background:'#f8f8fc', cursor:'pointer', padding:0, boxShadow:selectedImg===i?'0 3px 12px rgba(99,102,241,0.28)':'none' }}
                        >
                          <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.45, ease:[0.22,1,0.36,1], delay:0.08 }} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {isLoading ? (
                <><Skel w="75%" h={32} r={8}/><Skel w="45%" h={14}/><Skel w="35%" h={28}/><Skel h={14}/><Skel h={14}/><Skel w="80%" h={14}/><div style={{ display:'flex', gap:10, marginTop:8 }}><Skel w={130} h={44} r={12}/><Skel w={44} h={44} r={12}/><Skel w={110} h={44} r={12}/></div></>
              ) : (
                <>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {product?.brand && <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', background:'#eef2ff', color:'#6366f1', border:'1px solid #e0e7ff', borderRadius:20, padding:'4px 12px' }}>{product.brand}</span>}
                    <span style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', background:'#f0fdf4', color:'#16a34a', border:'1px solid #bbf7d0', borderRadius:20, padding:'4px 12px' }}>{product?.availabilityStatus||'In Stock'}</span>
                  </div>
                  <h1 style={{ fontSize:26, fontWeight:900, color:'#1e1b4b', margin:0, letterSpacing:'-0.02em', lineHeight:1.2 }}>{product?.title}</h1>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <ShowStarRating rating={product?.rating||0}/>
                    <span style={{ fontSize:13, color:'#6b7280', fontWeight:500 }}>({product?.rating})</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                    <span style={{ fontSize:30, fontWeight:900, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.02em' }}>${product?.finalPrice?.toFixed(2)}</span>
                    {product?.price!==product?.finalPrice && <span style={{ fontSize:16, color:'#d1d5db', textDecoration:'line-through', fontWeight:500 }}>${product?.price}</span>}
                  </div>
                  <p style={{ fontSize:14, color:'#6b7280', lineHeight:1.75, margin:0 }}>{product?.description}</p>
                  {product?.returnPolicy && <div style={{ fontSize:12, color:'#6b7280', padding:'10px 14px', background:'#f8f8fc', borderRadius:10, border:'1px solid #ebebf5' }}>🔄 {product.returnPolicy}</div>}
                  <div className="sp-action-row" style={{ display:'flex', gap:10, marginTop:4, flexWrap:'wrap' }}>
                    <motion.button onClick={handleCart} disabled={cartState==='loading'} whileTap={{ scale:0.97 }} className="sp-action"
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:14, border:'none', background:cbtn.bg, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:cbtn.shadow, fontFamily:"'DM Sans',sans-serif" }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span key={cartState} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:0.13 }} style={{ display:'flex', alignItems:'center', gap:8 }}>
                          {cbtn.icon} {cbtn.text}
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>
                    <motion.button onClick={handleFavorite} disabled={favLoading} whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }} className="sp-fav-btn"
                      style={{ width:46, height:46, borderRadius:14, border:`1.5px solid ${favorited?'#c7d2fe':'#ebebf5'}`, background:favorited?'#eef2ff':'#f8f8fc', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:favorited?'0 2px 10px rgba(99,102,241,0.2)':'none', transition:'all 0.18s' }}
                    >
                      <AnimatePresence mode="wait">
                        {favorited
                          ? <motion.span key="f" initial={{ scale:0.5, rotate:-10 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0.5 }} transition={{ type:'spring', stiffness:280 }}><FaHeart size={17} color="#6366f1"/></motion.span>
                          : <motion.span key="o" initial={{ scale:0.5 }} animate={{ scale:1 }} exit={{ scale:0.5 }} transition={{ duration:0.15 }}><FiHeart size={17} color="#9ca3af"/></motion.span>
                        }
                      </AnimatePresence>
                    </motion.button>
                    <motion.button onClick={handleBuyNow} whileTap={{ scale:0.97 }} className="sp-action"
                      style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px', borderRadius:14, border:'1.5px solid #ebebf5', background:'#f8f8fc', color:'#374151', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}
                    >
                      <FiShoppingBag size={15}/> Buy Now
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* ── Reviews ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ marginTop:52 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <h2 style={{ fontSize:22, fontWeight:900, color:'#1e1b4b', margin:0, letterSpacing:'-0.01em' }}>
                  Customer <span style={{ color:'#6366f1', fontFamily:"'Pacifico',cursive" }}>Reviews</span>
                </h2>
              </div>
              {isAuthenticated && !myReview && (
                <motion.button onClick={()=>setShowForm(v=>!v)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  style={{ padding:'9px 20px', borderRadius:12, border:`1.5px solid ${showForm?'#6366f1':'#e0e7ff'}`, background:showForm?'linear-gradient(135deg,#6366f1,#8b5cf6)':'#eef2ff', color:showForm?'#fff':'#6366f1', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all 0.18s', boxShadow:showForm?'0 4px 14px rgba(99,102,241,0.28)':'none' }}
                >{showForm?'✕ Cancel':'✍️ Write a Review'}</motion.button>
              )}
            </div>

            {/* Summary */}
            {displaySummary&&displaySummary.totalReviews>0 && (
              <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                style={{ display:'flex', gap:28, alignItems:'center', background:'#fff', borderRadius:20, padding:'22px 26px', border:'1.5px solid #ebebf5', boxShadow:'0 4px 20px rgba(99,102,241,0.08)', marginBottom:24, flexWrap:'wrap' }}
              >
                <div style={{ textAlign:'center', minWidth:90 }}>
                  <p style={{ fontSize:44, fontWeight:900, margin:'0 0 4px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.04em', lineHeight:1 }}>{displaySummary.averageRating}</p>
                  <ShowStarRating rating={Number(displaySummary.averageRating)}/>
                  <p style={{ fontSize:11, color:'#9ca3af', margin:'5px 0 0', fontWeight:500 }}>{displaySummary.totalReviews} reviews</p>
                </div>
                <div style={{ flex:1, minWidth:180, display:'flex', flexDirection:'column', gap:7 }}>
                  {[5,4,3,2,1].map(star => {
                    const cnt=displaySummary.breakdown?.[star]||0, pct=displaySummary.totalReviews?(cnt/displaySummary.totalReviews)*100:0;
                    return (
                      <div key={star} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:12, color:'#6b7280', fontWeight:600, width:8 }}>{star}</span>
                        <FaStar size={10} color="#f59e0b"/>
                        <div style={{ flex:1, background:'#f0f0f8', borderRadius:99, height:6, overflow:'hidden' }}>
                          <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7, ease:'easeOut', delay:0.2 }}
                            style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#6366f1,#8b5cf6)' }}/>
                        </div>
                        <span style={{ fontSize:11, color:'#9ca3af', width:18 }}>{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Review form */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity:0, height:0, marginBottom:0 }} animate={{ opacity:1, height:'auto', marginBottom:24 }} exit={{ opacity:0, height:0, marginBottom:0 }} transition={{ duration:0.28 }} style={{ overflow:'hidden' }}>
                  <form onSubmit={handleReviewSubmit} style={{ background:'#fff', borderRadius:22, padding:'28px', border:'1.5px solid #e0e7ff', boxShadow:'0 8px 32px rgba(99,102,241,0.12)', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)' }} />
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, marginTop:4 }}>
                      <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, boxShadow:'0 4px 14px rgba(99,102,241,0.3)' }}>✍️</div>
                      <div>
                        <p style={{ fontSize:16, fontWeight:900, color:'#1e1b4b', margin:0, letterSpacing:'-0.01em' }}>Share Your Experience</p>
                        <p style={{ fontSize:12, color:'#9ca3af', margin:0 }}>Your review helps other shoppers</p>
                      </div>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#9ca3af', margin:'0 0 10px' }}>Your Rating</p>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        {[1,2,3,4,5].map(s => (
                          <motion.button key={s} type="button" whileHover={{ scale:1.2 }} whileTap={{ scale:0.9 }}
                            onClick={()=>setReviewForm(f=>({...f,rating:s}))} onMouseEnter={()=>setHoverStar(s)} onMouseLeave={()=>setHoverStar(0)}
                            style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}
                          >
                            <FaStar size={28} color={(hoverStar||reviewForm.rating)>=s?'#f59e0b':'#e5e7eb'}
                              style={{ filter:(hoverStar||reviewForm.rating)>=s?'drop-shadow(0 2px 4px rgba(245,158,11,0.4))':'none', transition:'all 0.15s' }}/>
                          </motion.button>
                        ))}
                        <span style={{ fontSize:13, color:'#6b7280', fontWeight:600, marginLeft:8 }}>
                          {['','Poor','Fair','Good','Great','Excellent'][hoverStar||reviewForm.rating]}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#9ca3af', display:'block', marginBottom:6 }}>Review Title</label>
                      <input type="text" placeholder="Sum it up in a few words..." value={reviewForm.title} onChange={e=>setReviewForm(f=>({...f,title:e.target.value}))}
                        style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #ebebf5', background:'#f8f8fc', fontSize:13, color:'#1e1b4b', outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif" }}
                        onFocus={e=>{e.target.style.borderColor='#a5b4fc';}} onBlur={e=>{e.target.style.borderColor='#ebebf5';}}/>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#9ca3af', display:'block', marginBottom:6 }}>Your Review</label>
                      <textarea placeholder="Tell others what you think... (min 10 characters)" value={reviewForm.body} onChange={e=>setReviewForm(f=>({...f,body:e.target.value}))} rows={4}
                        style={{ width:'100%', padding:'11px 14px', borderRadius:12, border:'1.5px solid #ebebf5', background:'#f8f8fc', fontSize:13, color:'#1e1b4b', outline:'none', boxSizing:'border-box', fontFamily:"'DM Sans',sans-serif", resize:'none', lineHeight:1.6 }}
                        onFocus={e=>{e.target.style.borderColor='#a5b4fc';}} onBlur={e=>{e.target.style.borderColor='#ebebf5';}}/>
                      <p style={{ fontSize:11, color:reviewForm.body.length<10&&reviewForm.body.length>0?'#ef4444':'#9ca3af', margin:'5px 0 0', textAlign:'right' }}>{reviewForm.body.length} / 10 min chars</p>
                    </div>
                    <div style={{ display:'flex', gap:10 }}>
                      <motion.button type="submit" disabled={submitting} whileTap={{ scale:0.97 }}
                        style={{ flex:1, padding:'12px', borderRadius:13, border:'none', background:submitting?'linear-gradient(135deg,#a5b4fc,#c4b5fd)':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontSize:13, fontWeight:700, cursor:submitting?'not-allowed':'pointer', fontFamily:"'DM Sans',sans-serif", boxShadow:submitting?'none':'0 6px 18px rgba(99,102,241,0.3)' }}
                      >{submitting?'⏳ Submitting...':'🌟 Submit Review'}</motion.button>
                      <button type="button" onClick={()=>setShowForm(false)} style={{ padding:'12px 20px', borderRadius:13, border:'1.5px solid #ebebf5', background:'#f8f8fc', color:'#6b7280', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Cancel</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reviews list */}
            {revLoading ? (
              <div className="sp-rev-grid">
                {[1,2,3].map(i => (
                  <div key={i} style={{ background:'#fff', borderRadius:22, padding:'22px', border:'1.5px solid #ebebf5', display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                      <Skel w={46} h={46} r={23}/>
                      <div style={{ flex:1 }}><Skel w="55%" h={13} style={{ marginBottom:7 }}/><Skel w="35%" h={10}/></div>
                    </div>
                    <div style={{ display:'flex', gap:3 }}>{[1,2,3,4,5].map(s=><Skel key={s} w={14} h={14} r={4}/>)}</div>
                    <Skel h={1}/>
                    <Skel h={13} w="75%"/>
                    <Skel h={11}/><Skel h={11} w="85%"/>
                  </div>
                ))}
              </div>
            ) : allReviews.length===0 ? (
              <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
                style={{ textAlign:'center', padding:'56px 24px', background:'#fff', borderRadius:24, border:'1.5px solid #ebebf5', boxShadow:'0 4px 24px rgba(99,102,241,0.07)' }}
              >
                <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#ede9fe,#e0e7ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, margin:'0 auto 18px' }}>⭐</div>
                <p style={{ fontSize:16, fontWeight:800, color:'#1e1b4b', margin:'0 0 6px' }}>No reviews yet</p>
                <p style={{ fontSize:13, color:'#9ca3af', margin:0 }}>Be the first to share your experience!</p>
              </motion.div>
            ) : (
              <div className="sp-rev-grid">
                {allReviews.map((rev,i) => {
                  const palette=['#6366f1','#8b5cf6','#ec4899','#10b981','#f59e0b','#3b82f6','#ef4444'];
                  const col   = palette[(rev.user?.name?.charCodeAt(0)||65) % palette.length];
                  const stars = Math.round(rev.rating);
                  return (
                    <motion.div key={rev._id} className="rev-card"
                      initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }}
                      transition={{ delay:Math.min(i,5)*0.06, duration:0.34, ease:[0.22,1,0.36,1] }}
                      style={{ background:'#fff', borderRadius:22, border:'1.5px solid #ebebf5', boxShadow:'0 4px 20px rgba(99,102,241,0.07)', display:'flex', flexDirection:'column', overflow:'hidden' }}
                    >
                      <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:0 }}>

                        {/* Row 1: avatar + name/date */}
                        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                          <div style={{ width:46, height:46, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,${col},${col}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff', boxShadow:`0 4px 12px ${col}45` }}>
                            {rev.user?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <p style={{ fontSize:14, fontWeight:800, color:'#1e1b4b', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', letterSpacing:'-0.01em' }}>{rev.user?.name}</p>
                            <p style={{ fontSize:11, color:'#b0b8c8', margin:0, fontWeight:500 }}>
                              {new Date(rev.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Stars */}
                        <div style={{ display:'flex', gap:3, marginBottom:14 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ fontSize:16, lineHeight:1, color:s<=stars?'#f59e0b':'#e9ecef', filter:s<=stars?'drop-shadow(0 1px 3px rgba(245,158,11,0.45))':'none' }}>★</span>
                          ))}
                        </div>

                        {/* Divider */}
                        <div style={{ height:1, background:'linear-gradient(90deg,#ebebf5 60%,transparent)', marginBottom:14 }} />

                        {/* Title */}
                        {rev.title && (
                          <p style={{ fontSize:14, fontWeight:800, color:'#1e1b4b', margin:'0 0 8px', lineHeight:1.35, letterSpacing:'-0.01em' }}>{rev.title}</p>
                        )}

                        {/* Body */}
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute', top:-10, left:-5, fontSize:44, color:'#e0e7ff', lineHeight:1, fontFamily:'Georgia,serif', pointerEvents:'none', userSelect:'none' }}>"</span>
                          <p style={{ fontSize:13, color:'#64748b', margin:0, lineHeight:1.75, paddingLeft:16 }}>{rev.body}</p>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;