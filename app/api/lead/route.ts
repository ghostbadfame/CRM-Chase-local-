import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";

const leadSchema = z.object({
  fullName: z.string().min(1, "Username is required").max(100),
  contact: z.string().length(10, "Contact must have 10 characters"),
  altContact: z.string().optional(),
  address: z.string().min(1, "address is required").max(100),
  city: z.string().min(1, "city is required").max(100),
  siteStage: z.string().min(1, "siteStage is required").max(100),
  actualSource: z.string(),
  salesPerson: z.string(),
  leadSource: z.string().min(1, "leadSource is required").max(100),
  clientStatus: z.string(),
  remark: z.string().min(1, "remark is required").max(100),
});

interface Lead {
  fullName: string;
  contact: string;
  altContact: string;
  address: string;
  city: string;
  leadSource: string;
  actualSource: string;
  siteStage: string;
  salesPerson: string;
  clientStatus: string;
  remark: string;
}

export async function POST(req: Request) {
  try {
    const body: {
      fullName: string;
      contact: string;
      altContact: string;
      address: string;
      city: string;
      leadSource: string;
      actualSource: string;
      siteStage: string;
      salesPerson: string;
      clientStatus: string;
      remark: string;
    } = await req.json();

    const {
      fullName,
      contact,
      altContact,
      address,
      city,
      leadSource,
      actualSource,
      siteStage,
      salesPerson,
      clientStatus,
      remark,
    } = leadSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to create leads! 👮🏾");

    const existinglead = await db.lead.findUnique({
      where: {
        contact: contact,
      },
    });

    if (existinglead) {
      return NextResponse.json(
        { user: null, message: "Lead with this contact already exists" },
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
   
      },
    });

    const id = user_id?.id!;

    if (!id) {
      console.log("User id undefined");
    }

    const count = await db.lead.count();
    const incrementCount = count + 1;

    const countId = `LD${String(incrementCount).padStart(3, "0")}`;

    const newLead = await db.lead.create({
      data: {
        fullName,
        contact,
        altContact: altContact!!,
        address,
        city,
        leadSource,
        actualSource,
        siteStage,
        salesPerson,
        clientStatus,
        employee_id: id,
        leadNo: countId,
        assignTo: user_id?.empNo!!,
      },
    });

    const leadData = await db.lead.findUnique({
      where: {
        contact: contact,
      },
      select: {
        leadNo: true,
        employee_id: true,
      },
    });

    const employee = await db.user.findUnique({
      where: {
        id: leadData?.employee_id!!,
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
        leadNO: leadData?.leadNo!!,
        empName: employee?.username!!,
      },
    });

    return NextResponse.json(
      { new: newLead, message: "lead Created Successfully " },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
