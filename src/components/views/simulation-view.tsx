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
    
    const handleReset = () => {
        setCrisisMode(false);
    }

    const handleComingSoon = () => {
        setAlertMessage("This simulation scenario is not yet available.");
        setCrisisAlertOpen(true);
    }

  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary tracking-widest">CRISIS SIMULATION</h1>
      <div className="flex-grow flex items-center justify-center">
        <DashboardPanel className="max-w-md w-full">
            <h2 className="text-lg font-bold text-primary mb-4">SCENARIO CONTROL</h2>
            <p className="text-foreground/70 text-sm mb-6">Trigger habitat-wide crisis simulations. Use with extreme caution. All personnel must be at drill stations.</p>
            <div className="flex flex-col gap-4">
                <Button variant="destructive" size="lg" className="h-16 text-lg" onClick={handleReactorScram}>
                    <AlertTriangle className="mr-4"/>
                    Simulate Reactor Scram
                </Button>
                <Button variant="destructive" size="lg" className="h-16 text-lg" onClick={handleComingSoon} disabled>
                    <Waves className="mr-4" />
                    Simulate Ice Shift
                </Button>
                <Button variant="destructive" size="lg" className="h-16 text-lg" onClick={handleComingSoon} disabled>
                    <ShieldAlert className="mr-4" />
                    Simulate Hull Breach
                </Button>
                <Button variant="outline" size="lg" className="h-12 text-lg mt-8" onClick={handleReset}>
                    Reset All Simulations
                </Button>
            </div>
        </DashboardPanel>
      </div>
    </div>
  );
}
