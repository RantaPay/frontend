import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  useStore,
  updateSettings,
  updateStudent,
  totalFees,
  formatNaira,
  addStoreItem,
  deleteStoreItem,
  StoreItem,
} from "@/lib/store";
import { Plus, Trash2, BookOpen, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["Tuition", "Exam", "Books", "Uniform", "Transport", "Boarding", "Other"];
const STORE_CATEGORIES = ["Textbook", "Uniform", "Excursion", "PTA", "Other"] as const;

export default function FeesPage() {
  usePageTitle("Fees & Store : Ranta Pay Bursar OS");
  const school = useStore((s) => s.settings);
  const allStudents = useStore((s) => s.students);
  const allStoreItems = useStore((s) => s.storeItems);

  // Filter students and store items for active school
  const students = useMemo(() => {
    return allStudents.filter((s) => s.schoolId === school.id);
  }, [allStudents, school]);

  const schoolStoreItems = useMemo(() => {
    return allStoreItems.filter((i) => i.schoolId === school.id);
  }, [allStoreItems, school]);

  const classes = useMemo(() => {
    const list = Array.from(new Set(students.map((s) => s.className))).sort();
    return list.length > 0 ? list : ["JSS 1A", "JSS 2A", "SSS 1B", "SSS 2", "SSS 3"];
  }, [students]);

  // Mass Fee Assignment State
  const [cls, setCls] = useState<string>(classes[0] ?? "JSS 1A");
  const [cat, setCat] = useState("Tuition");
  const [amt, setAmt] = useState<number>(0);

  // New Store Item Modal State
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<StoreItem["category"]>("Textbook");
  const [newClass, setNewClass] = useState("All");
  const [newAmount, setNewAmount] = useState<number>(0);
  const [newDesc, setNewDesc] = useState("");

  const applyToClass = () => {
    if (!cls || amt <= 0) return toast.error("Select a class and enter a valid fee amount.");
    students
      .filter((s) => s.className === cls)
      .forEach((s) => {
        const fees = [...s.fees];
        const idx = fees.findIndex((f) => f.category === cat);
        if (idx >= 0) fees[idx] = { category: cat, amount: amt, title: `${cls} ${cat}` };
        else fees.push({ category: cat, amount: amt, title: `${cls} ${cat}` });
        updateStudent(s.id, { fees });
      });
    toast.success(`Applied ${cat} fee of ${formatNaira(amt)} to all ${cls} students.`);
    setAmt(0);
  };

  const handleCreateStoreItem = () => {
    if (!newTitle.trim() || newAmount <= 0) {
      return toast.error("Please enter a title and a valid price.");
    }
    addStoreItem({
      schoolId: school.id,
      title: newTitle.trim(),
      category: newCategory,
      amount: newAmount,
      className: newClass,
      description: newDesc.trim() || undefined,
      inStock: true,
    });
    toast.success("Store item published to parent portal.");
    setStoreModalOpen(false);
    setNewTitle("");
    setNewAmount(0);
    setNewDesc("");
  };

  return (
    <DashboardShell title="Fee Structures & School Store">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Mass Class Fee Assignment */}
        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-bold text-foreground">Mass Class Fee Assignment</h3>
              <p className="text-xs text-muted-foreground">
                Set or update fee category rates for an entire class roster in one click.
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Direct Apply
            </Badge>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <Label className="text-xs font-semibold">Target Class</Label>
              <select
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {classes.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Fee Category</Label>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Amount (₦)</Label>
              <Input
                type="number"
                value={amt || ""}
                onChange={(e) => setAmt(Number(e.target.value))}
                placeholder="e.g. 120000"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="flex items-end">
              <Button
                className="h-9 w-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                onClick={applyToClass}
              >
                Apply to Class
              </Button>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Standard Fee Categories
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Badge key={c} variant="outline" className="text-xs font-medium">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Right Col: School Payment Policies */}
        <Card className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-bold text-foreground">School Payment Policies</h3>
          <p className="text-xs text-muted-foreground">Configure payment rules for parents.</p>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-border p-3.5">
            <div>
              <div className="text-xs font-semibold text-foreground">Allow Partial Payments</div>
              <p className="text-[11px] text-muted-foreground">
                Parents can pay tuition in tranches or installments.
              </p>
            </div>
            <Switch
              checked={school.allowPartial}
              onCheckedChange={(v) => {
                updateSettings({ allowPartial: v });
                toast.success(v ? "Partial payments enabled." : "Partial payments disabled (Full fees required).");
              }}
            />
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-1.5 font-semibold text-foreground mb-1">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Direct Bank Settlement</span>
            </div>
            All collections route straight into <span className="font-semibold text-foreground">{school.bankName}</span> ({school.accountNumber}).
          </div>
        </Card>
      </div>

      {/* School Store & Auxiliary Levies Section */}
      <Card className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">School Store & Auxiliary Items</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Textbooks, uniform sets, and excursion tickets available for parents to buy on the web portal.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setStoreModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Store Item
          </Button>
        </div>

        {/* Store items list */}
        <div className="mt-4 divide-y divide-border">
          {schoolStoreItems.length > 0 ? (
            schoolStoreItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{item.title}</div>
                  <div className="text-muted-foreground">
                    Category: <Badge variant="outline" className="text-[10px]">{item.category}</Badge> | Target Class:{" "}
                    <span className="font-medium text-foreground">{item.className}</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-foreground">{formatNaira(item.amount)}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Delete this store item?")) {
                        deleteStoreItem(item.id);
                        toast.success("Item deleted");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No store items added yet. Click "Add Store Item" to list textbooks, uniforms, or excursion passes.
            </div>
          )}
        </div>
      </Card>

      {/* Class Fee Roster Overview */}
      <Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4 font-bold text-foreground">
          Fee Structure by Class
        </div>
        <div className="divide-y divide-border">
          {classes.map((c) => {
            const list = students.filter((s) => s.className === c);
            const sample = list[0];
            return (
              <div
                key={c}
                className="grid gap-3 px-5 py-3.5 sm:grid-cols-[1fr_2fr_auto] sm:items-center text-xs"
              >
                <div>
                  <div className="font-bold text-foreground">{c}</div>
                  <div className="text-muted-foreground">{list.length} enrolled students</div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sample?.fees.map((f) => (
                    <Badge key={f.category + f.amount} variant="outline" className="text-[11px]">
                      {f.title || f.category}: {formatNaira(f.amount)}
                    </Badge>
                  ))}
                  {(!sample || sample.fees.length === 0) && (
                    <span className="text-muted-foreground italic">No fee items assigned yet</span>
                  )}
                </div>
                <div className="text-right font-black text-foreground text-sm">
                  {formatNaira(sample ? totalFees(sample) : 0)}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Create Store Item Dialog */}
      <Dialog open={storeModalOpen} onOpenChange={setStoreModalOpen}>
        <DialogContent className="max-w-md rounded-xl border border-border bg-card p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add School Store Item</DialogTitle>
          </DialogHeader>

          <div className="mt-3 space-y-3 text-xs">
            <div>
              <Label>Item Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Senior Secondary Biology Practical Manual"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as StoreItem["category"])}
                  className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-xs"
                >
                  {STORE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Target Class</Label>
                <select
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  className="mt-1 h-9 w-full rounded border border-input bg-background px-2 text-xs"
                >
                  <option value="All">All Classes</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <Label>Price (₦)</Label>
              <Input
                type="number"
                value={newAmount || ""}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                placeholder="4500"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label>Brief Description (Optional)</Label>
              <Input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="e.g. Required for First Term lab practicals"
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" onClick={() => setStoreModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateStoreItem} className="bg-primary text-primary-foreground">
              Save & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
