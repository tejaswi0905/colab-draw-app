"use client";

import { Pencil, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <nav className='border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Pencil className='w-6 h-6 text-blue-600' />
          <span className='text-xl font-bold text-slate-900'>colab-draw</span>
        </div>

        {!user ? (
          <button
            onClick={() => router.push("/signin")}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer'
          >
            Sign In
          </button>
        ) : (
          <div className='relative'>
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className='flex items-center gap-3 cursor-pointer'
            >
              <span className='text-sm font-semibold text-slate-700'>
                {user.name}
              </span>
              <Settings className='w-5 h-5 text-slate-600' />
            </div>

            {showDropdown && (
              <div className='absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border'>
                <button className='block w-full text-left px-4 py-2 hover:bg-slate-100'>
                  Dashboard
                </button>
                <button className='block w-full text-left px-4 py-2 hover:bg-slate-100'>
                  Account
                </button>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 hover:bg-slate-100 text-red-500'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
