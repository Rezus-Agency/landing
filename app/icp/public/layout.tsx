import { ToastHost } from "@/components/icp-tool/ui/ToastProvider";
import "../tool/_tool.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastHost />
    </>
  );
}
