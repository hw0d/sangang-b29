"use client";

import { useEffect, useState } from "react";

export function TaskbarClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  return <div className="taskbar-clock">{time ?? " "}</div>;
}
