"use client";
import useSWR from "swr";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import { useSession } from "next-auth/react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function PendingLeadsTable() {
  const { data: session } = useSession();

  const pendingLeadsUrl =
    "/api/getPendingLeads?empId=" +
    session?.user.userId +
    "&userType=" +
    session?.user.userType;

  const { data, error, isLoading } = useSWR(
    session?.user ? pendingLeadsUrl : null,
    fetcher
  );

  return (
    <DataTable
      columns={assignedLeadTableCol}
      data={data || []}
      caption="List of pending leads of the day!"
    />
  );
}

export default PendingLeadsTable;
