"use client";
import { toast } from "sonner";
import useSWR from "swr";
import { Icons } from "../icons";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export default function PendingLeadsTableEmployee({
  param,
}: {
  param: string;
}) {
  const {
    data: empData,
    isLoading: empDataLoading,
    error: empDataError,
  } = useSWR("/api/getEmpDetailsByEmpNo?empNo=" + param, fetcher);

  const pendingLeadUrl =
    "/api/getPendingLeads?empId=" +
    empData?.data?.id +
    "&userType=" +
    empData?.data?.userType;

  const { data, error, isLoading } = useSWR(
    empData?.data?.id ? pendingLeadUrl : null,
    fetcher
  );

  if (error) {
    toast.error("failed to fetch attended leads!!");
    return;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        {<Icons.spinner className="animate-spin" />}
      </div>
    );
  }

  return (
    <DataTable
      columns={assignedLeadTableCol}
      data={data?.leadData || []}
      caption={`Pending leads of the day of ${empData?.data?.username}`}
    />
  );
}
