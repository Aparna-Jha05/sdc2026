"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Command, BookOpen, Users, Package, Sliders, AlertTriangle, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';

import { CommandView } from '@/components/views/command-view';
import { EngineeringView } from '@/components/views/engineering-view';
import { CrewBioView } from '@/components/views/crew-bio-view';
import { LogisticsView } from '@/components/views/logistics-view';
import { ExteriorView } from '@/components/views/exterior-view';
import { SimulationView } from '@/components/views/simulation-view';
import { CostView } from '@/components/views/cost-view';



const navItems = [
  { id: 'command', label: 'COMMAND', icon: Command, component: CommandView },
  { id: 'engineering', label: 'ENGINEERING', icon: BookOpen, component: EngineeringView },
  { id: 'crew-bio', label: 'CREW & BIO', icon: Users, component: CrewBioView },
  { id: 'logistics', label: 'LOGISTICS', icon: Package, component: LogisticsView },
  { id: 'exterior', label: 'EXTERIOR', icon: Sliders, component: ExteriorView },
  { id: 'cost', label: 'COST', icon: DollarSign, component: CostView },
  { id: 'simulation', label: 'SIMULATION', icon: AlertTriangle, component: SimulationView },

];

export default function Home() {
  const [activeView, setActiveView] = useState('command');
  const { crisisMode } = useAppState();

  const ActiveComponent = navItems.find(item => item.id === activeView)?.component ?? CommandView;

  return (
    <div className={cn("h-screen flex flex-col md:flex-row transition-colors duration-500", crisisMode ? 'crisis-mode' : '')}>
      <nav className="fixed md:relative top-0 left-0 right-0 md:top-auto md:left-auto md:right-auto z-20 w-full md:w-16 bg-slate-900/50 backdrop-blur-md border-b md:border-b-0 md:border-r border-cyan-500/30 flex md:flex-col items-center p-1 md:py-4 gap-2 md:gap-4">
        <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-lg mb-0 md:mb-4 shrink-0">
          OP
        </div>
        <div className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-x-visible">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "w-16 h-12 md:w-12 md:h-12 flex flex-col items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                "text-foreground/70 hover:bg-cyan-400/10 hover:text-cyan-300",
                activeView === item.id && "bg-cyan-400/20 text-cyan-300 shadow-[inset_0_0_10px_rgba(0,240,255,0.3)]"
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[8px] mt-1">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-2 sm:p-4 overflow-auto pt-16 md:pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
