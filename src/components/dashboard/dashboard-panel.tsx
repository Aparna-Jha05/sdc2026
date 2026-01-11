"use client";

import type { FC, ReactNode } from "react";
import { motion } from "framer-motion";

const Corner: FC<{ position: string }> = ({ position }) => {
  const baseClasses = "absolute w-3 h-3 border-border";
  const positionClasses: { [key: string]: string } = {
    "top-left": "top-1 left-1 border-t border-l",
    "top-right": "top-1 right-1 border-t border-r",
    "bottom-left": "bottom-1 left-1 border-b border-l",
    "bottom-right": "bottom-1 right-1 border-b border-r",
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
      className={`relative h-full bg-slate-900/50 backdrop-blur-md border border-border/30 rounded-lg p-4 ${className}`}
    >
      <Corner position="top-left" />
      <Corner position="top-right" />
      <Corner position="bottom-left" />
      <Corner position="bottom-right" />
      <div className="h-full w-full">{children}</div>
    </motion.div>
  );
};
