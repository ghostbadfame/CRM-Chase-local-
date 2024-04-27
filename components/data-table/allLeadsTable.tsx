"use client";
import useSWR from "swr";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function AllLeadsTable() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(
    `/api/getAllLeads?empId=${session?.user.userId}&userType=${session?.user.userType}`,
    fetcher
  );

  const params = useSearchParams();
  const date = params.get("date");
  let parsedDate;
  if (date) {
    const dateParts = date?.split("-");
    parsedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
  }

  if (error) {
    toast("⚠️ failed to fetch all leads!!");
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
      date={date ? parsedDate : null}
      dateRange={true}
      caption="List of all leads!"
    />
  );
}

export default AllLeadsTable;
