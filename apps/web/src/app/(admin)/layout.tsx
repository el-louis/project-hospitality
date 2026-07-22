import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary">
      {children}
    </div>
  );
}
