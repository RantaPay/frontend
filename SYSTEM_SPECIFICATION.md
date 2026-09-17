# Ranta Pay — Complete System Specification & Multi-Tenant Platform Architecture

> **The Central Billing & Payment Network for African Schools**  
> An Omnichannel, Multi-Tenant SaaS Platform for Tuition, Auxiliary Fees, and Bursary Automation

---

## 1. Executive Summary & Core Philosophy

**Ranta Pay** is a centralized school billing marketplace and financial operating system. Rather than building separate, disconnected portals for individual schools, Ranta Pay operates as an **Omnichannel Multi-Tenant Aggregator Network** (similar to Remita or Shopify for education):

1. **Universal Parent Pay Portal (Zero Login):** Parents across Nigeria can search or select their child's school, enter the student's admission number, review all fees (tuition, textbooks, uniform, excursions), and pay in seconds.
2. **School Bursar Operating System:** Each registered school receives a secure, tenant-isolated dashboard to manage their student rosters, set class fees, manage their school store, monitor termly revenue analytics, and broadcast debt reminders.
3. **Super Admin Platform Control Room:** A dedicated control center for the Ranta Pay team to onboard new schools, verify corporate bank accounts via NIBSS, provision Paystack Subaccounts for direct settlement, and monitor platform-wide transaction volume and commissions.

---

## 2. The 3-Tier Platform Architecture

```
                                [ RANTA PAY PLATFORM ENGINE ]
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
[ TIER 1: PUBLIC PARENT PORTAL ]   [ TIER 2: SCHOOL BURSAR OS ]       [ TIER 3: SUPER ADMIN ROOM ]
 (Zero Authentication Required)     (School-Isolated Admin Login)       (Ranta Pay Master Control)
      │                                      │                                      │
 1. Select / Search School            1. Manage Student Directory        1. Onboard & Approve Schools
    (or direct shortcut link)         2. Configure Class Fees & Levies   2. Verify NUBAN / CAC via NIBSS
 2. Search Student by Adm No / Phone  3. Manage School Store Items       3. Provision Paystack Subaccounts
 3. Select Fees (Tuition / Books)     4. Termly Analytics & Charts       4. Track Global GMV & Volume
 4. Optional Email for Receipt        5. 1-Click WhatsApp/SMS Reminders  5. Monitor Platform Commissions
 5. Pay via Paystack Modal            6. Export Financial PDF / Excel    6. Suspend / Activate Accounts
      │                                      │                                      │
      └──────────────────────────────────────┴──────────────────────────────────────┘
                                             │
                                   [ SHARED DATA PLANE ]
                          PostgreSQL Database (Multi-Tenant Schema)
                                             │
                                [ DIRECT SETTLEMENT ENGINE ]
                           Paystack Subaccounts (Zero-Holding)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
          [ SCHOOL'S BANK ACCOUNT ]                     [ RANTA PAY COMMISSION ]
        (98.5% Direct Split Payout)                   (1.5% Automatic Platform Fee)
```

---

## 3. Detailed Functional Modules

### Module A: Universal Public Parent Pay Portal (`/pay` & `/pay/:schoolSlug`)

1. **School Selector / Search:**
   - Universal search across all onboarded schools (e.g. typing *"Bright"* suggests *"Bright Future Academy, Ikeja"*).
   - **Direct Shortcut URLs:** Schools receive a branded short link (e.g., `rantapay.ng/pay/bright-future`) that pre-selects the school automatically when shared on class WhatsApp groups.

2. **Zero-Login Student Lookup:**
   - Parent inputs the child's **Admission Number**, **Student Name**, or **Parent Phone**.
   - Pulls live student data, class level, academic session, and current fee status.

3. **Multi-Item Fee Catalog (Not Just Tuition):**
   - **Mandatory Academic Fees:** Tuition, Examinations, Boarding, Development levy.
   - **School Store & Add-on Levies:** Textbooks, Workbooks, Uniform sets, Sportswear, Excursion tickets, Science lab practical fees, PTA dues.
   - Flexible checkout: pay for tuition alone, individual textbooks, or combine everything into a single payment.

4. **Optional Payer Email for Direct Receipt Delivery:**
   - **Zero Friction:** Parents can pay without an email address and immediately view/download/print the official receipt on screen.
   - **Direct Delivery Option:** Parents can optionally enter an email address to have the official branded PDF receipt delivered to their email inbox.

5. **Multi-Rail Nigerian Checkout (Paystack):**
   - **Direct Bank Transfer:** Instant 30-minute dedicated virtual account for transfer via OPay, Kuda, GTBank, etc.
   - **Debit Cards:** Mastercard, Visa, Verve.
   - **USSD:** Direct bank dial codes (`*737#`, `*901#`, etc.).

6. **Admission-Linked Newsletter & Updates Subscription:**
   - Parents can subscribe to school updates directly on the public site by providing:
     - Guardian Email Address & Phone Number
     - **Child's Admission ID (Required):** Explicitly links the parent to their child.
   - Enables **Targeted School Communications**:
     - General updates regarding upcoming terms, textbook lists, or excursion supplies.
     - **Targeted Defaulter Bulletins:** When a student has an outstanding balance, the school can broadcast a targeted notification specifically to those parents, without bothering parents whose fees are already settled.

---

### Module B: School Bursar & Admin Operating System (`/school/dashboard`)

*Each onboarded school operates in a completely secure, tenant-isolated workspace.*

1. **Term-by-Term Income Analytics:**
   - Visual dashboard monitoring gross revenue collected vs. expected revenue for First Term, Second Term, and Third Term.
   - Revenue stream breakdown: Tuition vs. Textbooks vs. Uniforms vs. Extra levies.
   - Class-by-class debt distribution (identifying which classes have the highest arrears).

2. **Student & Guardian Directory:**
   - Add students manually or via bulk roster upload.
   - Store student biodata, assigned class, and guardian contacts (name, email, phone).

3. **Fee Structuring & School Store Management:**
   - Mass-assign fees per class level in two clicks.
   - Create and price school store items (Textbooks, Uniforms, Excursions) with target classes.
   - Toggle partial payments on or off per school policy.

4. **Defaulter Ledger & 1-Click Mass Broadcast:**
   - Real-time debtor list of all students with outstanding balances.
   - 1-click trigger to blast personalized SMS/WhatsApp payment reminder links to all debtor parents at once.

5. **Official Receipts & Reports:**
   - All receipts carry the school's crest, physical address, and principal's authorized signature.
   - One-click PDF and Excel financial report generation for the Board of Governors.

---

### Module C: Ranta Pay Super Admin Control Room (`/admin/dashboard`)

*The central master dashboard for the Ranta Pay team.*

1. **School Onboarding & Lifecycle Management:**
   - **Register New School:** Input school name, slug, physical address, contact details, and principal name.
   - **Corporate Bank Verification:** Input bank name and 10-digit NUBAN account number. System calls NIBSS via Paystack (`/bank/resolve`) to verify the official corporate account name.
   - **Subaccount Provisioning:** One-click automated creation of the Paystack Subaccount (`/subaccount`).
   - **Publishing:** Toggle school status (`Active`, `Pending Review`, `Suspended`). Active schools immediately appear on the universal parent search.

2. **Platform Financials & GMV Analytics:**
   - Gross Merchandise Value (GMV): Total transaction volume processed across all schools nationwide.
   - Net Platform Revenue: Total Ranta Pay commission earned from transaction splits.
   - Active school counts, total students onboarded, and payment success velocity.

3. **Global Audit & Support Tools:**
   - Search any transaction across the entire network by Paystack reference or receipt number.
   - Resend receipts, inspect webhook logs, and diagnose failed payment callbacks.

---

### Module D: Direct Settlement & Cross-Channel Synchronization

1. **Paystack Subaccounts (Direct Settlement):**
   - Every transaction specifies the school's `subaccount_code`.
   - **100% of school funds settle directly into the school's corporate bank account**. Ranta Pay never pools, touches, or holds school funds.
   - Platform commission (e.g., ₦150 convenience fee or 1%) is split automatically by the payment switch.

2. **Universal Real-Time Webhook Engine:**
   - Paystack sends HMAC-SHA512 signed `charge.success` webhooks to `POST /api/webhooks/paystack`.
   - Backend marks items as `PAID`, updates student balances, triggers automated Nodemailer email receipts, and pushes live updates to the Bursar's screen.

3. **WhatsApp & Web Central Database Sync:**
   - Both Web and WhatsApp share the exact same central PostgreSQL database.
   - If a parent pays via WhatsApp, opening the Web portal 5 seconds later immediately shows **"Status: PAID"** with the full transaction history.

---

## 4. Technology Stack Specification

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Web** | React 19, TypeScript, Vite, Tailwind CSS v4 | Universal parent portal, school dashboard, and super admin room |
| **UI Components** | Radix UI (shadcn/ui primitives), Lucide icons, Sonner | Premium fintech design system |
| **Data Visualization** | Recharts | Term-by-term income analytics, revenue streams, and class debt charts |
| **Backend Runtime** | Node.js + Express (TypeScript) | Multi-tenant REST API & Paystack webhook listeners |
| **Database** | PostgreSQL (with Drizzle ORM) | Multi-tenant relational schema (schools, students, payments, store items) |
| **Payment Gateway** | **Paystack** | Inline modal, dynamic virtual transfer accounts, and Subaccounts |
| **Email Delivery** | **Nodemailer (SMTP)** | Zero-cost branded PDF/HTML receipt delivery and newsletters |
| **SMS Notifications** | **Termii API** (with local mock driver) | Low-cost Nigerian transactional SMS for receipt alerts |
| **WhatsApp Engine** | **Twilio Sandbox / Baileys Agent** | Conversational bill inquiry, virtual account generation, and receipt delivery |
| **~~Enterprise Partner~~** | ~~*Velcro Integration*~~ | *(Deferred: to be integrated after the core system is fully operational)* |

---

*Document updated to reflect the complete 3-Tier Multi-Tenant Architecture.*
