"use client";
import DoneLeadsTableEmployee from "@/components/data-table/doneLeadsTableEmployee";
import { useParams } from "next/navigation";
import React from "react";

export default function EmployeeDoneLeads() {
  const { slug } = useParams();
  if (!slug) return;
  return <DoneLeadsTableEmployee param={slug as string} />;
}
