import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to fetch Managers! 👮🏾");

    const type = "manager";

    const check = await db.user.findUnique({
      where: {
        email: user?.user.email!!,
      },
    });

    if (!check) {
      return NextResponse.json(
        { user: null, message: "You dont't have access exists" },
        { status: 409 }
      );
    }

    const existinguser = await db.user.findMany({
      where: {
        userType: type,
      },
    });

    if (!existinguser) {
      return NextResponse.json(
        { user: null, message: "Managers didn't exists" },
        { status: 409 }
      );
    }

    const managers = await db.user.findMany({
      where: {
        userType: type,
        NOT: {
          password: "1234",
        },
      },
      select: {
        username: true,
        email: true,
        contact: true,
        userType: true,
        address: true,
        altContact: true,
        city: true,
        govtID: true,
        empNo: true,
      },
    });

    return NextResponse.json(
      { data: managers, message: "Managers Fetched Successfully " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
