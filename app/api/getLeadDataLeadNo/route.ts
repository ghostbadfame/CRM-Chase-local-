import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    //get lead id from search params in the api query
    const { searchParams } = new URL(request.url);
    const leadNo = searchParams.get("leadNo");

    if (!leadNo)
      return Response.json(
        {
          message: "Lead id is required!!",
        },
        { status: 200 }
      );

    const lead = await db.lead.findUnique({
      where: {
        leadNo: leadNo!!,
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
        lastDate: true,
        engineerTask: true,
        technicianTask: true,
        afterSaleService: true,
      },
    });

    return NextResponse.json(
      { lead, message: "Date Fetched Successfully " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
