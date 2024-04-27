import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { endOfDay, startOfDay } from "date-fns";

// Interface for date range object
interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Function to get start and end of day for a given date
function getStartAndendDate(date: Date): DateRange {

  return { startDate:startOfDay(date) , endDate: endOfDay(date) };
}

// Get today's date in the desired timezone (Asia/Kolkata)


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

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("empId");



    const dateObjects: DateRange[] = [];

    for (let i: number = 0; i < 7; i++) {
      const currentDate: Date = new Date();
      currentDate.setDate(currentDate.getDate() - i);
      const { startDate, endDate }: DateRange = getStartAndendDate(currentDate);
      dateObjects.push({ startDate, endDate });
    }

    if (employeeId) {
      const result: { date: string; done: number; pending: number }[] = [];

      for (const dateRange of dateObjects) {
        const { startDate, endDate } = dateRange;

        const doneLeadCount = await db.lead.count({
          where: {
            NOT:[
              {
                clientStatus:"Lost"
              }
            ],
            OR: [
              {
                followupDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
                
              },
              {
                assignToDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
            ],
            employee_id: employeeId!!,
            status: "done",
          },
        });

        const pendingLeadCount = await db.lead.count({
          where: {
            NOT:[
              {
                clientStatus:"Lost"
              }
            ],
            OR: [
              {
                followupDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
              {
                assignToDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
            ],
            employee_id: employeeId!!,
            status: "pending",
          },
        });

        const done = doneLeadCount;
        const pending = pendingLeadCount;
        const day: string =
          (startDate.getDate() < 10 ? "0" : "") + startDate.getDate();
        const month: string =
          (startDate.getMonth() + 1 < 10 ? "0" : "") +
          (startDate.getMonth() + 1);
        const year: number = startDate.getFullYear();
        const date = `${day}-${month}-${year}`;
        result.push({ date, done, pending });
      }
      result.reverse();

      return NextResponse.json(
        { result, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    } else {
      const result: { date: string; done: number; pending: number }[] = [];

      for (const dateRange of dateObjects) {
        const { startDate, endDate } = dateRange;

        const doneLeadCount = await db.lead.count({
          where: {
            NOT:[
              {
                clientStatus:"Lost"
              }
            ],
            OR: [
              {
                followupDate: {
                  gte: startDate,
                  lte:endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
              {
                assignToDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
            ],

            status: "done",
          },
        });

        const pendingLeadCount = await db.lead.count({
          where: {
            NOT:[
              {
                clientStatus:"Lost"
              }
            ],
            OR: [
              {
                followupDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
              {
                assignToDate: {
                  gte: startDate,
                  lte: endDate,
                  not: {
                    equals: new Date(new Date().setHours(18, 30, 0, 0)),
                  },
                },
              },
            ],

            status: "pending",
          },
        });
        const done = doneLeadCount;
        const pending = pendingLeadCount;
        const day: string =
          (startDate.getDate() < 10 ? "0" : "") + startDate.getDate();
        const month: string =
          (startDate.getMonth() + 1 < 10 ? "0" : "") +
          (startDate.getMonth() + 1);
        const year: number = startDate.getFullYear();
        const date = `${day}-${month}-${year}`;
        result.push({ date, done, pending });
      }
      result.reverse();

      return NextResponse.json(
        { result, message: "Date Fetched Successfully " },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
