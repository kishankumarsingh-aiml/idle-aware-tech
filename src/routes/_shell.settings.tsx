import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({ meta: [{ title: "Settings · SIDMS" }, { name: "description", content: "Configure AI thresholds, energy rates, notifications, and user management." }] }),
  component: Settings,
});

const users = [
  { name: "Aditi Sharma", email: "admin@sidms.io", role: "Admin" },
  { name: "Rohan Verma", email: "rohan@sidms.io", role: "Lab Assistant" },
  { name: "Priya Nair", email: "priya@sidms.io", role: "Lab Assistant" },
];

function Settings() {
  const [idleT, setIdleT] = useState(5);
  const [sleepT, setSleepT] = useState(10);
  const [shutT, setShutT] = useState(30);

  return (
    <div>
      <PageHeader title="Settings" description="Fine-tune AI, energy assumptions, notifications, and access." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>AI Thresholds</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <SliderRow label="Idle Timeout" unit=" min" value={idleT} setValue={setIdleT} max={60}/>
            <SliderRow label="Sleep Timeout" unit=" min" value={sleepT} setValue={setSleepT} max={60}/>
            <SliderRow label="Shutdown Timeout" unit=" min" value={shutT} setValue={setShutT} max={120}/>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><div className="font-medium text-sm">Auto Sleep</div><div className="text-xs text-muted-foreground">Put PCs to sleep after idle threshold</div></div>
              <Switch defaultChecked/>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div><div className="font-medium text-sm">Auto Shutdown</div><div className="text-xs text-muted-foreground">Shutdown after prolonged idle</div></div>
              <Switch/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Energy & Environment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2"><Label>Electricity Price (₹ / kWh)</Label><Input defaultValue="10.00"/></div>
            <div className="grid gap-2"><Label>Carbon Emission Factor (kg CO₂ / kWh)</Label><Input defaultValue="0.475"/></div>
            <div className="grid gap-2">
              <Label>Currency</Label>
              <Select defaultValue="inr">
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="inr">INR (₹)</SelectItem>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Row label="Dark Mode" desc="Switch app theme"><Switch onCheckedChange={(v) => document.documentElement.classList.toggle("dark", v)}/></Row>
            <Row label="Email Notifications" desc="Daily digest & alerts"><Switch defaultChecked/></Row>
            <Row label="Push Notifications" desc="Real-time alerts"><Switch defaultChecked/></Row>
            <div className="grid gap-2">
              <Label>Language</Label>
              <Select defaultValue="en">
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button size="sm" className="bg-gradient-brand text-primary-foreground" onClick={() => toast("Invite user")}><Plus className="h-4 w-4 mr-1"/> Invite</Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {users.map((u) => (
              <div key={u.email} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-primary-foreground font-semibold">{u.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                <Badge variant={u.role === "Admin" ? "default" : "secondary"} className={u.role === "Admin" ? "bg-gradient-brand" : ""}>{u.role}</Badge>
                <Button variant="ghost" size="icon" onClick={() => toast(`Reset password for ${u.email}`)}>🔑</Button>
                <Button variant="ghost" size="icon" onClick={() => toast(`Removed ${u.name}`)}><Trash2 className="h-4 w-4"/></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-brand text-primary-foreground" onClick={() => toast.success("Settings saved")}>Save changes</Button>
      </div>
    </div>
  );
}

function SliderRow({ label, unit, value, setValue, max }: any) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-semibold">{value}{unit}</span>
      </div>
      <Slider value={[value]} onValueChange={(v) => setValue(v[0])} max={max} step={1}/>
    </div>
  );
}
function Row({ label, desc, children }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div><div className="font-medium text-sm">{label}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
      {children}
    </div>
  );
}
