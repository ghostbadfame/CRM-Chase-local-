"use client";
import { DataTable } from "../ui/data-table";
import { scheduledCallsTableCol } from "./scheduledCallsTableCol";
import useSWR from "swr";
import { toast } from "sonner";
import { Icons } from "../icons";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function ScheduledCallsTable() {
  const { data, error, isLoading } = useSWR("/api/getAssignedLeads", fetcher);

  if (error) {
    toast.error("failed to fetch scheduled calls!!");
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
      columns={scheduledCallsTableCol}
      data={data || []}
      caption="Scheduled calls of the day!"
    />
  );
}

export default ScheduledCallsTable;
