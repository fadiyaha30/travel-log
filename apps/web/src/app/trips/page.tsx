"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import { useUser } from "@/lib/useUser";

export default function TripsPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!user.email_verified_at) router.replace("/verify-email");
  }, [loading, user, router]);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  if (loading || !user || !user.email_verified_at) {
    return (
      <main className="p-8">
        <p role="status">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-8 text-[#15202B]">
      <h1 className="text-3xl font-bold">My trips</h1>
      <p className="text-[#55606B]">
        Logged in as {user.name} ({user.email})
      </p>
      <button
        type="button"
        onClick={logout}
        className="h-11 w-fit rounded-xl border border-[#C9CEC8] bg-white px-5 font-semibold"
      >
        Log out
      </button>
    </main>
  );
}
