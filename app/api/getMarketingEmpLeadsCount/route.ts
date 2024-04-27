import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to get Marketing Employee leads count 👮🏾");

    const { searchParams } = new URL(request.url);
    const empNo = searchParams.get("empNo");

    if (!empNo) {
      throw new Error("Employee Number required!");
    }
    const name = await db.user.findUnique({
      where: {
        empNo: empNo,
        userType: "marketing",
      },
      select: {
        username: true,
      },
    });


    const leads = await db.lead.count({
      where: {
        actualSource: name?.username,
      },

    })

    

    return NextResponse.json(
      { leads: leads, message: "Leads count fetched Successfully  " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

