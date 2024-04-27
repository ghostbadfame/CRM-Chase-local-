"use client";
import DashboardCard from "@/components/dashboard/dashboard-card";
import CompactScheduledCallsTable from "./compact-scheduled-calls-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CompactUserDetails from "./compact-user-details";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Icons } from "../icons";
import { toast } from "sonner";
import CompactEmployeeStats from "../employee-stats-compact";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function EmployeeDashboard() {
  const { data: session } = useSession();
  let totalLeadsCount = {
    total: 0,
    done: 0,
    pending: 0,
  };
  let userDetails = {
    empNo: "",
    reportingManager: "",
  };

  let engineerData: any = [];
  let designerData: any = [];

  const loader = (
    <div className="flex justify-center items-center">
      {<Icons.spinner className="animate-spin" />}
    </div>
  );
  const {
    data: fetchTotalLeadsCount,
    isLoading: isLeadCountLoading,
    error: leadCountError,
  } = useSWR(`/api/getTotalLeadsCount?empId=` + session?.user.userId, fetcher);
  const {
    data: fetchUserDetails,
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
  } = useSWR(`/api/getUserDetails?email=${session?.user.email}`, fetcher);
  const {
    data: fetchEmployeeData,
    isLoading: isEmployeeDataLoading,
    error: employeeDataError,
  } = useSWR("/api/getLazyEmployee", fetcher);
  designerData = fetchEmployeeData?.combinedDesignerData;
  engineerData = fetchEmployeeData?.combinedEngineerData;

  totalLeadsCount = fetchTotalLeadsCount || totalLeadsCount;
  userDetails = fetchUserDetails || userDetails;

  if (userDetailsError || leadCountError) {
    toast("⚠️ error occurred while fetching the latest data!!");
  }

  console.log(userDetails);
  return (
    <div className="flex-1 md:p-8">
      {(isLeadCountLoading || isUserDetailsLoading) && loader}
      {(!isLeadCountLoading || !isUserDetailsLoading) && (
        <div className="grid gap-4 md:gap-6 max-w-2xl w-full mx-auto grid-cols-1 p-2">
          <div className="md:text-2xl lg:text-3xl text-lg font-semibold">
            Today&apos;s Leads
          </div>
          <div className="flex md:gap-8 gap-2 w-full md:justify-between">
            <DashboardCard
              href="/assigned-leads"
              title={"Assigned"}
              desc="of the day!"
              progress={totalLeadsCount.total}
            />
            <DashboardCard
              href="/attended-leads"
              title={"Done"}
              desc="of the day!"
              progress={totalLeadsCount.done}
              textColor="text-green-500"
            />
            <DashboardCard
              href="/pending-leads"
              title={"Pending"}
              desc="of the day!"
              progress={totalLeadsCount.pending}
              textColor="text-red-500"
            />
          </div>
          <div className="grid md:gap-8 w-full">
            <CompactUserDetails>
              <div className="grid gap-2">
                <Label htmlFor="employeeNo">Employee ID</Label>
                <Input
                  type="text"
                  disabled
                  id="employeeNo"
                  placeholder="Employee ID"
                  value={userDetails?.empNo}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Reporting Manager</Label>
                <Input
                  type="text"
                  disabled
                  id="manager"
                  placeholder="Reporting Manager"
                  value={userDetails?.reportingManager}
                />
              </div>
            </CompactUserDetails>
          </div>
          {session?.user.userType == "telecaller" && (
            <>
              <div className="grid gap-8 w-full">
                {engineerData?.length > 0 && (
                  <CompactEmployeeStats
                    title="Engineers"
                    desc="List of all engineer with pending tasks."
                    data={engineerData}
                  />
                )}
              </div>
              <div className="grid gap-8 w-full">
                {designerData?.length > 0 && (
                  <CompactEmployeeStats
                    title="Designers"
                    desc="List of all designer with pending tasks."
                    data={designerData}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
