"use client";

import { Zap } from "lucide-react";
import { DashboardPanel } from "./dashboard-panel";
import { PowerChart } from "./power-chart";
import { VerticalProgress } from "./vertical-progress";
import { useSimulatedData } from "@/lib/hooks";

export function ThermodynamicsPanel() {
  const { thermodynamics } = useSimulatedData();
  const { coreA, coreB, powerOutput, isCogenerationActive } = thermodynamics;
  
  // Normalize temperatures to a 0-1000 range for the progress bar (0-100%)
  const normalizeTemp = (temp: number) => (temp / 1000) * 100;

  return (
    <DashboardPanel delay={0.3}>
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-bold text-primary mb-4 tracking-wider">TWIN-CORE THERMODYNAMICS</h2>
        <div className="flex justify-around items-end mb-4">
          <VerticalProgress 
            value={normalizeTemp(coreA)} 
            target={60} 
            label={`${coreA.toFixed(0)}°C`} 
            title="Core A Temp."
          />
          <div className="text-center">
            <Zap className={`w-10 h-10 mb-2 mx-auto ${isCogenerationActive ? 'text-primary pulse-glow' : 'text-foreground/50'}`} />
            <p className={`text-sm font-bold ${isCogenerationActive ? 'text-primary' : 'text-amber-500'}`}>
              {isCogenerationActive ? 'COGEN LOOP: ACTIVE' : 'COGEN LOOP: OFFLINE'}
            </p>
            <p className="text-2xl font-bold">{powerOutput.toFixed(2)} MW</p>
            <p className="text-xs text-foreground/70">TOTAL POWER OUTPUT</p>
          </div>
          <VerticalProgress 
            value={normalizeTemp(coreB)} 
            target={60} 
            label={`${coreB.toFixed(0)}°C`} 
            title="Core B Temp."
          />
        </div>
        <div className="flex-grow">
          <PowerChart />
        </div>
      </div>
    </DashboardPanel>
  );
}
