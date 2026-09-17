import { Card } from "@/components/ui/card";
import { formatNaira, School } from "@/lib/store";
import { Users, Banknote, TrendingDown, Wallet } from "lucide-react";

interface OverviewStatCardsProps {
  studentCount: number;
  paidCount: number;
  partialCount: number;
  unpaidCount: number;
  collected: number;
  outstanding: number;
  expected: number;
  collectionPercent: number;
  activeSchool: School;
}

export function OverviewStatCards({
  studentCount,
  paidCount,
  partialCount,
  unpaidCount,
  collected,
  outstanding,
  expected,
  collectionPercent,
  activeSchool,
}: OverviewStatCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        badgeBg="bg-slate-100 text-slate-800"
        label="Total Students"
        value={studentCount.toString()}
        subtext={`${paidCount} Paid • ${partialCount} Part • ${unpaidCount} Unpaid`}
      />
      <StatCard
        icon={Banknote}
        badgeBg="bg-amber-50 text-amber-900 border border-amber-200/80"
        label="Revenue Collected"
        value={formatNaira(collected)}
        highlightColor="text-slate-950"
        subtext={`${collectionPercent}% of expected term revenue`}
      />
      <StatCard
        icon={TrendingDown}
        badgeBg="bg-rose-50 text-rose-700 border border-rose-200/80"
        label="Outstanding Debt"
        value={formatNaira(outstanding)}
        highlightColor="text-rose-700"
        subtext={`${unpaidCount + partialCount} students with balances`}
      />
      <StatCard
        icon={Wallet}
        badgeBg="bg-blue-50 text-blue-800 border border-blue-200/80"
        label="Expected Revenue"
        value={formatNaira(expected)}
        subtext={`${activeSchool.session} • ${activeSchool.term}`}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  badgeBg,
  label,
  value,
  highlightColor,
  subtext,
}: {
  icon: any;
  badgeBg: string;
  label: string;
  value: string;
  highlightColor?: string;
  subtext?: string;
}) {
  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${badgeBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className={`mt-1 text-2xl sm:text-3xl font-black tracking-tight ${highlightColor || "text-slate-950"}`}>
        {value}
      </div>
      {subtext && <div className="mt-1.5 text-[11px] text-slate-500 font-medium">{subtext}</div>}
    </Card>
  );
}
