"use client";
import { useState, useEffect } from "react";
import { useSimulatedData } from "@/lib/hooks";

export function GlobalHeader() {
  const [missionTime, setMissionTime] = useState("T+05Y:012D:04H");
  const { global } = useSimulatedData();

  useEffect(() => {
    const missionStart = new Date();
    missionStart.setFullYear(missionStart.getFullYear() - 5);
    missionStart.setDate(missionStart.getDate() - 12);
    missionStart.setHours(missionStart.getHours() - 4);

    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - missionStart.getTime();

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      setMissionTime(`T+${String(years).padStart(2, '0')}Y:${String(days).padStart(3, '0')}D:${String(hours).padStart(2, '0')}H`);
    }, 1000 * 60);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="w-full bg-slate-900/50 backdrop-blur-md border-b-2 border-border/30 p-2 sm:p-3 flex justify-between items-center text-sm sm:text-base font-headline">
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="font-bold text-primary text-base sm:text-xl tracking-widest truncate">OCEANUS PROXIMA</h1>
        <div className="hidden lg:block w-px h-6 bg-border/30"></div>
        <p className="hidden xl:block text-primary/90 font-body">{missionTime}</p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 text-[10px] xxs:text-xs sm:text-sm font-body">
        <div className="flex items-center gap-1 sm:gap-2">
          <p className="text-foreground/70 hidden sm:block">DEPTH:</p>
          <p className="font-bold text-primary">5.2km</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <p className="text-foreground/70 hidden sm:block">PRESSURE:</p>
          <p className="text-foreground/70 sm:hidden">P:</p>
          <p className="font-bold text-primary">{global.externalPressure.toFixed(1)}MPa</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <p className="text-foreground/70">RADS:</p>
          <p className="font-bold text-green-400">100%</p>
        </div>
      </div>
    </header>
  );
}
