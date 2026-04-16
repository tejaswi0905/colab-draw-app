"use client";

import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

export default function CreateRoom({
  onRoomCreated,
}: {
  onRoomCreated: (room: any) => void;
}) {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const trimmed = slug.trim();

    if (!trimmed) {
      alert("Enter valid room name");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${HTTP_BACKEND}/room/create`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ slug: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      onRoomCreated({
        id: data.data.roomId,
        slug: data.data.roomName,
      });

      setSlug("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full w-full'>
      <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider ml-1">Start New Workspace</h3>
      <div className='flex items-center bg-zinc-900/80 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md shadow-xl transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20'>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='e.g. spring-planning'
          className='flex-1 bg-transparent border-none text-white px-4 py-2.5 outline-none placeholder:text-zinc-600 w-full'
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className='bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium cursor-pointer disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] whitespace-nowrap'
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
