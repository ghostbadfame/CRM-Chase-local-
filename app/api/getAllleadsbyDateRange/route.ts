import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user.email;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const upper = searchParams.get("date")!!;
    const dateParts = upper?.split("-")!!;
    const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    const startDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
    );

    // for using lower upper model please undo the comment on line 32,33,34
    // and change the name of "date" on 36 line to "date1" there are 3 dates

    // const lower = searchParams.get("lower")!!;
    // const dateParts1 = lower?.split("-")!!;
    // const date1 = new Date(`${dateParts1[2]}-${dateParts1[1]}-${dateParts1[0]}`);
    const endDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
    );

    console.log(startDate);
    console.log(endDate);

    const leadData = await db.lead.findMany({
      where: {
        NOT: [
          {
            clientStatus: "Lost",
          },
        ],
        OR: [
          {
            followupDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          {
            assignToDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        ],
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
      { leadData, message: "Leads fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
