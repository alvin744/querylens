import { useEffect, useState } from "react";
import API from "../api/api";

export default function Review() {
  const [cases, setCases] = useState([]);
  const [savedEvaluations, setSavedEvaluations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formState, setFormState] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [aiResults, setAiResults] = useState({});
  const [showDisagreementOnly, setShowDisagreementOnly] = useState(false);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const [casesRes, evalRes] = await Promise.all([
        API.get("/cases/"),
        API.get("/evaluation/all"),
      ]);

      setCases(casesRes.data);

      const evaluationMap = {};
      evalRes.data.forEach((item) => {
        evaluationMap[item.ad_id] = item;
      });

      setSavedEvaluations(evaluationMap);
      setLoading(false);
    } catch (err) {
      console.error("API error:", err);
      setError(err.message || "Failed to load data");
      setLoading(false);
    }
  };

  const handleChange = (adId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [adId]: {
        ...prev[adId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (adId) => {
    const payload = {
      ad_id: adId,
      human_label: formState[adId]?.human_label || "",
      notes: formState[adId]?.notes || "",
      ai_score: aiResults[adId]?.score || null,
      ai_label: aiResults[adId]?.relevance_label || null,
    };

    try {
      await API.post("/evaluation/", payload);
      setSaveMessage(`Saved evaluation for ad ${adId}`);

      const evalRes = await API.get("/evaluation/all");
      const evaluationMap = {};
      evalRes.data.forEach((item) => {
        evaluationMap[item.ad_id] = item;
      });
      setSavedEvaluations(evaluationMap);
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage(`Failed to save evaluation for ad ${adId}`);
    }
  };

  const handleAIScore = async (query, locale, ad) => {
    try {
      const res = await API.post("/evaluation/ai", {
        query,
        locale,
        ad_title: ad.title,
        ad_description: ad.description,
      });

      setAiResults((prev) => ({
        ...prev,
        [ad.id]: res.data,
      }));
    } catch (err) {
      console.error("AI scoring failed:", err);
    }
  };

  const getLabelColor = (label) => {
    if (label === "Highly Relevant") return "#103b2a";
    if (label === "Partially Relevant") return "#4a3a10";
    if (label === "Irrelevant") return "#4a1f24";
    return "#1f2430";
  };

  const getLabelTextColor = (label) => {
    if (label === "Highly Relevant") return "#4ade80";
    if (label === "Partially Relevant") return "#fbbf24";
    if (label === "Irrelevant") return "#fb7185";
    return "#cbd5e1";
  };

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0b0d12",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "8px", fontSize: "28px" }}>
            Review Console
          </h1>
          <p style={{ color: "#9aa0ae", margin: 0 }}>
            AI-assisted search ads relevance review for monetization quality operations.
          </p>
        </div>

        <div
          style={{
            marginBottom: "20px",
            padding: "16px",
            background: "#11131a",
            border: "1px solid #1f2430",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#cbd5e1", fontWeight: "600" }}>
            View Mode
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowDisagreementOnly(false)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: !showDisagreementOnly ? "1px solid #fe2c55" : "1px solid #2a2d35",
                background: !showDisagreementOnly ? "#fe2c55" : "#161823",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              All Cases
            </button>

            <button
              onClick={() => setShowDisagreementOnly(true)}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: showDisagreementOnly ? "1px solid #fe2c55" : "1px solid #2a2d35",
                background: showDisagreementOnly ? "#fe2c55" : "#161823",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Disagreement Only
            </button>
          </div>
        </div>

        {loading && <p>Loading cases...</p>}
        {error && <p style={{ color: "#fb7185" }}>Error: {error}</p>}
        {saveMessage && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              background: "#102218",
              border: "1px solid #1f5133",
              borderRadius: "12px",
              color: "#86efac",
            }}
          >
            {saveMessage}
          </div>
        )}

        {!loading &&
          !error &&
          cases
            .map((c) => {
              const filteredAds = c.ads.filter((ad) => {
                if (!showDisagreementOnly) return true;

                const evalData = savedEvaluations[ad.id];

                return (
                  evalData &&
                  evalData.ai_label &&
                  evalData.human_label &&
                  evalData.ai_label !== evalData.human_label
                );
              });

              if (filteredAds.length === 0) return null;

              return (
                <div
                  key={c.id}
                  style={{
                    background: "#11131a",
                    border: "1px solid #1f2430",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "24px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "inline-block",
                        background: "#1a2335",
                        color: "#7dd3fc",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      Locale: {c.locale}
                    </div>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "white" }}>
                      Query: {c.query}
                    </h2>
                  </div>

                  {filteredAds.map((ad) => (
                    <div
                      key={ad.id}
                      style={{
                        border: "1px solid #252938",
                        borderRadius: "14px",
                        padding: "16px",
                        marginBottom: "16px",
                        background: "#161823",
                      }}
                    >
                      <div style={{ marginBottom: "8px" }}>
                        <strong style={{ fontSize: "16px", color: "white" }}>
                          {ad.title}
                        </strong>
                        <p style={{ margin: "6px 0 0", color: "#9aa0ae" }}>
                          {ad.description}
                        </p>
                      </div>

                      <button
                        style={{
                          marginTop: "8px",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "none",
                          background: "#25f4ee",
                          color: "#0b0d12",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                        onClick={() => handleAIScore(c.query, c.locale, ad)}
                      >
                        Run AI Evaluation
                      </button>

                      {aiResults[ad.id] && (
                        <div
                          style={{
                            marginTop: "14px",
                            background: "#0f1118",
                            border: "1px solid #252938",
                            padding: "14px",
                            borderRadius: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              marginBottom: "10px",
                            }}
                          >
                            <span
                              style={{
                                background: "#1a2335",
                                color: "#7dd3fc",
                                padding: "6px 10px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: "700",
                              }}
                            >
                              Intent: {aiResults[ad.id].intent}
                            </span>
                            <span
                              style={{
                                background: getLabelColor(aiResults[ad.id].relevance_label),
                                color: getLabelTextColor(aiResults[ad.id].relevance_label),
                                padding: "6px 10px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: "700",
                              }}
                            >
                              AI Label: {aiResults[ad.id].relevance_label}
                            </span>
                            <span
                              style={{
                                background: "#291b3d",
                                color: "#c4b5fd",
                                padding: "6px 10px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: "700",
                              }}
                            >
                              Score: {aiResults[ad.id].score}/5
                            </span>
                          </div>

                          <p style={{ margin: 0, color: "#cbd5e1" }}>
                            <strong>AI Reason:</strong> {aiResults[ad.id].reason}
                          </p>
                        </div>
                      )}

                      <div style={{ marginTop: "16px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "700",
                            color: "#e2e8f0",
                          }}
                        >
                          Human Relevance Label
                        </label>
                        <select
                          value={formState[ad.id]?.human_label || ""}
                          onChange={(e) =>
                            handleChange(ad.id, "human_label", e.target.value)
                          }
                          style={{
                            width: "100%",
                            maxWidth: "280px",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid #334155",
                            background: "#0f1118",
                            color: "white",
                          }}
                        >
                          <option value="">Select label</option>
                          <option value="Highly Relevant">Highly Relevant</option>
                          <option value="Partially Relevant">Partially Relevant</option>
                          <option value="Irrelevant">Irrelevant</option>
                        </select>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "700",
                            color: "#e2e8f0",
                          }}
                        >
                          Reviewer Notes
                        </label>
                        <textarea
                          rows="3"
                          value={formState[ad.id]?.notes || ""}
                          onChange={(e) =>
                            handleChange(ad.id, "notes", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid #334155",
                            background: "#0f1118",
                            color: "white",
                            resize: "vertical",
                          }}
                        />
                      </div>

                      <button
                        style={{
                          marginTop: "14px",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          border: "none",
                          background: "#fe2c55",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                        onClick={() => handleSave(ad.id)}
                      >
                        Save Evaluation
                      </button>

                      {savedEvaluations[ad.id] && (
                        <div
                          style={{
                            marginTop: "14px",
                            padding: "14px",
                            borderRadius: "12px",
                            background: savedEvaluations[ad.id].disagreement
                              ? "#2a1317"
                              : "#102218",
                            border: savedEvaluations[ad.id].disagreement
                              ? "1px solid #5c2029"
                              : "1px solid #1f5133",
                          }}
                        >
                          <p style={{ margin: "0 0 6px", color: "#e2e8f0" }}>
                            <strong>Saved Human Label:</strong>{" "}
                            {savedEvaluations[ad.id].human_label}
                          </p>
                          <p style={{ margin: "0 0 6px", color: "#e2e8f0" }}>
                            <strong>Saved AI Label:</strong>{" "}
                            {savedEvaluations[ad.id].ai_label || "N/A"}
                          </p>
                          <p
                            style={{
                              margin: "0 0 6px",
                              color: savedEvaluations[ad.id].disagreement
                                ? "#fb7185"
                                : "#4ade80",
                              fontWeight: "700",
                            }}
                          >
                            Status:{" "}
                            {savedEvaluations[ad.id].disagreement
                              ? "Disagreement"
                              : "Agreement"}
                          </p>
                          {savedEvaluations[ad.id].notes && (
                            <p style={{ margin: 0, color: "#cbd5e1" }}>
                              <strong>Saved Notes:</strong>{" "}
                              {savedEvaluations[ad.id].notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
      </div>
    </div>
  );
}