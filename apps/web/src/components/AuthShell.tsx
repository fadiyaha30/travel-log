import type { ReactNode } from "react";

type Props = { title: string; subtitle?: string; children: ReactNode };

export function AuthShell({ title, subtitle, children }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F4F1] p-6 text-[#15202B]">
      <div className="w-full max-w-sm">
        <p className="mb-10 text-xl font-bold">Travel Log</p>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-[#55606B]">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
