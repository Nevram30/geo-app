"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = () => {
    void signOut({ callbackUrl: "/signin" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
    >
      Sign Out
    </button>
  );
}
