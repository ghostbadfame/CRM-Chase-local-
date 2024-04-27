"use client";
import useSWR from "swr";
import { DataTable } from "../ui/data-table";
import { assignedLeadTableCol } from "./assignedLeadTableCol";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { channelPartnerTableCol } from "./channelPartnerTableCol";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.channelPartner;
};

function ChannelPartnerTable() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(
    `/api/getAllchannelPartners?empId=${session?.user.userId}&userType=${session?.user.userType}`,
    fetcher
  );

  if (error) {
    toast("⚠️ failed to fetch channel partners!!");
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
      columns={channelPartnerTableCol}
      data={data || []}
      noFilters={true}
      caption="List of all channel Partners!"
    />
  );
}

export default ChannelPartnerTable;
