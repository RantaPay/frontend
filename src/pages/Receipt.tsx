import { Link, useParams } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePageTitle } from "@/hooks/use-page-title";
import { Printer, Download, Home, CheckCircle2, QrCode, ShieldCheck, Mail } from "lucide-react";
import { useStore, balance, formatNaira } from "@/lib/store";

export default function ReceiptPage() {
  const { receiptId } = useParams<{ receiptId: string }>();
  const payment = useStore((s) => s.payments.find((p) => p.id === receiptId));
  const student = useStore((s) => s.students.find((x) => x.id === payment?.studentId));
  const schools = useStore((s) => s.schools);
  const school = schools.find((sch) => sch.id === payment?.schoolId) || schools[0];

  usePageTitle(
    payment
      ? `Receipt ${payment.receiptNumber} : ${school?.name || "Ranta Pay"}`
      : "Receipt Not Found"
  );

  if (!payment || !student || !school) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-4">
        <Card className="max-w-md p-8 text-center">
          <p className="text-muted-foreground">Receipt not found.</p>
          <Button asChild className="mt-4">
            <Link to="/">Return to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const remainingBalance = balance(student);
  const verifyUrl = `${window.location.origin}/verify/${payment.id}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top action bar */}
      <header className="border-b border-border bg-card print:hidden">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group inline-flex items-center">
            <BrandLogo showText size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <Home className="mr-1.5 h-4 w-4" /> Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Print & Download Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 rounded-full border border-border bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent">
            <CheckCircle2 className="h-4 w-4" /> Official Payment Cleared
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Print
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="mr-1.5 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        {/* Email Dispatch Notice if payerEmail was provided */}
        {payment.payerEmail && (
          <div className="mb-4 flex items-center gap-2.5 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground print:hidden">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span>
              A digital copy of this receipt was dispatched to:{" "}
              <strong className="text-foreground">{payment.payerEmail}</strong>
            </span>
          </div>
        )}

        {/* Printable Receipt Card */}
        <Card className="overflow-hidden rounded-xl border border-border bg-card p-0 shadow-sm print:border-none print:shadow-none">
          {/* Header Banner with solid primary */}
          <div className="border-b border-border bg-primary px-6 py-6 text-primary-foreground sm:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <BrandLogo className="h-12 w-12 rounded-lg bg-white p-1" />
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight">{school.name}</h1>
                  <p className="text-xs text-primary-foreground/80">{school.address}</p>
                  <p className="text-xs text-primary-foreground/80">
                    Phone: {school.phone} | Email: {school.email}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <Badge variant="outline" className="border-white/30 text-white text-[11px] uppercase">
                  Official Receipt
                </Badge>
                <div className="mt-1 font-mono text-base font-bold">{payment.receiptNumber}</div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {/* Student Meta Grid */}
            <div className="grid grid-cols-2 gap-4 border-b border-border pb-6 text-xs sm:grid-cols-4">
              <div>
                <span className="text-muted-foreground uppercase text-[10px] font-semibold">Student</span>
                <div className="mt-0.5 font-bold text-foreground text-sm">{student.name}</div>
              </div>
              <div>
                <span className="text-muted-foreground uppercase text-[10px] font-semibold">Admission No.</span>
                <div className="mt-0.5 font-mono font-medium text-foreground">{student.admissionNumber}</div>
              </div>
              <div>
                <span className="text-muted-foreground uppercase text-[10px] font-semibold">Class</span>
                <div className="mt-0.5 font-medium text-foreground">{student.className}</div>
              </div>
              <div>
                <span className="text-muted-foreground uppercase text-[10px] font-semibold">Session / Term</span>
                <div className="mt-0.5 font-medium text-foreground">
                  {school.session} : {school.term}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment Breakdown
              </h3>
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left">
                    <th className="py-2.5 px-3 font-semibold text-foreground">Description</th>
                    <th className="py-2.5 px-3 font-semibold text-foreground">Category</th>
                    <th className="py-2.5 px-3 text-right font-semibold text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payment.items && payment.items.length > 0 ? (
                    payment.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-foreground">{item.title}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{item.category}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                          {formatNaira(item.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-foreground">
                        {school.term} Fees Payment
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">Tuition</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                        {formatNaira(payment.amount)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Financial Totals Box */}
            <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Total Amount Paid:</span>
                <span className="text-2xl font-black text-primary">{formatNaira(payment.amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
                <span className="text-muted-foreground">Outstanding Tuition Balance:</span>
                <span className="font-semibold text-foreground">{formatNaira(remainingBalance)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Payment Method: {payment.method}</span>
                <span>Transaction Ref: <span className="font-mono text-foreground">{payment.reference}</span></span>
              </div>
              <div className="mt-1 text-right text-[11px] text-muted-foreground">
                Date: {new Date(payment.date).toLocaleString("en-NG")}
              </div>
            </div>

            {/* Verification QR & Authorized Signature */}
            <div className="mt-8 grid grid-cols-2 items-end gap-6 border-t border-border pt-6">
              <div>
                <div className="text-[11px] text-muted-foreground">Authorized Signature:</div>
                <div className="mt-6 border-t border-border pt-1">
                  <div className="text-xs font-bold text-foreground">{school.principal}</div>
                  <div className="text-[11px] text-muted-foreground">Principal / Bursar</div>
                </div>
              </div>

              {/* Scannable Verification Link */}
              <div className="flex flex-col items-end">
                <Link
                  to={`/verify/${payment.id}`}
                  className="group flex flex-col items-center rounded-lg border border-border bg-muted/20 p-2.5 transition hover:border-primary"
                  title="Click or scan to verify"
                >
                  <QrCode className="h-16 w-16 text-foreground group-hover:text-primary" />
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-medium text-primary">
                    <ShieldCheck className="h-3 w-3" /> Gate Verification
                  </span>
                </Link>
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Ref: <span className="font-mono">{payment.reference}</span>
                </div>
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="mt-6 border-t border-border pt-4 text-center text-[11px] text-muted-foreground">
              {school.receiptFooter || "Thank you for your prompt payment."}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
