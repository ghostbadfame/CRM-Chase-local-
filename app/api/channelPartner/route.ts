import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";
import {
  NewChannelPartnerFormData,
  NewChannelPartnerSchema,
} from "@/types/types.td";

export async function POST(req: Request) {
  try {
    const body: NewChannelPartnerFormData = await req.json();

    const {
      fullName,
      contact,
      altContact,
      address,
      city,
      remark,
      userType,
      weddingAnniversary,
      firm,
      birthday,
    } = NewChannelPartnerSchema.parse(body);

    const user = await getServerSession();
    // if (!user) {
    //   return NextResponse.json({ message: "authentication required!!" });
    // }
    // console.log(user?.user.email + " is trying to create channelPartner! 👮🏾");

    const existingchannelPartner = await db.channelPartner.findUnique({
      where: {
        contact: contact,
      },
    });

    if (existingchannelPartner) {
      return NextResponse.json(
        {
          user: null,
          message: "channelPartner with this contact already exists",
        },
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
        empNo: true,
        username: true,
      },
    });

    const id = user_id?.id!;

    if (!id) {
      console.log("User id undefined");
    }

    const count = await db.channelPartner.count();
    const incrementCount = count + 1;

    const countId = `CP${String(incrementCount).padStart(3, "0")}`;

    const newchannelPartner = await db.channelPartner.create({
      data: {
        fullName,
        contact,
        altContact: altContact!!,
        address,
        city,
        userType: userType!!,
        channelPartnerNo: countId,
        weddingAnniversary,
        firm,
        birthday,
      },
    });

    const channelPartnerData = await db.channelPartner.findUnique({
      where: {
        contact: contact,
      },
      select: {
        channelPartnerNo: true,
        channelPartnerId: true,
        followupDate: true,
      },
    });

    const remarking = await db.channelPartnerRemark.create({
      data: {
        remark,
        channelPartnerNo: channelPartnerData?.channelPartnerNo!!,
        channelPartnerID: channelPartnerData?.channelPartnerId!!,
        empName: user_id?.username!!,
        empNo: user_id?.empNo!!,
        followUpDate: channelPartnerData?.followupDate,
      },
    });

    return NextResponse.json(
      {
        new: newchannelPartner,
        message: "channelPartner Created Successfully ",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
