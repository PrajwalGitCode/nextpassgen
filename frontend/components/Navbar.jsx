"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="w-full bg-[#131417] border-b border-[#00ffc6]/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / App Name */}
        <Link href="/landing" className="text-[#00ffc6] font-bold text-xl">
          VaultPass
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/landing"
            className="text-gray-300 hover:text-[#00ffc6] transition"
          >
            Generator
          </Link>

          {user && (
            <Link
              href="/vault"
              className="text-gray-300 hover:text-[#00ffc6] transition"
            >
              Vault
            </Link>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="text-gray-300 hover:text-[#00ffc6] transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-gray-300 hover:text-[#00ffc6] transition"
              >
                Signup
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-500 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
