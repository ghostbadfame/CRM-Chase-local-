import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

interface Lead {
  dimension: string;
  leadNo: string;
}

export async function POST(req: Request) {
  try {
    const { dimension, leadNo } = await req.json();
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to create a dimension! 👮🏾");

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadNo");

    const existinglead = await db.lead.findUnique({
      where: {
        leadNo: leadNo!!,
      },
      select: {
        employee_id: true,
      },
    });

    if (!existinglead) {
      return NextResponse.json(
        { user: null, message: "Lead with this contact doesn't exists" },
        { status: 409 }
      );
    }

    const user_id = await db.user.findUnique({
      where: {
        email: user?.user.email!!,
        //Enter email fetched from cookies
      },
      select: {
        id: true,
      },
    });

    const id = user_id?.id!;

    if (!id) {
      console.log("User id undefined");
    }

    const employee = await db.user.findUnique({
      where: {
        id: user_id?.id!!,
      },
      select: {
        empNo: true,
        username: true,
      },
    });

    const dimensioning = await db.dimensions.create({
      data: {
        dimension,
        empNo: employee?.empNo!!,
        leadNO: leadNo!!,
        empName: employee?.username!!,
      },
    });

    return NextResponse.json(
      { new: dimensioning, message: "dimension created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
