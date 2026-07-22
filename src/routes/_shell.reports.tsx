import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Printer, FileSpreadsheet, FileType } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({ meta: [{ title: "Reports · SIDMS" }, { name: "description", content: "Generate and export daily, weekly, monthly, and custom reports." }] }),
  component: Reports,
});

const reports = [
  { id: "R-1042", name: "Daily Energy Report", period: "Today", size: "128 KB", status: "Ready" },
  { id: "R-1041", name: "Weekly ESG Summary", period: "Week 47", size: "412 KB", status: "Ready" },
  { id: "R-1040", name: "Monthly Fleet Utilization", period: "Nov 2026", size: "1.2 MB", status: "Ready" },
  { id: "R-1039", name: "Lab A Detailed Audit", period: "Nov 1-15", size: "782 KB", status: "Ready" },
  { id: "R-1038", name: "Cost Savings Q3", period: "Q3 2026", size: "2.4 MB", status: "Ready" },
  { id: "R-1037", name: "AI Prediction Accuracy", period: "Oct 2026", size: "356 KB", status: "Archived" },
];

function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate polished PDF, Excel, and CSV exports for stakeholders."
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Daily", icon: FileText, tone: "bg-primary/10 text-primary" },
          { label: "Weekly", icon: FileText, tone: "bg-info/15 text-info" },
          { label: "Monthly", icon: FileText, tone: "bg-success/15 text-success" },
          { label: "Custom Range", icon: FileText, tone: "bg-warning/15 text-warning" },
        ].map((r) => (
          <Card key={r.label} className="group cursor-pointer transition hover:shadow-elegant" onClick={() => toast(`Generating ${r.label} report…`)}>
            <CardContent className="p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${r.tone}`}><r.icon className="h-5 w-5"/></div>
              <div className="mt-4 font-semibold">{r.label} Report</div>
              <p className="mt-1 text-xs text-muted-foreground">Auto-compiled with charts, savings, and AI insights.</p>
              <Button variant="outline" size="sm" className="mt-4 w-full">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Report History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast("Exporting PDF…")}><FileType className="h-4 w-4 mr-1"/> PDF</Button>
            <Button variant="outline" size="sm" onClick={() => toast("Exporting Excel…")}><FileSpreadsheet className="h-4 w-4 mr-1"/> Excel</Button>
            <Button variant="outline" size="sm" onClick={() => toast("Exporting CSV…")}><FileText className="h-4 w-4 mr-1"/> CSV</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.period}</TableCell>
                  <TableCell className="text-muted-foreground">{r.size}</TableCell>
                  <TableCell><Badge variant={r.status === "Ready" ? "secondary" : "outline"} className={r.status === "Ready" ? "bg-success/15 text-success" : ""}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast(`Downloading ${r.id}`)}><Download className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="sm" onClick={() => toast(`Printing ${r.id}`)}><Printer className="h-4 w-4"/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
