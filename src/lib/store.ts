import { useSyncExternalStore } from "react";
import {
  FeeItem,
  StoreItem,
  Student,
  PaymentItem,
  Payment,
  School,
  SchoolSettings,
  NewsletterSubscriber,
  State,
} from "./types";
import {
  seedSchools,
  seedStudents,
  seedStoreItems,
  seedPayments,
  seedSubscribers,
} from "./seed-data";

export type {
  FeeItem,
  StoreItem,
  Student,
  PaymentItem,
  Payment,
  School,
  SchoolSettings,
  NewsletterSubscriber,
  State,
};

export {
  login,
  logout,
  useAuth,
  loginSuperAdmin,
  useSuperAdminAuth,
} from "./auth";

const KEY = "rantapay-state-v5";

function buildInitialState(): State {
  const schools = seedSchools;
  const activeSchoolId = schools[0]?.id || "sch-1";
  const activeSchool = schools.find((s) => s.id === activeSchoolId) || schools[0];

  return {
    schools,
    activeSchoolId,
    students: seedStudents,
    storeItems: seedStoreItems,
    payments: seedPayments,
    subscribers: seedSubscribers,
    settings: activeSchool,
  };
}

let memState: State = buildInitialState();
const listeners = new Set<() => void>();

function hydrateState(rawObj: Partial<State>): State {
  const rawSchools =
    rawObj.schools && Array.isArray(rawObj.schools) && rawObj.schools.length > 0
      ? rawObj.schools.filter(
          (s) =>
            s &&
            s.name &&
            !s.name.toLowerCase().includes("bright") &&
            !s.slug?.toLowerCase().includes("bright"),
        )
      : [];

  const schools = rawSchools.length > 0 ? rawSchools : seedSchools;
  const activeSchoolId =
    rawObj.activeSchoolId && schools.some((s) => s.id === rawObj.activeSchoolId)
      ? rawObj.activeSchoolId
      : schools[0].id;
  const activeSchool = schools.find((s) => s.id === activeSchoolId) || schools[0];

  const students =
    rawObj.students && Array.isArray(rawObj.students)
      ? rawObj.students.filter((st) => schools.some((sc) => sc.id === st.schoolId))
      : seedStudents;
  const storeItems =
    rawObj.storeItems && Array.isArray(rawObj.storeItems) ? rawObj.storeItems : seedStoreItems;
  const payments =
    rawObj.payments && Array.isArray(rawObj.payments) ? rawObj.payments : seedPayments;
  const subscribers =
    rawObj.subscribers && Array.isArray(rawObj.subscribers) ? rawObj.subscribers : seedSubscribers;

  return {
    schools,
    activeSchoolId,
    students,
    storeItems,
    payments,
    subscribers,
    settings: activeSchool,
  };
}

function clearLegacyKeys() {
  if (typeof window === "undefined") return;
  ["rantapay-state-v1", "rantapay-state-v2", "rantapay-state-v3", "rantapay-state-v4"].forEach((k) => {
    try { localStorage.removeItem(k); } catch {}
  });
}

function load(): State {
  if (typeof window === "undefined") {
    return memState;
  }
  clearLegacyKeys();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      memState = hydrateState(parsed);
      return memState;
    }
  } catch {}
  memState = buildInitialState();
  try {
    localStorage.setItem(KEY, JSON.stringify(memState));
  } catch {}
  return memState;
}

if (typeof window !== "undefined") {
  load();
}

function persist() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(memState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

export function getState(): State {
  return memState;
}

export function setState(updater: (s: State) => State) {
  memState = updater(memState);
  const active = memState.schools.find((s) => s.id === memState.activeSchoolId) || memState.schools[0];
  memState = { ...memState, settings: active };
  persist();
}

export function resetToSeed() {
  clearLegacyKeys();
  memState = buildInitialState();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(memState));
    } catch {}
  }
  listeners.forEach((l) => l());
}

function subscribeStore(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useStore<T>(selector: (s: State) => T): T {
  const rootState = useSyncExternalStore(subscribeStore, getState, getState);
  try {
    return selector(rootState);
  } catch (err) {
    console.error("useStore selector fallback triggered:", err);
    return selector(memState);
  }
}
useStore.getState = getState;

// Domain Calculation Helpers
export function totalFees(s: Student): number {
  if (!s || !s.fees) return 0;
  return s.fees.reduce((a, b) => a + b.amount, 0);
}

export function balance(s: Student): number {
  if (!s) return 0;
  return Math.max(0, totalFees(s) - (s.paid || 0));
}

export function statusOf(s: Student): "Paid" | "Partial" | "Unpaid" {
  if (!s) return "Unpaid";
  const tot = totalFees(s);
  if (s.paid <= 0) return "Unpaid";
  if (s.paid >= tot) return "Paid";
  return "Partial";
}

export function formatNaira(n: number): string {
  if (typeof n !== "number" || isNaN(n)) return "₦0";
  return "₦" + n.toLocaleString("en-NG");
}

// School & Multi-Tenancy Actions
export function setActiveSchool(schoolId: string) {
  setState((st) => ({
    ...st,
    activeSchoolId: schoolId,
  }));
}

export function addSchool(
  school: Omit<School, "id" | "createdAt" | "status" | "paystackSubaccountCode"> &
    Partial<Pick<School, "id" | "createdAt" | "status" | "paystackSubaccountCode">>
): School {
  const id = school.id || "sch-" + Date.now();
  const paystackSubaccountCode =
    school.paystackSubaccountCode || "ACCT_" + Math.random().toString(36).slice(2, 12);
  const newSchool: School = {
    ...school,
    id,
    paystackSubaccountCode,
    status: school.status || "Active",
    createdAt: school.createdAt || new Date().toISOString(),
  };

  setState((st) => ({
    ...st,
    schools: [...st.schools.filter((s) => s.id !== id), newSchool],
    activeSchoolId: id,
    settings: newSchool,
  }));

  return newSchool;
}

export function updateSchool(id: string, patch: Partial<School>) {
  setState((st) => ({
    ...st,
    schools: st.schools.map((s) => (s.id === id ? { ...s, ...patch } : s)),
  }));
}

export function updateSettings(patch: Partial<School>) {
  setState((st) => ({
    ...st,
    schools: st.schools.map((s) => (s.id === st.activeSchoolId ? { ...s, ...patch } : s)),
  }));
}

// Student CRUD Actions
export function addStudent(s: Omit<Student, "id" | "paid">) {
  const wemaAccountNumber =
    s.wemaAccountNumber || "012" + Math.floor(1000000 + Math.random() * 9000000).toString();
  const wemaAccountName = s.wemaAccountName || `APEX - ${s.name.toUpperCase()}`;

  setState((st) => ({
    ...st,
    students: [
      ...st.students,
      {
        ...s,
        id: "s" + Date.now(),
        paid: 0,
        wemaAccountNumber,
        wemaAccountName,
        wemaBankName: "Wema Bank",
        dvaStatus: "Active",
      },
    ],
  }));
}

export function updateStudent(id: string, patch: Partial<Student>) {
  setState((st) => ({
    ...st,
    students: st.students.map((x) => (x.id === id ? { ...x, ...patch } : x)),
  }));
}

export function deleteStudent(id: string) {
  setState((st) => ({ ...st, students: st.students.filter((x) => x.id !== id) }));
}

// School Store Items Actions
export function addStoreItem(item: Omit<StoreItem, "id">) {
  setState((st) => ({
    ...st,
    storeItems: [...st.storeItems, { ...item, id: "item-" + Date.now() }],
  }));
}

export function updateStoreItem(id: string, patch: Partial<StoreItem>) {
  setState((st) => ({
    ...st,
    storeItems: st.storeItems.map((i) => (i.id === id ? { ...i, ...patch } : i)),
  }));
}

export function deleteStoreItem(id: string) {
  setState((st) => ({
    ...st,
    storeItems: st.storeItems.filter((i) => i.id !== id),
  }));
}

// Newsletter Subscription
export function subscribeNewsletter(
  schoolId: string,
  admissionNumber: string,
  guardianEmail: string,
  guardianPhone: string
): NewsletterSubscriber {
  const sub: NewsletterSubscriber = {
    id: "sub-" + Date.now(),
    schoolId,
    admissionNumber: admissionNumber.trim().toUpperCase(),
    guardianEmail: guardianEmail.trim().toLowerCase(),
    guardianPhone: guardianPhone.trim(),
    createdAt: new Date().toISOString(),
  };

  setState((st) => ({
    ...st,
    subscribers: [
      sub,
      ...st.subscribers.filter(
        (x) => x.admissionNumber !== sub.admissionNumber || x.guardianEmail !== sub.guardianEmail
      ),
    ],
  }));

  return sub;
}

// Payment Recording
export function recordPayment(
  studentId: string,
  amount: number,
  method: Payment["method"],
  options?: {
    id?: string;
    receiptNumber?: string;
    reference?: string;
    payerEmail?: string;
    payerPhone?: string;
    items?: PaymentItem[];
    schoolId?: string;
  }
): Payment {
  const receiptNumber = options?.receiptNumber || "RCPT-" + Math.floor(100000 + Math.random() * 900000);
  const reference = options?.reference || "TRX-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  const st = getState();
  const student = st.students.find((s) => s.id === studentId);
  const schoolId = options?.schoolId || student?.schoolId || st.activeSchoolId;

  const payment: Payment = {
    id: options?.id || "p" + Date.now(),
    receiptNumber,
    schoolId,
    studentId,
    amount,
    method,
    reference,
    payerEmail: options?.payerEmail,
    payerPhone: options?.payerPhone,
    items: options?.items,
    date: new Date().toISOString(),
    status: "Successful",
  };

  setState((state) => ({
    ...state,
    payments: [payment, ...state.payments],
    students: state.students.map((s) =>
      s.id === studentId ? { ...s, paid: s.paid + amount } : s
    ),
  }));

  return payment;
}

export function syncBackendSchoolRecord(school: School) {
  if (!school || !school.id) return;
  setState((state) => {
    const existingIndex = state.schools.findIndex(
      (s) => s.id === school.id || s.slug === school.slug
    );
    const newSchools = [...state.schools];
    if (existingIndex >= 0) {
      newSchools[existingIndex] = { ...newSchools[existingIndex], ...school };
    } else {
      newSchools.push(school);
    }
    return {
      ...state,
      schools: newSchools,
      activeSchoolId: school.id,
      settings: school,
    };
  });
}

export function syncBackendSchools(incomingSchools: School[]) {
  if (!incomingSchools || incomingSchools.length === 0) return;
  setState((state) => {
    const active =
      incomingSchools.find((s) => s.id === state.activeSchoolId || s.slug === state.activeSchoolId) ||
      incomingSchools[0];
    return {
      ...state,
      schools: incomingSchools,
      activeSchoolId: active.id,
      settings: active,
    };
  });
}

export function syncBackendSchoolData(
  schoolId: string,
  backendStudents: Student[],
  backendPayments: Payment[]
) {
  if (!schoolId) return;
  setState((state) => {
    const otherStudents = state.students.filter((s) => s.schoolId !== schoolId);
    const otherPayments = state.payments.filter((p) => p.schoolId !== schoolId);
    return {
      ...state,
      students: [...otherStudents, ...backendStudents],
      payments: [...backendPayments, ...otherPayments],
    };
  });
}