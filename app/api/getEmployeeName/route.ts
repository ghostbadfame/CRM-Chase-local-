import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch
    const userType = session?.user.userType;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }
    
    if (userType === "manager") {

      const employeeData = await db.user.findMany({
        where: { 
        NOT:[
         { userType: "manager"},{password:"1234"}]
          
        },
        select: {
          username: true,
          reportingManager: true,
          empNo: true,
          userType: true,
          address: true,
          altContact: true,
          city: true,
          contact: true,
          govtID: true,
          referenceEmployee: true,
        },
      });
      return NextResponse.json(
        {
          data: employeeData,
          message: "Employee Name Fetched Successfully ",
        },
        { status: 200 }
      );
    } else {
      const employeeData = await db.user.findMany({
        where: { 
        NOT:[
         { userType: "manager"},{password:"1234"}]
          
        },
        select: {
          username: true,
          reportingManager: true,
          empNo: true,
          userType: true,
          address: true,
          altContact: true,
          city: true,
          contact: true,
          govtID: true,
          referenceEmployee: true,
        },
      });
      return NextResponse.json(
        {
          data: employeeData,
          message: "Employee Name Fetched Successfully ",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
