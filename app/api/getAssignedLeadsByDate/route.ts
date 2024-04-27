import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { endOfDay, startOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch
    const email = session?.user.email;
    console.log("session", session);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userDate = searchParams.get("date");
    const empNo = searchParams.get("empNo");

    const emp = await db.user.findUnique({
      where: {
        empNo: empNo!!,
      },
      select: {
        id: true,
      },
    });

    const leadData = await db.lead.findMany({
      where: {
        // NOT:[
        //   {
        //     clientStatus:"Lost"
        //   }
        // ],
        OR: [
          {
            followupDate: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date()),
            },
          },
          {
            assignToDate: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date()),
            },
          },
        ],
        employee_id: emp?.id!!,
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
        lastDate: true,
        actualSource: true,
        salesPerson: true,
        followupDate: true,
        assignTo: true,
        updatedAt: true,
        createdAt: true,
        lead_id: true,
        status: true,
      },
    });

    return NextResponse.json(
      { leadData, message: "Date Fetched Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
