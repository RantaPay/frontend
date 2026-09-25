import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, updateSettings } from "@/lib/store";
import { apiGet, apiPut } from "@/lib/api";
import { Building2, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  usePageTitle("School Profile & Bank Settings : Ranta Pay Bursar OS");
  const school = useStore((s) => s.settings);
  const [form, setForm] = useState(school);
  const [isSaving, setIsSaving] = useState(false);
  const [notif, setNotif] = useState({
    sms: true,
    whatsapp: true,
    email: true,
    autoReminders: true,
  });

  useEffect(() => {
    if (!school.id) return;
    apiGet(`/api/school/${school.id}/dashboard`)
      .then((res) => {
        if (res.success && res.data?.school) {
          setForm((prev) => ({ ...prev, ...res.data.school }));
          updateSettings(res.data.school);
        }
      })
      .catch((err) => console.error("Could not fetch school details:", err));
  }, [school.id]);

  const save = async () => {
    setIsSaving(true);
    try {
      const res = await apiPut(`/api/school/${school.id}/settings`, {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        principal: form.principal,
        receiptFooter: form.receiptFooter,
        session: form.session,
        term: form.term,
        allowPartial: form.allowPartial,
      });

      if (res.success && res.data) {
        updateSettings(res.data);
        toast.success("School profile and settings saved successfully.");
      } else {
        toast.success("School settings updated.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell title="School Settings & Settlement">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* School Profile */}
        <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">School Profile & Identity</h3>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            <div>
              <Label>School Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label>Campus Physical Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Official Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label>Bursary Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label>Principal / Authorizing Officer</Label>
              <Input
                value={form.principal}
                onChange={(e) => setForm({ ...form, principal: e.target.value })}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Academic Session</Label>
                <Input
                  value={form.session}
                  onChange={(e) => setForm({ ...form, session: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label>Current Term</Label>
                <Input
                  value={form.term}
                  onChange={(e) => setForm({ ...form, term: e.target.value })}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label>Receipt Disclaimer / Footer</Label>
              <Textarea
                value={form.receiptFooter}
                onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
                className="mt-1 text-xs"
                rows={2}
              />
            </div>

            <Button
              onClick={save}
              disabled={isSaving}
              className="mt-4 w-full bg-primary text-primary-foreground font-semibold"
            >
              {isSaving ? "Saving School Changes..." : "Save School Changes"}
            </Button>
          </div>
        </Card>

        {/* Right Col: Paystack Direct Settlement Bank Details */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <h3 className="font-bold text-foreground">Direct School Bank Account</h3>
              </div>
              <Badge className="bg-accent text-accent-foreground text-[10px]">
                <CheckCircle2 className="mr-1 h-3 w-3 inline" /> Verified
              </Badge>
            </div>

            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              All tuition payments made by parents go directly into your school's verified corporate bank account.
            </p>

            <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-bold text-foreground">{school.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-mono font-bold text-foreground">{school.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-medium text-foreground">{school.accountName}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Settlement Identifier:</span>
                <span className="font-mono text-primary font-semibold">{school.paystackSubaccountCode}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5 text-accent shrink-0" />
              <span>To modify settlement accounts, please submit a verified change request to Ranta Pay Super Admin.</span>
            </div>
          </Card>

          {/* Automated Parent Notifications */}
          <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground">Parent Automated Notifications</h3>
            <p className="text-xs text-muted-foreground">Configure automated notice dispatch channels.</p>

            <div className="mt-4 space-y-2.5 text-xs">
              {[
                { k: "sms", title: "SMS Notifications", desc: "Instant SMS receipts and reminders via Termii" },
                { k: "whatsapp", title: "WhatsApp Notifications", desc: "Official payment clearance and in-chat bills" },
                { k: "email", title: "Email Notifications", desc: "Branded PDF receipt dispatch and bulletins" },
                { k: "autoReminders", title: "Due Date Reminders", desc: "Automated notice 14 days and 3 days before deadline" },
              ].map((item) => (
                <div key={item.k} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="font-semibold text-foreground">{item.title}</div>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notif[item.k as keyof typeof notif]}
                    onCheckedChange={(v) => {
                      setNotif({ ...notif, [item.k]: v });
                      toast.success(`${item.title} preference updated.`);
                    }}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
