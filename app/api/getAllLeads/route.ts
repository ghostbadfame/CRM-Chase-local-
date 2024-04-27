import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch

    console.log("fetching all leads!!");

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("empId");
    const userType = searchParams.get("userType");

    if (userType === "manager") {
      const leadData = await db.lead.findMany({
        select: {
          fullName: true,
          leadNo: true,
          contact: true,
          clientStatus: true,
          siteStage: true,
          priority: true,
          altContact: true,
          address: true,
          city: true,
          leadSource: true,
          actualSource: true,
          salesPerson: true,
          followupDate: true,
          assignToDate: true,
          assignTo: true,
          updatedAt: true,
          createdAt: true,
          lead_id: true,
          status: true,
          engineerTask: true,
          technicianTask: true,
          afterSaleService: true,
        },
      });

      return NextResponse.json(
        { leadData, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    } else {
      const leadData = await db.lead.findMany({
        where: {
          employee_id: employeeId!!,
        },
        select: {
          fullName: true,
          leadNo: true,
          contact: true,
          clientStatus: true,
          siteStage: true,
          priority: true,
          altContact: true,
          address: true,
          city: true,
          leadSource: true,
          actualSource: true,
          salesPerson: true,
          followupDate: true,
          assignToDate: true,
          assignTo: true,
          updatedAt: true,
          createdAt: true,
          lead_id: true,
          status: true,
          afterSaleService: true,
          engineerTask: true,
          technicianTask: true,
        },
      });

      return NextResponse.json(
        { leadData, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
