"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(5);
  const [signal, setSignal] = useState("WAIT");
  const [dark, setDark] = useState(true);

  // 🧠 BOT V5 LOGIC
  function calculateV5(data) {
    if (data.length < 10) return { score: 5, signal: "WAIT ⏳" };

    const latest = data[data.length - 1];

    const shortMA =
      data.slice(-5).reduce((a, b) => a + b, 0) / 5;

    const longMA =
      data.reduce((a, b) => a + b, 0) / data.length;

    let s = 5;

    // 📊 TREND
    if (shortMA > longMA) s += 2;
    if (shortMA < longMA) s -= 2;

    // ⚡ MOMENTUM
    const last3 = data.slice(-3);
    const rising =
      last3[2] > last3[1] && last3[1] > last3[0];
    const falling =
      last3[2] < last3[1] && last3[1] < last3[0];

    if (rising) s += 2;
    if (falling) s -= 2;

    // 🌪 VOLATILITY
    const max = Math.max(...data.slice(-10));
    const min = Math.min(...data.slice(-10));
    const volatility = (max - min) / latest;

    if (volatility > 0.02) s -= 1;
    if (volatility < 0.005) s += 1;

    // clamp
    s = Math.max(0, Math.min(10, s));

    let sig = "WAIT ⏳";
    if (s >= 7) sig = "BUY 🚀";
    else if (s <= 3) sig = "SELL 🔻";

    return { score: s, signal: sig };
  }

  // 📡 LIVE DATA SIMULATION (REAL-TIME FEEL)
  useEffect(() => {
    const startPrice = 3.85;

    const interval = setInterval(() => {
      setHistory((prev) => {
        // random walk simulation
        const last = prev.length ? prev[prev.length - 1] : startPrice;
        const change = (Math.random() - 0.5) * 0.02;
        const next = +(last + change).toFixed(4);

        const updated = [...prev, next].slice(-50);

        setPrice(next);

        const bot = calculateV5(updated);
        setScore(bot.score);
        setSignal(bot.signal);

        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const card = dark ? "#111827" : "#ffffff";
  const text = dark ? "white" : "black";

  const signalColor =
    signal.includes("BUY")
      ? "#16a34a"
      : signal.includes("SELL")
      ? "#dc2626"
      : "#eab308";

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
        <h1>💵 USD/PLN TRADING V5</h1>

        {/* PRICE */}
        <div style={{ marginTop: 20 }}>
          <p style={{ opacity: 0.7 }}>Live synthetic feed</p>
          <h2 style={{ fontSize: 40 }}>
            {price ? price.toFixed(4) : "..."}
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

        {/* MINI STATS */}
        <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            📊 Trend engine active
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            ⚡ Momentum tracking
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            🌪 Volatility filter
          </div>
        </div>

        {/* TOGGLE THEME */}
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

        {/* HISTORY DEBUG */}
        <div style={{ marginTop: 15, fontSize: 12, opacity: 0.6 }}>
          ticks: {history.length}
        </div>
      </div>
    </main>
  );
}