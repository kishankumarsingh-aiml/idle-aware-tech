import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { dailyEnergyData, labUsageData, weeklyBarData, statusCounts } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_shell/analytics")({
  head: () => ({ meta: [{ title: "Analytics · SIDMS" }, { name: "description", content: "Energy, CO₂ and cost analytics across daily, weekly, monthly, and yearly windows." }] }),
  component: Analytics,
});

const monthly = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  saved: 200 + Math.round(Math.sin(i) * 40 + i * 15),
  cost: 20 + Math.round(Math.cos(i) * 4 + i * 1.2),
}));

const heat = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => Math.max(0, Math.round(50 + Math.sin(d + h / 3) * 30 + Math.random() * 20)))
);

function Analytics() {
  const s = statusCounts();
  const pie = Object.entries(s).map(([name, value]) => ({ name, value }));
  const COLORS = ["var(--color-success)", "var(--color-warning)", "var(--color-muted-foreground)", "var(--color-info)", "var(--color-destructive)"];

  return (
    <div>
      <PageHeader title="Analytics" description="Deep-dive into energy, CO₂, and cost trends." />

      <Tabs defaultValue="energy">
        <TabsList>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="co2">CO₂</TabsTrigger>
          <TabsTrigger value="cost">Cost</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title="Daily Energy Saved (kWh)">
              <ResponsiveContainer><AreaChart data={dailyEnergyData}>
                <defs><linearGradient id="ea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6}/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Area type="monotone" dataKey="saved" stroke="var(--color-primary)" fill="url(#ea)" strokeWidth={2}/>
              </AreaChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Weekly Savings (kWh)">
              <ResponsiveContainer><BarChart data={weeklyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="saved" fill="var(--color-primary)" radius={[6,6,0,0]}/>
              </BarChart></ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Monthly Trend (kWh)" wide>
              <ResponsiveContainer><LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="month" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Line type="monotone" dataKey="saved" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }}/>
              </LineChart></ResponsiveContainer>
            </ChartCard>
          </div>

          <Card>
            <CardHeader><CardTitle>Usage Heatmap · Weekly</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 text-[10px] text-muted-foreground mb-1">
                    <div />
                    {Array.from({ length: 24 }, (_, h) => <div key={h} className="text-center">{h}</div>)}
                  </div>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                    <div key={d} className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 mb-1">
                      <div className="text-xs text-muted-foreground self-center">{d}</div>
                      {heat[i].map((v, j) => (
                        <div key={j} className="h-6 rounded" style={{ background: `color-mix(in oklab, var(--color-primary) ${v}%, transparent)` }} title={`${v}%`} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="co2" className="mt-4">
          <ChartCard title="CO₂ Reduction (kg / week)" wide>
            <ResponsiveContainer><AreaChart data={weeklyBarData}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.6}/><stop offset="100%" stopColor="var(--color-success)" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Area type="monotone" dataKey="co2" stroke="var(--color-success)" fill="url(#cg)" strokeWidth={2}/>
            </AreaChart></ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="cost" className="mt-4">
          <ChartCard title="Monthly Cost Savings (₹ ×1000)" wide>
            <ResponsiveContainer><BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
              <XAxis dataKey="month" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend />
              <Bar dataKey="cost" fill="var(--color-primary-glow)" radius={[6,6,0,0]}/>
            </BarChart></ResponsiveContainer>
          </ChartCard>
        </TabsContent>

        <TabsContent value="fleet" className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartCard title="Status Distribution">
            <ResponsiveContainer><PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" outerRadius={100} label>
                {pie.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend />
            </PieChart></ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Active vs Idle by Lab">
            <ResponsiveContainer><BarChart data={labUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)"/>
              <XAxis dataKey="name" fontSize={11} stroke="var(--color-muted-foreground)"/><YAxis fontSize={11} stroke="var(--color-muted-foreground)"/>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend />
              <Bar dataKey="active" fill="var(--color-success)" radius={[4,4,0,0]}/>
              <Bar dataKey="idle" fill="var(--color-warning)" radius={[4,4,0,0]}/>
            </BarChart></ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const tooltipStyle = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 };

function ChartCard({ title, children, wide }: any) {
  return (
    <Card className={wide ? "lg:col-span-2" : ""}>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><div className="h-72">{children}</div></CardContent>
    </Card>
  );
}
