import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, totalFees, balance, statusOf, formatNaira } from "@/lib/store";
import {
  FileText,
  FileSpreadsheet,
  Send,
  MessageSquare,
  AlertCircle,
  Search,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";
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
  const [selectedClass, setSelectedClass] = useState("All");
  const [q, setQ] = useState("");

  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.className))).sort();
    return ["All", ...list];
  }, [students]);

  const termTotal = payments.reduce((a, p) => a + p.amount, 0);
  const outstanding = students.reduce((a, s) => a + balance(s), 0);
  const expected = students.reduce((a, s) => a + totalFees(s), 0);
  const paid = students.filter((s) => statusOf(s) === "Paid");
  const unpaid = students.filter((s) => statusOf(s) !== "Paid");

  // Debtors filtered by class and search query
  const filteredUnpaid = useMemo(() => {
    return unpaid.filter((s) => {
      if (selectedClass !== "All" && s.className !== selectedClass) return false;
      if (q.trim()) {
        const query = q.trim().toLowerCase();
        const matches = [s.name, s.admissionNumber, s.parentName, s.parentPhone, s.className]
          .join(" ")
          .toLowerCase();
        if (!matches.includes(query)) return false;
      }
      return true;
    });
  }, [unpaid, selectedClass, q]);

  const filteredDebtAmount = useMemo(() => {
    return filteredUnpaid.reduce((sum, s) => sum + balance(s), 0);
  }, [filteredUnpaid]);

  const hasActiveDebtorFilters = selectedClass !== "All" || q.trim() !== "";

  const handleBroadcast = async () => {
    const targetList = filteredUnpaid.length > 0 ? filteredUnpaid : unpaid;
    if (targetList.length === 0) {
      return toast.info("No debtor students to send reminders to.");
    }
    setIsBroadcasting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsBroadcasting(false);
    toast.success(
      `Broadcast dispatched: Sent personalized WhatsApp & SMS payment links to ${targetList.length} parents${
        selectedClass !== "All" ? ` in ${selectedClass}` : ""
      }.`
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
          disabled={isBroadcasting || (hasActiveDebtorFilters ? filteredUnpaid.length === 0 : unpaid.length === 0)}
          className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
        >
          <Send className="mr-1.5 h-4 w-4" />
          {isBroadcasting
            ? "Broadcasting Reminders..."
            : hasActiveDebtorFilters
            ? `Broadcast Reminders to ${filteredUnpaid.length} Filtered Debtors`
            : `Broadcast Reminders to All ${unpaid.length} Debtors`}
        </Button>
      </div>

      {/* Unpaid Students Table */}
      <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Debtor Student Ledger</h3>
              <Badge variant="outline" className="border-destructive/30 text-destructive text-xs">
                {filteredUnpaid.length} of {unpaid.length} Owing
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Students with pending fee balances for {activeSchool.term}
              {filteredDebtAmount > 0 && ` • ${formatNaira(filteredDebtAmount)} total in view`}
            </p>
          </div>

          {/* Class & Search Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[170px]">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search debtor name, adm..."
                className="h-8 pl-8 pr-7 text-xs"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
              <select
                aria-label="Filter Debtors by Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All">All Classes ({unpaid.length} debtors)</option>
                {classes
                  .filter((c) => c !== "All")
                  .map((c) => {
                    const classDebtors = unpaid.filter((s) => s.className === c).length;
                    return (
                      <option key={c} value={c}>
                        {c} ({classDebtors} owing)
                      </option>
                    );
                  })}
              </select>
            </div>

            {hasActiveDebtorFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedClass("All");
                  setQ("");
                }}
                className="h-8 text-xs text-destructive hover:bg-destructive/10 px-2"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}
          </div>
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
              {filteredUnpaid.map((s) => (
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
              {unpaid.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">
                    <AlertCircle className="mx-auto h-6 w-6 text-accent mb-1" />
                    All registered students have fully cleared their fees for this term.
                  </td>
                </tr>
              ) : filteredUnpaid.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground">
                    <AlertCircle className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                    No debtor students found matching your selected class or search filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
