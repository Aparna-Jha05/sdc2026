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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from "react";
import { Component, Calculator, ShieldCheck } from "lucide-react";

type VulnerabilityLevel = "HIGH" | "MEDIUM" | "LOW";

const RAW_DATA = [
  { component: "Structural Architecture", cost: 15354, vulnerability: "HIGH" as VulnerabilityLevel },
  { component: "Energy Systems", cost: 15300, vulnerability: "MEDIUM" as VulnerabilityLevel },
  { component: "Maintenance & Buffer", cost: 13689, vulnerability: "HIGH" as VulnerabilityLevel },
  { component: "Deployment Infrastructure", cost: 7686, vulnerability: "LOW" as VulnerabilityLevel },
  { component: "Robotics & Environment", cost: 3762, vulnerability: "HIGH" as VulnerabilityLevel },
  { component: "Life Support (LSS)", cost: 3384, vulnerability: "HIGH" as VulnerabilityLevel },
  { component: "Planetary Protection", cost: 2160, vulnerability: "LOW" as VulnerabilityLevel },
  { component: "Space Agriculture", cost: 2007, vulnerability: "LOW" as VulnerabilityLevel },
  { component: "In-Situ Manufacturing", cost: 1827, vulnerability: "MEDIUM" as VulnerabilityLevel },
];

const RISK_MULTIPLIERS = {
  HIGH: 1.5,
  MEDIUM: 1.25,
  LOW: 1.05
};

const vulnerabilityStyles: { [key in VulnerabilityLevel]: string } = {
  HIGH: "bg-red-500/20 text-red-400 border-red-500/50",
  MEDIUM: "bg-amber-500/20 text-amber-400 border-amber-500/50",
  LOW: "bg-green-500/20 text-green-400 border-green-500/50",
};

export function CostView() {

  const { totalCost, riskWeightedCost, riskPremium } = useMemo(() => {
    let total = 0;
    let weighted = 0;

    RAW_DATA.forEach(item => {
      total += item.cost;
      weighted += item.cost * RISK_MULTIPLIERS[item.vulnerability];
    });

    return {
      totalCost: total,
      riskWeightedCost: weighted,
      riskPremium: weighted - total
    };
  }, []);

  const formatCurrency = (val: number) => {
    return val.toLocaleString() + " Cr";
  }

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest">
          PROJECT COST ANALYSIS
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        <DashboardPanel className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-foreground/70 font-bold uppercase tracking-wider">Total Base Cost</p>
            <p className="text-2xl font-mono font-bold text-cyan-400">{formatCurrency(totalCost)}</p>
          </div>
          <Component className="h-8 w-8 text-cyan-500/50" />
        </DashboardPanel>
        <DashboardPanel className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-foreground/70 font-bold uppercase tracking-wider">Risk-Adjusted Projection</p>
            <p className="text-2xl font-mono font-bold text-amber-400">{formatCurrency(Math.round(riskWeightedCost))}</p>
          </div>
          <Calculator className="h-8 w-8 text-amber-500/50" />
        </DashboardPanel>
        <DashboardPanel className="flex items-center justify-between p-4">
          <div>
            <p className="text-xs text-foreground/70 font-bold uppercase tracking-wider">Contingency Reserve</p>
            <p className="text-2xl font-mono font-bold text-pink-400">+{formatCurrency(Math.round(riskPremium))}</p>
          </div>
          <ShieldCheck className="h-8 w-8 text-pink-500/50" />
        </DashboardPanel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-grow min-h-0">
        {/* Left Column - Cost Table */}
        <div className="xl:col-span-1 flex flex-col min-h-0">
          <DashboardPanel className="flex-grow flex flex-col">
            <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 shrink-0">COST vs. VULNERABILITY</h2>
            <div className="flex-grow min-h-0">
              <ScrollArea className="h-full pr-4 -mr-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-foreground/90">System Component</TableHead>
                      <TableHead className="text-right text-foreground/90 min-w-[100px]">Cost</TableHead>
                      <TableHead className="text-center text-foreground/90 min-w-[120px]">Vulnerability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RAW_DATA.map((row) => (
                      <TableRow key={row.component} className="border-border/40">
                        <TableCell className="font-medium text-foreground/90 text-xs sm:text-sm">{row.component}</TableCell>
                        <TableCell className="text-right font-mono text-foreground/80 text-xs sm:text-sm whitespace-nowrap">{formatCurrency(row.cost)}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn("font-bold text-xs", vulnerabilityStyles[row.vulnerability])}
                          >
                            {row.vulnerability}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </DashboardPanel>
        </div>

        {/* Right Column - Cost Visualizations */}
        <div className="xl:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Cost Overview Image */}
          <DashboardPanel className="flex-grow flex flex-col min-h-[250px] overflow-hidden">
            <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 shrink-0">COMPREHENSIVE COST ANALYSIS</h2>
            <div className="flex-grow min-h-[200px] relative w-full">
              <Image
                src="/cost.png"
                alt="Oceanus Proxima Comprehensive Cost Analysis"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                className="object-contain"
                data-ai-hint="comprehensive cost analysis"
              />
            </div>
          </DashboardPanel>

          {/* Cost Breakdown Chart */}
          <DashboardPanel className="flex-grow flex flex-col min-h-[250px] overflow-hidden">
            <h2 className="text-md sm:text-lg font-headline font-bold text-primary mb-4 shrink-0">PROJECT COST BREAKDOWN</h2>
            <div className="flex-grow min-h-[200px] relative w-full">
              <Image
                src="/barchart.png"
                alt="Oceanus Proxima Project Cost Breakdown"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 50vw"
                className="object-contain"
                data-ai-hint="cost breakdown chart"
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
}
