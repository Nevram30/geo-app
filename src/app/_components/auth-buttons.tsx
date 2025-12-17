"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthButtons() {
  const pathname = usePathname();

  if (pathname === "/signin") {
    return (
      <Link
        href="/register"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Register as Applicant
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/signin"
        className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Register as Applicant
      </Link>
    </div>
  );
}
