"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ToolRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/icp/tool/dashboard");
  }, [router]);
  return null;
}
