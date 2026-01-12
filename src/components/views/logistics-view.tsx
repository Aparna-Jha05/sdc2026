
"use client";
import { useState } from 'react';
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Printer, Package, AlertTriangle } from "lucide-react";
import { useInterval } from '@/lib/hooks';
import { ScrollArea } from '../ui/scroll-area';

interface PrintItem {
    id: number;
    name: string;
    progress: number;
}

const initialPrintQueue: PrintItem[] = [
    { id: 1, name: "Valve Seal Gasket", progress: 45 },
    { id: 2, name: "CO2 Scrubber Filter", progress: 12 },
];

const IsruFoundryQueue = () => {
    const [queue, setQueue] = useState<PrintItem[]>(initialPrintQueue);

    useInterval(() => {
        setQueue(q => q.map(item => ({ ...item, progress: Math.min(100, item.progress + Math.random() * 5) }))
            .filter(item => item.progress < 100));
    }, 1000);

    const addEmergencyPrint = () => {
        const newItem: PrintItem = {
            id: Date.now(),
            name: "Emergency Hull Patch",
            progress: 0,
        };
        setQueue(q => [newItem, ...q]);
    }

    return (
        <DashboardPanel className="h-full flex flex-col">
            <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 flex items-center gap-2 shrink-0">
                <Printer /> ISRU FOUNDRY
            </h2>
            <div className="flex-grow min-h-0">
                <ScrollArea className="h-full pr-2">
                    <div className="space-y-3">
                        {queue.map(item => (
                            <div key={item.id}>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <span className="truncate pr-2 text-foreground/90">{item.name}</span>
                                    <span className="font-mono text-foreground/80">{item.progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={item.progress} className="h-2" />
                            </div>
                        ))}
                        {queue.length === 0 && <p className="text-foreground/70 text-sm text-center py-8">Print queue is empty.</p>}
                    </div>
                </ScrollArea>
            </div>
            <Button variant="destructive" className="w-full mt-4 shrink-0" onClick={addEmergencyPrint}>
                <AlertTriangle className="mr-2" />
                Emergency Print: Hull Patch
            </Button>
        </DashboardPanel>
    );
};

const InventoryLevels = () => {
    return (
        <DashboardPanel className="h-full flex flex-col">
            <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 flex items-center gap-2 shrink-0">
                <Package /> INVENTORY
            </h2>
            <div className="flex-grow min-h-0">
                <ScrollArea className='h-full pr-2'>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Raw Plastic Filament</span>
                                <span className="font-mono text-foreground/80">82%</span>
                            </div>
                            <Progress value={82} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Refined Titanium Alloy</span>
                                <span className="font-mono text-foreground/80">65%</span>
                            </div>
                            <Progress value={65} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Spare O₂ Scrubber Units</span>
                                <span className="font-mono text-foreground/80">40%</span>
                            </div>
                            <Progress value={40} className="[&>div]:bg-amber-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Nutrient Paste Stock</span>
                                <span className="font-mono text-foreground/80">95%</span>
                            </div>
                            <Progress value={95} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Medical Supplies</span>
                                <span className="font-mono text-foreground/80">78%</span>
                            </div>
                            <Progress value={78} />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Rover Spare Parts</span>
                                <span className="font-mono text-foreground/80">33%</span>
                            </div>
                            <Progress value={33} className="[&>div]:bg-amber-500" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-foreground/90">Water Reserves</span>
                                <span className="font-mono text-foreground/80">89%</span>
                            </div>
                            <Progress value={89} />
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </DashboardPanel>
    )
}

export function LogisticsView() {
    return (
        <div className="h-full w-full flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest shrink-0">LOGISTICS & ISRU</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow min-h-0">
                <div className="min-h-[50vh] md:min-h-0 flex flex-col">
                    <IsruFoundryQueue />
                </div>
                <div className="min-h-[50vh] md:min-h-0 flex flex-col">
                    <InventoryLevels />
                </div>
            </div>
        </div>
    );
}
