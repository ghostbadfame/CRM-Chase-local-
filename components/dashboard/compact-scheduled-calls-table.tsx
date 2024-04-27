"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import useSWR from "swr";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.leadData;
};

function CompactScheduledCallsTable() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR(
    `/api/getAssignedLeads?empId=${session?.user.userId}&userType=${session?.user.userType}`,
    fetcher
  );

  if (error) {
    toast.error("failed to fetch scheduled calls!!");
  }

  return (
    <div className="border rounded-md p-2 w-full grid gap-2">
      <h1 className="px-2">Scheduled calls</h1>
      <div className="border rounded-md py-2 w-full">
        <Table>
          <TableCaption className="justify-center px-2">
            {isLoading && (
              <div className="flex-1 content-center">
                <Icons.spinner className="animate-spin" />
              </div>
            )}
          </TableCaption>
          <TableCaption className="text-left px-2">
            {data?.length == 0
              ? "No calls for today."
              : "List of scheduled calls for today."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Lead No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Client Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data?.map((value: any) => {
                <TableRow key={value.leadNo}>
                  <TableCell className="font-medium">{value.leadNo}</TableCell>
                  <TableCell>{value.fullName}</TableCell>
                  <TableCell>{value.clientStatus}</TableCell>
                </TableRow>;
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CompactScheduledCallsTable;
