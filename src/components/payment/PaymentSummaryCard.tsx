import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building2, Smartphone, Lock, Mail, MessageCircle } from "lucide-react";
import { formatNaira, StoreItem } from "@/lib/store";

interface PaymentSummaryCardProps {
  finalTuitionToPay: number;
  selectedStoreItems: StoreItem[];
  totalPayable: number;
  payerEmail: string;
  onPayerEmailChange: (v: string) => void;
  payerPhone: string;
  onPayerPhoneChange: (v: string) => void;
  method: "Card" | "Bank Transfer" | "USSD" | "WhatsApp";
  onMethodChange: (v: "Card" | "Bank Transfer" | "USSD" | "WhatsApp") => void;
  onOpenCheckout: () => void;
  isProcessing?: boolean;
}

export function PaymentSummaryCard({
  finalTuitionToPay,
  selectedStoreItems,
  totalPayable,
  payerEmail,
  onPayerEmailChange,
  payerPhone,
  onPayerPhoneChange,
  method,
  onMethodChange,
  onOpenCheckout,
  isProcessing = false,
}: PaymentSummaryCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-900/5 sticky top-24">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
        Payment Summary
      </h3>

      {/* Bill Breakdown */}
      <div className="mt-4 space-y-2 text-xs border-b border-slate-100 pb-4">
        {finalTuitionToPay > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Tuition & Levies</span>
            <span className="font-bold text-slate-900">{formatNaira(finalTuitionToPay)}</span>
          </div>
        )}
        {selectedStoreItems.map((item) => (
          <div key={item.id} className="flex justify-between text-slate-600">
            <span className="truncate max-w-[180px]">{item.title}</span>
            <span className="font-bold text-slate-900">{formatNaira(item.amount)}</span>
          </div>
        ))}

        <div className="flex justify-between items-center pt-2 text-sm">
          <span className="font-bold text-slate-900">Total Payable</span>
          <span className="text-xl font-black text-slate-950">
            {formatNaira(totalPayable)}
          </span>
        </div>
      </div>

      {/* Payment Channel Selection */}
      <div className="mt-5">
        <Label className="text-xs font-bold text-slate-800">Select Payment Method:</Label>
        <RadioGroup
          value={method}
          onValueChange={(v) => onMethodChange(v as "Card" | "Bank Transfer" | "USSD" | "WhatsApp")}
          className="mt-3 space-y-2"
        >
          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${method === "Card" ? "border-[#FFB21D] bg-amber-50/40" : "border-slate-200 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="Card" id="m-card" />
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <CreditCard className="h-4 w-4 text-[#FFB21D]" />
                <span>Debit Card (Mastercard/Visa/Verve)</span>
              </div>
            </div>
          </label>

          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${method === "Bank Transfer" ? "border-[#FFB21D] bg-amber-50/40" : "border-slate-200 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="Bank Transfer" id="m-transfer" />
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>Bank Transfer</span>
              </div>
            </div>
          </label>

          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${method === "USSD" ? "border-[#FFB21D] bg-amber-50/40" : "border-slate-200 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="USSD" id="m-ussd" />
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span>USSD Code (*737#, *901#, etc.)</span>
              </div>
            </div>
          </label>

          <label className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-colors ${method === "WhatsApp" ? "border-[#FFB21D] bg-amber-50/40" : "border-slate-200 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-2.5">
              <RadioGroupItem value="WhatsApp" id="m-whatsapp" />
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>Pay via WhatsApp</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Instant
            </span>
          </label>
        </RadioGroup>
      </div>

      {/* Optional Contact Inputs */}
      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        <div>
          <Label htmlFor="receipt-email" className="text-[11px] font-semibold text-slate-600">
            Receipt Email (Optional):
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              id="receipt-email"
              type="email"
              value={payerEmail}
              onChange={(e) => onPayerEmailChange(e.target.value)}
              placeholder="parent@example.com"
              className="h-10 pl-9 rounded-xl text-xs border-slate-300 focus:ring-[#FFB21D]"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="payer-phone" className="text-[11px] font-semibold text-slate-600">
            WhatsApp / SMS Phone (Optional):
          </Label>
          <Input
            id="payer-phone"
            type="tel"
            value={payerPhone}
            onChange={(e) => onPayerPhoneChange(e.target.value)}
            placeholder="08012345678"
            className="h-10 rounded-xl text-xs border-slate-300 focus:ring-[#FFB21D] mt-1"
          />
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6">
        <Button
          onClick={onOpenCheckout}
          disabled={totalPayable <= 0 || isProcessing}
          className="w-full rounded-xl bg-[#FFB21D] hover:bg-[#EAA315] py-6 text-sm font-black text-slate-950 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? "Connecting to Paystack..." : `Pay ${formatNaira(totalPayable)}`}
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <Lock className="h-3.5 w-3.5 text-[#FFB21D]" />
        <span>Encrypted bank-grade checkout secured by Paystack</span>
      </div>
    </Card>
  );
}
