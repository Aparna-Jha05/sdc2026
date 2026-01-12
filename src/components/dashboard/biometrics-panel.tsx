"use client";

import { Droplets, Sprout, Wind } from "lucide-react";
import { DashboardPanel } from "./dashboard-panel";
import { RadialChart } from "./radial-chart";
import { useSimulatedData } from "@/lib/hooks";

const crops = [
  { name: "Potatoes", status: "Nominal" },
  { name: "Tilapia", status: "Nominal" },
  { name: "Algae", status: "Optimal" },
  { name: "Spirulina", status: "Optimal" },
];

export function BiometricsPanel() {
  const { biometrics } = useSimulatedData();

  return (
    <DashboardPanel delay={0.4}>
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-headline font-bold text-primary mb-4 tracking-wider">AQUA-LUNG BIOMETRICS</h2>
        <div className="flex flex-col xl:flex-row items-center gap-4 mb-4">
          <div className="w-full xl:w-1/2">
            <RadialChart value={biometrics.o2Saturation} label="O₂ Saturation" />
          </div>
          <div className="w-full xl:w-1/2 flex flex-col gap-2 text-center xl:text-left">
            <div className="flex items-center justify-center xl:justify-start gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">{biometrics.waterFlow.toFixed(0)} L/hr</span>
            </div>
            <p className="text-xs text-foreground/80">WATER RECYCLED</p>
            <div className="flex items-center justify-center xl:justify-start gap-2 mt-2">
              <Wind className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">ACTIVE</span>
            </div>
            <p className="text-xs text-foreground/80">ATMOSPHERE SCRUBBERS</p>
          </div>
        </div>

        <h3 className="text-md font-headline font-bold text-primary/80 mt-4 mb-3 flex items-center gap-2"><Sprout className="w-5 h-5" /> BIOMASS YIELD</h3>
        <div className="flex-grow rounded-md p-3 bg-black/30">
          <ul className="space-y-2">
            {crops.map((crop) => (
              <li key={crop.name} className="flex justify-between items-center text-sm">
                <span>{crop.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/80">{crop.status}</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_theme(colors.green.400)]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardPanel>
  );
}
