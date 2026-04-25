"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import Navbar from "@/components/Navbar";

export default function CleaningPage() {
  const [date, setDate] = useState(new Date());
  const startDate = new Date("2026-01-01"); // you can change this
  const [roommates, setRoommates] = useState([]);
  const [lastCleanedBy, setLastCleanedBy] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [lastCleanedDate, setLastCleanedDate] = useState("");
  const selectedDateString = date.toISOString().split("T")[0];
  const isCleanedToday = lastCleanedDate === selectedDateString;
  const diffTime = date - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    fetchCleaning();
  }, []);
  useEffect(() => {
    setIsDone(false);
  }, [date]);

  const fetchCleaning = async () => {
    const res = await fetch("/api/cleaning/get");
    const data = await res.json();

    setLastCleanedBy(data.lastCleanedBy);
    setLastCleanedDate(data.lastCleanedDate);
  };
  const colorPalette = [
    "rgba(34,197,94,0.35)",   // green
    "rgba(59,130,246,0.35)",  // blue
    "rgba(236,72,153,0.35)",  // pink
    "rgba(251,191,36,0.35)",  // yellow
    "rgba(168,85,247,0.35)",  // purple
  ];
  const getColorForPerson = (person) => {
    const index = roommates.indexOf(person);
    return colorPalette[index % colorPalette.length];
  };
  useEffect(() => {
    fetchRoommates();
  }, []);

  const fetchRoommates = async () => {
    try {
      const res = await fetch("/api/roommates/get");
      const data = await res.json();

      // 👇 IMPORTANT: include "You"
      const names = ["You", ...(data.roommates || []).map(r => r.name)];

      setRoommates(names);

    } catch (error) {
      console.error("Failed to fetch roommates", error);
    }
  };
  // 🧠 CLEANING LOGIC
  let cleaner = "loading...";

  if (roommates.length > 0) {
    const cleanerIndex =
      ((diffDays % roommates.length) + roommates.length) % roommates.length;

    cleaner = roommates[cleanerIndex];
  }

  const handleMarkDone = () => {
    setIsDone(true);
    setLastCleanedBy(cleaner);
  };

  const cleanerColor = getColorForPerson(cleaner);
  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 md:p-12 text-white">
      <Navbar currentPage="cleaning" />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 text-white flex flex-col items-center gap-16"
      >
        <h1 className="text-4xl font-bold text-center mb-12">
          Cleaning Schedule 🧼
        </h1>

        {/* Wrapper with vertical spacing */}
        <div className="flex flex-col items-center">
          {/* 📅 CALENDAR */}
          <GlassCard className="p-6 mb-8 w-full max-w-xl flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              cleaners={roommates}
              startDate={startDate}
              getColorForPerson={getColorForPerson}
              className="
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          text-white
          p-3
        "
            />
          </GlassCard>

          <div className="h-8" />

          {/* 🧼 CLEANING CARD */}
          <GlassCard
            className="p-6 text-center max-w-md w-full mt-4"
            style={{
              background: cleanerColor,
              backdropFilter: "blur(20px)"
            }}
          >
            <p className="text-white/60 text-sm mb-2">Cleaning Duty</p>
            <h2 className="text-2xl font-bold tracking-wide">🧹 {cleaner || "loading..."}</h2>
            <p className="text-white/50 text-sm mt-2">{cleaner === "loading..."
              ? "Fetching schedule..."
              : `${cleaner} cleans on this day`}</p>
            <p className="text-white/50 text-sm mt-2">{date.toDateString()}</p>
          </GlassCard>
          {!isDone ? (
            <GlassButton
              onClick={handleMarkDone}
              variant="primary"
              className="mt-4"
            >
              Mark as Done ✅
            </GlassButton>
          ) : (
            <GlassCard className="p-4 text-center max-w-xs w-full mt-4">
              <p className="text-white/60 text-sm">Status</p>
              <h3 className="text-lg font-semibold mt-1">
                ✅ Cleaned by {lastCleanedBy}
              </h3>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </div>
  );
}