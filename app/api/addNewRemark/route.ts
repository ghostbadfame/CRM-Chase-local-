import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

const remarkSchema = z.object({
  remark: z.string().min(1, "remark is required"),
  leadNo: z.string().min(1, "leadNo is required").optional(),
});

type Lead = z.infer<typeof remarkSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { remark, leadNo } = remarkSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to create a remark! 👮🏾");

    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadNo");

    const existinglead = await db.lead.findUnique({
      where: {
        leadNo: leadNo!!,
      },
      select: {
        employee_id: true,
        clientStatus: true,
        siteStage: true,
        followupDate: true,
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
      },
      select: {
        id: true,
        empNo:true
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

    const remarking = await db.remarks.create({
      data: {
        remark,
        empNo: employee?.empNo!!,
        leadNO: leadNo!!,
        empName: employee?.username!!,
        clientStatus: existinglead?.clientStatus,
        siteStage: existinglead?.siteStage,
        followUpDate: existinglead?.followupDate,
      },
    });

    return NextResponse.json(
      { new: remarking, message: "remark created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
