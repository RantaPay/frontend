import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, totalFees, balance, statusOf, formatNaira } from "@/lib/store";
import { FileText, FileSpreadsheet, Send, MessageSquare, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  usePageTitle("Reports & Debtors : Ranta Pay Bursar OS");
  const activeSchool = useStore((s) => s.settings);
  const allPayments = useStore((s) => s.payments);
  const allStudents = useStore((s) => s.students);

  // Filter scoped by active school
  const students = useMemo(() => {
    return allStudents.filter((s) => s.schoolId === activeSchool.id);
  }, [allStudents, activeSchool]);

  const payments = useMemo(() => {
    return allPayments.filter((p) => p.schoolId === activeSchool.id);
  }, [allPayments, activeSchool]);

  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const termTotal = payments.reduce((a, p) => a + p.amount, 0);
  const outstanding = students.reduce((a, s) => a + balance(s), 0);
  const expected = students.reduce((a, s) => a + totalFees(s), 0);
  const paid = students.filter((s) => statusOf(s) === "Paid");
  const unpaid = students.filter((s) => statusOf(s) !== "Paid");

  const handleBroadcast = async () => {
    if (unpaid.length === 0) {
      return toast.info("All students have fully settled their fees. No reminders needed!");
    }
    setIsBroadcasting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsBroadcasting(false);
    toast.success(
      `Broadcast dispatched: Sent personalized WhatsApp & SMS payment links to ${unpaid.length} parents.`
    );
  };

  const handleSingleReminder = (studentName: string, phone: string) => {
    toast.success(`Sent 1-click WhatsApp payment link to ${studentName}'s parent (${phone}).`);
  };

  return (
    <DashboardShell title="Financial Reports & Debtors">
      {/* Top Stat Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Term Revenue Collected
          </div>
          <div className="mt-2 text-2xl font-black text-accent">{formatNaira(termTotal)}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">Settled directly into school bank account</p>
        </Card>

        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Outstanding Debt
          </div>
          <div className="mt-2 text-2xl font-black text-destructive">{formatNaira(outstanding)}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">{unpaid.length} students with balances</p>
        </Card>

        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Expected Term Budget
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">{formatNaira(expected)}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">{activeSchool.session} : {activeSchool.term}</p>
        </Card>

        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settlement Ratio
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {Math.round((paid.length / (students.length || 1)) * 100)}%
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{paid.length} of {students.length} fully paid</p>
        </Card>
      </div>

      {/* Export & Actions Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Termly PDF financial audit report generated.")}
          >
            <FileText className="mr-1.5 h-4 w-4" /> Export PDF Summary
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Student fee ledger exported to Excel (XLSX).")}
          >
            <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export Excel
          </Button>
        </div>

        <Button
          onClick={handleBroadcast}
          disabled={isBroadcasting || unpaid.length === 0}
          className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
        >
          <Send className="mr-1.5 h-4 w-4" />
          {isBroadcasting ? "Broadcasting Reminders..." : `Broadcast Reminders to ${unpaid.length} Debtors`}
        </Button>
      </div>

      {/* Unpaid Students Table */}
      <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold text-foreground">Debtor Student Ledger</h3>
            <p className="text-xs text-muted-foreground">
              Students with pending fee balances for {activeSchool.term}
            </p>
          </div>
          <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">
            {unpaid.length} Outstanding
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-muted/40 text-left uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Adm No.</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Class</th>
                <th className="px-5 py-3">Parent Name</th>
                <th className="px-5 py-3">Parent Phone</th>
                <th className="px-5 py-3">Total Due</th>
                <th className="px-5 py-3">Paid</th>
                <th className="px-5 py-3">Balance</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {unpaid.map((s) => (
                <tr key={s.id} className="transition hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono font-medium text-foreground">{s.admissionNumber}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{s.name}</td>
                  <td className="px-5 py-3">{s.className}</td>
                  <td className="px-5 py-3">{s.parentName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{s.parentPhone}</td>
                  <td className="px-5 py-3 font-medium">{formatNaira(totalFees(s))}</td>
                  <td className="px-5 py-3 font-medium text-accent">{formatNaira(s.paid)}</td>
                  <td className="px-5 py-3 font-black text-destructive">{formatNaira(balance(s))}</td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSingleReminder(s.name, s.parentPhone)}
                      className="text-xs text-primary hover:bg-primary/10"
                    >
                      <MessageSquare className="mr-1 h-3.5 w-3.5" /> Send Notice
                    </Button>
                  </td>
                </tr>
              ))}
              {unpaid.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">
                    <AlertCircle className="mx-auto h-6 w-6 text-accent mb-1" />
                    All registered students have fully cleared their fees for this term.
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
