import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PublicHeaderProps {
  showHomeLink?: boolean;
  rightAction?: React.ReactNode;
}

export function PublicHeader({
  showHomeLink = true,
  rightAction,
}: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link to="/" className="group inline-flex items-center">
          <BrandLogo showText size="xl" />
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {showHomeLink && (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span>Back to Home</span>
            </Link>
          )}

          {rightAction ? (
            rightAction
          ) : (
            <Button
              asChild
              className="rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 transition-all shadow-xs"
            >
              <Link to="/school/login">School Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
