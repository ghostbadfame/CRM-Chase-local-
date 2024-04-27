"use client";
import useSWR from "swr";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function AssignedLeadsTable() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(
    `/api/getAssignedLeads?empId=${session?.user.userId}&userType=${session?.user.userType}`,
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
      caption="List of assigned leads for the day!"
    />
  );
}

export default AssignedLeadsTable;
