import React, { ReactNode } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function CompactUserDetails({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="border rounded-md p-2 w-full grid gap-2">
      <h1 className="px-2">User details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full place-content-center gap-4 p-6 border rounded-md">
        {children}
      </div>
    </div>
  );
}
