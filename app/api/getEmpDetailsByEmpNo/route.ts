import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import NextAuth from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const empNo = searchParams.get("empNo");

    if (!empNo) {
      throw new Error("employee number required!");
    }

    let user = await db.user.findUnique({
      where: {
        empNo: empNo!!,
        NOT: [{ password: "1234" }],
      },
      select: {
        username: true,
        reportingManager: true,
        id: true,
        empNo: true,
        userType: true,
        email: true,
        contact: true,
        address: true,
        restricted:true
      },
    });

    if (user?.reportingManager) {
      const nameRef = await db.user.findUnique({
        where: {
          empNo: user?.reportingManager!!,
        },
        select: {
          username: true,
        },
      });
      const reportingManager = nameRef?.username;

      user.reportingManager = reportingManager!!;
    }

    return NextResponse.json(
      { data: user, message: "data fetched successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
