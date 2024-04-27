import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getCurrentDate(): string {
  const currentDate: Date = new Date();

  const year: number = currentDate.getFullYear();
  const month: number = currentDate.getMonth() + 1; // Month is zero-indexed
  const day: number = currentDate.getDate();

  // Pad single digit months/days with a leading zero
  const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
  const formattedDay: string = day < 10 ? `0${day}` : `${day}`;

  // Concatenate year, month, and day with dashes
  const formattedDate: string = `${year}-${formattedMonth}-${formattedDay}`;

  return formattedDate;
}

function extractDateOnly(dateTimeString: string): string {
  const dateTimeParts: string[] = dateTimeString.split(" ");
  const datePart: string = dateTimeParts[0];
  return datePart;
}

function findPreviousSundayAndNextSaturday(): {
  previousSunday: Date;
  nextSaturday: Date;
} {
  const currentDate: Date = new Date();

  // Find previous Sunday
  const previousSunday: Date = new Date(currentDate);
  previousSunday.setHours(0, 0, 0, 0);
  previousSunday.setDate(currentDate.getDate() - currentDate.getDay());

  // Find next Saturday
  const nextSaturday: Date = new Date(previousSunday);
  nextSaturday.setDate(previousSunday.getDate() + 6);

  return { previousSunday, nextSaturday };
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions); //it works on passing headers in fetch
    const email = session?.user.email;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Authentication required!" },
        { status: 200 }
      );
    }

    // const date = extractDateOnly(currentTime);
    const { searchParams } = new URL(request.url);
    const employeeNo = searchParams.get("empNo");

    const emp = await db.user.findUnique({
      where: {
        empNo: employeeNo!!,
      },
      select: {
        id: true,
      },
    });

    const employeeId = emp?.id!!;

    console.log(`${employeeNo} is fetching leads of week!`);

    if (employeeId) {
      const { previousSunday, nextSaturday } =
        findPreviousSundayAndNextSaturday();
      const last = previousSunday;
      const next = nextSaturday;

      console.log(last);
      const leads = await db.lead.findMany({
        where: {
          NOT: [
            {
              clientStatus: "Lost",
            },
          ],
          OR: [
            {
              assignToDate: {
                gte: last,
                lte: next,
              },
            },
            {
              followupDate: {
                gte: last,
                lte: next,
              },
            },
          ],

          employee_id: employeeId!!,
        },
        select: {
          fullName: true,
          leadNo: true,
          contact: true,
          clientStatus: true,
          siteStage: true,
          priority: true,
          altContact: true,
          address: true,
          city: true,
          leadSource: true,
          actualSource: true,
          salesPerson: true,
          followupDate: true,
          assignTo: true,
          updatedAt: true,
          createdAt: true,
          lead_id: true,
          status: true,
          lastDate: true,
          afterSaleService: true,
          engineerTask: true,
          technicianTask: true,
        },
      });

      return NextResponse.json(
        { leads, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    } else {
      const { previousSunday, nextSaturday } =
        findPreviousSundayAndNextSaturday();
      const last = previousSunday;
      const next = nextSaturday;

      console.log(last);
      const leadA = await db.lead.findMany({
        where: {
          NOT: [
            {
              clientStatus: "Lost",
            },
          ],
          OR: [
            {
              assignToDate: {
                gte: last,
                lte: next,
              },
            },
            {
              followupDate: {
                gte: last,
                lte: next,
              },
            },
          ],
        },
        select: {
          fullName: true,
          leadNo: true,
          contact: true,
          clientStatus: true,
          siteStage: true,
          priority: true,
          altContact: true,
          address: true,
          city: true,
          leadSource: true,
          actualSource: true,
          salesPerson: true,
          followupDate: true,
          assignTo: true,
          updatedAt: true,
          createdAt: true,
          lead_id: true,
          status: true,
          lastDate: true,
          engineerTask: true,
          technicianTask: true,
          afterSaleService: true,
        },
      });

      const leads = { ...leadA };
      return NextResponse.json(
        { leads, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
