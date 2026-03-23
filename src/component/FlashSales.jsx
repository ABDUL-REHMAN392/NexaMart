import { useEffect, useRef, useState } from "react";
import ShowItem from "./ShowItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

function ScrollBtn({ dir, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:38, height:38, borderRadius:'50%',
        display:'flex', alignItems:'center', justifyContent:'center',
        border:      hov ? '1.5px solid #6366f1' : '1.5px solid #e5e7eb',
        background:  hov ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
        color:       hov ? '#fff' : '#9ca3af', cursor:'pointer',
        boxShadow:   hov ? '0 6px 18px rgba(99,102,241,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
      }}
    >
      {dir === 'left' ? <FaChevronLeft size={12}/> : <FaChevronRight size={12}/>}
    </button>
  );
}

function FlashSales() {
  const [data, setData]         = useState([]);
  const [isLoading, setLoading] = useState(true);
  const scrollRef               = useRef();

  useEffect(() => {
    setLoading(true);

    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);

    fetch("https://dummyjson.com/products", { signal: controller.signal })
      .then(res => res.json())
      .then(result => {
        clearTimeout(timeout);

        const mapped = result?.products?.map(item => ({
          ...item,
          finalPrice: parseFloat((item.price - (item.price * item.discountPercentage) / 100).toFixed(2)),
          image: item.images?.[0] || item.thumbnail,
        }));

        setData(mapped || []);
      })
      .catch(e => {
        console.warn('FlashSales: fetch failed.', e.message);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const scroll = dir =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior:'smooth' });

  return (
    <>
      <style>{`
        @keyframes live-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.85)}}
        .fs-scroll{display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;padding-bottom:4px;padding-top:8px;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
        .fs-scroll::-webkit-scrollbar{display:none;}
        .fs-card-wrap{flex-shrink:0;width:160px;}
        @media(min-width:480px){.fs-card-wrap{width:190px;}}
        @media(min-width:640px){.fs-card-wrap{width:220px;}}
        @media(min-width:1024px){.fs-card-wrap{width:240px;}}
        @media(max-width:640px){.fs-section{padding:32px 0!important;}.fs-wrap{padding:0 12px!important;}.fs-h2{font-size:18px!important;}}
        @media(min-width:641px) and (max-width:900px){.fs-wrap{padding:0 24px!important;}}
      `}</style>

      <section className="fs-section" style={{ background:'#fff', padding:'52px 0', overflowX:'hidden' }}>
        <div className="fs-wrap" style={{ maxWidth:1280, margin:'0 auto', padding:'0 40px' }}>

          <motion.div
            initial={{ opacity:0, y:-10 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.4 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h2 className="fs-h2" style={{ fontSize:24, fontWeight:900, color:'#1e1b4b', margin:0, letterSpacing:'-0.02em' }}>
                Today's <span style={{ color:'#6366f1', fontFamily:"'Pacifico',cursive" }}>Flash Sales</span>
              </h2>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {['left','right'].map(d => <ScrollBtn key={d} dir={d} onClick={() => scroll(d)}/>)}
            </div>
          </motion.div>

          <div ref={scrollRef} className="fs-scroll">
            {isLoading
              ? Array(6).fill(0).map((_,i) => (
                  <div key={i} className="fs-card-wrap"><ShowItem isLoading/></div>
                ))
              : data.map((p,i) => (
                  <motion.div key={p.id} className="fs-card-wrap"
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay:i*0.04, duration:0.35, ease:[0.22,1,0.36,1] }}
                  >
                    <ShowItem {...p}/>
                  </motion.div>
                ))
            }
          </div>

        </div>
      </section>
    </>
  );
}

export default FlashSales;