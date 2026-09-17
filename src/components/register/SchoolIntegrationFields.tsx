import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Users,
  Briefcase,
  FileSpreadsheet,
} from "lucide-react";

export const NIGERIAN_STATES = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Oyo",
  "Ogun",
  "Edo",
  "Delta",
  "Kaduna",
  "Kano",
  "Enugu",
  "Anambra",
  "Akwa Ibom",
  "Cross River",
  "Imo",
  "Abia",
  "Kwara",
  "Ondo",
  "Osun",
  "Plateau",
  "Benue",
];

export const SCHOOL_TYPES = [
  "Primary & Secondary",
  "Nursery & Primary",
  "Senior Secondary / High School",
  "Tertiary / College",
  "Comprehensive & Vocational",
];

export const STUDENT_BRACKETS = [
  "< 250 Students",
  "250 - 500 Students",
  "500 - 1,000 Students",
  "1,000 - 2,500 Students",
  "2,500+ Students",
];

export const CONTACT_ROLES = [
  "School Principal / Headmaster",
  "Bursar / Finance Director",
  "School Proprietor / Director",
  "Operations Administrator",
];

export const CURRENT_METHODS = [
  "Manual Bank Deposits & Paper Tellers",
  "POS Terminals & Cash at Bursary",
  "Manual Bank Transfers via WhatsApp",
  "Generic Accounting Software",
];

export interface IntegrationFormData {
  schoolName: string;
  schoolType: string;
  state: string;
  address: string;
  studentCount: string;
  contactPerson: string;
  contactRole: string;
  email: string;
  phone: string;
  currentMethod: string;
  notes: string;
}

interface SchoolIntegrationFieldsProps {
  formData: IntegrationFormData;
  onChange: (patch: Partial<IntegrationFormData>) => void;
}

export function SchoolIntegrationFields({ formData, onChange }: SchoolIntegrationFieldsProps) {
  return (
    <div className="space-y-6 text-xs sm:text-sm">
      {/* 1. Institution Profile */}
      <div>
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm sm:text-base">
          <Building2 className="h-4 w-4 text-[#FFB21D]" />
          <span>1. Institution Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="sm:col-span-2">
            <Label htmlFor="school-name" className="text-xs font-semibold text-slate-700">
              Official School Name *
            </Label>
            <div className="relative mt-1.5">
              <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                id="school-name"
                type="text"
                placeholder="e.g. Corona Schools Trust / Apex Model College"
                value={formData.schoolName}
                onChange={(e) => onChange({ schoolName: e.target.value })}
                className="h-11 rounded-xl pl-10 border-slate-300 text-xs sm:text-sm focus:ring-[#FFB21D]"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="school-type" className="text-xs font-semibold text-slate-700">
              Institution Category *
            </Label>
            <select
              id="school-type"
              value={formData.schoolType}
              onChange={(e) => onChange({ schoolType: e.target.value })}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] mt-1.5"
            >
              {SCHOOL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="student-count" className="text-xs font-semibold text-slate-700">
              Approximate Student Population *
            </Label>
            <div className="relative mt-1.5">
              <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="student-count"
                value={formData.studentCount}
                onChange={(e) => onChange({ studentCount: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D]"
              >
                {STUDENT_BRACKETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="school-state" className="text-xs font-semibold text-slate-700">
              State / Location *
            </Label>
            <select
              id="school-state"
              value={formData.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] mt-1.5"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="school-address" className="text-xs font-semibold text-slate-700">
              Campus Address *
            </Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                id="school-address"
                type="text"
                placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                value={formData.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className="h-11 rounded-xl pl-10 border-slate-300 text-xs sm:text-sm focus:ring-[#FFB21D]"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Administrative Contact */}
      <div className="pt-2">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm sm:text-base">
          <User className="h-4 w-4 text-[#FFB21D]" />
          <span>2. Administrative Contact Person</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="contact-person" className="text-xs font-semibold text-slate-700">
              Contact Full Name *
            </Label>
            <div className="relative mt-1.5">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                id="contact-person"
                type="text"
                placeholder="e.g. Dr. Folashade Adeleke"
                value={formData.contactPerson}
                onChange={(e) => onChange({ contactPerson: e.target.value })}
                className="h-11 rounded-xl pl-10 border-slate-300 text-xs sm:text-sm focus:ring-[#FFB21D]"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-role" className="text-xs font-semibold text-slate-700">
              Official Role / Designation *
            </Label>
            <div className="relative mt-1.5">
              <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                id="contact-role"
                value={formData.contactRole}
                onChange={(e) => onChange({ contactRole: e.target.value })}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D]"
              >
                {CONTACT_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="contact-email" className="text-xs font-semibold text-slate-700">
              Official School Email *
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                id="contact-email"
                type="email"
                placeholder="principal@school.edu.ng"
                value={formData.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="h-11 rounded-xl pl-10 border-slate-300 text-xs sm:text-sm focus:ring-[#FFB21D]"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-phone" className="text-xs font-semibold text-slate-700">
              Official Phone / WhatsApp *
            </Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                id="contact-phone"
                type="tel"
                placeholder="08031234567"
                value={formData.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="h-11 rounded-xl pl-10 border-slate-300 text-xs sm:text-sm focus:ring-[#FFB21D]"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Requirements */}
      <div className="pt-2">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm sm:text-base">
          <FileSpreadsheet className="h-4 w-4 text-[#FFB21D]" />
          <span>3. Operational Details</span>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <Label htmlFor="current-method" className="text-xs font-semibold text-slate-700">
              Current Fee Collection Method
            </Label>
            <select
              id="current-method"
              value={formData.currentMethod}
              onChange={(e) => onChange({ currentMethod: e.target.value })}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] mt-1.5"
            >
              {CURRENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs font-semibold text-slate-700">
              Special Requirements or Inquiries (Optional)
            </Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. We have 3 branches across Lagos and need separate settlement subaccounts for each."
              value={formData.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFB21D] mt-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
