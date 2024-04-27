import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }

    const { searchParams } = new URL(req.url);
    const empNo = searchParams.get("empNo");
    console.log(
      `${user?.user.email} is trying to reset the password of ${empNo}👮🏾`
    );

    const empId = await db.user.findFirst({
      where: {
        empNo: empNo,
      },
      select: {
        id: true,
      },
    });

    const reset = await db.user.update({
      where: {
        id: empId?.id!!,
      },
      data: {
        password: "1234",
      },
    });

    return NextResponse.json(
      { data: reset, message: "Password Reset Successfully!!" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
