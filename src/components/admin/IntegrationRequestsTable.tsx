import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export interface IntegrationRequestItem {
  id: string;
  requestNumber: string;
  schoolName: string;
  schoolType: string;
  state: string;
  address: string;
  studentCount: string;
  contactPerson: string;
  contactRole: string;
  email: string;
  phone: string;
  currentMethod: string;
  notes: string | null;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  createdAt: string;
}

interface IntegrationRequestsTableProps {
  onOnboardRequest?: (req: IntegrationRequestItem) => void;
}

export function IntegrationRequestsTable({ onOnboardRequest }: IntegrationRequestsTableProps) {
  const [requests, setRequests] = useState<IntegrationRequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/integration-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data?.data || []);
      }
    } catch {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, nextStatus: IntegrationRequestItem["status"]) => {
    try {
      const res = await fetch(`/api/admin/integration-requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
        );
        toast.success(`Application status updated to ${nextStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Network error updating status");
    }
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Institution Integration Requests</h2>
            {pendingCount > 0 ? (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-bold">
                {pendingCount} Pending Review
              </Badge>
            ) : (
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs font-medium">
                All Cleared
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming institutional applications requiring manual phone & document verification prior to portal live activation.
          </p>
        </div>

        <Button
          onClick={fetchRequests}
          variant="outline"
          size="sm"
          className="rounded-full text-xs text-slate-600"
          disabled={loading}
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Requests
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        {requests.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            <ShieldCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            No integration requests pending. Schools can submit from the public portal.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
              <tr>
                <th className="py-3 px-4">Ref & School</th>
                <th className="py-3 px-4">Location & Size</th>
                <th className="py-3 px-4">Admin Contact</th>
                <th className="py-3 px-4">Current System</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {req.requestNumber}
                    </span>
                    <div className="font-bold text-slate-900 mt-1">{req.schoolName}</div>
                    <div className="text-[11px] text-slate-400">{req.schoolType}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{req.state}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{req.address}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {req.studentCount}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{req.contactPerson}</div>
                    <div className="text-[11px] text-slate-500">{req.contactRole}</div>
                    <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3 text-slate-400" /> {req.phone}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" /> {req.email}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-slate-700 font-medium">{req.currentMethod}</div>
                    {req.notes && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        "{req.notes}"
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <Badge
                      className={
                        req.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                          : req.status === "Contacted"
                          ? "bg-blue-50 text-blue-700 border-blue-200 text-[10px]"
                          : req.status === "Rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                          : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-right space-x-1.5">
                    {req.status === "Pending" && (
                      <button
                        onClick={() => updateStatus(req.id, "Contacted")}
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-100 text-slate-700"
                      >
                        Mark Contacted
                      </button>
                    )}

                    {onOnboardRequest && req.status !== "Approved" && (
                      <button
                        onClick={() => {
                          onOnboardRequest(req);
                          updateStatus(req.id, "Approved");
                        }}
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-[#0F172A] hover:bg-slate-800 text-white shadow-xs inline-flex items-center gap-1"
                      >
                        Onboard <ArrowUpRight className="h-3 w-3" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
