"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Globe,
    LayoutDashboard,
    FileJson,
    Bot,
    Radiation,
    AlertTriangle,
    Users,
    Zap,
    Wind,
    Gauge,
    Atom,
    Share2,
    Sun,
    Leaf,
    Loader2,
    Send,
    Cpu,
    Activity,
    CheckCircle,
    AlertOctagon
} from 'lucide-react';
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// --- Initial State derived from PDF ---
const INITIAL_STATE = {
    name: "Oceanus Proxima",
    location: "Europa Subsurface (5km depth)",
    population: {
        target: 300,
        current: 4,
        animals: ["Companion Animal"]
    },
    structure: {
        type: "Cryo-Nucleus",
        hull: "Geodesic Static Outer Hull + Rotating 'Gyro-Hab' Core",
        shielding: "5km Ice Crust (Natural Radiation Shield)",
        anchoring: "Rigid Ice Ceiling Anchors",
        emergency: "Positive Buoyancy Escape (Habitat floats if ice shifts)"
    },
    gravity: {
        method: "Centrifuge (Gyro-Hab)",
        level: "1G in Core, 0.134g in Ops",
        schedule: "8h Sleep/Gym (1G) / 16h Ops (Low-G)"
    },
    energy: {
        primary: "Thermal-Heart (Twin-Core SMR, 2x 10MWe)",
        backup: "Regenerative Fuel Cells (30-day reserve)",
        distribution: "30% Electrical / 70% Thermal (Ice Melting)",
        heatSink: "Hydro-Exchange (Ocean as sink)"
    },
    lifeSupport: {
        system: "Aqua-Lung",
        oxygen: "Industrial Electrolysis (2H2O -> 2H2 + O2)",
        co2: "Algae Photobioreactors",
        water: "Vacuum Distillation (100% Urine Recovery)"
    },
    agriculture: {
        system: "Blue-Farm (Symbiotic Aquaponics)",
        tier1: "Tilapia & Shrimp",
        tier2: "Potatoes & Greens",
        fertilizer: "Urine-derived NPK"
    },
    status: {
        integrity: "Compromised (Round 2 Breach)",
        alertLevel: "Yellow",
        tradeOff: "Maintained partial exploration access vs reduced shell safety",
        mitigation: "Active Hydraulic Shoring + O2 Candles"
    }
};

// --- Pre-canned Simulation Logic (No AI) ---
const simulateScenario = (scenario: string, state: any) => {
    const baseResult = {
        survivalProbability: 85,
        alertLevel: "YELLOW",
        systemIntegrity: {
            structure: 88,
            power: 92,
            lifeSupport: 95,
            morale: 75
        },
        timeline: [] as any[],
        outcomeSummary: "",
        criticalFailure: null as string | null
    };

    switch (scenario) {
        case "Ice Shift / Hull Shear":
            baseResult.survivalProbability = 65;
            baseResult.alertLevel = "RED";
            baseResult.systemIntegrity.structure = 45;
            baseResult.outcomeSummary = "Major structural stress detected. Gyro-Hab rotation stopped to prevent resonance disaster.";
            baseResult.criticalFailure = "Sector 4 Anchor Snapped";
            baseResult.timeline = [
                { time: "T+00:00", event: "Seismic sensor triggered magnitude 5.2 ice quake.", impact: "High" },
                { time: "T+00:05", event: "Auto-scram of non-essential systems.", impact: "Low" },
                { time: "T+01:30", event: "Sector 4 anchor integrity loss. Habitat shifting.", impact: "High" },
                { time: "T+04:00", event: "Hydraulic shoring deployed. Stabilization achieved.", impact: "Medium" }
            ];
            break;
        case "Reactor SCRAM (Black Start)":
            baseResult.survivalProbability = 78;
            baseResult.alertLevel = "ORANGE";
            baseResult.systemIntegrity.power = 20;
            baseResult.outcomeSummary = "Main reactor shutdown. Running on reserve fuel cells. Thermal inertia maintaining habitability.";
            baseResult.criticalFailure = "Coolant pump cavitation";
            baseResult.timeline = [
                { time: "T+00:00", event: "Coolant flow variation detected.", impact: "Medium" },
                { time: "T+00:02", event: "Reactor SCRAM initiated automatically.", impact: "High" },
                { time: "T+00:10", event: "Fuel cells online. Essential power only.", impact: "Medium" },
                { time: "T+12:00", event: "Manual restart sequence initiated.", impact: "Low" }
            ];
            break;
        default:
            baseResult.outcomeSummary = "Standard drill execution. No major anomalies.";
            baseResult.timeline = [
                { time: "T+00:00", event: "Simulation initiated.", impact: "Low" },
                { time: "T+48:00", event: "Simulation concluded successfully.", impact: "Low" }
            ];
    }
    return baseResult;
};

// --- Pre-canned Analysis Logic (No AI) ---
const STATIC_ANALYSIS = `### Diagnosis
*   **Structure**: Cryo-Nucleus design relies heavily on ice stability. Current logic shows "Compromised" integrity.
*   **Energy**: Twin-Core SMR is robust, but hydro-exchange as a heat sink affects local ice density, creating a feedback loop for instability.
*   **Life Support**: Electrolysis + Algae is a simplified chain. Algae crash risk is non-zero.

### Options
1.  **Reinforce**: Add active thermal cooling to anchors to prevent melting surrounding ice.
2.  **Redundancy**: Install backup chemical CO2 scrubbers alongside algae.
3.  **Mobilize**: Prepare disconnection clamps for anchors for immediate buoyancy escape.

### Recommendation
Prioritize **Option 1**. The "Round 2 Breach" indicates local ice failure. Active cooling of the anchor points is critical to prevent "melt-out".

### Slide-ready TL;DR
*   **Risk**: Thermal bleed weakening anchor ice.
*   **Fix**: Active cryo-cooling loops on anchor hardpoints.
*   **Status**: Critical retrofit needed.`;

export function SDCCopilotView() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [settlementState, setSettlementState] = useState(JSON.stringify(INITIAL_STATE, null, 2));
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState('');

    // Simulation State
    const [simulationResult, setSimulationResult] = useState<any | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [analysisResult]);

    const runAnalysis = async (customPrompt?: string) => {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real app, we would process the prompt. Here we return the static analysis 
        // or a generic response for custom prompts.
        if (customPrompt && customPrompt.length > 5) {
            setAnalysisResult(`### Analysis of Query: "${customPrompt}"\n\n*System processing...*\n\nBased on the current configuration, this scenario presents a moderate risk to the **${JSON.parse(settlementState).lifeSupport.system}** system. Suggest reviewing redundancy protocols.`);
        } else {
            setAnalysisResult(STATIC_ANALYSIS);
        }
        setIsLoading(false);
    };

    const runSimulation = async (scenario: string) => {
        setIsSimulating(true);
        setSimulationResult(null);
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const result = simulateScenario(scenario, JSON.parse(settlementState));
        setSimulationResult(result);
        setIsSimulating(false);
    };

    // Simplified panel for internal layouts to avoid h-full/overflow conflicts of DashboardPanel
    const GlassPanel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={cn(
            "bg-slate-900/60 backdrop-blur-md border border-border/40 rounded-lg transition-all duration-300",
            className
        )}>
            {children}
        </div>
    );

    return (
        <div className="h-full w-full flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Navigation Sidebar */}
            <DashboardPanel className="w-full md:w-64 flex flex-col p-4 shrink-0">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 border border-primary/50">
                        <Globe className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-primary">SDC Copilot</h1>
                        <p className="text-xs text-foreground/70">Oceanus Proxima</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <NavButton icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavButton icon={FileJson} label="JSON State" active={activeTab === 'json'} onClick={() => setActiveTab('json')} />
                    <NavButton icon={Bot} label="Copilot Analysis" active={activeTab === 'copilot'} onClick={() => setActiveTab('copilot')} />
                    <NavButton icon={Radiation} label="Simulation" active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} />
                </div>

                <div className="mt-auto pt-6 border-t border-border/50">
                    <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="text-amber-500 w-4 h-4" />
                            <span className="text-xs font-semibold text-amber-500">STATUS: YELLOW</span>
                        </div>
                        <p className="text-[10px] text-foreground/70">Structural integrity compromised. Hydraulic shoring active.</p>
                    </div>
                </div>
            </DashboardPanel>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

                {/* Header */}
                <DashboardPanel className="mb-4 shrink-0 p-4 min-h-[auto]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl sm:text-2xl font-light text-primary tracking-wide">
                            {activeTab === 'dashboard' && 'Mission Control'}
                            {activeTab === 'json' && 'Settlement Configuration'}
                            {activeTab === 'copilot' && 'AI Systems Engineer'}
                            {activeTab === 'simulation' && 'Crisis Simulation'}
                        </h2>
                        <div className="text-sm text-foreground/50 font-mono hidden sm:block">
                            SOL: 452 | DEPTH: 5021m
                        </div>
                    </div>
                </DashboardPanel>

                <div className="flex-1 min-h-0 overflow-hidden relative">
                    <ScrollArea className="h-full w-full">
                        <div className="pr-4 pb-4">
                            {activeTab === 'dashboard' && <DashboardView state={JSON.parse(settlementState)} />}

                            {activeTab === 'json' && (
                                <GlassPanel className="h-full overflow-hidden flex flex-col">
                                    <div className="p-4 bg-slate-900/50 border-b border-border/40 flex justify-between items-center">
                                        <span className="text-sm text-foreground/70 font-mono">current_state.json</span>
                                        <button
                                            onClick={() => {
                                                setSettlementState(JSON.stringify(INITIAL_STATE, null, 2));
                                            }}
                                            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-foreground/80 transition"
                                        >
                                            Reset Default
                                        </button>
                                    </div>
                                    <textarea
                                        className="flex-1 w-full min-h-[500px] bg-slate-950/80 text-green-400 font-mono p-4 text-sm resize-none focus:outline-none"
                                        value={settlementState}
                                        onChange={(e) => setSettlementState(e.target.value)}
                                        spellCheck={false}
                                    />
                                </GlassPanel>
                            )}

                            {activeTab === 'copilot' && (
                                <div className="flex flex-col gap-4 h-full">
                                    <GlassPanel className="flex-1 p-6 bg-slate-900/50 min-h-[300px]">
                                        {!analysisResult ? (
                                            <div className="h-full flex flex-col items-center justify-center text-foreground/40">
                                                <Cpu className="w-16 h-16 mb-4 opacity-50" />
                                                <p className="text-lg">Ready to analyze settlement telemetry.</p>
                                                <p className="text-sm">Input a scenario or run a general diagnostic.</p>
                                            </div>
                                        ) : (
                                            <div className="prose prose-invert prose-blue max-w-none">
                                                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-xs font-mono text-green-500">ANALYSIS COMPLETE</span>
                                                </div>
                                                <MarkdownRenderer content={analysisResult} />
                                                <div ref={chatEndRef}></div>
                                            </div>
                                        )}
                                    </GlassPanel>

                                    <GlassPanel className="p-4 flex gap-4 items-end bg-slate-900/50">
                                        <div className="flex-1 relative">
                                            <textarea
                                                className="w-full bg-slate-800/50 border border-border/40 rounded-lg p-3 text-foreground/90 focus:border-primary/50 outline-none transition resize-none h-24 font-sans text-sm"
                                                placeholder="Describe a crisis (e.g., 'Power failure in Sector 4'), crew profile, or leave empty for general structural analysis..."
                                                value={userPrompt}
                                                onChange={(e) => setUserPrompt(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        runAnalysis(userPrompt);
                                                    }
                                                }}
                                            ></textarea>
                                            <div className="absolute bottom-3 right-3 text-xs text-foreground/50">
                                                {userPrompt.length > 0 ? 'Press Enter to send' : 'Ready'}
                                            </div>
                                        </div>
                                        <button
                                            className={cn(
                                                "h-24 px-6 rounded-lg font-semibold flex flex-col items-center justify-center gap-2 transition-all",
                                                isLoading
                                                    ? 'bg-slate-800 cursor-not-allowed text-foreground/40'
                                                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                                            )}
                                            onClick={() => runAnalysis(userPrompt)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    <span className="text-xs">Processing</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span className="text-xs">Analyze</span>
                                                </>
                                            )}
                                        </button>
                                    </GlassPanel>
                                </div>
                            )}

                            {activeTab === 'simulation' && (
                                <SimulationView
                                    onRun={runSimulation}
                                    isSimulating={isSimulating}
                                    result={simulationResult}
                                />
                            )}
                        </div>
                    </ScrollArea>
                </div>

            </main>
        </div>
    );
};

// --- Subcomponents ---

interface NavButtonProps {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}

const NavButton = ({ icon: Icon, label, active, onClick }: NavButtonProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-primary/20 text-primary border border-primary/30' : 'text-foreground/60 hover:bg-slate-800 hover:text-foreground/90'}`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm">{label}</span>
    </button>
);

const SimulationView = ({ onRun, isSimulating, result }: { onRun: (s: string) => void, isSimulating: boolean, result: any }) => {
    const [selectedScenario, setSelectedScenario] = useState("Ice Shift / Hull Shear");
    const scenarios = [
        "Ice Shift / Hull Shear",
        "Reactor SCRAM (Black Start)",
        "Biological Contamination",
        "Communications Blackout",
        "Life Support Failure (CO2 Buildup)"
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* Control Panel */}
            <DashboardPanel className="lg:col-span-1 p-6 flex flex-col h-fit">
                <h3 className="text-lg font-semibold text-primary mb-6">Simulation Parameters</h3>

                <div className="mb-6">
                    <label className="block text-sm text-foreground/60 mb-2">Select Crisis Scenario</label>
                    <div className="space-y-2">
                        {scenarios.map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedScenario(s)}
                                className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedScenario === s ? 'bg-destructive/20 border-destructive text-destructive-foreground' : 'bg-slate-900/50 border-transparent text-foreground/70 hover:bg-slate-800'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onRun(selectedScenario)}
                    disabled={isSimulating}
                    className={`mt-6 w-full py-4 rounded-lg font-bold uppercase tracking-wider transition-all ${isSimulating ? 'bg-slate-800 text-foreground/40' : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20'}`}
                >
                    {isSimulating ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin w-5 h-5" /> Simulating...
                        </span>
                    ) : (
                        "Initiate Simulation"
                    )}
                </button>
            </DashboardPanel>

            {/* Results Panel */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {!result ? (
                    <DashboardPanel className="items-center justify-center text-foreground/50 border-dashed min-h-[300px] flex flex-col">
                        <Activity className="w-16 h-16 mb-4 opacity-50" />
                        <p>Select a scenario and initiate simulation to view impact analysis.</p>
                    </DashboardPanel>
                ) : (
                    <>
                        {/* Top Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <DashboardPanel className="text-center p-4">
                                <div className="text-xs text-foreground/50 uppercase">Survival Probability</div>
                                <div className={`text-3xl font-bold mt-2 ${result.survivalProbability > 80 ? 'text-green-400' : result.survivalProbability > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                                    {result.survivalProbability}%
                                </div>
                            </DashboardPanel>
                            <DashboardPanel className="text-center p-4">
                                <div className="text-xs text-foreground/50 uppercase">Status</div>
                                <div className={`text-xl font-bold mt-2 ${result.alertLevel === 'CRITICAL' || result.alertLevel === 'RED' ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                                    {result.alertLevel}
                                </div>
                            </DashboardPanel>
                            <div className="col-span-2">
                                <DashboardPanel className="flex flex-col justify-center gap-3 p-4">
                                    <SystemBar label="Structure" value={result.systemIntegrity.structure} />
                                    <SystemBar label="Power" value={result.systemIntegrity.power} />
                                    <SystemBar label="Life Support" value={result.systemIntegrity.lifeSupport} />
                                </DashboardPanel>
                            </div>
                        </div>

                        {/* Timeline & Summary */}
                        <DashboardPanel className="flex-1 p-6 relative overflow-hidden">
                            <div className="flex flex-col h-full overflow-hidden">
                                <h4 className="font-semibold text-primary mb-4 border-b border-border/40 pb-2 shrink-0">Simulation Log</h4>

                                <ScrollArea className="flex-1 w-full">
                                    <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-border/40">
                                        <p className="text-sm text-foreground/80 italic">"{result.outcomeSummary}"</p>
                                        {result.criticalFailure && (
                                            <div className="mt-2 text-xs text-red-400 font-semibold flex items-center">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                CRITICAL FAILURE: {result.criticalFailure}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative border-l-2 border-border/30 ml-3 space-y-6 pb-2">
                                        {result.timeline.map((event: any, idx: number) => (
                                            <div key={idx} className="pl-6 relative">
                                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${event.impact === 'High' ? 'bg-red-900 border-red-500' : event.impact === 'Medium' ? 'bg-yellow-900 border-yellow-500' : 'bg-slate-900 border-slate-500'}`}></div>
                                                <div className="text-xs font-mono text-foreground/50 mb-1">{event.time}</div>
                                                <div className="text-sm text-foreground/90">{event.event}</div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </DashboardPanel>
                    </>
                )}
            </div>
        </div>
    );
};

const SystemBar = ({ label, value }: { label: string, value: number }) => (
    <div className="flex items-center gap-3 text-xs w-full">
        <span className="w-20 text-foreground/60 text-right shrink-0">{label}</span>
        <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${value < 40 ? 'bg-red-500' : value < 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
        <span className="w-8 text-foreground/80 font-mono text-right shrink-0">{value}%</span>
    </div>
);

const DashboardView = ({ state }: { state: any }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Key Stats */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <StatCard label="Population" value={`${state.population.current} / ${state.population.target}`} icon={Users} color="text-emerald-400" />
                <StatCard label="Power Output" value="20 MWe" sub="Twin SMR" icon={Zap} color="text-yellow-400" />
                <StatCard label="Oxygen" value="98%" sub="Aqua-Lung Active" icon={Wind} color="text-cyan-400" />
                <StatCard label="Ext. Pressure" value="50 MPa" sub="Safe" icon={Gauge} color="text-purple-400" />
            </div>

            {/* Main Structure Visual */}
            <div className="col-span-1 md:col-span-2 relative overflow-hidden group">
                <DashboardPanel className="p-6">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                        <Atom className="w-32 h-32" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                        <Share2 className="text-primary w-5 h-5" /> Structure: {state.structure.type}
                    </h3>
                    <div className="space-y-4">
                        <SystemRow label="Hull Type" value={state.structure.hull} />
                        <SystemRow label="Shielding" value={state.structure.shielding} />
                        <SystemRow label="Gravity" value={`${state.gravity.method} (${state.gravity.level})`} />
                        <SystemRow label="Defense" value={state.structure.emergency} highlight />
                    </div>
                    <div className="mt-6 pt-6 border-t border-border/40">
                        <div className="bg-destructive/10 border border-destructive/30 p-3 rounded text-sm text-destructive-foreground flex gap-3 items-start">
                            <AlertTriangle className="mt-1 w-4 h-4 shrink-0" />
                            <div>
                                <p className="font-semibold">Current Alert: Hull Integrity</p>
                                <p className="opacity-80 text-xs mt-1">{state.status.tradeOff}</p>
                                <p className="opacity-80 text-xs">Action: {state.status.mitigation}</p>
                            </div>
                        </div>
                    </div>
                </DashboardPanel>
            </div>

            {/* Systems Column */}
            <div className="space-y-6">

                {/* Energy */}
                <DashboardPanel className="p-5 border-l-4 border-l-yellow-500">
                    <h4 className="font-semibold text-foreground mb-3 flex justify-between items-center">
                        <span>Thermal-Heart</span>
                        <Sun className="text-yellow-500 w-5 h-5" />
                    </h4>
                    <div className="text-sm space-y-2 text-foreground/60">
                        <div className="flex justify-between">
                            <span>Reactor</span>
                            <span className="text-foreground/90">{state.energy.primary}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Backup</span>
                            <span className="text-foreground/90">{state.energy.backup}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-yellow-500 h-full w-[90%]"></div>
                        </div>
                        <div className="text-xs text-right mt-1">Efficiency &gt; 90%</div>
                    </div>
                </DashboardPanel>

                {/* Life Support */}
                <DashboardPanel className="p-5 border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-foreground mb-3 flex justify-between items-center">
                        <span>Aqua-Lung & Blue-Farm</span>
                        <Leaf className="text-cyan-500 w-5 h-5" />
                    </h4>
                    <div className="text-sm space-y-2 text-foreground/60">
                        <div className="flex justify-between">
                            <span>O2 Source</span>
                            <span className="text-foreground/90">Electrolysis + Algae</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Food</span>
                            <span className="text-foreground/90">{state.agriculture.tier1}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Water Recovery</span>
                            <span className="text-foreground/90">100% Closed Loop</span>
                        </div>
                    </div>
                </DashboardPanel>

            </div>
        </div>
    );
};

interface StatCardProps {
    label: string;
    value: string;
    sub?: string;
    icon: React.ElementType;
    color: string;
}

const StatCard = ({ label, value, sub, icon: Icon, color }: StatCardProps) => (
    <DashboardPanel className="p-4 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${color} shadow-inner shrink-0`}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
            <div className="text-xs text-foreground/50 uppercase tracking-wider truncate">{label}</div>
            <div className="text-lg font-bold text-foreground leading-none truncate">{value}</div>
            {sub && <div className="text-[10px] text-foreground/60 mt-1 truncate">{sub}</div>}
        </div>
    </DashboardPanel>
);

interface SystemRowProps {
    label: string;
    value: string;
    highlight?: boolean;
}

const SystemRow = ({ label, value, highlight }: SystemRowProps) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-border/30 pb-2 last:border-0 last:pb-0">
        <span className="text-foreground/60 text-sm">{label}</span>
        <span className={`text-sm font-medium ${highlight ? 'text-primary' : 'text-foreground/90'}`}>{value}</span>
    </div>
);

// Simple Markdown Parser for the AI response
const MarkdownRenderer = ({ content }: { content: string }) => {
    if (!content) return null;

    const sections = content.split('\n');

    return (
        <div className="space-y-4 text-sm md:text-base">
            {sections.map((line, idx) => {
                if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-lg font-bold text-primary mt-6 mb-2">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={idx} className="font-bold text-foreground mt-4">{line.replace(/\*\*/g, '')}</h4>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                        <div key={idx} className="flex gap-2 ml-4 text-foreground/80">
                            <span className="text-primary">•</span>
                            <span>{line.replace(/^[-*] /, '')}</span>
                        </div>
                    );
                }
                if (line.trim() === '') return <div key={idx} className="h-2"></div>;

                return <p key={idx} className="text-foreground/80 leading-relaxed">{line}</p>;
            })}
        </div>
    );
};
