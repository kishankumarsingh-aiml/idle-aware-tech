import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Sparkles, Cpu, MemoryStick, Mouse, Keyboard, Timer, Activity, TrendingDown, Leaf } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_shell/ai-prediction")({
  head: () => ({ meta: [{ title: "AI Prediction · SIDMS" }, { name: "description", content: "Simulate the AI idle-detection model with live inputs and recommended actions." }] }),
  component: AIPrediction,
});

function AIPrediction() {
  const [idle, setIdle] = useState(12);
  const [cpu, setCpu] = useState(6);
  const [ram, setRam] = useState(28);
  const [mouse, setMouse] = useState(0);
  const [keyboard, setKeyboard] = useState(0);
  const [process, setProcess] = useState("Chrome (idle tab)");
  const [result, setResult] = useState<null | { label: string; confidence: number; action: string; save: number }>(null);

  const predict = () => {
    // simple heuristic scoring
    const idleScore = Math.min(idle / 15, 1) * 40;
    const cpuScore = (1 - Math.min(cpu / 100, 1)) * 25;
    const activityScore = (1 - Math.min((mouse + keyboard) / 20, 1)) * 25;
    const ramScore = (1 - Math.min(ram / 100, 1)) * 10;
    const score = idleScore + cpuScore + activityScore + ramScore;
    const isIdle = score > 55;
    const confidence = Math.min(99, Math.round(60 + score * 0.4));
    const action = !isIdle ? "Keep Active" : score > 80 ? "Shutdown Now" : score > 65 ? "Sleep in 60s" : "Warn User";
    const save = isIdle ? Math.round(0.12 * (idle + 5) * 10) / 10 : 0;
    setResult({ label: isIdle ? "IDLE" : "ACTIVE", confidence, action, save });
  };

  return (
    <div>
      <PageHeader
        title="AI Idle Prediction"
        description="Adjust inputs to see how the model classifies a workstation in real time."
        actions={<Badge variant="secondary" className="bg-success/15 text-success"><Sparkles className="h-3 w-3 mr-1"/> Model v3.4.1</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Input Signals</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <SliderInput icon={Timer} label="Idle Time" unit=" min" value={idle} setValue={setIdle} max={60} />
            <SliderInput icon={Cpu} label="CPU Usage" unit="%" value={cpu} setValue={setCpu} max={100} />
            <SliderInput icon={MemoryStick} label="RAM Usage" unit="%" value={ram} setValue={setRam} max={100} />
            <SliderInput icon={Mouse} label="Mouse Events / min" unit="" value={mouse} setValue={setMouse} max={100} />
            <SliderInput icon={Keyboard} label="Keyboard Events / min" unit="" value={keyboard} setValue={setKeyboard} max={200} />
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Activity className="h-4 w-4"/> Foreground Process</Label>
              <Input value={process} onChange={(e) => setProcess(e.target.value)} />
            </div>
            <Button className="w-full bg-gradient-brand text-primary-foreground h-11" onClick={predict}>
              <Sparkles className="h-4 w-4 mr-2"/> Run Prediction
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
          <CardHeader><CardTitle>Prediction Result</CardTitle></CardHeader>
          <CardContent>
            {!result ? (
              <div className="flex h-80 flex-col items-center justify-center text-center text-muted-foreground">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 mb-4"><Sparkles className="h-7 w-7 text-primary"/></div>
                <p>Adjust signals and click <span className="font-semibold text-foreground">Run Prediction</span> to see the AI verdict.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-6 rounded-2xl bg-gradient-soft border">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Predicted Status</div>
                  <div className={`mt-2 text-5xl font-bold ${result.label === "IDLE" ? "text-warning" : "text-success"}`}>{result.label}</div>
                  <div className="mt-3 text-sm text-muted-foreground">Confidence Score</div>
                  <div className="mx-auto mt-2 max-w-xs">
                    <Progress value={result.confidence} className="h-2"/>
                    <div className="mt-1 text-sm font-semibold">{result.confidence}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Recommended Action</div>
                    <div className="mt-1 font-semibold flex items-center gap-2"><TrendingDown className="h-4 w-4 text-primary"/>{result.action}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-xs text-muted-foreground">Est. Energy Saving</div>
                    <div className="mt-1 font-semibold flex items-center gap-2"><Leaf className="h-4 w-4 text-success"/>{result.save} kWh/day</div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="text-xs text-muted-foreground mb-2">Model Reasoning</div>
                  <ul className="space-y-1.5 text-sm">
                    <li>• Idle time {idle} min {idle > 5 ? "exceeds" : "below"} threshold</li>
                    <li>• CPU {cpu}% suggests {cpu < 15 ? "low workload" : "active workload"}</li>
                    <li>• Input activity {mouse + keyboard} events/min</li>
                    <li>• Foreground: {process}</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SliderInput({ icon: Icon, label, unit, value, setValue, max }: any) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="flex items-center gap-2"><Icon className="h-4 w-4"/> {label}</Label>
        <span className="text-sm font-semibold">{value}{unit}</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => setValue(v[0])} max={max} step={1} />
    </div>
  );
}
