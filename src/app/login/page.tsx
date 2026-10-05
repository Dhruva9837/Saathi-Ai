"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <AuthModal
        isOpen={true}
        onClose={() => router.push("/")}
        onSuccess={() => router.push("/dashboard")}
      />
    </div>
  );
}
