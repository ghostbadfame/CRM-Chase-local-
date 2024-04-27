"use client";
import DashboardCard from "@/components/dashboard/dashboard-card";
import DashboardGraph from "@/components/dashboard/dashboard-graph";
import CompactEmployeeStats from "@/components/employee-stats-compact";
import { toast } from "sonner";
import useSWR from "swr";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

interface LeadAnalytics {
  date: string;
  done: number;
  pending: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

function ManagerDashboard() {
  const { data: session } = useSession();
  let graphData: LeadAnalytics[] = [];
  let totalLeadsCount = {
    total: 0,
    done: 0,
    pending: 0,
  };
  let telecallerData: any = [];
  let technicianData: any = [];
  let engineerData: any = [];
  let designerData: any = [];
  let managerData: any = [];
  const {
    data: fetchGraphData,
    isLoading: isGraphDataLoading,
    error: graphDataError,
  } = useSWR("/api/getcountLeadsofweek", fetcher);
  const {
    data: fetchTotalLeadsCount,
    isLoading: isLeadCountLoading,
    error: leadCountError,
  } = useSWR(`/api/getTotalLeadsCount?empId=${session?.user.userId}`, fetcher);
  const {
    data: fetchEmployeeData,
    isLoading: isEmployeeDataLoading,
    error: employeeDataError,
  } = useSWR("/api/getLazyEmployee", fetcher);
  const loader = (
    <div className="flex justify-center items-center">
      {<Icons.spinner className="animate-spin" />}
    </div>
  );

  graphData = fetchGraphData?.result || [];
  totalLeadsCount = fetchTotalLeadsCount || totalLeadsCount;
  telecallerData = fetchEmployeeData?.combinedTelecallerData?.slice(0, 5);
  technicianData = fetchEmployeeData?.combinedTechnicianData?.slice(0, 5);
  designerData = fetchEmployeeData?.combinedDesignerData?.slice(0, 5);
  engineerData = fetchEmployeeData?.combinedEngineerData?.slice(0, 5);
  managerData = fetchEmployeeData?.combinedManagerData?.filter(
    (val: any) => val.username != session?.user.username
  );

  if (graphDataError || leadCountError || employeeDataError) {
    toast("⚠️ error occurred while fetching the latest data!!");
  }

  return (
    <div className="flex-1 p-2 md:p-8">
      {(isLeadCountLoading || isGraphDataLoading || isEmployeeDataLoading) &&
        loader}
      {(!isLeadCountLoading ||
        !isGraphDataLoading ||
        !isEmployeeDataLoading) && (
        <div className="grid gap-4 md:gap-6 max-w-2xl w-full mx-auto grid-cols-1 p-2">
          <div className="md:text-2xl lg:text-3xl text-lg font-semibold">
            Today&apos;s assigned leads
          </div>
          <div className="flex md:gap-8 gap-2 w-full md:justify-between">
            <DashboardCard
              href="assigned-leads"
              title={"Total"}
              desc="of the day!"
              progress={totalLeadsCount.total}
            />
            <DashboardCard
              href="attended-leads"
              title={"Done"}
              desc="of the day!"
              progress={totalLeadsCount.done}
              textColor="text-green-500"
            />
            <DashboardCard
              href="pending-leads"
              title={"Pending"}
              desc="of the day!"
              progress={totalLeadsCount.pending}
              textColor="text-red-500"
            />
          </div>
          <div className="flex w-full">
            <DashboardGraph data={graphData} type="manager" />
          </div>
          <div className="flex w-full">
            {managerData?.length > 0 && (
              <CompactEmployeeStats
                title="Manager"
                desc="List of all manager."
                data={managerData}
              />
            )}
          </div>
          <div className="flex w-full">
            {telecallerData?.length > 0 && (
              <CompactEmployeeStats
                title="Telecallers"
                desc="List of all telecallers with pending tasks."
                data={telecallerData}
              />
            )}
          </div>
          <div className="flex w-full">
            {engineerData?.length > 0 && (
              <CompactEmployeeStats
                title="Engineers"
                desc="List of all engineer with pending tasks."
                data={engineerData}
              />
            )}
          </div>
          <div className="flex w-full">
            {designerData?.length > 0 && (
              <CompactEmployeeStats
                title="Designers"
                desc="List of all designer with pending tasks."
                data={designerData}
              />
            )}
          </div>
          <div className="flex w-full">
            {technicianData?.length > 0 && (
              <CompactEmployeeStats
                title="Technician"
                desc="List of all technicians with pending tasks."
                data={technicianData}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
