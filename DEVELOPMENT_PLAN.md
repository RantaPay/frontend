# Ranta Pay — Master Development Plan (Multi-Tenant Platform)

> **Multi-Tenant School Billing Network & Bursary Operating System**  
> Roadmap from Frontend 5-Star Standard to Production Node.js/PostgreSQL Backend

---

## 1. Project Overview & 3-Tier Architecture

Ranta Pay operates as a **Centralized Multi-Tenant FinTech Platform** for Nigerian schools, structured into three distinct portals sharing a unified backend and database:

```
                            [ RANTA PAY CENTRAL ENGINE ]
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  [ PORTAL 1: PARENTS ]        [ PORTAL 2: SCHOOL BURSAR ]    [ PORTAL 3: SUPER ADMIN ]
   Route: `/pay`                Route: `/school/dashboard`     Route: `/admin/dashboard`
   - Zero-signup search         - Manage Students & Classes    - Onboard & Approve Schools
   - Select registered school   - School Store (Books/Uniform) - Bank Resolve & Subaccounts
   - Pay Tuition & Store items  - Termly Income Analytics      - Track Global Platform GMV
   - Optional email for receipt - 1-Click WhatsApp/SMS Remind  - Monitor Ranta Pay Revenue
   - Paystack Direct Settlement - Export Financial Reports     - Network Health & Audit
```

### Confirmed Technology Stack

| Layer | Chosen Technology | Description / Justification |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19, TypeScript, Vite** | High-performance single-page app housing all three portals. |
| **Styling & Design** | **Tailwind CSS v4 + OKLCH Tokens** | Modern color space, glassmorphism, responsive mobile-first views. |
| **Component Primitives**| **Radix UI (shadcn/ui), Lucide, Sonner** | Accessible, robust modals, dropdowns, switches, and toasts. |
| **Data Visualization** | **Recharts** | Term-by-term income analytics, revenue streams, and class debt charts. |
| **Backend Runtime** | **Node.js + Express + TypeScript** | Type-safe, fast setup, unified types with the frontend. |
| **Database** | **PostgreSQL** | Multi-tenant relational schema (hosted on Neon or local PostgreSQL). |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe SQL query builder and schema migrations. |
| **Payment Gateway** | **Paystack** | Inline modal, dynamic virtual bank accounts, and Subaccounts (direct settlement). |
| **Email Delivery** | **Nodemailer (SMTP)** | Zero-cost official branded PDF/HTML receipt delivery and newsletters. |
| **SMS Notifications** | **Termii API** (with local mock driver) | Low-cost Nigerian transactional SMS for receipt alerts. |
| **WhatsApp Engine** | **Twilio Sandbox / Baileys Agent** | Conversational bill inquiry, virtual account generation, and receipt delivery. |
| **~~Enterprise Engine~~**| ~~*Velcro Integration*~~ | *(Deferred: to be integrated after the core system is fully operational).* |

---

## 2. Phased Development Roadmap

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │ PHASE 1: FRONTEND 5-STAR REWORK & 3-TIER PORTAL WORKFLOW (STARTING)    │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ PHASE 2: NODE.JS / EXPRESS / TYPESCRIPT BACKEND & POSTGRESQL DATABASE  │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ PHASE 3: AUTOMATED NOTIFICATIONS, NODEMAILER & DUE-DATE REMINDERS     │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼────────────────────────────────────┐
  │ PHASE 4: FULL SYSTEM INTEGRATION, QR VERIFICATION & PRODUCTION AUDIT   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Frontend 5-Star Rework & 3-Tier Portals

*Objective: Elevate the UI/UX to premium international fintech standards and establish all three portals with complete interactive workflows.*

### Milestone 1.1: Universal Design System & Visual Polish
- [ ] Implement a rich, curated color palette using Tailwind v4 OKLCH tokens (Deep Trust Blue, Emerald Success Green, Clean Slate).
- [ ] Add smooth micro-animations, glassmorphic headers, subtle borders, and modern typography.
- [ ] Ensure flawless mobile responsiveness across smartphone viewports (where 80%+ of Nigerian parents browse).

### Milestone 1.2: Portal 1 — Universal Public Parent Pay Portal (`/pay`)
- [ ] **School Selector:** Searchable dropdown or autocomplete to pick from registered schools (e.g. *"Bright Future Academy"*), with support for direct shortcut links (`/pay/:schoolSlug`).
- [ ] **Student Search:** Zero-login search by Admission Number, Name, or Phone.
- [ ] **School Store & Multi-Item Cart:**
  - **Tab 1: Term Tuition & Mandatory Fees** (Tuition, Exam, Boarding).
  - **Tab 2: School Store & Add-on Levies** (Textbooks, Workbooks, Uniform sets, Excursions, PTA dues).
  - Parents can pay for single items or bundle items with tuition into a single checkout.
- [ ] **Optional Payer Email Field:** Parents can optionally provide an email address for direct PDF receipt delivery.
- [ ] **Admission-Linked Newsletter Subscription Widget:** Parents provide Email, Phone, and Child's Admission ID to receive general updates and targeted unpaid fee notices.

### Milestone 1.3: Portal 2 — School Bursar Dashboard (`/school/dashboard`)
- [ ] **Term-by-Term Income Analytics:** Interactive Recharts visual comparing First Term, Second Term, and Third Term revenue.
- [ ] **Revenue Stream Distribution Chart:** Visual breakdown (Tuition vs. Books vs. Uniform vs. Extra levies).
- [ ] **Debtor Ledger & 1-Click Broadcast:** Table of unpaid students with a 1-click button to trigger simulated/real broadcast reminders.
- [ ] **Class Fee & Store Item Manager:** Create fee schedules and price store items (textbooks, uniforms) for specific classes.

### Milestone 1.4: Portal 3 — Ranta Pay Super Admin Control Room (`/admin/dashboard`)
- [ ] **School Onboarding Manager:**
  - Form to register a new school: Name, slug, address, contact, and corporate bank details (NUBAN & Bank).
  - Action button: **"Verify Bank Account & Provision Paystack Subaccount"**.
  - School status switch (`Active` vs. `Pending Review` vs. `Suspended`).
- [ ] **Platform GMV & Commission Tracker:**
  - Total network volume processed across all schools.
  - Total Ranta Pay commissions earned.
  - Active schools count, total enrolled students, and payment success rates.

### Milestone 1.5: Interactive In-Browser WhatsApp Payment Simulator
- [ ] Embed an interactive smartphone simulator widget on the website.
- [ ] Allows judges, clients, and testers to experience the conversational WhatsApp payment flow live in the browser without needing a phone.

---

## Phase 2: Node.js + Express + TypeScript Backend & PostgreSQL

*Objective: Establish a robust, multi-tenant database and API architecture.*

### Milestone 2.1: Server Setup & Multi-Tenant PostgreSQL Schema
- [ ] Initialize Node.js + Express + TypeScript project in `ranta-pay-server/`.
- [ ] Configure Drizzle ORM and connect to PostgreSQL database.
- [ ] Define normalized multi-tenant tables:
  - `schools` (ID, name, slug, bank_name, account_number, paystack_subaccount_code, status).
  - `students` (ID, school_id, admission_number, name, class_name, guardian contacts).
  - `fee_items` (ID, school_id, category: mandatory vs. store, title, amount, class_name).
  - `payments` (ID, school_id, receipt_number, student_id, amount, channel, reference, payer_email, status).
  - `newsletter_subscribers` (ID, school_id, admission_number, guardian_email, guardian_phone).

### Milestone 2.2: REST API Endpoints
- [ ] `GET /api/schools`: Public endpoint returning active schools for the parent picker.
- [ ] `POST /api/admin/schools`: Super Admin school onboarding and Paystack subaccount generation.
- [ ] `GET /api/schools/:schoolId/students/search?q=`: Query students within a specific school.
- [ ] `POST /api/newsletters/subscribe`: Register guardian email/phone linked to child admission ID.

### Milestone 2.3: Paystack Payment Engine & Subaccounts
- [ ] `POST /api/paystack/resolve-bank`: Resolve corporate bank account with NIBSS.
- [ ] `POST /api/paystack/create-subaccount`: Generate the school's Paystack subaccount code.
- [ ] `POST /api/payments/initialize`: Initialize Paystack transaction with split routing (`subaccount_code`).
- [ ] `POST /api/webhooks/paystack`: HMAC-SHA512 verified webhook listener that marks payments as `PAID` in the database.

---

## Phase 3: Notifications, Nodemailer & Cron Services

*Objective: Automate communications so bursars never manually chase payments.*

### Milestone 3.1: Nodemailer Service (Email Receipts)
- [ ] Configure Nodemailer with SMTP transport.
- [ ] Create a branded HTML email template carrying the specific school's crest and payment details.
- [ ] Automatically fire receipt emails upon successful Paystack webhook execution when payer email is present.

### Milestone 3.2: Ahead-of-Time Due Date Reminder Cron
- [ ] Implement a daily background job (via `node-cron` or BullMQ).
- [ ] Query students with outstanding balances against school term fee deadlines:
  - **14 Days Ahead:** Early reminder and bill breakdown.
  - **3 Days Ahead:** Urgent reminder with 1-click smart payment link.

### Milestone 3.3: Termii SMS & WhatsApp Bot Controller
- [ ] Integrate Termii SMS API driver with local fallback logging.
- [ ] Setup webhook listener for WhatsApp conversational flow.

---

## Phase 4: Anti-Fraud Verification & Final Polish

*Objective: Security hardening and end-to-end audit.*

### Milestone 4.1: Dynamic QR Code Verification Page
- [ ] Receipts feature a scannable QR code linking to `https://rantapay.ng/verify/:receiptId`.
- [ ] Provides an instant green/red verification screen for school gatekeepers during exam week.

### Milestone 4.2: End-to-End Testing & Verification
- [ ] Test complete lifecycle: Super Admin onboards school $\to$ Parent picks school and pays for textbook + tuition $\to$ Paystack splits funds $\to$ Nodemailer delivers receipt $\to$ School Bursar dashboard updates live.
- [ ] Verify database consistency and multi-tenant isolation.

---

*Plan updated to master 3-tier multi-tenant specification.*
