"use client";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Waves } from "lucide-react";
import { useAppState } from "@/context/app-state-context";

export function SimulationView() {
    const { setCrisisMode, setAlertMessage, setCrisisAlertOpen } = useAppState();

    const handleReactorScram = () => {
        setAlertMessage("REACTOR SCRAM INITIATED. SWITCHING TO EMERGENCY FUEL CELLS.");
        setCrisisAlertOpen(true);
        setCrisisMode(true);
    }

    const handleIceShift = () => {
        setAlertMessage("CRITICAL: ICE SHELF DISPLACEMENT DETECTED. STRUCTURAL INTEGRITY AT RISK. INITIATING EMERGENCY PROTOCOLS.");
        setCrisisAlertOpen(true);
        setCrisisMode(true);
    }

    const handleHullBreach = () => {
        setAlertMessage("HULL BREACH DETECTED IN SECTOR 7. EMERGENCY BULKHEADS SEALING. EVACUATE AFFECTED AREAS IMMEDIATELY.");
        setCrisisAlertOpen(true);
        setCrisisMode(true);
    }

    const handleReset = () => {
        setCrisisMode(false);
        setAlertMessage("All crisis simulations have been reset. Systems returning to nominal status.");
        setCrisisAlertOpen(true);
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest">CRISIS SIMULATION</h1>
            <div className="flex-grow flex items-center justify-center p-4">
                <DashboardPanel className="max-w-md w-full">
                    <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4">SCENARIO CONTROL</h2>
                    <p className="text-foreground/80 text-sm mb-6">Trigger habitat-wide crisis simulations. Use with extreme caution. All personnel must be at drill stations.</p>
                    <div className="flex flex-col gap-3">
                        <Button variant="destructive" size="lg" className="h-12 text-sm sm:text-base" onClick={handleReactorScram}>
                            <AlertTriangle className="mr-3" />
                            Simulate Reactor Scram
                        </Button>
                        <Button variant="destructive" size="lg" className="h-12 text-sm sm:text-base" onClick={handleIceShift}>
                            <Waves className="mr-3" />
                            Simulate Ice Shift
                        </Button>
                        <Button variant="destructive" size="lg" className="h-12 text-sm sm:text-base" onClick={handleHullBreach}>
                            <ShieldAlert className="mr-3" />
                            Simulate Hull Breach
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 text-sm sm:text-base mt-6" onClick={handleReset}>
                            Reset All Simulations
                        </Button>
                    </div>
                </DashboardPanel>
            </div>
        </div>
    );
}
