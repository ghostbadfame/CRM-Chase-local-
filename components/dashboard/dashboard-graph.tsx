"use client";
import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import resolveConfig from "tailwindcss/resolveConfig";
import myConfig from "../../tailwind.config";
import { usePathname, useRouter } from "next/navigation";

const tailwindConfig = resolveConfig(myConfig);

export default function DashboardGraph({
  data,
  type,
}: {
  data: { date: string; done: number; pending: number }[];
  type: "manager" | "employee";
}) {
  const router = useRouter();
  const path = usePathname();
  const employeeId = path.split("/").pop();

  function handleClick(e: any) {
    if (!e.activePayload) return;
    const data = e?.activePayload[0].payload;
    if (data.done == 0 && data.pending == 0) return;
    if (type == "manager") {
      router.push("/manager/leads?" + `date=${data.date}`);
    } else {
      router.push(
        path + "/employee-leads?" + `date=${data.date}&employee=${employeeId}`
      );
    }
  }

  return (
    <div className="border rounded-md p-2 grid gap-2 flex-1">
      <h1 className="px-2">Leads attended this week</h1>
      <div className="border rounded-md py-2 w-full text-xs">
        <ResponsiveContainer width={"100%"} height={320}>
          <BarChart data={data} onClick={handleClick}>
            <XAxis dataKey="date" interval={0} tick={CustomTick} height={60} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="done"
              fill={tailwindConfig.theme.colors.green[500]}
              radius={20}
            />
            <Bar
              dataKey="pending"
              fill={tailwindConfig.theme.colors.red[500]}
              radius={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTick({ x, y, stroke, payload }: any) {
  return (
    <g transform={`translate(${x + x / 4.5},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        className="rotate-[-35deg] text-[10px] md:text-base md:rotate-0 "
      >
        {payload.value}
      </text>
    </g>
  );
}
