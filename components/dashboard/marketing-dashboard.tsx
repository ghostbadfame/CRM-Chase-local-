"use client";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CompactUserDetails from "./compact-user-details";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Loading from "../loading";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function MarketingDashboard() {
  const { data: session } = useSession();

  let userDetails = {
    empNo: "",
    reportingManager: "",
  };

  const {
    data: fetchUserDetails,
    isLoading: isUserDetailsLoading,
    error: userDetailsError,
  } = useSWR(`/api/getUserDetails?email=${session?.user.email}`, fetcher);

  const {
    data: empLeadData,
    isLoading: empLeadDataLoading,
    error: empLeadDataError,
  } = useSWR(
    fetchUserDetails?.empNo
      ? "/api/getMarketingEmpLeadsCount?empNo=" + fetchUserDetails.empNo
      : null,
    fetcher
  );

  userDetails = fetchUserDetails || userDetails;

  useEffect(() => {
    mutate("/api/getMarketingEmpLeadsCount?empNo=" + userDetails.empNo);
  }, [fetchUserDetails]);

  if (userDetailsError || empLeadDataError) {
    toast("⚠️ error occurred while fetching the latest data!!");
  }

  return (
    <div className="md:p-8 p-2 justify-center items-center gap-8 flex flex-col w-fit mx-auto">
      <div className="flex-col justify-center items-start gap-6 flex w-full">
        {empLeadDataLoading || (isUserDetailsLoading && <Loading />)}
        <div className="text-3xl w-full font-semibold">
          Marketing employee details
        </div>
        <div className="flex w-full">
          <DashboardCard
            progress={empLeadData?.leads}
            title="Total Leads"
            desc="added by the employee!"
            href={
              "/marketing-employee/" + userDetails?.empNo + "/employee-leads"
            }
          />
        </div>
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
    </div>
  );
}

export default MarketingDashboard;
