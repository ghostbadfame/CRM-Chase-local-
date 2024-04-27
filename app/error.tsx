"use client";

import { LucideServerCrash } from "lucide-react";

export default function Error({ error }: { error: any }) {
  console.log(error);
  return (
    <div className="grid h-[90vh] place-content-center">
      <div className="flex gap-2 font-medium">
        <LucideServerCrash /> Error occurred!!
      </div>
    </div>
  );
}
