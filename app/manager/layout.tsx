import React, { ReactNode } from "react";

export default function EngineerLayout({ children }: { children: ReactNode }) {
  return <div className="md:p-8 p-4">{children}</div>;
}
