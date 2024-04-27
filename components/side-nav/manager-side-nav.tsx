"use client";
import { Sidebar, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidenavBtn from "./sidenav-btn";
import { useSession } from "next-auth/react";

function ManagerSideNav() {
  const path = usePathname().split("/").pop();
  const { data: session } = useSession();

  return (
    <>
      <div className="flex flex-col px-2">
        <SidenavBtn active={!path}>
          <Sidebar className="w-4 h-4" />
          <Link href={"/"} className="w-full text-start">
            Dashboard
          </Link>
        </SidenavBtn>
      </div>
      <div className="text-gray-400 text-sm font-medium w-full p-4">Leads</div>
      <div className="flex-col gap-2 flex px-2">
        <SidenavBtn active={path == "assigned-leads"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/assigned-leads"} className="w-full text-start">
            Assigned Leads
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "leads"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/leads"} className="w-full text-start">
            All Leads
          </Link>
        </SidenavBtn>
      </div>
      <div className="text-gray-400 text-sm font-medium w-full p-4">
        Channel partners
      </div>
      <div className="flex-col gap-2 flex px-2">
        <SidenavBtn active={path == "channel-partner"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/channel-partner"} className="w-full text-start">
            All Channel Partners
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "assigned-channel-partners"}>
          <Users className="w-4 h-4" />
          <Link
            href={"/manager/assigned-channel-partners"}
            className="w-full text-start"
          >
            Assigned Channel Partners
          </Link>
        </SidenavBtn>
      </div>
      <div className="text-gray-400 text-sm font-medium w-full p-4">
        Employees
      </div>
      <div className="flex-col gap-2 flex px-2">
        <SidenavBtn active={path == "telecallers"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/telecallers"} className="w-full text-start">
            Telecallers
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "designers"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/designers"} className="w-full text-start">
            Designers
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "engineers"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/engineers"} className="w-full text-start">
            Engineers
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "technicians"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/technicians"} className="w-full text-start">
            Technicians
          </Link>
        </SidenavBtn>
        <SidenavBtn active={path == "marketing"}>
          <Users className="w-4 h-4" />
          <Link href={"/manager/marketing"} className="w-full text-start">
            Marketing
          </Link>
        </SidenavBtn>
      </div>
      <div className="text-gray-400 text-sm font-medium w-full p-4">
        Add users
      </div>
      <div className="flex-col gap-2 flex px-2">
        <SidenavBtn active={path == "new-lead"}>
          <Users className="w-4 h-4" />
          <Link href={"/new-lead"} className="w-full text-start">
            Add new lead
          </Link>
        </SidenavBtn>
        {session?.user.role === "ADMIN" ? (
          <>
            <SidenavBtn active={path == "new-channel-partner"}>
              <Users className="w-4 h-4" />
              <Link
                href={"/manager/new-channel-partner"}
                className="w-full text-start"
              >
                Add channel partner
              </Link>
            </SidenavBtn>
            <SidenavBtn active={path == "new-employee"}>
              <Users className="w-4 h-4" />
              <Link
                href={"/manager/new-employee"}
                className="w-full text-start"
              >
                Add new employee
              </Link>
            </SidenavBtn>
          </>
        ) : null}
      </div>
    </>
  );
}

export default ManagerSideNav;
