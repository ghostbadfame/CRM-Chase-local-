"use client";
import { Calendar, Sidebar, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidenavBtn from "./sidenav-btn";

function CustomerSideNav() {
  const path = usePathname().split("/").pop();
  console.log(path);
  return (
    <>
      <SidenavBtn active={!path}>
        <Sidebar className="w-4 h-4" />
        <Link href={"/"} className="w-full text-start">
          Dashboard
        </Link>
      </SidenavBtn>
      <div className="text-gray-400 text-sm font-medium w-full px-4">tabs</div>
      <div className="flex-col gap-2 flex">
        <SidenavBtn active={path == "scheduled-calls"}>
          <Calendar className="w-4 h-4" />
          <Link
            href={"/Customer/scheduled-calls"}
            className="w-full text-start"
          >
            Scheduled Calls
          </Link>
        </SidenavBtn>
      </div>
    </>
  );
}

export default CustomerSideNav;
