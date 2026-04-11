"use client";

import { Zap, Grid3x3 } from "lucide-react";

import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";

import { Footer } from "./components/Footer";

function App() {
  const { user, loading } = useSession();
  const [rooms, setRooms] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3000/room/my-rooms", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        setRooms(data.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };

    fetchRooms();
  }, [user]);

  if (loading) return null;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col'>
      <Navbar user={user} />

      <main className='flex-1'>
        <section className='max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16'>
          {/* HERO */}
          <div className='text-center max-w-4xl mx-auto'>
            <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6'>
              <Zap className='w-4 h-4' />
              Collaborative whiteboarding made simple and easy
            </div>

            <h1 className='text-4xl font-bold text-slate-900 mb-6'>
              Draw together,
              <br />
              <span className='text-blue-600'>create together</span>
            </h1>

            {/* 🔥 ONLY SHOW BUTTONS BASED ON AUTH */}
            {!user && (
              <p className='text-slate-600'>Sign in to start collaborating</p>
            )}

            {user && (
              <div className='flex flex-col items-center gap-4'>
                <CreateRoom
                  onRoomCreated={(room) => setRooms((prev) => [...prev, room])}
                />

                <JoinRoom />
              </div>
            )}
          </div>

          {/* ROOMS LIST */}
          {user && rooms.length > 0 && (
            <div className='mt-10 grid grid-cols-2 gap-4 max-w-xl mx-auto'>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className='cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition'
                  onClick={() => router.push(`/canvas/${room.id}`)}
                >
                  <div className='font-semibold'>{room.slug}</div>
                  <p className='text-sm text-slate-500'>Click to join</p>
                </div>
              ))}
            </div>
          )}

          {/* CANVAS PREVIEW (KEEP THIS 🔥) */}
          <div className='mt-12 bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto'>
            <div className='aspect-video bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300'>
              <div className='text-center'>
                <Grid3x3 className='w-12 h-12 text-slate-400 mx-auto mb-4' />
                <p className='text-slate-500 font-medium'>
                  Your collaborative canvas awaits
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
