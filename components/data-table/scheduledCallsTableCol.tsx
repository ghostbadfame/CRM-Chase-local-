"use client";

import { ScheduledCalls } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ClientScheduledCalls = ScheduledCalls;

export const scheduledCallsTableCol: ColumnDef<ClientScheduledCalls>[] = [
  {
    accessorKey: "leadNo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lead no.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const leadno: string = row.getValue("leadNo");
      return (
        <Button variant={"link"} className="p-0">
          <Link href={"/lead/" + leadno}>{leadno}</Link>
        </Button>
      );
    },
    filterFn: "fuzzy",
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name: string = row.getValue("fullName");
      const leadno: string = row.getValue("leadNo");
      return (
        <Button variant={"link"} asChild className="p-0">
          <Link href={"/lead/" + leadno}>{name}</Link>
        </Button>
      );
    },
    filterFn: "fuzzy",
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: "fuzzy",
  },
  {
    accessorKey: "clientStatus",
    header: "Client Status",
    filterFn: "fuzzy",
  },
  {
    accessorKey: "remark",
    header: "Remark",
    filterFn: "fuzzy",
  },
  {
    accessorKey: "siteStage",
    header: "Site Stage",
    filterFn: "fuzzy",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: "fuzzy",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(lead.contact)}
            >
              Copy contact
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"/lead/" + lead.leadNo} className="p-0 m-0">
                View Lead
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
