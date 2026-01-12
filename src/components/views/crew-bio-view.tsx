"use client";
import { useState, useEffect } from 'react';
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { HeartPulse, Radiation, Bone } from "lucide-react";
import { useSimulatedNumber } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const crewData = [
  { id: 1, name: "Cmdr. Eva Rostova", avatar: "1" },
  { id: 2, name: "Dr. Kenji Tanaka", avatar: "2" },
  { id: 3, name: "Eng. Priya Singh", avatar: "3" },
  { id: 4, name: "Bio. Sam O'Connell", avatar: "4" },
  { id: 5, name: "Xeno. Lena Petrova", avatar: "5" },
  { id: 6, name: "Pilot Jax", avatar: "6" },
];

const CrewCard = ({ member }: { member: typeof crewData[0] }) => {
  const heartRate = useSimulatedNumber(72, 5, 2000, 60, 110);
  const radiation = useSimulatedNumber(0.1, 0.3, 5000, 0, 1);
  const boneDensity = useSimulatedNumber(98, 0.1, 8000, 95, 100);

  const isRadHigh = radiation > 0.8;

  return (
    <DashboardPanel className={cn("h-full", isRadHigh && "border-destructive/80 bg-destructive/10")}>
      <div className="flex items-center gap-3">
        <img src={`https://i.pravatar.cc/80?u=${member.avatar}`} alt={member.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-primary/50" />
        <div>
          <h3 className="font-headline font-bold text-xs sm:text-sm text-primary">{member.name}</h3>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <HeartPulse className="w-5 h-5 mx-auto text-primary/70 mb-1" />
          <p className="font-bold text-base sm:text-lg">{heartRate.toFixed(0)}</p>
          <p className="text-foreground/60 text-[10px] sm:text-xs">BPM</p>
        </div>
        <div className={cn(isRadHigh && "text-destructive")}>
          <Radiation className="w-5 h-5 mx-auto text-primary/70 mb-1" />
          <p className="font-bold text-base sm:text-lg">{radiation.toFixed(2)}</p>
          <p className="text-foreground/60 text-[10px] sm:text-xs">mSv</p>
        </div>
        <div>
          <Bone className="w-5 h-5 mx-auto text-primary/70 mb-1" />
          <p className="font-bold text-base sm:text-lg">{boneDensity.toFixed(1)}%</p>
          <p className="text-foreground/60 text-[10px] sm:text-xs">BDI</p>
        </div>
      </div>
    </DashboardPanel>
  );
};

const Heatmap = () => {
    const [points, setPoints] = useState<any[]>([]);
  
    useEffect(() => {
      const generatePoints = () => {
        const newPoints = Array.from({ length: 15 }).map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: Math.random(),
        }));
        setPoints(newPoints);
      };
      generatePoints();
      const interval = setInterval(generatePoints, 5000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="w-full h-full relative bg-black/30 rounded-md">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="heatmap-blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <radialGradient id="stress-point" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="red" stopOpacity="1" />
                <stop offset="50%" stopColor="yellow" stopOpacity="0.5" />
                <stop offset="100%" stopColor="green" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g filter="url(#heatmap-blur)">
            {points.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={15 * p.intensity}
                fill="url(#stress-point)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: p.intensity * 0.7, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              />
            ))}
          </g>
        </svg>
        <p className="absolute bottom-2 right-2 text-xs text-foreground/50">Habitat Sectors: Medbay, Lab, Rec Room</p>
      </div>
    );
  };

export function CrewBioView() {
  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest">CREW & BIOMETRICS</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-grow min-h-0">
        <div className="xl:col-span-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 min-h-0">
          {crewData.map((member) => (
            <div key={member.id} className="min-h-[150px] sm:min-h-0">
                <CrewCard member={member} />
            </div>
          ))}
        </div>
        <div className="min-h-[40vh] xl:min-h-0">
            <DashboardPanel>
                <div className="h-full flex flex-col">
                    <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-2">STRESS HEATMAP</h2>
                    <p className="text-xs text-foreground/60 mb-4">Real-time audio-visual stress indicators.</p>
                    <div className="flex-grow">
                        <Heatmap />
                    </div>
                </div>
            </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
