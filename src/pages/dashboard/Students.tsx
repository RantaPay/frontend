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
import { Plus, Pencil, Trash2, Upload, Search, Users } from "lucide-react";
import {
  useStore,
  totalFees,
  balance,
  statusOf,
  formatNaira,
  addStudent,
  updateStudent,
  deleteStudent,
  Student,
} from "@/lib/store";
import { useSchoolLiveSync } from "@/lib/school-sync";
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

export default function StudentsPage() {
  usePageTitle("Students Directory : Ranta Pay Bursar OS");
  const activeSchool = useStore((s) => s.settings);
  const allStudents = useStore((s) => s.students);
  useSchoolLiveSync(activeSchool.id);

  const students = useMemo(() => {
    return allStudents.filter((s) => s.schoolId === activeSchool.id);
  }, [allStudents, activeSchool]);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const filtered = students.filter((s) =>
    [s.admissionNumber, s.name, s.className, s.parentName, s.parentPhone, s.parentEmail || ""]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase())
  );

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

  const handleSave = () => {
    if (!form.admissionNumber.trim() || !form.name.trim() || !form.className.trim()) {
      return toast.error("Please fill in admission number, student name, and class.");
    }
    const fees = [
      { category: "Tuition", amount: Number(form.tuition) || 0, title: "Term Tuition" },
      { category: "Books", amount: Number(form.books) || 0, title: "Curriculum Books" },
      { category: "Uniform", amount: Number(form.uniform) || 0, title: "School Uniform" },
    ].filter((f) => f.amount > 0);

    if (editing) {
      updateStudent(editing.id, {
        admissionNumber: form.admissionNumber.trim(),
        name: form.name.trim(),
        className: form.className.trim(),
        parentName: form.parentName.trim(),
        parentPhone: form.parentPhone.trim(),
        parentEmail: form.parentEmail.trim() || undefined,
        fees,
      });
      toast.success("Student updated successfully.");
    } else {
      addStudent({
        schoolId: activeSchool.id,
        admissionNumber: form.admissionNumber.trim(),
        name: form.name.trim(),
        className: form.className.trim(),
        parentName: form.parentName.trim(),
        parentPhone: form.parentPhone.trim(),
        parentEmail: form.parentEmail.trim() || undefined,
        fees,
      });
      toast.success("New student added to school directory.");
    }
    setOpen(false);
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
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search student, class, or admission no..."
              className="h-10 pl-10 rounded-full text-xs border-slate-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCsvModalOpen(true)}
              className="rounded-full text-xs font-semibold"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Bulk CSV Upload
            </Button>
            <Button
              size="sm"
              onClick={startNew}
              className="rounded-full bg-[#0052FF] text-xs font-bold text-white shadow-md hover:bg-[#0047E0]"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Student
            </Button>
          </div>
        </div>

        {/* Students Table */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-pixpay-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0052FF]" />
              <h3 className="font-bold text-slate-900 text-base">Enrolled Students Roster</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filtered.length} of {students.length} students
            </span>
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
                        <div className="text-[11px] text-slate-400">{s.className}</div>
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
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${s.name}?`)) {
                              deleteStudent(s.id);
                              toast.info(`${s.name} removed from roster.`);
                            }
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
