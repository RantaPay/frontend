# Ranta Pay — Frontend

## What is Ranta Pay?

**Ranta Pay** is a modern financial operating system and tuition billing platform built specifically for primary and secondary schools across Nigeria.

Traditional school fee collection is plagued by manual bank deposits, lost paper tellers, fake clearance receipts, and stressful end-of-term reconciliations. Ranta Pay solves this by giving schools a complete digital infrastructure: parents can verify and pay fees online in seconds, funds settle directly into the school's bank account, and students receive tamper-proof, QR-verifiable payment receipts for gate clearance.

---

## What the Frontend Handles

This repository contains the client-side single-page application (SPA). It is organized around three primary user experiences:

### 1. Public Parent & Student Payment Portal
- **Student Lookup**: Fast search by admission number, name, or phone without requiring parent registration.
- **Itemized Fee Selection**: Transparent breakdown of term tuition, curriculum textbooks, uniforms, and PTA levies, with support for school-defined partial payment policies.
- **Seamless Checkout**: Direct settlement through cards, bank transfers, USSD, and mobile channels.
- **Instant Digital Clearance**: Dynamic, print-ready receipts with cryptographic QR codes for class and gate verification.

### 2. Bursar OS (Institution Dashboard)
- **Executive Revenue Metrics**: Real-time visibility into billed tuition, collected revenue, outstanding debts, and collection rates.
- **Student Ledger Management**: Complete roster tracking, class debt distribution, and student-level payment histories.
- **Fee Configuration & Store**: Tools to define compulsory term fees, optional curricular items, and class-scoped items.
- **Debt Broadcasts**: 1-click automated reminder dispatch to debtor parents.

### 3. Super Admin Platform Control Room
- **Network Overview**: Cross-institutional tracking of gross payment volume (GMV) and transaction success rates.
- **School Onboarding & Bank Resolution**: Live NIBSS bank account validation to verify institution accounts before activating direct settlements.
- **Partner School Management**: Directory of registered institutions with status toggling (`Active` / `Suspended`).
- **Integration Applications**: Review queue for inbound school onboarding applications.

---

## Tech Stack & Architecture

- **Framework**: React 18 with Vite
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design tokens
- **Icons & Charts**: Lucide React & Recharts
- **State & Data Layer**: Reactive store with client-side caching and live PostgreSQL synchronization via centralized API client (`@/lib/api.ts`).

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)
- Running Ranta Pay Backend (`http://localhost:5000`)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional, defaults to http://localhost:5000)
cp .env.example .env

# 3. Start local development server
npm run dev
```

The frontend will run at `http://localhost:5173`.

### Key Commands

- `npm run dev`: Launch local Vite development server with HMR.
- `npm run build`: Compile TypeScript and build production bundle into `dist/`.
- `npm run preview`: Preview the production build locally.
