"use client";

import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "@/config";

export function useSession() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${HTTP_BACKEND}/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
