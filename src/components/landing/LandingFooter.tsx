import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer id="contact" className="border-t border-slate-200/80 bg-slate-50 py-14 text-sm text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Brand Identity & Clear Mission */}
          <div className="max-w-md">
            <Link to="/" className="group inline-flex items-center">
              <BrandLogo showText size="xl" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Smart, stress-free school fee payments for Nigerian parents and schools.
              Pay in seconds on WhatsApp or online with instant verified receipts.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Bank-grade security & direct settlement</span>
            </div>
          </div>

          {/* Clean, Curated Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Platform
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/pay" className="hover:text-[#FFB21D] transition-colors">
                    Pay School Fees
                  </Link>
                </li>
                <li>
                  <a href="#why-rantapay" className="hover:text-[#FFB21D] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <Link to="/subscribe" className="hover:text-[#FFB21D] transition-colors">
                    Parent Newsletter
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Schools & Support
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link to="/school/register" className="hover:text-[#FFB21D] transition-colors">
                    Request School Integration
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-[#FFB21D] transition-colors">
                    Account Sign In
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@rantapay.ng"
                    className="hover:text-[#FFB21D] transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FFB21D] transition-colors">
                    Frequently Asked
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ranta Pay Network. All rights reserved. Built for Nigerian schools.
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/pay" className="hover:text-[#FFB21D] transition-colors">
              Find School
            </Link>
            <span>•</span>
            <Link to="/login" className="hover:text-[#FFB21D] transition-colors">
              Bursar Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
