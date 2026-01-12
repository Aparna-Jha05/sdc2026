
"use client";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";


const pressureData = [
    { depth: "Surface (0 km)", mpa: "~0 MPa", bar: "0 bar", equivalent: "Vacuum" },
    { depth: "1 km", mpa: "1.22 MPa", bar: "12.2 bar", equivalent: "~120m underwater" },
    { depth: "5 km", mpa: "6.11 MPa", bar: "61.1 bar", equivalent: "~600m underwater" },
    { depth: "10 km", mpa: "12.23 MPa", bar: "122.3 bar", equivalent: "~1,200m underwater" },
];

export function EngineeringView() {
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary tracking-widest">
                ENGINEERING & REPAIR
            </h1>
            <DashboardPanel className="flex-grow">
                <ScrollArea className="h-full w-full pr-4">
                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                        <AccordionItem value="item-1" className="border-border/40">
                            <AccordionTrigger className="text-md sm:text-lg font-headline text-primary/90 hover:text-primary hover:bg-primary/5 px-3 rounded-md transition-colors">Pressure Analysis & Mobility</AccordionTrigger>
                            <AccordionContent className="text-foreground/90 px-3">
                                <p className="mb-4 text-sm">Based on the physical constants of Europa (Gravity (g) ~ 1.315 m/s² and Ice Density ρ ~ 930 kg/m³), here is the pressure analysis for the specified depth ranges. Drastically reducing the pressure through mobility is a key survival strategy.</p>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-border/50">
                                                <TableHead className="text-foreground/90">Depth</TableHead>
                                                <TableHead className="text-foreground/90">Pressure (MPa)</TableHead>
                                                <TableHead className="text-foreground/90">Pressure (Bar)</TableHead>
                                                <TableHead className="text-foreground/90">Earth Equivalent</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pressureData.map((row) => (
                                                <TableRow key={row.depth} className="border-border/40">
                                                    <TableCell className="font-medium text-foreground/90">{row.depth}</TableCell>
                                                    <TableCell className="text-foreground/85">{row.mpa}</TableCell>
                                                    <TableCell className="text-foreground/85">{row.bar}</TableCell>
                                                    <TableCell className="text-foreground/85">{row.equivalent}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-border/50">
                                    <h4 className="font-bold text-primary mb-4">Interactive Depth Calculator</h4>
                                    <DepthCalculator />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="border-border/40">
                            <AccordionTrigger className="text-md sm:text-lg font-headline text-primary/90 hover:text-primary hover:bg-primary/5 px-3 rounded-md transition-colors">Habitat Repair Technologies</AccordionTrigger>
                            <AccordionContent className="px-3">
                                <Image
                                    src="/engineering.png"
                                    alt="Habitat Repair Technologies"
                                    width={1200}
                                    height={493}
                                    className="w-full rounded-lg mb-4"
                                    data-ai-hint="diagram technology"
                                />
                                <div className="space-y-6 text-foreground/90 text-sm">
                                    <div>
                                        <h4 className="font-bold text-primary/80">1. Passive Repair: Self-Healing Cryo-Composites</h4>
                                        <p>The first line of defence. The habitat walls use "smart" composite materials designed to "bleed" and scab over when cracked. Vascular Polymer Composites contain micro-channels with a healing agent (resin) and catalyst. When a crack ruptures the channels, pressure forces the resin into the crack, where it reacts and hardens, sealing the breach instantly. Recent breakthroughs in dynamic covalent bonding allow these polymers to heal even at cryogenic temperatures.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">2. Active Repair: Shape Memory Alloys (SMAs)</h4>
                                        <p>For structural damage, "Memory Metals" like Nitinol are used. A repair clamp is manufactured in a "closed" shape, mechanically expanded while cold, and placed over a damaged section by an ROV. When heated, it violently returns to its original smaller shape, crushing down on the leak to create a pressure-tight seal without welding.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">3. Robotic Repair: Friction Stir Welding (FSW)</h4>
                                        <p>Traditional welding is impossible. FSW uses a rapidly rotating pin pressed into the metal, generating friction heat to plasticize (not melt) it. The pin "stirs" the two pieces together, forging the repair in place. This avoids risks of arc instability and hydrogen explosion in the high-pressure saline ocean.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">4. Environmental Repair: Ice-Sintering (Regelation)</h4>
                                        <p>If the habitat is inside the ice shell, the ice itself is the repair material. Heating elements melt a crack's surface. The immense external pressure causes the water to refreeze instantly into a stronger structure (Regelation), turning the pressure from an enemy into an asset.</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="border-border/40">
                            <AccordionTrigger className="text-md sm:text-lg font-headline text-primary/90 hover:text-primary hover:bg-primary/5 px-3 rounded-md transition-colors">Crisis Response: Safety & Redundancy</AccordionTrigger>
                            <AccordionContent className="px-3">
                                <Image
                                    src="/safety.png"
                                    alt="Crisis Response Systems"
                                    width={1200}
                                    height={734}
                                    className="w-full rounded-lg mb-4"
                                    data-ai-hint="blueprint systems"
                                />
                                <div className="space-y-6 text-foreground/90 text-sm">
                                    <div>
                                        <h4 className="font-bold text-primary/80">Structural Defence Functions</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Active Hydraulic Shoring:</strong> Emergency deployment of internal hydraulic rams to physically hold walls apart if the outer shell buckles.</li>
                                            <li><strong>Sacrificial Layer Flooding:</strong> Controlled flooding of interstitial spaces to equalize pressure and neutralize crushing force on the outer skin.</li>
                                            <li><strong>Rapid-Set Foam Injection:</strong> High-expansion hydrophobic foam injection into micro-fractures to seal leaks and add rigidity.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">Life Support Redundancy</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Distributed CO2 Scrubbing:</strong> Activation of passive LiOH curtains in every module, making each a self-contained biosphere if central HVAC is sealed.</li>
                                            <li><strong>Thermal Inertia Preservation:</strong> Sealing thermal vents to trap body and equipment heat inside if primary power fails.</li>
                                            <li><strong>"Black Start" Bio-Monitoring:</strong> Crew smart-suits become the room's atmosphere sensors if module systems fail.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">Operational Continuity</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Tele-Presence "Shadow" Shift:</strong> Rerouting all control authority from the physical bridge to portable consoles in safe modules.</li>
                                            <li><strong>Acoustic Mesh Communication:</strong> Using sound waves to transmit data through steel and water when RF communication fails.</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-primary/80">Crisis Decision Support</h4>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li><strong>Predictive Structural Modelling (Digital Twin):</strong> Real-time simulation that takes sensor data to predict which module will fail next, giving the commander a timeline for data-driven decisions.</li>
                                        </ul>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </ScrollArea>
            </DashboardPanel>
        </div>
    );
}

function DepthCalculator() {
    const [depth, setDepth] = useState<number>(10); // km

    const g = 1.315; // m/s^2
    const rho = 1000; // kg/m^3 (approx liquid water)

    // P = rho * g * h
    // h in meters = depth * 1000
    // P in Pascals = rho * g * (depth * 1000)
    // P in MPa = P / 1,000,000
    const pressureMPa = (rho * g * (depth * 1000)) / 1000000;
    const pressureBar = pressureMPa * 10;

    // Earth equivalent: P_earth = rho_earth * g_earth * h_earth
    // h_earth = P / (rho_earth * g_earth)
    // rho_earth ~ 1025, g_earth ~ 9.81
    const earthDepth = (pressureMPa * 1000000) / (1025 * 9.81);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                    <Label>Depth Assessment</Label>
                    <span className="font-mono text-cyan-400">{depth.toFixed(1)} km</span>
                </div>
                <Slider
                    value={[depth]}
                    max={100}
                    step={0.1}
                    onValueChange={(val) => setDepth(val[0])}
                    className="py-2"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-secondary/40 rounded border border-border/30">
                    <div className="text-xs text-foreground/60 uppercase">Calculated Pressure</div>
                    <div className="text-xl font-mono font-bold text-primary">{pressureMPa.toFixed(2)} MPa</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded border border-border/30">
                    <div className="text-xs text-foreground/60 uppercase">Bar Equivalent</div>
                    <div className="text-xl font-mono font-bold text-primary">{pressureBar.toFixed(1)} bar</div>
                </div>
                <div className="p-3 bg-secondary/40 rounded border border-border/30">
                    <div className="text-xs text-foreground/60 uppercase">Earth Ocean Depth Equivalent</div>
                    <div className="text-xl font-mono font-bold text-primary">~{Math.round(earthDepth)} m</div>
                </div>
            </div>
        </div>
    )
}
