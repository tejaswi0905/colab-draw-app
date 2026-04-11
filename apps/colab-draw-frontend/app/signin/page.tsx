"use client";
import { HTTP_BACKEND } from "@/config";

import { Pencil, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${HTTP_BACKEND}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 required for cookies
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Navigate inside apps
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // 🔥 must go to backend directly (OAuth)
    window.location.href = `${HTTP_BACKEND}/auth/google`;
  };

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 sm:px-6'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-slate-200'>
          <div className='flex items-center justify-center gap-3 mb-8'>
            <Pencil className='w-8 h-8 text-blue-600' strokeWidth={2.5} />
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-900'>
              colab-draw
            </h1>
          </div>

          <div className='mb-8'>
            <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-2'>
              Welcome back
            </h2>
            <p className='text-slate-600 text-sm sm:text-base'>
              Sign in to your account to continue drawing
            </p>
          </div>

          <form onSubmit={handleSignIn} className='space-y-5'>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3.5 w-5 h-5 text-slate-400' />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@example.com'
                  className='w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3.5 w-5 h-5 text-slate-400' />
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className='w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50'
                />
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50'
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className='mt-6 pt-6 border-t border-slate-200'>
            <p className='text-center text-sm text-slate-600 mb-4'>
              New to colab-draw?{" "}
              <span
                onClick={() => router.push("/signup")}
                className='font-semibold text-blue-600 hover:text-blue-700 cursor-pointer'
              >
                Sign Up
              </span>
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className='w-full py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:border-blue-600 hover:bg-blue-50 flex items-center justify-center gap-3'
          >
            <FcGoogle className='w-5 h-5' />
            Continue with Google
          </button>

          <p className='text-xs text-slate-500 text-center mt-6'>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
