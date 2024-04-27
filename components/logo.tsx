import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className }: { className?: string }) {
  return (
    <span className="font-semibold relative select-none grid place-content-center">
      <Image
        src={"/logo-light.png"}
        alt={"logo"}
        width={120}
        height={10}
        priority={true}
        className={cn("block dark:hidden select-none", className)}
      />
      <Image
        src={"/logo-dark.png"}
        alt={"logo"}
        width={120}
        height={10}
        priority={true}
        className={cn("hidden dark:block select-none", className)}
      />
    </span>
  );
}
