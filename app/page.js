"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [rate, setRate] = useState(null);
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

        // 🔥 SAFE GUARD (najważniejsze)
        if (!usd || isNaN(usd)) return;

        setRate(usd.toFixed(4));

        let s = 5;

        if (usd < 3.6) s += 2;
        if (usd > 3.9) s -= 2;

        setScore(s);

        if (s >= 7) setSignal("BUY 🚀");
        else if (s >= 4) setSignal("WAIT ⏳");
        else setSignal("NO BUY 🔻");
      } catch (err) {
        console.log("API error:", err);
      }
    };

    fetchRate();

    const i = setInterval(fetchRate, 30000);

    return () => clearInterval(i);
  }, []);

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const card = dark ? "#111827" : "#ffffff";
  const text = dark ? "white" : "black";

  const signalColor =
    signal.includes("BUY")
      ? "#16a34a"
      : signal.includes("WAIT")
      ? "#eab308"
      : "#dc2626";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        color: text,
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: card,
          padding: 20,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1>💵 USD Trading Panel by GeeX</h1>

        {/* PRICE */}
        <div style={{ marginTop: 20 }}>
          <p style={{ opacity: 0.7 }}>USD / PLN</p>
          <h2 style={{ fontSize: 40 }}>
            {rate ? rate : "loading..."}
          </h2>
        </div>

        {/* SIGNAL */}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 12,
            background: signalColor,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {signal}
          <div>Score: {score}/10</div>
        </div>

        {/* INFO BOXES */}
        <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            📈 Trend monitor
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            🔔 Alerts active
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            💱 API connected
          </div>
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            borderRadius: 10,
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