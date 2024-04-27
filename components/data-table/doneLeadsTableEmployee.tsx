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

export default function DoneLeadsTableEmployee({ param }: { param: string }) {
  const {
    data: empData,
    isLoading: empDataLoading,
    error: empDataError,
  } = useSWR("/api/getEmpDetailsByEmpNo?empNo=" + param, fetcher);

  const attendedLeadsUrl =
    "/api/getDoneLeads?empId=" +
    empData?.data?.id +
    "&userType=" +
    empData?.data?.userType;

  const { data, error, isLoading } = useSWR(
    empData?.data?.id ? attendedLeadsUrl : null,
    fetcher
  );

  if (error) {
    toast.error("failed to fetch attended leads!!");
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
      caption={`Done leads for the day by ${empData?.data?.username}`}
    />
  );
}
