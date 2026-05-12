"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [price, setPrice] = useState(3.85); // fallback START
  const [history, setHistory] = useState([3.85]);
  const [score, setScore] = useState(5);
  const [signal, setSignal] = useState("WAIT");
  const [dark, setDark] = useState(true);

  // 🧠 BOT
  function calc(data) {
    if (data.length < 5) return { score: 5, signal: "WAIT" };

    const latest = data[data.length - 1];

    const avg =
      data.reduce((a, b) => a + b, 0) / data.length;

    let s = 5;

    if (latest > avg) s += 2;
    if (latest < avg) s -= 2;

    const rising =
      data[data.length - 3] < data[data.length - 2] &&
      data[data.length - 2] < data[data.length - 1];

    const falling =
      data[data.length - 3] > data[data.length - 2] &&
      data[data.length - 2] > data[data.length - 1];

    if (rising) s += 2;
    if (falling) s -= 2;

    s = Math.max(0, Math.min(10, s));

    let sig = "WAIT";
    if (s >= 7) sig = "BUY";
    else if (s <= 3) sig = "SELL";

    return { score: s, signal: sig };
  }

  // 📡 REAL API (z fallbackiem)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=PLN"
        );

        const data = await res.json();
        const usd = data?.rates?.PLN;

        // 🔥 fallback jeśli API padnie
        const finalPrice = usd || price + (Math.random() - 0.5) * 0.01;

        setPrice(finalPrice);

        setHistory((prev) => {
          const updated = [...prev, finalPrice].slice(-40);

          const bot = calc(updated);
          setScore(bot.score);
          setSignal(bot.signal);

          return updated;
        });
      } catch {
        // 🔥 fallback offline
        const fallback = price + (Math.random() - 0.5) * 0.01;

        setPrice(fallback);

        setHistory((prev) => {
          const updated = [...prev, fallback].slice(-40);
          const bot = calc(updated);
          setScore(bot.score);
          setSignal(bot.signal);
          return updated;
        });
      }
    };

    fetchRate();
    const i = setInterval(fetchRate, 5000);

    return () => clearInterval(i);
  }, []);

  // 📊 WYKRES (zawsze widoczny)
  const width = 320;
  const height = 120;

  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;

  const points = history
    .map((p, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const card = dark ? "#111827" : "#fff";

  const signalColor =
    signal === "BUY"
      ? "#16a34a"
      : signal === "SELL"
      ? "#dc2626"
      : "#eab308";

  return (
    <main style={{ background: bg, minHeight: "100vh", padding: 20, color: "white" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", background: card, color: "black", padding: 20, borderRadius: 20 }}>

        <h1>💵 USD / PLN LIVE</h1>

        {/* KURS — ZAWSZE WIDOCZNY */}
        <h2 style={{ fontSize: 40 }}>
          {price.toFixed(4)}
        </h2>

        <p>real-time + fallback (no blank screen)</p>

        {/* SYGNAŁ */}
        <div style={{ background: signalColor, padding: 10, borderRadius: 10, textAlign: "center" }}>
          {signal} | score {score}/10
        </div>

        {/* WYKRES */}
        <svg width="100%" height="140" viewBox="0 0 320 120" style={{ marginTop: 20 }}>
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
        </svg>

        {/* BUTTON */}
        <button onClick={() => setDark(!dark)} style={{ marginTop: 10, width: "100%" }}>
          toggle
        </button>

      </div>
    </main>
  );
}