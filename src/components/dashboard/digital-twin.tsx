"use client";
import { motion } from "framer-motion";

export function DigitalTwin() {
  return (
    <DashboardPanel delay={0.2}>
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-lg font-bold text-primary mb-4 tracking-wider">HABITAT DIGITAL TWIN</h2>
        <div className="w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 400 400" className="w-full h-full max-w-[400px] max-h-[400px]">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ice Crust */}
            <path d="M 0 100 C 50 80, 100 120, 150 100 S 250 80, 300 120 S 400 100, 400 100" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" strokeDasharray="5, 5"/>
            <text x="200" y="80" textAnchor="middle" fill="hsl(var(--primary) / 0.7)" fontSize="12" className="font-headline tracking-widest">EUROPA ICE CRUST</text>
            
            {/* Main Habitat Sphere */}
            <g className="pulse-glow" transform="translate(200, 220)">
              <circle cx="0" cy="0" r="90" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary))" strokeWidth="1.5" />
              <text x="0" y="0" textAnchor="middle" dy="0.3em" fill="hsl(var(--primary))" fontSize="14" className="font-bold">OCEANUS</text>
            </g>

            {/* Gravity Centrifuge */}
            <g transform="translate(200, 220)" className="spin-slow">
              <circle cx="0" cy="0" r="70" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeDasharray="2, 4"/>
              <circle cx="0" cy="-70" r="4" fill="hsl(var(--primary))" />
              <circle cx="70" cy="0" r="4" fill="hsl(var(--primary))" />
              <circle cx="0" cy="70" r="4" fill="hsl(var(--primary))" />
              <circle cx="-70" cy="0" r="4" fill="hsl(var(--primary))" />
            </g>
            <text x="200" y="160" textAnchor="middle" fill="hsl(var(--primary) / 0.7)" fontSize="10">GRAVITY CENTRIFUGE</text>

            {/* Reactor connection */}
            <line x1="200" y1="310" x2="200" y2="350" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2"/>
            
            {/* SMR Reactor Core */}
            <motion.g
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <rect x="180" y="350" width="40" height="20" rx="3" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth="1" />
            </motion.g>
            <text x="200" y="385" textAnchor="middle" fill="hsl(var(--primary) / 0.7)" fontSize="10">SMR REACTOR CORE</text>
          </svg>
        </div>
      </div>
    </DashboardPanel>
  );
}

import { DashboardPanel } from "./dashboard-panel";
