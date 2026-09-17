import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  onOpenSearch?: () => void;
}

export function CtaBanner({ onOpenSearch }: CtaBannerProps) {
  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FFB21D] px-8 py-16 text-center text-white shadow-pixpay-hero sm:px-16 relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <h2 className="text-3xl font-black text-white sm:text-5xl leading-tight">
            Ready to Experience Stress-Free School Payments?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/95">
            Join thousands of parents and leading schools who have simplified tuition collections and
            term fee payments with instant verified digital receipts.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-full bg-[#001638] px-8 py-6 text-base font-bold text-white shadow-xl hover:bg-[#002868] hover:scale-105 transition-all"
            >
              <Link to="/school/register">Request School Integration</Link>
            </Button>
            {onOpenSearch ? (
              <Button
                onClick={onOpenSearch}
                className="rounded-full bg-white px-8 py-6 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer"
              >
                Pay School Fees
              </Button>
            ) : (
              <Button
                asChild
                className="rounded-full bg-white px-8 py-6 text-base font-bold text-slate-900 shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
              >
                <a href="#parents">Pay School Fees</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
