"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [rate, setRate] = useState("...");
  const [score, setScore] = useState(5);
  const [signal, setSignal] = useState("WAIT");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=PLN"
        );
        const data = await res.json();
        const usd = data?.rates?.PLN;

        if (usd) {
          setRate(usd.toFixed(4));

          let s = 5;

          if (usd < 3.6) s += 2;
          if (usd > 3.9) s -= 2;

          setScore(s);

          if (s >= 7) setSignal("BUY 🚀");
          else if (s >= 4) setSignal("WAIT ⏳");
          else setSignal("NO BUY 🔻");
        }
      } catch (e) {
        console.log("API error:", e);
      }
    };

    fetchRate();
    const i = setInterval(fetchRate, 60000);

    return () => clearInterval(i);
  }, []);

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const color = dark ? "white" : "black";

  const signalColor =
    signal.includes("BUY")
      ? "#16a34a"
      : signal.includes("WAIT")
      ? "#eab308"
      : "#dc2626";

  return (
    <main
      style={{
        fontFamily: "Arial",
        background: bg,
        color,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          borderRadius: "24px",
          padding: "1.5rem",
          background: dark ? "#111827" : "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
          💵 USD Trading Panel PRO
        </h1>

        <p style={{ opacity: 0.7 }}>Live market dashboard</p>

        <div
          style={{
            marginTop: "24px",
            padding: "1rem",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ fontSize: "14px", opacity: 0.7 }}>USD/PLN</div>
          <div style={{ fontSize: "36px", fontWeight: "bold" }}>
            {rate}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: signalColor,
            padding: "1.2rem",
            borderRadius: "18px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "30px", fontWeight: "bold" }}>
            {signal}
          </div>
          <div>Score: {score}/10</div>
        </div>

        <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
          <div
            style={{
              padding: "1rem",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            📈 Trend monitor
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            🔔 Alerts active
          </div>

          <div
            style={{
              padding: "1rem",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            💱 API ready
          </div>
        </div>

        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🌙 Toggle Theme
        </button>
      </div>
    </main>
  );
}