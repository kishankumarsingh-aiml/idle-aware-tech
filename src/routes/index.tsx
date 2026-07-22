import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIDMS — Smart Idle Device Management System" },
      { name: "description", content: "AI-powered energy saving platform that detects idle computers in labs and reduces electricity, CO₂, and cost." },
      { property: "og:title", content: "SIDMS — AI Energy Saving for Computer Labs" },
      { property: "og:description", content: "Detect idle PCs with AI. Save energy, reduce CO₂, cut costs across every lab." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@sidms.io");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try { localStorage.setItem("sidms_user", JSON.stringify({ email, role: "admin" })); } catch {}
      toast.success("Welcome back", { description: "Signed in to SIDMS" });
      navigate({ to: "/dashboard" });
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-soft">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary-glow/25 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-16">
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-between h-full py-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand shadow-glow">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">SIDMS</div>
              <div className="text-xs text-muted-foreground">Smart Idle Device Management</div>
            </div>
          </div>

          <div className="space-y-6 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-Powered Energy Intelligence
            </div>
            <h1 className="text-5xl font-bold tracking-tight leading-tight">
              Cut energy waste in every <span className="text-gradient-brand">computer lab</span>.
            </h1>
            <p className="text-lg text-muted-foreground">
              SIDMS detects idle machines in real time, predicts optimal sleep windows,
              and automates power actions — reducing electricity bills, carbon emissions, and hardware wear.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { k: "38.2 MWh", v: "Saved this year" },
                { k: "18.4 t", v: "CO₂ reduced" },
                { k: "₹4.6L", v: "Cost saved" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl p-4">
                  <div className="text-xl font-semibold text-gradient-brand">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> Enterprise-grade, privacy-first, deploy-anywhere.
          </div>
        </div>

        {/* Login card */}
        <div className="flex items-center justify-center">
          <div className="glass w-full max-w-md rounded-3xl p-8 shadow-elegant">
            <div className="lg:hidden mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-base font-semibold">SIDMS</div>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="mt-1 text-sm text-muted-foreground">Access your energy intelligence dashboard.</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" onClick={() => toast("Reset link sent to your email")} className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 h-11" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me for 30 days</Label>
              </div>
              <Button type="submit" disabled={loading} className="h-11 w-full bg-gradient-brand text-primary-foreground hover:opacity-95 shadow-elegant">
                {loading ? "Signing in…" : "Sign in to SIDMS"}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Demo credentials pre-filled. Any values will work.
            </div>
            <div className="mt-2 text-center text-xs">
              <Link to="/dashboard" className="text-primary hover:underline">Skip login → Enter demo</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
