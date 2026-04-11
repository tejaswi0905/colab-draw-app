"use client";

import { Zap, ArrowRight, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

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
        const res = await fetch(`${HTTP_BACKEND}/room/my-rooms`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) return console.error(data.message);
        setRooms(data.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };

    fetchRooms();
  }, [user]);

  if (loading) return null;

  return (
    <div className='min-h-screen bg-zinc-950 text-zinc-200 flex flex-col relative overflow-hidden font-sans selection:bg-blue-500/30'>
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] bg-purple-600 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <Navbar user={user} />

      <main className='flex-1 relative z-10'>
        <section className='max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 flex flex-col items-center justify-center min-h-[70vh]'>
          
          <div className='text-center max-w-3xl mx-auto'>
            {/* Pill */}
            <div className='inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900/50 border border-white/5 text-zinc-300 rounded-full mb-8 backdrop-blur-md text-sm font-medium'>
              <Zap className='w-4 h-4 text-blue-400' />
              <span className="opacity-90">Collaborative whiteboarding made simple</span>
            </div>

            <h1 className='text-5xl sm:text-7xl font-bold tracking-tight mb-8'>
              Draw together,<br />
              <span className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>
                create together_
              </span>
            </h1>

            {!user ? (
              <p className='text-xl text-zinc-400 max-w-2xl mx-auto font-light'>
                A smooth, infinite canvas for you and your team. 
                Sign in to start visualizing your next big idea.
              </p>
            ) : (
              <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mt-10'>
                <CreateRoom onRoomCreated={(room) => setRooms((prev) => [room, ...prev])} />
                <div className="hidden sm:block w-[1px] h-12 bg-white/10" />
                <div className="block sm:hidden w-12 h-[1px] bg-white/10" />
                <JoinRoom />
              </div>
            )}
          </div>

          {/* ROOMS LIST */}
          {user && rooms.length > 0 && (
            <div className='mt-24 w-full max-w-4xl'>
              <div className="flex items-center gap-2 mb-6 text-zinc-400">
                <Layers className="w-5 h-5" />
                <h3 className="text-lg font-medium">Your Workspaces</h3>
              </div>
              
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => router.push(`/canvas/${room.id}`)}
                    className='group relative cursor-pointer p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden'
                  >
                    {/* Subtle Hover Glow inside card */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-transparent transition-opacity duration-300 pointer-events-none" />
                    
                    <div className='font-semibold text-lg text-white mb-2 truncate'>
                      {room.slug}
                    </div>
                    <div className='flex items-center gap-1 text-sm text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity'>
                      Join Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
