import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Authentic Ranta Pay Logo */}
        <Link to="/" className="group inline-flex items-center">
          <BrandLogo showText size="xl" />
        </Link>

        {/* Curated Desktop Nav Links (Clean, 4 items in priority order, no clutter) */}
        <nav className="hidden items-center gap-10 text-sm font-semibold text-slate-700 md:flex">
          <a
            href="#why-rantapay"
            className="hover:text-[#FFB21D] transition-colors"
          >
            How It Works
          </a>
          <Link
            to="/pay"
            className="hover:text-[#FFB21D] transition-colors"
          >
            Pay Fees
          </Link>
          <a
            href="#faq"
            className="hover:text-[#FFB21D] transition-colors"
          >
            FAQs
          </a>
          <a
            href="#contact"
            className="hover:text-[#FFB21D] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="rounded-full bg-[#FFB21D] px-7 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#EAA315] hover:shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link to="/school/login">Account Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
