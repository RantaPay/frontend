import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Lock, CreditCard, Building2, Smartphone, MessageCircle } from "lucide-react";
import { formatNaira, School, Student } from "@/lib/store";

interface PaystackCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  onConfirm: () => void;
  totalPayable: number;
  method: "Card" | "Bank Transfer" | "USSD" | "WhatsApp";
  school: School;
  student: Student;
  payerEmail: string;
}

export function PaystackCheckoutModal({
  open,
  onOpenChange,
  isProcessing,
  onConfirm,
  totalPayable,
  method,
  school,
  student,
  payerEmail,
}: PaystackCheckoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-[#FFB21D] border border-amber-200/60 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Secure Checkout
              </DialogTitle>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {school.name}
            </span>
          </div>
          <DialogDescription className="pt-2 text-xs text-slate-500">
            Payment goes directly to {school.name}'s educational bank account.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-slate-500">Student Name</div>
              <div className="text-sm font-bold text-slate-900">{student.name}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {student.admissionNumber} ({student.className})
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Total Payable</div>
              <div className="text-xl font-black text-slate-950">
                {formatNaira(totalPayable)}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Channel Screen */}
        <div className="space-y-4">
          {method === "WhatsApp" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-900">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp Instant Pay Authorization</span>
              </div>
              <div className="rounded-lg bg-white p-3 border border-emerald-200 text-[11px] space-y-1">
                <div className="text-slate-600">
                  Authorizing fee invoice for <span className="font-bold text-slate-900">{student.name}</span>.
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  Verified digital QR receipt will be dispatched directly to your WhatsApp.
                </div>
              </div>
            </div>
          )}

          {method === "Card" && (
            <div className="rounded-xl border border-slate-200 p-4 bg-white text-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <CreditCard className="h-4 w-4 text-[#FFB21D]" />
                <span>Encrypted Card Payment Entry</span>
              </div>
              <div className="rounded-lg bg-slate-100 p-3 font-mono text-[11px] text-slate-600">
                <div>CARD: 4084 0800 •••• 9402</div>
                <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                  <span>EXP: 12/28</span>
                  <span>CVV: •••</span>
                </div>
              </div>
            </div>
          )}

          {method === "Bank Transfer" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>Dedicated Dynamic Virtual Account</span>
              </div>
              <div className="rounded-lg bg-white p-3 border border-amber-200 font-mono text-[11px]">
                <div className="text-slate-500">Bank: Wema Bank / Paystack Titan</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">9920194820</div>
                <div className="text-[10px] text-amber-700 mt-1">
                  Expires in 29:58. Instant automated clearance upon transfer.
                </div>
              </div>
            </div>
          )}

          {method === "USSD" && (
            <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-purple-900">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span>Bank USSD Dial String</span>
              </div>
              <div className="rounded-lg bg-white p-3 border border-purple-200 font-mono text-center">
                <div className="text-base font-bold text-slate-900">*737*000*4928#</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Dial on your registered SIM to authorize {formatNaira(totalPayable)}.
                </div>
              </div>
            </div>
          )}

          {payerEmail && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Digital receipt will be sent to {payerEmail}</span>
            </div>
          )}

          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full rounded-xl bg-[#FFB21D] hover:bg-[#EAA315] py-6 text-sm font-black text-slate-950 shadow-md transition-all cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Confirming payment...
              </span>
            ) : (
              `Authorize Payment of ${formatNaira(totalPayable)}`
            )}
          </Button>

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Bank-grade encrypted secure payment</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
