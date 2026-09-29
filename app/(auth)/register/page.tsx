"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { registerSchema } from "@/lib/validations/auth";

function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get("name") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string || undefined,
      password: fd.get("password") as string,
      confirmPassword: fd.get("confirmPassword") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Registration failed", data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      toast.success("Welcome!", "Your account has been created successfully. Logging you in...");
      
      const loginRes = await signIn("credentials", {
        identifier: parsed.data.phone || parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.error("Login failed", "Please log in manually");
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error", "Could not connect to the server");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 relative overflow-hidden bg-gradient-to-br from-[#FFF0F0] via-[#FFE5D9] to-[#FFD6BA]">
      {/* Decorative colorful blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-primary-light)]/20 blur-[100px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-accent-light)]/40 blur-[100px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 inline-block animate-float drop-shadow-md">✨</span>
          <h1 className="font-display text-3xl font-bold text-[var(--color-text)] bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-accent-dark)]">
            Create an Account
          </h1>
          <p className="text-sm font-medium text-[var(--color-text-muted)] mt-2">
            Join us to purchase premium fireworks
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(185,28,28,0.15)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(185,28,28,0.2)]"
        >
          <div className="flex flex-col gap-5">
            <Input
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name}
              required
              autoFocus
            />
            <Input
              name="phone"
              label="Phone Number"
              placeholder="10-digit mobile number"
              error={errors.phone}
              required
            />
            <Input
              name="email"
              label="Email Address (Optional)"
              type="email"
              placeholder="Enter your email"
              error={errors.email}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              error={errors.password}
              required
            />
            <Input
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              required
            />
            <Button
              type="submit"
              isLoading={loading}
              className="w-full mt-2"
              size="lg"
            >
              Create Account
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-[var(--color-text-muted)] mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-semibold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
