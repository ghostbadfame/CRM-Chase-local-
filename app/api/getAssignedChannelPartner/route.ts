import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { endOfDay, startOfDay } from "date-fns";

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

    const channelPartner = await db.channelPartner.findMany({
      where: {
        followupDate: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
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
