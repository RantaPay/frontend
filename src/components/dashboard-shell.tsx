import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  Building2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, logout, useStore, setActiveSchool } from "@/lib/store";

const navItems = [
  { to: "/school/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/school/students", label: "Students", icon: Users },
  { to: "/school/fees", label: "Fees & Store", icon: Wallet },
  { to: "/school/payments", label: "Transactions", icon: CreditCard },
  { to: "/school/reports", label: "Reports & Debts", icon: FileBarChart },
  { to: "/school/settings", label: "Profile & Bank", icon: Settings },
];

export function DashboardShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const { isAuthed, ready } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const schools = useStore((s) => s.schools);
  const activeSchool = useStore((s) => s.settings);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !isAuthed) {
      navigate("/school/login");
    }
  }, [ready, isAuthed, navigate]);

  if (!ready || !isAuthed) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF9F6] text-slate-500 text-sm font-medium">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-[#FFB21D] selection:text-white">
      {/* Mobile Drawer Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200/90 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 font-semibold">
          <Link to="/" className="group inline-flex items-center">
            <BrandLogo showText size="md" />
          </Link>
          <Badge className="bg-amber-50 text-amber-900 border-amber-200/80 text-[10px] font-bold uppercase tracking-wider">
            Bursar OS
          </Badge>
        </div>

        {/* School Quick Switcher */}
        <div className="border-b border-slate-100 p-3.5 bg-slate-50/40">
          <label htmlFor="school-switcher" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current School:
          </label>
          <div className="relative mt-1">
            <Building2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="school-switcher"
              value={activeSchool?.id}
              onChange={(e) => setActiveSchool(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] transition-all"
            >
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium">{activeSchool?.session} • {activeSchool?.term}</span>
            <Link
              to={`/pay/${activeSchool?.slug}`}
              target="_blank"
              className="flex items-center gap-1 font-bold text-[#FFB21D] hover:text-[#EAA315] transition-colors"
              title="Open Public Parent Portal"
            >
              Portal <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all ${
                  active
                    ? "bg-slate-950 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950 font-medium"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-[#FFB21D]" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FFB21D]" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 p-3.5 bg-white">
          <div className="mb-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-2.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Building2 className="h-3.5 w-3.5 text-[#FFB21D]" />
              <span>Settlement Account</span>
            </div>
            <div className="mt-1 text-slate-500 text-[11px]">
              {activeSchool?.bankName}: <span className="font-mono text-slate-900 font-bold">{activeSchool?.accountNumber}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold"
            onClick={() => {
              logout();
              navigate("/school/login");
            }}
          >
            <LogOut className="mr-2 h-3.5 w-3.5" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </Button>
            <h1 className="text-base font-black text-slate-950 sm:text-lg">{title}</h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {action}
            <span className="hidden sm:inline font-bold text-slate-600">
              {activeSchool?.name}
            </span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-[11px] gap-1">
              <CheckCircle2 className="h-3 w-3 inline" /> Active Institution
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
