"use client";
import { Calendar, Sidebar, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidenavBtn from "./sidenav-btn";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function EmployeeSideNav({ employeeType }: { employeeType: string }) {
  const { data: session } = useSession();
  const {
    data: fetchUserDetails,
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
  } = useSWR(`/api/getUserDetails?email=${session?.user.email}`, fetcher);

  const path = usePathname().split("/").pop();

  const empNo = fetchUserDetails?.empNo;

  

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
      <div className="text-gray-400 text-sm font-medium w-full p-4">Tabs</div>
      <div className="flex-col gap-2 flex">
        <SidenavBtn active={path == "total-leads"}>
          <Users className="w-4 h-4" />
          <Link
            href={
              employeeType != "marketing"
                ? `/total-leads`
                : `/marketing-employee/${empNo}/employee-leads`
            }
            className="w-full text-start"
          >
            Total leads
          </Link>
        </SidenavBtn>
        {employeeType != "marketing" && (
          <>
            
            <SidenavBtn active={path == "scheduled-calls"}>
              <Calendar className="w-4 h-4" />
              <Link href={`/assigned-leads`} className="w-full text-start">
                Todays Calls
              </Link>
            </SidenavBtn>
            {employeeType == "telecaller" && (
              <SidenavBtn active={path == "new-lead"}>
                <Calendar className="w-4 h-4" />
                <Link href={"/new-lead"} className="w-full text-start">
                  Add New Lead
                </Link>
              </SidenavBtn>
            )}
            
          </>
        )}
      </div>
    </>
  );
}

export default EmployeeSideNav;
