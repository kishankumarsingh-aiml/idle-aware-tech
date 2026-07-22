import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Cpu, HardDrive, MemoryStick, Moon, Power, RefreshCw, Zap } from "lucide-react";
import { computers } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/computers/$id")({
  loader: ({ params }) => {
    const computer = computers.find((c) => c.id === params.id);
    if (!computer) throw notFound();
    return { computer };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.computer.name} · SIDMS` : "Computer · SIDMS" },
      { name: "description", content: "Detailed hardware, network, and power profile for this workstation." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { computer: c } = Route.useLoaderData();

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
        <Link to="/computers"><ArrowLeft className="h-4 w-4 mr-1" /> Back to computers</Link>
      </Button>
      <PageHeader
        title={c.name}
        description={`${c.id} · ${c.lab}`}
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => toast("Sleep sent")}><Moon className="h-4 w-4 mr-1" /> Sleep</Button>
            <Button size="sm" variant="outline" onClick={() => toast("Restart sent")}><RefreshCw className="h-4 w-4 mr-1" /> Restart</Button>
            <Button size="sm" variant="outline" onClick={() => toast("Wake sent")}><Zap className="h-4 w-4 mr-1" /> Wake</Button>
            <Button size="sm" className="bg-destructive text-destructive-foreground" onClick={() => toast("Shutdown sent")}><Power className="h-4 w-4 mr-1" /> Shutdown</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="capitalize">{c.status}</Badge>
              <span className="text-sm text-muted-foreground">Last activity {c.lastActivity}</span>
            </div>
            <Metric icon={Cpu} label="CPU" value={c.cpu} />
            <Metric icon={MemoryStick} label="RAM" value={c.ram} />
            <Metric icon={HardDrive} label="Disk" value={c.disk} />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Stat label="Idle" value={`${c.idleMinutes}m`} />
              <Stat label="Power" value={`${c.powerWatts}W`} />
              <Stat label="Network" value={c.network} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>System Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
            <Info label="Computer ID" value={c.id} />
            <Info label="Operating System" value={c.os} />
            <Info label="IP Address" value={c.ip} />
            <Info label="MAC Address" value={c.mac} />
            <Info label="CPU" value={c.cpuModel} />
            <Info label="RAM" value={c.ramSize} />
            <Info label="Storage" value={c.storage} />
            <Info label="Current User" value={c.currentUser} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Installed Software</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {c.software.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: any) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <Progress value={value} className="h-2 mt-1" />
    </div>
  );
}
function Stat({ label, value }: any) {
  return <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground capitalize">{label}</div><div className="mt-1 font-semibold capitalize">{value}</div></div>;
}
function Info({ label, value }: any) {
  return <div className="flex flex-col rounded-lg border p-3"><span className="text-xs text-muted-foreground">{label}</span><span className="mt-1 font-medium">{value}</span></div>;
}
