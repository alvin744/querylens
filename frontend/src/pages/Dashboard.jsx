import { useEffect, useState } from "react";
import API from "../api/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    API.get("/evaluation/metrics")
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!metrics) {
    return (
      <div
        style={{
          padding: "24px",
          fontFamily: "Arial, sans-serif",
          color: "white",
          background: "#0b0d12",
          minHeight: "100vh",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const labelColors = {
    "Highly Relevant": "#22c55e",
    "Partially Relevant": "#f59e0b",
    Irrelevant: "#f43f5e",
  };

  const pieData = metrics.label_distribution.map((item) => ({
    ...item,
    fill: labelColors[item.name] || "#94a3b8",
  }));

  const cardStyle = {
    background: "#11131a",
    border: "1px solid #1f2430",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  };

  const statValueStyle = {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "white",
  };

  const statLabelStyle = {
    color: "#9aa0ae",
    marginBottom: "8px",
    fontSize: "13px",
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        background: "#0b0d12",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "8px", fontSize: "28px" }}>Dashboard</h1>
          <p style={{ color: "#9aa0ae", margin: 0 }}>
            Search Ads quality monitoring for AI-assisted evaluation operations.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={cardStyle}>
            <div style={statLabelStyle}>Total Reviews</div>
            <h2 style={statValueStyle}>{metrics.total_reviews}</h2>
          </div>

          <div style={cardStyle}>
            <div style={statLabelStyle}>Agreement Rate</div>
            <h2 style={statValueStyle}>{metrics.agreement_rate}</h2>
          </div>

          <div style={cardStyle}>
            <div style={statLabelStyle}>Disagreement Rate</div>
            <h2 style={statValueStyle}>{metrics.disagreement_rate}</h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
              Query-Level Disagreement Rate
            </h3>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart
                  data={metrics.query_disagreement_stats}
                  margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#232736" />
                  <XAxis
                    dataKey="query"
                    stroke="#9aa0ae"
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                    height={70}
                  />
                  <YAxis stroke="#9aa0ae" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#11131a",
                      border: "1px solid #2a2d35",
                      color: "white",
                      borderRadius: "10px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="disagreement_rate" name="Disagreement Rate" fill="#fe2c55" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
              Human Label Distribution
            </h3>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#11131a",
                      border: "1px solid #2a2d35",
                      color: "white",
                      borderRadius: "10px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "16px" }}>
            Human Review Distribution
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}
          >
            <div
              style={{
                background: "#102218",
                border: "1px solid #1f5133",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#86efac", marginBottom: "8px", fontSize: "13px" }}>
                Highly Relevant
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>
                {metrics.highly_relevant_count}
              </div>
            </div>

            <div
              style={{
                background: "#2b210f",
                border: "1px solid #5e4a17",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#fcd34d", marginBottom: "8px", fontSize: "13px" }}>
                Partially Relevant
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>
                {metrics.partially_relevant_count}
              </div>
            </div>

            <div
              style={{
                background: "#2a1317",
                border: "1px solid #5c2029",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#fb7185", marginBottom: "8px", fontSize: "13px" }}>
                Irrelevant
              </div>
              <div style={{ fontSize: "24px", fontWeight: "700" }}>
                {metrics.irrelevant_count}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}