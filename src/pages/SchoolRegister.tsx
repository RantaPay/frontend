import { useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  SchoolIntegrationFields,
  IntegrationFormData,
  SCHOOL_TYPES,
  NIGERIAN_STATES,
  STUDENT_BRACKETS,
  CONTACT_ROLES,
  CURRENT_METHODS,
} from "@/components/register/SchoolIntegrationFields";
import { IntegrationSuccessView } from "@/components/register/IntegrationSuccessView";
import { PublicHeader } from "@/components/layout/PublicHeader";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const INITIAL_FORM: IntegrationFormData = {
  schoolName: "",
  schoolType: SCHOOL_TYPES[0],
  state: NIGERIAN_STATES[0],
  address: "",
  studentCount: STUDENT_BRACKETS[1],
  contactPerson: "",
  contactRole: CONTACT_ROLES[0],
  email: "",
  phone: "",
  currentMethod: CURRENT_METHODS[0],
  notes: "",
};

export default function SchoolRegisterPage() {
  usePageTitle("Request School Integration : Ranta Pay");

  const [formData, setFormData] = useState<IntegrationFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<{
    requestNumber: string;
    schoolName: string;
    email: string;
  } | null>(null);

  const handlePatch = (patch: Partial<IntegrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  // Prefill demo data helper for fast testing
  const handlePrefillDemo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData({
      schoolName: `Corona Model College ${randomNum}`,
      schoolType: "Primary & Secondary",
      state: "Lagos",
      address: "12 Victoria Island Expressway, Lagos",
      studentCount: "500 - 1,000 Students",
      contactPerson: "Dr. Babatunde Adeyemi",
      contactRole: "School Principal / Headmaster",
      email: `principal@coronamodel${randomNum}.sch.ng`,
      phone: "08023456789",
      currentMethod: "Manual Bank Deposits & Paper Tellers",
      notes: "Looking to simplify fee payments and instant digital receipts for our parents.",
    });
    toast.info("Prefilled sample school information for testing.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.schoolName.trim() ||
      !formData.address.trim() ||
      !formData.contactPerson.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all required institutional details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/school/integration-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to submit integration request");
      }

      setSubmittedRequest({
        requestNumber: data.data.requestNumber,
        schoolName: formData.schoolName,
        email: formData.email,
      });

      toast.success(
        `Integration request submitted! Application reference: ${data.data.requestNumber}.`
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Submission failed. Please check your details.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Link to="/school/login">Account Sign In</Link>
          </Button>
        }
      />

      {/* 2. Main Container */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {submittedRequest ? (
            <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
              <IntegrationSuccessView
                requestNumber={submittedRequest.requestNumber}
                schoolName={submittedRequest.schoolName}
                email={submittedRequest.email}
                onReset={() => {
                  setSubmittedRequest(null);
                  setFormData(INITIAL_FORM);
                }}
              />
            </Card>
          ) : (
            <div>
              {/* Header Badge & Title */}
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFB21D] bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/70 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" /> Institutional Onboarding
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mt-3">
                  Request School Integration
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Join schools using RantaPay for simple tuition collections and instant verified digital receipts.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handlePrefillDemo}
                    className="text-xs font-semibold text-[#0F172A] hover:text-[#FFB21D] underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Prefill sample school request for testing</span>
                  </button>
                </div>
              </div>

              {/* Form Card */}
              <Card className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <SchoolIntegrationFields formData={formData} onChange={handlePatch} />

                  {/* Submit CTA */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-[#FFB21D] hover:bg-[#EAA315] text-slate-950 font-black text-sm sm:text-base shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Integration Request"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Card>

              {/* Footer note */}
              <p className="mt-6 text-center text-xs text-slate-500">
                Already an integrated partner school?{" "}
                <Link to="/school/login" className="font-bold text-slate-900 hover:text-[#FFB21D] underline">
                  Sign in to School Portal
                </Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
