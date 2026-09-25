import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  useStore,
  updateSchool,
  logout,
  useSuperAdminAuth,
  School,
  syncBackendSchools,
} from "@/lib/store";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import {
  Building2,
  ShieldCheck,
  Plus,
  ExternalLink,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AdminMetricsGrid } from "@/components/admin/AdminMetricsGrid";
import { OnboardSchoolModal, SchoolFormData } from "@/components/admin/OnboardSchoolModal";
import { IntegrationRequestsTable } from "@/components/admin/IntegrationRequestsTable";

const BANK_CODES: Record<string, string> = {
  "Zenith Bank": "057",
  "Guaranty Trust Bank": "058",
  "Access Bank": "044",
  "First Bank of Nigeria": "011",
  "United Bank for Africa": "033",
  "Fidelity Bank": "070",
  "Stanbic IBTC": "221",
  "Wema Bank": "035",
  "Kuda Bank": "50211",
  "OPay": "999992",
};

export default function AdminDashboard() {
  usePageTitle("Platform Control Room : Ranta Pay Super Admin");
  const { isSuperAdmin, ready } = useSuperAdminAuth();
  const navigate = useNavigate();

  const localSchools = useStore((s) => s.schools);
  const allStudents = useStore((s) => s.students);
  const allPayments = useStore((s) => s.payments);

  const [adminStats, setAdminStats] = useState<any>(null);
  const [backendSchools, setBackendSchools] = useState<School[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [statsRes, schoolsRes] = await Promise.all([
        apiGet("/api/admin/stats"),
        apiGet("/api/admin/schools"),
      ]);
      if (statsRes.success && statsRes.data) {
        setAdminStats(statsRes.data);
      }
      if (schoolsRes.success && Array.isArray(schoolsRes.data)) {
        setBackendSchools(schoolsRes.data);
        syncBackendSchools(schoolsRes.data);
      }
    } catch (err) {
      console.warn("Could not fetch remote admin metrics:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdminData();
    }
  }, [isSuperAdmin, loadAdminData]);

  if (ready && !isSuperAdmin) {
    navigate("/admin/login");
    return null;
  }

  const schools = backendSchools.length > 0 ? backendSchools : localSchools;

  const totalVolume = useMemo(() => {
    return allPayments.reduce((acc, p) => acc + p.amount, 0);
  }, [allPayments]);

  const platformRevenue = useMemo(() => {
    return Math.round(totalVolume * 0.015);
  }, [totalVolume]);

  const handleResolveAndOnboard = async (formData: SchoolFormData) => {
    if (!formData.name.trim() || !formData.accountNumber.trim()) {
      toast.error("Please fill school name and 10-digit NUBAN account number.");
      return;
    }
    if (formData.accountNumber.length < 10) {
      toast.error("Bank account number must be at least 10 digits.");
      return;
    }

    setIsResolving(true);
    let resolvedAccountName = formData.accountName.trim();
    const bankCode = BANK_CODES[formData.bankName] || "058";

    try {
      const resolveRes = await apiPost("/api/admin/schools/resolve-bank", {
        accountNumber: formData.accountNumber.trim(),
        bankCode,
      });
      if (resolveRes.success && resolveRes.data?.account_name) {
        resolvedAccountName = resolveRes.data.account_name;
      }
    } catch {
      // Continue with provided account name if verification service is unavailable
    }

    const payload = {
      name: formData.name.trim(),
      slug:
        formData.slug.trim() ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      address: formData.address.trim() || "Lagos, Nigeria",
      phone: formData.phone.trim() || "+2348000000000",
      email: formData.email.trim() || `info@${formData.slug || "school"}.ng`,
      principal: formData.principal.trim() || "Head of School",
      bankName: formData.bankName,
      accountNumber: formData.accountNumber.trim(),
      accountName: resolvedAccountName || `${formData.name.toUpperCase()} ENTERPRISES LTD`,
      session: formData.session || "2025/2026",
      term: formData.term || "First Term",
    };

    try {
      const res = await apiPost("/api/admin/schools", payload);
      if (res.success && res.data) {
        toast.success(
          `${res.data.name} onboarded successfully! Direct settlement subaccount provisioned.`
        );
        setOnboardOpen(false);
        await loadAdminData();
      } else {
        toast.error(res.error || "Failed to onboard school.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to onboard school.");
    } finally {
      setIsResolving(false);
    }
  };

  const toggleSchoolStatus = async (s: School) => {
    const nextStatus = s.status === "Active" ? "Suspended" : "Active";
    try {
      const res = await apiPatch(`/api/admin/schools/${s.id}/status`, { status: nextStatus });
      if (res.success) {
        toast.info(`${s.name} status updated to ${nextStatus}`);
        updateSchool(s.id, { status: nextStatus });
        await loadAdminData();
      } else {
        toast.error(res.error || "Failed to update school status.");
      }
    } catch (err: any) {
      toast.error(err.message || "Network error updating status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Super Admin Nav */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo showText size="md" />
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase">
              Central Engine Control
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => loadAdminData()}
              variant="outline"
              size="sm"
              disabled={loadingData}
              className="rounded-full text-xs"
              title="Refresh platform metrics"
            >
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {/* Metric Cards Grid */}
        <AdminMetricsGrid
          totalSchools={adminStats?.totalSchools ?? schools.length}
          totalStudents={adminStats?.totalStudents ?? allStudents.length}
          totalVolume={adminStats?.totalGmv ?? totalVolume}
          platformRevenue={adminStats?.platformCommission ?? platformRevenue}
        />

        {/* Institution Integration Requests Table */}
        <IntegrationRequestsTable onOnboardRequest={() => setOnboardOpen(true)} />

        {/* Partner Schools Table */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-pixpay-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registered Partner Schools</h2>
              <p className="text-xs text-slate-500">
                Direct verified settlement accounts with automated payment routing.
              </p>
            </div>
            <Button
              onClick={() => setOnboardOpen(true)}
              className="rounded-full bg-[#0052FF] px-5 text-xs font-bold text-white shadow-md hover:bg-[#0047E0]"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Onboard School
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">School & Slug</th>
                  <th className="py-3 px-4">School Bank Account</th>
                  <th className="py-3 px-4">Settlement Code</th>
                  <th className="py-3 px-4">Session/Term</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schools.map((school) => {
                  const studentCount = allStudents.filter((st) => st.schoolId === school.id).length;
                  return (
                    <tr key={school.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{school.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          /pay/{school.slug} ({studentCount} students)
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{school.accountName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {school.bankName} • {school.accountNumber}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {school.paystackSubaccountCode}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {school.session} : {school.term}
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          className={
                            school.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                              : "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                          }
                        >
                          {school.status}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => toggleSchoolStatus(school)}
                          className="rounded-full px-3 py-1 text-[11px] font-bold border border-slate-200 hover:bg-slate-100 text-slate-700"
                        >
                          {school.status === "Active" ? "Suspend" : "Activate"}
                        </button>

                        <a
                          href={`/pay/${school.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-[#0052FF] px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-[#0047E0]"
                        >
                          Portal <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Onboard School Modal */}
      <OnboardSchoolModal
        open={onboardOpen}
        onOpenChange={setOnboardOpen}
        onSubmit={handleResolveAndOnboard}
        isResolving={isResolving}
      />
    </div>
  );
}
