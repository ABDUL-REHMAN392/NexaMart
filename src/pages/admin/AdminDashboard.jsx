import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { toast } from "react-toastify";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MdPeople,
  MdShoppingBag,
  MdAttachMoney,
  MdRateReview,
} from "react-icons/md";
import { FiArrowUp, FiArrowDown, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const STATUS_COLORS = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

function Skel({ w = "100%", h = 14, r = 8 }) {
  return (
    <div
      className="adm-skel"
      style={{ width: w, height: h, borderRadius: r, display: "block" }}
    />
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  growth,
  prefix = "",
  color = "#6366f1",
  bg = "#eef2ff",
  delay = 0,
}) {
  const positive = growth >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1.5px solid #ebebf5",
        boxShadow: "0 2px 14px rgba(99,102,241,0.07)",
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9ca3af",
              margin: "0 0 5px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#1e1b4b",
              margin: 0,
              letterSpacing: "-0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            marginLeft: 10,
          }}
        >
          <Icon size={19} color={color} />
        </div>
      </div>
      {growth !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 10,
            fontSize: 11,
            fontWeight: 700,
            color: positive ? "#16a34a" : "#ef4444",
          }}
        >
          {positive ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
          {Math.abs(growth)}% vs last month
        </div>
      )}
    </motion.div>
  );
}

function SectionCard({ title, action, onAction, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1.5px solid #ebebf5",
        boxShadow: "0 2px 14px rgba(99,102,241,0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          borderBottom: "1.5px solid #f4f4fc",
        }}
      >
        <p
          style={{ fontSize: 13, fontWeight: 800, color: "#1e1b4b", margin: 0 }}
        >
          {title}
        </p>
        {action && (
          <button
            onClick={onAction}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6366f1",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "inherit",
              padding: 0,
            }}
          >
            View all <FiExternalLink size={11} />
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "10px 14px",
        border: "1.5px solid #ebebf5",
        boxShadow: "0 8px 24px rgba(99,102,241,0.12)",
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 700, color: "#1e1b4b", margin: "0 0 4px" }}>
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          style={{ margin: "2px 0", color: "#6366f1", fontWeight: 600 }}
        >
          ${Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setData(res.data);
      } catch (err) {
        toast.error(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <>
        <style>{`@keyframes shimmer-adm{0%{background-position:-700px 0}100%{background-position:700px 0}}.adm-skel{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:700px 100%;animation:shimmer-adm 1.4s infinite;}`}</style>
        <div>
          <div style={{ marginBottom: 22 }}>
            <Skel w={180} h={28} r={8} />
            <div style={{ marginTop: 6 }}>
              <Skel w={260} h={12} />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
              gap: 14,
              marginBottom: 20,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  border: "1.5px solid #ebebf5",
                  padding: 20,
                }}
              >
                <Skel w="60%" h={11} r={6} />
                <div style={{ marginTop: 8 }}>
                  <Skel w="80%" h={26} r={8} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <Skel w="50%" h={10} r={6} />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1.5px solid #ebebf5",
                padding: 20,
              }}
            >
              <Skel h={210} r={12} />
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1.5px solid #ebebf5",
                padding: 20,
              }}
            >
              <Skel h={210} r={12} />
            </div>
          </div>
        </div>
      </>
    );

  if (!data) return null;

  const {
    overview,
    growth,
    thisMonth,
    ordersByStatus,
    recentOrders,
    monthlyRevenue,
    topProducts,
  } = data;

  const chartData = monthlyRevenue.map((m) => ({
    name: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  }));
  const pieData = Object.entries(ordersByStatus)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const statCards = [
    {
      label: "Total Users",
      value: overview.totalUsers,
      icon: MdPeople,
      growth: growth.users,
      color: "#6366f1",
      bg: "#eef2ff",
    },
    {
      label: "Total Orders",
      value: overview.totalOrders,
      icon: MdShoppingBag,
      growth: growth.orders,
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      label: "Revenue",
      value: `$${Number(overview.totalRevenue).toFixed(0)}`,
      icon: MdAttachMoney,
      growth: growth.revenue,
      color: "#22c55e",
      bg: "#f0fdf4",
    },
    {
      label: "Reviews",
      value: overview.totalReviews,
      icon: MdRateReview,
      color: "#f59e0b",
      bg: "#fefce8",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shimmer-adm{0%{background-position:-700px 0}100%{background-position:700px 0}}
        .adm-skel{background:linear-gradient(90deg,#f0f0f8 25%,#e8e8f5 50%,#f0f0f8 75%);background-size:700px 100%;animation:shimmer-adm 1.4s infinite;}
        .adm-order-row{transition:background 0.14s;cursor:pointer;}
        .adm-order-row:hover td{background:#fafafe !important;}
        .dash-charts { display: grid; grid-template-columns: minmax(0,2fr) minmax(0,1fr); gap: 16px; margin-bottom: 16px; }
        .dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:900px){ .dash-charts{grid-template-columns:1fr !important;} .dash-bottom{grid-template-columns:1fr !important;} }
      `}</style>

      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 22 }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#1e1b4b",
              margin: "0 0 3px",
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            Welcome back — here's what's happening today.
          </p>
        </motion.div>

        {/* Stat cards — responsive auto-fill */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 16,
          }}
        >
          {statCards.map((c, i) => (
            <StatCard key={c.label} {...c} delay={i * 0.07} />
          ))}
        </div>

        {/* This month strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
            gap: 10,
            marginBottom: 18,
          }}
        >
          {[
            { label: "New Users", val: thisMonth.newUsers },
            { label: "Orders", val: thisMonth.orders },
            {
              label: "Revenue",
              val: `$${Number(thisMonth.revenue).toFixed(0)}`,
            },
            { label: "Reviews", val: thisMonth.reviews },
          ].map(({ label, val }) => (
            <div
              key={label}
              style={{
                background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
                border: "1.5px solid #e0e7ff",
                borderRadius: 13,
                padding: "11px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "#6366f1",
                  margin: "0 0 3px",
                  fontWeight: 600,
                }}
              >
                {label} this month
              </p>
              <p
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: "#4f46e5",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {val}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="dash-charts">
          <SectionCard title="Revenue — Last 6 Months" delay={0.35}>
            <div style={{ padding: "14px 16px 18px" }}>
              {chartData.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 13,
                    padding: "40px 0",
                  }}
                >
                  No data yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.18}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f8"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      fill="url(#revGrad)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Orders by Status" delay={0.4}>
            <div style={{ padding: "14px 8px 18px" }}>
              {pieData.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 13,
                    padding: "40px 0",
                  }}
                >
                  No orders yet
                </p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={65}
                        innerRadius={32}
                        paddingAngle={3}
                      >
                        {pieData.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={STATUS_COLORS[entry.name] || "#6366f1"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v, name) => [
                          v,
                          name.charAt(0).toUpperCase() + name.slice(1),
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px 12px",
                      justifyContent: "center",
                      padding: "0 8px",
                    }}
                  >
                    {pieData.map(({ name, value }) => (
                      <div
                        key={name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#6b7280",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: STATUS_COLORS[name] || "#6366f1",
                          }}
                        />
                        {name} ({value})
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Bottom */}
        <div className="dash-bottom">
          {/* Recent Orders */}
          <SectionCard
            title="Recent Orders"
            action="View all"
            onAction={() => navigate("/admin/orders")}
            delay={0.45}
          >
            {recentOrders.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                  padding: "28px 0",
                }}
              >
                No orders yet
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate("/admin/orders")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 18px",
                    borderTop: "1px solid #f4f4fc",
                    cursor: "pointer",
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fafafe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#6366f1",
                        flexShrink: 0,
                      }}
                    >
                      {order.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#1e1b4b",
                          margin: "0 0 1px",
                        }}
                      >
                        {order.user?.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                        #{order.orderNumber}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        margin: "0 0 3px",
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ${Number(order.totalAmount).toFixed(0)}
                    </p>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                        background:
                          order.orderStatus === "delivered"
                            ? "#f0fdf4"
                            : order.orderStatus === "cancelled"
                              ? "#fef2f2"
                              : "#fefce8",
                        color:
                          order.orderStatus === "delivered"
                            ? "#16a34a"
                            : order.orderStatus === "cancelled"
                              ? "#ef4444"
                              : "#ca8a04",
                        border: `1px solid ${order.orderStatus === "delivered" ? "#bbf7d0" : order.orderStatus === "cancelled" ? "#fecaca" : "#fde68a"}`,
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          {/* Top Products */}
          <SectionCard title="Top Products" delay={0.5}>
            {topProducts.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                  padding: "28px 0",
                }}
              >
                No sales yet
              </p>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={p._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 18px",
                    borderTop: "1px solid #f4f4fc",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: "#c4c4d4",
                      width: 16,
                      flexShrink: 0,
                    }}
                  >
                    #{i + 1}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      overflow: "hidden",
                      border: "1.5px solid #ebebf5",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1e1b4b",
                        margin: "0 0 1px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.title}
                    </p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                      {p.totalSold} sold
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${Number(p.totalRevenue).toFixed(0)}
                  </span>
                </div>
              ))
            )}
          </SectionCard>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
