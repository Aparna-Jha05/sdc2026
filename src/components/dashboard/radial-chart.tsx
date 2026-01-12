"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface RadialChartProps {
  value: number;
  label: string;
}

export function RadialChart({ value, label }: RadialChartProps) {
  const data = [{ name: 'saturation', value: value }];

  return (
    <div className="w-full h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="80%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
          barSize={10}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            angleAxisId={0}
            fill="hsl(var(--primary))"
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-primary/90">{value.toFixed(1)}%</span>
        <span className="text-sm text-foreground/70">{label}</span>
      </div>
    </div>
  );
}
