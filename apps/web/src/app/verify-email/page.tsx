"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function resend() {
    setStatus("sending");
    try {
      await api("/api/auth/email/verification-notification", { method: "POST" });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AuthShell
      title="Check your inbox"
      subtitle="We sent a link to verify your email address. Open it in this browser to continue."
    >
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={resend}
          disabled={status === "sending"}
          className="h-12 rounded-xl border border-[#C9CEC8] bg-white font-semibold disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send the link again"}
        </button>
        <p role="status" className="min-h-5 text-sm text-[#55606B]">
          {status === "sent" && "A new link is on its way."}
          {status === "error" && "Couldn't send the email. Please try again."}
        </p>
        <Link href="/trips" className="text-center text-sm font-semibold text-[#1E58C9]">
          I’ve verified my email
        </Link>
      </div>
    </AuthShell>
  );
}
