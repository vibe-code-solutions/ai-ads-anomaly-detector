import { useEffect, useState } from "react";

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/campaigns")
      .then(res => res.json())
      .then(data => setCampaigns(data));
  }, []);

  const analyze = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3001/analyze");
    const data = await res.json();
    setAnomalies(data.anomalies || []);
    setLoading(false);
  };

  return (
    <div style={{
      background: "#0f172a",
      color: "white",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial"
    }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        AI Ads Analyzer 🚀
      </h1>

      <button
        onClick={analyze}
        style={{
          background: "#6366f1",
          border: "none",
          padding: "12px 20px",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
          marginBottom: 30
        }}
      >
        {loading ? "Running..." : "Run Audit"}
      </button>

      <h2>Campaigns</h2>

      <div style={{ marginBottom: 40 }}>
        {campaigns.map((c, i) => (
          <div key={i} style={{
            background: "#1e293b",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10
          }}>
            <strong>{c.name}</strong> | {c.status}  
            <div>💰 {c.cost} | 👆 {c.clicks} | 🎯 {c.conversions}</div>
          </div>
        ))}
      </div>

      <h2>AI Insights</h2>

      {anomalies.length === 0 && <p>No issues yet</p>}

      {anomalies.map((a, i) => (
        <div key={i} style={{
          background: "#111827",
          borderLeft: `5px solid ${
            a.severity === "High" ? "red" :
            a.severity === "Medium" ? "orange" : "green"
          }`,
          padding: 15,
          paddingLeft: 15,
          marginBottom: 10,
          borderRadius: 10
        }}>
          <strong>{a.campaign_name || a.campaign}</strong>
          <p>{a.issue}</p>
          <span>{a.severity}</span>
        </div>
      ))}
    </div>
  );
}

export default App;