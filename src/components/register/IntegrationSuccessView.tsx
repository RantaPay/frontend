import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface IntegrationSuccessViewProps {
  requestNumber: string;
  schoolName: string;
  email: string;
  onReset: () => void;
}

export function IntegrationSuccessView({
  requestNumber,
  schoolName,
  email,
  onReset,
}: IntegrationSuccessViewProps) {
  return (
    <div className="text-center py-6">
      {/* Success Badge */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/70 mt-5">
        <Sparkles className="h-3.5 w-3.5" /> Request Submitted Successfully
      </span>

      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-3">
        Integration Request Received
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        Thank you for choosing RantaPay. Our institutional onboarding team has received your details for{" "}
        <strong className="text-slate-900">{schoolName}</strong> and initiated the verification protocol.
      </p>

      {/* Ticket Number Card */}
      <div className="mt-6 mx-auto max-w-sm rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
          Verification Application Reference
        </span>
        <span className="text-lg sm:text-xl font-mono font-black text-slate-900 mt-1 block tracking-wider">
          {requestNumber}
        </span>
        <span className="text-[11px] text-slate-500 mt-1 block">
          Confirmation details sent to <span className="font-semibold text-slate-700">{email}</span>
        </span>
      </div>

      {/* 3-Step Verification Timeline */}
      <div className="mt-8 text-left max-w-md mx-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#FFB21D]" />
          <span>What Happens Next? (24-Hour Protocol)</span>
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[#FFB21D] font-bold text-[11px]">
              1
            </div>
            <div>
              <div className="font-bold text-slate-900">School Details Confirmation</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Our team confirms your school details and reaches out to your administrator.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
              2
            </div>
            <div>
              <div className="font-bold text-slate-900">Direct School Bank Setup</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Payments made by parents go directly into your official school bank account.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
              3
            </div>
            <div>
              <div className="font-bold text-slate-900">Payment Portal Activation</div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Your payment link goes live and parents receive verified receipts instantly.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-6 py-2.5"
        >
          <Link to="/">Return to Home</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-100 text-xs sm:text-sm font-bold px-6 py-2.5"
        >
          <Link to="/pay">Explore Demo Portal</Link>
        </Button>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline block w-full mt-2"
        >
          Submit another institution request
        </button>
      </div>
    </div>
  );
}
