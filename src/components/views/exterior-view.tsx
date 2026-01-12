
"use client";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { BatteryFull, Thermometer } from "lucide-react";
import { useSimulatedNumber } from "@/lib/hooks";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const RadarGrid = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-black/50 rounded-md overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 z-0">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="border border-primary/30"></div>
        ))}
      </div>

      {/* Scanning Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent z-10 pointer-events-none"
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center Habitat Marker */}
      <div className="absolute w-3 h-3 rounded-full bg-primary pulse-glow z-20" title="Oceanus Proxima Habitat"></div>

      {/* Rover Alpha */}
      <motion.div
        className="absolute z-20"
        style={{ left: '50%', top: '50%' }}
        animate={{
          x: [0, 20, 0, -40, 0],
          y: [0, 50, 80, 20, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_green]" title="Rover Alpha">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-green-400 font-bold">α</span>
        </div>
      </motion.div>

      {/* Rover Beta */}
      <motion.div
        className="absolute z-20"
        style={{ left: '50%', top: '50%' }}
        animate={{
          x: [0, -80, -60, 40, 0],
          y: [0, -30, 20, -70, 0]
        }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <div className="relative w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_orange]" title="Rover Beta">
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-amber-400 font-bold">β</span>
        </div>
      </motion.div>
    </div>
  );
};

const RoverStatus = ({ name, colorClass }: { name: string, colorClass: string }) => {
  const battery = useSimulatedNumber(95, 10, 5000, 0, 100);
  const drillTemp = useSimulatedNumber(150, 25, 3000, 120, 300);

  return (
    <DashboardPanel>
      <h3 className={cn(`font-headline font-bold text-md mb-3`, colorClass)}>{`ROVER ${name}`}</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BatteryFull className={cn("w-5 h-5", colorClass)} />
            <span>Battery</span>
          </div>
          <span className="font-mono">{battery.toFixed(0)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className={cn("w-5 h-5", colorClass)} />
            <span>Drill Temp</span>
          </div>
          <span className="font-mono">{drillTemp.toFixed(0)}°C</span>
        </div>
      </div>
    </DashboardPanel>
  )
}

const VideoFeed = () => {
  return (
    <DashboardPanel className="h-full">
      <div className="h-full flex flex-col">
        <h3 className="font-headline font-bold text-md text-primary mb-2 shrink-0">ROVER ALPHA - FWD CAM</h3>
        <div className="flex-grow bg-black/50 rounded-md static-noise flex items-center justify-center min-h-0">
          <div className="text-center p-4 bg-black/70 rounded-md">
            <p className="text-lg font-bold text-red-500">NO SIGNAL</p>
            <p className="text-sm text-red-500/80">RADIATION INTERFERENCE</p>
          </div>
        </div>
      </div>
    </DashboardPanel>
  )
}


export function ExteriorView() {
  return (
    <div className="h-full w-full flex flex-col gap-4">
      <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest shrink-0">EXTERIOR TELE-ROBOTICS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0">
        <div className="lg:col-span-2 flex flex-col min-h-[400px] lg:min-h-0">
          <DashboardPanel className="flex-grow flex flex-col">
            <div className="flex flex-col h-full">
              <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-3 shrink-0">SURFACE RADAR GRID</h2>
              <div className="flex-grow relative min-h-[300px] w-full bg-slate-950/50 rounded-md overflow-hidden">
                <RadarGrid />
              </div>
            </div>
          </DashboardPanel>
        </div>
        <div className="flex flex-col gap-4">
          <RoverStatus name="ALPHA" colorClass="text-green-400" />
          <RoverStatus name="BETA" colorClass="text-amber-400" />
        </div>
      </div>
      <div className="h-48 xl:h-64 shrink-0">
        <VideoFeed />
      </div>
    </div>
  );
}

