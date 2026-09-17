import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Student } from "@/lib/store";

export interface StudentFormData {
  admissionNumber: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  tuition: number;
  books: number;
  uniform: number;
}

interface StudentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Student | null;
  form: StudentFormData;
  onFormChange: (form: StudentFormData) => void;
  onSave: () => void;
}

export function StudentFormModal({
  open,
  onOpenChange,
  editing,
  form,
  onFormChange,
  onSave,
}: StudentFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {editing ? "Edit Student Profile" : "Enroll New Student"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Admission Number *</Label>
              <Input
                value={form.admissionNumber}
                onChange={(e) =>
                  onFormChange({ ...form, admissionNumber: e.target.value })
                }
                placeholder="AMC/2025/001"
                className="mt-1 h-9 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <Label className="text-xs">Student Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => onFormChange({ ...form, name: e.target.value })}
                placeholder="e.g. Chiamaka Okeke"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Current Class *</Label>
            <Input
              value={form.className}
              onChange={(e) => onFormChange({ ...form, className: e.target.value })}
              placeholder="e.g. JSS 2A, Primary 4B, SSS 1"
              className="mt-1 h-9 rounded-lg text-xs"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Parent/Guardian Name</Label>
              <Input
                value={form.parentName}
                onChange={(e) =>
                  onFormChange({ ...form, parentName: e.target.value })
                }
                placeholder="e.g. Mr. Chukwudi Okeke"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Parent Phone Number</Label>
              <Input
                value={form.parentPhone}
                onChange={(e) =>
                  onFormChange({ ...form, parentPhone: e.target.value })
                }
                placeholder="+234 800 000 0000"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Parent Email (for instant receipts)</Label>
            <Input
              value={form.parentEmail}
              onChange={(e) =>
                onFormChange({ ...form, parentEmail: e.target.value })
              }
              placeholder="parent@example.com"
              className="mt-1 h-9 rounded-lg text-xs"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
            <span className="font-bold text-slate-800 text-xs">
              Assigned Fees for Active Term (₦)
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-[11px]">Tuition (₦)</Label>
                <Input
                  type="number"
                  value={form.tuition}
                  onChange={(e) =>
                    onFormChange({ ...form, tuition: Number(e.target.value) || 0 })
                  }
                  className="mt-1 h-8 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <Label className="text-[11px]">Textbooks (₦)</Label>
                <Input
                  type="number"
                  value={form.books}
                  onChange={(e) =>
                    onFormChange({ ...form, books: Number(e.target.value) || 0 })
                  }
                  className="mt-1 h-8 rounded-lg text-xs bg-white"
                />
              </div>
              <div>
                <Label className="text-[11px]">Uniform (₦)</Label>
                <Input
                  type="number"
                  value={form.uniform}
                  onChange={(e) =>
                    onFormChange({ ...form, uniform: Number(e.target.value) || 0 })
                  }
                  className="mt-1 h-8 rounded-lg text-xs bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="rounded-full bg-[#0052FF] text-white font-bold text-xs"
          >
            {editing ? "Save Changes" : "Enroll Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
