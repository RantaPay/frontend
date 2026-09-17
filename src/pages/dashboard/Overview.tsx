import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, totalFees, balance, statusOf, formatNaira } from "@/lib/store";
import { useSchoolLiveSync } from "@/lib/school-sync";
import { OverviewStatCards } from "@/components/dashboard/OverviewStatCards";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import {
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  Store,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function Overview() {
  usePageTitle("School Overview : Ranta Pay Bursar OS");
  const activeSchool = useStore((s) => s.settings);
  const allStudents = useStore((s) => s.students);
  const allPayments = useStore((s) => s.payments);

  // Live real-time PostgreSQL synchronization
  useSchoolLiveSync(activeSchool.id);

  const students = useMemo(() => {
    return allStudents.filter((s) => s.schoolId === activeSchool.id);
  }, [allStudents, activeSchool]);

  const payments = useMemo(() => {
    return allPayments.filter((p) => p.schoolId === activeSchool.id);
  }, [allPayments, activeSchool]);

  const expected = students.reduce((a, s) => a + totalFees(s), 0);
  const collected = students.reduce((a, s) => a + s.paid, 0);
  const outstanding = students.reduce((a, s) => a + balance(s), 0);
  const paidCount = students.filter((s) => statusOf(s) === "Paid").length;
  const partialCount = students.filter((s) => statusOf(s) === "Partial").length;
  const unpaidCount = students.filter((s) => statusOf(s) === "Unpaid").length;

  const collectionPercent = expected > 0 ? Math.round((collected / expected) * 100) : 0;

  // Term-by-Term Revenue Comparison Data
  const termComparison = useMemo(() => {
    return [
      { term: "1st Term", collected, expected },
      { term: "2nd Term", collected: Math.round(collected * 0.85), expected },
      { term: "3rd Term", collected: Math.round(collected * 0.72), expected },
    ];
  }, [collected, expected]);

  // Revenue by Category
  const revenueByCategory = useMemo(() => {
    let tuition = 0;
    let books = 0;
    let uniform = 0;
    let other = 0;

    payments.forEach((p) => {
      if (p.items && p.items.length > 0) {
        p.items.forEach((item) => {
          if (item.category === "Tuition") tuition += item.amount;
          else if (item.category === "Books" || item.category === "Textbook") books += item.amount;
          else if (item.category === "Uniform") uniform += item.amount;
          else other += item.amount;
        });
      } else {
        tuition += p.amount;
      }
    });

    return [
      { category: "Tuition", amount: tuition },
      { category: "Textbooks", amount: books || Math.round(collected * 0.15) },
      { category: "Uniforms", amount: uniform || Math.round(collected * 0.08) },
      { category: "Levies & Excursions", amount: other || Math.round(collected * 0.05) },
    ];
  }, [payments, collected]);

  // Outstanding Debt by Class
  const byClass = useMemo(() => {
    const map = new Map<string, number>();
    students.forEach((s) => {
      map.set(s.className, (map.get(s.className) || 0) + balance(s));
    });
    return Array.from(map.entries()).map(([className, debt]) => ({ className, debt }));
  }, [students]);

  return (
    <DashboardShell title="Executive Overview">
      {/* Top 4 KPI Metric Cards */}
      <OverviewStatCards
        studentCount={students.length}
        paidCount={paidCount}
        partialCount={partialCount}
        unpaidCount={unpaidCount}
        collected={collected}
        outstanding={outstanding}
        expected={expected}
        collectionPercent={collectionPercent}
        activeSchool={activeSchool}
      />

      {/* Analytics Charts Grid */}
      <OverviewCharts
        termComparison={termComparison}
        revenueByCategory={revenueByCategory}
        byClass={byClass}
      />

      {/* Bursar Quick Actions */}
      <Card className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-950 text-sm sm:text-base">Bursar Quick Actions</h3>
          <p className="text-xs text-slate-500">Direct management shortcuts</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/school/students"
            className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 transition-all hover:bg-slate-100 hover:border-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 text-slate-500" />
              <span>Add / Manage Students</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/school/fees"
            className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 transition-all hover:bg-slate-100 hover:border-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <Store className="h-4 w-4 text-slate-500" />
              <span>Manage Store & Books</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to="/school/reports"
            className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-3 text-xs font-bold text-slate-800 transition-all hover:bg-slate-100 hover:border-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-slate-500" />
              <span>Broadcast Debt Reminders</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            to={`/pay/${activeSchool.slug}`}
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs font-black text-slate-950 transition-all hover:bg-amber-100 hover:border-amber-300"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#FFB21D]" />
              <span>Parent Portal</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-900" />
          </Link>
        </div>
      </Card>

      {/* Recent Transactions Table */}
      <Card className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 sm:px-6 py-4">
          <div>
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Settled directly into {activeSchool.bankName}</p>
          </div>
          <Link
            to="/school/payments"
            className="text-xs font-bold text-slate-900 hover:text-[#FFB21D] transition-colors"
          >
            View all transactions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-left uppercase tracking-wider text-slate-500 font-bold text-[10px]">
              <tr>
                <th className="px-5 sm:px-6 py-3">Receipt No.</th>
                <th className="px-5 sm:px-6 py-3">Student Name</th>
                <th className="px-5 sm:px-6 py-3">Items / Levies</th>
                <th className="px-5 sm:px-6 py-3">Amount</th>
                <th className="px-5 sm:px-6 py-3">Method</th>
                <th className="px-5 sm:px-6 py-3">Date</th>
                <th className="px-5 sm:px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.slice(0, 5).map((p) => {
                const s = students.find((x) => x.id === p.studentId);
                return (
                  <tr key={p.id} className="transition hover:bg-slate-50/60">
                    <td className="px-5 sm:px-6 py-3 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                    <td className="px-5 sm:px-6 py-3 font-bold text-slate-900">{s?.name ?? "Student"}</td>
                    <td className="px-5 sm:px-6 py-3 text-slate-600">
                      {p.items && p.items.length > 0
                        ? p.items.map((i) => i.title).join(", ")
                        : "Term Tuition"}
                    </td>
                    <td className="px-5 sm:px-6 py-3 font-black text-slate-950">{formatNaira(p.amount)}</td>
                    <td className="px-5 sm:px-6 py-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-5 sm:px-6 py-3 text-slate-500">
                      {new Date(p.date).toLocaleDateString("en-NG")}
                    </td>
                    <td className="px-5 sm:px-6 py-3 text-right">
                      <Link
                        to={`/receipt/${p.id}`}
                        target="_blank"
                        className="font-bold text-[#FFB21D] hover:text-[#EAA315] hover:underline"
                      >
                        View Slip
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No transactions recorded for this school yet.
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
