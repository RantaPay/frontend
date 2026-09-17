import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const STREAM_COLORS = ["#FFB21D", "#3B82F6", "#10B981", "#8B5CF6"];

function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white shadow-xl">
        <div className="font-bold text-slate-300 mb-1">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 text-[11px]">
            <span style={{ color: entry.color || entry.fill }}>{entry.name}:</span>
            <span className="font-mono font-bold text-white">
              {formatNaira(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

interface OverviewChartsProps {
  termComparison: Array<{ term: string; collected: number; expected: number }>;
  revenueByCategory: Array<{ category: string; amount: number }>;
  byClass: Array<{ className: string; debt: number }>;
}

export function OverviewCharts({
  termComparison,
  revenueByCategory,
  byClass,
}: OverviewChartsProps) {
  return (
    <>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Chart 1: Term-by-Term Income Comparison */}
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-950 text-sm sm:text-base">Term Income Comparison</h3>
              <p className="text-xs text-slate-500">Collected revenue vs expected across terms</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFB21D]" /> Collected
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-500">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-800" /> Expected
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={termComparison} barGap={6}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB21D" stopOpacity={1} />
                    <stop offset="100%" stopColor="#EAA315" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="slateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="term" fontSize={11} stroke="#64748B" tickLine={false} />
                <YAxis
                  fontSize={11}
                  stroke="#64748B"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="collected" fill="url(#goldGradient)" name="Collected" radius={[6, 6, 0, 0]} barSize={26} />
                <Bar dataKey="expected" fill="url(#slateGradient)" name="Expected" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Revenue Streams Distribution */}
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-950 text-sm sm:text-base">Revenue Streams</h3>
              <p className="text-xs text-slate-500">Tuition vs Books vs Uniform vs Extra levies</p>
            </div>
            <Badge className="bg-amber-50 text-amber-900 border-amber-200/80 text-[10px] font-bold">
              Breakdown
            </Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  fontSize={11}
                  stroke="#64748B"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  fontSize={11}
                  stroke="#475569"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="amount" name="Revenue" radius={[0, 6, 6, 0]}>
                  {revenueByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={STREAM_COLORS[index % STREAM_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Chart 3: Outstanding Balances by Class */}
      <Card className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">Outstanding Balances by Class</h3>
            <p className="text-xs text-slate-500">Concentration of student fee arrears</p>
          </div>
          <Link
            to="/school/reports"
            className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-[#FFB21D] transition-colors"
          >
            Debtor list <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byClass} barSize={34}>
              <defs>
                <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
                  <stop offset="100%" stopColor="#BE123C" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="className" fontSize={11} stroke="#64748B" tickLine={false} />
              <YAxis
                fontSize={11}
                stroke="#64748B"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar dataKey="debt" fill="url(#roseGradient)" name="Outstanding" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
