"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);

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
          const updated = [
            ...prev,
            { time: Date.now(), price: usd },
          ].slice(-30);

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

  const chartData = history.map((p) => ({
    name: "",
    price: p.price,
  }));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "#111827",
          padding: 20,
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h1>💵 USD / PLN LIVE</h1>

        {/* KURS BIEŻĄCY */}
        <h2 style={{ fontSize: 42, marginTop: 10 }}>
          {price ? price.toFixed(4) : "loading..."}
        </h2>

        <p style={{ opacity: 0.6 }}>
          real-time exchange rate (30s refresh)
        </p>

        {/* WYKRES */}
        <div style={{ width: "100%", height: 220, marginTop: 20 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INFO */}
        <div style={{ marginTop: 15, opacity: 0.7 }}>
          ticks: {history.length}
        </div>
      </div>
    </main>
  );
}