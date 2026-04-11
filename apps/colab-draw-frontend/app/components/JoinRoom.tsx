"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch(`http://localhost:3000/room/slug/${trimmed}`, {
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
    <div className='mt-6 flex justify-center'>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='Enter room slug'
          className='border p-2 rounded mr-2'
        />
        <button
          onClick={handleJoin}
          className='bg-green-600 text-white px-4 py-2 rounded cursor-pointer'
        >
          Join
        </button>
      </div>
    </div>
  );
}
