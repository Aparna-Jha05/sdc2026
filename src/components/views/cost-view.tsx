"use client";

import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

const costData = [
  { component: "Structural Architecture", cost: "15,354 Cr", vulnerability: "HIGH" },
  { component: "Energy Systems", cost: "15,300 Cr", vulnerability: "MEDIUM" },
  { component: "Maintenance & Buffer", cost: "13,689 Cr", vulnerability: "HIGH" },
  { component: "Deployment Infrastructure", cost: "7,686 Cr", vulnerability: "LOW" },
  { component: "Robotics & Environment", cost: "3,762 Cr", vulnerability: "HIGH" },
  { component: "Life Support (LSS)", cost: "3,384 Cr", vulnerability: "HIGH" },
  { component: "Planetary Protection", cost: "2,160 Cr", vulnerability: "LOW" },
  { component: "Space Agriculture", cost: "2,007 Cr", vulnerability: "LOW" },
  { component: "In-Situ Manufacturing", cost: "1,827 Cr", vulnerability: "MEDIUM" },
];

const vulnerabilityStyles: { [key: string]: string } = {
  HIGH: "bg-red-500/20 text-red-400 border-red-500/50",
  MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  LOW: "bg-green-500/20 text-green-400 border-green-500/50",
};

export function CostView() {
  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary tracking-widest">
        PROJECT COST ANALYSIS
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-0">
        <div className="lg:col-span-1 min-h-[50vh] lg:min-h-0">
            <DashboardPanel>
                <h2 className="text-lg font-bold text-primary mb-4">COST vs. CRISIS VULNERABILITY</h2>
                <div className="h-full w-full overflow-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>System Component</TableHead>
                        <TableHead className="text-right">Cost (₹ Cr)</TableHead>
                        <TableHead className="text-center">Vulnerability</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {costData.map((row) => (
                        <TableRow key={row.component}>
                        <TableCell className="font-medium text-foreground/90">{row.component}</TableCell>
                        <TableCell className="text-right font-mono text-foreground/80">{row.cost}</TableCell>
                        <TableCell className="text-center">
                            <Badge
                            variant="outline"
                            className={cn("font-bold", vulnerabilityStyles[row.vulnerability])}
                            >
                            {row.vulnerability}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
            </DashboardPanel>
        </div>
        <div className="lg:col-span-1 min-h-[50vh] lg:min-h-0">
            <DashboardPanel>
                <h2 className="text-lg font-bold text-primary mb-4">PROJECT COST BREAKDOWN</h2>
                <div className="flex items-center justify-center h-full">
                    <Image
                        src="https://storage.googleapis.com/maker-studio-project-images-prod/project-images/d1175c57-6101-4475-a0d0-6f0a6d0c9f13/user-images/6d31215b-9ecb-4395-8854-8e11e8601248"
                        alt="Oceanus Proxima Project Cost Breakdown"
                        width={1024}
                        height={463}
                        className="w-full h-auto object-contain"
                        data-ai-hint="cost breakdown chart"
                    />
                </div>
            </DashboardPanel>
        </div>
      </div>
    </div>
  );
}