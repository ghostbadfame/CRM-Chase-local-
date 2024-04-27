"use client";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import useSWR from "swr";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function AttendedLeadsTable() {
  const { data: session } = useSession();

  const attendedLeadsUrl =
    "/api/getDoneLeads?empId=" +
    session?.user.userId +
    "&userType=" +
    session?.user.userType;

  const { data, error, isLoading } = useSWR(
    session?.user ? attendedLeadsUrl : null,
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
      data={data || []}
      caption="List of attended leads for the day!"
    />
  );
}

export default AttendedLeadsTable;
