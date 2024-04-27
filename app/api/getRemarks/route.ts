import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json(
        { message: "authentication required!!" },
        { status: 500 }
      );
    }
    console.log(user?.user.email + " is trying to fetch remarks! 👮🏾");

    const { searchParams } = new URL(req.url);
    const leadNo = searchParams.get("leadNo");

    const remarksList = await db.remarks.findMany({
      where: {
        leadNO: leadNo!!,
      },
      select: {
        empName: true,
        empNo: true,
        createdAt: true,
        remark: true,
        remarkId: true,
        clientStatus: true,
        siteStage: true,
        followUpDate: true,
      },
    });

    return NextResponse.json(
      { data: remarksList.reverse(), message: "Remarks fetched successfully " },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
