import { ToolShell } from "@/components/icp-tool/shell/ToolShell";
import "./_tool.css";

export default function ICPToolLayout({ children }: { children: React.ReactNode }) {
  return <ToolShell>{children}</ToolShell>;
}
