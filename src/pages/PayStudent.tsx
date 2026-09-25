import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ArrowLeft, User, Phone, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  useStore,
  balance,
  recordPayment,
  PaymentItem,
} from "@/lib/store";
import { PaystackCheckoutModal } from "@/components/payment/PaystackCheckoutModal";
import { StudentFeeItemsSelector } from "@/components/payment/StudentFeeItemsSelector";
import { PaymentSummaryCard } from "@/components/payment/PaymentSummaryCard";
import { notifySchoolDataUpdated } from "@/lib/school-sync";
import { apiGet, apiPost } from "@/lib/api";

export default function PayStudent() {
  const { schoolSlug, studentId } = useParams<{ schoolSlug?: string; studentId: string }>();
  const allStudents = useStore((s) => s.students);
  const schools = useStore((s) => s.schools);
  const allStoreItems = useStore((s) => s.storeItems);
  const nav = useNavigate();

  const student = useMemo(() => {
    return allStudents.find((s) => s.id === studentId);
  }, [allStudents, studentId]);

  const school = useMemo(() => {
    if (!student) return undefined;
    return schools.find((sch) => sch.id === student.schoolId || sch.slug === schoolSlug);
  }, [schools, student, schoolSlug]);

  usePageTitle(
    student
      ? `Pay for ${student.name} : ${school?.name || "Ranta Pay"}`
      : "Payment Checkout : Ranta Pay"
  );

  const availableStoreItems = useMemo(() => {
    if (!student || !school) return [];
    return allStoreItems.filter(
      (item) =>
        item.schoolId === school.id &&
        (item.className === "All" || item.className === student.className)
    );
  }, [allStoreItems, school, student]);

  const [selectedStoreItemIds, setSelectedStoreItemIds] = useState<string[]>([]);
  const bal = student ? balance(student) : 0;
  const [tuitionAmount, setTuitionAmount] = useState<number>(bal);
  const [payerEmail, setPayerEmail] = useState(student?.parentEmail || "");
  const [payerPhone, setPayerPhone] = useState(student?.parentPhone || "");
  const [method, setMethod] = useState<"Card" | "Bank Transfer" | "USSD" | "WhatsApp">("Card");
  const [paystackOpen, setPaystackOpen] = useState(false);
  const [currentPaymentRef, setCurrentPaymentRef] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!student || !school) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF9F6] p-4 text-slate-900">
        <Card className="max-w-md p-8 text-center rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5">
          <p className="text-slate-600 font-medium">Student or school not found.</p>
          <Button asChild className="mt-4 rounded-xl bg-[#FFB21D] hover:bg-[#EAA315] text-slate-950 font-bold">
            <Link to="/pay">Return to Search</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const selectedStoreItems = availableStoreItems.filter((i) =>
    selectedStoreItemIds.includes(i.id)
  );
  const storeTotal = selectedStoreItems.reduce((acc, curr) => acc + curr.amount, 0);
  const finalTuitionToPay = Math.min(Math.max(0, tuitionAmount), bal);
  const totalPayable = finalTuitionToPay + storeTotal;

  const toggleStoreItem = (id: string) => {
    setSelectedStoreItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const preparePaymentItems = (): PaymentItem[] => {
    const items: PaymentItem[] = [];
    if (finalTuitionToPay > 0) {
      items.push({
        title: `${school.term} Academic Fees (${finalTuitionToPay < bal ? "Part Payment" : "Full"})`,
        category: "Tuition",
        amount: finalTuitionToPay,
      });
    }
    selectedStoreItems.forEach((s) => {
      items.push({
        title: s.title,
        category: s.category,
        amount: s.amount,
      });
    });
    return items;
  };

  const handleVerifyAndComplete = async (ref: string, items: PaymentItem[]) => {
    try {
      setIsProcessing(true);
      const res = await apiGet(`/api/payments/verify/${ref}`);
      if (res.success && res.data?.payment) {
        const p = res.data.payment;
        recordPayment(student.id, totalPayable, method, {
          id: p.id,
          receiptNumber: p.receiptNumber,
          reference: p.reference,
          payerEmail: payerEmail.trim() || undefined,
          payerPhone: payerPhone.trim() || undefined,
          items,
          schoolId: school.id,
        });
        notifySchoolDataUpdated(school.id);
        toast.success("Payment verified and recorded in school records!");
        nav(`/receipt/${p.id}`);
      } else {
        throw new Error(res.error || "Payment verification could not be completed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify transaction with backend");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCheckout = async () => {
    if (totalPayable <= 0) {
      return toast.error("Please select at least one fee item or enter an amount to pay.");
    }
    if (!school.allowPartial && finalTuitionToPay > 0 && finalTuitionToPay < bal) {
      return toast.error("This school requires full payment of term fees.");
    }

    setIsProcessing(true);
    const items = preparePaymentItems();

    try {
      // 1. Initialize real Paystack transaction with backend
      const initData = await apiPost("/api/payments/initialize", {
        schoolId: school.id,
        studentId: student.id,
        amount: totalPayable,
        method,
        payerEmail: payerEmail.trim() || student.parentEmail || "parent@rantapay.ng",
        payerPhone: payerPhone.trim() || student.parentPhone || undefined,
        items,
      });

      if (!initData.success || !initData.data?.reference) {
        throw new Error(initData.error || "Payment initialization failed");
      }

      const reference = initData.data.reference;
      setCurrentPaymentRef(reference);

      // 2. Check if PaystackPop inline setup is available
      const PaystackPop = (window as any).PaystackPop;
      let publicKey: string | null = null;
      try {
        const pkRes = await apiGet("/api/payments/public-key");
        publicKey = pkRes?.data?.publicKey;
      } catch {}

      if (PaystackPop && publicKey && !publicKey.includes("mock")) {
        const handler = PaystackPop.setup({
          key: publicKey,
          email: payerEmail.trim() || student.parentEmail || "parent@rantapay.ng",
          amount: Math.round(totalPayable * 100),
          ref: reference,
          callback: async (response: any) => {
            await handleVerifyAndComplete(response.reference || reference, items);
          },
          onClose: () => {
            setIsProcessing(false);
            toast.info("Transaction cancelled.");
          },
        });
        handler.openIframe();
        setIsProcessing(false);
        return;
      }

      // 3. If live checkout URL provided
      if (
        initData.data.authorizationUrl &&
        initData.data.authorizationUrl.startsWith("https://checkout.paystack.com")
      ) {
        window.location.href = initData.data.authorizationUrl;
        return;
      }

      // 4. Open secure confirmation modal connected to real backend
      setIsProcessing(false);
      setPaystackOpen(true);
    } catch (err: any) {
      setIsProcessing(false);
      toast.error(err.message || "Failed to connect to payment engine.");
    }
  };

  const handleConfirmVerifiedPayment = async () => {
    if (!currentPaymentRef) return;
    const items = preparePaymentItems();
    setPaystackOpen(false);
    await handleVerifyAndComplete(currentPaymentRef, items);
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
            <Link to={school ? `/pay/${school.slug}` : "/pay"}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Search
            </Link>
          </Button>
        }
      />

      {/* 2. Main Checkout Layout */}
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left Column: Student Details & Fee Items */}
          <div className="space-y-6 md:col-span-8">
            <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70">
                    <Sparkles className="h-3 w-3 text-[#FFB21D]" /> Student Profile
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-2">{student.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Admission No:{" "}
                    <span className="font-mono font-bold text-slate-800">
                      {student.admissionNumber}
                    </span>{" "}
                    • Class: <span className="font-semibold text-slate-800">{student.className}</span>
                  </p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{school.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{school.address}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Parent: {student.parentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>{student.parentPhone}</span>
                </div>
                {student.parentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-600 shrink-0" />
                    <span className="truncate">{student.parentEmail}</span>
                  </div>
                )}
              </div>
            </Card>

            <StudentFeeItemsSelector
              student={student}
              school={school}
              bal={bal}
              tuitionAmount={tuitionAmount}
              onTuitionChange={setTuitionAmount}
              availableStoreItems={availableStoreItems}
              selectedStoreItemIds={selectedStoreItemIds}
              onToggleStoreItem={toggleStoreItem}
            />
          </div>

          {/* Right Column: Payment Summary */}
          <div className="md:col-span-4">
            <PaymentSummaryCard
              finalTuitionToPay={finalTuitionToPay}
              selectedStoreItems={selectedStoreItems}
              totalPayable={totalPayable}
              payerEmail={payerEmail}
              onPayerEmailChange={setPayerEmail}
              payerPhone={payerPhone}
              onPayerPhoneChange={setPayerPhone}
              method={method}
              onMethodChange={setMethod}
              onOpenCheckout={handleOpenCheckout}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>

      {/* Paystack Checkout Modal for Test/Fallback Mode */}
      <PaystackCheckoutModal
        open={paystackOpen}
        onOpenChange={setPaystackOpen}
        isProcessing={isProcessing}
        onConfirm={handleConfirmVerifiedPayment}
        totalPayable={totalPayable}
        method={method}
        school={school}
        student={student}
        payerEmail={payerEmail}
      />
    </div>
  );
}
