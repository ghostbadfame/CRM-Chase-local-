import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

const userSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email")
    .optional(),
  contact: z.string().length(10, "contact must have 10 characters").optional(),
  address: z.string().min(1, "address is required").max(100).optional(),
  username: z.string().min(1, "Username is required").max(100).optional(),
  govtID: z.string().min(1, "govtID is required").max(100).optional(),
  reportingManager: z
    .string()
    .min(1, "reportingManager is required")
    .max(100)
    .optional(),
  referenceEmployee: z
    .string()
    .min(1, "referenceEmployee is required")
    .max(100)
    .optional(),
});

type User = z.infer<typeof userSchema>;
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { contact, email, address, username } = userSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to update employee! 👮🏾");

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

    const newLead = await db.user.update({
      where: {
        empNo: empNo!!,
      },
      data: {
        contact,
        email,
        address,
        username,
      },
    });

    return NextResponse.json(
      { data: newLead, message: "User Updated Successfully " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
