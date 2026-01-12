"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Waves, RefreshCw, Zap, Wind, Thermometer, Activity } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Mathematical Constants ---
const INITIAL_RESOURCES = {
    oxygen: 100, // %
    power: 100, // %
    integrity: 100, // %
    temperature: 20 // Celsius
};

const NOMINAL_RATES = {
    oxygen: -0.05, // % per tick
    power: -0.1, // % per tick
    integrity: 0, // % per tick
    temperature: 0.01 // C per tick (slow heat build up)
};

const RECOVERY_RATES = {
    oxygen: 0.5,
    power: 1.0,
    integrity: 0.1,
    temperature: -0.2
};

// Simulation Tick Rate (ms)
const TICK_RATE = 1000;
const HISTORY_LENGTH = 30;

type ResourceType = 'oxygen' | 'power' | 'integrity' | 'temperature';

export function SimulationView() {
    const { setCrisisMode, setAlertMessage, setCrisisAlertOpen, crisisMode } = useAppState();

    // --- State ---
    const [resources, setResources] = useState(INITIAL_RESOURCES);
    const [rates, setRates] = useState(NOMINAL_RATES);
    const [history, setHistory] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(true);
    const [activeCrisis, setActiveCrisis] = useState<string | null>(null);

    // Refs for calculations to avoid closure staleness in interval
    const resourcesRef = useRef(INITIAL_RESOURCES);
    const ratesRef = useRef(NOMINAL_RATES);

    // Sync refs
    useEffect(() => {
        resourcesRef.current = resources;
    }, [resources]);
    useEffect(() => {
        ratesRef.current = rates;
    }, [rates]);

    // --- Math Engine ---
    const tick = useCallback(() => {
        if (!isRunning) return;

        const currentRes = resourcesRef.current;
        const currentRates = ratesRef.current;

        // Apply rates (Logarithmic decay for integrity to simulate stress?)
        // Simple Linear for now, but clamped.
        const newResources = {
            oxygen: Math.max(0, Math.min(100, currentRes.oxygen + currentRates.oxygen)),
            power: Math.max(0, Math.min(100, currentRes.power + currentRates.power)),
            integrity: Math.max(0, Math.min(100, currentRes.integrity + currentRates.integrity)),
            temperature: Math.max(-50, Math.min(150, currentRes.temperature + currentRates.temperature)),
        };

        setResources(newResources);

        // Update History
        setHistory(prev => {
            const newHistory = [...prev, { time: new Date().toLocaleTimeString(), ...newResources }];
            if (newHistory.length > HISTORY_LENGTH) return newHistory.slice(newHistory.length - HISTORY_LENGTH);
            return newHistory;
        });

        // Trigger Alerts based on Thresholds
        checkThresholds(newResources);

    }, [isRunning]);

    // Loop
    useEffect(() => {
        const interval = setInterval(tick, TICK_RATE);
        return () => clearInterval(interval);
    }, [tick]);

    const checkThresholds = (res: typeof INITIAL_RESOURCES) => {
        if (!crisisMode) {
            if (res.integrity < 20) triggerSystemAlert("CRITICAL: STRUCTURAL INTEGRITY FAILING");
            else if (res.oxygen < 15) triggerSystemAlert("DANGER: OXYGEN LEVELS CRITICAL");
            else if (res.temperature > 50) triggerSystemAlert("WARNING: OVERHEATING");
        }
    };

    const triggerSystemAlert = (msg: string) => {
        if (crisisMode) return; // Already dealing with it
        setAlertMessage(msg);
        setCrisisAlertOpen(true);
        setCrisisMode(true);
    };

    // --- Scenario Handlers ---

    const handleReactorScram = () => {
        triggerSystemAlert("REACTOR SCRAM INITIATED. OFF-LINE. BATTERY RESERVES DRAINING.");
        setActiveCrisis("reactor");
        setRates(prev => ({
            ...prev,
            power: -2.5, // Rapid drain
            temperature: -0.5 // Cooling rapidly
        }));
    };

    const handleIceShift = () => {
        triggerSystemAlert("SEISMIC ACTIVITY DETECTED. STRUCTURAL STRESS INCREASING.");
        setActiveCrisis("ice");
        setResources(prev => ({ ...prev, integrity: prev.integrity - 15 })); // Instant damage
        setRates(prev => ({
            ...prev,
            integrity: -0.5, // Continuous damage
            power: -0.2
        }));
    };

    const handleHullBreach = () => {
        triggerSystemAlert("HULL BREACH. ATMOSPHERE VENTING.");
        setActiveCrisis("hull");
        setRates(prev => ({
            ...prev,
            oxygen: -3.0, // Major venting
            temperature: -1.0, // Rapid cooling to external water temp
            integrity: -0.2
        }));
    };

    const handleStabilize = (type: ResourceType) => {
        // Mitigation Math
        const currentRate = rates[type];

        let newRate = currentRate;
        if (type === 'temperature') {
            // For temp, we want to go back to 20. If > 20, rate should be neg, if < 20, pos.
            const diff = 20 - resources.temperature;
            newRate = diff * 0.1;
        } else {
            // Add recovery rate
            newRate = currentRate + RECOVERY_RATES[type];
            // Clamp to nominal if we overshoot (unless it's power which can charge)
            if (newRate > NOMINAL_RATES[type] && type !== 'power') newRate = NOMINAL_RATES[type];
        }

        setRates(prev => ({ ...prev, [type]: newRate }));
    };

    const handleReset = () => {
        setCrisisMode(false);
        setActiveCrisis(null);
        setAlertMessage("Systems stabilized. Returning to nominal operation.");
        setCrisisAlertOpen(true);
        setResources(INITIAL_RESOURCES);
        setRates(NOMINAL_RATES);
        setHistory([]);
    };

    return (
        <div className="h-full flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest flex items-center gap-3">
                    <Activity className="w-6 h-6" />
                    SIMULATION TELEMETRY
                </h1>
                <div className="flex gap-2">
                    <Button variant={isRunning ? "outline" : "default"} size="sm" onClick={() => setIsRunning(!isRunning)}>
                        {isRunning ? "PAUSE SIM" : "RESUME SIM"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        RESET
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow min-h-0">

                {/* Center / Top - Live Metrics */}
                <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
                    <DashboardPanel className="flex-grow flex flex-col min-h-[300px]">
                        <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 shrink-0">RESOURCE TRENDS</h2>
                        <div className="flex-grow w-full h-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="time" hide />
                                    <YAxis domain={[0, 100]} stroke="#888888" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <ReferenceLine y={20} stroke="red" strokeDasharray="3 3" label="Crit" />
                                    <Line type="monotone" dataKey="oxygen" stroke="#3b82f6" dot={false} strokeWidth={2} name="Oxygen" />
                                    <Line type="monotone" dataKey="power" stroke="#eab308" dot={false} strokeWidth={2} name="Power" />
                                    <Line type="monotone" dataKey="integrity" stroke="#ef4444" dot={false} strokeWidth={2} name="Integrity" />
                                    <Line type="monotone" dataKey="temperature" stroke="#f97316" dot={false} strokeWidth={2} name="Temp (C)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardPanel>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {/* Metric Cards */}
                        <MetricCard
                            label="OXYGEN"
                            value={resources.oxygen}
                            unit="%"
                            rate={rates.oxygen}
                            icon={Wind}
                            color="blue"
                            onStabilize={() => handleStabilize('oxygen')}
                            isCrisis={activeCrisis === 'hull'}
                        />
                        <MetricCard
                            label="POWER"
                            value={resources.power}
                            unit="%"
                            rate={rates.power}
                            icon={Zap}
                            color="yellow"
                            onStabilize={() => handleStabilize('power')}
                            isCrisis={activeCrisis === 'reactor'}
                        />
                        <MetricCard
                            label="INTEGRITY"
                            value={resources.integrity}
                            unit="%"
                            rate={rates.integrity}
                            icon={ShieldAlert}
                            color="red"
                            onStabilize={() => handleStabilize('integrity')}
                            isCrisis={activeCrisis === 'ice'}
                        />
                        <MetricCard
                            label="TEMP"
                            value={resources.temperature}
                            unit="°C"
                            rate={rates.temperature}
                            icon={Thermometer}
                            color="orange"
                            onStabilize={() => handleStabilize('temperature')}
                            isCrisis={false}
                        />
                    </div>
                </div>

                {/* Right / Bottom - Controls */}
                <div className="flex flex-col gap-4">
                    <DashboardPanel className="flex-grow">
                        <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4">CHAOS ENGINE</h2>
                        <p className="text-xs text-foreground/60 mb-6">
                            Inject entropy into the system to test failure cascades and recovery protocols.
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button variant="destructive" className="justify-start h-auto py-3" onClick={handleReactorScram}>
                                <div className="flex flex-col items-start text-left">
                                    <div className="flex items-center font-bold"><Zap className="w-4 h-4 mr-2" /> REACTOR SCRAM</div>
                                    <span className="text-[10px] opacity-80">Simulate total loss of main generator.</span>
                                </div>
                            </Button>
                            <Button variant="destructive" className="justify-start h-auto py-3" onClick={handleIceShift}>
                                <div className="flex flex-col items-start text-left">
                                    <div className="flex items-center font-bold"><Waves className="w-4 h-4 mr-2" /> SEISMIC EVENT</div>
                                    <span className="text-[10px] opacity-80">Simulate magnitude 7.0 ice quake.</span>
                                </div>
                            </Button>
                            <Button variant="destructive" className="justify-start h-auto py-3" onClick={handleHullBreach}>
                                <div className="flex flex-col items-start text-left">
                                    <div className="flex items-center font-bold"><AlertTriangle className="w-4 h-4 mr-2" /> HULL BREACH</div>
                                    <span className="text-[10px] opacity-80">Simulate rapid decompression in Sector 4.</span>
                                </div>
                            </Button>
                        </div>
                    </DashboardPanel>

                    <DashboardPanel className="h-auto">
                        <h3 className="text-sm font-bold text-primary mb-2">SIMULATION STATUS</h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Tick Rate:</span>
                                <span className="font-mono">{TICK_RATE}ms</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Data Points:</span>
                                <span className="font-mono">{history.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-foreground/70">Engine State:</span>
                                <span className={isRunning ? "text-green-500" : "text-amber-500"}>{isRunning ? "RUNNING" : "PAUSED"}</span>
                            </div>
                        </div>
                    </DashboardPanel>
                </div>

            </div>
        </div>
    );
}

// Sub-component for individual metrics
function MetricCard({ label, value, unit, rate, icon: Icon, color, onStabilize, isCrisis }: any) {
    const getColorClass = (c: string) => {
        switch (c) {
            case 'blue': return 'text-blue-400 border-blue-500/30';
            case 'yellow': return 'text-yellow-400 border-yellow-500/30';
            case 'red': return 'text-red-400 border-red-500/30';
            case 'orange': return 'text-orange-400 border-orange-500/30';
            default: return 'text-foreground';
        }
    }

    // Calculate color based on value thresholds
    const getValueColor = () => {
        if (label === 'TEMP') {
            if (value > 40 || value < 10) return 'text-red-500';
            return 'text-foreground';
        }
        if (value < 30) return 'text-red-500';
        if (value < 50) return 'text-yellow-500';
        return 'text-foreground';
    }

    return (
        <DashboardPanel className={cn("p-3 flex flex-col justify-between border", isCrisis && "border-red-500 animate-pulse")}>
            <div className="flex justify-between items-start mb-2">
                <div className={cn("p-2 rounded-md bg-secondary/50", getColorClass(color))}>
                    <Icon className="w-4 h-4" />
                </div>
                <div className={cn("text-xs font-mono", rate > 0 ? "text-green-400" : rate < 0 ? "text-red-400" : "text-foreground/50")}>
                    {rate > 0 ? "+" : ""}{rate.toFixed(1)}/s
                </div>
            </div>
            <div>
                <div className="text-[10px] text-foreground/60 font-bold tracking-wider">{label}</div>
                <div className={cn("text-2xl font-mono font-bold", getValueColor())}>
                    {value.toFixed(1)}<span className="text-base font-normal text-foreground/50 ml-1">{unit}</span>
                </div>
            </div>
            <div className="mt-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-[10px]"
                    onClick={onStabilize}
                    disabled={Math.abs(rate) < 0.1 && value > 90}
                >
                    STABILIZE
                </Button>
            </div>
        </DashboardPanel>
    )
}
