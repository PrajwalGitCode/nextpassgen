"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user.username || "User"} 👋
        </h1>
        <p className="text-gray-300 mb-6">
          You’re logged in! This is your secure vault dashboard.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/vault")}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition"
          >
            Go to Vault
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
