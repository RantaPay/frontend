import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { formatNaira, Student, School, StoreItem } from "@/lib/store";

interface StudentFeeItemsSelectorProps {
  student: Student;
  school: School;
  bal: number;
  tuitionAmount: number;
  onTuitionChange: (amount: number) => void;
  availableStoreItems: StoreItem[];
  selectedStoreItemIds: string[];
  onToggleStoreItem: (id: string) => void;
}

export function StudentFeeItemsSelector({
  student,
  school,
  bal,
  tuitionAmount,
  onTuitionChange,
  availableStoreItems,
  selectedStoreItemIds,
  onToggleStoreItem,
}: StudentFeeItemsSelectorProps) {
  return (
    <div className="space-y-6">
      {/* 1. Academic Fees Card */}
      <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {school.term} Academic Tuition & Levies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Outstanding Term Balance:{" "}
              <span className="font-bold text-rose-600">{formatNaira(bal)}</span>
            </p>
          </div>
          <Badge className="bg-amber-50 text-amber-900 border-amber-200 text-xs font-semibold">
            {school.session}
          </Badge>
        </div>

        {/* Assigned Fee Breakdown List */}
        <div className="mt-4 divide-y divide-slate-100 text-xs">
          {student.fees.map((f, i) => (
            <div key={i} className="flex justify-between py-2.5 text-slate-600">
              <span>{f.title || f.category}</span>
              <span className="font-semibold text-slate-900">{formatNaira(f.amount)}</span>
            </div>
          ))}
        </div>

        {/* Tuition Amount Input */}
        {bal > 0 ? (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tuition-pay" className="text-xs font-bold text-slate-800">
                Amount to Pay Now for Tuition:
              </Label>
              {school.allowPartial && (
                <button
                  type="button"
                  onClick={() => onTuitionChange(bal)}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  Pay Full Balance ({formatNaira(bal)})
                </button>
              )}
            </div>
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                ₦
              </span>
              <Input
                id="tuition-pay"
                type="number"
                min={0}
                max={bal}
                disabled={!school.allowPartial}
                value={tuitionAmount}
                onChange={(e) => onTuitionChange(Number(e.target.value) || 0)}
                className="h-11 pl-8 rounded-xl font-bold text-slate-900 text-base border-slate-300 focus:ring-[#FFB21D]"
              />
            </div>
            {!school.allowPartial && (
              <p className="mt-1.5 text-[11px] text-slate-400">
                This school requires full balance payment per transaction.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">
            ✓ Academic fees fully paid for this term.
          </div>
        )}
      </Card>

      {/* 2. School Store & Auxiliary Supplies */}
      {availableStoreItems.length > 0 && (
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              School Store & Additional Supplies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select class textbooks, uniforms, or excursion levies to include in this payment.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {availableStoreItems.map((item) => {
              const isChecked = selectedStoreItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onToggleStoreItem(item.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl p-3.5 border transition-all ${
                    isChecked
                      ? "border-[#FFB21D] bg-amber-50/40 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleStoreItem(item.id)}
                      className="rounded"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">
                        Category: {item.category} | Class: {item.className}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {formatNaira(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
