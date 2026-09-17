import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/use-page-title";
import { useStore, formatNaira } from "@/lib/store";
import { CheckCircle2, XCircle, ArrowLeft, Building2, Loader2 } from "lucide-react";

export default function VerifyReceipt() {
  const { receiptId } = useParams<{ receiptId: string }>();
  const [searchParams] = useSearchParams();
  usePageTitle("Official Receipt Verification : Ranta Pay");

  const queryRef = searchParams.get("reference") || searchParams.get("trxref");
  const targetId = queryRef || receiptId;

  const payments = useStore((s) => s.payments);
  const students = useStore((s) => s.students);
  const schools = useStore((s) => s.schools);

  // If targetId is "demo", use first payment
  const localPayment = targetId === "demo"
    ? payments[0]
    : payments.find((p) => p.id === targetId || p.receiptNumber === targetId || p.reference === targetId);

  const localStudent = localPayment ? students.find((s) => s.id === localPayment.studentId) : undefined;
  const localSchool = localPayment ? schools.find((sch) => sch.id === localPayment.schoolId) : undefined;

  const [remoteData, setRemoteData] = useState<{ payment: any; student: any; school: any } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!localPayment && targetId && targetId !== "demo") {
      setIsVerifying(true);
      fetch(`/api/payments/verify/${encodeURIComponent(targetId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.payment) {
            setRemoteData({
              payment: data.data.payment,
              student: data.data.student,
              school: data.data.school,
            });
          }
        })
        .catch((err) => console.error("Verify API error:", err))
        .finally(() => setIsVerifying(false));
    }
  }, [localPayment, targetId]);

  const payment = localPayment || remoteData?.payment;
  const student = localStudent || remoteData?.student;
  const school = localSchool || remoteData?.school;
  const isValid = Boolean(payment && student && school);

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
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Anti-Fraud Verification Terminal
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Receipt Authenticity
          </h1>
        </div>

        {isVerifying ? (
          <Card className="mt-6 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <h3 className="mt-3 text-base font-bold text-foreground">Verifying Transaction</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Confirming transaction clearance on Paystack settlement rail...
            </p>
          </Card>
        ) : isValid && payment && student && school ? (
          <Card className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            {/* Verified Header */}
            <div className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/10 p-4">
              <CheckCircle2 className="h-8 w-8 text-accent shrink-0" />
              <div>
                <div className="text-sm font-bold text-accent">Valid & Authentic Payment</div>
                <div className="text-xs text-muted-foreground">
                  Official Clearance Receipt Verified
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="mt-6 divide-y divide-border text-xs">
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">School:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  {school.name}
                </span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Student Name:</span>
                <span className="font-bold text-foreground text-sm">{student.name}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Admission Number:</span>
                <span className="font-mono font-medium text-foreground">{student.admissionNumber}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Class:</span>
                <span className="font-medium text-foreground">{student.className}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Receipt Number:</span>
                <span className="font-mono font-bold text-foreground">{payment.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Transaction Reference:</span>
                <span className="font-mono text-muted-foreground">{payment.reference}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-muted-foreground">Payment Date:</span>
                <span className="font-medium text-foreground">
                  {new Date(payment.date).toLocaleString("en-NG")}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground font-medium">Amount Verified:</span>
                <span className="text-xl font-black text-primary">{formatNaira(payment.amount)}</span>
              </div>
            </div>

            {/* Gate Clearance Badge */}
            <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3.5 text-center">
              <Badge className="bg-accent text-accent-foreground text-xs uppercase tracking-wider">
                Cleared for Gate & Exam Entry
              </Badge>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Authorized by {school.principal} ({school.session} : {school.term})
              </p>
            </div>

            <div className="mt-6">
              <Button asChild variant="outline" className="w-full">
                <Link to={`/receipt/${payment.id}`}>View Full Printable Receipt</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mt-6 rounded-xl border border-destructive/20 bg-card p-6 text-center shadow-sm">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="mt-3 text-lg font-bold text-foreground">Unverified or Invalid Receipt</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              This receipt identifier ({receiptId}) was not found on the Ranta Pay network.
              Please check the reference number or contact the school bursar.
            </p>
            <div className="mt-6">
              <Button asChild className="bg-primary text-primary-foreground">
                <Link to="/pay">Search Student on Ranta Pay</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
