import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";


export async function GET(request: Request) {
  try {
    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to fetch Channel Partners! 👮🏾");

    const { searchParams } = new URL(request.url);
    const channelPartnerNo = searchParams.get("channelPartnerNo");

    if (!channelPartnerNo) {
      throw new Error("Channel Partner number required!");
    }
    const channelPartner = await db.channelPartner.findUnique({
        where:{
            channelPartnerNo:channelPartnerNo
        },
      select:{
        fullName :true,                                                     
      },
    });

    const leads = await db.lead.findMany({
        where:{
            actualSource:channelPartner?.fullName
        },
        select:{
            clientStatus:true,
            status:true,
            technicianTask:true,
            engineerTask:true
        }
    })
    const leadsCount = await db.lead.count({
            where:
            {
                actualSource: channelPartner?.fullName!!,
            }
    });

    console.log(leadsCount)

    return NextResponse.json(
      { channelLeads: leads, leadsCount: leadsCount, message: "channelPartner fetched Successfully " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
