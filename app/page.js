"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState(5);
  const [signal, setSignal] = useState("WAIT");
  const [dark, setDark] = useState(true);

  // 🧠 BOT LOGIC (V5 LIGHT)
  function calcBot(data) {
    if (data.length < 10) return { score: 5, signal: "WAIT" };

    const latest = data[data.length - 1];

    const shortMA =
      data.slice(-5).reduce((a, b) => a + b, 0) / 5;

    const longMA =
      data.reduce((a, b) => a + b, 0) / data.length;

    let s = 5;

    // trend
    if (shortMA > longMA) s += 2;
    if (shortMA < longMA) s -= 2;

    // momentum
    const last3 = data.slice(-3);
    const rising =
      last3[2] > last3[1] && last3[1] > last3[0];
    const falling =
      last3[2] < last3[1] && last3[1] < last3[0];

    if (rising) s += 2;
    if (falling) s -= 2;

    // volatility
    const max = Math.max(...data.slice(-10));
    const min = Math.min(...data.slice(-10));
    const vol = (max - min) / latest;

    if (vol > 0.02) s -= 1;
    if (vol < 0.005) s += 1;

    s = Math.max(0, Math.min(10, s));

    let sig = "WAIT";
    if (s >= 7) sig = "BUY 🚀";
    else if (s <= 3) sig = "SELL 🔻";

    return { score: s, signal: sig };
  }

  // 📡 REAL USD/PLN
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=PLN"
        );
        const data = await res.json();

        const usd = data?.rates?.PLN;
        if (!usd) return;

        setPrice(usd);

        setHistory((prev) => {
          const updated = [...prev, usd].slice(-40);

          const bot = calcBot(updated);
          setScore(bot.score);
          setSignal(bot.signal);

          return updated;
        });
      } catch (e) {
        console.log(e);
      }
    };

    fetchRate();
    const i = setInterval(fetchRate, 30000);

    return () => clearInterval(i);
  }, []);

  // 📊 SVG CHART (NO LIBS)
  const width = 320;
  const height = 120;

  const max = Math.max(...history, 0);
  const min = Math.min(...history, 0);
  const range = max - min || 1;

  const points = history
    .map((p, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const card = dark ? "#111827" : "#ffffff";
  const text = dark ? "white" : "black";

  const signalColor =
    signal === "BUY"
      ? "#16a34a"
      : signal === "SELL"
      ? "#dc2626"
      : "#eab308";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        color: text,
        padding: 25,
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1>💵 USD / PLN PRO (NO LIBS)</h1>

        {/* PRICE */}
        <div style={{ marginTop: 15 }}>
          <p style={{ opacity: 0.6 }}>real exchange rate</p>
          <h2 style={{ fontSize: 40 }}>
            {price ? price.toFixed(4) : "..."}
          </h2>
        </div>

        {/* SIGNAL */}
        <div
          style={{
            marginTop: 15,
            padding: 12,
            borderRadius: 10,
            background: signalColor,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {signal}
          <div>Score: {score}/10</div>
        </div>

        {/* SVG CHART */}
        <div style={{ marginTop: 20 }}>
          <svg width="100%" height="140" viewBox="0 0 320 120">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>

        {/* INFO */}
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          ticks: {history.length}
        </div>

        {/* TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: 15,
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
          Toggle theme
        </button>
      </div>
    </main>
  );
}