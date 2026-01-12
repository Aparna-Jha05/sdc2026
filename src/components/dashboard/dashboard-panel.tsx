"use client";

import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";

const Corner: FC<{ position: string }> = ({ position }) => {
  const baseClasses = "absolute w-4 h-4 border-border/60 border-2";
  const positionClasses: { [key: string]: string } = {
    "top-left": "top-2 left-2 border-t border-l",
    "top-right": "top-2 right-2 border-t border-r",
    "bottom-left": "bottom-2 left-2 border-b border-l",
    "bottom-right": "bottom-2 right-2 border-b border-r",
  };
  return <div className={`${baseClasses} ${positionClasses[position]}`} />;
};

interface DashboardPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const DashboardPanel: FC<DashboardPanelProps> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative h-full bg-slate-900/60 backdrop-blur-md border border-border/40 rounded-lg p-6 ${className}`}
    >
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />
      <div className="h-full w-full">{children}</div>
    </motion.div>
  );
};
