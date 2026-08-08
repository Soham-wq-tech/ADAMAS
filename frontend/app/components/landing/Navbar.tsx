"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    setIsGuest(localStorage.getItem("isGuest") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isGuest");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black">
      <Link href="/dashboard" className="text-lg font-bold text-white">
        THE REAL ROOM
      </Link>

      <div>
        {isGuest ? (
          /* Sign Out removed for Guests -> Show Sign In link instead */
          <Link
            href="/login"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
          >
            Sign In / Register
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}