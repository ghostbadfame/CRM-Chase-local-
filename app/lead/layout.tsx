import React, { ReactNode } from "react";

export default function LeadLayout({ children }: { children: ReactNode }) {
  return <div className="p-8">{children}</div>;
}
