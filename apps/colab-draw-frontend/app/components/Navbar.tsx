"use client";

import { Pencil, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

export default function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await fetch(`${HTTP_BACKEND}/auth/logout`, {
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <nav className='border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <Pencil className='w-5 h-5 text-blue-400' />
          </div>
          <span className='text-xl font-bold tracking-tight text-white'>colab-draw</span>
        </div>

        {!user ? (
          <button
            onClick={() => router.push("/signin")}
            className='px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]'
          >
            Sign In
          </button>
        ) : (
          <div className='relative'>
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className='flex items-center gap-3 cursor-pointer py-1 px-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors'
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className='text-sm font-medium text-zinc-300 hidden sm:block'>
                {user.name}
              </span>
              <Settings className='w-4 h-4 text-zinc-500' />
            </div>

            {showDropdown && (
              <div className='absolute right-0 mt-3 w-48 bg-zinc-900 shadow-2xl rounded-xl border border-white/10 py-1 overflow-hidden backdrop-blur-lg'>
                <button className='block w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors'>
                  Dashboard
                </button>
                <button className='block w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors'>
                  Account Settings
                </button>
                <div className="h-[1px] bg-white/5 my-1" />
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
