"use client";

import { useEffect, useState } from "react";

export function useUsdPln() {
  const [price, setPrice] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchRate = async () => {
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=USD&symbols=PLN"
      );
      const data = await res.json();
      const usd = data?.rates?.PLN;

      if (usd) {
        setPrice(usd);

        setHistory((prev) => {
          const updated = [...prev, usd].slice(-30); // ostatnie 30 punktów
          return updated;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchRate();
    const i = setInterval(fetchRate, 30000);
    return () => clearInterval(i);
  }, []);

  return { price, history };
}