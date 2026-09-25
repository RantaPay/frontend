import { useEffect, useState, useCallback } from "react";
import { syncBackendSchoolData, syncBackendSchoolRecord, Student, Payment } from "./store";
import { apiGet } from "./api";

export interface BackendStudentDTO {
  id: string;
  schoolId: string;
  admissionNumber: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  totalFees: number;
  paidAmount: number;
}

export interface BackendPaymentDTO {
  id: string;
  studentId?: string;
  receiptNumber: string;
  amount: number;
  method: "Card" | "Bank Transfer" | "USSD" | "WhatsApp";
  reference: string;
  status: "Successful" | "Pending" | "Failed";
  date: string;
  payerEmail?: string;
  payerPhone?: string;
  studentName: string;
  studentAdmission: string;
  className: string;
}

export interface DashboardData {
  school: any;
  stats: {
    totalStudents: number;
    totalBilled: number;
    totalCollected: number;
    totalOutstanding: number;
    collectionRate: number;
    paidCount: number;
    partialCount: number;
    unpaidCount: number;
  };
  categoryBreakdown: Array<{ name: string; amount: number }>;
  classDebtList: Array<{
    className: string;
    billed: number;
    collected: number;
    debt: number;
    studentCount: number;
  }>;
}

/**
 * Fetches real students, payments, and dashboard metrics from PostgreSQL backend
 */
export async function fetchAndSyncSchool(schoolId: string): Promise<DashboardData | null> {
  if (!schoolId) return null;

  try {
    const [dashboardRes, studentsRes, paymentsRes] = await Promise.all([
      apiGet(`/api/school/${schoolId}/dashboard`),
      apiGet(`/api/school/${schoolId}/students`),
      apiGet(`/api/school/${schoolId}/payments`),
    ]);

    let dashboardData: DashboardData | null = null;
    if (dashboardRes.success && dashboardRes.data) {
      dashboardData = dashboardRes.data as DashboardData;
      if (dashboardRes.data.school) {
        syncBackendSchoolRecord(dashboardRes.data.school);
      }
    }

    if (studentsRes.success && Array.isArray(studentsRes.data)) {
      const students: Student[] = studentsRes.data.map((s: BackendStudentDTO) => ({
        id: s.id,
        schoolId: s.schoolId,
        admissionNumber: s.admissionNumber,
        name: s.name,
        className: s.className,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        parentEmail: s.parentEmail,
        paid: s.paidAmount ?? 0,
        fees: [
          {
            category: "Tuition",
            amount: s.totalFees ?? 0,
            title: "Tuition & Standard Levies",
          },
        ],
      }));

      const payments: Payment[] = (paymentsRes.success && Array.isArray(paymentsRes.data)
        ? paymentsRes.data
        : []
      ).map((p: BackendPaymentDTO) => ({
        id: p.id,
        receiptNumber: p.receiptNumber,
        schoolId,
        studentId: p.studentId || p.id,
        studentName: p.studentName,
        studentAdmission: p.studentAdmission,
        className: p.className,
        amount: p.amount,
        method: p.method,
        reference: p.reference,
        date: p.date,
        payerEmail: p.payerEmail,
        payerPhone: p.payerPhone,
        status: p.status,
        items: [
          {
            title: `Tuition Settlement (${p.studentName})`,
            category: "Tuition",
            amount: p.amount,
          },
        ],
      }));

      syncBackendSchoolData(schoolId, students, payments);
    }

    return dashboardData;
  } catch (err) {
    console.warn("Could not sync school from backend, using current store state:", err);
    return null;
  }
}

/**
 * Event-based helper to notify all open school dashboard components to refetch
 */
export function notifySchoolDataUpdated(schoolId?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("rantapay:school_updated", { detail: { schoolId } })
    );
  }
}

/**
 * React hook to keep school dashboard components in live sync with PostgreSQL backend
 */
export function useSchoolLiveSync(schoolId: string) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const sync = useCallback(async () => {
    if (!schoolId) return;
    setIsSyncing(true);
    const data = await fetchAndSyncSchool(schoolId);
    if (data) {
      setDashboardData(data);
    }
    setIsSyncing(false);
  }, [schoolId]);

  useEffect(() => {
    sync();

    const handleEvent = (e: any) => {
      if (!e.detail?.schoolId || e.detail.schoolId === schoolId) {
        sync();
      }
    };

    window.addEventListener("rantapay:school_updated", handleEvent);
    return () => window.removeEventListener("rantapay:school_updated", handleEvent);
  }, [schoolId, sync]);

  return { isSyncing, refetch: sync, dashboardData };
}
