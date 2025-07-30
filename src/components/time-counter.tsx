"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

export function TimeCounter({ startAt }: { startAt: string }) {
  const hour = Number(startAt.split(":")[0]);
  const minute = Number(startAt.split(":")[1]);
  const [time, setTime] = useState(dayjs().hour(hour).minute(minute).second(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev.add(1, "minute"));
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return <>{time.format("hh:mm A")}</>;
}
