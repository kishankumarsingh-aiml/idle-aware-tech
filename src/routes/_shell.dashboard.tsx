import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity, AlertCircle, Cpu, Database, Leaf, MonitorSmartphone,
  Moon, Power, PowerOff, RefreshCw, Timer, TrendingUp, Zap, IndianRupee,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import { computers, dailyEnergyData, labUsageData, notifications, savingsSummary, statusCounts } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · SIDMS" }, { name: "description", content: "Live view of computers, energy savings, and AI status across your labs." }] }),
  component: Dashboard,
});

const statusColors: Record<string, string> = {
  active: "var(--color-success)",
  idle: "var(--color-warning)",
  offline: "var(--color-muted-foreground)",
  sleeping: "var(--color-info)",
  shutdown: "var(--color-destructive)",
};

function StatCard({ icon: Icon, label, value, sub, tone = "default" }: any) {
  const tones: Record<string, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
    danger: "bg-destructive/15 text-destructive",
  };
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
            {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
          </div>
          <div className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const s = statusCounts();
  const total = computers.length;
  const pieData = Object.entries(s).map(([k, v]) => ({ name: k, value: v }));

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Real-time energy intelligence across your entire campus."
        actions={
          <>
            <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" /> Refresh</Button>
            <Button size="sm" className="bg-gradient-brand text-primary-foreground"><Zap className="h-4 w-4 mr-2" /> Run AI Scan</Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={MonitorSmartphone} label="Total Computers" value={total} sub="Across 5 labs" />
        <StatCard icon={Activity} label="Active" value={s.active} sub={`${Math.round((s.active / total) * 100)}% of fleet`} tone="success" />
        <StatCard icon={Timer} label="Idle" value={s.idle} sub="AI action recommended" tone="warning" />
        <StatCard icon={PowerOff} label="Offline" value={s.offline} sub="No response" />
        <StatCard icon={Moon} label="Sleeping" value={s.sleeping} tone="info" />
        <StatCard icon={Power} label="Shutdown" value={s.shutdown} tone="danger" />
        <StatCard icon={Leaf} label="Energy Saved Today" value={`${savingsSummary.energyToday} kWh`} sub={`${savingsSummary.co2Today} kg CO₂`} tone="success" />
        <StatCard icon={IndianRupee} label="Money Saved Today" value={`₹${savingsSummary.moneyToday.toLocaleString()}`} sub={`₹${savingsSummary.moneyMonth.toLocaleString()} this month`} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success"><Cpu className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">AI Engine</div>
              <div className="font-medium">Online · v3.4.1</div>
            </div>
            <Badge variant="secondary" className="ml-auto bg-success/15 text-success">Healthy</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-info/15 text-info"><Database className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Database</div>
              <div className="font-medium">Connected · 128ms</div>
            </div>
            <Badge variant="secondary" className="ml-auto bg-info/15 text-info">Live</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-warning/15 text-warning"><RefreshCw className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-muted-foreground">Last Scan</div>
              <div className="font-medium">2 min ago</div>
            </div>
            <Badge variant="secondary" className="ml-auto">Auto</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Energy Saved vs Consumed</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days · kWh</p>
            </div>
            <Badge variant="secondary" className="bg-success/15 text-success"><TrendingUp className="h-3 w-3 mr-1" /> +24% MoM</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyEnergyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="saved" stroke="var(--color-primary)" fill="url(#g1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="consumed" stroke="var(--color-chart-3)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Fleet Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {pieData.map((d) => <Cell key={d.name} fill={statusColors[d.name]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 capitalize"><span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColors[d.name] }} />{d.name}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Lab Usage Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={labUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="active" stackId="a" fill="var(--color-success)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="idle" stackId="a" fill="var(--color-warning)" />
                  <Bar dataKey="offline" stackId="a" fill="var(--color-muted-foreground)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Link to="/computers" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className={`grid h-8 w-8 place-items-center rounded-md ${
                  n.type === "warning" ? "bg-warning/15 text-warning"
                  : n.type === "success" ? "bg-success/15 text-success"
                  : n.type === "error" ? "bg-destructive/15 text-destructive"
                  : "bg-info/15 text-info"
                }`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    <div className="text-[10px] text-muted-foreground shrink-0 ml-2">{n.time}</div>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{n.message}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Live Fleet Utilization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {labUsageData.map((l) => {
            const totalL = l.active + l.idle + l.offline;
            const util = Math.round((l.active / totalL) * 100);
            return (
              <div key={l.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-muted-foreground">{util}% utilization · {totalL} PCs</span>
                </div>
                <Progress value={util} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
