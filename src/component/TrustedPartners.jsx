import { motion } from "framer-motion";

const brandLogos = [
  "paypal",
  "visa",
  "mastercard",
  "googlepay",
  "applepay",
  "audi",
  "bmw",
  "nike",
  "tesla",
  "adidas",
  "honda",
  "xiaomi",
];

const brands = brandLogos.map((name) => ({
  name,
  src: `https://cdn.simpleicons.org/${name}`,
}));
const tripled = [...brands, ...brands, ...brands];

function TrustedPartners() {
  return (
    <>
      <style>{`
        @media(max-width:640px){
          .tp-title  { font-size:20px !important; }
          .tp-logo   { width:80px !important; height:56px !important; padding:0 10px !important; }
          .tp-fade-l { width:48px !important; }
          .tp-fade-r { width:48px !important; }
        }
        @media(min-width:641px) and (max-width:900px){
          .tp-logo   { width:96px !important; }
          .tp-fade-l { width:72px !important; }
          .tp-fade-r { width:72px !important; }
        }
      `}</style>

      <section
        style={{ background: "#fff", padding: "52px 0", overflow: "hidden" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", marginBottom: 36, padding: "0 16px" }}
        >
          <h2
            className="tp-title"
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#1e1b4b",
              margin: "0 0 8px",
              letterSpacing: "-0.02em",
            }}
          >
            Trusted{" "}
            <span
              style={{ color: "#6366f1", fontFamily: "'Pacifico',cursive" }}
            >
              Partners
            </span>
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>
            Brands we proudly work with
          </p>
        </motion.div>

        <div style={{ position: "relative", paddingTop: 8, paddingBottom: 8 }}>
          <div
            className="tp-fade-l"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 150,
              zIndex: 2,
              background: "linear-gradient(to right,#fff,transparent)",
              pointerEvents: "none",
            }}
          />
          <div
            className="tp-fade-r"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 150,
              zIndex: 2,
              background: "linear-gradient(to left,#fff,transparent)",
              pointerEvents: "none",
            }}
          />

          <div style={{ overflow: "hidden", display: "flex", width: "100%" }}>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-33.33%" }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                display: "flex",
                width: "max-content",
                willChange: "transform",
              }}
            >
              {tripled.map(({ name, src }, idx) => (
                <motion.div
                  key={idx}
                  className="tp-logo"
                  whileHover={{ scale: 1.15 }}
                  style={{
                    width: 120,
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    padding: "0 24px",
                  }}
                >
                  <img
                    src={src}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "grayscale(1) opacity(0.5)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.filter = "grayscale(0) opacity(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.filter = "grayscale(1) opacity(0.5)";
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TrustedPartners;
