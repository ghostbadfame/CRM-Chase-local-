import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to get all Channel Partnerss! 👮🏾");

    const channelPartner = await db.channelPartner.findMany({
      select:{
        fullName       :true,                                                     
        channelPartnerNo  :true,
        channelPartnerId  :true,
        createdAt    :true,
        followupDate:true,
        updatedAt  :true,
        lastDate    :true,
        address :true,
        city:true,
        contact    :true,
        altContact  :true,
        birthday:true,
        weddingAnniversary:true,
        userType:true,

      },
    });

    return NextResponse.json(
      { channelPartner: channelPartner, message: "channelPartner fetched Successfully " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
