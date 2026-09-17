import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { SchoolLoginForm } from "@/components/auth/SchoolLoginForm";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function LoginPage() {
  usePageTitle("School Bursar Sign In : Ranta Pay");

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col selection:bg-[#FFB21D] selection:text-white">
      {/* 1. Shared Unified Header */}
      <PublicHeader
        rightAction={
          <Button
            asChild
            className="rounded-full bg-[#0F172A] text-white hover:bg-slate-800 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2"
          >
            <Link to="/school/register">Request Integration</Link>
          </Button>
        }
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-auto">
          {/* Login Card */}
          <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            <SchoolLoginForm />
          </Card>

          {/* Quick Footer Links */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-2">
            <span>
              Are you a parent?{" "}
              <Link to="/pay" className="font-bold text-slate-900 hover:text-[#FFB21D] underline">
                Pay Student Fees
              </Link>
            </span>
            <Link to="/admin/login" className="hover:text-slate-900 transition-colors font-medium">
              Super Admin
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
