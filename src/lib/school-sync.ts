import { useEffect, useState, useCallback } from "react";
import { syncBackendSchoolData, Student, Payment } from "./store";

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

/**
 * Fetches real students and payments from PostgreSQL backend and syncs with school store
 */
export async function fetchAndSyncSchool(schoolId: string): Promise<boolean> {
  if (!schoolId) return false;

  try {
    const [studentsRes, paymentsRes] = await Promise.all([
      fetch(`/api/school/${schoolId}/students`).then((r) => r.json()),
      fetch(`/api/school/${schoolId}/payments`).then((r) => r.json()),
    ]);

    if (!studentsRes.success || !paymentsRes.success) {
      return false;
    }

    const students: Student[] = (studentsRes.data || []).map((s: BackendStudentDTO) => ({
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

    const payments: Payment[] = (paymentsRes.data || []).map((p: BackendPaymentDTO) => ({
      id: p.id,
      receiptNumber: p.receiptNumber,
      schoolId,
      studentId: p.studentId || p.id,
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
    return true;
  } catch (err) {
    console.warn("Could not sync school from backend, using current store state:", err);
    return false;
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

  const sync = useCallback(async () => {
    if (!schoolId) return;
    setIsSyncing(true);
    await fetchAndSyncSchool(schoolId);
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

  return { isSyncing, refetch: sync };
}
