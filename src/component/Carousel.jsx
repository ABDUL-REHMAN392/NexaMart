import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiCheck } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useFavoriteStore } from "../store/useFavoriteStore";
import { useAuthStore } from "../store/useAuthStore";

const Carousel = () => {
  const [products, setProducts]       = useState([]);
  const [current, setCurrent]         = useState(0);
  const [loading, setLoading]         = useState(true);
  const [favFeedback, setFavFeedback] = useState(null); // 'added'|'removed'|'auth'|'error'
  const [favLoading, setFavLoading]   = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated }             = useAuthStore();
  const { isFavorited, toggleFavorite } = useFavoriteStore();

  useEffect(() => {
    const categories = [
      "mens-shirts","womens-dresses","skin-care",
      "kitchen-accessories","smartphones","sports-accessories",
    ];
    (async () => {
      try {
        const results = await Promise.all(
          categories.map(cat =>
            fetch(`https://dummyjson.com/products/category/${cat}?limit=1`).then(r=>r.json())
          )
        );
        setProducts(results.map(d=>d.products[0]).filter(Boolean));
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!products.length) return;
    const t = setInterval(() => setCurrent(p=>(p+1)%products.length), 4000);
    return () => clearInterval(t);
  }, [products]);

  const showFeedback = type => {
    setFavFeedback(type);
    setTimeout(() => setFavFeedback(null), 2000);
  };

  const handleShopNow = product => navigate(`/product/${product.id}`);

  const handleFavorite = async product => {
    if (!isAuthenticated) {
      showFeedback('auth');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    try {
      const wasAlready = isFavorited(product.id);
      await toggleFavorite({
        productId:product.id, title:product.title, price:product.price,
        image:product.thumbnail, brand:product.brand||'',
        category:product.category||'', rating:product.rating||0,
      });
      showFeedback(wasAlready ? 'removed' : 'added');
    } catch { showFeedback('error'); }
    finally { setFavLoading(false); }
  };

  const catMeta = {
    'mens-shirts':         { color:'#6366f1', bg:'#f5f3ff', label:"Men's Shirts"    },
    'womens-dresses':      { color:'#db2777', bg:'#fdf2f8', label:"Women's Dresses" },
    'skin-care':           { color:'#e11d48', bg:'#fff1f2', label:'Skin Care'       },
    'kitchen-accessories': { color:'#16a34a', bg:'#f0fdf4', label:'Kitchen'         },
    'smartphones':         { color:'#ea580c', bg:'#fff7ed', label:'Smartphones'     },
    'sports-accessories':  { color:'#ca8a04', bg:'#fefce8', label:'Sports'          },
  };

  /* Feedback pill configs */
  const fbMeta = {
    added:   { icon:<FaHeart size={12} color="#ef4444"/>, text:'Saved to favorites',       bg:'#fff1f2',  border:'#fecaca', color:'#ef4444' },
    removed: { icon:<FiCheck size={12} strokeWidth={2.5}/>, text:'Removed from favorites', bg:'#f0fdf4',  border:'#bbf7d0', color:'#16a34a' },
    auth:    { icon:'🔒',                                   text:'Sign in to save',         bg:'#fefce8',  border:'#fde68a', color:'#ca8a04' },
    error:   { icon:'⚠️',                                   text:'Something went wrong',    bg:'#fef2f2',  border:'#fecaca', color:'#ef4444' },
  };

  /* Skeleton */
  if (loading) return (
    <>
      <style>{`@keyframes shimmer-c{0%{background-position:-700px 0}100%{background-position:700px 0}}.skel-c{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:700px 100%;animation:shimmer-c 1.4s infinite;border-radius:10px;}.car-skel-img{display:block;}@media(max-width:640px){.car-skel-img{display:none!important;}}`}</style>
      <div style={{ width:'100%', height:'100%', background:'#fff', borderRadius:'2rem', display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', padding:'0 48px', gap:28, overflow:'hidden', minHeight:280 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div className="skel-c" style={{ height:20, width:'32%', borderRadius:20 }}/>
          <div className="skel-c" style={{ height:32, width:'88%' }}/>
          <div className="skel-c" style={{ height:32, width:'62%' }}/>
          <div className="skel-c" style={{ height:11, width:'95%' }}/>
          <div className="skel-c" style={{ height:11, width:'72%' }}/>
          <div style={{ display:'flex', gap:10, marginTop:4 }}>
            <div className="skel-c" style={{ height:42, width:120, borderRadius:13 }}/>
            <div className="skel-c" style={{ height:42, width:42, borderRadius:13 }}/>
          </div>
        </div>
        <div className="car-skel-img" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="skel-c" style={{ width:200, height:200, borderRadius:'50%' }}/>
        </div>
      </div>
    </>
  );

  const item  = products[current];
  const meta  = catMeta[item.category] || { color:'#6366f1', bg:'#f5f3ff', label:item.category };
  const faved = isFavorited(item.id);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes car-spin{to{transform:rotate(360deg)}}
        .shop-now-btn{transition:all 0.2s ease;}
        .shop-now-btn:hover{transform:translateY(-1px);filter:brightness(1.08);}
        .shop-now-btn:active{transform:translateY(0);}
        .fav-c-btn{transition:background 0.18s,border-color 0.18s,box-shadow 0.18s;}
        .car-grid{display:grid;grid-template-columns:1fr 1fr;height:100%;min-height:340px;align-items:center;padding:0 52px;gap:24px;}
        .car-img-col{display:flex;}
        .car-dots{left:52px;}
        @media(max-width:640px){
          .car-grid{grid-template-columns:1fr!important;padding:28px 24px 56px!important;gap:12px!important;align-items:flex-start!important;}
          .car-img-col{display:none!important;}
          .car-dots{left:24px!important;}
          .car-title{font-size:22px!important;}
          .car-price{font-size:20px!important;}
        }
        @media(min-width:641px) and (max-width:900px){
          .car-grid{padding:0 32px!important;}
          .car-dots{left:32px!important;}
          .car-title{font-size:24px!important;}
        }
      `}</style>

      <div style={{ position:'relative', width:'100%', height:'100%', minHeight:340, flex:1, background:'#fff', overflow:'hidden', borderRadius:'2rem', fontFamily:"'DM Sans',sans-serif" }}>

        {/* Bg blob */}
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,${meta.color}18 0%,transparent 70%)`, transition:'background 0.6s', pointerEvents:'none' }} />

        {/* ── Inline feedback pill ── */}
        <AnimatePresence>
          {favFeedback && fbMeta[favFeedback] && (
            <motion.div
              key={favFeedback}
              initial={{ opacity:0, y:-10, scale:0.9 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-8, scale:0.92 }}
              transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
              style={{
                position:'absolute', top:16, right:16, zIndex:20,
                display:'flex', alignItems:'center', gap:7,
                padding:'8px 14px', borderRadius:50,
                background: fbMeta[favFeedback].bg,
                border: `1.5px solid ${fbMeta[favFeedback].border}`,
                boxShadow:'0 4px 18px rgba(0,0,0,0.1)',
                fontSize:12, fontWeight:700,
                color: fbMeta[favFeedback].color,
                pointerEvents:'none',
                backdropFilter:'blur(6px)',
                whiteSpace:'nowrap',
              }}
            >
              <span style={{ display:'flex', alignItems:'center', fontSize:13 }}>{fbMeta[favFeedback].icon}</span>
              {fbMeta[favFeedback].text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
            transition={{ duration:0.42, ease:[0.22,1,0.36,1] }}
            className="car-grid"
            style={{ height:'100%' }}
          >
            {/* Text */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <motion.span initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                style={{ display:'inline-flex', alignItems:'center', width:'fit-content', background:meta.bg, border:`1px solid ${meta.color}30`, color:meta.color, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'4px 12px', borderRadius:20 }}
              >{meta.label}</motion.span>

              <motion.h2 className="car-title" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
                style={{ fontSize:28, fontWeight:900, color:'#1e1b4b', margin:0, lineHeight:1.15, letterSpacing:'-0.02em', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}
              >{item.title}</motion.h2>

              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.14 }}
                style={{ color:'#9ca3af', fontSize:13, margin:0, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', maxWidth:320 }}
              >{item.description}</motion.p>

              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.18 }}
                style={{ display:'flex', alignItems:'center', gap:10 }}
              >
                <span className="car-price" style={{ fontSize:26, fontWeight:900, color:'#1e1b4b' }}>${item.price}</span>
                <span style={{ fontSize:10, fontWeight:700, color:'#ef4444', background:'#fef2f2', border:'1px solid #fecaca', padding:'3px 8px', borderRadius:6 }}>
                  -{Math.round(item.discountPercentage)}% OFF
                </span>
              </motion.div>

              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}
                style={{ display:'flex', alignItems:'center', gap:10, marginTop:4 }}
              >
                <button onClick={()=>handleShopNow(item)} className="shop-now-btn"
                  style={{ background:`linear-gradient(135deg,${meta.color},${meta.color}bb)`, color:'#fff', padding:'11px 26px', borderRadius:13, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, boxShadow:`0 6px 22px ${meta.color}40`, fontFamily:"'DM Sans',sans-serif", letterSpacing:'0.02em' }}
                >Shop Now →</button>

                {/* Fav button */}
                <motion.button
                  onClick={()=>handleFavorite(item)}
                  className="fav-c-btn"
                  disabled={favLoading}
                  whileTap={{ scale:0.86 }}
                  style={{
                    width:44, height:44, borderRadius:13,
                    border: faved ? `1.5px solid ${meta.color}50` : '1.5px solid #ebebf5',
                    background: faved ? meta.bg : '#f8f8fc',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: favLoading ? 'wait' : 'pointer',
                    boxShadow: faved ? `0 3px 12px ${meta.color}28` : 'none',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {favLoading ? (
                      <motion.span key="spin" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.12 }}>
                        <svg style={{ animation:'car-spin 0.8s linear infinite' }} width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke={meta.color} strokeWidth="3" strokeOpacity="0.25"/>
                          <path d="M22 12a10 10 0 0 0-10-10" stroke={meta.color} strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                      </motion.span>
                    ) : faved ? (
                      <motion.span key="filled" initial={{ scale:0.4, rotate:-15 }} animate={{ scale:1, rotate:0 }} exit={{ scale:0.4 }} transition={{ type:'spring', stiffness:320, damping:16 }}>
                        <FaHeart size={16} color={meta.color}/>
                      </motion.span>
                    ) : (
                      <motion.span key="outline" initial={{ scale:0.6 }} animate={{ scale:1 }} exit={{ scale:0.6 }} transition={{ duration:0.15 }}>
                        <FiHeart size={17} color="#9ca3af"/>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>

            {/* Image */}
            <div className="car-img-col" style={{ alignItems:'center', justifyContent:'center', height:'100%', position:'relative', minHeight:280 }}>
              <motion.div initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.05, duration:0.5, ease:[0.22,1,0.36,1] }}
                style={{ position:'absolute', width:220, height:220, borderRadius:'50%', background:`${meta.color}12`, border:`1.5px solid ${meta.color}20` }}
              />
              <motion.img
                initial={{ scale:0.6, rotate:12, opacity:0 }} animate={{ scale:1, rotate:0, opacity:1 }}
                transition={{ type:'spring', stiffness:110, damping:14, delay:0.08 }}
                src={item.thumbnail} alt={item.title} onClick={()=>handleShopNow(item)}
                style={{ maxHeight:240, zIndex:1, cursor:'pointer', filter:'drop-shadow(0 16px 32px rgba(0,0,0,0.15))', position:'relative' }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="car-dots" style={{ position:'absolute', bottom:20, display:'flex', gap:6, alignItems:'center' }}>
          {products.map((_,i) => (
            <button key={i} onClick={()=>setCurrent(i)} style={{ height:5, borderRadius:99, border:'none', cursor:'pointer', padding:0, width:i===current?22:6, background:i===current?meta.color:'#e5e7eb', transition:'all 0.3s ease' }}/>
          ))}
        </div>
      </div>
    </>
  );
};

export default Carousel;