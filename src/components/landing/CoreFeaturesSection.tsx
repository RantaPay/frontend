import { Link } from "react-router-dom";
import { GraduationCap, Building2, CheckCircle2 } from "lucide-react";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.712 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z" />
    </svg>
  );
}

export function CoreFeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs mb-4">
            Core Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            A Unified System Built for School Payments
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Engineered specifically for Nigerian parents and schools.
          </p>
        </div>

        {/* 2 Core Feature Cards Grid (Parents & Schools) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: For Parents */}
          <div className="rounded-[32px] border border-slate-200/80 bg-[#F8FAFC] p-7 sm:p-8 flex flex-col justify-between hover:shadow-lg transition-all duration-300">
            <div>
              <h3 className="text-2xl font-black text-slate-900">For Parents</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Pay tuition, books, and uniforms in seconds online with your phone.
                No bank queues, no paper tellers, and instant verified clearance receipts.
              </p>
            </div>

            {/* Mockup Inside Card 1: Payment Checkout */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">Online Fee Checkout</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Instant Pay
                </span>
              </div>

              <div className="my-4 text-center">
                <div className="text-[11px] text-slate-400 font-medium">Amount to pay</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">₦65,000.00</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 font-semibold text-emerald-900">
                  <span>Pay with Debit Card</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Verve / Visa / Mastercard</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-600">
                  <span>Pay with Bank Transfer</span>
                  <span className="text-[10px] text-slate-400">Virtual Account</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-slate-600">
                  <span>Pay with USSD</span>
                  <span className="text-[10px] text-slate-400">All Nigerian Banks</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Anti-Fraud Receipt</span>
                <span className="font-semibold text-emerald-600">Active Clearance</span>
              </div>
            </div>
          </div>

          {/* Card 2: For Schools */}
          <div className="rounded-[32px] bg-[#FFB21D] p-7 sm:p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
            {/* Ambient Background Glow */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white">For Schools</h3>
              <p className="mt-2 text-sm text-white/95 leading-relaxed">
                Direct fee collections straight into your designated bank account with zero holding.
                Automate debtor sweeps, class tracking, and instant verified payment receipts.
              </p>
            </div>

            {/* Mockup Inside Card 2: School Related Bursar Portal */}
            <div className="relative z-10 mt-8 rounded-2xl border border-amber-300/40 bg-white p-5 text-slate-900 shadow-lg">
              {/* School Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-[#FFB21D]">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Apex Model College</div>
                    <div className="text-[10px] text-slate-400">Secondary School</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Term 1 Active
                </span>
              </div>

              {/* School Class Roster Stats */}
              <div className="my-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">JSS 2A Tuition Collection</span>
                  <span className="font-bold text-slate-900">₦3,120,000</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[94%] rounded-full bg-[#FFB21D]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>45/48 Pupils Cleared</span>
                  <span className="font-bold text-emerald-600">94% Cleared</span>
                </div>
              </div>

              {/* Settlement Bank Account */}
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-[#FFB21D]" />
                    Direct Zenith Bank
                  </span>
                  <span className="text-slate-500">•••• 9204</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Direct Bank Settlement</span>
                  <span className="text-emerald-600 font-bold">Instant</span>
                </div>
              </div>

              {/* Floating Status Pill */}
              <div className="mt-3 rounded-lg bg-[#001638] p-2 text-center text-[11px] font-bold text-white shadow-xs">
                Instant Fee Tracking Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
