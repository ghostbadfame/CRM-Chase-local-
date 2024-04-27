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
  return data.data;
};

function MarketingLeadsTable() {
  const { slug } = useParams();
  const { data, isLoading, error } = useSWR(
    "/api/getMarketingempLeads?empNo=" + slug,
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

export default MarketingLeadsTable;
