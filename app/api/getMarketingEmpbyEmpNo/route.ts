import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to get Marketing Employee 👮🏾");

    const { searchParams } = new URL(request.url);
    const empNo = searchParams.get("empNo");

    if (!empNo) {
      throw new Error("Employee Number required!");
    }

    const marketing_data = await db.user.findUnique({
      where: {
        userType: "marketing",
        empNo: empNo,
        NOT:[
          {password:"1234"}]
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
      },
    });

    return NextResponse.json(
      {
        data: marketing_data,
        message: "channelPartner fetched Successfully ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
