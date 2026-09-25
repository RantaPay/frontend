import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/brand-logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { setAuthSession } from "@/lib/auth";
import { apiPost } from "@/lib/api";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  usePageTitle("Platform Super Admin Login : Ranta Pay");
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@rantapay.ng");
  const [pwd, setPwd] = useState("supersecret");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) return toast.error("Please enter credentials.");
    setIsSubmitting(true);
    try {
      const res = await apiPost("/api/admin/auth/login", {
        email: email.trim(),
        password: pwd,
      });

      if (res.success && res.data) {
        setAuthSession(res.data.token, res.data.user);
        toast.success("Welcome to Ranta Pay Platform Operations.");
        nav("/admin/dashboard");
      } else {
        toast.error("Super Admin authentication failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid Super Admin credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="group inline-flex items-center">
            <BrandLogo showText size="md" />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> Home
            </Link>
          </Button>
        </div>

        <Card className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <h1 className="text-lg font-bold text-foreground">Super Admin Operations</h1>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Platform control room for school onboarding, NIBSS bank verification, and network analytics.
          </p>

          <form className="mt-5 space-y-4 text-xs" onSubmit={submit}>
            <div>
              <Label htmlFor="admin-email">Platform Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 text-xs"
                required
              />
            </div>

            <div>
              <Label htmlFor="admin-pwd">Master Password</Label>
              <Input
                id="admin-pwd"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="mt-1 h-10 text-xs"
                required
              />
            </div>

            <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
              Access Super Admin Terminal
            </Button>
          </form>

          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
            Operator access: Click sign in to open the onboarding and network management console.
          </div>
        </Card>
      </div>
    </div>
  );
}
