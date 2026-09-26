export type FeeItem = {
  category: string;
  amount: number;
  title?: string;
};

export type StoreItem = {
  id: string;
  schoolId: string;
  title: string;
  category: "Textbook" | "Uniform" | "Excursion" | "PTA" | "Other";
  amount: number;
  className: string; // specific class or "All"
  description?: string;
  inStock?: boolean;
};

export type Student = {
  id: string;
  schoolId: string;
  admissionNumber: string;
  name: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  fees: FeeItem[];
  paid: number;
  wemaAccountNumber?: string;
  wemaAccountName?: string;
  wemaBankName?: string;
  dvaStatus?: string;
};

export type PaymentItem = {
  title: string;
  category: string;
  amount: number;
};

export type Payment = {
  id: string;
  receiptNumber: string;
  schoolId: string;
  studentId: string;
  studentName?: string;
  studentAdmission?: string;
  className?: string;
  amount: number;
  items?: PaymentItem[];
  method: "Card" | "Bank Transfer" | "USSD" | "WhatsApp";
  reference: string;
  date: string;
  payerEmail?: string;
  payerPhone?: string;
  status: "Successful" | "Pending" | "Failed";
};

export type School = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  principal: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  paystackSubaccountCode: string;
  receiptFooter: string;
  session: string;
  term: string;
  allowPartial: boolean;
  status: "Active" | "Pending Review" | "Suspended";
  createdAt: string;
};

// Backward-compatibility alias
export type SchoolSettings = School;

export type NewsletterSubscriber = {
  id: string;
  schoolId: string;
  admissionNumber: string;
  guardianEmail: string;
  guardianPhone: string;
  createdAt: string;
};

export type State = {
  schools: School[];
  activeSchoolId: string;
  students: Student[];
  storeItems: StoreItem[];
  payments: Payment[];
  subscribers: NewsletterSubscriber[];
  settings: School;
};

