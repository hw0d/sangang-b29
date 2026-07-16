"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Keeps every open tab in sync: subscribes to the server's change stream and
// silently re-fetches the current page's data whenever anything changes,
// without a full page reload or losing in-progress form input.
export function LiveUpdates() {
  const router = useRouter();

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.onmessage = () => {
      router.refresh();
    };
    return () => source.close();
  }, [router]);

  return null;
}
