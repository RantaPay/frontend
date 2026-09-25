import { Landmark, CheckCircle2, QrCode, BarChart3, MessageCircle } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB21D]">
            RANTA PAY CAPABILITIES
          </span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-5xl">
            Simple. Fast. Convenient.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            We empower Nigerian schools and parents with seamless digital fee collection.
            <br />
            Pay via WhatsApp, web portal, bank transfer, or debit cards.
          </p>
        </div>

        {/* Feature 1: Large Premium Charcoal Card */}
        <div className="mt-14 rounded-3xl bg-[#0F172A] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#FFB21D]/10 blur-3xl pointer-events-none" />

          <div className="grid items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#FFB21D] mb-5 shadow-md">
                <Landmark className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold md:text-3xl text-white">
                Unified School Store and Term Tuition
              </h3>
              <p className="mt-3 text-base text-slate-300 leading-relaxed max-w-lg">
                Why pay tuition at the bank and purchase textbooks in separate queues? With Ranta
                Pay, parents bundle tuition, PTA levies, curriculum workbooks, and uniforms in one
                consolidated checkout.
              </p>
              <p className="mt-5 text-sm font-semibold text-white">
                Flexible & Secure Payments can be made using:
              </p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-300 border border-emerald-500/30">
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span className="text-white font-semibold">WhatsApp Chat Payment</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB21D]" />
                  <span>Debit Cards (Mastercard, Visa, Verve)</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB21D]" />
                  <span>Virtual Bank Transfers</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-[#FFB21D]" />
                  <span>USSD Banking Codes</span>
                </div>
              </div>
            </div>

            {/* Right: Stacked Isometric Wallet Cards */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs space-y-3">
                <div className="rounded-2xl bg-[#1E293B] p-5 shadow-2xl text-white border border-slate-700/80">
                  <div className="text-xs text-slate-400">Unified Payment Cart</div>
                  <div className="text-2xl font-black mt-1">NGN 140,000.00</div>
                  <div className="mt-3 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Tuition & Textbooks</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-white/10">
                      <QrCode className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-600 p-3.5 shadow-xl text-white flex justify-between items-center text-xs font-bold -mt-2">
                  <span>Pay Directly on WhatsApp</span>
                  <span>Instant Bot</span>
                </div>

                <div className="rounded-2xl bg-[#FFB21D] p-3.5 shadow-xl text-white flex justify-between items-center text-xs font-bold -mt-2">
                  <span>Direct Bank Settlement</span>
                  <span>100% Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid: 3 Pillars (WhatsApp, Virtual Accounts, QR Passes) */}
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Card 1: WhatsApp Fee Payment */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-pixpay-card transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pay Fees on WhatsApp</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              No new apps to install. Parents can send their child's admission number to our
              verified WhatsApp line to receive itemized bills and pay securely in chat.
            </p>

            <div className="mt-6 rounded-2xl bg-[#EAFBF1] p-5 border border-emerald-100 shadow-sm text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <div className="h-2 w-2 rounded-full bg-[#25D366]" />
                <span>WhatsApp Instant Invoicing</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600">
                "Hello! Send student ID to get your term tuition breakdown and pay in 60 seconds."
              </p>
            </div>
          </div>

          {/* Card 2: Virtual Accounts & Terminals */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-pixpay-card transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#FFB21D] mb-4">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Virtual Bank Accounts</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Prefer paying through your banking app? Parents generate dynamic 30-minute virtual
              accounts dedicated to their child for immediate clearance without paper proof.
            </p>

            <div className="mt-6 rounded-2xl bg-[#FFF3D6] p-5 border border-amber-200 shadow-sm text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Dynamic Titan / Wema Account</span>
              </div>
              <p className="mt-2 text-[11px] font-mono font-bold text-slate-800">
                Acc: 9920194820 (Auto-Cleared)
              </p>
            </div>
          </div>

          {/* Card 3: QR Gate Pass Clearance */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-pixpay-card transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#FFB21D] mb-4">
              <QrCode className="h-6 w-6 text-[#FFB21D]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tamper-Proof QR Clearance</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Eliminate lost paper bank slips on exam morning. Every payment generates an official
              verifiable QR code that school gatekeepers can scan with any phone.
            </p>

            <div className="mt-6 rounded-2xl bg-amber-50/50 p-5 border border-amber-200 shadow-sm text-xs">
              <div className="flex items-center gap-2 text-[#FFB21D] font-bold">
                <div className="h-2 w-2 rounded-full bg-[#FFB21D]" />
                <span>Instant Exam Hall Pass</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-600">
                100% Cryptographically Authenticated
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
