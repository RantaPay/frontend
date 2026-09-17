import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/store";
import { Building2, Users, Banknote, TrendingUp } from "lucide-react";

interface AdminMetricsGridProps {
  totalSchools: number;
  totalStudents: number;
  totalVolume: number;
  platformRevenue: number;
}

export function AdminMetricsGrid({
  totalSchools,
  totalStudents,
  totalVolume,
  platformRevenue,
}: AdminMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Registered Schools
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0052FF]">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">{totalSchools}</div>
        <div className="mt-1 text-xs text-slate-500">Active billing subaccounts</div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Total Enrolled
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">{totalStudents}</div>
        <div className="mt-1 text-xs text-slate-500">Students across all institutions</div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Gross Volume Processed
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Banknote className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {formatNaira(totalVolume)}
        </div>
        <div className="mt-1 text-xs text-emerald-600 font-medium">
          Direct settlement into school accounts
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Platform Revenue (1.5%)
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 text-3xl font-extrabold text-slate-900">
          {formatNaira(platformRevenue)}
        </div>
        <div className="mt-1 text-xs text-amber-600 font-medium">Automated commission split</div>
      </Card>
    </div>
  );
}
