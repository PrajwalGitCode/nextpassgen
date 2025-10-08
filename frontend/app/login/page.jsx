"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api"; // adjust path if needed

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });

      const userData = data.user || data;
      const token = data.token;

      if (token) localStorage.setItem("token", token);
      if (userData) localStorage.setItem("user", JSON.stringify(userData));

      if (onLogin) onLogin(userData, token);
      router.push("/");
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] text-gray-200 px-4">
      <div className="w-full max-w-md bg-[#151518] border border-[#1f1f23] rounded-2xl shadow-[0_0_20px_rgba(0,255,180,0.1)] p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-[#00b3ff]/40 rounded-lg p-3 text-gray-100 focus:border-[#00b3ff] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-[#00ffc6]/40 rounded-lg p-3 text-gray-100 focus:border-[#00ffc6] outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] text-black font-semibold hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#00ffc6] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
