"use client";
import EmployeeTable from "@/components/data-table/employeeTable";
import MarketingEmployeeTable from "@/components/data-table/marketingEmpTable";
import Loading from "@/components/loading";
import React from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data.data;
};

export default function Marketing() {
  const { data, isLoading, error } = useSWR("/api/getMarketingEmp", fetcher);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    toast.error("failed to fetch marketing employees!!");
  }

  return (
    <MarketingEmployeeTable
      data={data || []}
      desc={"Data of marketing team."}
    />
  );
}
