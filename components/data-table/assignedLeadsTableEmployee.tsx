"use client";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import { Icons } from "../icons";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function AssignedLeadsTableEmp() {
  const params = useSearchParams();
  const { data, error, isLoading } = useSWR(
    "/api/getAssignedLeadsByDate?date=" +
      params.get("date") +
      "&empNo=" +
      params.get("employee"),
    fetcher
  );

  if (error) {
    toast.error("failed to fetch assigned leads!!");
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
      data={data || []}
      caption={
        params.get("day")
          ? `List of assigned leads for ${params.get("day")}!`
          : "List of assigned leads"
      }
    />
  );
}

export default AssignedLeadsTableEmp;
