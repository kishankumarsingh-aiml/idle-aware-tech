import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Cpu, HardDrive, MemoryStick, Moon, Power, RefreshCw, Search, Zap, Eye } from "lucide-react";
import { computers, type ComputerStatus } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/computers")({
  head: () => ({ meta: [{ title: "Computers · SIDMS" }, { name: "description", content: "Live monitoring of every computer with real-time status and power actions." }] }),
  component: Computers,
});

const statusStyles: Record<ComputerStatus, string> = {
  active: "bg-success/15 text-success border-success/30",
  idle: "bg-warning/15 text-warning border-warning/30",
  offline: "bg-muted text-muted-foreground border-border",
  sleeping: "bg-info/15 text-info border-info/30",
  shutdown: "bg-destructive/15 text-destructive border-destructive/30",
};

function Computers() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [lab, setLab] = useState<string>("all");

  const labs = Array.from(new Set(computers.map((c) => c.lab)));

  const filtered = useMemo(() => computers.filter((c) => {
    if (status !== "all" && c.status !== status) return false;
    if (lab !== "all" && c.lab !== lab) return false;
    if (q && !`${c.name} ${c.id} ${c.lab}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, status, lab]);

  return (
    <div>
      <PageHeader
        title="Computers"
        description={`${filtered.length} of ${computers.length} shown`}
        actions={<Button size="sm" className="bg-gradient-brand text-primary-foreground"><RefreshCw className="h-4 w-4 mr-2" /> Sync now</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, ID, lab…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="sleeping">Sleeping</SelectItem>
            <SelectItem value="shutdown">Shutdown</SelectItem>
          </SelectContent>
        </Select>
        <Select value={lab} onValueChange={setLab}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Lab" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All labs</SelectItem>
            {labs.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((c) => (
          <Card key={c.id} className="group relative overflow-hidden transition hover:shadow-elegant">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand opacity-0 group-hover:opacity-100 transition" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground">{c.id} · {c.lab.split(" - ")[0]}</div>
                </div>
                <Badge variant="outline" className={`capitalize ${statusStyles[c.status]}`}>{c.status}</Badge>
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <Metric icon={Cpu} label="CPU" value={c.cpu} unit="%" />
                <Metric icon={MemoryStick} label="RAM" value={c.ram} unit="%" />
                <Metric icon={HardDrive} label="Disk" value={c.disk} unit="%" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-md bg-muted/50 p-2">
                  <div className="text-muted-foreground">Idle</div>
                  <div className="font-semibold">{c.idleMinutes}m</div>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <div className="text-muted-foreground">Power</div>
                  <div className="font-semibold">{c.powerWatts}W</div>
                </div>
                <div className="rounded-md bg-muted/50 p-2">
                  <div className="text-muted-foreground">Net</div>
                  <div className={`font-semibold capitalize ${c.network === "online" ? "text-success" : "text-muted-foreground"}`}>{c.network}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to="/computers/$id" params={{ id: c.id }}><Eye className="h-3.5 w-3.5 mr-1" /> View</Link>
                </Button>
                <Button size="icon" variant="outline" onClick={() => toast("Sleep command sent", { description: c.name })}><Moon className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" onClick={() => toast("Shutdown command sent", { description: c.name })}><Power className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" onClick={() => toast("Restart sent", { description: c.name })}><RefreshCw className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="outline" onClick={() => toast("Wake-on-LAN sent", { description: c.name })}><Zap className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, unit }: any) {
  return (
    <div>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="flex items-center gap-1.5"><Icon className="h-3 w-3" /> {label}</span>
        <span className="font-medium text-foreground">{value}{unit}</span>
      </div>
      <Progress value={value} className="h-1.5 mt-1" />
    </div>
  );
}
