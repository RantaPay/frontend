import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Search,
  Users,
  Filter,
  X,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  useStore,
  totalFees,
  balance,
  statusOf,
  formatNaira,
  Student,
  addStudent,
} from "@/lib/store";
import { useSchoolLiveSync, notifySchoolDataUpdated } from "@/lib/school-sync";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import { toast } from "sonner";
import { StudentFormModal, StudentFormData } from "@/components/dashboard/StudentFormModal";

const emptyForm: StudentFormData = {
  admissionNumber: "",
  name: "",
  className: "",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  tuition: 0,
  books: 0,
  uniform: 0,
};

type FeeStatusFilter = "All" | "Owing" | "Unpaid" | "Partial" | "Paid";

export default function StudentsPage() {
  usePageTitle("Students Directory : Ranta Pay Bursar OS");
  const activeSchool = useStore((s) => s.settings);
  const allStudents = useStore((s) => s.students);
  const { isSyncing, refetch } = useSchoolLiveSync(activeSchool.id);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const students = useMemo(() => {
    return allStudents.filter((s) => s.schoolId === activeSchool.id);
  }, [allStudents, activeSchool]);

  // Filters State
  const [q, setQ] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [feeStatus, setFeeStatus] = useState<FeeStatusFilter>("All");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  // Derive sorted unique class list from school students
  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.className))).sort();
    return list;
  }, [students]);

  // Aggregate statistics for quick overview and filter pills
  const stats = useMemo(() => {
    let owingCount = 0;
    let totalOwingAmount = 0;
    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;
    const classCounts: Record<string, number> = {};

    students.forEach((s) => {
      classCounts[s.className] = (classCounts[s.className] || 0) + 1;
      const bal = balance(s);
      const st = statusOf(s);

      if (bal > 0) {
        owingCount += 1;
        totalOwingAmount += bal;
      }
      if (st === "Paid") paidCount += 1;
      else if (st === "Partial") partialCount += 1;
      else unpaidCount += 1;
    });

    return {
      owingCount,
      totalOwingAmount,
      paidCount,
      partialCount,
      unpaidCount,
      classCounts,
    };
  }, [students]);

  // Filtered student list based on search, class, and fee status
  const filtered = useMemo(() => {
    return students.filter((s) => {
      // 1. Class filter
      if (selectedClass !== "All" && s.className !== selectedClass) {
        return false;
      }

      // 2. Fee status filter
      const bal = balance(s);
      const st = statusOf(s);
      if (feeStatus === "Owing" && bal <= 0) {
        return false;
      }
      if (feeStatus === "Unpaid" && st !== "Unpaid") {
        return false;
      }
      if (feeStatus === "Partial" && st !== "Partial") {
        return false;
      }
      if (feeStatus === "Paid" && st !== "Paid") {
        return false;
      }

      // 3. Search query filter
      if (q.trim()) {
        const query = q.trim().toLowerCase();
        const matches = [
          s.admissionNumber,
          s.name,
          s.className,
          s.parentName,
          s.parentPhone,
          s.parentEmail || "",
        ]
          .join(" ")
          .toLowerCase();
        if (!matches.includes(query)) return false;
      }

      return true;
    });
  }, [students, selectedClass, feeStatus, q]);

  // Total debt in currently filtered view
  const filteredTotalOwing = useMemo(() => {
    return filtered.reduce((sum, s) => sum + balance(s), 0);
  }, [filtered]);

  const hasActiveFilters = q.trim() !== "" || selectedClass !== "All" || feeStatus !== "All";

  const clearFilters = () => {
    setQ("");
    setSelectedClass("All");
    setFeeStatus("All");
  };

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (s: Student) => {
    setEditing(s);
    setForm({
      admissionNumber: s.admissionNumber,
      name: s.name,
      className: s.className,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      parentEmail: s.parentEmail || "",
      tuition: s.fees.find((f) => f.category === "Tuition")?.amount ?? 0,
      books: s.fees.find((f) => f.category === "Books")?.amount ?? 0,
      uniform: s.fees.find((f) => f.category === "Uniform")?.amount ?? 0,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.admissionNumber.trim() || !form.name.trim() || !form.className.trim()) {
      return toast.error("Please fill in admission number, student name, and class.");
    }
    const totalFees =
      (Number(form.tuition) || 0) + (Number(form.books) || 0) + (Number(form.uniform) || 0);

    setIsSaving(true);
    try {
      if (editing) {
        await apiPut(`/api/school/${activeSchool.id}/students/${editing.id}`, {
          admissionNumber: form.admissionNumber.trim(),
          name: form.name.trim(),
          className: form.className.trim(),
          parentName: form.parentName.trim(),
          parentPhone: form.parentPhone.trim(),
          parentEmail: form.parentEmail.trim() || null,
          totalFees,
        });
        toast.success("Student updated successfully.");
      } else {
        await apiPost(`/api/school/${activeSchool.id}/students`, {
          schoolId: activeSchool.id,
          admissionNumber: form.admissionNumber.trim(),
          name: form.name.trim(),
          className: form.className.trim(),
          parentName: form.parentName.trim(),
          parentPhone: form.parentPhone.trim(),
          parentEmail: form.parentEmail.trim() || null,
          totalFees,
        });
        toast.success("New student enrolled successfully.");
      }
      setOpen(false);
      notifySchoolDataUpdated(activeSchool.id);
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save student.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to remove ${student.name} from the school directory?`)) {
      return;
    }
    setDeletingId(student.id);
    try {
      await apiDelete(`/api/school/${activeSchool.id}/students/${student.id}`);
      toast.success(`${student.name} removed from roster.`);
      notifySchoolDataUpdated(activeSchool.id);
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove student.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkUploadDemo = () => {
    const schoolPrefix = activeSchool?.name
      ? activeSchool.name
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .slice(0, 3)
          .toUpperCase()
      : "SCH";
    addStudent({
      schoolId: activeSchool.id,
      admissionNumber: `${schoolPrefix}/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
      name: "Ibrahim Danjuma",
      className: "JSS 2A",
      parentName: "Mallam Danjuma",
      parentPhone: "+2348088889999",
      parentEmail: "danjuma.parent@gmail.com",
      fees: [
        { category: "Tuition", amount: 120000, title: "Term Tuition" },
        { category: "Books", amount: 25000, title: "Curriculum Books" },
      ],
    });
    setCsvModalOpen(false);
    toast.success("Bulk CSV roster processed: Added new students to active session.");
  };

  return (
    <DashboardShell title="Students Directory">
      <div className="space-y-5">
        {/* Quick Filter Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-0.5">
          <button
            type="button"
            onClick={() => setFeeStatus("All")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              feeStatus === "All"
                ? "bg-[#0F172A] text-white ring-2 ring-[#0F172A]/30"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>All Students</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                feeStatus === "All" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {students.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeeStatus("Owing")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              feeStatus === "Owing"
                ? "bg-rose-600 text-white ring-2 ring-rose-500/30"
                : "bg-white text-rose-700 border border-rose-200 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            <span>Owing Fees (Debtors)</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                feeStatus === "Owing" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-800"
              }`}
            >
              {stats.owingCount}
            </span>
            {stats.totalOwingAmount > 0 && (
              <span className="hidden sm:inline text-[10px] opacity-85">
                • {formatNaira(stats.totalOwingAmount)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFeeStatus("Unpaid")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              feeStatus === "Unpaid"
                ? "bg-red-700 text-white ring-2 ring-red-600/30"
                : "bg-white text-red-700 border border-red-200 hover:bg-red-50"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <span>Completely Unpaid</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                feeStatus === "Unpaid" ? "bg-white/20 text-white" : "bg-red-100 text-red-800"
              }`}
            >
              {stats.unpaidCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeeStatus("Partial")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              feeStatus === "Partial"
                ? "bg-amber-600 text-white ring-2 ring-amber-500/30"
                : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span>Partially Paid</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                feeStatus === "Partial" ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
              }`}
            >
              {stats.partialCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFeeStatus("Paid")}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all shadow-sm ${
              feeStatus === "Paid"
                ? "bg-emerald-600 text-white ring-2 ring-emerald-500/30"
                : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Fully Cleared</span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                feeStatus === "Paid" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {stats.paidCount}
            </span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <Card className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Filter Dropdowns & Search */}
            <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Search Box */}
              <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, admission no, phone..."
                  className="h-9.5 pl-10 pr-8 rounded-xl text-xs border-slate-200 bg-slate-50/50 focus:bg-white"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Class Filter Dropdown */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                <select
                  aria-label="Filter by Class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:bg-white"
                >
                  <option value="All">All Classes ({students.length})</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c} ({stats.classCounts[c] || 0} pupils)
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Status Dropdown */}
              <select
                aria-label="Filter by Payment Status"
                value={feeStatus}
                onChange={(e) => setFeeStatus(e.target.value as FeeStatusFilter)}
                className="h-9.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0052FF]/20 focus:bg-white"
              >
                <option value="All">All Fee Statuses</option>
                <option value="Owing">⚠️ Owing Fees (Hasn't cleared: {stats.owingCount})</option>
                <option value="Unpaid">❌ Completely Unpaid (0%: {stats.unpaidCount})</option>
                <option value="Partial">⏳ Partial Payment ({stats.partialCount})</option>
                <option value="Paid">✅ Fully Cleared ({stats.paidCount})</option>
              </select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-2.5"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset Filters
                </Button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCsvModalOpen(true)}
                className="h-9.5 rounded-xl text-xs font-semibold border-slate-200 hover:bg-slate-50"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Bulk CSV Upload
              </Button>
              <Button
                size="sm"
                onClick={startNew}
                className="h-9.5 rounded-xl bg-[#0052FF] text-xs font-bold text-white shadow-md hover:bg-[#0047E0]"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Student
              </Button>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-pixpay-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0052FF]" />
              <h3 className="font-bold text-slate-900 text-base">Enrolled Students Roster</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filtered.length}</strong> of{" "}
                <strong>{students.length}</strong> students
              </span>

              {filteredTotalOwing > 0 && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] font-bold">
                  Outstanding Debt in View: {formatNaira(filteredTotalOwing)}
                </Badge>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#0052FF] hover:underline ml-1"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Parent / Contact</th>
                  <th className="py-3 px-4">Total Fees</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => {
                  const tot = totalFees(s);
                  const bal = balance(s);
                  const st = statusOf(s);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {s.admissionNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] font-medium text-slate-500">{s.className}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{s.parentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.parentPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {formatNaira(tot)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-600">
                        {formatNaira(s.paid)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-rose-600">
                        {formatNaira(bal)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          className={
                            st === "Paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                              : st === "Partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                              : "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                          }
                        >
                          {st}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600"
                          title="Edit Student"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          disabled={deletingId === s.id}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 disabled:opacity-50"
                          title="Remove Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                          <Users className="h-6 w-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">No students matched your criteria</h4>
                        <p className="mt-1 text-xs text-slate-500">
                          {hasActiveFilters
                            ? "Try adjusting or clearing your class and fee status filters."
                            : "No students enrolled for this session yet."}
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="mt-3 rounded-full text-xs font-semibold"
                          >
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Clear All Filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Student Add/Edit Modal */}
      <StudentFormModal
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        form={form}
        onFormChange={setForm}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* CSV Bulk Import Demo Dialog */}
      <Dialog open={csvModalOpen} onOpenChange={setCsvModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Bulk Student CSV Roster Upload
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-xs text-slate-600 space-y-2">
            <p>
              Upload your Excel or CSV student list containing columns: AdmissionNumber,
              FullName, Class, ParentName, ParentPhone, TuitionAmount.
            </p>
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-400">
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <span className="font-semibold text-slate-600">Drag and drop student_roster.csv</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCsvModalOpen(false)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleBulkUploadDemo}
              className="rounded-full bg-[#0052FF] text-white font-bold text-xs"
            >
              Simulate CSV Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
