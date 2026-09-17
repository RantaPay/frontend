import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { ArrowLeft, BellRing, CheckCircle2, Building2, Mail, Smartphone, UserCheck } from "lucide-react";
import { useStore, subscribeNewsletter } from "@/lib/store";
import { toast } from "sonner";

export default function SubscribeNewsletter() {
  usePageTitle("Parent Newsletter & Fee Notices : Ranta Pay");
  const schools = useStore((s) => s.schools.filter((x) => x.status === "Active"));
  const nav = useNavigate();

  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || "");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSchoolId) {
      return toast.error("Please select your child's school.");
    }
    if (!admissionNumber.trim()) {
      return toast.error("Child's Admission Number is required for targeted notices.");
    }
    if (!email.trim() && !phone.trim()) {
      return toast.error("Please provide at least an email address or phone number.");
    }

    subscribeNewsletter(selectedSchoolId, admissionNumber, email, phone);
    setIsSubmitted(true);
    toast.success("Successfully registered for parent updates!");
  };

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group inline-flex items-center">
            <BrandLogo showText size="md" />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BellRing className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Parent Updates & Fee Notices
          </h1>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
            Subscribe with your child's student ID to receive termly notices, textbook requirements,
            and targeted payment deadlines directly.
          </p>
        </div>

        {isSubmitted ? (
          <Card className="mt-8 rounded-xl border border-accent/20 bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-3 text-lg font-bold text-foreground">You are subscribed!</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Updates for admission number <strong className="font-mono text-foreground">{admissionNumber.toUpperCase()}</strong> at{" "}
              <strong>{selectedSchool?.name}</strong> will be sent to{" "}
              <strong>{email || phone}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to={`/pay/${selectedSchool?.slug || "apex-college"}`}>
                  Go to School Payment Portal
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsSubmitted(false)}>
                Register another child
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* School Selection */}
              <div>
                <Label htmlFor="school-select" className="text-xs font-semibold text-foreground">
                  Select Child's School
                </Label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <select
                    id="school-select"
                    value={selectedSchoolId}
                    onChange={(e) => setSelectedSchoolId(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.address.split(",")[1]?.trim() || s.address})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Child Admission Number */}
              <div>
                <Label htmlFor="admission" className="text-xs font-semibold text-foreground">
                  Child's Admission Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-1">
                  <UserCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admission"
                    placeholder="e.g. AMC/2025/001"
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    className="h-10 pl-9 font-mono text-xs"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Linking the admission number ensures you only receive fee notices relevant to your child.
                </p>
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                  Parent / Guardian Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 pl-9 text-xs"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                  Parent / Guardian Phone Number
                </Label>
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 pl-9 text-xs"
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Used for SMS fee alerts and official WhatsApp payment reminders.
                </p>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full h-10 bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              >
                Subscribe to Updates
              </Button>
            </form>

            <div className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              Already need to make a payment?{" "}
              <Link to="/pay" className="font-semibold text-primary hover:underline">
                Pay School Fees Now
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
