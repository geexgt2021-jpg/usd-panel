"use client";

import { useMemo, useState } from "react";
import { useUsdPln } from "./useUsdPln";
import PriceChart from "./PriceChart";

export default function TradingPanel() {
  const { price, history } = useUsdPln();
  const [dark, setDark] = useState(true);

  const signal = useMemo(() => {
    if (!price) return "WAIT";

    const avg =
      history.reduce((a, b) => a + b, 0) / (history.length || 1);

    if (price > avg * 1.01) return "BUY 🚀";
    if (price < avg * 0.99) return "SELL 🔻";
    return "WAIT ⏳";
  }, [price, history]);

  const bg = dark ? "#0f172a" : "#f3f4f6";
  const card = dark ? "#111827" : "#ffffff";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        color: dark ? "white" : "black",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: card,
          padding: 20,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1>💵 USD/PLN PRO TRADER</h1>

        <h2 style={{ fontSize: 42 }}>
          {price ? price.toFixed(4) : "..."}
        </h2>

        <div
          style={{
            padding: 15,
            borderRadius: 12,
            background: signal.includes("BUY")
              ? "#16a34a"
              : signal.includes("SELL")
              ? "#dc2626"
              : "#eab308",
            marginTop: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {signal}
        </div>

        {history.length > 5 && <PriceChart data={history} />}

        <button
          onClick={() => setDark(!dark)}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            borderRadius: 10,
            background: "#2563eb",
            color: "white",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Toggle theme
        </button>
      </div>
    </main>
  );
}