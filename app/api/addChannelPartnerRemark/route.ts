import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

const remarkSchema = z.object({
  remark: z.string().min(1, "remark is required"),
  channelPartnerNo: z.string().min(1, "architectNo is required").optional(),
});

type Lead = z.infer<typeof remarkSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { remark, channelPartnerNo } = remarkSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to create a remark! 👮🏾");

    const existingArchitect = await db.channelPartner.findUnique({
      where: {
        channelPartnerNo: channelPartnerNo!!,
      },
      select: {
        channelPartnerId: true,
        followupDate: true,
        channelPartnerNo: true,
      },
    });

    if (!existingArchitect) {
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
        empNo: true,
        username: true,
      },
    });

    const id = user_id?.id!;

    if (!id) {
      console.log("User id undefined");
    }

    const remarking = await db.channelPartnerRemark.create({
      data: {
        remark,
        channelPartnerNo: existingArchitect?.channelPartnerNo!!,
        channelPartnerID: existingArchitect?.channelPartnerId!!,
        empName: user_id?.username!!,
        empNo: user_id?.empNo!!,
        followUpDate: existingArchitect.followupDate,
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
