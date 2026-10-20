"use client";

import { useEffect, useState } from "react";

type Health = { status: string; database: string };

export default function ApiStatus() {
  const [health, setHealth] = useState<Health | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/v1/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return <p role="status">API: unreachable</p>;
  if (!health) return <p role="status">API: checking…</p>;

  return (
    <p role="status">
      API: {health.status} · database: {health.database}
    </p>
  );
}
