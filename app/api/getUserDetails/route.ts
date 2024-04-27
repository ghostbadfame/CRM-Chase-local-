import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch
    const email = session?.user.email;
    console.log("user details called!");

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 201 }
      );
    }

    let userData = await db.user.findUnique({
      where: {
        email: email!!,
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
    if (!userData) {
      return NextResponse.json(
        { message: "User data not found!" },
        { status: 404 }
      );
    }

    const nameRef = await db.user.findUnique({
      where: {
        empNo: userData?.reportingManager!!,
      },
      select: {
        username: true,
      },
    });
    const reportingManager = nameRef?.username;

    userData.reportingManager = reportingManager!!;

    return NextResponse.json(
      userData,

      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
