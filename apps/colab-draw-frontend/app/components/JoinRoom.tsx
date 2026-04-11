"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function JoinRoom() {
  const [slug, setSlug] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    const trimmed = slug.trim();

    if (!trimmed) {
      alert("Enter room slug");
      return;
    }

    try {
      const res = await fetch(`${HTTP_BACKEND}/room/slug/${trimmed}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Room not found");
        return;
      }

      const roomId = data.data.roomId;

      router.push(`/canvas/${roomId}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='w-full'>
      <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider ml-1">Join Existing</h3>
      <div className='flex items-center bg-zinc-900/80 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md shadow-xl transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20'>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='Enter workspace code'
          className='flex-1 bg-transparent border-none text-white px-4 py-2.5 outline-none placeholder:text-zinc-600 w-full'
        />
        <button
          onClick={handleJoin}
          className='bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium cursor-pointer transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] whitespace-nowrap'
        >
          Join
        </button>
      </div>
    </div>
  );
}
