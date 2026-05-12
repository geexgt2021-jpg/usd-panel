"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PriceChart({ data }) {
  const chartData = data.map((v, i) => ({
    name: i,
    price: v,
  }));

  return (
    <div style={{ width: "100%", height: 200, marginTop: 20 }}>
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
  );
}