"use client";
import PendingLeadsTableEmployee from "@/components/data-table/pendingLeadsTableEmployee";
import { useParams } from "next/navigation";
import React from "react";

export default function EmployeePendingLeads() {
  const { slug } = useParams();
  if (!slug) return;
  return <PendingLeadsTableEmployee param={slug as string} />;
}
