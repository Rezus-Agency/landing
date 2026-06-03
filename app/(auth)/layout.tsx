import { ToastHost } from "@/components/icp-tool/ui/ToastProvider";
import "../icp/tool/_tool.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main" tabIndex={-1} className="auth">
        {children}
      </main>
      <ToastHost />
    </>
  );
}
