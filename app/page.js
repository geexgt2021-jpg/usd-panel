"use client";
import { useState } from "react";

export default function Page() {
  const [test, setTest] = useState(0);

  return (
    <button onClick={() => setTest(test + 1)}>
      {test}
    </button>
  );
}