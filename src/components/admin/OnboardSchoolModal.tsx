import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { School } from "@/lib/store";

const NIGERIAN_BANKS = [
  "Zenith Bank",
  "Guaranty Trust Bank",
  "Access Bank",
  "First Bank of Nigeria",
  "United Bank for Africa",
  "Fidelity Bank",
  "Stanbic IBTC",
  "Wema Bank",
  "Kuda Bank",
  "OPay",
];

export interface SchoolFormData {
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  receiptFooter: string;
  session: string;
  term: string;
  allowPartial: boolean;
}

interface OnboardSchoolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: SchoolFormData) => Promise<void>;
  isResolving: boolean;
}

const defaultForm: SchoolFormData = {
  name: "",
  slug: "",
  address: "",
  phone: "",
  email: "",
  principal: "",
  bankName: "Zenith Bank",
  accountNumber: "",
  accountName: "",
  receiptFooter: "Official clearance receipt. Retain for gate pass.",
  session: "2025/2026",
  term: "First Term",
  allowPartial: true,
};

export function OnboardSchoolModal({
  open,
  onOpenChange,
  onSubmit,
  isResolving,
}: OnboardSchoolModalProps) {
  const [form, setForm] = useState<SchoolFormData>(defaultForm);

  const handleSlugGen = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    setForm(defaultForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Onboard New School to Platform
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">School Name *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => handleSlugGen(e.target.value)}
                placeholder="e.g. Greenwood Academy"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Portal URL Slug *</Label>
              <Input
                required
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="e.g. greenwood-academy"
                className="mt-1 h-9 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Campus Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="e.g. 15 Admiralty Way, Lekki, Lagos"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Official Contact Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+234 800 000 0000"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 space-y-3">
            <span className="font-bold text-slate-800 text-xs">
              School Direct Settlement Bank Account
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-[11px]">Bank Name</Label>
                <select
                  value={form.bankName}
                  onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
                  className="mt-1 h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs"
                >
                  {NIGERIAN_BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-[11px]">10-Digit NUBAN Account *</Label>
                <Input
                  required
                  maxLength={10}
                  value={form.accountNumber}
                  onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value }))}
                  placeholder="0123456789"
                  className="mt-1 h-9 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-[11px]">Beneficiary Account Name</Label>
              <Input
                value={form.accountName}
                onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                placeholder="e.g. GREENWOOD ACADEMY LTD"
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Current Session</Label>
              <Input
                value={form.session}
                onChange={(e) => setForm((p) => ({ ...p, session: e.target.value }))}
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Current Term</Label>
              <Input
                value={form.term}
                onChange={(e) => setForm((p) => ({ ...p, term: e.target.value }))}
                className="mt-1 h-9 rounded-lg text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isResolving}
              className="rounded-full bg-[#0052FF] text-white font-bold text-xs"
            >
              {isResolving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Activating Settlement Account...
                </span>
              ) : (
                "Verify & Onboard School"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
