"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message) {
        router.push("/login");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4">

      <GlassCard className="w-full max-w-md p-8 space-y-6">

        <h1 className="text-2xl font-semibold text-white text-center">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="bg-white/10 border border-white/20 p-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="bg-white/10 border border-white/20 p-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="bg-white/10 border border-white/20 p-3 rounded-xl text-white placeholder-white/50 focus:outline-none"
          />

          <GlassButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </GlassButton>

        </form>

        <p className="text-center text-white/60 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-cyan-400 cursor-pointer"
          >
            Login
          </span>
        </p>

      </GlassCard>
    </div>
  );
}