"use client";
import { motion } from "framer-motion";

interface VerticalProgressProps {
  value: number; // 0-100
  target: number; // 0-100
  label: string;
  title: string;
}

export const VerticalProgress = ({ value, target, label, title }: VerticalProgressProps) => {
  const height = Math.min(Math.max(value, 0), 100);
  const isWarning = value > target * 1.1;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-center text-foreground/70 -mb-1">{title}</p>
      <div className="w-8 h-48 bg-slate-800/50 rounded-md overflow-hidden relative border border-slate-700">
        <motion.div
          className={`absolute bottom-0 w-full ${isWarning ? "bg-amber-500" : "bg-primary"}`}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
        <div
          className="absolute w-full border-t border-dashed border-amber-400/50"
          style={{ bottom: `${target}%`, left: 0 }}
        />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
};
