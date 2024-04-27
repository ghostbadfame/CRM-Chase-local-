import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(
      user?.user.email + " is trying to get Channel Partner Data! 👮🏾"
    );

    const { searchParams } = new URL(request.url);
    const channelPartnerNo = searchParams.get("channelPartnerNo");

    if (!channelPartnerNo) {
      throw new Error("Channel Partner number required!");
    }

    const channelPartner = await db.channelPartner.findUnique({
      where: {
        channelPartnerNo: channelPartnerNo,
      },
      select: {
        fullName: true,
        channelPartnerNo: true,
        channelPartnerId: true,
        createdAt: true,
        followupDate: true,
        updatedAt: true,
        lastDate: true,
        address: true,
        city: true,
        contact: true,
        altContact: true,
        birthday: true,
        weddingAnniversary: true,
        userType: true,
        firm: true,
      },
    });

    return NextResponse.json(
      {
        channelPartner: channelPartner,
        message: "channelPartner fetched Successfully ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
