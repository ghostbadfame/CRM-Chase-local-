import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { getServerSession } from "next-auth";
import { LeadDetailsSchema } from "@/types/types.td";

export async function PATCH(req: Request) {
  try {
    // Convert undefined fields to null
    const body = await req.json();
    const {
      clientStatus,
      priority,
      followupDate,
      status,
      siteStage,
      altContact,
      assignTo,
      contact,
      fullName,
      city,
      address,
      actualSource,
      salesPerson,
      engineerTask,
      technicianTask,
      afterSaleService,
    } = LeadDetailsSchema.parse(body);

    const user = await getServerSession();
    if (!user) {
      return NextResponse.json({ message: "authentication required!!" });
    }
    console.log(user?.user.email + " is trying to update leads! 👮🏾");

    const { searchParams } = new URL(req.url);
    const leadNo = searchParams.get("leadNo");

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
        { user: null, message: "Lead with this contact didn't exists" },
        { status: 409 }
      );
    }
    const previousId = existinglead.employee_id!!;
    const dateString = new Date();
    const newDate = dateString.toISOString();

    const user_id = await db.user.findUnique({
      where: {
        email: user?.user.email!!,
      },
      select: {
        id: true,
      },
    });

    const employee = await db.user.findUnique({
      where: {
        id: user_id?.id!!,
      },
      select: {
        empNo: true,
        username: true,
      },
    });

    //Fetch empId and empNo of user

    const check = await db.lead.findUnique({
      where: {
        leadNo: leadNo!!,
      },
      select: {
        assignTo: true,
        followupDate: true,
      },
    });
    let convertedDate1;
    let convertedDate2;
    const flw = check?.followupDate; // Assuming followupDate is a string
    if (flw) {
      const date = new Date(flw);
      date.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
      convertedDate1 = date.toISOString(); // Convert back to string format
      console.log(convertedDate1); // Output: 2024-03-12T00:00:00.000Z
    } else {
      console.log("followupDate is null or undefined");
    }

    const flw2 = followupDate; // Assuming followupDate is a string
    if (flw2) {
      const date = new Date(flw2);
      date.setUTCHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
      convertedDate2 = date.toISOString(); // Convert back to string format
      console.log(convertedDate2); // Output: 2024-03-12T00:00:00.000Z
    } else {
      console.log("followupDate is null or undefined");
    }

    console.log(check?.assignTo);

    let flag: boolean = true;
    let flag2: boolean = true;

    if (assignTo == check?.assignTo) {
      flag = false;
    }
    if (flw == flw2) {
      flag2 = false;
    }
    console.log(flag);
    console.log(flag2);

    if (flag2 && flag) {
      console.log("followupDate && assignTo");

      const emp = await db.user.findUnique({
        where: {
          empNo: assignTo!!,
        },
        select: {
          userType: true,
          id: true,
          username: true,
        },
      });

      const remarkAdded = await db.remarks.create({
        data: {
          remark: `Status-${status} by ${employee?.username!!} assigned to ${emp?.username!!}`,
          empNo: employee?.empNo!!,
          leadNO: leadNo!!,
          empName: employee?.username!!,
          clientStatus: clientStatus!!,
          siteStage: siteStage!!,
          followUpDate: followupDate,
        },
      });

      const newLead = await db.lead.update({
        where: {
          leadNo: leadNo!!,
        },
        data: {
          updatedAt: newDate!!,
          clientStatus,
          priority,
          status,
          followupDate,
          siteStage: siteStage!!,
          altContact,
          contact:contact!!,
          fullName: fullName!!,
          city: city!!,
          address: address!!,
          actualSource: actualSource!!,
          assignTo,
          employee_id: emp?.id!!,
          previous_id: previousId,
          assignToDate: newDate!!,
          salesPerson: salesPerson!!,
          engineerTask,
          technicianTask,
          afterSaleService,
        },
      });

      return NextResponse.json(
        {
          new: newLead,
          remarkAdded,
          message: "Lead created successfully with assignTo and followUpDate",
        },
        { status: 201 }
      );
    } else if (flag) {
      console.log("assignTo");

      const employee = await db.user.findUnique({
        where: {
          id: user_id?.id!!,
        },
        select: {
          empNo: true,
          username: true,
        },
      });

      const emp = await db.user.findUnique({
        where: {
          empNo: assignTo!!,
        },
        select: {
          userType: true,
          id: true,
          username: true,
        },
      });

      const remarkAdded = await db.remarks.create({
        data: {
          remark: `Status-${status} by ${employee?.username!!} assigned to ${emp?.username!!}`,
          empNo: employee?.empNo!!,
          leadNO: leadNo!!,
          empName: employee?.username!!,
          clientStatus: clientStatus!!,
          siteStage: siteStage!!,
          followUpDate: followupDate,
        },
      });

      const newLead = await db.lead.update({
        where: {
          leadNo: leadNo!!,
        },
        data: {
          updatedAt: newDate!!,
          clientStatus,
          priority,
          status,
          siteStage: siteStage!!,
          altContact,
          assignTo,
          contact:contact!!,
          fullName: fullName!!,
          city: city!!,
          address: address!!,
          actualSource: actualSource!!,
          employee_id: emp?.id!!,
          previous_id: previousId,
          lastDate: newDate!!, // Use the current date
          salesPerson: salesPerson!!,
          assignToDate: newDate!!,
          engineerTask,
          technicianTask,
          afterSaleService,
        },
      });

      return NextResponse.json(
        {
          new: newLead,
          remarkAdded,
          message: "Lead updated successfully with assignTo",
        },
        { status: 201 }
      );
    } else if (flag2) {
      console.log("followupDate");

      const remarkAdded = await db.remarks.create({
        data: {
          remark: `Status-${status} by ${employee?.username!!}`,
          empNo: employee?.empNo!!,
          leadNO: leadNo!!,
          empName: employee?.username!!,
          clientStatus: clientStatus!!,
          siteStage: siteStage!!,
          followUpDate: followupDate,
        },
      });
      const newLead = await db.lead.update({
        where: {
          leadNo: leadNo!!,
        },
        data: {
          updatedAt: newDate!!,
          clientStatus,
          priority,
          followupDate,
          status,
          siteStage: siteStage!!,
          altContact,
          assignTo,
          contact:contact!!,
          fullName: fullName!!,
          city: city!!,
          address: address!!,
          actualSource: actualSource!!,
          previous_id: previousId,
          lastDate: newDate!!,
          salesPerson: salesPerson!!,
          engineerTask,
          technicianTask,
          afterSaleService,
        },
      });

      return NextResponse.json(
        {
          new: newLead,
          remarkAdded,
          message: "Lead updated successfully with followupDate",
        },
        { status: 201 }
      );
    } else {
      console.log("aa");

      const remarkAdded = await db.remarks.create({
        data: {
          remark: `Status-${status} by ${employee?.username!!}`,
          empNo: employee?.empNo!!,
          leadNO: leadNo!!,
          empName: employee?.username!!,
          clientStatus: clientStatus!!,
          siteStage: siteStage!!,
          followUpDate: followupDate,
        },
      });

      const newLead = await db.lead.update({
        where: {
          leadNo: leadNo!!,
        },
        data: {
          updatedAt: newDate!!,
          clientStatus,
          priority,
          status,
          siteStage: siteStage!!,
          altContact,
          fullName: fullName!!,
          city: city!!,
          address: address!!,
          actualSource: actualSource!!,
          assignTo,
          contact:contact!!,
          previous_id: previousId,
          salesPerson: salesPerson!!,
          engineerTask,
          technicianTask,
          afterSaleService,
        },
      });

      return NextResponse.json(
        {
          new: newLead,
          remarkAdded,
          message:
            "Lead created successfully without assignTo and followupDate",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
