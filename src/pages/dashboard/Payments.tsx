import { Link } from "react-router-dom";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, formatNaira } from "@/lib/store";
import { useSchoolLiveSync } from "@/lib/school-sync";
import { Eye, Download, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentsPage() {
  usePageTitle("Transactions Ledger : Ranta Pay Bursar OS");
  const activeSchool = useStore((s) => s.settings);
  const allPayments = useStore((s) => s.payments);
  const allStudents = useStore((s) => s.students);
  useSchoolLiveSync(activeSchool.id);

  // Filter payments scoped by active school
  const schoolPayments = useMemo(() => {
    return allPayments.filter((p) => p.schoolId === activeSchool.id);
  }, [allPayments, activeSchool]);

  const [q, setQ] = useState("");
  const [method, setMethod] = useState("All");
  const [cls, setCls] = useState("All");

  const classes = useMemo(() => {
    const list = Array.from(new Set(allStudents.filter((s) => s.schoolId === activeSchool.id).map((s) => s.className)));
    return ["All", ...list.sort()];
  }, [allStudents, activeSchool]);

  const rows = useMemo(() => {
    return schoolPayments
      .map((p) => ({
        ...p,
        student: allStudents.find((x) => x.id === p.studentId),
      }))
      .filter((p) => {
        if (method !== "All" && p.method !== method) return false;
        if (cls !== "All" && p.student?.className !== cls) return false;
        if (q) {
          const v = q.toLowerCase();
          const matches = `${p.receiptNumber} ${p.student?.name ?? ""} ${p.reference} ${p.payerEmail ?? ""}`.toLowerCase();
          if (!matches.includes(v)) return false;
        }
        return true;
      });
  }, [schoolPayments, allStudents, q, method, cls]);

  return (
    <DashboardShell title="Transactions & Settlements">
      {/* Search & Filters */}
      <Card className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by receipt number, student name, reference, or email..."
              className="h-10 pl-9 text-xs"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {["All Methods", "Card", "Bank Transfer", "USSD", "WhatsApp"].map((m) => (
              <option key={m} value={m === "All Methods" ? "All" : m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Classes" : `Class: ${c}`}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold text-foreground">Transaction Audit Log ({rows.length})</h3>
            <p className="text-xs text-muted-foreground">
              Direct settlement target: {activeSchool.bankName} ({activeSchool.accountNumber})
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-muted/40 text-left uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Receipt No</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Items Paid</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((p) => (
                <tr key={p.id} className="transition hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono font-medium text-foreground">{p.receiptNumber}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{p.student?.name ?? "Student"}</td>
                  <td className="px-5 py-3">{p.student?.className ?? "N/A"}</td>
                  <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">
                    {p.items && p.items.length > 0
                      ? p.items.map((i) => i.title).join(", ")
                      : "Term Tuition"}
                  </td>
                  <td className="px-5 py-3 font-bold text-foreground">{formatNaira(p.amount)}</td>
                  <td className="px-5 py-3">{p.method}</td>
                  <td className="px-5 py-3">
                    <Badge className="bg-accent text-accent-foreground text-[10px]">
                      <CheckCircle2 className="mr-1 h-3 w-3 inline" />
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(p.date).toLocaleString("en-NG")}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" asChild title="View Receipt">
                        <Link to={`/receipt/${p.id}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => toast.success(`Receipt ${p.receiptNumber} downloaded.`)}
                        title="Download Receipt"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">
                    No transactions matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
