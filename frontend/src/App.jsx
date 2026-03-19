import { useState } from "react";
import Review from "./pages/Review";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("review");

  const navButtonStyle = (active) => ({
    padding: "10px 16px",
    borderRadius: "10px",
    border: active ? "1px solid #fe2c55" : "1px solid #2a2d35",
    background: active ? "#fe2c55" : "#161823",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0b0d12" }}>
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #1f2430",
          background: "#11131a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>
            QueryLens
          </div>
          <div style={{ color: "#9aa0ae", fontSize: "12px" }}>
            Search Ads Evaluation Ops Console
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setPage("review")}
            style={navButtonStyle(page === "review")}
          >
            Review
          </button>

          <button
            onClick={() => setPage("dashboard")}
            style={navButtonStyle(page === "dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      {page === "review" ? <Review /> : <Dashboard />}
    </div>
  );
}

export default App;