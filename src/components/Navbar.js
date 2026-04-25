"use client";

import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/ui/glass-button";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ currentPage }) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="px-4 pt-4">
      <div
        className="
        sticky top-4 z-50
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-md
        rounded-2xl
      "
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LEFT */}
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-cyan-400" />

            <h1 className="font-semibold text-xl text-white tracking-wide">
              Roommate Manager
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            <GlassButton
              variant="outline"
              className={currentPage === "dashboard" ? "bg-white/20" : ""}
              onClick={() => {
                if (currentPage !== "dashboard") {
                  router.push("/dashboard");
                }
              }}
            >
              Home
            </GlassButton>

            <GlassButton
              variant="outline"
              className={currentPage === "cleaning" ? "bg-white/20" : ""}
              onClick={() => {
                if (currentPage !== "cleaning") {
                  router.push("/cleaning");
                }
              }}
            >
              Cleaning
            </GlassButton>

            <GlassButton
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </GlassButton>

          </div>

        </div>
      </div>
    </div>
  );
}