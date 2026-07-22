import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Users, ShieldCheck, TreePine, Wind, Droplets, GraduationCap, HeartHandshake, BarChart3, ScrollText, Building2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

export const Route = createFileRoute("/_shell/esg")({
  head: () => ({ meta: [{ title: "ESG Impact · SIDMS" }, { name: "description", content: "Environment, Social, and Governance impact of your energy intelligence platform." }] }),
  component: ESG,
});

function ESG() {
  return (
    <div>
      <PageHeader
        title="ESG Impact"
        description="Environmental, Social, and Governance impact powered by SIDMS."
        actions={<Badge className="bg-gradient-brand text-primary-foreground"><Leaf className="h-3 w-3 mr-1"/> Sustainability A+</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <ScoreCard title="Environment" score={92} icon={Leaf} color="var(--color-success)" />
        <ScoreCard title="Social" score={86} icon={Users} color="var(--color-info)" />
        <ScoreCard title="Governance" score={94} icon={ShieldCheck} color="var(--color-primary)" />
      </div>

      <Section title="Environment" icon={Leaf} tone="text-success">
        <Metric icon={Wind} label="Reduced Electricity" value="38,240 kWh" sub="This year" />
        <Metric icon={TreePine} label="CO₂ Prevented" value="18.4 t" sub="≈ 920 trees planted" />
        <Metric icon={Droplets} label="Cooling Water Saved" value="12,400 L" sub="Data-center offset" />
        <Metric icon={Building2} label="Green Campus" value="5 / 5" sub="Labs certified" />
      </Section>

      <Section title="Social" icon={Users} tone="text-info">
        <Metric icon={GraduationCap} label="Learning Uptime" value="+18%" sub="Better lab availability" />
        <Metric icon={HeartHandshake} label="Energy Awareness" value="1,240" sub="Students engaged" />
        <Metric icon={Users} label="Responsible Usage" value="93%" sub="Compliance rate" />
      </Section>

      <Section title="Governance" icon={ShieldCheck} tone="text-primary">
        <Metric icon={ScrollText} label="Transparent Reports" value="128" sub="Auto-published" />
        <Metric icon={BarChart3} label="Data-Driven Decisions" value="24" sub="Policies updated" />
        <Metric icon={Building2} label="Resource Efficiency" value="+31%" sub="Year-over-year" />
      </Section>
    </div>
  );
}

function ScoreCard({ title, score, icon: Icon, color }: any) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 flex items-center gap-6">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: score, fill: color }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar background={{ fill: "var(--color-muted)" }} dataKey="value" cornerRadius={12} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-2xl font-bold">{score}</div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Icon className="h-4 w-4"/> {title}</div>
          <div className="mt-1 text-xl font-semibold">{score >= 90 ? "Excellent" : score >= 75 ? "Strong" : "Good"}</div>
          <div className="mt-1 text-xs text-muted-foreground">Composite ESG index</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ title, icon: Icon, tone, children }: any) {
  return (
    <Card className="mb-4">
      <CardHeader><CardTitle className="flex items-center gap-2"><Icon className={`h-5 w-5 ${tone}`}/> {title}</CardTitle></CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{children}</CardContent>
    </Card>
  );
}

function Metric({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-xl border p-4 hover:shadow-soft transition">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4"/></div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}
