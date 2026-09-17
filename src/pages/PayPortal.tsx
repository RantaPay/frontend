import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { PublicHeader } from "@/components/layout/PublicHeader";
import {
  Search,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  GraduationCap,
} from "lucide-react";
import {
  useStore,
  totalFees,
  balance,
  statusOf,
  formatNaira,
  School,
  Student,
} from "@/lib/store";

export default function PayPortal() {
  const { schoolSlug } = useParams<{ schoolSlug?: string }>();
  const schools = useStore((s) => s.schools.filter((x) => x.status === "Active"));
  const allStudents = useStore((s) => s.students);
  const nav = useNavigate();

  // Selected school state
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(() => {
    if (schoolSlug) {
      const match = schools.find((s) => s.slug === schoolSlug);
      if (match) return match.id;
    }
    return schools[0]?.id || "";
  });

  useEffect(() => {
    if (schoolSlug) {
      const match = schools.find((s) => s.slug === schoolSlug);
      if (match) setSelectedSchoolId(match.id);
    }
  }, [schoolSlug, schools]);

  const activeSchool: School | undefined = useMemo(() => {
    return schools.find((s) => s.id === selectedSchoolId) || schools[0];
  }, [schools, selectedSchoolId]);

  usePageTitle(
    activeSchool
      ? `Pay School Fees : ${activeSchool.name} | Ranta Pay`
      : "Pay School Fees : Ranta Pay"
  );

  const [studentQuery, setStudentQuery] = useState("");

  // Filter students for active school
  const schoolStudents = useMemo(() => {
    if (!activeSchool) return [];
    return allStudents.filter((s) => s.schoolId === activeSchool.id);
  }, [allStudents, activeSchool]);

  const searchResults = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return [];
    return schoolStudents.filter(
      (s) =>
        (s.admissionNumber || "").toLowerCase().includes(q) ||
        (s.name || "").toLowerCase().includes(q) ||
        (s.parentPhone || "").toLowerCase().includes(q)
    );
  }, [schoolStudents, studentQuery]);

  const hasSearched = studentQuery.trim().length > 0;
  const displayedStudents = hasSearched ? searchResults : [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col selection:bg-[#FFB21D] selection:text-white">
      {/* 1. Shared Unified Header */}
      <PublicHeader
        rightAction={
          <Button
            asChild
            variant="outline"
            className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-100 text-xs sm:text-sm font-bold px-4 py-2"
          >
            <Link to="/school/login">School Sign In</Link>
          </Button>
        }
      />

      {/* 2. Main Portal Container */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Title & Subtitle */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFB21D] bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/70 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Instant Parent Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mt-3">
            Pay School Fees & Supplies
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Look up your child by admission number, student name, or parent phone number to view term fees and pay directly.
          </p>
        </div>

        {/* School Selector Card */}
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#FFB21D] border border-amber-200/60">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Active School
                </span>
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {activeSchool?.name ?? "Select your institution"}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {activeSchool?.address.split(",")[1]?.trim() || activeSchool?.address}
                </div>
              </div>
            </div>

            <div className="sm:w-60">
              <Label htmlFor="school-select" className="text-[11px] font-medium text-slate-500 mb-1 block">
                Switch School
              </Label>
              <select
                id="school-select"
                value={selectedSchoolId}
                onChange={(e) => {
                  setSelectedSchoolId(e.target.value);
                  const chosen = schools.find((s) => s.id === e.target.value);
                  if (chosen) nav(`/pay/${chosen.slug}`);
                }}
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] focus:border-transparent transition-all"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeSchool && (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
              <span>{activeSchool.address}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">Session: {activeSchool.session}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">Term: {activeSchool.term}</span>
            </div>
          )}
        </Card>

        {/* Student Search Card */}
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5 mb-6">
          <Label htmlFor="search" className="text-xs sm:text-sm font-bold text-slate-800">
            Find Student Record
          </Label>
          <div className="relative mt-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              id="search"
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
              placeholder="e.g. AMC/2025/001, Chiamaka, or 08011112222"
              className="h-11 rounded-xl pl-10 pr-9 text-xs sm:text-sm border-slate-300 focus:ring-[#FFB21D]"
              autoFocus
            />
            {studentQuery && (
              <button
                type="button"
                onClick={() => setStudentQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Search by student admission number, full name, or registered parent phone number.
          </p>
        </Card>

        {/* Student Results List */}
        <div className="space-y-4">
          {!hasSearched ? (
            <Card className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-[#FFB21D] border border-amber-200/60 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Find Your Student's Term Invoice</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Enter your child's student admission number, name, or parent phone number in the search bar above to look up records.
              </p>
            </Card>
          ) : searchResults.length === 0 ? (
            <Card className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="mt-2 text-sm font-bold text-slate-900">No matching student found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No student matched "{studentQuery}" at {activeSchool?.name}. Please check the admission number or search with the parent's registered phone number.
              </p>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Search Results
                </h2>
                <span className="text-[11px] text-slate-400">
                  {displayedStudents.length} record{displayedStudents.length === 1 ? "" : "s"} found
                </span>
              </div>

              {displayedStudents.map((student: Student) => {
                const status = statusOf(student);
                const outstanding = balance(student);
                const total = totalFees(student);

                return (
                  <Card
                    key={student.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {student.name}
                          </h3>
                          <Badge
                            className={
                              status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold"
                                : status === "Partial"
                                ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold"
                                : "bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold"
                            }
                          >
                            {status === "Paid" ? (
                              <CheckCircle2 className="mr-1 h-3 w-3 inline" />
                            ) : (
                              <Clock className="mr-1 h-3 w-3 inline" />
                            )}
                            {status === "Paid" ? "Fully Cleared" : status === "Partial" ? "Partially Paid" : "Unpaid"}
                          </Badge>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Class: {student.className}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-700">Adm: {student.admissionNumber}</span>
                          <span>•</span>
                          <span>Parent: {student.parentName}</span>
                        </div>
                      </div>

                      <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                          Outstanding Balance
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 block">
                          {formatNaira(outstanding)}
                        </span>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          Total: {formatNaira(total)} | Paid: {formatNaira(student.paid)}
                        </span>
                      </div>
                    </div>

                    {/* Fee Items Breakdown Preview */}
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {student.fees.map((f) => (
                        <div
                          key={f.category + f.amount}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs"
                        >
                          <span className="font-medium text-slate-700">{f.title || f.category}</span>
                          <span className="font-bold text-slate-900">{formatNaira(f.amount)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action CTA */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-[#FFB21D]" />
                        <span>Direct clearance receipt issued instantly upon payment</span>
                      </div>

                      <Button
                        onClick={() => nav(`/pay/${activeSchool?.slug || "apex-college"}/${student.id}`)}
                        className="rounded-xl bg-[#FFB21D] hover:bg-[#EAA315] text-slate-950 font-bold text-xs sm:text-sm px-5 py-2 shadow-sm transition-all"
                      >
                        {outstanding > 0 ? "Select & Pay Fees" : "View Clearance Pass"}
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
