import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { labs } from "@/lib/mock-data";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/labs")({
  head: () => ({ meta: [{ title: "Labs · SIDMS" }, { name: "description", content: "Manage labs, assign computers, and view utilization by location." }] }),
  component: Labs,
});

function Labs() {
  return (
    <div>
      <PageHeader
        title="Lab Management"
        description="Create, rename, and assign computers to labs."
        actions={<Button size="sm" className="bg-gradient-brand text-primary-foreground" onClick={() => toast("Create Lab dialog")}><Plus className="h-4 w-4 mr-1" /> New Lab</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {labs.map((l) => {
          const util = Math.round((l.activeCount / l.computerCount) * 100);
          return (
            <Card key={l.id} className="overflow-hidden">
              <div className="h-24 bg-gradient-brand relative">
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                <Building2 className="absolute right-4 top-4 h-12 w-12 text-primary-foreground/40" />
              </div>
              <CardContent className="-mt-8 relative">
                <div className="rounded-xl bg-card border p-4 shadow-soft">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{l.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {l.location}</div>
                    </div>
                    <Badge variant="secondary">{util}%</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <Stat label="Total" value={l.computerCount} />
                    <Stat label="Active" value={l.activeCount} tone="success" />
                    <Stat label="Idle" value={l.idleCount} tone="warning" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast("Rename lab")}><Pencil className="h-3.5 w-3.5 mr-1" /> Rename</Button>
                    <Button size="sm" variant="outline" onClick={() => toast("Assign computers")}>Assign</Button>
                    <Button size="icon" variant="outline" onClick={() => toast("Delete lab")}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  const c = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="rounded-md bg-muted/50 p-2">
      <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</div>
      <div className={`mt-0.5 font-semibold ${c}`}>{value}</div>
    </div>
  );
}
