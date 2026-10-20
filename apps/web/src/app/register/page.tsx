"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Field } from "@/components/Field";
import { api, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api("/api/auth/register", { method: "POST", body: form });
      router.push("/verify-email");
    } catch (error) {
      if (error instanceof ApiError && error.status === 422) {
        setErrors(error.errors);
      } else {
        setErrors({ form: ["Something went wrong. Please try again."] });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Your diary stays private unless you share it.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Field id="name" label="Name" value={form.name} onChange={update("name")} error={errors.name?.[0]} autoComplete="name" />
        <Field id="email" label="Email" type="email" value={form.email} onChange={update("email")} error={errors.email?.[0]} autoComplete="email" />
        <Field
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          error={errors.password?.[0]}
          hint="At least 8 characters"
          autoComplete="new-password"
        />
        <Field
          id="password_confirmation"
          label="Confirm password"
          type="password"
          value={form.password_confirmation}
          onChange={update("password_confirmation")}
          autoComplete="new-password"
        />
        {errors.form && (
          <p role="alert" className="text-sm text-[#A3261B]">
            {errors.form[0]}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-12 rounded-xl bg-[#1E58C9] font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[#55606B]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#1E58C9]">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
