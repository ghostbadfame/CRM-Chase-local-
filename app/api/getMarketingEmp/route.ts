import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to get Marketing Employee 👮🏾");

// Fetch marketing employees
const marketingEmployees = await db.user.findMany({
  where: {
    userType: "marketing",
    NOT: [{ password: "1234" }]
  },
  select: {
    email: true,
    username: true,
    userType: true,
    updatedAt: true,
    address: true,
    altContact: true,
    city: true,
    contact: true,
    empNo: true,
    govtID: true,
    referenceEmployee: true,
    reportingManager: true,
  }
});

// Fetch leads count for each marketing employee separately
const leadsCountPromises = marketingEmployees.map(async employee => {
  const count = await db.lead.count({
    where: {
      leadSource: "Marketing",
      actualSource: employee.username // Assuming username is the employee name
    }
  });
  return { username: employee.username, leadsCount: count };
});

// Wait for all lead count promises to resolve
const leadsCounts = await Promise.all(leadsCountPromises);

// Merge lead counts with marketing employee data
const marketingDataWithLeadsCount = marketingEmployees.map(employee => {
  const employeeLeadCount = leadsCounts.find(count => count.username === employee.username);
  return { ...employee, leadsCount: employeeLeadCount ? employeeLeadCount.leadsCount : 0 };
});

return NextResponse.json(
  {
    data: marketingDataWithLeadsCount,
    message: "Marketing employees fetched successfully",
  },
  { status: 200 }
);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
