import { db } from "@/lib/db";
import { startOfDay as SOTD, endOfDay as EOTD } from "date-fns";
import { start } from "repl";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET(request: Request) {
  const today = new Date();

  const startOfDay = SOTD(today);
  const endOfDay = EOTD(today);
  const currentDate = new Date();
  const nextDate = new Date();
  nextDate.setDate(currentDate.getDate() + 1);
  nextDate.setUTCHours(0, 0, 0, 0);
  try {
    const newStatus = await db.lead.updateMany({
      where: {
        status: "done",
        NOT: [
          {
            clientStatus: "Lost",
          },
        ],
        // Assuming 'followupDate' is meant to be less than or equal to 'newDate'
        followupDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      data: {
        // Updating 'followupDate' to the new date value
        status: "pending",
        assignToDate:nextDate
      },
    });

    const newData = await db.lead.updateMany({
      where: {
        status: "pending",
        NOT: [
          {
            clientStatus: "Lost",
          },
        ],
        // Assuming 'followupDate' is meant to be less than or equal to 'newDate'
        followupDate: {
          lt: startOfDay,
        },
      },
      data: {
        // Updating 'followupDate' to the new date value
        followupDate: nextDate,
        assignToDate: nextDate
      },
    });

    return new Response("🟢 Moved date followupdate and changed status", {
      status: 200,
    });
  } catch (error) {
    return new Response("🔴 Cron job failed!");
  }
}
