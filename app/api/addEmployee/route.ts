import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { Role } from "@prisma/client";

const userSchema = z.object({
  username: z.string().min(1, "username is required").max(100),
  contact: z.string().length(10, "Contact must contain 10 numbers"),
  altContact: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  city: z.string().min(1, "City is required").max(100),
  address: z.string().min(1, "Address is required").max(100),
  govtID: z.string().length(12, "Government Id is required"),
  reportingManager: z.string().min(1, "reportingManager is required").max(100),
  referenceEmployee: z.string().optional().nullable(),
  userType: z.string().min(1, "Usertype is required").max(100),
  role:z.enum(["BASIC", "ADMIN"])
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      username,
      userType,
      address,
      contact,
      altContact,
      city,
      govtID,
      reportingManager,
      referenceEmployee,
      role
    } = userSchema.parse(body.arg);

    //check email already exists

    const govtIDcheck = await db.user.count({
      where: {
        govtID: govtID!!,
      },
    });

    if (govtIDcheck) {
      return NextResponse.json(
        { message: "User with this govtId already exists" },
        { status: 409 }
      );
    }

    const existingUserbyEmail = await db.user.findUnique({
      where: { contact: contact },
    });
    if (existingUserbyEmail) {
      return NextResponse.json(
        { message: "User with this contact already exists" },
        { status: 409 }
      );
    }

    const count = await db.user.count();
    const incrementCount = count + 1;

    const countId = `EMP${String(incrementCount).padStart(3, "0")}`;
    const newUser = await db.user.create({
      data: {
        empNo: countId,
        username,
        email,
        password: "1234",
        userType,
        address,
        contact,
        altContact,
        city,
        govtID,
        reportingManager,
        referenceEmployee: referenceEmployee,
        role
      },
    });
    if (referenceEmployee) {
      const refUser = await db.user.findFirst({
        where: {
          empNo: referenceEmployee,
        },
        select: {
          id: true,
        },
      });

      const newUser = await db.user.findFirst({
        where: {
          empNo: countId,
        },
        select: {
          id: true,
        },
      });

      const refUpdated = await db.lead.updateMany({
        where: {
          employee_id: refUser?.id,
        },
        data: {
          employee_id: newUser?.id,
          previous_id: refUser?.id,
        },
      });
    }

    return NextResponse.json(
      { new: newUser, message: "User Created Successfully " },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Something went wrong!!" },
        { status: 500 }
      );
    }
  }
}
