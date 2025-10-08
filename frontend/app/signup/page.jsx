"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api"; // adjust path if needed

export default function Signup({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match");

    try {
      const data = await signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      const userData = data.user || data;
      const token = data.token;

      if (token) localStorage.setItem("token", token);
      if (userData) localStorage.setItem("user", JSON.stringify(userData));

      if (onLogin) onLogin(userData, token);
      router.push("/");
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] text-gray-200 px-4">
      <div className="w-full max-w-md bg-[#151518] border border-[#1f1f23] rounded-2xl shadow-[0_0_20px_rgba(0,255,180,0.1)] p-8">
        <h1 className="text-3xl font-semibold text-center mb-8 bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] bg-clip-text text-transparent">
          Create your account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-[#0c0c0e] border border-[#00ffc6]/40 rounded-lg p-3 text-gray-100 focus:border-[#00ffc6] outline-none"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#0c0c0e] border border-[#00b3ff]/40 rounded-lg p-3 text-gray-100 focus:border-[#00b3ff] outline-none"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#0c0c0e] border border-[#00ffc6]/40 rounded-lg p-3 text-gray-100 focus:border-[#00ffc6] outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full bg-[#0c0c0e] border border-[#ff00b3]/40 rounded-lg p-3 text-gray-100 focus:border-[#ff00b3] outline-none"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00ffc6] to-[#00b3ff] text-black font-semibold hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#00ffc6] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
