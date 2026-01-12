"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardPanel } from "./dashboard-panel";
import { detectTelemetryAnomalies } from "@/ai/flows/telemetry-anomaly-detection";
import { useInterval, useSimulatedData } from "@/lib/hooks";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useAppState } from "@/context/app-state-context";

type LogType = "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";

interface LogEntry {
  id: number;
  type: LogType;
  message: string;
  timestamp: string;
}

const logTypeStyles: { [key in LogType]: { color: string; icon: React.ReactNode } } = {
  INFO: { color: "text-foreground/70", icon: <Info className="w-3.5 h-3.5" /> },
  SUCCESS: { color: "text-green-400", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  WARNING: { color: "text-amber-400", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  CRITICAL: { color: "text-red-500", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

const initialLogMessages = [
    { id: 1, type: "INFO" as LogType, message: "Connecting to Oceanus Proxima telemetry stream..." },
    { id: 2, type: "SUCCESS" as LogType, message: "Bio-Firewall: SECURE" },
    { id: 3, type: "SUCCESS" as LogType, message: "Tele-robotics link: STABLE" },
    { id: 4, type: "INFO" as LogType, message: "Real-time anomaly detection armed." },
];

let logIdCounter = 5;

export function SystemLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const { thermodynamics } = useSimulatedData();
  const { crisisMode } = useAppState();

  useEffect(() => {
    // This effect runs only on the client after hydration
    if (logs.length === 0) {
      const clientInitialLogs = initialLogMessages.map(log => ({
        ...log,
        timestamp: new Date().toLocaleTimeString(),
      }));
      setLogs(clientInitialLogs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLog = (type: LogType, message: string) => {
    setLogs(prev => [...prev.slice(-100), { id: logIdCounter++, type, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    if (crisisMode && logs.length > 0) { // check logs.length to avoid adding logs before initialization
      addLog("CRITICAL", "CRISIS MODE ACTIVATED. REACTOR SCRAM INITIATED.");
      addLog("WARNING", "Switching to emergency fuel cells. Non-essential systems offline.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crisisMode]);

  useInterval(async () => {
    if (crisisMode) return;

    const { coreA, coreB, powerOutput } = thermodynamics;
    const telemetryData = { coreATemp: coreA.toFixed(1), coreBTemp: coreB.toFixed(1), powerOutput: powerOutput.toFixed(2) };
    const historicalData = { avgCoreTemp: 600, avgPowerOutput: 18.4 };
    
    try {
      const result = await detectTelemetryAnomalies({
        systemName: "Twin-Core SMR",
        telemetryData: JSON.stringify(telemetryData),
        historicalData: JSON.stringify(historicalData),
      });

      if (result.isAnomalyDetected) {
        addLog("WARNING", result.anomalyExplanation);
        if (result.suggestedActions) {
          addLog("INFO", `ACTION: ${result.suggestedActions}`);
        }
      } else if (Math.random() < 0.2) { // Occasionally log a success message
         addLog("SUCCESS", "All systems nominal. Telemetry within expected parameters.");
      }
    } catch (error) {
      console.error("Anomaly detection failed:", error);
      addLog("CRITICAL", "Anomaly detection AI offline. Check connection.");
    }
  }, 30000);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <DashboardPanel className="flex flex-col">
      <h2 className="text-lg font-headline font-bold text-primary mb-2 tracking-wider">SYSTEM LOGS</h2>
      <div ref={logContainerRef} className="flex-grow overflow-y-auto pr-2 bg-black/30 rounded-md p-2">
        <AnimatePresence initial={false}>
          {logs.map((log) => {
            const style = logTypeStyles[log.type];
            return (
              <motion.div
                key={log.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 text-xs mb-1 ${style.color}`}
              >
                <span className="flex-shrink-0 mt-0.5">{style.icon}</span>
                <span className="text-foreground/50">{log.timestamp}</span>
                <p className="flex-grow">{log.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </DashboardPanel>
  );
}
