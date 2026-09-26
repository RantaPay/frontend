import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";

// Public Parent Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import SchoolRegister from "@/pages/SchoolRegister";
import PayPortal from "@/pages/PayPortal";
import PayStudent from "@/pages/PayStudent";
import Receipt from "@/pages/Receipt";
import VerifyReceipt from "@/pages/VerifyReceipt";
import SubscribeNewsletter from "@/pages/SubscribeNewsletter";
import NotFound from "@/pages/NotFound";

// School Bursar Dashboard Pages
import Overview from "@/pages/dashboard/Overview";
import Students from "@/pages/dashboard/Students";
import Fees from "@/pages/dashboard/Fees";
import Payments from "@/pages/dashboard/Payments";
import Reports from "@/pages/dashboard/Reports";
import Settings from "@/pages/dashboard/Settings";

// Super Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { useAuth } from "@/lib/auth";
import { WhatsAppChatModal } from "@/components/whatsapp/WhatsAppChatModal";

function RequireBursarAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, isBursar, isSuperAdmin, ready } = useAuth();
  if (!ready) return null;
  if (!isAuthed || (!isBursar && !isSuperAdmin)) {
    return <Navigate to="/school/login" replace />;
  }
  return <>{children}</>;
}

function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { isAuthed, isSuperAdmin, ready } = useAuth();
  if (!ready) return null;
  if (!isAuthed || !isSuperAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Tier 1: Public Parent Portal */}
        <Route path="/" element={<Landing />} />
        <Route path="/pay" element={<PayPortal />} />
        <Route path="/pay/:schoolSlug" element={<PayPortal />} />
        <Route path="/pay/:schoolSlug/:studentId" element={<PayStudent />} />
        <Route path="/receipt/:receiptId" element={<Receipt />} />
        <Route path="/verify" element={<VerifyReceipt />} />
        <Route path="/verify/:receiptId" element={<VerifyReceipt />} />
        <Route path="/subscribe" element={<SubscribeNewsletter />} />

        {/* Tier 2: School Bursar OS & Registration */}
        <Route path="/login" element={<Login />} />
        <Route path="/school/login" element={<Login />} />
        <Route path="/school/register" element={<SchoolRegister />} />
        <Route path="/register" element={<SchoolRegister />} />
        <Route
          path="/school/dashboard"
          element={
            <RequireBursarAuth>
              <Overview />
            </RequireBursarAuth>
          }
        />
        <Route
          path="/school/students"
          element={
            <RequireBursarAuth>
              <Students />
            </RequireBursarAuth>
          }
        />
        <Route
          path="/school/fees"
          element={
            <RequireBursarAuth>
              <Fees />
            </RequireBursarAuth>
          }
        />
        <Route
          path="/school/payments"
          element={
            <RequireBursarAuth>
              <Payments />
            </RequireBursarAuth>
          }
        />
        <Route
          path="/school/reports"
          element={
            <RequireBursarAuth>
              <Reports />
            </RequireBursarAuth>
          }
        />
        <Route
          path="/school/settings"
          element={
            <RequireBursarAuth>
              <Settings />
            </RequireBursarAuth>
          }
        />

        {/* Backward-compatibility aliases for existing dashboard links */}
        <Route path="/dashboard" element={<Navigate to="/school/dashboard" replace />} />
        <Route path="/dashboard/students" element={<Navigate to="/school/students" replace />} />
        <Route path="/dashboard/fees" element={<Navigate to="/school/fees" replace />} />
        <Route path="/dashboard/payments" element={<Navigate to="/school/payments" replace />} />
        <Route path="/dashboard/reports" element={<Navigate to="/school/reports" replace />} />
        <Route path="/dashboard/settings" element={<Navigate to="/school/settings" replace />} />

        {/* Tier 4: Super Admin Operations */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppChatModal />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}
