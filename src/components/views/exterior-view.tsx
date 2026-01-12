
"use client";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { BatteryFull, Thermometer } from "lucide-react";
import { useSimulatedNumber } from "@/lib/hooks";
import { motion } from "framer-motion";

const RadarGrid = () => {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-black/30 rounded-md overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="border border-primary/10"></div>
          ))}
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="w-3 h-3 rounded-full bg-primary pulse-glow" title="Oceanus Proxima Habitat"></div>
        
        <motion.div
          className="absolute"
          animate={{ x: [0, 20, 0, -40, 0], y: [0, 50, 80, 20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_green] flex items-center justify-center" title="Rover Alpha">
            <span className="absolute -top-4 text-xs text-green-400">α</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute"
          animate={{ x: [0, -80, -60, 40, 0], y: [0, -30, 20, -70, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_orange] flex items-center justify-center" title="Rover Beta">
             <span className="absolute -top-4 text-xs text-amber-400">β</span>
          </div>
        </motion.div>
      </div>
    );
  };
  
const RoverStatus = ({ name, color }: { name: string, color: string }) => {
    const battery = useSimulatedNumber(95, 10, 5000, 0, 100);
    const drillTemp = useSimulatedNumber(150, 25, 3000, 120, 300);

    return (
        <DashboardPanel>
            <h3 className={`font-headline font-bold text-md mb-3 text-${color}-400`}>ROVER {name}</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <BatteryFull className={`w-5 h-5 text-${color}-400/80`} />
                        <span>Battery</span>
                    </div>
                    <span className="font-mono">{battery.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Thermometer className={`w-5 h-5 text-${color}-400/80`} />
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
                        <p className="text-xs text-red-500/70">RADIATION INTERFERENCE</p>
                    </div>
                </div>
            </div>
        </DashboardPanel>
    )
}


export function ExteriorView() {
  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest shrink-0">EXTERIOR TELE-ROBOTICS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0">
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <DashboardPanel className="flex-grow">
            <div className="h-full flex flex-col">
                <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-2 shrink-0">SURFACE RADAR GRID</h2>
                <div className="flex-grow min-h-0">
                    <RadarGrid />
                </div>
            </div>
          </DashboardPanel>
        </div>
        <div className="flex flex-col gap-4">
            <RoverStatus name="ALPHA" color="green" />
            <RoverStatus name="BETA" color="amber" />
        </div>
      </div>
      <div className="h-48 xl:h-64 shrink-0 flex flex-col">
        <VideoFeed />
      </div>
    </div>
  );
}
