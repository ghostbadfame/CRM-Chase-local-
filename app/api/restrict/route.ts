import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

const userSchema = z.object({
  restricted: z
    .boolean()
});

type User = z.infer<typeof userSchema>;
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {restricted } = userSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to restrict employee! 👮🏾");

    const { searchParams } = new URL(req.url);
    const empNo = searchParams.get("empNo");

    const existinglead = await db.user.findUnique({
      where: {
        empNo: empNo!!,
      },
    });

    if (!existinglead) {
      return NextResponse.json(
        { user: null, message: "User with this empNo didn't exists" },
        { status: 409 }
      );
    }

    const userRestrict = await db.user.update({
      where: {
        empNo: empNo!!,
      },
      data: {
        restricted
      },
    });

    return NextResponse.json(
      { data: userRestrict, message: "User Restricted Successfully " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
