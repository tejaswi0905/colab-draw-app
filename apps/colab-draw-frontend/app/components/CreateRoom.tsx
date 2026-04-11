"use client";

import { useState } from "react";

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

      const res = await fetch("http://localhost:3000/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className='mt-6 flex justify-center'>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder='Room name'
          className='border p-2 rounded mr-2'
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className='bg-blue-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50'
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
